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
	}

  render() {
    return (
      <div>
				<div>{this.props.commitDescription}</div>
				<button>Open</button>
      </div>
    )
  }
}

export default CommitsListItem;