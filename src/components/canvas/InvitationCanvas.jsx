import React from 'react';
import EditableText from './EditableText';

function InvitationCanvas({ fields, onFieldChange, template }) {
  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md bg-white shadow-lg overflow-hidden aspect-[5/7] mx-auto">
      {/* Display the selected template image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={template}
          alt="Wedding Invitation Template"
          className="w-full h-auto max-h-full object-contain"
        />
      </div>

      {/* Editable fields with styling */}
      {Object.keys(fields).map((field) => (
        <EditableText
          key={field}
          value={fields[field].text}
          fontSize={fields[field].fontSize}
          bold={fields[field].bold}
          italic={fields[field].italic}
          fontStyle={fields[field].fontStyle}
          onChange={(value) => onFieldChange(field, 'text', value)}
          style={{
            position: 'absolute',
            top: `${
              field === 'brideName'
                ? '20%'
                : field === 'groomName'
                ? '30%'
                : field === 'date'
                ? '50%'
                : '60%'
            }`,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: `${fields[field].fontSize}px`,
            textAlign: 'center',
          }}
        />
      ))}
    </div>
  );
}

export default InvitationCanvas;
