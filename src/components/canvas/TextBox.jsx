import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { FiMove } from 'react-icons/fi';

function TextBox({ id, text, style, position, onSelect, onUpdate, onUpdatePosition, isSelected }) {
    const [value, setValue] = useState(text);
    const [isEditing, setIsEditing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [width, setWidth] = useState(100);
    const [boxPosition, setBoxPosition] = useState(position);
    const [resizing, setResizing] = useState(false);

    const nodeRef = useRef(null);
    const inputRef = useRef(null);

    const resizeDirection = useRef(null);
    const resizeStart = useRef({ clientX: 0, width: 0, x: 0 });

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

    const handleClick = (e) => {
        e.stopPropagation();
        if (isDragging) {
            setIsDragging(false);
            return;
        }

        if (isSelected && !isEditing) {
            setIsEditing(true);
        } else {
            onSelect(id);
        }
    };

    // Add and remove mouse listeners only while resizing
    useEffect(() => {
        if (!resizing) return;

        const handleMouseMove = (e) => {
            const diffX = e.clientX - resizeStart.current.clientX;
            if (resizeDirection.current === 'right') {
                setWidth(Math.max(20, resizeStart.current.width + diffX));
            } else if (resizeDirection.current === 'left') {
                const newWidth = Math.max(20, resizeStart.current.width - diffX);
                const delta = resizeStart.current.width - newWidth;
                setWidth(newWidth);
                setBoxPosition((pos) => ({
                    x: resizeStart.current.x + delta,
                    y: pos.y,
                }));
            }
        };

        const handleMouseUp = () => {
            setResizing(false);
            resizeDirection.current = null;
            onUpdatePosition?.(id, boxPosition);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizing, boxPosition, id, onUpdatePosition]);

    // Touch support
    useEffect(() => {
        if (!resizing) return;

        const handleTouchMove = (e) => {
            if (e.touches.length !== 1) return;
            const touch = e.touches[0];
            const diffX = touch.clientX - resizeStart.current.clientX;

            if (resizeDirection.current === 'right') {
                setWidth(Math.max(20, resizeStart.current.width + diffX));
            } else if (resizeDirection.current === 'left') {
                const newWidth = Math.max(20, resizeStart.current.width - diffX);
                const delta = resizeStart.current.width - newWidth;
                setWidth(newWidth);
                setBoxPosition((pos) => ({
                    x: resizeStart.current.x + delta,
                    y: pos.y,
                }));
            }
        };

        const handleTouchEnd = () => {
            setResizing(false);
            resizeDirection.current = null;
            onUpdatePosition?.(id, boxPosition);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };

        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [resizing, boxPosition, id, onUpdatePosition]);

    const startResizeMouse = (e, side) => {
        e.stopPropagation();
        resizeDirection.current = side;
        resizeStart.current = {
            clientX: e.clientX,
            width,
            x: boxPosition.x,
        };
        setResizing(true);
    };

    const startResizeTouch = (e, side) => {
        e.stopPropagation();
        if (e.touches.length === 1) {
            resizeDirection.current = side;
            resizeStart.current = {
                clientX: e.touches[0].clientX,
                width,
                x: boxPosition.x,
            };
            setResizing(true);
        }
    };

    return (
        <Draggable
            nodeRef={nodeRef}
            handle=".drag-handle"
            bounds="parent"
            position={boxPosition}
            disabled={isEditing}
            onStart={() => setIsDragging(true)}
            onStop={(e, data) => {
                setTimeout(() => setIsDragging(false), 100);
                setBoxPosition({ x: data.x, y: data.y });
                onUpdatePosition?.(id, { x: data.x, y: data.y });
            }}
        >
            <div
                ref={nodeRef}
                className={`relative rounded-md ${isSelected ? 'border border-purple-500' : 'border-transparent'} ${style.fontFamily}`}
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
                    width: `${width}px`,
                    maxWidth: '100%',
                }}
                onClick={handleClick}
            >
                {/* Drag handle */}
                {isSelected && !isEditing && (
                    <div className="drag-handle absolute -top-3 -left-3 cursor-move bg-white border border-gray-400 w-4 h-4 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                        <FiMove size={12} className="text-gray-700" />
                    </div>
                )}

                {/* Resize handles */}
                {isSelected && !isEditing && (
                    <>
                        <div
                            className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-white border border-gray-500 rounded-full cursor-ew-resize hover:scale-110 transition-transform"
                            onMouseDown={(e) => startResizeMouse(e, 'right')}
                            onTouchStart={(e) => startResizeTouch(e, 'right')}
                        />
                        <div
                            className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-white border border-gray-500 rounded-full cursor-ew-resize hover:scale-110 transition-transform"
                            onMouseDown={(e) => startResizeMouse(e, 'left')}
                            onTouchStart={(e) => startResizeTouch(e, 'left')}
                        />
                    </>
                )}

                {/* Text */}
                {isEditing ? (
                    <div
                        ref={inputRef}
                        contentEditable
                        suppressContentEditableWarning={true}
                        className="p-1"
                        onBlur={handleBlur}
                    >
                        {value}
                    </div>
                ) : (
                    <div className="p-1">{value}</div>
                )}
            </div>
        </Draggable>
    );
}

export default TextBox;
