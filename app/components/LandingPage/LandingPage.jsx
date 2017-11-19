import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import LandingPageNavbar from './LandingPageNavbar.jsx'
import LandingPageDropZone from './LandingPageDropZone.jsx'

import $ from 'jquery'

class LandingPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
		};
	}

  render() {
    return (
      <div>
        <div className="landingPageNavbarContainer">
            <LandingPageNavbar />
        </div>
        <div className="landingPageDropZoneContainer">
            <LandingPageDropZone />
        </div>
      </div>
    )
  }
}

export default LandingPage;