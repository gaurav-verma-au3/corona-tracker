import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LinearDotsSpinner from "./Spinner";
import Stat from "./Stat";

const Dashboard = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currentStat, setCurrentStat] = useState(null);
  const fetchCountries = () => {
    fetch(
      "https://coronavirus-monitor.p.rapidapi.com/coronavirus/affected.php",
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
          "x-rapidapi-key": "4bd194c7c3msh243792fa599a167p122b21jsnc679503a4f68"
        }
      }
    )
      .then(d => d.json())
      .then(c => {
        let cnt = c.affected_countries;
        cnt = cnt.sort();
        setCountries(cnt);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const fetchStat = () => {
    console.log("fetching stats");
    fetch(
      "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php",
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
          "x-rapidapi-key": "4bd194c7c3msh243792fa599a167p122b21jsnc679503a4f68"
        }
      }
    )
      .then(d => d.json())
      .then(c => {
        setCurrentStat(c);
        console.log(c);
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchCountries();
    fetchStat();
  }, []);

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="container">
            <div className="row">
              <div className="col-12">
                {currentStat ? (
                  <div className="container">
                    <div className="row">
                      <div className="col-md-3 col-sm-6">
                        <div
                          class="alert alert-warning text-center"
                          role="alert"
                        >
                          <h5>Total Cases</h5>
                          <p>{currentStat.total_cases}</p>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div
                          class="alert alert-success text-center"
                          role="alert"
                        >
                          <h5>Total Recovered</h5>
                          <p>{currentStat.total_recovered}</p>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div
                          class="alert alert-danger text-center"
                          role="alert"
                        >
                          <h5>Total Deaths</h5>
                          <p>{currentStat.total_deaths}</p>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <div class="alert alert-info text-center" role="alert">
                          <h5>New Cases</h5>
                          <p>{currentStat.new_cases}</p>
                        </div>
                      </div>
                      <div className="col-12 text-center">
                        <small className="font-weight-bold">
                          Updated @ : {currentStat.statistic_taken_at}
                        </small>
                      </div>
                    </div>
                  </div>
                ) : (
                  <LinearDotsSpinner />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 my-3">
          {console.log(countries)}
          {countries ? (
            <select
              class="custom-select"
              onChange={e => setSelectedCountry(e.target.value)}
            >
              <option selected value={null}>Choose...</option>
              {countries ? (
                countries.map(d => {
                  return (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  );
                })
              ) : (
                <LinearDotsSpinner />
              )}
            </select>
          ) : (
            <LinearDotsSpinner />
          )}
        </div>
        <div className="col-12 my-3">
          {selectedCountry ? (
            <Stat country={selectedCountry} />
          ) : (
            <h6 className="text-center text-info">Select a Country from above Dropdown Menu</h6>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
