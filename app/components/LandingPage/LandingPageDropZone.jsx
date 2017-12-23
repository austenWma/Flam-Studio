import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import $ from 'jquery'
var remote = window.require('electron').remote
const fs = window.require('fs-extra')
const {shell} = window.require('electron')

import path from 'path'

class LandingPageDropZone extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
    this.watchFileDropped = this.watchFileDropped.bind(this)
  }

  componentDidMount() {
    document.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        for (let f of e.dataTransfer.files) {
          console.log('File(s) you dragged here: ', f.path, f, this.props)

          // Gets the path to the electron App dir
          let appPath = remote.app.getAppPath()

          let dotIndex = f.name.indexOf('.')
          let fileNameWithoutDot = f.name.slice(0, dotIndex)

          if (!fs.existsSync(appPath + '/Synced-Files/' + fileNameWithoutDot)){
            fs.mkdir(appPath + '/Synced-Files/' + fileNameWithoutDot);
          }

          fs.copy(f.path, appPath + '/Synced-Files/' + fileNameWithoutDot + '/' + f.name)

          shell.openItem(appPath + '/Synced-Files/' + fileNameWithoutDot + '/' + f.name);
          
          this.watchFileDropped(appPath + '/Synced-Files/' + fileNameWithoutDot + '/' + f.name, f.name)
        }
    });

    document.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
  }

  watchFileDropped(watchFilePath, projectName) {
    fs.watchFile(watchFilePath, function(curr, prev){
      console.log("File Changed", curr, prev);

      new Notification(projectName, {
        body: 'File Saved'
      })
    })
  }

  render() {
    return (
      <div className="landingPageDropZoneInnerContainer">
        <div className='landingPageDropZone'>
          Sync A Project Here
        </div>
        <div className="landingPageDropZoneComment">Drag and drop a Logic project into the space to sync up and start working!</div>
      </div>
    )
  }
}

export default LandingPageDropZone;