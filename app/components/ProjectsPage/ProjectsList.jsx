import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import ProjectsListItem from './ProjectsListItem.jsx'

import $ from 'jquery'

const fs = window.require('fs-extra')
var remote = window.require('electron').remote

import { firebaseRef } from '../../Firebase/firebase.js'
import * as firebase from 'firebase'
const db = firebase.database()

var download = window.require('download-file')
const {shell} = window.require('electron')

class ProjectsList extends Component {
  constructor (props) {
    super(props)
    this.state = {
        files: []
    };
		this.updateFiles = this.updateFiles.bind(this)
		this.dlCommitFromWeb = this.dlCommitFromWeb.bind(this)
  }

  componentDidMount() {
    this.updateFiles()
	}
	
	dlCommitFromWeb(dlLink, projectName) {
		
		let appPath = remote.app.getAppPath()

		var options = {
				directory: appPath + '/Synced-Files/' + projectName,
				filename: projectName + '.logicx.zip'
		}
			
		download(dlLink, options, function(err){
				if (err) throw err
		})
		
		setTimeout(() => {
			shell.openItem(appPath + '/Synced-Files/' + projectName + '/' + projectName + '.logicx.zip')
		}, 1000)
	}
		

  updateFiles() {

		// We need to consult Firebase, for relevant Project ID's

		let appPath = remote.app.getAppPath()
		let projectIDarr = []

    fs.readdir(appPath + '/Synced-Files/', (err, files) => {
			db.ref(`users/${localStorage.getItem('access_token')}/projectIDs`).once('value', (data) => {
				// Construct an array of all files that exist on the desktop environment already 
				// Iterate through the files associated with user

				// With each file, match with array of existing files
				// If doesn't exist, then we need to create a new directory following project item structure

				for (var key in data.val()) {
					if (!files.includes(data.val()[key])) {
						fs.mkdir(appPath + '/Synced-Files/' + data.val()[key])
						// *** The 0.1 is to remain consistent with other ProjectID files (Firebase didn't allow '.' in keys) *** //
					}	
					projectIDarr.push(key)
				}
			})
			.then(() => {
				fs.readdir(appPath + '/Synced-Files/', (err, files) => {

					console.log('FOUND', projectIDarr)

					// Loop handles async issues with creating ID -> project directories -> .zip files
					// Likely doesn't exist due to Accepting Invitation
					// Download .zip file and .logicx file from LATEST project commit

					for (let i = 1; i < files.length; i++) {
						fs.readdir(appPath + '/Synced-Files/' + files[i], (err, innerFiles) => {
							if (innerFiles.length === 0) {
								fs.mkdir(appPath + '/Synced-Files/' + files[i] + '/0.' + projectIDarr[i - 1])

								db.ref(`users/${localStorage.getItem('access_token')}/projectCommits/${projectIDarr[i - 1]}`).once('value', (commitData) => {
									console.log('HERE', commitData.val(), commitData.val()[commitData.val().length - 1].split(' | ')[0])
									let projectName = files[i]
									let dlLink = commitData.val()[commitData.val().length - 1].split(' | ')[0]
		
									this.dlCommitFromWeb(dlLink, projectName)
								})
								.catch(err => console.log(err))
							}
						})
					}

					// Remove .DS_Stores if exists
					let filteredFiles = files.filter((file) => {
						return file !== '.DS_Store' && !file.includes('.zip')
					})
					this.setState({
							files: filteredFiles
					})   
				})
			})
			.catch(err => {
				console.log(err)
			})
		})
	}

  render() {
    return (
      <div>
        <h2>Projects</h2>
        {this.state.files.map(file =>
					<ProjectsListItem projectName={file} projectsPageHistory={this.props.projectsPageHistory}/> 
				)}
      </div>
    )
  }
}

export default ProjectsList;