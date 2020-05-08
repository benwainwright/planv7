import React, { ReactElement } from "react";

import { Route, Switch } from "react-router-dom";

import Header from "./Header";
import Home from "../pages/Home";
import Plans from "../pages/Plans";
import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import Alerts from "./alerts";
import Footer from "./Footer";
import "../styles/index.css";
import "./App.css";

const App = (): ReactElement => {
  return (
    <section id="app">
      <Header />
      <Alerts />
      <main>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={LoginForm} />
          <Route path="/plans" component={Plans} />
          <Route path="/register" component={RegisterForm} />
        </Switch>
      </main>
      <Footer />
    </section>
  );
};

export default App;
