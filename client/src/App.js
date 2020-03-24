import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";

import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Routes from './components/routing/Routes'


const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
    // eslint-disable-next-line
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
          <Route exact path="/" component={Landing}></Route>
          <Route component = {Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
