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
		this.syncCommit = this.syncCommit.bind(this)
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
			console.log('FIRING OPEN', shell.openItem(filePath))
			shell.openItem(filePath);
			setTimeout(() => { 
				shell.openItem(filePath.slice(0, filePath.length - 4))
			}, 4000)
		}, 3000)
	}

	syncCommit() {
		//1) iterate through 
	}

  render() {
    return (
      <div>
				<div className="commitInfo">
					<div>{this.props.commitDescription}</div>
					<div>{this.props.commitUser}</div>
				</div>
				<button onClick={this.openCommit}>Open</button>
      </div>
    )
  }
}

export default CommitsListItem;