import React, { Component } from 'react';
import Node from '../Node/node';
import './Grid.css'

const START_NODE_ROW = 9;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 9;
const FINISH_NODE_COL = 40;

export default class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            isMouseClicked: false,
            isSolved: false
        }
    }

    componentDidMount() {
        this.initiateEmptyGrid();
    }

    isValid(grid, row, col) {
        return row >= 0 && col >= 0 && row < grid.length && col < grid[0].length && grid[row][col].isWall === false && grid[row][col].visited === false
    }

    isStartOrEndLocation(row, col) {
        if ((row === START_NODE_ROW && col === START_NODE_COL) || (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)) {
            return true;
        }
        return false;
    }

    isStartOrEndNode(row, col) {
        return (row === START_NODE_ROW && col === START_NODE_COL) || (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
    }


    breadthFirstSearch() {
        const queue = [];
        const searchPath = [];
        const grid = this.state.grid.slice();

        queue.push([START_NODE_ROW, START_NODE_COL])
        searchPath.push([START_NODE_ROW, START_NODE_COL])
        grid[START_NODE_ROW][START_NODE_COL].visited = true;

        while (queue.length > 0) {
            const currNode = queue.shift();
            const currRow = currNode[0];
            const currCol = currNode[1];

            if (grid[currRow][currCol].isEnd) {
                break;
            }

            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
            directions.forEach((direction) => {
                const newRow = currRow + direction[0];
                const newCol = currCol + direction[1];

                if (this.isValid(grid, newRow, newCol)) {
                    queue.push([newRow, newCol])
                    searchPath.push([newRow, newCol])
                    grid[newRow][newCol].visited = true;
                }
            });
        }

        return searchPath;
    }

    depthFirstSearch() {
        let searchPath = this.depthFirstSearchHelper(this.state.grid, [START_NODE_ROW, START_NODE_COL], []);
        console.log(searchPath);

        let lastIndex = 0
        for (let i = 0; i < searchPath.length; i++) {
            const currNode = searchPath[i];
            const currRow = currNode[0];
            const currCol = currNode[1];

            if (currRow === FINISH_NODE_ROW && currCol === FINISH_NODE_COL) {
                lastIndex = i;
                break;
            }
        }
        return searchPath.slice(0, lastIndex + 1);
    }

    depthFirstSearchHelper(grid, currNode, searchPath) {
        if (currNode[0] === FINISH_NODE_ROW && currNode[1] === FINISH_NODE_COL) {
            searchPath.push(currNode);
        }
        else {
            const currRow = currNode[0];
            const currCol = currNode[1];

            grid[currRow][currCol].visited = true;
            searchPath.push(currNode);

            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
            directions.forEach((direction) => {
                const newRow = currRow + direction[0];
                const newCol = currCol + direction[1];

                if (this.isValid(grid, newRow, newCol)) {
                    this.depthFirstSearchHelper(grid, [newRow, newCol], searchPath);
                }
            });

            return searchPath;
        }
    }

    handleAnimation() {
        const searchPath = this.breadthFirstSearch();
        this.animatePath(searchPath);
    }

    animatePath(searchPath) {
        for (let i = 0; i < searchPath.length; i++) {
            const currRow = searchPath[i][0];
            const currCol = searchPath[i][1];
            setTimeout(() => {
                if (this.isStartOrEndNode(currRow, currCol)) {
                    this.state.isSolved = true;
                    return;
                }

                document.getElementById(`node-${currRow}-${currCol}`).className = 'node visited-node';
            }, i * 5)
        }
    }

    initiateEmptyGrid() {
        const grid = []
        for (let rowIndex = 0; rowIndex < 20; rowIndex++) {
            const currRow = []
            for (let colIndex = 0; colIndex < 50; colIndex++) {
                const currNode = {
                    isStart: rowIndex === START_NODE_ROW & colIndex === START_NODE_COL,
                    isEnd: rowIndex === FINISH_NODE_ROW & colIndex === FINISH_NODE_COL,
                    visited: false,
                    isWall: false,
                    row: rowIndex,
                    col: colIndex
                }

                if (document.getElementById(`node-${rowIndex}-${colIndex}`) !== null && !this.isStartOrEndLocation(rowIndex, colIndex)) {
                    document.getElementById(`node-${rowIndex}-${colIndex}`).className = 'node';
                }

                currRow.push(currNode)
            }
            grid.push(currRow)
        }

        this.setState({ grid: grid, isSolved: false });
    }

    handleMouseDown = (row, col) => {
        if (this.state.isSolved === false && !this.isStartOrEndNode(row, col)) {
            const newGrid = [...this.state.grid];
            newGrid[row][col].isWall = !newGrid[row][col].isWall;
            document.getElementById(`node-${row}-${col}`).className = newGrid[row][col].isWall ? 'node wall-node' : document.getElementById(`node-${row}-${col}`).className;
            this.setState({ grid: newGrid, isMouseClicked: !this.state.isMouseClicked });
        }
    }

    handleMouseEnter = (row, col) => {
        if (this.state.isMouseClicked && !this.isStartOrEndNode(row, col)) {
            const newGrid = this.state.grid.slice();
            newGrid[row][col].isWall = true;
            this.setState({ grid: newGrid });
            document.getElementById(`node-${row}-${col}`).className = 'node wall-node';
        }
    }

    handleMouseUp = () => {
        if (this.state.isSolved === false) {
            this.setState({ isMouseClicked: false });
        }
    }

    render() {
        return (
            <>
                <button type="button" className="btn btn-success" onClick={this.handleAnimation.bind(this)}>Animate</button>
                <button type="button" className="btn btn-secondary" onClick={this.initiateEmptyGrid.bind(this)}>Reset</button>
                <div className='grid'>
                    {this.state.grid.map((row, rowIndex) => {
                        return (
                            <div className='gridRow' key={rowIndex}>
                                {row.map((node, nodeIndex) => {
                                    const { isStart, isEnd, visited, isWall, row, col } = node;
                                    return (
                                        <Node
                                            className='gridCol'
                                            key={rowIndex + ' ' + nodeIndex}
                                            isStart={isStart}
                                            isEnd={isEnd}
                                            visited={visited}
                                            isWall={isWall}
                                            row={row}
                                            col={col}
                                            handleMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            handleMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                            handleMouseUp={() => this.handleMouseUp()}
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
