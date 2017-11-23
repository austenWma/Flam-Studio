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

import path from 'path'

class LandingPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
    this.watchFileDropped = this.watchFileDropped.bind(this)
    this.compressSyncedFile = this.compressSyncedFile.bind(this)
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
        </div>
      </div>
    )
  }
}

export default LandingPage;