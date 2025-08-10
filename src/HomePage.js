import React, { Component } from 'react';
import FlightBoard from './components/FlightBoard';
import planeImage from './plane.jpg';
import './components/styles.css';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      airports: [],
      selectedAirport: '',
      view: ''
    };
  }

  componentDidMount() {
    fetch('http://localhost:8080/airport')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch airports');
        return res.json();
      })
      .then(airports => this.setState({ airports }))
      .catch(err => console.error(err));
  }

  handleAirportChange = (e) => {
    this.setState({ selectedAirport: e.target.value });
  };

  showArrivals = () => this.setState({ view: 'arrivals' });
  showDepartures = () => this.setState({ view: 'departures' });

  render() {
    const { selectedAirport, view, airports } = this.state;

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
            {airports.map(ap => (
              <option key={ap.id} value={ap.name}>
                {ap.name} ({ap.code})
              </option>
            ))}
          </select>

          <div className="d-flex justify-content-center gap-3 mb-5 action-buttons">
            <button className="btn-arrivals" onClick={this.showArrivals} disabled={!selectedAirport}>
              View Arrivals
            </button>
            <button className="btn-departures" onClick={this.showDepartures} disabled={!selectedAirport}>
              View Departures
            </button>
          </div>

          {view && selectedAirport && (
            <FlightBoard
              selectedAirportName={selectedAirport}
              view={view}
            />
          )}

          <img
            src={planeImage}
            alt="Airplane"
            className="img-fluid plane-image"
            width="800"
            height="600"
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
