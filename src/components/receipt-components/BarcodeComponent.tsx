'use client';

import React from 'react';
import { BarcodeComponent as BarcodeComponentType } from '../../interfaces/receipt-models';
import { ComponentWrapper } from './ComponentWrapper';

interface BarcodeComponentProps {
  component: BarcodeComponentType;
  onUpdate?: (updates: Partial<BarcodeComponentType>) => void;
  isEditing?: boolean;
  isPreview?: boolean;
}

export const BarcodeComponent: React.FC<BarcodeComponentProps> = ({ 
  component, 
  onUpdate,
  isEditing = false,
  isPreview = false
}) => {
  const content = (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-3 hover:border-blue-400 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-gray-400">Barcode ({component.format})</div>
        {isEditing && (
          <select
            value={component.format}
            onChange={(e) => onUpdate?.({ format: e.target.value as any })}
            className="text-xs px-1 py-0.5 bg-gray-700 text-gray-200 border border-gray-600 rounded"
          >
            <option value="CODE128">CODE128</option>
            <option value="CODE39">CODE39</option>
            <option value="UPC_A">UPC_A</option>
            <option value="CODE93">CODE93</option>
          </select>
        )}
      </div>
      
      {/* Barcode preview */}
      <div className="bg-gray-900 p-2 rounded flex items-center justify-center" style={{ height: component.options?.height || 60 }}>
        <div className="text-center">
          <div className="bg-white p-1 rounded">
            <div 
              className="flex gap-0.5"
              style={{ height: (component.options?.height || 60) - 20 }}
            >
              {/* Simple barcode visualization */}
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="bg-black" 
                  style={{ 
                    width: `${(i % 3) + 1}px`, 
                    height: '100%' 
                  }} 
                />
              ))}
            </div>
          </div>
          {component.options?.showText !== 'none' && (
            <div className="text-xs text-gray-300 mt-1">{component.data}</div>
          )}
        </div>
      </div>
      
      {isEditing && (
        <div className="mt-2 space-y-1">
          <input
            type="text"
            value={component.data}
            onChange={(e) => onUpdate?.({ data: e.target.value })}
            placeholder="Barcode data"
            className="w-full text-xs px-2 py-1 bg-gray-700 text-gray-200 border border-gray-600 rounded"
          />
          <div className="flex gap-2">
            <select
              value={component.options?.showText || 'below'}
              onChange={(e) => onUpdate?.({ 
                options: { ...component.options, showText: e.target.value as any } 
              })}
              className="text-xs px-1 py-0.5 bg-gray-700 text-gray-200 border border-gray-600 rounded"
            >
              <option value="none">No Text</option>
              <option value="above">Text Above</option>
              <option value="below">Text Below</option>
              <option value="both">Text Both</option>
            </select>
            <input
              type="number"
              value={component.options?.height || 60}
              onChange={(e) => onUpdate?.({ 
                options: { ...component.options, height: parseInt(e.target.value) } 
              })}
              placeholder="Height"
              className="w-20 text-xs px-1 py-0.5 bg-gray-700 text-gray-200 border border-gray-600 rounded"
            />
          </div>
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