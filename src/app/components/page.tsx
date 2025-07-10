'use client';

import React, { useState } from 'react';
import { 
  Component,
  TextComponent,
  BarcodeComponent,
  QRCodeComponent,
  DividerComponent,
  SpacerComponent,
  RowComponent,
  TableComponent,
  AVAILABLE_TOKENS
} from '../../interfaces/receipt-models';
import { generateComponentId, generateMockTokenContext, replaceTokens } from '../../utils/receipt-helpers';
import { ReceiptPrinter } from '../../components/ReceiptPrinter';
import { HTMLCanvasEpsonPrinter } from '../../html-canvas-printer';
import { BarcodeType } from '../../interfaces/epson-printer';

type ComponentType = Component['type'];

export default function ComponentsPage() {
  const [selectedType, setSelectedType] = useState<ComponentType>('text');
  const [currentComponent, setCurrentComponent] = useState<Component>(createDefaultComponent('text'));
  const [mockContext] = useState(generateMockTokenContext());
  const [printerRef, setPrinterRef] = useState<HTMLCanvasEpsonPrinter | null>(null);

  // Create default component based on type
  function createDefaultComponent(type: ComponentType): Component {
    const id = generateComponentId();
    
    switch (type) {
      case 'text':
        return {
          id,
          type: 'text',
          content: 'Sample text with {store_name}',
          style: {
            size: { width: 1, height: 1 },
            bold: false,
            underline: false,
            alignment: 'left'
          }
        } as TextComponent;
        
      case 'barcode':
        return {
          id,
          type: 'barcode',
          data: '{order_number}',
          format: 'CODE128',
          options: {
            height: 100,
            showText: 'below'
          }
        } as BarcodeComponent;
        
      case 'qrcode':
        return {
          id,
          type: 'qrcode',
          data: 'https://example.com/order/{order_number}',
          options: {
            size: 200,
            errorCorrection: 'M'
          }
        } as QRCodeComponent;
        
      case 'divider':
        return {
          id,
          type: 'divider',
          style: 'solid',
          character: '-'
        } as DividerComponent;
        
      case 'spacer':
        return {
          id,
          type: 'spacer',
          lines: 2
        } as SpacerComponent;
        
      case 'row':
        return {
          id,
          type: 'row',
          columns: [
            {
              width: 'fill',
              alignment: 'left',
              component: {
                id: generateComponentId(),
                type: 'text',
                content: 'Left text'
              } as TextComponent
            },
            {
              width: 'auto',
              alignment: 'right',
              component: {
                id: generateComponentId(),
                type: 'text',
                content: 'Right text'
              } as TextComponent
            }
          ]
        } as RowComponent;
        
      case 'table':
        return {
          id,
          type: 'table',
          columns: [
            { key: 'item', header: 'Item', width: 'fill', alignment: 'left' },
            { key: 'qty', header: 'Qty', width: 'auto', alignment: 'center' },
            { key: 'price', header: 'Price', width: 'auto', alignment: 'right' }
          ],
          rows: [
            { item: 'Taco', qty: '2', price: '$3.99' },
            { item: 'Drink', qty: '1', price: '$2.49' }
          ],
          showHeader: true,
          dividerAfterHeader: true
        } as TableComponent;
        
      default:
        return createDefaultComponent('text');
    }
  }

  // Handle type change
  const handleTypeChange = (type: ComponentType) => {
    setSelectedType(type);
    setCurrentComponent(createDefaultComponent(type));
  };

  // Update component property
  const updateComponent = (updates: Partial<Component>) => {
    setCurrentComponent(prev => ({ ...prev, ...updates }) as Component);
  };

  // Render component to printer
  const renderToPrinter = () => {
    if (!printerRef) return;
    
    // Clear the printer
    printerRef.clear();
    
    // Simple rendering based on component type
    switch (currentComponent.type) {
      case 'text':
        const textComp = currentComponent as TextComponent;
        if (textComp.style?.alignment) {
          printerRef.addTextAlign(textComp.style.alignment);
        }
        if (textComp.style?.size) {
          printerRef.addTextSize(textComp.style.size.width, textComp.style.size.height);
        }
        printerRef.addTextStyle({
          bold: textComp.style?.bold,
          underline: textComp.style?.underline
        });
        printerRef.addText(replaceTokens(textComp.content, mockContext));
        break;
        
      case 'barcode':
        const barcodeComp = currentComponent as BarcodeComponent;
        printerRef.addBarcode(
          replaceTokens(barcodeComp.data, mockContext),
          barcodeComp.format as BarcodeType,
          {
            height: barcodeComp.options?.height,
            hri: barcodeComp.options?.showText
          }
        );
        break;
        
      case 'qrcode':
        const qrComp = currentComponent as QRCodeComponent;
        printerRef.addQRCode(
          replaceTokens(qrComp.data, mockContext),
          {
            size: qrComp.options?.size,
            errorCorrection: qrComp.options?.errorCorrection
          }
        );
        break;
        
      case 'divider':
        const dividerComp = currentComponent as DividerComponent;
        const char = dividerComp.character || '-';
        printerRef.addText(char.repeat(48));
        break;
        
      case 'spacer':
        const spacerComp = currentComponent as SpacerComponent;
        printerRef.addFeedLine(spacerComp.lines);
        break;
        
      case 'row':
        const rowComp = currentComponent as RowComponent;
        // Simplified row rendering
        rowComp.columns.forEach(col => {
          if (col.component.type === 'text') {
            printerRef.addTextAlign(col.alignment || 'left');
            printerRef.addText(replaceTokens((col.component as TextComponent).content, mockContext));
          }
        });
        break;
        
      case 'table':
        const tableComp = currentComponent as TableComponent;
        // Simplified table rendering
        if (tableComp.showHeader) {
          const headers = tableComp.columns.map(c => c.header || c.key).join(' | ');
          printerRef.addText(headers);
          if (tableComp.dividerAfterHeader) {
            printerRef.addText('-'.repeat(48));
          }
        }
        tableComp.rows.forEach(row => {
          const rowText = tableComp.columns.map(c => row[c.key] || '').join(' | ');
          printerRef.addText(rowText);
        });
        break;
    }
  };

  // Re-render when component changes
  React.useEffect(() => {
    renderToPrinter();
  }, [currentComponent, printerRef]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-100">Component Test Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Component Type Selector */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Component Type</h2>
            <div className="space-y-2">
              {(['text', 'barcode', 'qrcode', 'divider', 'spacer', 'row', 'table'] as ComponentType[]).map(type => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`w-full text-left px-4 py-2 rounded transition-colors ${
                    selectedType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Property Editor */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Properties</h2>
            <div className="space-y-4">
              {renderPropertyEditor()}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Preview</h2>
            <div className="bg-white rounded p-4">
              <ReceiptPrinter 
                width={300} 
                onPrinterReady={(printer) => setPrinterRef(printer as HTMLCanvasEpsonPrinter)}
              />
            </div>
          </div>
        </div>

        {/* JSON Output */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-100">Component JSON</h2>
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(currentComponent, null, 2))}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Copy JSON
            </button>
          </div>
          <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-xs text-gray-300 border border-gray-700">
            {JSON.stringify(currentComponent, null, 2)}
          </pre>
        </div>

        {/* Token Reference */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Available Tokens</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
            {AVAILABLE_TOKENS.map(token => (
              <div key={token.key} className="text-gray-300">
                <span className="font-mono text-blue-400">{`{${token.key}}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Property editor for each component type
  function renderPropertyEditor() {
    switch (currentComponent.type) {
      case 'text':
        const textComp = currentComponent as TextComponent;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
              <input
                type="text"
                value={textComp.content}
                onChange={(e) => updateComponent({ content: e.target.value } as Partial<TextComponent>)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Alignment</label>
              <select
                value={textComp.style?.alignment || 'left'}
                onChange={(e) => updateComponent({
                  style: { ...textComp.style, alignment: e.target.value as any }
                } as Partial<TextComponent>)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={textComp.style?.bold || false}
                  onChange={(e) => updateComponent({
                    style: { ...textComp.style, bold: e.target.checked }
                  } as Partial<TextComponent>)}
                  className="mr-2"
                />
                Bold
              </label>
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={textComp.style?.underline || false}
                  onChange={(e) => updateComponent({
                    style: { ...textComp.style, underline: e.target.checked }
                  } as Partial<TextComponent>)}
                  className="mr-2"
                />
                Underline
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Width</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={textComp.style?.size?.width || 1}
                  onChange={(e) => updateComponent({
                    style: { 
                      ...textComp.style, 
                      size: { 
                        ...textComp.style?.size,
                        width: parseInt(e.target.value) || 1
                      }
                    }
                  } as Partial<TextComponent>)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Height</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={textComp.style?.size?.height || 1}
                  onChange={(e) => updateComponent({
                    style: { 
                      ...textComp.style, 
                      size: { 
                        ...textComp.style?.size,
                        height: parseInt(e.target.value) || 1
                      }
                    }
                  } as Partial<TextComponent>)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
                />
              </div>
            </div>
          </>
        );

      case 'barcode':
        const barcodeComp = currentComponent as BarcodeComponent;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Data</label>
              <input
                type="text"
                value={barcodeComp.data}
                onChange={(e) => updateComponent({ data: e.target.value } as Partial<BarcodeComponent>)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Format</label>
              <select
                value={barcodeComp.format}
                onChange={(e) => updateComponent({ format: e.target.value } as Partial<BarcodeComponent>)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
              >
                <option value="CODE39">CODE39</option>
                <option value="CODE128">CODE128</option>
                <option value="UPC_A">UPC_A</option>
                <option value="CODE93">CODE93</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Height</label>
              <input
                type="number"
                min="50"
                max="200"
                value={barcodeComp.options?.height || 100}
                onChange={(e) => updateComponent({
                  options: { ...barcodeComp.options, height: parseInt(e.target.value) || 100 }
                } as Partial<BarcodeComponent>)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Show Text</label>
              <select
                value={barcodeComp.options?.showText || 'below'}
                onChange={(e) => updateComponent({
                  options: { ...barcodeComp.options, showText: e.target.value as any }
                } as Partial<BarcodeComponent>)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
              >
                <option value="none">None</option>
                <option value="above">Above</option>
                <option value="below">Below</option>
                <option value="both">Both</option>
              </select>
            </div>
          </>
        );

      case 'spacer':
        const spacerComp = currentComponent as SpacerComponent;
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Lines</label>
            <input
              type="number"
              min="1"
              max="10"
              value={spacerComp.lines}
              onChange={(e) => updateComponent({ lines: parseInt(e.target.value) || 1 } as Partial<SpacerComponent>)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
            />
          </div>
        );

      case 'divider':
        const dividerComp = currentComponent as DividerComponent;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Character</label>
              <input
                type="text"
                maxLength={1}
                value={dividerComp.character || '-'}
                onChange={(e) => updateComponent({ character: e.target.value || '-' } as Partial<DividerComponent>)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Style</label>
              <select
                value={dividerComp.style || 'solid'}
                onChange={(e) => updateComponent({ style: e.target.value as any } as Partial<DividerComponent>)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="double">Double</option>
              </select>
            </div>
          </>
        );

      default:
        return <div className="text-gray-400">Property editor not implemented for {currentComponent.type}</div>;
    }
  }
} 