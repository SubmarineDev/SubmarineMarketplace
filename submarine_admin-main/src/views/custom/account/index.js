// ** React Imports
import { Fragment, useState, useEffect } from 'react'

import toast from 'react-hot-toast'
import { BACKEND_URL } from '@src/configs'

import axios from 'axios'
// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/authentication'

import { useNavigate } from 'react-router-dom'

// ** Third Party Components
import { Card, CardHeader, CardTitle, Media, Row, Col, Button, Form, Input, Label, FormGroup, Table, CustomInput } from 'reactstrap'

const UserAccountTab = () => {
  // ** Store Vars
  const dispatch = useDispatch()

  const navigate = useNavigate()

  // ** States
  const [userData, setUserData] = useState({
    _id: '',
    fullName: '',
    username: '',
    email: '',
    cPassword: '',
    nPassword: '',
    mPassword: ''
  })

  const handleSaveChange = async () => {
    if (userData.cPassword !== '' && userData.nPassword !== userData.mPassword) {
      toast.error('The new passwords do not match!')
    } else {
      try {
        await axios.post(`${BACKEND_URL}/api/jwt/changeAccount`, {
          userData
        }).then(response => {
          if (response.data.success) {
            toast.success(response.data.message)
            console.log(response.data)
            dispatch(handleLogout())
            navigate('/login')

          } else {
            toast.error(response.data.message)
            console.log(response.data)
          }
        }).catch((e) => {
          console.log('login error', e)
          toast.error('Request Failed')
        })

      } catch (e) {
        console.log('login error', e)
        toast.error('Request Failed')
      }
    }
  }

  const handleInputChange = (event) => {
    setUserData({
      ...userData,
      [event.target.id]: event.target.value
    })
  }

  // ** Update user image on mount or change
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'))
    if (user !== undefined) {
      setUserData({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        cPassword: '',
        nPassword: '',
        mPassword: ''
      })
    }
  }, [])

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Account</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='ml-2' color='primary' onClick={() => handleSaveChange()}>
              <span className='align-middle ml-50'>Save Changes</span>
            </Button>
          </div>
        </CardHeader>
        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='12'>
            <Form>
              <Row>
                <Col md='4' sm='12'>
                  <FormGroup>
                    <Label for='username'>Username</Label>
                    <Input type='text' id='username' placeholder='Username' value={userData.username} onChange={(event) => handleInputChange(event)} />
                  </FormGroup>
                </Col>
                <Col md='4' sm='12'>
                  <FormGroup>
                    <Label for='fullName'>Full Name</Label>
                    <Input type='text' id='fullName' placeholder='Full Name' value={userData.fullName} onChange={(event) => handleInputChange(event)} />
                  </FormGroup>
                </Col>
                <Col md='4' sm='12'>
                  <FormGroup>
                    <Label for='email'>Email</Label>
                    <Input type='text' id='email' placeholder='Email' value={userData.email} onChange={(event) => handleInputChange(event)} />
                  </FormGroup>
                </Col>
                <Col md='4' sm='12'>
                  <FormGroup>
                    <Label for='cPassword'>Current Password</Label>
                    <Input type='password' id='cPassword' placeholder='Current Password' value={userData.cPassword} onChange={(event) => handleInputChange(event)} />
                  </FormGroup>
                </Col>
                <Col md='4' sm='12'>
                  <FormGroup>
                    <Label for='nPassword'>New Password</Label>
                    <Input type='password' id='nPassword' placeholder='New Password' value={userData.nPassword} onChange={(event) => handleInputChange(event)} />
                  </FormGroup>
                </Col>
                <Col md='4' sm='12'>
                  <FormGroup>
                    <Label for='mPassword'>Confirm Password</Label>
                    <Input type='password' id='mPassword' placeholder='Confirm Password' value={userData.mPassword} onChange={(event) => handleInputChange(event)} />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </Fragment>

  )
}
export default UserAccountTab
