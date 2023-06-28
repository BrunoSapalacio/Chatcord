import React from 'react'
import Auth from '../hooks/Auth';

const Login = () => {

  const LoginUser = () => {
    Auth.login();
  }

  return (
    <div>
      <h1>MITT CHAT</h1>
      <button onClick={LoginUser}>Logar</button>
    </div>
  )
}

export default Login