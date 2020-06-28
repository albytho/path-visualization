import React, { Component } from 'react'
import './node.css';

export default class node extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {row, col, isStart, isEnd, isWall, visited, handleMouseDown, handleMouseEnter, handleMouseUp} = this.props;
        const extraClassName = isStart ? 'start-node' : isWall ? 'wall-node' : isEnd ? 'end-node' : '';

        return (
            <div id={`node-${row}-${col}`} className={`node ${extraClassName}`} onMouseDown={() => handleMouseDown(row, col)} onMouseEnter={() => handleMouseEnter(row, col)} onMouseUp={() => handleMouseUp()}></div>
        )
    }
}
