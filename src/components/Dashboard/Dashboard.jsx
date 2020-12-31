import React, { Component } from 'react'
import './Dashboard.css';
import Node from '../Node/Node.jsx';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            isMouseClicked: false,
            isSolved: false,
            selectedSearchAlgorithm: 'Select a Search Algorithm',
            userAnimatesBeforeAlgorithmSelectionError: false,
            startNodeRow: null,
            startNodeCol: null,
            endNodeRow: null,
            endNodeCol: null,
        }
    }

    //hello
    componentDidMount() {
        this.initiateEmptyGrid();
    }

    isValid(grid, row, col) {
        return row >= 0 && col >= 0 && row < grid.length && col < grid[0].length && grid[row][col].isWall === false && grid[row][col].visited === false;
    }

    isStartOrEndNode(row, col) {
        return (row === this.state.startNodeRow && col === this.state.startNodeCol) || (row === this.state.endNodeRow && col === this.state.endNodeCol);
    }

    initiateEmptyGrid() {
        console.log(window.outerHeight, window.outerWidth)
        let grid = []
        for (let rowIndex = 0; rowIndex < window.outerHeight / 50; rowIndex++) {
            const currRow = []
            for (let colIndex = 0; colIndex < window.outerWidth / 80; colIndex++) {
                const currNode = {
                    isStart: false,
                    isEnd: false,
                    visited: false,
                    isWall: false,
                    row: rowIndex,
                    col: colIndex,
                    mostRecentParentNode: null
                }

                if (document.getElementById(`node-${rowIndex}-${colIndex}`) !== null) {
                    document.getElementById(`node-${rowIndex}-${colIndex}`).className = 'node';
                }

                currRow.push(currNode)
            }
            grid.push(currRow)
        }

        this.setState({ grid: grid, isSolved: false, startNodeRow: null, startNodeCol: null, endNodeRow: null, endNodeCol: null });
    }

    breadthFirstSearch() {
        const queue = [];
        const searchPath = [];
        const grid = this.state.grid.slice();
        const startNode = [this.state.startNodeRow, this.state.startNodeCol];

        queue.push([startNode[0], startNode[1]])
        searchPath.push([startNode[0], startNode[1]])
        grid[startNode[0]][startNode[1]].visited = true;

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
        const startNode = [this.state.startNodeRow, this.state.startNodeCol]
        const grid = [...this.state.grid]
        const searchPath = []

        let stack = [];
        stack.push(startNode);
        while (stack.length > 0) {
            const currNode = stack.pop();
            const currRow = currNode[0];
            const currCol = currNode[1];

            if (grid[currRow][currCol].visited === false) {
                grid[currRow][currCol].visited = true;
                searchPath.push(currNode);

                if (currRow === this.state.endNodeRow && currCol === this.state.endNodeCol) {
                    this.setState({ grid: grid });
                    return searchPath;
                }

                const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                directions.forEach((direction) => {
                    const newRow = currRow + direction[0];
                    const newCol = currCol + direction[1];
                    if (this.isValid(grid, newRow, newCol)) {
                        grid[newRow][newCol].mostRecentParentNode = [currRow, currCol];
                        stack.push([newRow, newCol]);
                    }
                });
            }
        }
        this.setState({ grid: grid });
        return searchPath;
    }

    handleAnimation() {
        let searchPath = null;
        switch (this.state.selectedSearchAlgorithm) {
            case 'Breadth First Search':
                searchPath = this.breadthFirstSearch();
                break;
            case 'Depth First Search':
                searchPath = this.depthFirstSearch();
                break;
            default:
                this.setState({ userAnimatesBeforeAlgorithmSelectionError: true }, () => {
                    setTimeout(() => {
                        this.setState({ userAnimatesBeforeAlgorithmSelectionError: false })
                    }, 5000);
                });
                return;
        };
        this.animatePath(searchPath);
    }

    animatePath(searchPath) {
        let nextStartTime = null;
        for (let i = 0; i < searchPath.length; i++) {
            const currRow = searchPath[i][0];
            const currCol = searchPath[i][1];
            setTimeout(() => {
                if (!this.isStartOrEndNode(currRow, currCol)) {
                    document.getElementById(`node-${currRow}-${currCol}`).className = 'node visited-node';
                }
            }, i * 10)
            nextStartTime = i * 10;
        }

        this.setState({ isSolved: true });
    }

    getNodesInPathOrder(endNode) {
        let count = 1
        let parentNodeLocation = endNode.mostRecentParentNode;
        while (parentNodeLocation !== null) {
            document.getElementById(`node-${parentNodeLocation[0]}-${parentNodeLocation[1]}`).className = 'node path-node';
            parentNodeLocation = this.state.grid[parentNodeLocation[0]][parentNodeLocation[1]].mostRecentParentNode;
            if (parentNodeLocation === null || parentNodeLocation[0] === this.state.startNodeRow && parentNodeLocation[0] === this.state.startNodeCol) {
                return;
            }
        }
    }

    handleMouseDown = (row, col) => {
        const isStartNodeSet = this.state.startNodeRow === null ? false : true;
        const isEndNodeSet = this.state.endNodeRow === null ? false : true;

        if (this.state.isSolved === false && !this.isStartOrEndNode(row, col)) {
            const newGrid = [...this.state.grid];

            if (!isStartNodeSet) {
                newGrid[row][col].isStart = true;
                document.getElementById(`node-${row}-${col}`).className = 'node start-node';
                this.setState({ grid: newGrid, isMouseClicked: !this.state.isMouseClicked, startNodeRow: row, startNodeCol: col });
            }
            else if (!isEndNodeSet) {
                newGrid[row][col].isEnd = true;
                document.getElementById(`node-${row}-${col}`).className = 'node end-node';
                this.setState({ grid: newGrid, isMouseClicked: !this.state.isMouseClicked, endNodeRow: row, endNodeCol: col });
            }
            else {
                newGrid[row][col].isWall = !newGrid[row][col].isWall;
                document.getElementById(`node-${row}-${col}`).className = newGrid[row][col].isWall ? 'node wall-node' : document.getElementById(`node-${row}-${col}`).className;
                this.setState({ grid: newGrid, isMouseClicked: !this.state.isMouseClicked });
            }
        }
    }

    handleMouseEnter = (row, col) => {
        const startAndEndNodesHaveBeenSelected = this.state.startNodeRow != null && this.state.endNodeRow != null;
        if (this.state.isMouseClicked && startAndEndNodesHaveBeenSelected && !this.isStartOrEndNode(row, col)) {
            const newGrid = this.state.grid.slice();
            newGrid[row][col].isWall = true;
            document.getElementById(`node-${row}-${col}`).className = 'node wall-node';
            this.setState({ grid: newGrid });
        }
    }

    handleMouseUp = () => {
        if (this.state.isSolved === false) {
            this.setState({ isMouseClicked: false });
        }
    }

    handleSearchAlgorithmSelection = (e) => {
        this.setState({ selectedSearchAlgorithm: e });
    }

    render() {
        const isMobile = window.innerWidth <= 500;

        if (isMobile) {
            return null;
        }
        else {
            return (
                <>
                    <div className='navbar-container'>
                        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                            <a className="navbar-brand" href="#">Search Visualization</a>
                        </nav>
                    </div>

                    {this.state.userAnimatesBeforeAlgorithmSelectionError &&
                        <div className="alert-container">
                            <div class="alert alert-danger" role="alert">
                                You need to select a search algorithm first!
                            </div>
                        </div>
                    }

                    <div className='container'>
                        <div className='row justify-content-center'>
                            <DropdownButton
                                title={this.state.selectedSearchAlgorithm}
                                onSelect={this.handleSearchAlgorithmSelection.bind(this)}
                            >
                                <Dropdown.Item eventKey="Breadth First Search">Breadth First Search</Dropdown.Item>
                                <Dropdown.Item eventKey="Depth First Search">Depth First Search</Dropdown.Item>
                            </DropdownButton>
                        </div>
                        <div className='row justify-content-center'>
                            <button type="button" className="btn btn-success" onClick={this.handleAnimation.bind(this)}>Animate</button>
                            <button type="button" className="btn btn-danger" onClick={this.initiateEmptyGrid.bind(this)}>Reset</button>
                        </div>
                    </div>

                    <div className='grid'>
                        {this.state.grid.map((row, rowIndex) => {
                            return (
                                <div className='gridRow' key={rowIndex}>
                                    {row.map((node, nodeIndex) => {
                                        const { row, col } = node;
                                        return (
                                            <Node
                                                className='gridCol'
                                                key={rowIndex + ' ' + nodeIndex}
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
}
