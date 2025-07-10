'use client';

import React from 'react';
import { SpacerComponent as SpacerComponentType } from '../../interfaces/receipt-models';
import { ComponentWrapper } from './ComponentWrapper';

interface SpacerComponentProps {
  component: SpacerComponentType;
  onUpdate?: (updates: Partial<SpacerComponentType>) => void;
  isEditing?: boolean;
  isPreview?: boolean;
}

export const SpacerComponent: React.FC<SpacerComponentProps> = ({ 
  component, 
  onUpdate,
  isEditing = false,
  isPreview = false
}) => {
  const content = (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-3 hover:border-blue-400 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-gray-400">Spacer ({component.lines} lines)</div>
        {isEditing && (
          <input
            type="number"
            value={component.lines}
            onChange={(e) => onUpdate?.({ lines: parseInt(e.target.value) || 1 })}
            min="1"
            max="10"
            className="w-12 text-xs px-1 py-0.5 bg-gray-700 text-gray-200 border border-gray-600 rounded text-center"
          />
        )}
      </div>
      
      <div className="bg-gray-700 rounded" style={{ height: `${component.lines * 16}px` }}>
        <div className="h-full flex items-center justify-center">
          <div className="text-xs text-gray-500">
            {component.lines} line{component.lines !== 1 ? 's' : ''}
          </div>
        </div>
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