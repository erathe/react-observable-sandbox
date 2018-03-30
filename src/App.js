import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';

import Mousetrack from './components/Mousetrack';
import Counter from './components/Counter';
import PureComponent from './components/PureComponent';
import AjaxStream from './components/AjaxStream';
import SimpleForm from './components/SimpleForm';
import ButtonCounter from './components/ButtonCounter';
import CounterWithPropsStream from './components/counterWithPropsStream';
import todoList from './components/todoList';

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
        <li>
          <Link to="/ajaxstream">Stream component from ajax stream</Link>
        </li>
        <li>
          <Link to="/simpleform">Simple form input</Link>
        </li>
        <li>
          <Link to="/buttoncounter">Counter with buttons</Link>
        </li>
        <li>
          <Link to="/counterwithpropsstream">Counter prop stream</Link>
        </li>
        <li>
          <Link to="/todolist">Todo list</Link>
        </li>
      </ul>

      <Route exact path="/" component={Home} />
      <Route path="/mousetrack" component={Mousetrack} />
      <Route path="/counter" component={Counter} />
      <Route path="/purecomponent" component={PureComponent} />
      <Route path="/ajaxstream" component={AjaxStream} />
      <Route path="/simpleform" component={SimpleForm} />
      <Route path="/buttoncounter" component={ButtonCounter} />
      <Route
        path="/counterwithpropsstream"
        component={CounterWithPropsStream}
      />
      <Route path="/todolist" component={todoList} />
    </div>
  </Router>
);

export default App;
