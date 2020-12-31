import React from 'react'
import './Node.css';

const Node = ({ row, col, handleMouseDown, handleMouseEnter, handleMouseUp }) => {
    return (
        <div
            id={`node-${row}-${col}`}
            className={'node'}
            onMouseDown={() => handleMouseDown(row, col)}
            onMouseEnter={() => handleMouseEnter(row, col)}
            onMouseUp={() => handleMouseUp()}>
        </div>
    )
}

const isEqual = (prevProps, nextProps) => {
    if (prevProps.isWall !== nextProps.isWall || prevProps.visited !== nextProps.visited) {
        return false;
    }
    return true;
}

export default React.memo(Node, isEqual);
