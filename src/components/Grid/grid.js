import React, { Component, Fragment } from 'react';
import Node from '../Node/node';
import './grid.css'

const START_NODE_ROW = 3;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 15;

export default class grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            isMouseClicked: false
        }
    }

    componentDidMount() {
        const grid = []
        for(let rowIndex = 0; rowIndex<30; rowIndex++){
            const currRow = []
            for(let colIndex = 0; colIndex<30; colIndex++){
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

    animatePath(searchPath) {
        for(const currNode of searchPath){
            const currRow = currNode[0];
            const currCol = currNode[1];
            const newGrid = [...this.state.grid];
            newGrid[currRow][currCol].visited = true;
            this.setState({grid: newGrid});
        }
    }

    isValid(grid, row, col) {
        return row >= 0 && col >= 0 && row < grid.length && col < grid[0].length && grid[row][col].isWall === false && grid[row][col].visited === false
    }


    depthFirstSearch() {
        const queue = [];
        const searchPath = [];
        let grid = [...this.state.grid];

        queue.push([START_NODE_ROW, START_NODE_COL])
        searchPath.push([START_NODE_ROW, START_NODE_COL])
        grid[START_NODE_ROW][START_NODE_COL].visited = true;

        while(queue.length > 0){
            const currNode = queue.shift();
            const currRow = currNode[0];
            const currCol = currNode[1];

            if(grid[currRow][currCol].isEnd) {
                break;
            }

            const directions = [[0,1],[1,0],[0,-1],[-1,0]];
            directions.forEach((direction) => {
                const newRow = currRow+direction[0];
                const newCol = currCol+direction[1];

                if(this.isValid(grid, newRow, newCol)) {
                    queue.push([newRow, newCol])
                    searchPath.push([newRow, newCol])
                    grid[newRow][newCol].visited = true;
                }
            })
        }

        return searchPath;
    }

    handleAnimation = () => {
        const searchPath = this.depthFirstSearch();
        this.animatePath(searchPath);
    }

    handleMouseDown = (row, col) => {
        const newGrid = [...this.state.grid];
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

    render() {
        return (
            <>
                <button type="button" className="btn btn-primary" onClick={this.handleAnimation}>Animate</button>
                <div className='grid'>
                    {this.state.grid.map((row, rowIndex) => {
                        return(
                            <div className='gridRow' key={rowIndex}>
                                {row.map((node, nodeIndex) => {
                                    const {isStart, isEnd, visited, isWall, row, col} = node;
                                    return(
                                        <Node 
                                        className='gridCol' 
                                        key={rowIndex + ' ' + nodeIndex} 
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
            </>
        )
    }
}
