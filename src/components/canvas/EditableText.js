// src/components/canvas/EditableText.js
import React from 'react';

function EditableText({ value, onChange, fontSize, bold, italic, fontStyle, style }) {
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      className="absolute text-center cursor-text"
      style={{
        ...style,
        fontSize: `${fontSize}px`,
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        fontFamily: fontStyle,
        color: 'black',
      }}
      onBlur={(e) => onChange(e.target.innerText)}
    >
      {value}
    </div>
  );
}

export default EditableText;
