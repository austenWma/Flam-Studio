import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import LandingPageNavbar from './LandingPageNavbar.jsx'
import LandingPageDropZone from './LandingPageDropZone.jsx'

import $ from 'jquery'

const fs = window.require('fs-extra')

class LandingPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
    this.watchFileDropped = this.watchFileDropped.bind(this)
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

  render() {
    return (
      <div>
        <div className="landingPageNavbarContainer">
            <LandingPageNavbar />
        </div>
        <div className="landingPageDropZoneContainer">
            <LandingPageDropZone watchFileDropped={this.watchFileDropped}/>
        </div>
      </div>
    )
  }
}

export default LandingPage;