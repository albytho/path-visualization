import React, { Component } from 'react'
import './node.css';

export default class node extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {row, col, isStart, isEnd, visited, extraClassName} = this.props;

        return (
            <div id={`node-${row}-${col}`} className={`node ${extraClassName}`}></div>
        )
    }
}
