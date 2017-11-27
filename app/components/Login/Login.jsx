import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link, withRouter, hashHistory} from 'react-router-dom'

import { firebaseRef } from '../../Firebase/firebase.js'
import * as firebase from 'firebase'

import path from 'path'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
        email: '',
        password: ''
    };
    this.emailChange = this.emailChange.bind(this)
    this.passwordChange = this.passwordChange.bind(this)
    this.login = this.login.bind(this)
    this.goToSignUp = this.goToSignUp.bind(this)
  }

  login() {
    firebaseRef.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(data => {
        if (data) {
            localStorage.setItem('access_token', data.uid.slice(0,10))
            this.props.history.push('/LandingPage')
        }
    })
    .catch((err) => {
        console.log(err);
    })
  }

  goToSignUp() {
    this.props.history.push('/SignUp')
  }

  emailChange(e) {
    this.setState({
        email: e.target.value
    })
  }

  passwordChange(e) {
    this.setState({
        password: e.target.value
    })
  }

  render() {
    return (
      <div>
        <div>
            Login
        </div>
        <input type="text" placeholder="email" onChange={this.emailChange}></input>
        <input type="text" placeholder="password" onChange={this.passwordChange}></input>
        <button onClick={this.login}>Log In</button>
        <button onClick={this.goToSignUp}>Sign Up</button>
      </div>
    )
  }
}

export default Login;