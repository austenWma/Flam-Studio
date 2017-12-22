import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import CommitsListItem from './CommitsListItem.jsx'

import $ from 'jquery'

const fs = window.require('fs-extra')
var remote = window.require('electron').remote

import { firebaseRef } from '../../Firebase/firebase.js'
import * as firebase from 'firebase'
const db = firebase.database()

class CommitsList extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <h1>Flam Studio</h1>
        <div>
            <ProjectsList />
        </div>
      </div>
    )
  }
}

export default CommitsList;