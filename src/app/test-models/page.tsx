'use client';

import React from 'react';
import { createSampleLayout, validateLayout, generateMockTokenContext, replaceTokens } from '../../utils/receipt-helpers';
import { ConcreteLayoutModel, Component } from '../../interfaces/receipt-models';

export default function TestModelsPage() {
  const sampleLayout = createSampleLayout();
  const validation = validateLayout(sampleLayout);
  const mockContext = generateMockTokenContext();

  // Helper to render a component for visualization
  const renderComponent = (component: Component, indent: number = 0): React.ReactElement => {
    const padding = `${indent * 20}px`;
    
    switch (component.type) {
      case 'text':
        return (
          <div style={{ paddingLeft: padding }} className="mb-2">
            <span className="text-blue-400 font-mono">text:</span>{' '}
            <span className="text-gray-300">
              {replaceTokens(component.content, mockContext)}
            </span>
            {component.style?.bold && <span className="text-xs ml-2 text-gray-500">[bold]</span>}
            {component.style?.alignment && <span className="text-xs ml-2 text-gray-500">[{component.style.alignment}]</span>}
          </div>
        );
        
      case 'row':
        return (
          <div style={{ paddingLeft: padding }} className="mb-2 border-l-2 border-gray-700 pl-2">
            <div className="text-purple-400 font-mono mb-1">row ({component.columns.length} columns):</div>
            {component.columns.map((col, idx) => (
              <div key={idx} className="ml-4">
                <span className="text-xs text-gray-500">
                  Column {idx + 1} (width: {col.width}, align: {col.alignment || 'left'}):
                </span>
                {renderComponent(col.component, 1)}
              </div>
            ))}
          </div>
        );
        
      case 'table':
        return (
          <div style={{ paddingLeft: padding }} className="mb-2">
            <span className="text-green-400 font-mono">table:</span>{' '}
            <span className="text-xs text-gray-500">
              {component.columns.map(c => c.header || c.key).join(' | ')}
            </span>
          </div>
        );
        
      case 'barcode':
        return (
          <div style={{ paddingLeft: padding }} className="mb-2">
            <span className="text-orange-400 font-mono">barcode:</span>{' '}
            <span className="text-gray-300">{component.format} - {replaceTokens(component.data, mockContext)}</span>
          </div>
        );
        
      case 'divider':
        return (
          <div style={{ paddingLeft: padding }} className="mb-2">
            <span className="text-gray-400 font-mono">divider:</span>{' '}
            <span className="text-gray-600">{component.character?.repeat(20) || '────────────────────'}</span>
          </div>
        );
        
      case 'spacer':
        return (
          <div style={{ paddingLeft: padding }} className="mb-2">
            <span className="text-gray-500 font-mono">spacer:</span>{' '}
            <span className="text-xs text-gray-600">{component.lines} lines</span>
          </div>
        );
        
      default:
        return (
          <div style={{ paddingLeft: padding }} className="mb-2">
            <span className="text-red-400 font-mono">{component.type}:</span>{' '}
            <span className="text-xs text-gray-500">[component]</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-100">Phase 1: Data Models Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Layout Structure */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Sample Layout Structure</h2>
            <div className="text-sm">
              <div className="mb-4 text-gray-300">
                <strong>Name:</strong> {sampleLayout.metadata.name}
              </div>
              <div className="mb-4 text-gray-300">
                <strong>Paper Width:</strong> {sampleLayout.settings.paperWidth} characters
              </div>
              <div className="mb-4 text-gray-300">
                <strong>Components:</strong> {sampleLayout.components.length}
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-semibold mb-2 text-gray-100">Component Tree:</h3>
                <div className="font-mono text-xs">
                  {sampleLayout.components.map((comp, idx) => (
                    <div key={comp.id}>
                      {renderComponent(comp)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Validation & Tokens */}
          <div className="space-y-6">
            {/* Validation Results */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Validation Results</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className={`inline-block w-4 h-4 rounded-full mr-2 ${validation.valid ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="font-semibold text-gray-300">{validation.valid ? 'Valid' : 'Invalid'}</span>
                </div>
                
                {validation.errors.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-red-400 mb-2">Errors:</h3>
                    <ul className="list-disc list-inside text-sm text-red-400">
                      {validation.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {validation.warnings.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-yellow-400 mb-2">Warnings:</h3>
                    <ul className="list-disc list-inside text-sm text-yellow-400">
                      {validation.warnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mock Token Context */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Mock Token Values</h2>
              <div className="space-y-2 text-sm">
                {Object.entries(mockContext).slice(0, 10).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-mono text-blue-400">{`{${key}}`}</span>
                    <span className="text-gray-300">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
                <div className="text-xs text-gray-500 mt-2">
                  ... and {Object.keys(mockContext).length - 10} more tokens
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Raw JSON View */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Raw Layout JSON</h2>
          <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-xs text-gray-300 border border-gray-700">
            {JSON.stringify(sampleLayout, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 