import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <h1 className="text-center my-5 pt-5">
          "Do what you can, with what you have, from wherever you are."
        </h1>
        <Route exact path="/" component={Dashboard} />
        <div className="container">
          <h5 className="text-center my-4">
            Developed by{" "}
            <a href="https://gaurav-verma-au3.github.io" target="blank">
              Gaurav Verma
            </a>{" "}
            Data Source : avalon via{" "}
            <a
              href="https://rapidapi.com/astsiatsko/api/coronavirus-monitor/details"
              target="blank"
            >
              Rapid API
            </a>
          </h5>
        </div>
      </div>
    </Router>
  );
}

export default App;
