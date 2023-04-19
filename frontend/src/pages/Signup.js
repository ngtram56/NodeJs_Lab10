import React, { useContext, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import './Signup.css'
import {useSignupUserMutation} from '../services/serverAPI'
import { AppContext } from '../context/appContext'


const SignUp = () => {
  const picProfile = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()
  const [signupUser, {isLoading, error}] = useSignupUserMutation()
  const {socket} = useContext(AppContext)


  //image upload states
  const [image, setImage] = useState(null)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  

  const validateImg = (e) => {
    const file = e.target.files[0]
    if(file.size >= 200000) { // 200KB
      return alert("Max file size is 200Kb")
    } else {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }
  
  const uploadImage = async () => {
    const data = new FormData()
    data.append('file', image) //RTC-app
    data.append("upload_preset", "RTC-app");
    data.append("cloud_name", "dptwdkr13");
    try {
      setUploadingImg(true)
      let res = await fetch("https://api.cloudinary.com/v1_1/dptwdkr13/image/upload", {
        method: "POST",
        body: data,
      })
      const urlData = await res.json()
      setUploadingImg(false)
      return urlData.url 
    } catch (error) {
      setUploadingImg(false)
      console.log(error)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if(!image) {
      return alert('Please upload your picture profile')
    }
    const url = await uploadImage(image)
    signupUser({username,email,password,picture: url})
    .then(({data}) => {
      if(data) {
        socket.emit("new-user")
        navigate("/chat")
      }
    })
  }
  

  return (
    <Container>
      <Row >
        <Col md={12} className='d-flex align-items-center justify-content-center flex-direction-column' >
        <Form style={{width: "80%", maxWidth: 500}} onSubmit={handleSignup} className='card p-2 bg-custom'>
          <h1 className='text-center' >Create Account</h1>
          <div className='signup-profile-pic__container'>
            <img src={imagePreview || picProfile } className='signup-profile-pic' alt='' />
            <label htmlFor='image-upload' className='image-upload-label' >
              <i className='fas fa-plus-circle add-picture-icon'></i>
            </label>
            <input type='file' id='image-upload' hidden accept='image/*' onChange={validateImg}/>
          </div>
          {error && <p className='alert alert-danger'>{error.data}</p>}
          <Form.Group className="mb-3" controlId="formGroupUsername">
            <Form.Label>User name</Form.Label>
            <Form.Control type="text" placeholder="Enter user name" value={username} onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword" >
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupConfirmPassword">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control type="password" placeholder="Confirm password" onChange={(e) => setConfirmPassword(e.target.value)} />
          </Form.Group>
          <Button className='bg-custom-2' type="submit" isLoading={uploadingImg} >
            {uploadingImg || isLoading ? "Loading ...": "Create Account"}
          </Button>
          <div className='py-4'>
              <p className='text-center'>
                Already have account ? <Link to="/login" >Login</Link>
              </p>
          </div>
        </Form>
        </Col>

      </Row>

    </Container>
  )
}

export default SignUp