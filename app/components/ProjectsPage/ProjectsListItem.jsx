import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import $ from 'jquery'

const fs = window.require('fs-extra')
var archiver = window.require('archiver')
var remote = window.require('electron').remote;
var zipFolder = window.require('zip-folder');

import { firebaseRef } from '../../Firebase/firebase.js'
import * as firebase from 'firebase'

class ProjectsListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
		};
		this.watchFileDropped = this.watchFileDropped.bind(this)
    this.compressSyncedFile = this.compressSyncedFile.bind(this)
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
      <div className='projectsListItem'>
        <div>{this.props.projectName}</div>
      </div>
    )
  }
}

export default ProjectsListItem;