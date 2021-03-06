import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import LandingPageNavbar from './LandingPageNavbar.jsx'
import LandingPageDropZone from './LandingPageDropZone.jsx'

const fs = window.require('fs-extra')
var remote = window.require('electron').remote;
var zipFolder = window.require('zip-folder');
const {shell} = window.require('electron')

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
    this.dlCommitFromWeb = this.dlCommitFromWeb.bind(this)
    this.openCommitFromWeb = this.openCommitFromWeb.bind(this)
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

          let dlLink = data.val().split(' | ')[0]
          let fileName = data.val().split(' | ')[1] + '.logicx.zip'

          console.log('FILENAME', data.val(), fileName)

          this.dlCommitFromWeb(dlLink, fileName)
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  dlCommitFromWeb(dlLink, fileName) {

    let appPath = remote.app.getAppPath()

    var options = {
        directory: appPath + '/Synced-Files/',
        filename: fileName
    }
      
    download(dlLink, options, function(err){
        if (err) throw err
    }) 

    setTimeout(() => { 
      this.openCommitFromWeb(appPath + '/Synced-Files/' + fileName) 
    }, 1000)
  }

  openCommitFromWeb(filePath) {

    setTimeout(() => { 
			console.log('FIRING OPEN', shell.openItem(filePath))
			shell.openItem(filePath);
			setTimeout(() => { 
        shell.openItem(filePath.slice(0, filePath.length - 4))
        
        shell.openItem(filePath.slice(0, filePath.length - 4))
        
        // Re-wipe FB OpeningProject
        db.ref(`users/${localStorage.getItem('access_token')}`).update({
          openingProject: ''
        })
        .then(() => {
          console.log('Opening Projects Wiped')
        })
			}, 4000)
    }, 3000)
  }

  render() {
    return (
      <div>
        <LandingPageNavbar landingHistory={this.props.history}/>
        <div className="landingPageDropZoneContainer">
          <LandingPageDropZone />
        </div>
      </div>
    )
  }
}

export default LandingPage;