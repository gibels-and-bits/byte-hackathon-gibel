'use client';

import React, { useState } from 'react';
import { TextComponent as TextComponentType } from '../../interfaces/receipt-models';
import { ComponentWrapper } from './ComponentWrapper';

interface TextComponentProps {
  component: TextComponentType;
  onUpdate?: (updates: Partial<TextComponentType>) => void;
  isEditing?: boolean;
  isPreview?: boolean;
}

export const TextComponent: React.FC<TextComponentProps> = ({ 
  component, 
  onUpdate,
  isEditing = false,
  isPreview = false
}) => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [tempText, setTempText] = useState(component.content);

  const handleTextUpdate = () => {
    onUpdate?.({ content: tempText });
    setIsEditingText(false);
  };

  // Helper to get text size class based on size multiplier
  const getTextSizeClass = () => {
    const height = component.style?.size?.height || 1;
    if (height <= 0.8) return 'text-xs';
    if (height <= 1) return 'text-sm';
    if (height <= 1.5) return 'text-base';
    if (height <= 2) return 'text-lg';
    return 'text-xl';
  };

  const content = (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-3 hover:border-blue-400 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-gray-400">Text Component</div>
        {isEditing && (
          <div className="flex gap-1">
            <button
              onClick={() => onUpdate?.({ style: { ...component.style, bold: !component.style?.bold } })}
              className={`text-xs px-2 py-1 rounded ${
                component.style?.bold 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              B
            </button>
            <button
              onClick={() => onUpdate?.({ style: { ...component.style, underline: !component.style?.underline } })}
              className={`text-xs px-2 py-1 rounded ${
                component.style?.underline 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              style={{ textDecoration: 'underline' }}
            >
              U
            </button>
          </div>
        )}
      </div>
      
      {isEditingText ? (
        <div className="flex gap-1">
          <input
            type="text"
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTextUpdate();
              if (e.key === 'Escape') {
                setTempText(component.content);
                setIsEditingText(false);
              }
            }}
            className="flex-1 px-2 py-1 text-sm bg-gray-700 text-gray-200 border border-gray-600 rounded"
            autoFocus
          />
          <button
            onClick={handleTextUpdate}
            className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            ✓
          </button>
        </div>
      ) : (
        <div 
          className={`
            text-gray-200
            ${component.style?.alignment === 'center' ? 'text-center' : ''}
            ${component.style?.alignment === 'right' ? 'text-right' : ''}
            ${component.style?.bold ? 'font-bold' : ''}
            ${component.style?.underline ? 'underline' : ''}
            ${getTextSizeClass()}
            ${isEditing ? 'cursor-pointer hover:bg-gray-700 p-1 rounded' : ''}
          `}
          style={{
            transform: `scaleX(${component.style?.size?.width || 1})`,
            transformOrigin: component.style?.alignment === 'center' ? 'center' : 
                           component.style?.alignment === 'right' ? 'right' : 'left'
          }}
          onClick={() => isEditing && setIsEditingText(true)}
        >
          {component.content || 'Click to edit text'}
        </div>
      )}
      
      {isEditing && (
        <div className="mt-2 flex gap-2 flex-wrap">
          <select
            value={component.style?.alignment || 'left'}
            onChange={(e) => onUpdate?.({ style: { ...component.style, alignment: e.target.value as any } })}
            className="text-xs px-1 py-0.5 bg-gray-700 text-gray-200 border border-gray-600 rounded"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
          <select
            value={`${component.style?.size?.width || 1}x${component.style?.size?.height || 1}`}
            onChange={(e) => {
              const [width, height] = e.target.value.split('x').map(Number);
              onUpdate?.({ style: { ...component.style, size: { width, height } } });
            }}
            className="text-xs px-1 py-0.5 bg-gray-700 text-gray-200 border border-gray-600 rounded"
          >
            <option value="1x1">Normal (1x1)</option>
            <option value="1x2">Tall (1x2)</option>
            <option value="2x1">Wide (2x1)</option>
            <option value="2x2">Large (2x2)</option>
            <option value="1x0.8">Small (1x0.8)</option>
          </select>
        </div>
      )}
    </div>
  );

  if (isPreview) {
    return content;
  }

  return (
    <ComponentWrapper component={component} isPreview={isPreview}>
      {content}
    </ComponentWrapper>
  );
}; 