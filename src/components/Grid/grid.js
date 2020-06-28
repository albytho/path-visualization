import React, { Component } from 'react';
import Node from '../Node/node';
import './grid.css'

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            isMouseClicked: false
        }
    }

    handleMouseDown = (row, col) => {
        const newGrid = this.state.grid.slice();
        newGrid[row][col].isWall = !newGrid[row][col].isWall;
        this.setState({grid: newGrid, isMouseClicked: !this.state.isMouseClicked})
    }

    handleMouseEnter = (row, col) => {
        if(this.state.isMouseClicked) {
            const newGrid = this.state.grid.slice();
            newGrid[row][col].isWall = true;
            this.setState({grid: newGrid}) 
        }
    }

    handleMouseUp = () => {
        this.setState({isMouseClicked: false});
    }

    componentDidMount() {
        const grid = []
        for(let rowIndex = 0; rowIndex<30; rowIndex++){
            const currRow = []
            for(let colIndex = 0; colIndex<60; colIndex++){
                const currNode = {
                    isStart: rowIndex === START_NODE_ROW & colIndex === START_NODE_COL,
                    isEnd: rowIndex === FINISH_NODE_ROW & colIndex === FINISH_NODE_COL,
                    visited: false,
                    isWall: false,
                    row: rowIndex,
                    col: colIndex
                }

                currRow.push(currNode)
            }
            grid.push(currRow)
        }

        this.setState({grid: grid});
    }

    render() {
        return (
            <div className='grid'>
                {this.state.grid.map((row, rowIndex) => {
                    return(
                        <div className='gridRow' key={rowIndex}>
                            {row.map((node, nodeIndex) => {
                                const {isStart, isEnd, visited, isWall, row, col, extraClassName} = node;
                                return(
                                    <Node 
                                    className='gridCol' 
                                    key={nodeIndex} 
                                    isStart={isStart} 
                                    isEnd={isEnd} 
                                    visited={visited} 
                                    isWall={isWall} 
                                    row={row} 
                                    col={col} 
                                    handleMouseDown = {(row, col) => this.handleMouseDown(row, col)}
                                    handleMouseEnter = {(row, col) => this.handleMouseEnter(row, col)}
                                    handleMouseUp = {() => this.handleMouseUp()}
                                    />
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }
}
