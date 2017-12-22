import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

const fs = window.require('fs-extra')
var remote = window.require('electron').remote;
var zipFolder = window.require('zip-folder');
const {shell} = window.require('electron')

import { firebaseRef } from '../../Firebase/firebase.js'
import * as firebase from 'firebase'
const db = firebase.database()
import path from 'path'

var download = window.require('download-file')

class CommitsListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
		};
		this.openCommit = this.openCommit.bind(this)
		this.dlOpenCommit = this.dlOpenCommit.bind(this)
	}

	openCommit() {
		this.dlOpenCommit('https://' + this.props.commitLink, localStorage.getItem('current_commits_project') + '.logicx.zip')
	}

	dlOpenCommit(dlLink, fileName) {
		console.log(dlLink)
		let appPath = remote.app.getAppPath()

		var options = {
				directory: appPath + '/Synced-Files/',
				filename: fileName
		}
			
		download(dlLink, options, function(err){
				if (err) throw err
		}) 

		let filePath = appPath + '/Synced-Files/' + fileName

		setTimeout(() => { 
			shell.openItem(filePath);
			setTimeout(() => { 
				shell.openItem(filePath.slice(0, filePath.length - 4))
			}, 1000)
		}, 1000)
	}

  render() {
    return (
      <div>
				<div>{this.props.commitDescription}</div>
				<button onClick={this.openCommit}>Open</button>
      </div>
    )
  }
}

export default CommitsListItem;