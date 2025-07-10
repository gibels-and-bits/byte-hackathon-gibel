'use client';

import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, DragOverEvent, useDroppable } from '@dnd-kit/core';
import { 
  Component,
  TextComponent,
  BarcodeComponent,
  QRCodeComponent,
  DividerComponent,
  SpacerComponent,
  TableComponent
} from '../../interfaces/receipt-models';
import { generateComponentId } from '../../utils/receipt-helpers';
import { renderComponent } from '../../components/receipt-components';
import Link from 'next/link';

type TabType = 'basic' | 'layout';

// Main canvas drop zone component
function MainDropZone({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'main-canvas-drop-zone'
  });

  return (
    <div 
      ref={setNodeRef}
      className={`min-h-[600px] rounded-lg p-4 space-y-4 transition-colors ${
        isOver ? 'bg-gray-600 border-2 border-blue-400' : 'bg-gray-700'
      }`}
    >
      {children}
    </div>
  );
}

export default function ComponentLibraryPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'layout'>('basic');
  
  // Basic component palette
  const basicComponents: Component[] = [
    {
      id: 'text-demo',
      type: 'text',
      content: 'Sample Text Component',
      style: { alignment: 'left' }
    } as TextComponent,
    {
      id: 'barcode-demo',
      type: 'barcode',
      data: '123456789012',
      format: 'CODE128',
      options: { height: 80, showText: 'below' }
    } as BarcodeComponent,
    {
      id: 'qrcode-demo',
      type: 'qrcode',
      data: 'https://example.com',
      options: { size: 150, errorCorrection: 'M' }
    } as QRCodeComponent,
    {
      id: 'divider-demo',
      type: 'divider',
      style: 'solid',
      character: '-'
    } as DividerComponent,
    {
      id: 'spacer-demo',
      type: 'spacer',
      lines: 2
    } as SpacerComponent,
  ];
  
  // Layout components
  const layoutComponents: Component[] = [
    {
      id: 'table-demo',
      type: 'table',
      columns: [
        { key: 'item', width: '60%', alignment: 'left' },
        { key: 'price', width: '40%', alignment: 'right' }
      ],
      rows: [
        { item: undefined, price: undefined },
        { item: undefined, price: undefined }
      ]
    } as TableComponent,
  ];
  
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over for drop zones
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    
    if (!event.over) return;
    
    const overId = event.over.id as string;
    const activeData = event.active.data.current;
    
    // Check if dropping into table cells
    if (overId.startsWith('table-cell-') && event.over.data.current) {
      const { onDrop } = event.over.data.current;
      if (onDrop && activeData) {
        onDrop(activeData);
      }
      return;
    }
    
    // Check if dropping into a drop zone within a row
    if (overId.startsWith('drop-zone-') && event.over.data.current) {
      const { columnIndex, onDrop } = event.over.data.current;
      if (onDrop && activeData) {
        onDrop(activeData);
      }
      return;
    }
    
    // Check if dropping onto main canvas
    if (overId === 'main-canvas-drop-zone' && activeData) {
      const draggedComponent = activeData as Component;
      
      // Create a new instance with a unique ID
      const newComponent: Component = {
        ...draggedComponent,
        id: generateComponentId()
      };
      
      // Handle nested components (for tables)
      if (newComponent.type === 'table') {
        const tableComponent = newComponent as TableComponent;
        // Tables already have their structure set up
      }
      
      setComponents([...components, newComponent]);
    }
  };

  const updateComponent = (id: string, updates: Partial<Component>) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, ...updates } as Component : comp
    ));
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(comp => comp.id !== id));
  };

  const activeComponent = activeId 
    ? basicComponents.find(c => c.id === activeId) || 
      layoutComponents.find(c => c.id === activeId) || 
      components.find(c => c.id === activeId)
    : null;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-100">Component Library Showcase</h1>
        
        <DndContext 
          onDragStart={handleDragStart} 
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Component Palette */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Component Palette</h2>
                
                {/* Tabs */}
                <div className="flex mb-4 border-b border-gray-700">
                  <button
                    onClick={() => setActiveTab('basic')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'basic'
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Basic
                  </button>
                  <button
                    onClick={() => setActiveTab('layout')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'layout'
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Layout
                  </button>
                </div>
                
                <div className="space-y-3">
                  {activeTab === 'basic' ? (
                    basicComponents.map(component => (
                      <div key={component.id} className="cursor-move">
                        {renderComponent(component, { isPreview: false })}
                      </div>
                    ))
                  ) : (
                    layoutComponents.map(component => (
                      <div key={component.id} className="cursor-move">
                        {renderComponent(component, { isPreview: false })}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Drop Zone */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Canvas (Drop Components Here)</h2>
              <MainDropZone>
                {components.length === 0 ? (
                  <div className="text-center text-gray-400 py-20">
                    <p className="mb-2">Drag components from the library to add them here</p>
                    <p className="text-sm">Start with layout components to create structure</p>
                  </div>
                ) : (
                  components.map(component => (
                    <div key={component.id} className="relative group">
                      {renderComponent(component, {
                        onUpdate: (updates) => updateComponent(component.id, updates),
                        isEditing: true,
                        isPreview: true
                      })}
                      <button
                        onClick={() => removeComponent(component.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </MainDropZone>
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeComponent ? (
              <div className="opacity-80">
                {renderComponent(activeComponent, { isPreview: true })}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Component JSON */}
        {components.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Canvas Components JSON</h2>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-xs text-gray-300 border border-gray-700">
              {JSON.stringify(components, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 