import React, { Component } from 'react';
import FlightBoard from './components/FlightBoard';
import planeImage from './plane.jpg';
import './components/styles.css';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: [],
      selectedAirport: "",
      view: ""
    };
  }

  componentDidMount() {
    fetch('http://localhost:8080/cities')
      .then(res => res.json())
      .then(cities => this.setState({ cities }));
  }

  handleAirportChange = (e) => {
    this.setState({ selectedAirport: e.target.value });
  };

  showArrivals = () => {
    this.setState({ view: 'arrivals' });
  };

  showDepartures = () => {
    this.setState({ view: 'departures' });
  };

  render() {
    const { selectedAirport, view } = this.state;

    return (
      <div className="homepage d-flex flex-column min-vh-100 homepage-container">
        <header className="header">
          <h1 className="homepage-title">Airport Flight Tracker</h1>
          <a href="/admindashboard" className="admin-button">Admin</a>
        </header>

        <div className="container text-center my-5 homepage-content">
          <select
            className="form-select w-50 mx-auto mb-4 airport-select"
            value={selectedAirport}
            onChange={this.handleAirportChange}
          >
            <option value="">Select an Airport</option>
            {this.state.cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>

          <div className="d-flex justify-content-center gap-3 mb-5 action-buttons">
            <button
              className="btn-arrivals"
              onClick={this.showArrivals}
              disabled={!selectedAirport}
            >
              View Arrivals
            </button>
            <button
              className="btn-departures"
              onClick={this.showDepartures}
              disabled={!selectedAirport}
            >
              View Departures
            </button>
          </div>


          {view && selectedAirport && (
            <FlightBoard
              selectedCityName={selectedAirport}
              view={view}
            />
          )}

          <img
            src={planeImage}
            alt="Airplane"
            className="img-fluid plane-image"
            width='800px'
            height='600px'
          />
        </div>

        <footer className="footer">
            &copy; {new Date().getFullYear()} Airport Flight Tracker. All rights reserved.
        </footer>

      </div>
    );
  }
}

export default HomePage;
