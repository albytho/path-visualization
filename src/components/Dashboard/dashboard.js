import React, { Component } from 'react'
import Grid from '../Grid/grid';
import './dashboard.css';


export default class dashboard extends Component {
    render() {
        return (
            <div className='dashboard'>
                <nav className="navbar navbar-dark bg-primary">
                    <span className="navbar-brand mb-0 h1">Search Algorithm Visualization</span>
                </nav>
                <Grid/>
            </div>
        )
    }
}
