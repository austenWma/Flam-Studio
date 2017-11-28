import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import LandingPageNavbar from './LandingPageNavbar.jsx'
import LandingPageDropZone from './LandingPageDropZone.jsx'

import $ from 'jquery'

const fs = window.require('fs-extra')
var archiver = window.require('archiver')
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
    this.watchFileDropped = this.watchFileDropped.bind(this)
    this.compressSyncedFile = this.compressSyncedFile.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
    this.goToProjectsPage = this.goToProjectsPage.bind(this)
  }

  componentDidMount() {
    if (localStorage.currSyncFilePath) {
      this.watchFileDropped(localStorage.currSyncFilePath)
    }
  }
  
  watchFileDropped(watchFilePath) {
    fs.watchFile(watchFilePath, function(curr, prev){
      console.log("File Changed", curr, prev);

      new Notification('Title', {
        body: 'File Saved'
      })
    })
  }

  compressSyncedFile() {
    console.log('Compressing file')

    let appPath = remote.app.getAppPath()  

    zipFolder(appPath + '/Synced-Files/Testing.logicx', appPath + '/Synced-Files/Testing.logicx.zip', function(err) {
      if(err) {
          console.log('oh no!', err);
      } else {
          console.log('EXCELLENT');
      }
    });
  }

  uploadFile(e) {
    console.log(localStorage.getItem('access_token'))

    let file = e.target.files[0];

    var storageRef = firebase.storage().ref('/' + localStorage.getItem('access_token') + '/Testing.logicx.zip');
    var uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      console.log(error)
    }, function() {
      var downloadURL = uploadTask.snapshot.downloadURL;
    });
  }

  goToProjectsPage() {
    this.props.history.push('/ProjectsPage')
  }

  render() {
    return (
      <div>
        <div className="landingPageNavbarContainer">
          <LandingPageNavbar />
        </div>
        <div className="landingPageDropZoneContainer">
          <LandingPageDropZone watchFileDropped={this.watchFileDropped}/>
        </div>
        <div>
          <button onClick={this.compressSyncedFile}>
            Compress Synced File
          </button>
          <input type="file" className="fileUploadInput" onChange={this.uploadFile}></input>
          <button onClick={this.goToProjectsPage}>
            My Projects
          </button>
        </div>
      </div>
    )
  }
}

export default LandingPage;