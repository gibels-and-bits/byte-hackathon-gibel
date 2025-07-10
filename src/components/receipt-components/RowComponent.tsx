'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { RowComponent as RowComponentType, Component } from '../../interfaces/receipt-models';
import { ComponentWrapper } from './ComponentWrapper';
import { generateComponentId } from '../../utils/receipt-helpers';
// Import renderComponent will be passed as prop to avoid circular dependency

interface RowComponentProps {
  component: RowComponentType;
  onUpdate?: (updates: Partial<RowComponentType>) => void;
  isEditing?: boolean;
  isPreview?: boolean;
  onDropComponent?: (columnIndex: number, component: Component) => void;
  renderComponent?: (component: Component, props?: any) => React.ReactNode;
}

interface DropZoneProps {
  rowId: string;
  columnIndex: number;
  onDrop: (component: Component) => void;
  children?: React.ReactNode;
}

const DropZone: React.FC<DropZoneProps> = ({ rowId, columnIndex, onDrop, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-zone-${rowId}-${columnIndex}`,
    data: { columnIndex, onDrop }
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[60px] p-2 rounded transition-colors
        ${isOver ? 'bg-blue-500/20 border-2 border-blue-400' : 'bg-gray-700 border-2 border-dashed border-gray-600'}
      `}
    >
      {children || (
        <div className="text-center text-gray-500 text-xs py-2">
          Drop component here
        </div>
      )}
    </div>
  );
};

export const RowComponent: React.FC<RowComponentProps> = ({ 
  component, 
  onUpdate,
  isEditing = false,
  isPreview = false,
  onDropComponent,
  renderComponent
}) => {
  const addColumn = () => {
    const newColumn = {
      width: 'auto' as const,
      alignment: 'left' as const,
      component: {
        id: generateComponentId(),
        type: 'text',
        content: ''
      } as Component
    };
    
    onUpdate?.({
      columns: [...component.columns, newColumn]
    });
  };

  const removeColumn = (index: number) => {
    onUpdate?.({
      columns: component.columns.filter((_, i) => i !== index)
    });
  };

  const updateColumn = (index: number, updates: any) => {
    const newColumns = [...component.columns];
    newColumns[index] = { ...newColumns[index], ...updates };
    onUpdate?.({ columns: newColumns });
  };

  const updateColumnComponent = (index: number, componentUpdates: Partial<Component>) => {
    const newColumns = [...component.columns];
    if (newColumns[index].component) {
      newColumns[index].component = {
        ...newColumns[index].component,
        ...componentUpdates
      } as Component;
      onUpdate?.({ columns: newColumns });
    }
  };

  const handleDropComponent = (columnIndex: number, droppedComponent: Component) => {
    const newColumns = [...component.columns];
    // Create a new instance of the component
    newColumns[columnIndex].component = {
      ...droppedComponent,
      id: generateComponentId()
    };
    onUpdate?.({ columns: newColumns });
  };

  const content = (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-3 hover:border-blue-400 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-gray-400">Row Component ({component.columns.length} columns)</div>
        {isEditing && (
          <button
            onClick={addColumn}
            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Column
          </button>
        )}
      </div>
      
      <div className="flex gap-2 mb-2">
        {component.columns.map((col, idx) => (
          <div 
            key={idx}
            className={`
              flex-1
              ${col.width === 'fill' ? 'flex-grow' : ''}
              ${col.width === 'auto' ? 'flex-shrink-0' : ''}
            `}
            style={typeof col.width === 'number' ? { flexBasis: `${col.width}%` } : {}}
          >
            <div className="mb-1 flex justify-between items-center">
              <div className="text-xs text-gray-400">
                Col {idx + 1} ({col.width})
              </div>
              {isEditing && component.columns.length > 1 && (
                <button
                  onClick={() => removeColumn(idx)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              )}
            </div>
            
            {isEditing ? (
              <DropZone 
                rowId={component.id}
                columnIndex={idx} 
                onDrop={(comp) => handleDropComponent(idx, comp)}
              >
                {col.component && (col.component.type !== 'text' || (col.component.type === 'text' && col.component.content)) && renderComponent ? (
                  renderComponent(col.component, {
                    onUpdate: (updates: Partial<Component>) => updateColumnComponent(idx, updates),
                    isEditing: true,
                    isPreview: true
                  })
                ) : null}
              </DropZone>
            ) : (
              <div className="p-2 bg-gray-700 rounded min-h-[60px]">
                {col.component && renderComponent ? renderComponent(col.component, {
                  isPreview: true
                }) : (
                  <div className="text-center text-gray-500 text-xs py-2">
                    Empty column
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {isEditing && (
        <div className="flex gap-2 flex-wrap">
          {component.columns.map((col, idx) => (
            <div key={`controls-${idx}`} className="flex gap-1">
              <label className="text-xs text-gray-400">Col {idx + 1}:</label>
              <select
                value={col.width}
                onChange={(e) => updateColumn(idx, { 
                  width: e.target.value === 'auto' || e.target.value === 'fill' 
                    ? e.target.value 
                    : parseInt(e.target.value) 
                })}
                className="text-xs px-1 py-0.5 bg-gray-700 text-gray-200 border border-gray-600 rounded"
              >
                <option value="auto">Auto</option>
                <option value="fill">Fill</option>
                <option value="25">25%</option>
                <option value="33">33%</option>
                <option value="50">50%</option>
                <option value="67">67%</option>
                <option value="75">75%</option>
              </select>
              <select
                value={col.alignment || 'left'}
                onChange={(e) => updateColumn(idx, { alignment: e.target.value })}
                className="text-xs px-1 py-0.5 bg-gray-700 text-gray-200 border border-gray-600 rounded"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          ))}
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