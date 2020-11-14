/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './components/common/home'
import Room from './components/common/room'

const App = () => {
  return (
    <div className="app">
      <Router>
        <Route exact path='/' render={() => (
          <Home />
        )} />
        <Route path='/room/name=:name&room=:room' render={(props) => (
          <Room params={props.match.params} />
        )} />
      </Router>
    </div>
  );
}

export default App;
