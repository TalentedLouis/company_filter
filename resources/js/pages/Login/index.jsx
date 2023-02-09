import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import '../../../css/style.scss';
import { useWindowSize } from "../../utils/Helper";

import agent from '../../api/'

import {
  startAction,
  endAction,
  showToast,
} from '../../actions/common'

import {
  login
} from '../../actions/auth'

const Login = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [displayState, setDisplayState] = useState('login')
  const [loginData, setLoginData] = useState({email: '', password: ''})
  const [signupData, setSignupData] = useState({first_name: '', last_name: '', email: '', password: '', password_confirmation: ''})

  const submitLogin = async () => {
    // email === '' ? setEmailInputError(true) : setEmailInputError(false)
    // password === '' ? setPasswordInputError(true) : setPasswordInputError(false)
    // if (email !== '' && password !== '') {
      dispatch(startAction())
      try {
        let res = await agent.auth.login(loginData.email, loginData.password)
        console.log('response is ', res)
        dispatch(endAction())
        if (res.data.success) {
          localStorage.setItem('token', res.data.token)
          dispatch(showToast('success', res.data.message))
          res.data.user.role = res.data.role
          res.data.user.token = res.data.token
          dispatch(login(res.data.user))
          navigate("/home")
        }
      } catch (error) {
        if (error.response != undefined) {
          if (error.response.status >= 400 && error.response.status <= 500) {
            console.log(error.response)
            dispatch(endAction())
            dispatch(showToast('error', error.response.data.message))
          }
        }
      }
    // }
  }

  const submitRegister = async () => {
    // email === '' ? setEmailInputError(true) : setEmailInputError(false)
    // password === '' ? setPasswordInputError(true) : setPasswordInputError(false)
    // if (email !== '' && password !== '') {

      // const reEmail = convertParameter(email)
      // const rePassword = convertParameter(password)

      dispatch(startAction())
      try {
        let res = await agent.auth.register(signupData.first_name, signupData.last_name, signupData.email, signupData.password, signupData.password_confirmation)
        dispatch(endAction())
        if (res.data.success) {
          setDisplayState('login')
          dispatch(showToast('success', res.data.message))
        }
      } catch (error) {
        if (error.response != undefined) {
          if (error.response.status >= 400 && error.response.status <= 415) {
            dispatch(endAction())
            dispatch(showToast('error', error.response.data.message))
          }
        }
      }
  }

  return (
    <>
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r"/>
            <span className="r s"/>
            <span className="r s"/>
            <span className="r"/>
          </div>
          {
            displayState === 'login' && 
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-4">
                    <i className="feather icon-unlock auth-icon"/>
                  </div>
                  <h3 className="mb-4">Login</h3>
                  <div className="input-group mb-3">
                    <input type="email" className="form-control" placeholder="Email" value={loginData.email} onChange={(e) => setLoginData((old) => {return({...old, email: e.target.value})})} onKeyPress={(e) => { if (e.keyCode === 13 || e.charCode === 13) submitLogin() }}/>
                  </div>
                  <div className="input-group mb-4">
                    <input type="password" className="form-control" placeholder="password" value={loginData.password} onChange={(e) => setLoginData((old) => {return({...old, password: e.target.value})})} onKeyPress={(e) => { if (e.keyCode === 13 || e.charCode === 13) submitLogin() }}/>
                  </div>
                  <button className="btn btn-primary shadow-2 mb-4" onClick={() => submitLogin()}>Login</button>
                  {/* <p className="mb-2 text-muted">Forgot password? <NavLink to="/auth/reset-password-1">Reset</NavLink></p> */}
                  <p className="mb-0 text-muted">Don’t have an account? <a onClick={() => setDisplayState('signup')}>Signup</a></p>
                </div>
              </div>
          }
          {
            displayState === 'signup' &&
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon"/>
                  </div>
                  <h3 className="mb-4">Sign up</h3>
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="First Name" onChange={(e) => setSignupData((old) => {return({...old, first_name: e.target.value})})} onKeyPress={(e) => { if (e.keyCode === 13 || e.charCode === 13) submitRegister() }}/>
                  </div>
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Last Name" onChange={(e) => setSignupData((old) => {return({...old, last_name: e.target.value})})} onKeyPress={(e) => { if (e.keyCode === 13 || e.charCode === 13) submitRegister() }}/>
                  </div>
                  <div className="input-group mb-3">
                    <input type="email" className="form-control" placeholder="Email" onChange={(e) => setSignupData((old) => {return({...old, email: e.target.value})})} onKeyPress={(e) => { if (e.keyCode === 13 || e.charCode === 13) submitRegister() }}/>
                  </div>
                  <div className="input-group mb-4">
                    <input type="password" className="form-control" placeholder="password" onChange={(e) => setSignupData((old) => {return({...old, password: e.target.value})})} onKeyPress={(e) => { if (e.keyCode === 13 || e.charCode === 13) submitRegister() }}/>
                  </div>
                  <div className="input-group mb-4">
                    <input type="password" className="form-control" placeholder="password confirmation" onChange={(e) => setSignupData((old) => {return({...old, password_confirmation: e.target.value})})} onKeyPress={(e) => { if (e.keyCode === 13 || e.charCode === 13) submitRegister() }}/>
                  </div>
                  <button className="btn btn-primary shadow-2 mb-4" onClick={() => submitRegister()}>Sign up</button>
                  <p className="mb-0 text-muted">Allready have an account? <a onClick={() => setDisplayState('login')}>Login</a></p>
                </div>
              </div>
          }
        </div>
      </div>
    </>
  )
}

export default Login
