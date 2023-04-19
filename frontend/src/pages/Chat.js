import React from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import Sidebar from '../components/SideBar'
import MessageForm from '../components/MessageForm'
function Chat() {
  return (
    <Container>
        <Row>
          <Col> <Sidebar/> </Col>
          <Col md={8} > <MessageForm/> </Col>
        </Row>
    </Container>
  )
}

export default Chat