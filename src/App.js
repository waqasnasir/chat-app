import './App.css';
import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import Chat from './pages/Chat';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import GroupChat from './pages/GroupChat';
import PersonalChat from './pages/PersonalChat';
import Home from './pages/Home';
import { auth } from './services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const [user] = useAuthState(auth());

  return (
    <Router>
      {
        user ?
          <Switch>
            {/* <Route exact path="/" component={Home} /> */}
            <Route
              path="/chat"
              component={Chat}
            />
             <Route
              path="/groupchat/:group"
              component={GroupChat}
            />
             <Route
              path="/personalchat/:receiverId"
              component={PersonalChat}
            />
            <Route component={() => <Redirect to={{ pathname: '/chat' }} />} />
          </Switch>
          :
          <Switch>
            {/* <Route exact path="/" component={Home} /> */}
            <Route
              path="/signup"
              component={Signup}
            />
            <Route
              path="/signin"
              component={Signin}
            />
            <Route
              path="/home"
              component={Home}
            />
            <Route component={() => <Redirect to={{ pathname: '/home' }} />} />
          </Switch>

      }

    </Router>
  );
}

export default App;
