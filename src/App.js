/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Join from './components/Join'
import Room from './components/Room'

const App = () => {
  return (
    <div className="App">
      <Router>
        <Route exact path='/' render={() => (
          <Join />
        )} />
        <Route path='/room/name=:name&room=:room' render={(props) => (
          <Room params={props.match.params} />
        )} />
      </Router>
    </div>
  );
}

export default App;
