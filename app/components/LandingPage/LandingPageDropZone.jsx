import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import $ from 'jquery'
// var remote = require('electron').remote;
const fs = window.require('fs-extra')
// var fs = window.require('fs');


class LandingPageDropZone extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
  }

  componentDidMount() {
    document.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        for (let f of e.dataTransfer.files) {
            console.log('File(s) you dragged here: ', f.path)
            localStorage.setItem('currSyncFilePath', f.path)
						fs.copy(f.path, '/Users/austenma/Flam-Studio/Synced-Files/Testing.logicx')
        }
    });

    console.log('LOCAL STORAGE', localStorage)

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