import React, { useState, useRef, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';

// We accept the `onInteractionChange` prop from the parent
function TextBox({ id, text, style, position, width, onSelect, onUpdate, onUpdatePosition, onUpdateWidth, isSelected, scale = 1, onInteractionChange }) {
    const [value, setValue] = useState(text);
    const [isEditing, setIsEditing] = useState(false);
    const [isDragging, setIsDragging] = useState(false); // Used for cursor style
    
    const [boxWidth, setBoxWidth] = useState(width); 
    useEffect(() => { setBoxWidth(width); }, [width]);

    const [boxPosition, setBoxPosition] = useState(position);
    useEffect(() => { setBoxPosition(position); }, [position]);

    // Your original, working resize logic is fully restored here
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
            document.execCommand('selectAll', false, null);
        }
    }, [isEditing]);
     useEffect(() => {
        if (!isSelected && isEditing) setIsEditing(false);
    }, [isSelected, isEditing]);
    
    // Your original `handleMove` for resizing is correct
    const handleMove = useCallback((e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const diffX = (clientX - resizeStart.current.clientX) / scale;
        const minWidth = 20;

        if (resizeDirection.current === 'right') {
            const maxAllowedWidth = resizeStart.current.parentWidth - resizeStart.current.x;
            const proposedWidth = resizeStart.current.width + diffX;
            const newWidth = Math.max(minWidth, Math.min(proposedWidth, maxAllowedWidth));
            setBoxWidth(newWidth);
            finalUpdateData.current.w = newWidth;
        } else if (resizeDirection.current === 'left') {
            const maxAllowedX = (resizeStart.current.x + resizeStart.current.width) - minWidth;
            const newX = resizeStart.current.x + diffX;
            const clampedX = Math.max(0, Math.min(newX, maxAllowedX));
            const actualDiffX = clampedX - resizeStart.current.x;
            const newWidth = resizeStart.current.width - actualDiffX;
            setBoxWidth(newWidth);
            setBoxPosition({ x: clampedX, y: boxPosition.y });
            finalUpdateData.current.w = newWidth;
            finalUpdateData.current.pos = { x: clampedX, y: boxPosition.y };
        }
    }, [boxPosition.y, scale]);

    // Your original `handleUp` for resizing, with `onInteractionChange` added
    const handleUp = useCallback(() => {
        onInteractionChange?.(false); // Tell parent we are done
        setResizing(false);
        setTimeout(() => {
            onUpdatePosition?.(id, finalUpdateData.current.pos);
            onUpdateWidth?.(id, finalUpdateData.current.w);
        }, 0);
    }, [id, onUpdatePosition, onUpdateWidth, onInteractionChange]);

    // Your original `useEffect` for resize listeners is correct
    useEffect(() => {
        if (!resizing) return;
        const options = { passive: false };
        window.addEventListener('mousemove', handleMove, options);
        window.addEventListener('touchmove', handleMove, options);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchend', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchend', handleUp);
        };
    }, [resizing, handleMove, handleUp]);

    // Your original `startResize`, with `onInteractionChange` added
    const startResize = useCallback((e, side) => {
        onInteractionChange?.(true); // Tell parent we are busy
        e.stopPropagation();
        setResizing(true);
        resizeDirection.current = side;
        const parentWidth = nodeRef.current.parentElement.clientWidth;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        finalUpdateData.current = { pos: boxPosition, w: boxWidth };
        resizeStart.current = { clientX, width: boxWidth, x: boxPosition.x, parentWidth };
    }, [boxPosition, boxWidth, onInteractionChange]); 

    return (
        <Draggable
            nodeRef={nodeRef}
            bounds="parent"
            position={boxPosition}
            disabled={isEditing || resizing}
            cancel=".no-drag"
            scale={scale}
            onStart={(e, data) => {
                onInteractionChange?.(true); // Tell parent we are busy
                e.stopPropagation();
                setIsDragging(true);
                dragStartPos.current = { x: data.x, y: data.y };
            }}
            onStop={(e, data) => {
                onInteractionChange?.(false); // Tell parent we are done
                setIsDragging(false);

                // This is the reliable tap vs. drag detection logic
                const startPos = dragStartPos.current;
                const tapThreshold = 5; 
                if (!startPos) return;
                
                const movedDistance = Math.hypot(data.x - startPos.x, data.y - startPos.y);
                
                if (movedDistance < tapThreshold) {
                    // It was a TAP
                    if (!isSelected) {
                        onSelect(id);
                    } else {
                        setIsEditing(true);
                    }
                } else {
                    // It was a DRAG
                    if (!isSelected) {
                        onSelect(id);
                    }
                    const newPos = { x: data.x, y: data.y };
                    setBoxPosition(newPos);
                    onUpdatePosition?.(id, newPos);
                }
            }}
        >
            <div
                ref={nodeRef}
                onClick={(e) => e.stopPropagation()} // Prevents deselecting on tap
                className={`TextBox relative rounded-md ${isSelected ? 'border border-purple-500' : 'border-transparent'} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
                    userSelect: isEditing || resizing ? 'none' : 'auto',
                    touchAction: 'none', // Prevents page zoom on mobile
                    direction: style.direction || 'ltr', // Add this line
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