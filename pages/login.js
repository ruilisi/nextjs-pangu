import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { Input, Button, message, Row, Col } from 'antd'
import { FormattedMessage } from 'react-intl'
import I from 'immutable'
import { TR } from '../utils/translation'
import { viewSetIn, redirectIfAuthorized } from '../redux/modules/view'
import { selfSet } from '../redux/modules/self'
import { post, removeAuthorization } from '../utils/request'
import Nav from '../components/nav'

const Login = () => {
  redirectIfAuthorized('/')
  const dispatch = useDispatch()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const postLogin = async (_username, _password) => {
    const res = await post('users/sign_in', { user: { email: _username, password: _password } })
    return res
  }
  const login = async (u, p) => {
    removeAuthorization()
    const res = await postLogin(u, p)
    if (res.id) {
      localStorage.setItem('Id', res.id)
      message.success('登录成功')
      dispatch(selfSet(I.fromJS(res)))
      dispatch(viewSetIn(['loginDialogOpen'], false))
      router.push('/chat')
    } else {
      message.error(res.error)
    }
    setSubmitting(false)
  }
  const onKeyPress = e => {
    if (e.key === 'Enter') {
      setSubmitting(true)
      login(username, password)
    }
  }
  return (
    <div>
      <Nav />
      <Row className="MT-45">
        <Col xs={{ span: 24 }} sm={{ offset: 6, span: 12 }} md={{ offset: 8, span: 8 }}>
          <div className="MB-10 FS-15 TA-C">登录</div>
          <div>
            <FormattedMessage id="Email or Mobile">
              {placeholder => (
                <Input
                  key="1"
                  size="large"
                  type="text"
                  placeholder={placeholder}
                  autoFocus
                  className="H-21"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="Password">
              {placeholder => (
                <Input
                  key="2"
                  size="large"
                  type="password"
                  placeholder={placeholder}
                  className="MT-12 H-21"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyPress={onKeyPress}
                />
              )}
            </FormattedMessage>
            <div key="3" className="MT-22">
              <Button
                className="H-21"
                type="primary"
                size="large"
                loading={submitting}
                onClick={e => {
                  setSubmitting(true)
                  e.preventDefault()
                  login(username, password)
                }}
                style={{ width: '100%' }}
              >
                {TR('Login')}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Login
