import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import ProjectsList from './ProjectsList.jsx'

import $ from 'jquery'

class ProjectsPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
    this.goToHomePage = this.goToHomePage.bind(this)
  }

  goToHomePage() {
    this.props.history.push('/LandingPage')
  }

  render() {
    return (
      <div>
        <h1>Flam Studio</h1>
        <button onClick={this.goToHomePage}>Home Page</button>
        <div>
            <ProjectsList />
        </div>
      </div>
    )
  }
}

export default ProjectsPage;