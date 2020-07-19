import React from 'react'
import './node.css';

const node = ({row, col, isStart, isEnd, isWall, visited, handleMouseDown, handleMouseEnter, handleMouseUp}) => {    
    const extraClassName = isStart ? 'start-node' : isWall ? 'wall-node' : isEnd ? 'end-node' : visited ? 'visited-node' : '';

    return (
        <div 
            id={`node-${row}-${col}`} 
            className={`node ${extraClassName}`} 
            onMouseDown={() => handleMouseDown(row, col)} 
            onMouseEnter={() => handleMouseEnter(row, col)} 
            onMouseUp={() => handleMouseUp()}>
        </div>
    )
}

const isEqual = (prevProps, nextProps) => {
    if(prevProps.isWall !== nextProps.isWall || prevProps.visited !== nextProps.visited){
        return false;
    }
    return true;
}

export default React.memo(node, isEqual);
