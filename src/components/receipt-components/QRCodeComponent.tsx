'use client';

import React from 'react';
import { QRCodeComponent as QRCodeComponentType } from '../../interfaces/receipt-models';
import { ComponentWrapper } from './ComponentWrapper';

interface QRCodeComponentProps {
  component: QRCodeComponentType;
  onUpdate?: (updates: Partial<QRCodeComponentType>) => void;
  isEditing?: boolean;
  isPreview?: boolean;
}

export const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ 
  component, 
  onUpdate,
  isEditing = false,
  isPreview = false
}) => {
  const content = (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-3 hover:border-blue-400 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-gray-400">QR Code</div>
        {isEditing && (
          <select
            value={component.options?.errorCorrection || 'M'}
            onChange={(e) => onUpdate?.({ 
              options: { ...component.options, errorCorrection: e.target.value as any } 
            })}
            className="text-xs px-1 py-0.5 bg-gray-700 text-gray-200 border border-gray-600 rounded"
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        )}
      </div>
      
      {/* QR Code preview */}
      <div className="flex justify-center mb-2">
        <div 
          className="bg-white p-2 rounded"
          style={{ 
            width: `${(component.options?.size || 100) / 2}px`,
            height: `${(component.options?.size || 100) / 2}px`
          }}
        >
          <div className="w-full h-full relative">
            {/* Simple QR code visualization */}
            <div className="absolute inset-0 grid grid-cols-5 gap-0.5">
              {[...Array(25)].map((_, i) => (
                <div 
                  key={i} 
                  className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                />
              ))}
            </div>
            {/* Corner markers */}
            <div className="absolute top-0 left-0 w-3 h-3 bg-black"></div>
            <div className="absolute top-0 right-0 w-3 h-3 bg-black"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 bg-black"></div>
          </div>
        </div>
      </div>
      
      {isEditing && (
        <div className="space-y-1">
          <input
            type="text"
            value={component.data}
            onChange={(e) => onUpdate?.({ data: e.target.value })}
            placeholder="QR code data (URL, text, etc.)"
            className="w-full text-xs px-2 py-1 bg-gray-700 text-gray-200 border border-gray-600 rounded"
          />
          <input
            type="number"
            value={component.options?.size || 100}
            onChange={(e) => onUpdate?.({ 
              options: { ...component.options, size: parseInt(e.target.value) } 
            })}
            placeholder="Size"
            min="50"
            max="500"
            className="w-full text-xs px-2 py-1 bg-gray-700 text-gray-200 border border-gray-600 rounded"
          />
        </div>
      )}
      
      <div className="text-xs text-gray-500 truncate mt-1">
        {component.data}
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