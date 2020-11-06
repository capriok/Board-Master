/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import SocketJoin from './components/socket-join'
import SocketRoom from './components/socket-room'

const App = () => {
  return (
    <div className="App">
      <Router>
        <Route exact path='/' render={() => (
          <SocketJoin />
        )} />
        <Route path='/room/name=:name&room=:room' render={(props) => (
          <SocketRoom params={props.match.params} />
        )} />
      </Router>
    </div>
  );
}

export default App;
