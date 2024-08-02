import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import { firestore } from '../Firebase'
import { collection, addDoc, Timestamp, onSnapshot, query, orderBy } from 'firebase/firestore'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Spinner from 'react-bootstrap/Spinner'
import * as constants from '../Constants'
import Item from './Item'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { GoogleGenerativeAI } from '@google/generative-ai'

const Wall = (props) => {
  const [joke, setJoke] = useState('')
  const [texts, setTexts] = useState([])
  const [showAlert, setShowAlert] = useState(false)
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState([])

  const [loading, setLoading] = useState(true)

  const generateJoke = async () => {
    try {
      const apiKey = ''// env.GEMINI_API_KEY
      const genAI = new GoogleGenerativeAI(apiKey)

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash'
      })
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain'
      }
      const chatSession = model.startChat({
        generationConfig, history
      })
      const result = await chatSession.sendMessage(constants.PROMPT)
      setJoke(result.response.text)
      setHistory([
        ...history, {
          role: 'user',
          parts: [
            { text: constants.PROMPT }
          ]
        }
      ])
    } catch (error) {
      console.error('Error prompting Gemini:', error)
      throw error
    }
  }

  const addJoke = async (e) => {
    e.preventDefault()
    try {
      const docReference = await addDoc(collection(firestore, constants.JOKE), {
        joke,
        user: props.user.email,
        time: Timestamp.fromDate(new Date()).toMillis()
      })
      console.log('Document written with ID: ', docReference.id)
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorCode, errorMessage, error)
      setMessage(error.message)
      setShowAlert(true)
    }
  }

  useEffect(() => {
    const reference = collection(firestore, constants.JOKE)
    const q = query(reference, orderBy('time', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const texts = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        texts.push({
          id: doc.id,
          joke: data.joke,
          user: data.user,
          time: data.time
        })
      })
      setTexts(texts)
      setJoke('')
      if (loading) {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [loading])

  return (
    <>
      <Container>
        <Alert variant='danger' onClose={() => setShowAlert(false)} dismissible show={showAlert}>
          <Alert.Heading>OoOps! You got an error!</Alert.Heading>
          <p>{message}</p>
        </Alert>

        <Form onSubmit={addJoke} className='my-3'>
          <Form.Group className='mb-3' controlId='text'>
            <FloatingLabel
              controlId='text'
              label='Enter text or double click and let Gemini do some magic'
            >
              <Form.Control type='text' placeholder='' autoComplete='off' value={joke} required onChange={(e) => setJoke(e.target.value)} onDoubleClick={generateJoke} />
            </FloatingLabel>
          </Form.Group>
        </Form>

      </Container>
      <Container>

        <Row className='justify-content-md-center'>
          <Col md={1} className='justify-content-md-center'>
            <Spinner animation='grow' role='status' hidden={!loading} className='mt-4'>
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
          </Col>
        </Row>

        <Stack gap={3} hidden={loading}>
          {
                        texts.map((element) => (
                          <Item key={element.id} text={element.joke} user={element.user} time={element.time} />
                        ))
                    }
        </Stack>
      </Container>
    </>
  )
}

export default Wall
