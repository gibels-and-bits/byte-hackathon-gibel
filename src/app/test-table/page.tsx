'use client';

import React, { useEffect, useState } from 'react';
import { 
  ConcreteLayoutModel,
  TableComponent,
  TextComponent
} from '../../interfaces/receipt-models';
import { ConcreteReceiptCompiler } from '../../compiler';
import { ConcreteReceiptInterpreter } from '../../interpreter';
import { generateComponentId } from '../../utils/receipt-helpers';

export default function TestTablePage() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvas) return;

    // Create a simple table with 3 columns
    const tableComponent: TableComponent = {
      id: generateComponentId(),
      type: 'table',
      columns: [
        { key: 'col1', width: '33%', alignment: 'left' },
        { key: 'col2', width: '34%', alignment: 'center' },
        { key: 'col3', width: '33%', alignment: 'right' }
      ],
      rows: [
        {
          col1: {
            id: generateComponentId(),
            type: 'text',
            content: 'Left Text'
          } as TextComponent,
          col2: {
            id: generateComponentId(),
            type: 'text',
            content: 'Center Text'
          } as TextComponent,
          col3: {
            id: generateComponentId(),
            type: 'text',
            content: 'Right Text'
          } as TextComponent
        },
        {
          col1: {
            id: generateComponentId(),
            type: 'text',
            content: 'Item 1'
          } as TextComponent,
          col2: undefined,
          col3: {
            id: generateComponentId(),
            type: 'text',
            content: '$10.00'
          } as TextComponent
        },
        {
          col1: undefined,
          col2: {
            id: generateComponentId(),
            type: 'text',
            content: 'Middle Only'
          } as TextComponent,
          col3: undefined
        }
      ]
    };

    const layout: ConcreteLayoutModel = {
      version: '1.0.0',
      metadata: {
        name: 'Table Test',
        description: 'Testing table rendering',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      components: [
        {
          id: generateComponentId(),
          type: 'text',
          content: 'Table Test - 80 Character Width',
          style: { alignment: 'center', bold: true }
        } as TextComponent,
        {
          id: generateComponentId(),
          type: 'divider',
          style: 'solid',
          character: '='
        },
        tableComponent,
        {
          id: generateComponentId(),
          type: 'divider',
          style: 'solid',
          character: '-'
        },
        {
          id: generateComponentId(),
          type: 'text',
          content: '1234567890'.repeat(8), // 80 characters
          style: { alignment: 'left' }
        } as TextComponent
      ],
      settings: {
        paperWidth: 80,
        defaultFont: 'monospace'
      }
    };

    // Compile and interpret
    const compiler = new ConcreteReceiptCompiler();
    const dsl = compiler.compile(layout);
    
    console.log('Generated DSL:', JSON.stringify(dsl, null, 2));
    
    const interpreter = new ConcreteReceiptInterpreter(canvas);
    interpreter.execute(dsl);
  }, [canvas]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-100">Table Rendering Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Expected:</h2>
          <pre className="text-xs text-gray-300 font-mono mb-6">
{`Table Test - 80 Character Width
================================================================================
Left Text                        Center Text                         Right Text
Item 1                                                                   $10.00
                                 Middle Only                                    
--------------------------------------------------------------------------------
12345678901234567890123456789012345678901234567890123456789012345678901234567890`}
          </pre>
          
          <h2 className="text-xl font-semibold mb-4">Actual Canvas Output:</h2>
          <div className="bg-white p-4 rounded">
            <canvas
              ref={setCanvas}
              width={384}
              height={800}
              className="border border-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 