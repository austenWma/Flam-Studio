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
			let filteredFiles = files.filter((file) => {
				return file !== '.DS_Store' && !file.includes('.zip')
			})
			this.setState({
					files: filteredFiles
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