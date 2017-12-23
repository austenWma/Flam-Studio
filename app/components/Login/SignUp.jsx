import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link, withRouter, hashHistory} from 'react-router-dom'

import { firebaseRef } from '../../Firebase/firebase.js'
import * as firebase from 'firebase'

import path from 'path'

class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
        email: '',
        password: ''
    };
    this.emailChange = this.emailChange.bind(this)
    this.passwordChange = this.passwordChange.bind(this)
		this.signUp = this.signUp.bind(this)
		this.goToLogin = this.goToLogin.bind(this)
  }

  signUp() {
    if (this.state.password) {
			firebaseRef.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
			.then(data => {
					console.log('successfully created an account', data)
					firebase.database().ref(`users/${data.uid.substring(0, 10)}`).set({
							email: data.email,
							uid: data.uid.substring(0, 10),
							projectIDs: ''
					})
			})
			.catch(err => {
					console.log(err.code)
					console.log(err.message)
			})
		}
	}

	goToLogin() {
    this.props.history.push('/')
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
            Sign Up
        </div>
        <input type="text" placeholder="email" onChange={this.emailChange}></input>
        <input type="text" placeholder="password" onChange={this.passwordChange}></input>
        <button onClick={this.signUp}>Sign Up</button>
				<button onClick={this.goToLogin}>Back</button>
      </div>
    )
  }
}

export default SignUp;