import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import LandingPageNavbar from '../../LandingPage/LandingPageNavbar.jsx'

class AcountSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
  }

  render() {
    return (
      <div className="accountSettingsContainer">
        <LandingPageNavbar landingHistory={this.props.history}/>
        <div className="accountSettingsNavTitleContainer">
            Account Settings
        </div> 
      </div>
    )
  }
}

export default AcountSettings;