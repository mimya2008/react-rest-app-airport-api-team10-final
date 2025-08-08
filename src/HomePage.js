import React, { Component } from 'react';
import planeImage from './plane.jpg';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: [],
      selectedAirport: ""
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

  render() {
    return (
      <div className="App d-flex flex-column min-vh-100">
        <nav className="navbar navbar-light bg-light px-4">
          <span className="navbar-brand mb-0 h1">Airport Flight Tracker</span>
          <a href="/admindashboard" className="btn btn-primary">Admin</a>
        </nav>

        <div className="container text-center my-5">
          <select
            className="form-select w-50 mx-auto mb-4"
            value={this.state.selectedAirport}
            onChange={this.handleAirportChange}
          >
            <option value="">Select an Airport</option>
            {this.state.cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>

          <div className="d-flex justify-content-center gap-3 mb-5">
            <button className="btn btn-success">View Arrivals</button>
            <button className="btn btn-info">View Departures</button>
          </div>

          <img
            src={planeImage}
            alt="Airplane"
            className="img-fluid"
            style={{ maxHeight: '300px' }}
          />
        </div>

        <footer className="bg-light text-center py-3 mt-auto">
          All rights reserved @Airport Flight Tracker
        </footer>
      </div>
    );
  }
}

export default HomePage;
