import React, { useState, useRef, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';

function TextBox({ id, text, style, position, width, onSelect, onUpdate, onUpdatePosition, onUpdateWidth, isSelected }) {
    const [value, setValue] = useState(text);
    const [isEditing, setIsEditing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    
    const [boxWidth, setBoxWidth] = useState(width); 
    useEffect(() => {
        setBoxWidth(width);
    }, [width]);

    const [boxPosition, setBoxPosition] = useState(position);
    useEffect(() => {
        setBoxPosition(position);
    }, [position]);

    const [resizing, setResizing] = useState(false);

    const nodeRef = useRef(null);
    const inputRef = useRef(null);
    const resizeDirection = useRef(null);
    const resizeStart = useRef({ clientX: 0, width: 0, x: 0, parentWidth: 0 });
    const dragStartPos = useRef(null);
    const finalUpdateData = useRef({ pos: position, w: width });

    const handleBlur = () => {
        if (inputRef.current) {
            const newText = inputRef.current.textContent;
            setValue(newText);
            onUpdate?.(id, newText);
        }
        setIsEditing(false);
    };

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);
    
    const handleMove = useCallback((e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const diffX = clientX - resizeStart.current.clientX;
        const minWidth = 20;

        if (resizeDirection.current === 'right') {
            const maxAllowedWidth = resizeStart.current.parentWidth - resizeStart.current.x;
            const proposedWidth = resizeStart.current.width + diffX;
            const newWidth = Math.max(minWidth, Math.min(proposedWidth, maxAllowedWidth));
            setBoxWidth(newWidth);
            finalUpdateData.current.w = newWidth;
        } else if (resizeDirection.current === 'left') {
            // *** THIS IS THE FIX ***
            // 1. Calculate the maximum X position the left handle can reach.
            // It's the original right edge minus the minimum width.
            const maxAllowedX = (resizeStart.current.x + resizeStart.current.width) - minWidth;

            // 2. Calculate the proposed new X.
            const newX = resizeStart.current.x + diffX;

            // 3. Clamp the new X between the left boundary (0) and our new right boundary (maxAllowedX).
            const clampedX = Math.max(0, Math.min(newX, maxAllowedX));

            // 4. The rest of the logic now works perfectly using the correctly clamped position.
            const actualDiffX = clampedX - resizeStart.current.x;
            const newWidth = resizeStart.current.width - actualDiffX;

            setBoxWidth(newWidth);
            setBoxPosition({ x: clampedX, y: boxPosition.y });
            
            finalUpdateData.current.w = newWidth;
            finalUpdateData.current.pos = { x: clampedX, y: boxPosition.y };
        }
    }, [boxPosition.y]);

    const handleUp = useCallback(() => {
        setResizing(false);
        
        setTimeout(() => {
            onUpdatePosition?.(id, finalUpdateData.current.pos);
            onUpdateWidth?.(id, finalUpdateData.current.w);
        }, 0);

    }, [id, onUpdatePosition, onUpdateWidth]);

    useEffect(() => {
        if (!resizing) return;
        
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchend', handleUp);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchend', handleUp);
        };
    }, [resizing, handleMove, handleUp]);

    const startResize = useCallback((e, side) => {
        e.stopPropagation();
        resizeDirection.current = side;
        const parentWidth = nodeRef.current.parentElement.clientWidth;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        
        finalUpdateData.current = { pos: boxPosition, w: boxWidth };
        resizeStart.current = { clientX, width: boxWidth, x: boxPosition.x, parentWidth };
        setResizing(true);
    }, [boxPosition, boxWidth]); 

    return (
        <Draggable
            nodeRef={nodeRef}
            bounds="parent"
            position={boxPosition}
            disabled={isEditing || resizing}
            cancel=".no-drag"
            onStart={(e, data) => {
                setIsDragging(true);
                dragStartPos.current = { x: data.x, y: data.y };
            }}
            onStop={(e, data) => {
                setIsDragging(false);
                const startPos = dragStartPos.current;
                const dragThreshold = 3; 
                if (!startPos) return;
                const movedDistance = Math.sqrt(Math.pow(data.x - startPos.x, 2) + Math.pow(data.y - startPos.y, 2));
                
                if (movedDistance < dragThreshold) {
                    if (isSelected && !isEditing) {
                        setIsEditing(true);
                    } else {
                        onSelect(id);
                    }
                } else {
                    const newPos = { x: data.x, y: data.y };
                    setBoxPosition(newPos);
                    onUpdatePosition?.(id, newPos);
                }
            }}
        >
            <div
                ref={nodeRef}
                className={`relative rounded-md ${isSelected ? 'border border-purple-500' : 'border-transparent'} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                    position: 'absolute',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    fontSize: `${style.fontSize}px`,
                    fontWeight: style.bold ? 'bold' : 'normal',
                    fontStyle: style.italic ? 'italic' : 'normal',
                    textAlign: style.alignment,
                    color: style.color || 'black',
                    lineHeight: style.lineHeight || 1.5,
                    width: `${boxWidth}px`,
                    maxWidth: '100%',
                    fontFamily: style.fontFamily || 'serif',
                    userSelect: isDragging || resizing ? 'none' : 'auto',
                }}
            >
                {isSelected && !isEditing && (
                    <>
                        <div 
                            className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-white border border-gray-500 rounded-full cursor-ew-resize hover:scale-110 transition-transform no-drag" 
                            onMouseDown={(e) => startResize(e, 'right')} 
                            onTouchStart={(e) => startResize(e, 'right')} 
                        />
                        <div 
                            className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-white border border-gray-500 rounded-full cursor-ew-resize hover:scale-110 transition-transform no-drag" 
                            onMouseDown={(e) => startResize(e, 'left')} 
                            onTouchStart={(e) => startResize(e, 'left')} 
                        />
                    </>
                )}
                {isEditing ? (
                    <div ref={inputRef} contentEditable suppressContentEditableWarning={true} className="p-1 outline-none" onBlur={handleBlur}>{value}</div>
                ) : (
                    <div className="p-1">{value}</div>
                )}
            </div>
        </Draggable>
    );
}

export default TextBox;