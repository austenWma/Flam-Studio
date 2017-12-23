import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import ProjectsList from './ProjectsList.jsx'
import LandingPageNavbar from '../LandingPage/LandingPageNavbar.jsx'

import $ from 'jquery'

class ProjectsPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <LandingPageNavbar landingHistory={this.props.history}/>
        <div>
            <ProjectsList projectsPageHistory={this.props.history}/>
        </div>
      </div>
    )
  }
}

export default ProjectsPage;