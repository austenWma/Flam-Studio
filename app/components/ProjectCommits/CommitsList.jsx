import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import CommitsListItem from './CommitsListItem.jsx'

const fs = window.require('fs-extra')
var remote = window.require('electron').remote

class CommitsList extends Component {
  constructor (props) {
    super(props)
    this.state = {
		};
		this.goBackToProjects = this.goBackToProjects.bind(this)
	}

	goBackToProjects() {
		this.props.history.push('/ProjectsPage')
	}

	// Splitting at ,https to create a unique break point for the string

  render() {
    return (
      <div>
        <h1>Flam Studio</h1>
				<h2>{localStorage.getItem('current_commits_project')}</h2>
				<div>
				{localStorage.getItem('current_commits_list').split(',https://').slice(1).map(commit =>
					<CommitsListItem commitDescription={commit.split(' | ')[1]} commitLink={commit.split(' | ')[0]}/> 
				)}
				</div>
				<div>
					<button onClick={this.goBackToProjects}>Back</button>
				</div>
      </div>
    )
  }
}

export default CommitsList;