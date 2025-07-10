'use client';

import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDroppable } from '@dnd-kit/core';
import { 
  Component,
  TextComponent,
  BarcodeComponent,
  QRCodeComponent,
  DividerComponent,
  SpacerComponent,
  TableComponent,
  ConcreteLayoutModel
} from '../../interfaces/receipt-models';
import { generateComponentId } from '../../utils/receipt-helpers';
import { renderComponent } from '../../components/receipt-components';
import { ConcreteReceiptCompiler } from '../../compiler';
import Link from 'next/link';

// Editor Canvas Drop Zone
function EditorCanvas({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'editor-canvas'
  });

  return (
    <div 
      ref={setNodeRef}
      className={`min-h-[600px] rounded-lg p-4 transition-colors ${
        isOver ? 'bg-gray-600 border-2 border-blue-400' : 'bg-gray-700'
      }`}
    >
      {children}
    </div>
  );
}

export default function EditorPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [showDSL, setShowDSL] = useState(false);
  const [dslData, setDslData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'layout'>('basic');
  
  // Basic component palette
  const basicComponents: Component[] = [
    {
      id: 'palette-text',
      type: 'text',
      content: 'Text',
      style: { alignment: 'left' }
    } as TextComponent,
    {
      id: 'palette-barcode',
      type: 'barcode',
      data: '123456789',
      format: 'CODE128',
      options: { height: 80, showText: 'below' }
    } as BarcodeComponent,
    {
      id: 'palette-qrcode',
      type: 'qrcode',
      data: 'https://example.com',
      options: { size: 150, errorCorrection: 'M' }
    } as QRCodeComponent,
    {
      id: 'palette-divider',
      type: 'divider',
      style: 'solid',
      character: '-'
    } as DividerComponent,
    {
      id: 'palette-spacer',
      type: 'spacer',
      lines: 1
    } as SpacerComponent,
  ];
  
  // Layout components (just table)
  const layoutComponents: Component[] = [
    {
      id: 'palette-table',
      type: 'table',
      columns: [
        { key: 'col1', width: '50%', alignment: 'left' },
        { key: 'col2', width: '50%', alignment: 'right' }
      ],
      rows: [
        { col1: undefined, col2: undefined }
      ]
    } as TableComponent,
  ];
  
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    
    if (!event.over) return;
    
    const overId = event.over.id as string;
    const activeData = event.active.data.current;
    
    // Handle dropping into table cells
    if (overId.startsWith('table-cell-') && event.over.data.current) {
      const { onDrop } = event.over.data.current;
      if (onDrop && activeData) {
        onDrop(activeData);
      }
      return;
    }
    
    // Handle dropping into nested drop zones (like in rows)
    if (overId.startsWith('drop-zone-') && event.over.data.current) {
      const { onDrop } = event.over.data.current;
      if (onDrop && activeData) {
        onDrop(activeData);
      }
      return;
    }
    
    // Handle dropping onto main canvas
    if (overId === 'editor-canvas' && activeData) {
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
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  };
  
  const moveComponent = (id: string, direction: 'up' | 'down') => {
    const index = components.findIndex(comp => comp.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= components.length) return;
    
    const newComponents = [...components];
    [newComponents[index], newComponents[newIndex]] = [newComponents[newIndex], newComponents[index]];
    setComponents(newComponents);
  };
  
  const generateLayout = (): ConcreteLayoutModel => {
    return {
      version: '1.0.0',
      metadata: {
        name: 'Custom Receipt',
        description: 'Created with visual editor',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      components,
      settings: {
        paperWidth: 80,
        defaultFont: 'monospace'
      }
    };
  };
  
  const handlePrint = () => {
    let layout = generateLayout();
    
    // If no components, add a default message
    if (layout.components.length === 0) {
      const defaultComponent: TextComponent = {
        id: 'default-preview',
        type: 'text',
        content: 'Empty Receipt - Add components to see preview',
        style: { alignment: 'center' }
      };
      layout = {
        ...layout,
        components: [defaultComponent]
      };
    }
    
    const compiler = new ConcreteReceiptCompiler();
    const dsl = compiler.compile(layout);
    
    // Encode DSL as base64 to pass through URL
    const encodedDSL = btoa(JSON.stringify(dsl));
    
    // Open print preview in new window with DSL in URL
    window.open(`/print?dsl=${encodedDSL}`, '_blank', 'width=400,height=800,menubar=no,toolbar=no,location=no,status=no');
  };
  
  const handleViewDSL = () => {
    const layout = generateLayout();
    const compiler = new ConcreteReceiptCompiler();
    const dsl = compiler.compile(layout);
    setDslData(dsl);
    setShowDSL(true);
  };
  
  const activeComponent = activeId 
    ? basicComponents.find(c => c.id === activeId) || layoutComponents.find(c => c.id === activeId)
    : null;
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Visual Receipt Editor</h1>
            <p className="text-gray-400">Drag and drop components to design your receipt</p>
          </div>
          <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
            ← Back to Home
          </Link>
        </div>
        
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Component Palette */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-8">
                <h2 className="text-xl font-semibold mb-4">Components</h2>
                
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
            
            {/* Editor Canvas */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Receipt Canvas</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        // Add a test component
                        const testComponent: TextComponent = {
                          id: generateComponentId(),
                          type: 'text',
                          content: 'Test Receipt Preview',
                          style: { alignment: 'center', bold: true, size: { width: 2, height: 2 } }
                        };
                        setComponents([...components, testComponent]);
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                    >
                      Add Test
                    </button>
                    <button
                      onClick={handleViewDSL}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                    >
                      View DSL
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
                    >
                      Print
                    </button>
                  </div>
                </div>
                
                <EditorCanvas>
                  {components.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                      <p className="mb-2">Drag components here to start designing</p>
                      <p className="text-sm">Components will appear in order from top to bottom</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {components.map((component, index) => (
                        <div
                          key={component.id}
                          className={`relative group cursor-pointer ${
                            selectedComponentId === component.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setSelectedComponentId(component.id)}
                        >
                          {renderComponent(component, {
                            onUpdate: (updates) => updateComponent(component.id, updates),
                            isEditing: true,
                            isPreview: true
                          })}
                          
                          {/* Component Controls */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            {index > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveComponent(component.id, 'up');
                                }}
                                className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                                title="Move up"
                              >
                                ↑
                              </button>
                            )}
                            {index < components.length - 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveComponent(component.id, 'down');
                                }}
                                className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                                title="Move down"
                              >
                                ↓
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeComponent(component.id);
                              }}
                              className="p-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                              title="Remove"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </EditorCanvas>
              </div>
            </div>
            
            {/* Properties Panel / DSL View */}
            <div className="lg:col-span-1">
              {showDSL ? (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4">Generated DSL</h2>
                  <div className="bg-gray-900 rounded p-4 overflow-auto max-h-[600px]">
                    <pre className="text-xs text-gray-300">
                      {JSON.stringify(dslData, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : selectedComponentId ? (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4">Properties</h2>
                  <div className="text-sm text-gray-400">
                    <p>Component ID: {selectedComponentId}</p>
                    <p className="mt-2">Edit properties directly on the component in the canvas.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
                  <div className="text-sm text-gray-400 space-y-2">
                    <p>1. Drag components from the palette to the canvas</p>
                    <p>2. Click on components to select and edit them</p>
                    <p>3. Use the arrow buttons to reorder components</p>
                    <p>4. Click Preview to see the rendered receipt</p>
                    <p>5. Click View DSL to see the compiled commands</p>
                  </div>
                </div>
              )}
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
      </div>
    </div>
  );
} 