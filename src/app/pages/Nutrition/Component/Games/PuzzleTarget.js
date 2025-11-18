import React from 'react';
import { useDrop } from 'react-dnd';

const PIECE_SIZE = 100; 

const PuzzleTarget = ({ x, y, pieces }) => { 
  
  const isOccupiedAndFixed = pieces.some(
    (p) => p.currentGridX === x && 
           p.currentGridY === y && 
           p.isOnAssemblyLine
  );

  const [{ isOver }, drop] = useDrop(() => ({
    canDrop: () => !isOccupiedAndFixed, 
    accept: 'puzzlePiece',
    drop: (item, monitor) => {
      const draggedPiece = pieces.find(p => p.id === item.id);
      
      const isCorrectMatch = draggedPiece && 
                             draggedPiece.correctOriginalGridX === x && 
                             draggedPiece.correctOriginalGridY === y;
      
      if (isCorrectMatch) {
        return { x, y }; // Success: returns grid coordinates
      }
      return undefined; // Failure: returns undefined
      //  return { x: 10, y: 10 };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [isOccupiedAndFixed, pieces, x, y]);

  const style = {
    position: 'absolute',
    left: x * PIECE_SIZE, 
    top: y * PIECE_SIZE,  
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    border: '1px dashed #aaa',
    boxSizing: 'border-box',
    backgroundColor: isOver ? 'rgba(40, 167, 69, 0.3)' : 'transparent',
    display: isOccupiedAndFixed ? 'none' : 'block',
    transition: 'background-color 0.15s',
  };

  return <div ref={drop} style={style} />;
};

export default PuzzleTarget;