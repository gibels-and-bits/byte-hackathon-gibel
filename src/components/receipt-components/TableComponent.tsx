'use client';

import React, { useState } from 'react';
import { TableComponent as TableComponentType, Component } from '../../interfaces/receipt-models';
import { generateComponentId } from '../../utils/receipt-helpers';
import { useDroppable } from '@dnd-kit/core';

interface EditableTableComponentProps {
  component: TableComponentType;
  onUpdate?: (updates: Partial<TableComponentType>) => void;
  isEditing?: boolean;
  renderComponent?: (component: Component, props: any) => React.ReactNode;
}

interface DroppableTableCellProps {
  rowIndex: number;
  colKey: string;
  content: Component | string | undefined;
  onDrop: (rowIndex: number, colKey: string, component: Component) => void;
  onRemove: (rowIndex: number, colKey: string) => void;
  onUpdateCell: (rowIndex: number, colKey: string, updates: Partial<Component>) => void;
  renderComponent?: (component: Component, props: any) => React.ReactNode;
  isEditing?: boolean;
}

function DroppableTableCell({ 
  rowIndex, 
  colKey, 
  content, 
  onDrop, 
  onRemove,
  onUpdateCell,
  renderComponent,
  isEditing 
}: DroppableTableCellProps) {
  const dropId = `table-cell-${rowIndex}-${colKey}`;
  const { setNodeRef, isOver } = useDroppable({
    id: dropId,
    data: {
      onDrop: (component: Component) => {
        // Prevent dropping tables into table cells
        if (component.type !== 'table') {
          onDrop(rowIndex, colKey, component);
        }
      }
    }
  });

  return (
    <td 
      ref={setNodeRef}
      className={`border border-gray-600 px-2 py-2 min-h-[40px] relative ${
        isOver ? 'bg-blue-500/20' : ''
      }`}
    >
      {content && typeof content === 'object' && 'type' in content ? (
        <div className="relative group">
          {renderComponent ? (
            renderComponent(content, { 
              isEditing: isEditing, 
              isPreview: true,
              onUpdate: (updates: Partial<Component>) => onUpdateCell(rowIndex, colKey, updates)
            })
          ) : (
            <span className="text-gray-400">[{content.type}]</span>
          )}
          {isEditing && (
            <button
              onClick={() => onRemove(rowIndex, colKey)}
              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              title="Remove component"
            >
              ×
            </button>
          )}
        </div>
      ) : (
        <div className="text-gray-500 text-sm italic py-2">
          Drop component here
        </div>
      )}
    </td>
  );
}

export const EditableTableComponent: React.FC<EditableTableComponentProps> = ({ 
  component, 
  onUpdate,
  isEditing,
  renderComponent
}) => {
  const handleAddColumn = () => {
    const newKey = `col${component.columns.length + 1}`;
    const newColumns = [...component.columns, {
      key: newKey,
      width: 'auto' as const,
      alignment: 'left' as const
    }];
    
    const newRows = component.rows.map(row => ({
      ...row,
      [newKey]: undefined
    }));
    
    onUpdate?.({ columns: newColumns, rows: newRows });
  };

  const handleRemoveColumn = (index: number) => {
    if (component.columns.length <= 1) return;
    
    const removedKey = component.columns[index].key;
    const newColumns = component.columns.filter((_, i) => i !== index);
    const newRows = component.rows.map(row => {
      const newRow = { ...row };
      delete newRow[removedKey];
      return newRow;
    });
    
    onUpdate?.({ columns: newColumns, rows: newRows });
  };

  const handleAddRow = () => {
    const newRow: Record<string, any> = {};
    component.columns.forEach(col => {
      newRow[col.key] = undefined;
    });
    onUpdate?.({ rows: [...component.rows, newRow] });
  };

  const handleRemoveRow = (index: number) => {
    if (component.rows.length <= 1) return;
    onUpdate?.({ rows: component.rows.filter((_, i) => i !== index) });
  };

  const handleCellDrop = (rowIndex: number, colKey: string, droppedComponent: Component) => {
    // Prevent dropping tables into cells
    if (droppedComponent.type === 'table') {
      return;
    }
    
    const newRows = [...component.rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      [colKey]: { ...droppedComponent, id: generateComponentId() }
    };
    onUpdate?.({ rows: newRows });
  };

  const handleCellRemove = (rowIndex: number, colKey: string) => {
    const newRows = [...component.rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      [colKey]: undefined
    };
    onUpdate?.({ rows: newRows });
  };

  const handleCellUpdate = (rowIndex: number, colKey: string, updates: Partial<Component>) => {
    const newRows = [...component.rows];
    const currentCell = newRows[rowIndex][colKey];
    
    // Only update if the cell contains a component
    if (currentCell && typeof currentCell === 'object' && 'type' in currentCell) {
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        [colKey]: { ...currentCell, ...updates } as Component
      };
      onUpdate?.({ rows: newRows });
    }
  };

  const handleColumnWidthChange = (index: number, width: string) => {
    const newColumns = [...component.columns];
    // Parse percentage or set to auto/fill
    if (width.endsWith('%')) {
      const percentage = parseInt(width);
      if (!isNaN(percentage) && percentage > 0 && percentage <= 100) {
        newColumns[index] = { ...newColumns[index], width: `${percentage}%` };
      }
    } else if (width === 'auto' || width === 'fill') {
      newColumns[index] = { ...newColumns[index], width: width };
    }
    onUpdate?.({ columns: newColumns });
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">Table Layout</span>
        {isEditing && (
          <div className="flex gap-1">
            <button
              onClick={handleAddColumn}
              className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded"
              title="Add Column"
            >
              + Col
            </button>
            <button
              onClick={handleAddRow}
              className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 rounded"
              title="Add Row"
            >
              + Row
            </button>
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="mb-2 text-xs text-gray-500">
          <div className="flex gap-2 items-center">
            {component.columns.map((col, index) => (
              <div key={col.key} className="flex items-center gap-1">
                <span>Col {index + 1}:</span>
                <input
                  type="text"
                  value={col.width}
                  onChange={(e) => handleColumnWidthChange(index, e.target.value)}
                  className="bg-gray-700 text-gray-200 px-1 rounded text-xs w-16"
                  placeholder="Width"
                  title="Enter percentage (e.g., 50%), 'auto', or 'fill'"
                />
                {component.columns.length > 1 && (
                  <button
                    onClick={() => handleRemoveColumn(index)}
                    className="text-xs text-red-400 hover:text-red-300"
                    title="Remove Column"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {component.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {component.columns.map((col) => (
                  <DroppableTableCell
                    key={col.key}
                    rowIndex={rowIndex}
                    colKey={col.key}
                    content={row[col.key]}
                    onDrop={handleCellDrop}
                    onRemove={handleCellRemove}
                    onUpdateCell={handleCellUpdate}
                    renderComponent={renderComponent}
                    isEditing={isEditing}
                  />
                ))}
                {isEditing && (
                  <td className="border border-gray-600 px-1">
                    <button
                      onClick={() => handleRemoveRow(rowIndex)}
                      className="text-xs text-red-400 hover:text-red-300"
                      title="Remove Row"
                    >
                      ×
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 