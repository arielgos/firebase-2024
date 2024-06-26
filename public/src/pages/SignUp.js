import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../Firebase'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Badge from 'react-bootstrap/Badge'
import InputGroup from 'react-bootstrap/InputGroup'
import Alert from 'react-bootstrap/Alert'

const Signup = () => {
  const navigate = useNavigate()
  const [validated, setValidated] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showAlert, setShowAlert] = useState(false)
  const [message, setMessage] = useState('')

  const onSubmit = async (e) => {
    const form = e.currentTarget
    e.preventDefault()
    if (form.checkValidity()) {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate('/')
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          console.log(errorCode, errorMessage, error)
          setMessage(error.message)
          setShowAlert(true)
        })
    }
    setValidated(true)
  }

  return (
    <Container>
      <Row className='pt-5 justify-content-md-center'>
        <Col md={6}>
          <h1>React + Firebase</h1>
          <h2>Sign up</h2>
          <Form className='pt-3' noValidate validated={validated} onSubmit={onSubmit}>
            <Alert variant='danger' onClose={() => setShowAlert(false)} dismissible show={showAlert}>
              <Alert.Heading>OoOps! You got an error!</Alert.Heading>
              <p>{message}</p>
            </Alert>
            <Form.Group className='mb-3' controlId='email'>
              <FloatingLabel
                controlId='email'
                label='Email address'
                className='mb-3'
              >
                <Form.Control type='text' placeholder='name@example.com' autoComplete='off' value={email} required onChange={(e) => setEmail(e.target.value)} />
              </FloatingLabel>
              <Form.Text className='text-muted'>
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className='mb-3' controlId='password'>
              <InputGroup hasValidation>
                <FloatingLabel
                  controlId='password'
                  label='Password'
                  className='mb-3'
                >
                  <Form.Control type='password' placeholder='Password' autoComplete='off' value={password} required minLength={6} onChange={(e) => setPassword(e.target.value)} />
                  <Form.Control.Feedback type='invalid'>
                    Password must complain with the 6 characters restriction
                  </Form.Control.Feedback>
                </FloatingLabel>
              </InputGroup>
            </Form.Group>

            <Button variant='primary' type='submit' className='mt-3'>
              Sign up
            </Button>

            <p className='text-sm text-center text-secondary pt-3'>
              Already have an account?{' '}
              <NavLink to='/login'>
                <Badge bg='info'>Sign in</Badge>
              </NavLink>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Signup
