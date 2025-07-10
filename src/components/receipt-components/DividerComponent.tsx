'use client';

import React from 'react';
import { DividerComponent as DividerComponentType } from '../../interfaces/receipt-models';
import { ComponentWrapper } from './ComponentWrapper';

interface DividerComponentProps {
  component: DividerComponentType;
  onUpdate?: (updates: Partial<DividerComponentType>) => void;
  isEditing?: boolean;
  isPreview?: boolean;
}

export const DividerComponent: React.FC<DividerComponentProps> = ({ 
  component, 
  onUpdate,
  isEditing = false,
  isPreview = false
}) => {
  const getDividerStyle = () => {
    const char = component.character || '-';
    const style = component.style || 'solid';
    
    if (style === 'double') {
      return `${char}${char}`.repeat(24);
    } else if (style === 'dashed') {
      return `${char} `.repeat(24);
    }
    return char.repeat(48);
  };

  const content = (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-3 hover:border-blue-400 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-gray-400">Divider</div>
        {isEditing && (
          <div className="flex gap-1">
            <select
              value={component.style || 'solid'}
              onChange={(e) => onUpdate?.({ style: e.target.value as any })}
              className="text-xs px-1 py-0.5 bg-gray-700 text-gray-200 border border-gray-600 rounded"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="double">Double</option>
            </select>
            <input
              type="text"
              value={component.character || '-'}
              onChange={(e) => onUpdate?.({ character: e.target.value.slice(0, 1) })}
              className="w-8 text-xs px-1 py-0.5 bg-gray-700 text-gray-200 border border-gray-600 rounded text-center"
              maxLength={1}
              placeholder="-"
            />
          </div>
        )}
      </div>
      
      <div className="font-mono text-xs text-gray-300 overflow-hidden whitespace-nowrap">
        {getDividerStyle()}
      </div>
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