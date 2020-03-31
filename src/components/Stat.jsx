import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import LinearDotsSpinner from "./Spinner";

const Stat = ({ country }) => {
  const chartBox = useRef(null);

  const [latestData, setLatestData] = useState(null);
  const [width, setWidth] = useState(null);
  const [history, setHistory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState(null);
  const [chartData, setChartData] = useState(null);
  const fetchCountryStats = c => {
    console.log(
      `https://coronavirus-monitor.p.rapidapi.com/coronavirus/latest_stat_by_country.php?country=${c}`
    );
    fetch(
      `https://coronavirus-monitor.p.rapidapi.com/coronavirus/latest_stat_by_country.php?country=${c}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
          "x-rapidapi-key": "4bd194c7c3msh243792fa599a167p122b21jsnc679503a4f68"
        }
      }
    )
      .then(d => d.json())
      .then(r => setLatestData(r.latest_stat_by_country[0]))
      .catch(err => {
        console.log(err);
      });
  };

  const fetchCountryHistory = c => {
    fetch(
      `https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_particular_country.php?country=${c}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
          "x-rapidapi-key": "4bd194c7c3msh243792fa599a167p122b21jsnc679503a4f68"
        }
      }
    )
      .then(d => d.json())
      .then(r => {
        let darr = r.stat_by_country;
        let dates = [];
        let data = [];
        darr.map((v, i) => {
          dates.push(v.record_date.substring(0, 10));
          data.push({
            date: v.record_date,
            total_cases: parseInt(v.total_cases.replace(",", "")),
            total_recovered: parseInt(v.total_recovered.replace(",", "")),
            total_deaths: parseInt(v.total_deaths.replace(",", ""))
          });
        });
        setHistory(r);
        setChartData(data);
        setDates([...new Set(dates)]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    setWidth(chartBox.current.offsetWidth);
    console.log(width);
    fetchCountryStats(country);
    fetchCountryHistory(country);

    return () => {
      setLatestData(null);
      setChartData(null);
      setHistory(null);
      setDates(null);
    };
  }, [country]);
  useEffect(() => {
    if (selectedDate) {
      let data = [];
      history.stat_by_country.forEach(v => {
        if (v.record_date.substring(0, 10) === selectedDate) {
          console.log("match", v.record_date.substring(0, 10), selectedDate);
          data.push({
            date: v.record_date,
            total_cases: parseInt(v.total_cases.replace(",", "")),
            total_recovered: parseInt(v.total_recovered.replace(",", "")),
            total_deaths: parseInt(v.total_deaths.replace(",", ""))
          });
        }
      });

      setChartData(data);
    }

    return () => {};
  }, [selectedDate]);

  return (
    <div className="container">
      <div className=" text-center col-12">
        <h2>{country}</h2>
      </div>
      <div className="col-12">
        {latestData ? (
          <div className="container">
            <div className="row">
              <div className="col-12 my-3">
                <Link to="/">Back to Home</Link>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 col-sm-6">
                <div class="alert alert-warning text-center" role="alert">
                  <h5>Total Cases</h5>
                  <p>{latestData.total_cases}</p>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div class="alert alert-success text-center" role="alert">
                  <h5>Total Recovered</h5>
                  <p>{latestData.total_recovered}</p>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div class="alert alert-danger text-center" role="alert">
                  <h5>Total Deaths</h5>
                  <p>{latestData.total_deaths}</p>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div class="alert alert-info text-center" role="alert">
                  <h5>New Cases</h5>
                  <p>{latestData.new_cases}</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <div class="alert alert-primary text-center" role="alert">
                  <h5>Active Cases</h5>
                  <p>{latestData.active_cases}</p>
                </div>
              </div>
              <div className="col-md-6 col-sm-6">
                <div class="alert alert-secondary text-center" role="alert">
                  <h5>Updated @</h5>
                  <p>{latestData.record_date}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <LinearDotsSpinner />
        )}
      </div>

      <div className="container">
        <div className="row">
          <div className="col-12">
            {dates ? (
              <div class="input-group w-75 mx-auto mb-3">
                <div class="input-group-prepend">
                  <label class="input-group-text">View by Date</label>
                </div>
                <select
                  class="custom-select"
                  onChange={e => setSelectedDate(e.target.value)}
                >
                  <option selected>Choose...</option>
                  {dates ? (
                    dates.map(d => {
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
              </div>
            ) : (
              <LinearDotsSpinner />
            )}
          </div>
        </div>
      </div>
      <div className="col-12 d-flex justify-content-center" ref={chartBox}>
        {chartData ? (
          <LineChart
            width={width}
            height={400}
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_cases" stroke="#8884d8" />
            <Line type="monotone" dataKey="total_recovered" stroke="#68A227" />
            <Line type="monotone" dataKey="total_deaths" stroke="#F04726" />
          </LineChart>
        ) : (
          <LinearDotsSpinner />
        )}
      </div>
    </div>
  );
};

export default Stat;
