import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import LandingPageNavbar from './LandingPageNavbar.jsx'
import LandingPageDropZone from './LandingPageDropZone.jsx'

import $ from 'jquery'

const fs = window.require('fs-extra')
var remote = window.require('electron').remote;
var zipFolder = window.require('zip-folder');

import { firebaseRef } from '../../Firebase/firebase.js'
import * as firebase from 'firebase'

import path from 'path'

class LandingPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
    this.goToProjectsPage = this.goToProjectsPage.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  goToProjectsPage() {
    this.props.history.push('/ProjectsPage')
  }

  logOut() {
    firebase.auth().signOut().then(() => {
      localStorage.setItem('access_token', null)
      this.props.history.push('/')
    })
  }

  render() {
    return (
      <div>
        <div className="landingPageNavbarContainer">
          <LandingPageNavbar />
        </div>
        <div className="landingPageDropZoneContainer">
          <LandingPageDropZone />
        </div>
        <div>
          <button onClick={this.goToProjectsPage}>
            My Projects
          </button>
        </div>
        <div>
          <button onClick={this.logOut}>
            Log Out
          </button>
        </div>
      </div>
    )
  }
}

export default LandingPage;