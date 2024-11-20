import React from 'react';
import SidebarModal from './SidebarModal';

const fontOptions = ['Arial', 'Calibri', 'Times New Roman', 'Verdana', 'Courier New'];

function TextSidebar({ fields, onFieldChange, onClose }) {
  return (
    <SidebarModal title="Edit Text" onClose={onClose}>
      {/* Controls for each field */}
      {Object.keys(fields).map((field) => (
        <div key={field} className="mb-6">
          <label className="block mb-1">{`${field.replace(/([A-Z])/g, ' $1')}`}</label>
          <input
            type="text"
            value={fields[field].text}
            onChange={(e) => onFieldChange(field, 'text', e.target.value)}
            className="w-full px-2 py-1 text-black mb-2 border rounded"
          />

          <label className="block mb-1">Font Size</label>
          <input
            type="number"
            value={fields[field].fontSize}
            min={8}
            max={48}
            onChange={(e) => onFieldChange(field, 'fontSize', parseInt(e.target.value))}
            className="w-full px-2 py-1 text-black border rounded"
          />

          <label className="block mt-2 mb-1">Font Style</label>
          <select
            value={fields[field].fontStyle}
            onChange={(e) => onFieldChange(field, 'fontStyle', e.target.value)}
            className="w-full px-2 py-1 text-black mb-2 border rounded"
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>

          <div className="flex gap-2 mt-2">
            <button
              className={`px-2 py-1 rounded ${fields[field].bold ? 'bg-gray-600' : 'bg-gray-400'}`}
              onClick={() => onFieldChange(field, 'bold', !fields[field].bold)}
            >
              B
            </button>
            <button
              className={`px-2 py-1 rounded ${fields[field].italic ? 'bg-gray-600' : 'bg-gray-400'}`}
              onClick={() => onFieldChange(field, 'italic', !fields[field].italic)}
            >
              I
            </button>
          </div>
        </div>
      ))}
    </SidebarModal>
  );
}

export default TextSidebar;
