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
const db = firebase.database()
import path from 'path'

var download = window.require('download-file')

class LandingPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
    this.goToProjectsPage = this.goToProjectsPage.bind(this)
    this.logOut = this.logOut.bind(this)
    this.dlCommit = this.dlCommit.bind(this)
  }

  componentDidMount() {

    // Listening for any openingProject command coming from the web app
    // Will then take the corresponding data DLlink and open it in Logic
    // First making sure that the initial check isn't opening anything

    db.ref(`users/${localStorage.getItem('access_token')}`).update({
      openingProject: ''
    })
    .then(() => {
      console.log('Opening Projects Wiped')

      db.ref(`users/${localStorage.getItem('access_token')}/openingProject`).on('value', (data) => {
        if (data.val().length > 0) {
          // this.dlCommit(data.val())
          console.log(data.val())
          let dlLink = data.val().split(' | ')[0]
          let fileName = data.val().split(' | ')[1] + '.logicx.zip'

          this.dlCommit(dlLink, fileName)
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
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

  dlCommit(dlLink, fileName) {

    let appPath = remote.app.getAppPath()

    var options = {
        directory: appPath + '/Synced-Files/',
        filename: fileName
    }
      
    download(dlLink, options, function(err){
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
      </div>
    )
  }
}

export default LandingPage;