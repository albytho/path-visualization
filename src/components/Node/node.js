import React, { Component } from 'react'
import './node.css';

export default class node extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {row, col, isStart, isEnd, isWall, visited, handleClick} = this.props;
        const extraClassName = isStart ? 'start-node' : isWall ? 'wall-node' : isEnd ? 'end-node' : '';

        return (
            <div id={`node-${row}-${col}`} className={`node ${extraClassName}`} onClick={() => handleClick(row, col)}></div>
        )
    }
}
