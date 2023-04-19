import React, { useContext, useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import {useLoginUserMutation} from '../services/serverAPI'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import {AppContext} from '../context/appContext'
const Login = () => {
  
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [loginUser, {isLoading, error}] = useLoginUserMutation()
  const {socket} = useContext(AppContext)

  const handleLogin = (e) => {
    e.preventDefault()
    loginUser({email, password})
    .then(({data}) => {
      if(data) {
        // socket work
        socket.emit("new-user")
        // navigate to the chat
        navigate("/chat")
      }
     
    })
  }
  
  return (
    <Container style={{backgroundColor: '#87CBB9'}}>
      <Row>
        <Col md={5} className='login__bg'></Col>
        <Col md={7} className='d-flex align-items-center justify-content-center flex-direction-column' >
        <Form style={{width: "80%", maxWidth: 500}} className='card p-2 bg-light' onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            {error && <p className='alert alert-danger'>{error.data}</p>}
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" 
            onChange={(e) => setEmail(e.target.value)} value={email} required/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)}  required />
          </Form.Group>
          <Button variant='primary' type="submit">
            {isLoading ? <Spinner animation='grow'/> : "Login"}
          </Button>
          <div className='py-4'>
              <p className='text-center'>
                Don't have an account?  <Link to="/signup" >Sign Up</Link>
              </p>
          </div>
        </Form>
        </Col>

      </Row>

    </Container>
  )
}

export default Login