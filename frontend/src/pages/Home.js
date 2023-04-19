import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './Home.css'

const Home = () => {
  return (
    <Row>
      <Col md={6} className='d-flex flex-direction-column align-items-center justify-content-center' >
        <div>
          <h1>Tôn Đức Thắng University</h1>
          <p>Chat app let you connect with people in the world</p>
          
          <LinkContainer to="/chat">
            <Button variant='success' >
              Get Started<i className='fas fa-comments home-message-icon'></i>
            </Button>
            
          </LinkContainer>
          <h3>Wellcome to my App</h3>
          <h4>Giáo viên hướng dẫn: Nguyễn Thanh Quân</h4>
          <p>Thành viên nhóm:</p>
          <p><b>Đoàn Phương Nam - 52000895</b></p>
          <p><b>Trần Hoàng Quang Din - 52000882</b></p>
          <p><b>Trương Thị Ngân Trâm - 52000722</b></p>
        </div>
      </Col>
      <Col md={5} className='home__bg' ></Col>
    </Row>
  )
}

export default Home