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

var download = window.require('download-file')

class LandingPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
    this.goToProjectsPage = this.goToProjectsPage.bind(this)
    this.logOut = this.logOut.bind(this)
    this.dlDemo = this.dlDemo.bind(this)
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

  dlDemo() {

    let appPath = remote.app.getAppPath()

    var url = "https://firebasestorage.googleapis.com/v0/b/flam-studio.appspot.com/o/0.184wyx2tdj1%2FTesting%202%2FTesting%2021.logicx.zip?alt=media&token=2fa5b121-9cf5-4f65-8943-25fd68b4f90a"
    
    var options = {
        directory: appPath + '/Synced-Files/',
        filename: "Testing 21.logicx.zip"
    }
      
    download(url, options, function(err){
        if (err) throw err
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
        <button onClick={this.dlDemo}>Download Demo</button>
      </div>
    )
  }
}

export default LandingPage;