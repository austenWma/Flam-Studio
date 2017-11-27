import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import $ from 'jquery'
var remote = window.require('electron').remote;
const fs = window.require('fs-extra')

import path from 'path'

class LandingPageDropZone extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
  }

  componentDidMount() {
    document.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        for (let f of e.dataTransfer.files) {
            console.log('File(s) you dragged here: ', f.path, f, this.props)

            // Gets the path to the electron App dir
            let appPath = remote.app.getAppPath()

            // Persists current file synced to LS
            localStorage.setItem('currSyncFilePath', appPath + '/Synced-Files/' + f.name)

            fs.copy(f.path, appPath + '/Synced-Files/' + f.name)
            
            this.props.watchFileDropped(appPath + '/Synced-Files/' + f.name)
        }
    });

    document.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
  }

  render() {
    return (
      <div>
        Sync Your Files Here
      </div>
    )
  }
}

export default LandingPageDropZone;