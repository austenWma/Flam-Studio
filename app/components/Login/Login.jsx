import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link, withRouter, hashHistory} from 'react-router-dom'

import { firebaseRef } from '../../Firebase/firebase.js'
import * as firebase from 'firebase'

import path from 'path'

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

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
      <div className="loginContainer">
        <div className="loginLogo">
					<img src={'http://i66.tinypic.com/2zgu68p.png'} style={{height: '40%', width: '40%'}} />
        </div>
        <MuiThemeProvider>
          <div className="loginActionContainer">
            <TextField
              hintText="Email"
              style={{width: '55%'}}
              onChange={this.emailChange}
            />
            <TextField
              hintText="Password"
              style={{width: '55%', marginTop: '5%'}}
              type="password"
              onChange={this.passwordChange}
            />
            <div className="loginButtonContainer">
              <div className="loginButton">
                <RaisedButton label="Log In" fullWidth={true} onClick={this.login}/>
              </div>
            </div>
          </div>
        </MuiThemeProvider>
        <div className="loginSignupPrompt">Don't have an account with us?
          <div onClick={this.goToSignUp}>Sign Up</div>
        </div>
      </div>
    )
  }
}

export default Login;