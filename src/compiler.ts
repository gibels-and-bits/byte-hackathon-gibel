import { 
  Component, 
  ConcreteLayoutModel, 
  ConcreteReceiptDSL,
  DSLCommand,
  TextComponent,
  BarcodeComponent,
  QRCodeComponent,
  DividerComponent,
  SpacerComponent,
  RowComponent,
  TableComponent,
  ImageComponent,
  DynamicListComponent
} from './interfaces/receipt-models';
import { ReceiptCompiler } from './interfaces/receipt-compiler';
import { extractTokens } from './utils/receipt-helpers';

export class ConcreteReceiptCompiler implements ReceiptCompiler {
  compile(layout: ConcreteLayoutModel): ConcreteReceiptDSL {
    const commands: DSLCommand[] = [];
    
    // Process each component in order
    for (const component of layout.components) {
      const componentCommands = this.compileComponent(component);
      commands.push(...componentCommands);
    }
    
    // Add final cut command
    commands.push({ type: 'cutPaper' });
    
    return {
      version: '1.0.0',
      metadata: {
        generatedAt: new Date().toISOString(),
        layoutId: layout.metadata.name
      },
      commands,
      tokens: {
        required: this.extractRequiredTokens(layout),
        optional: this.extractOptionalTokens(layout)
      }
    };
  }
  
  private compileComponent(component: Component): DSLCommand[] {
    const commands: DSLCommand[] = [];
    
    switch (component.type) {
      case 'text':
        commands.push(...this.compileTextComponent(component as TextComponent));
        break;
      case 'barcode':
        commands.push(...this.compileBarcodeComponent(component as BarcodeComponent));
        break;
      case 'qrcode':
        commands.push(...this.compileQRCodeComponent(component as QRCodeComponent));
        break;
      case 'image':
        commands.push(...this.compileImageComponent(component as ImageComponent));
        break;
      case 'divider':
        commands.push(...this.compileDividerComponent(component as DividerComponent));
        break;
      case 'spacer':
        commands.push(...this.compileSpacerComponent(component as SpacerComponent));
        break;
      case 'row':
        commands.push(...this.compileRowComponent(component as RowComponent));
        break;
      case 'table':
        commands.push(...this.compileTableComponent(component as TableComponent));
        break;
      case 'dynamic-list':
        commands.push(...this.compileDynamicListComponent(component as DynamicListComponent));
        break;
    }
    
    return commands;
  }
  
  private compileTextComponent(component: TextComponent): DSLCommand[] {
    const commands: DSLCommand[] = [];
    
    // Set alignment if specified
    if (component.style?.alignment) {
      commands.push({
        type: 'textAlign',
        alignment: component.style.alignment
      });
    }
    
    // Set size if specified
    if (component.style?.size) {
      commands.push({
        type: 'textSize',
        width: component.style.size.width,
        height: component.style.size.height
      });
    }
    
    // Set style if specified
    if (component.style?.bold || component.style?.underline || component.style?.fontFamily) {
      commands.push({
        type: 'textStyle',
        bold: component.style.bold,
        underline: component.style.underline,
        fontFamily: component.style.fontFamily
      });
    }
    
    // Add the text
    commands.push({
      type: 'text',
      value: component.content,
      style: {
        bold: component.style?.bold,
        underline: component.style?.underline,
        fontFamily: component.style?.fontFamily
      }
    });
    
    // Reset to defaults after text
    if (component.style?.alignment && component.style.alignment !== 'left') {
      commands.push({
        type: 'textAlign',
        alignment: 'left'
      });
    }
    
    if (component.style?.size && (component.style.size.width !== 1 || component.style.size.height !== 1)) {
      commands.push({
        type: 'textSize',
        width: 1,
        height: 1
      });
    }
    
    return commands;
  }
  
  private compileBarcodeComponent(component: BarcodeComponent): DSLCommand[] {
    return [{
      type: 'barcode',
      data: component.data,
      format: component.format,
      width: component.options?.width,
      height: component.options?.height,
      hri: component.options?.showText
    }];
  }
  
  private compileQRCodeComponent(component: QRCodeComponent): DSLCommand[] {
    return [{
      type: 'qrcode',
      data: component.data,
      size: component.options?.size,
      errorCorrection: component.options?.errorCorrection
    }];
  }
  
  private compileImageComponent(component: ImageComponent): DSLCommand[] {
    return [{
      type: 'image',
      imageData: component.src,
      width: component.options?.width,
      height: component.options?.height,
      alignment: component.options?.alignment
    }];
  }
  
  private compileDividerComponent(component: DividerComponent): DSLCommand[] {
    const commands: DSLCommand[] = [];
    const paperWidth = 80; // Characters
    
    let char = '-';
    switch (component.style) {
      case 'double':
        commands.push({
          type: 'text',
          value: char.repeat(paperWidth) + '\n' + char.repeat(paperWidth)
        });
        break;
      case 'dashed':
        commands.push({
          type: 'text',
          value: (char + ' ').repeat(paperWidth / 2)
        });
        break;
      default:
        commands.push({
          type: 'text',
          value: char.repeat(paperWidth)
        });
    }
    
    return commands;
  }
  
  private compileSpacerComponent(component: SpacerComponent): DSLCommand[] {
    return [{
      type: 'feedLine',
      lines: component.lines
    }];
  }
  
  private compileRowComponent(component: RowComponent): DSLCommand[] {
    const commands: DSLCommand[] = [];
    const paperWidth = 80; // Characters
    
    // Calculate column positions
    const columnData: Array<{
      start: number;
      end: number;
      alignment: 'left' | 'center' | 'right';
      content: string;
    }> = [];
    
    let currentPos = 0;
    const fillColumns = component.columns.filter(col => col.width === 'fill').length;
    const autoColumns = component.columns.filter(col => col.width === 'auto').length;
    const fixedWidth = component.columns
      .filter(col => typeof col.width === 'number')
      .reduce((sum, col) => sum + (col.width as number), 0);
    
    const remainingWidth = paperWidth - (fixedWidth / 100 * paperWidth);
    const fillWidth = fillColumns > 0 ? remainingWidth / fillColumns : 0;
    
    for (const column of component.columns) {
      let colWidth = 0;
      
      if (column.width === 'fill') {
        colWidth = fillWidth;
      } else if (column.width === 'auto') {
        // For auto, we'll use a default width
        colWidth = Math.min(10, remainingWidth / autoColumns);
      } else if (typeof column.width === 'number') {
        colWidth = (column.width / 100) * paperWidth;
      }
      
      // Get text content from the column's component
      const content = this.getComponentText(column.component);
      
      columnData.push({
        start: Math.floor(currentPos),
        end: Math.floor(currentPos + colWidth),
        alignment: column.alignment || 'left',
        content
      });
      
      currentPos += colWidth;
    }
    
    // Use column layout command
    commands.push({
      type: 'columnLayout',
      columns: columnData
    });
    
    return commands;
  }
  
  private compileTableComponent(component: TableComponent): DSLCommand[] {
    const commands: DSLCommand[] = [];
    const paperWidth = 80; // Standard receipt width in characters
    
    // Process each row
    component.rows.forEach(row => {
      // First, check if any cell contains a component that needs special handling
      const hasComplexComponents = component.columns.some(col => {
        const cellValue = row[col.key];
        return cellValue && typeof cellValue === 'object' && 
               'type' in cellValue && 
               ['barcode', 'qrcode', 'image', 'divider', 'spacer'].includes((cellValue as Component).type);
      });
      
      if (hasComplexComponents) {
        // Handle row with complex components - compile each component separately
        component.columns.forEach(col => {
          const cellValue = row[col.key];
          if (cellValue && typeof cellValue === 'object' && 'type' in cellValue) {
            // Compile the component directly
            const componentCommands = this.compileComponent(cellValue as Component);
            commands.push(...componentCommands);
          }
        });
      } else {
        // Handle row with only text components - use column layout
        const rowColumns = component.columns.map(col => {
          const cellValue = row[col.key];
          let content = '';
          
          if (typeof cellValue === 'string') {
            content = cellValue;
          } else if (cellValue && typeof cellValue === 'object' && 'type' in cellValue) {
            // Get text content from component
            content = this.getComponentText(cellValue as Component);
          }
          
          return {
            start: 0, // Will be calculated
            end: 0,   // Will be calculated
            content: content,
            alignment: col.alignment || 'left'
          };
        });
        
        // Calculate column positions based on widths
        let currentPos = 0;
        
        // First, calculate total percentage used
        const percentageColumns = component.columns
          .filter(c => typeof c.width === 'string' && c.width.endsWith('%'));
        const totalPercentage = percentageColumns
          .reduce((sum, c) => sum + parseInt(c.width as string), 0);
        
        // Calculate widths for all columns
        const columnWidths: number[] = [];
        component.columns.forEach((colDef, index) => {
          let width = 0;
          
          if (typeof colDef.width === 'string' && colDef.width.endsWith('%')) {
            const percentage = parseInt(colDef.width);
            // If percentages don't sum to 100%, scale them proportionally
            if (totalPercentage > 0 && totalPercentage !== 100) {
              width = Math.floor((percentage / totalPercentage) * paperWidth);
            } else {
              width = Math.floor((percentage / 100) * paperWidth);
            }
          } else if (colDef.width === 'auto') {
            // For auto, use content length with minimum
            width = Math.max(rowColumns[index].content.length + 2, 10);
          } else if (colDef.width === 'fill') {
            // Will be calculated after we know the space taken by other columns
            width = 0;
          } else {
            width = 10; // Default width
          }
          
          columnWidths[index] = width;
        });
        
        // Calculate remaining space for 'fill' columns
        const usedWidth = columnWidths.reduce((sum, w) => sum + w, 0);
        const remainingWidth = paperWidth - usedWidth;
        const fillColumns = component.columns.filter(c => c.width === 'fill').length;
        
        if (fillColumns > 0 && remainingWidth > 0) {
          const fillWidth = Math.floor(remainingWidth / fillColumns);
          component.columns.forEach((colDef, index) => {
            if (colDef.width === 'fill') {
              columnWidths[index] = fillWidth;
            }
          });
        } else if (percentageColumns.length === component.columns.length && remainingWidth > 0) {
          // If all columns are percentage-based and there's remaining space,
          // distribute it to ensure we use the full width
          const extraPerColumn = Math.floor(remainingWidth / component.columns.length);
          const extraRemainder = remainingWidth % component.columns.length;
          columnWidths.forEach((w, i) => {
            columnWidths[i] += extraPerColumn + (i < extraRemainder ? 1 : 0);
          });
        }
        
        // Now assign positions
        rowColumns.forEach((rCol, index) => {
          rCol.start = currentPos;
          rCol.end = currentPos + columnWidths[index];
          currentPos += columnWidths[index];
        });
        
        commands.push({
          type: 'columnLayout',
          columns: rowColumns
        });
      }
    });
    
    return commands;
  }
  
  private compileDynamicListComponent(component: DynamicListComponent): DSLCommand[] {
    // For now, just compile the template once as a placeholder
    // In a real implementation, this would be handled by the interpreter
    // with actual data
    const commands: DSLCommand[] = [];
    
    commands.push({
      type: 'text',
      value: `{${component.dataSource} - dynamic content}`
    });
    
    return commands;
  }
  
  private getComponentText(component: Component): string {
    switch (component.type) {
      case 'text':
        return (component as TextComponent).content;
      case 'barcode':
        return (component as BarcodeComponent).data;
      case 'qrcode':
        return (component as QRCodeComponent).data;
      case 'divider':
        const divider = component as DividerComponent;
        const char = divider.character || '-';
        return char.repeat(10); // Simplified representation
      case 'spacer':
        return ' '.repeat((component as SpacerComponent).lines);
      case 'image':
        return '[Image]'; // Images can't be represented as text
      default:
        return '';
    }
  }
  
  private extractRequiredTokens(layout: ConcreteLayoutModel): string[] {
    const tokens = new Set<string>();
    
    // Extract tokens from all text content
    const extractFromText = (text: string) => {
      const matches = text.match(/\{([^}]+)\}/g);
      if (matches) {
        matches.forEach(match => {
          tokens.add(match.slice(1, -1));
        });
      }
    };
    
    const processComponent = (component: Component) => {
      switch (component.type) {
        case 'text':
          extractFromText((component as TextComponent).content);
          break;
        case 'barcode':
          extractFromText((component as BarcodeComponent).data);
          break;
        case 'qrcode':
          extractFromText((component as QRCodeComponent).data);
          break;
        case 'row':
          (component as RowComponent).columns.forEach(col => {
            processComponent(col.component);
          });
          break;
        case 'table':
          const table = component as TableComponent;
          table.rows.forEach(row => {
            Object.values(row).forEach(value => {
              if (typeof value === 'string') {
                extractFromText(value);
              }
            });
          });
          break;
      }
    };
    
    layout.components.forEach(processComponent);
    
    return Array.from(tokens);
  }
  
  private extractOptionalTokens(layout: ConcreteLayoutModel): string[] {
    // For now, return empty array
    // Could be enhanced to identify conditional tokens
    return [];
  }
}
