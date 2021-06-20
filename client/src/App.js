import React from "react";
import Header from "./components/Header/Header";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navigation/Navbar";
import {BrowserRouter as Router} from "react-router-dom"
import "./App.css";
import routes from "./routes";


function App() {
  return (
    <Router>
    <div className="app">
    <Header />
    <div className="app-body">
      <Navbar />
      <Switch>
        {routes.map((prop, key) => {
          return (
            <Route
              exact
              path={prop.path}
              component={prop.component}
              key={key}
            />
          );
        })}
      </Switch>
    </div>
  </div>
  </Router>
  );
}

export default App;
