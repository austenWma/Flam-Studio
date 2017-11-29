import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import $ from 'jquery'

const fs = window.require('fs-extra')
const electron = window.require('electron')
var remote = window.require('electron').remote
var zipFolder = window.require('zip-folder')
const {shell} = window.require('electron')
const {dialog} = window.require('electron').remote

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
		this.commitFile = this.commitFile.bind(this)
		this.uploadFile = this.uploadFile.bind(this)
	}
	
	openFile() {
		let appPath = remote.app.getAppPath()

		// Opens project in Logic
		shell.openItem(appPath + '/Synced-Files/' + this.props.projectName);

		// Watches project
		this.watchFileOpened(appPath + '/Synced-Files/' + this.props.projectName, this.props.projectName)
	}

	commitFile() {
		this.compressSyncedFile(this.props.projectName, this.uploadFile)
	}

  compressSyncedFile(projectName, uploadCallback) {
    console.log('Compressing file')

		let appPath = remote.app.getAppPath()  

    zipFolder(appPath + '/Synced-Files/' + projectName, appPath + '/Synced-Files/' + projectName + '.zip', function(err) {
      if(err) {
          console.log('oh no!', err);
      } else {
				console.log('FILE COMPRESSED')

				let file = fs.readFile(appPath + '/Synced-Files/' + projectName + '.zip', function read(err, data) {
					if (err) {
							throw err;
					}
					uploadCallback(data)
				})
      }
    });
	}

	uploadFile(file) {
		console.log(localStorage.getItem('access_token'))
		
		if (localStorage.getItem('access_token')) {
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
				alert('Authentication Timed Out!')
			}, function() {
				var downloadURL = uploadTask.snapshot.downloadURL;
			});
		}	else {
			console.log('NO ACCESS')
		}
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
					<button onClick={this.commitFile}>Commit</button>
				</div>
      </div>
    )
  }
}

export default ProjectsListItem;