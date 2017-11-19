import React, {Component} from 'react'
import {render} from 'react-dom'
import {Redirect, Link} from 'react-router-dom'

import $ from 'jquery'

class LandingPageNavbar extends Component {
  constructor (props) {
    super(props)
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <h1>Flam Studio</h1>
      </div>
    )
  }
}

export default LandingPageNavbar;