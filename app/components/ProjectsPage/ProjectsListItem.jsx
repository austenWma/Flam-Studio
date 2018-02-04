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
const db = firebase.database()

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
		this.openCommits = this.openCommits.bind(this)
		this.syncCommits = this.syncCommits.bind(this)
	}

	componentDidMount() {
		let appPath = remote.app.getAppPath()

		fs.readdir(appPath + '/Synced-Files/' + this.props.projectName, (err, files) => {
			let filteredFile = files.filter((file) => {
				return file !== '.DS_Store' && !file.includes('.zip') && !file.includes('0.')
			})

			this.setState({
				fullProjectName: filteredFile
			})
    })
	}
	
	openFile() {
		let appPath = remote.app.getAppPath()

		shell.openItem(appPath + '/Synced-Files/' + this.props.projectName + '/' + this.props.projectName + '.logicx');

		console.log('OPENNNN', appPath + '/Synced-Files/' + this.props.projectName + '/' + this.props.projectName + '.logicx')
		
		// Watches project
		this.watchFileOpened(appPath + '/Synced-Files/' + this.props.projectName + '/' + this.props.projectName + '.logicx', this.props.projectName)

	}

	commitFile() {
		this.compressSyncedFile(this.props.projectName, this.uploadFile, this.syncCommits)
	}

	compressSyncedFile(projectName, uploadCallback, syncCallback) {
		console.log('Compressing file', this.props.projectName)

		let appPath = remote.app.getAppPath()  
		let fullProjectName = this.props.projectName + '.logicx'

		zipFolder(appPath + '/Synced-Files/' + projectName + '/' + this.props.projectName + '.logicx', appPath + '/Synced-Files/' + projectName + '/' + this.props.projectName + '.logicx' + '.zip', function(err) {
			if(err) {
				console.log('oh no!', err);
			} else {
				console.log('FILE COMPRESSED')

				let file = fs.readFile(appPath + '/Synced-Files/' + projectName + '/' + fullProjectName + '.zip', function read(err, data) {
					if (err) {
						throw err;
					} 
					uploadCallback(data, projectName, syncCallback)
				})
			}
		});
	}

	uploadFile(file, projectName, syncCallback) {

		let appPath = remote.app.getAppPath()
		let existingProjectID = ''

		fs.readdir(appPath + '/Synced-Files/' + this.props.projectName, (err, files) => {
			let fileExists = false
			for (let i = 0; i < files.length; i++) {
				if (files[i][0] === '0' && files[i][1] === '.') {
					existingProjectID = files[i]
					fileExists = true
				}
			}
				
			if (fileExists) {
				// Project exists, Normal Upload

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
						db.ref(`users/${localStorage.getItem('access_token')}/projectCommits/${existingProjectID.slice(2)}`).once('value').then(data => {
							
							let commitNumber = (!data.val()) ? 1 : data.val().length

							// Firebase file upload
							var storageRef = firebase.storage().ref('/' + existingProjectID + '/' + projectName + '/' + projectName + commitNumber + '.logicx.zip');
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
								console.log('THIRD COMMIT')

								if (!data.val()) {
									// Create new property with count starting at 1
									let updateCommitObj = {
										1: downloadURL + ' | ' + r + ' | ' + Date() + ' | ' + localStorage.getItem('user_email')
									}
									db.ref(`users/${localStorage.getItem('access_token')}/projectCommits/${existingProjectID.slice(2)}`).update(updateCommitObj)
								}	else {
									// Get the length of how many current commits there are, and the commit number of the current commit will be one higher
									let updateCommitObj = {
										[data.val().length]: downloadURL + ' | ' + r + ' | ' + Date() + ' | ' + localStorage.getItem('user_email')
									}
									db.ref(`users/${localStorage.getItem('access_token')}/projectCommits/${existingProjectID.slice(2)}`).update(updateCommitObj)
								}

								syncCallback(downloadURL + ' | ' + r + ' | ' + Date() + ' | ' + localStorage.getItem('user_email'), existingProjectID.slice(2), data.val().length)
							});
						})
						.catch(err => {
							console.log(err)
						})
					}	else if (r === 'Your commit message here') {
						alert('Make a new commit message!')
					}
				})
				.catch(console.error);
			}	else {
				// Project doesn't exist, create new project

				let newProjectID = Math.random().toString(36)

				// COMMENCING PROJECT CREATION AND FIRST COMMIT
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
							db.ref(`users/${localStorage.getItem('access_token')}/projectCommits/${newProjectID.slice(2)}`).once('value').then(data => {
								console.log('Commit logged in Firebase')

								let commitNumber = (!data.val()) ? 1 : data.val().length

								// Firebase file upload
								var storageRef = firebase.storage().ref('/' + newProjectID + '/' + projectName + '/' + projectName + commitNumber + '.logicx.zip');
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

									if (!data.val()) {
										// Create new property with count starting at 1
										let updateCommitObj = {
											1: downloadURL + ' | ' + r + ' | ' + Date() + ' | ' + localStorage.getItem('user_email')
										}
										db.ref(`users/${localStorage.getItem('access_token')}/projectCommits/${newProjectID.slice(2)}`).update(updateCommitObj)
									}	else {
										// Get the length of how many current commits there are, and the commit number of the current commit will be one higher
										let updateCommitObj = {
											[data.val().length]: downloadURL + ' | ' + r + ' | ' + Date() + ' | ' + localStorage.getItem('user_email')
										}
										db.ref(`users/${localStorage.getItem('access_token')}/projectCommits/${newProjectID.slice(2)}`).update(updateCommitObj)
									}

								});
							})
							.catch(err => {
								console.log(err)
							})
						}	else if (r === 'Your commit message here') {
							alert('Make a new commit message!')
						}
				})
				.catch(console.error);

				// GENERATE FILE CONTAINING PROJECT REFERENCE ID

				fs.mkdir(appPath + '/Synced-Files/' + projectName + '/' + newProjectID);

				// ADD PROJECT KEY TO USER'S FB DATA

				let cutProjectID = newProjectID.slice(2);

				let updateProjectObj = {
					[cutProjectID]: {
						Name: projectName,
						Collaborators: localStorage.getItem('access_token')
					},
				}

				db.ref(`users/${localStorage.getItem('access_token')}/projectIDs`).update(updateProjectObj)
				.catch(err => {
					console.log(err)
				})
			}
    })
  }
	
	watchFileOpened(watchFilePath, projectName) {
    fs.watchFile(watchFilePath, function(curr, prev){
      console.log("File Changed", curr, prev);

      new Notification(projectName, {
        body: 'File Saved'
      })
    })
	}
	
	openCommits() {

		let commitsProjectID = ''

		db.ref(`users/${localStorage.getItem('access_token')}/projectIDs`).once('value').then((data) => {
			for (var key in data.val()) {
				if (data.val()[key].Name === this.props.projectName) {
					commitsProjectID = key
				}
			}
		})
		.then(() => {
			db.ref(`users/${localStorage.getItem('access_token')}/projectCommits`).once('value').then((data) => {
				for (var key in data.val()) {
					if (key === commitsProjectID) {
						localStorage.setItem('current_commits_list', data.val()[key])
						localStorage.setItem('current_commits_project', this.props.projectName)
					}
				}

				this.props.projectsPageHistory.push('/CommitsList')
			})
		})
		.catch(err => console.log(err))
	}

	syncCommits(commitInfo, projectID, commitNumber) {
		// 1) Iterate through all collaborators associated with project
		db.ref(`users/${localStorage.getItem('access_token')}/projectIDs/${projectID}/Collaborators`).once('value').then((data) => {

			let collaboratorsArr = data.val().split(' | ')
			// 2) For each collaborator, add the new commit to their project commits
			for (let i = 0; i < collaboratorsArr.length; i++) {
				if (collaboratorsArr[i] !== sessionStorage.getItem('access_token')) {

					let newCommitObj = {
						[commitNumber]: commitInfo
					}

					db.ref(`users/${collaboratorsArr[i]}/projectCommits/${projectID}`).update(newCommitObj)
				}
			}
		})
		.then(() => {
			alert('Commit Made')
		})
		.catch(err => console.log(err))
	}

  render() {
    return (
      <div className='projectsListItem'>
        <div>{this.props.projectName}</div>
				<div className='projectsListItemButton'>
					<button onClick={this.openFile}>Open</button>
				</div>
				<div className='projectsListItemButton'>
					<button onClick={this.openCommits}>Commit History</button>
				</div>
				<div className='projectsListItemButton'>
					<button onClick={this.commitFile}>Commit</button>
				</div>
      </div>
    )
  }
}

export default ProjectsListItem;