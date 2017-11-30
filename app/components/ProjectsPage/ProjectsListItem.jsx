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
const prompt = window.require('electron-prompt');

import { firebaseRef } from '../../Firebase/firebase.js'
import * as firebase from 'firebase'

class ProjectsListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
			fullProjectName: ''
		};
		this.watchFileOpened = this.watchFileOpened.bind(this)
		this.compressSyncedFile = this.compressSyncedFile.bind(this)
		this.openFile = this.openFile.bind(this)
		this.commitFile = this.commitFile.bind(this)
		this.uploadFile = this.uploadFile.bind(this)
	}

	componentDidMount() {
		let appPath = remote.app.getAppPath()

		fs.readdir(appPath + '/Synced-Files/' + this.props.projectName, (err, files) => {
			let filteredFile = files.filter((file) => {
				return file !== '.DS_Store' && !file.includes('.zip')
			})

			this.setState({
				fullProjectName: filteredFile
			})
    })
	}
	
	openFile() {
		let appPath = remote.app.getAppPath()

		shell.openItem(appPath + '/Synced-Files/' + this.props.projectName + '/' + this.state.fullProjectName);
		
		// Watches project
		this.watchFileOpened(appPath + '/Synced-Files/' + this.props.projectName + '/' + this.state.fullProjectName, this.props.projectName)

	}

	commitFile() {
		this.compressSyncedFile(this.props.projectName, this.uploadFile)
	}

  compressSyncedFile(projectName, uploadCallback) {
    console.log('Compressing file', this.props.projectName)

		let appPath = remote.app.getAppPath()  

		console.log('HERE', appPath + '/Synced-Files/' + projectName + '/' + this.state.fullProjectName)

    zipFolder(appPath + '/Synced-Files/' + projectName + '/' + this.state.fullProjectName, appPath + '/Synced-Files/' + projectName + '/' + projectName + '.zip', function(err) {
      if(err) {
          console.log('oh no!', err);
      } else {
				console.log('FILE COMPRESSED')

				let file = fs.readFile(appPath + '/Synced-Files/' + projectName + '/' + projectName + '.zip', function read(err, data) {
					if (err) {
							throw err;
					}
					uploadCallback(data, projectName)
				})
      }
    });
	}

	uploadFile(file, projectName) {
		console.log(localStorage.getItem('access_token'))

		// Prompting for Commit messages
		prompt({
			title: 'Flam-Studio',
			label: 'Commit Message',
			value: 'Your commit message here',
			inputAttrs: { 
					type: 'text'
			},
			type: 'input', 
		})
		.then((r) => {
				console.log('Prompt result', r); 

				if (r === null) {
					console.log('Canceled.')
				}	else if (r !== 'Your commit message here') {

					let commitTime = Date()

					let projectMetaData = {
						customMetadata: {
							commitMessage: r,
							commitTime: commitTime
						}
					}

					// Firebase file upload
					var storageRef = firebase.storage().ref('/' + localStorage.getItem('access_token') + '/' + projectName + '/' + Date() + ' | ' + r);
					var uploadTask = storageRef.put(file, projectMetaData);
		
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
				}	else if (r === 'Your commit message here') {
					alert('Make a new commit message!')
				}
		})
		.catch(console.error);
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
					<button onClick={this.commitFile}>Commit History</button>
				</div>
				<div className='projectsListItemButton'>
					<button onClick={this.commitFile}>Commit</button>
				</div>
      </div>
    )
  }
}

export default ProjectsListItem;