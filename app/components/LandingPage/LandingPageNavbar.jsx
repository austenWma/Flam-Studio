import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import IconMenu from 'material-ui/IconMenu';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import Divider from 'material-ui/Divider';
import Download from 'material-ui/svg-icons/file/file-download';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { firebaseRef } from '../../Firebase/firebase.js'
import * as firebase from 'firebase'
const db = firebase.database()

import $ from 'jquery'

class LandingPageNavbar extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
    this.logOut = this.logOut.bind(this)
    this.goToProjectsPage = this.goToProjectsPage.bind(this)
    this.goToHome = this.goToHome.bind(this)
  }

  logOut() {
    firebase.auth().signOut().then(() => {
      localStorage.setItem('access_token', null)
      this.props.landingHistory.push('/')
    })
  }

  goToProjectsPage() {
    this.props.landingHistory.push('/ProjectsPage')
  }

  goToHome() {
    this.props.landingHistory.push('/LandingPage')
  }

  render() {
    return (
      <div className="landingNavbarContainer">
        <div className="landingNavLogo">
					<img src={'http://i66.tinypic.com/2zgu68p.png'} style={{height: '90px', width: '90px'}} />
        </div>
        <div className="landingNavSettings">
          <MuiThemeProvider>
            <DropDownMenu underlineStyle={{display: 'none'}} iconButton={<IconButton 
              iconStyle={{width: 30, height: 30, float: 'right', marginTop: -2.5, color: 'grey', marginRight: 7.5}}
            >
              <SettingsIcon />
            </IconButton>}
            iconStyle={{}}>
              <MenuItem primaryText="Your Profile"/>
              <MenuItem primaryText="Account Settings"/>
              <Divider />
              <MenuItem primaryText="Sign Out" onClick={this.logOut}/>
              <Divider />
            </DropDownMenu>
          </MuiThemeProvider>
        </div>
        <div className="landingNavItems">
          <div className="landingNavItem" onClick={this.goToHome}>
            Home
          </div>
          <div className="landingNavItem" onClick={this.goToProjectsPage}>
            Studio
          </div>
        </div>
      </div>
    )
  }
}

export default LandingPageNavbar;