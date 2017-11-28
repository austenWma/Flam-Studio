import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import $ from 'jquery'

const fs = window.require('fs-extra')
var remote = window.require('electron').remote;
var zipFolder = window.require('zip-folder');
const {shell} = window.require('electron')

import { firebaseRef } from '../../Firebase/firebase.js'
import * as firebase from 'firebase'

class ProjectsListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
		};
		this.watchFileOpened = this.watchFileOpened.bind(this)
		this.compressSyncedFile = this.compressSyncedFile.bind(this)
		this.openFile = this.openFile.bind(this)
	}
	
	openFile() {
		let appPath = remote.app.getAppPath()

		// Opens project in Logic
		shell.openItem(appPath + '/Synced-Files/' + this.props.projectName);

		// Watches project
		this.watchFileOpened(appPath + '/Synced-Files/' + this.props.projectName, this.props.projectName)
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
	
	watchFileOpened(watchFilePath, projectName) {
    fs.watchFile(watchFilePath, function(curr, prev){
      console.log("File Changed", curr, prev);

      new Notification(projectName, {
        body: 'File Saved'
      })
    })
  }

  render() {
    return (
      <div className='projectsListItem'>
        <div>{this.props.projectName}</div>
				<div className='projectsListItemButton'>
					<button onClick={this.openFile}>Open</button>
				</div>
				<div className='projectsListItemButton'>
					<button>Commit</button>
				</div>
      </div>
    )
  }
}

export default ProjectsListItem;