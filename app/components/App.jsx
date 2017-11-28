import React, {Component} from 'react';
import {render} from 'react-dom';
import { HashRouter, Route, Switch, PropsRoute } from 'react-router-dom';

import LandingPage from './LandingPage/LandingPage.jsx'
import Login from './Login/Login.jsx'
import SignUp from './Login/SignUp.jsx'
import ProjectsPage from './ProjectsPage/ProjectsPage.jsx'

class App extends Component {
  constructor (props) {
    super(props)
  }

  render() {
    return (
      <div>
        <HashRouter>
          <Switch>
            <Route exact path="/" component={Login}/>
            <Route exact path="/SignUp" component={SignUp}/>
            <Route exact path="/LandingPage" component={LandingPage}/>
            <Route exact path="/ProjectsPage" component={ProjectsPage}/>
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default App;
