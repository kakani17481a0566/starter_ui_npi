import React from 'react';
import { useDrag } from 'react-dnd';

const GRID_SIZE = 3; 
const PIECE_SIZE = 100; 

const PuzzlePiece = ({ piece, onDropPiece, onResetPiece, isInTray, position }) => {
  
  const isFixed = !isInTray && 
                  piece.currentGridX === piece.correctOriginalGridX && 
                  piece.currentGridY === piece.correctOriginalGridY;

  const [{ isDragging }, drag] = useDrag(() => ({
    canDrag: !isFixed, 
    type: 'puzzlePiece',
    item: { id: piece.id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      const didDrop = monitor.didDrop();
      
      // SCENARIO 1: Successful snap to a correct target
      if (dropResult) {
        const { x, y } = dropResult;
         if (x === undefined || y === undefined) {   onResetPiece(item.id);   }
         else{  onDropPiece(item.id, x, y);}
      
      } 
      // SCENARIO 2: Failure occurred. Check if the piece was dragged from the board.
      else if (piece.isOnAssemblyLine || didDrop) { 
        // If the piece was on the board (isOnAssemblyLine) and failed to snap, 
        // OR if it landed on an incorrect target (didDrop is true, but dropResult is null/undefined),
        // we force it back to the tray coordinates.
        onResetPiece(item.id); 
      }
      // If the piece started in the tray and failed, it naturally stays in the tray visually,
      // but this ensures the sound plays and the state is clean.
      
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [onDropPiece, onResetPiece, piece.isOnAssemblyLine]); 

  const style = {
    position: 'absolute', 
    left: position.left, 
    top: position.top,  
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    backgroundImage: `url(${piece.image})`,
    backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
    backgroundPosition: piece.backgroundPosition,
    border: '1px solid #000',
    boxSizing: 'border-box',
    cursor: isFixed ? 'default' : 'grab',
    opacity: isDragging ? 0.6 : 1,
    boxShadow: isFixed ? '0 0 10px rgba(0, 255, 0, 0.7)' : '0 2px 4px rgba(0,0,0,0.2)',
    zIndex: isDragging ? 100 : (isInTray ? 5 : 1),
    transition: 'top 0.3s ease-out, left 0.3s ease-out, box-shadow 0.2s',
  };

  return <div ref={drag} style={style} className="puzzle-piece" />;
};

export default PuzzlePiece;