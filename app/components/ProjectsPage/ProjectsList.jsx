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

class ProjectsList extends Component {
  constructor (props) {
    super(props)
    this.state = {
        files: []
    };
		this.goToHomePage = this.goToHomePage.bind(this)
		this.updateFiles = this.updateFiles.bind(this)
  }

  componentDidMount() {
    this.updateFiles()
  }

  updateFiles() {

		// We need to consult Firebase, for relevant Project ID's

		let appPath = remote.app.getAppPath()
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
						fs.mkdir(appPath + '/Synced-Files/' + data.val()[key] + '/0.' + key)
					}	
				}
			})
			.then(() => {
				fs.readdir(appPath + '/Synced-Files/', (err, files) => {
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

  goToHomePage() {
    this.props.history.push('/LandingPage')
  }

  render() {
    return (
      <div>
        <h2>Projects</h2>
        {this.state.files.map(file =>
					<ProjectsListItem projectName={file}/> 
				)}
      </div>
    )
  }
}

export default ProjectsList;