import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from 'components/common/home'
import Room from 'components/common/room'

const App: React.FC = () => {
  return (
    <div className="app" >
      <Router>
        <Route exact path='/' render={() => (
          <Home />
        )} />
        <Route path='/room/name=:name&room=:room' render={({ match }) => (
          <Room name={match.params.name} room={match.params.room} />
        )} />
      </Router>
    </div>
  )
}

export default App;
