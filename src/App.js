import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';

import Mousetrack from './components/Mousetrack';
import Counter from './components/Counter';
import PureComponent from './components/PureComponent';

const Home = () => {
  return (
    <div>
      <h1>Hei</h1>
    </div>
  );
};

const App = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/mousetrack">
            Track mouse movements with RxJS and recompose
          </Link>
        </li>
        <li>
          <Link to="/counter">Simple counter using component from stream</Link>
        </li>
        <li>
          <Link to="/purecomponent">Pure component with typewriter effect</Link>
        </li>
      </ul>

      <Route exact path="/" component={Home} />
      <Route path="/mousetrack" component={Mousetrack} />
      <Route path="/counter" component={Counter} />
      <Route path="/purecomponent" component={PureComponent} />
    </div>
  </Router>
);

export default App;