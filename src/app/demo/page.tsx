'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ConcreteReceiptCompiler } from '../../compiler';
import { ConcreteReceiptInterpreter } from '../../interpreter';
import { ReceiptPreview } from '../../components/ReceiptPreview';
import { 
  ConcreteLayoutModel,
  TextComponent,
  DividerComponent,
  SpacerComponent,
  RowComponent,
  BarcodeComponent,
  QRCodeComponent,
  TableComponent
} from '../../interfaces/receipt-models';

export default function DemoPage() {
  const [showDSL, setShowDSL] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [dsl, setDsl] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  
  // Sample receipt layout
  const sampleLayout: ConcreteLayoutModel = {
    version: '1.0.0',
    metadata: {
      name: 'Taco Bell Receipt',
      description: 'Sample receipt for demonstration',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    components: [
      // Store header
      {
        id: '1',
        type: 'text',
        content: '{store_name}',
        style: { alignment: 'center', size: { width: 2, height: 2 }, bold: true }
      } as TextComponent,
      {
        id: '2',
        type: 'text',
        content: '{store_address}',
        style: { alignment: 'center' }
      } as TextComponent,
      {
        id: '3',
        type: 'text',
        content: '{store_phone}',
        style: { alignment: 'center' }
      } as TextComponent,
      {
        id: '4',
        type: 'spacer',
        lines: 1
      } as SpacerComponent,
      {
        id: '5',
        type: 'divider',
        style: 'double',
        character: '='
      } as DividerComponent,
      {
        id: '6',
        type: 'spacer',
        lines: 1
      } as SpacerComponent,
      
      // Transaction info
      {
        id: '7',
        type: 'row',
        columns: [
          {
            width: 'fill',
            alignment: 'left',
            component: {
              id: '7a',
              type: 'text',
              content: 'Order: {order_number}'
            } as TextComponent
          },
          {
            width: 'auto',
            alignment: 'right',
            component: {
              id: '7b',
              type: 'text',
              content: '{date}'
            } as TextComponent
          }
        ]
      } as RowComponent,
      {
        id: '8',
        type: 'row',
        columns: [
          {
            width: 'fill',
            alignment: 'left',
            component: {
              id: '8a',
              type: 'text',
              content: 'Cashier: {cashier_name}'
            } as TextComponent
          },
          {
            width: 'auto',
            alignment: 'right',
            component: {
              id: '8b',
              type: 'text',
              content: '{time}'
            } as TextComponent
          }
        ]
      } as RowComponent,
      {
        id: '9',
        type: 'spacer',
        lines: 1
      } as SpacerComponent,
      {
        id: '10',
        type: 'divider',
        style: 'solid',
        character: '-'
      } as DividerComponent,
      {
        id: '11',
        type: 'spacer',
        lines: 1
      } as SpacerComponent,
      
      // Items table
      {
        id: '12',
        type: 'table',
        columns: [
          { key: 'item', header: 'Item', width: 'fill', alignment: 'left' },
          { key: 'qty', header: 'Qty', width: 10, alignment: 'center' },
          { key: 'price', header: 'Price', width: 'auto', alignment: 'right' }
        ],
        rows: [
          { item: 'Crunchy Taco', qty: '2', price: '$7.98' },
          { item: 'Baja Blast', qty: '1', price: '$2.49' },
          { item: 'Nacho Fries', qty: '1', price: '$1.99' }
        ],
        showHeader: true,
        dividerAfterHeader: true
      } as TableComponent,
      {
        id: '13',
        type: 'spacer',
        lines: 1
      } as SpacerComponent,
      {
        id: '14',
        type: 'divider',
        style: 'solid',
        character: '-'
      } as DividerComponent,
      {
        id: '15',
        type: 'spacer',
        lines: 1
      } as SpacerComponent,
      
      // Totals
      {
        id: '16',
        type: 'row',
        columns: [
          {
            width: 'fill',
            alignment: 'right',
            component: {
              id: '16a',
              type: 'text',
              content: 'Subtotal:'
            } as TextComponent
          },
          {
            width: 'auto',
            alignment: 'right',
            component: {
              id: '16b',
              type: 'text',
              content: '{subtotal}'
            } as TextComponent
          }
        ]
      } as RowComponent,
      {
        id: '17',
        type: 'row',
        columns: [
          {
            width: 'fill',
            alignment: 'right',
            component: {
              id: '17a',
              type: 'text',
              content: 'Tax:'
            } as TextComponent
          },
          {
            width: 'auto',
            alignment: 'right',
            component: {
              id: '17b',
              type: 'text',
              content: '{tax}'
            } as TextComponent
          }
        ]
      } as RowComponent,
      {
        id: '18',
        type: 'row',
        columns: [
          {
            width: 'fill',
            alignment: 'right',
            component: {
              id: '18a',
              type: 'text',
              content: 'Total:',
              style: { bold: true, size: { width: 1.5, height: 1.5 } }
            } as TextComponent
          },
          {
            width: 'auto',
            alignment: 'right',
            component: {
              id: '18b',
              type: 'text',
              content: '{total}',
              style: { bold: true, size: { width: 1.5, height: 1.5 } }
            } as TextComponent
          }
        ]
      } as RowComponent,
      {
        id: '19',
        type: 'spacer',
        lines: 2
      } as SpacerComponent,
      
      // Barcode
      {
        id: '20',
        type: 'barcode',
        data: '{transaction_id}',
        format: 'CODE128',
        options: { height: 80, showText: 'below' }
      } as BarcodeComponent,
      {
        id: '21',
        type: 'spacer',
        lines: 2
      } as SpacerComponent,
      
      // QR Code
      {
        id: '22',
        type: 'qrcode',
        data: 'https://example.com/receipt/{order_number}',
        options: { size: 150, errorCorrection: 'M' }
      } as QRCodeComponent,
      {
        id: '23',
        type: 'spacer',
        lines: 1
      } as SpacerComponent,
      {
        id: '24',
        type: 'text',
        content: 'Thank you for your order!',
        style: { alignment: 'center', bold: true }
      } as TextComponent,
      {
        id: '25',
        type: 'spacer',
        lines: 2
      } as SpacerComponent
    ],
    settings: {
      paperWidth: 80,
      defaultFont: 'monospace'
    }
  };
  
  // Render receipt on mount
  useEffect(() => {
    if (canvasRef.current && showPreview) {
      const compiler = new ConcreteReceiptCompiler();
      const compiledDSL = compiler.compile(sampleLayout);
      const interpreter = new ConcreteReceiptInterpreter(canvasRef.current);
      interpreter.execute(compiledDSL);
      setDsl(compiledDSL);
    }
  }, [showPreview]);
  
  const handleViewDSL = () => {
    const compiler = new ConcreteReceiptCompiler();
    const compiledDSL = compiler.compile(sampleLayout);
    setDsl(compiledDSL);
    setShowDSL(!showDSL);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Receipt Printer Demo</h1>
              <p className="text-gray-400">Sample receipt rendered with HTML Canvas</p>
            </div>
            <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              ← Back to Home
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Receipt Preview */}
            <div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Receipt Preview</h2>
                <ReceiptPreview canvasRef={canvasRef} height={1200} />
              </div>
            </div>
            
            {/* Controls and DSL */}
            <div className="space-y-6">
              {/* Controls */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Demo Controls</h2>
                <button
                  onClick={handleViewDSL}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <span>📄</span>
                  {showDSL ? 'Hide' : 'Show'} Compiled DSL
                </button>
                
                <div className="mt-4 text-sm text-gray-400">
                  <p>This demo shows a sample Taco Bell receipt with:</p>
                  <ul className="mt-2 space-y-1 ml-4">
                    <li>• Dynamic tokens (store info, order details)</li>
                    <li>• Table layout for items</li>
                    <li>• Barcode and QR code</li>
                    <li>• Various text styles and alignments</li>
                  </ul>
                </div>
              </div>
              
              {/* DSL Display */}
              {showDSL && dsl && (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4">Compiled DSL</h2>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[600px]">
                    <pre className="text-xs text-gray-300">
                      {JSON.stringify(dsl, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              
              {/* Token Values */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Token Values</h2>
                <div className="text-sm text-gray-400 space-y-1">
                  <p><code className="text-blue-400">{'{store_name}'}</code> → Taco Bell #1234</p>
                  <p><code className="text-blue-400">{'{order_number}'}</code> → 000123</p>
                  <p><code className="text-blue-400">{'{subtotal}'}</code> → $24.99</p>
                  <p><code className="text-blue-400">{'{tax}'}</code> → $2.25</p>
                  <p><code className="text-blue-400">{'{total}'}</code> → $27.24</p>
                  <p className="pt-2 text-xs">And many more...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
