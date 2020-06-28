import React, { Component } from 'react';
import Node from '../Node/node';
import './grid.css'

export default class grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: []
        }
    }

    componentDidMount() {
        const grid = []
        for(let rowIndex = 0; rowIndex<20; rowIndex++){
            const currRow = []
            for(let colIndex = 0; colIndex<40; colIndex++){
                const currNode = {
                    isStart: false,
                    isEnd: false,
                    visited: false,
                    row: rowIndex,
                    col: colIndex,
                    extraClassName: null
                }

                currRow.push(currNode)
            }
            grid.push(currRow)
        }

        this.setState({grid: grid});
        console.log(grid.length)
        console.log(grid[0].length)
    }

    render() {
        return (
            <div className='grid'>
                {this.state.grid.map((row, rowIndex) => {
                    return(
                        <div className='gridRow' key={rowIndex}>
                            {row.map((node, nodeIndex) => {
                                const {isStart, isEnd, visited, row, col, extraClassName} = node;
                                return(
                                    <Node className='gridCol' key={nodeIndex} isStart={isStart} isEnd={isEnd} visited={visited} row={row} col={col} extraClassName={extraClassName} />
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }
}
