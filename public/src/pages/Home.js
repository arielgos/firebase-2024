import React, { useState, useEffect, useRef } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../Firebase'
import { useNavigate } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Wall from '../components/Wall'

const Home = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const dataFetchedReference = useRef(false)

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log('Signed out successfully')
      setUser(null)
    }).catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorCode, errorMessage, error)
    })
  }

  useEffect(() => {
    if (dataFetchedReference.current) return
    dataFetchedReference.current = true

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        console.log('user is logged out')
        navigate('/login')
      }
    })
  }, [navigate])

  return (
    <>
      <Navbar expand='lg' className='bg-body-tertiary'>
        <Container>
          <Navbar.Brand href='#home'>Firebase Boost 2024</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className='justify-content-end'>
            <Navbar.Text>

              Signed in as: <span onClick={handleLogout} title='Click to sign out'>{user != null ? user.email : ''}</span>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {
                user == null ? navigate('/login') : <Wall user={user} />
            }
    </>
  )
}

export default Home
