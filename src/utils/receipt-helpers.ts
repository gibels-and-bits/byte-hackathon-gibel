import { 
  Component, 
  TokenDefinition, 
  AVAILABLE_TOKENS, 
  TokenContext,
  ConcreteLayoutModel,
  RowComponent,
  TextComponent,
  TableComponent
} from '../interfaces/receipt-models';

/**
 * Generate a unique ID for components
 */
export function generateComponentId(): string {
  return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract token names from a string (e.g., "Total: ${total}" -> ["total"])
 */
export function extractTokens(text: string): string[] {
  const tokenPattern = /\{([^}]+)\}/g;
  const tokens: string[] = [];
  let match;
  
  while ((match = tokenPattern.exec(text)) !== null) {
    tokens.push(match[1]);
  }
  
  return tokens;
}

/**
 * Replace tokens in text with values from context
 */
export function replaceTokens(text: string, context: TokenContext): string {
  return text.replace(/\{([^}]+)\}/g, (match, token) => {
    const value = context[token];
    if (value === undefined) {
      return match; // Keep original if no value
    }
    
    // Format based on token type
    const tokenDef = AVAILABLE_TOKENS.find(t => t.key === token);
    if (tokenDef?.type === 'currency' && typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    
    return String(value);
  });
}

/**
 * Generate mock token context for preview
 */
export function generateMockTokenContext(): TokenContext {
  const context: TokenContext = {};
  
  AVAILABLE_TOKENS.forEach(token => {
    context[token.key] = token.mockValue;
  });
  
  return context;
}

/**
 * Create a sample receipt layout
 */
export function createSampleLayout(): ConcreteLayoutModel {
  return {
    version: '1.0',
    metadata: {
      name: 'Taco Bell Receipt',
      description: 'Standard receipt template for Taco Bell stores',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    settings: {
      paperWidth: 80, // 80 characters for standard receipt width
      defaultFont: 'monospace',
      locale: 'en-US'
    },
    components: [
      // Header
      {
        id: generateComponentId(),
        type: 'text',
        content: '{store_name}',
        style: {
          size: { width: 2, height: 2 },
          bold: true,
          alignment: 'center'
        }
      } as TextComponent,
      
      // Store info
      {
        id: generateComponentId(),
        type: 'text',
        content: '{store_address}',
        style: { alignment: 'center' }
      } as TextComponent,
      
      {
        id: generateComponentId(),
        type: 'text',
        content: '{store_phone}',
        style: { alignment: 'center' }
      } as TextComponent,
      
      // Divider
      {
        id: generateComponentId(),
        type: 'divider',
        style: 'solid',
        character: '-'
      },
      
      // Order info row
      {
        id: generateComponentId(),
        type: 'row',
        columns: [
          {
            width: 'fill',
            alignment: 'left',
            component: {
              id: generateComponentId(),
              type: 'text',
              content: 'Order #{order_number}'
            } as TextComponent
          },
          {
            width: 'auto',
            alignment: 'right',
            component: {
              id: generateComponentId(),
              type: 'text',
              content: '{date} {time}'
            } as TextComponent
          }
        ]
      } as RowComponent,
      
      // Spacer
      {
        id: generateComponentId(),
        type: 'spacer',
        lines: 1
      },
      
      // Items table
      {
        id: generateComponentId(),
        type: 'table',
        columns: [
          { key: 'name', header: 'Item', width: 'fill', alignment: 'left' },
          { key: 'quantity', header: 'Qty', width: 'auto', alignment: 'center' },
          { key: 'price', header: 'Price', width: 'auto', alignment: 'right' }
        ],
        rows: [], // Will be populated from {order_items}
        showHeader: true,
        dividerAfterHeader: true
      } as TableComponent,
      
      // Divider
      {
        id: generateComponentId(),
        type: 'divider',
        style: 'solid',
        character: '-'
      },
      
      // Totals
      {
        id: generateComponentId(),
        type: 'row',
        columns: [
          {
            width: 'fill',
            alignment: 'left',
            component: {
              id: generateComponentId(),
              type: 'text',
              content: 'Subtotal:'
            } as TextComponent
          },
          {
            width: 'auto',
            alignment: 'right',
            component: {
              id: generateComponentId(),
              type: 'text',
              content: '${subtotal}'
            } as TextComponent
          }
        ]
      } as RowComponent,
      
      {
        id: generateComponentId(),
        type: 'row',
        columns: [
          {
            width: 'fill',
            alignment: 'left',
            component: {
              id: generateComponentId(),
              type: 'text',
              content: 'Tax:'
            } as TextComponent
          },
          {
            width: 'auto',
            alignment: 'right',
            component: {
              id: generateComponentId(),
              type: 'text',
              content: '${tax}'
            } as TextComponent
          }
        ]
      } as RowComponent,
      
      {
        id: generateComponentId(),
        type: 'row',
        columns: [
          {
            width: 'fill',
            alignment: 'left',
            component: {
              id: generateComponentId(),
              type: 'text',
              content: 'Total:',
              style: { bold: true, size: { width: 1, height: 1 } }
            } as TextComponent
          },
          {
            width: 'auto',
            alignment: 'right',
            component: {
              id: generateComponentId(),
              type: 'text',
              content: '${total}',
              style: { bold: true, size: { width: 1, height: 1 } }
            } as TextComponent
          }
        ]
      } as RowComponent,
      
      // Spacer
      {
        id: generateComponentId(),
        type: 'spacer',
        lines: 1
      },
      
      // Barcode
      {
        id: generateComponentId(),
        type: 'barcode',
        data: '{transaction_id}',
        format: 'CODE128',
        options: {
          height: 80,
          showText: 'below'
        }
      },
      
      // Footer
      {
        id: generateComponentId(),
        type: 'spacer',
        lines: 2
      },
      
      {
        id: generateComponentId(),
        type: 'text',
        content: 'Thank you for your visit!',
        style: { alignment: 'center', bold: true }
      } as TextComponent,
      
      // Cut
      {
        id: generateComponentId(),
        type: 'spacer',
        lines: 3
      }
    ]
  };
}

/**
 * Create default layout settings
 */
export function createDefaultLayoutSettings(): Required<ConcreteLayoutModel['settings']> {
  return {
    paperWidth: 80, // 80 characters for standard receipt width
    defaultFont: 'monospace',
    locale: 'en-US'
  };
}

/**
 * Calculate column positions for a row based on paper width
 */
export function calculateColumnPositions(
  columns: RowComponent['columns'], 
  paperWidth: number
): Array<{ start: number; end: number }> {
  const positions: Array<{ start: number; end: number }> = [];
  let currentPos = 0;
  
  // First pass: calculate auto widths
  const autoColumns = columns.filter(col => col.width === 'auto');
  const fillColumns = columns.filter(col => col.width === 'fill');
  const fixedColumns = columns.filter(col => typeof col.width === 'number');
  
  // Calculate fixed space
  const fixedSpace = fixedColumns.reduce((sum, col) => 
    sum + (col.width as number) / 100 * paperWidth, 0
  );
  
  // Estimate auto column widths (simplified - in real implementation would measure text)
  const autoSpace = autoColumns.length * 10; // Assume 10 chars per auto column
  
  // Remaining space for fill columns
  const remainingSpace = paperWidth - fixedSpace - autoSpace;
  const fillSpace = fillColumns.length > 0 ? remainingSpace / fillColumns.length : 0;
  
  // Second pass: assign positions
  columns.forEach(col => {
    let width: number;
    
    if (col.width === 'auto') {
      width = 10; // Simplified
    } else if (col.width === 'fill') {
      width = fillSpace;
    } else if (typeof col.width === 'number') {
      width = col.width / 100 * paperWidth;
    } else {
      width = 10; // Default
    }
    
    positions.push({
      start: Math.round(currentPos),
      end: Math.round(currentPos + width)
    });
    
    currentPos += width;
  });
  
  return positions;
}

/**
 * Validate a layout for common issues
 */
export function validateLayout(layout: ConcreteLayoutModel): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for empty components
  if (layout.components.length === 0) {
    errors.push('Layout must have at least one component');
  }
  
  // Check for missing IDs
  const ids = new Set<string>();
  layout.components.forEach((comp, idx) => {
    if (!comp.id) {
      errors.push(`Component at index ${idx} is missing an ID`);
    } else if (ids.has(comp.id)) {
      errors.push(`Duplicate component ID: ${comp.id}`);
    } else {
      ids.add(comp.id);
    }
  });
  
  // Check for unknown tokens
  const allTokens = new Set(AVAILABLE_TOKENS.map(t => t.key));
  const usedTokens = new Set<string>();
  
  function checkComponentForTokens(comp: Component) {
    if (comp.type === 'text' && comp.content) {
      extractTokens(comp.content).forEach(token => {
        usedTokens.add(token);
        if (!allTokens.has(token)) {
          warnings.push(`Unknown token: {${token}}`);
        }
      });
    } else if (comp.type === 'barcode' && comp.data) {
      extractTokens(comp.data).forEach(token => {
        usedTokens.add(token);
        if (!allTokens.has(token)) {
          warnings.push(`Unknown token in barcode: {${token}}`);
        }
      });
    } else if (comp.type === 'row') {
      comp.columns.forEach(col => checkComponentForTokens(col.component));
    }
  }
  
  layout.components.forEach(checkComponentForTokens);
  
  // Check paper width
  if (layout.settings.paperWidth && layout.settings.paperWidth > 80) {
    warnings.push('Paper width > 80 characters may not be supported by all printers');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
} 