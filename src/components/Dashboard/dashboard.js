import React, { Component } from 'react'
import Grid from '../Grid/Grid';
import './Dashboard.css';


export default class Dashboard extends Component {
    render() {
        return (
            <div className='dashboard'>
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <a className="navbar-brand" href="#">Search Algorithm Visualization</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div>
                        <div className="navbar-nav">
                            <div className="dropdown">
                                <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Select Algorithm
                                </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a className="dropdown-item">Depth First Search</a>
                                    <a className="dropdown-item">Breadth First Search</a>
                                </div>
                            </div>
                            <button type="button" className="btn btn-success">Animate</button>
                            <button type="button" className="btn btn-danger">Reset</button>
                        </div>
                    </div>
                </nav>
                <Grid />
            </div>
        )
    }
}
