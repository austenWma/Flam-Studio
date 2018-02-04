import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import LandingPageNavbar from '../../LandingPage/LandingPageNavbar.jsx'

class YourProfile extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
  }

  render() {
    return (
      <div className="yourProfileContainer">
        <LandingPageNavbar landingHistory={this.props.history}/>
        <div className="yourProfileNavTitleContainer">
            Profile
        </div> 
      </div>
    )
  }
}

export default YourProfile;