import { 
  ConcreteReceiptDSL, 
  DSLCommand,
  TokenContext,
  AVAILABLE_TOKENS,
  ReceiptDSL
} from './interfaces/receipt-models';
import { ReceiptInterpreter } from './interfaces/receipt-interpreter';
import { EpsonPrinter, BarcodeType } from './interfaces/epson-printer';
import { HTMLCanvasEpsonPrinter } from './html-canvas-printer';

export class ConcreteReceiptInterpreter implements ReceiptInterpreter {
  private printer: EpsonPrinter;
  private tokenContext: TokenContext;
  
  constructor(canvas?: HTMLCanvasElement) {
    if (canvas) {
      this.printer = new HTMLCanvasEpsonPrinter(canvas);
    } else {
      // Create a default canvas if none provided
      const defaultCanvas = document.createElement('canvas');
      defaultCanvas.width = 384; // Standard 80mm receipt width in pixels
      defaultCanvas.height = 1000; // Initial height, will expand as needed
      this.printer = new HTMLCanvasEpsonPrinter(defaultCanvas);
    }
    
    // Initialize with mock token values
    this.tokenContext = this.createMockTokenContext();
  }
  
  // Implement the interface method
  interpret(printer: EpsonPrinter, dsl: ReceiptDSL): void {
    this.printer = printer;
    this.execute(dsl as ConcreteReceiptDSL);
  }
  
  setPrinter(printer: EpsonPrinter): void {
    this.printer = printer;
  }
  
  setTokenContext(context: TokenContext): void {
    this.tokenContext = { ...this.tokenContext, ...context };
  }
  
  execute(dsl: ConcreteReceiptDSL): void {
    // Clear the printer/canvas before starting
    if (this.printer instanceof HTMLCanvasEpsonPrinter) {
      this.printer.clear();
    }
    
    // Execute each command
    for (const command of dsl.commands) {
      this.executeCommand(command);
    }
  }
  
  private executeCommand(command: DSLCommand): void {
    switch (command.type) {
      case 'text':
        const text = this.replaceTokens(command.value);
        this.printer.addText(text, command.style);
        break;
        
      case 'textAlign':
        this.printer.addTextAlign(command.alignment);
        break;
        
      case 'textSize':
        this.printer.addTextSize(command.width, command.height);
        break;
        
      case 'textStyle':
        this.printer.addTextStyle({
          bold: command.bold,
          underline: command.underline,
          fontFamily: command.fontFamily
        });
        break;
        
      case 'feedLine':
        this.printer.addFeedLine(command.lines);
        break;
        
      case 'lineSpace':
        this.printer.addLineSpace(command.space);
        break;
        
      case 'barcode':
        const barcodeData = this.replaceTokens(command.data);
        // Convert string format to BarcodeType enum
        const barcodeType = this.convertToBarcodeType(command.format);
        this.printer.addBarcode(barcodeData, barcodeType, {
          width: command.width,
          height: command.height,
          hri: command.hri
        });
        break;
        
      case 'qrcode':
        const qrData = this.replaceTokens(command.data);
        this.printer.addQRCode(qrData, {
          size: command.size,
          errorCorrection: command.errorCorrection
        });
        break;
        
      case 'image':
        // For now, skip image commands as they require ImageData
        // In a real implementation, we'd load the image data
        console.warn('Image commands not yet implemented in interpreter');
        break;
        
      case 'cutPaper':
        this.printer.cutPaper();
        break;
        
      case 'setPosition':
        // HTMLCanvasEpsonPrinter doesn't have setPosition
        // This would be handled by column layout
        break;
        
      case 'columnLayout':
        this.executeColumnLayout(command);
        break;
    }
  }
  
  private convertToBarcodeType(format: 'CODE39' | 'CODE128' | 'UPC_A' | 'CODE93'): BarcodeType {
    const mapping: Record<string, BarcodeType> = {
      'CODE39': BarcodeType.CODE39,
      'CODE128': BarcodeType.CODE128,
      'UPC_A': BarcodeType.UPC_A,
      'CODE93': BarcodeType.CODE93
    };
    return mapping[format] || BarcodeType.CODE128;
  }
  
  private executeColumnLayout(command: DSLCommand): void {
    if (command.type !== 'columnLayout') return;
    
    // For canvas printer, we'll simulate columns by calculating positions
    const paperWidth = 384; // pixels
    const charWidth = paperWidth / 80; // 80 chars per line
    
    // Find the maximum x position to determine if we need multiple lines
    let lines: string[] = [''];
    
    for (const column of command.columns) {
      const content = this.replaceTokens(column.content);
      const startPixel = column.start * charWidth;
      const endPixel = column.end * charWidth;
      const width = endPixel - startPixel;
      
      // Add the text at the appropriate position
      // For simplicity, we'll create a single line with spacing
      const currentLine = lines[lines.length - 1];
      const spacesNeeded = Math.max(0, column.start - currentLine.length);
      const paddedContent = ' '.repeat(spacesNeeded) + this.fitTextToWidth(content, column.end - column.start, column.alignment);
      
      lines[lines.length - 1] = currentLine + paddedContent;
    }
    
    // Print the formatted line(s)
    for (const line of lines) {
      this.printer.addText(line);
    }
  }
  
  private fitTextToWidth(text: string, width: number, alignment: 'left' | 'center' | 'right'): string {
    if (text.length >= width) {
      return text.substring(0, width);
    }
    
    const padding = width - text.length;
    
    switch (alignment) {
      case 'center':
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
        
      case 'right':
        return ' '.repeat(padding) + text;
        
      default: // left
        return text + ' '.repeat(padding);
    }
  }
  
  private replaceTokens(text: string): string {
    let result = text;
    
    // Replace all tokens in the text
    for (const [key, value] of Object.entries(this.tokenContext)) {
      const token = `{${key}}`;
      if (result.includes(token)) {
        // Format value based on type
        let formattedValue = '';
        
        if (typeof value === 'number') {
          // Check if it's a currency value
          const tokenDef = AVAILABLE_TOKENS.find(t => t.key === key);
          if (tokenDef && tokenDef.type === 'currency') {
            formattedValue = `$${value.toFixed(2)}`;
          } else {
            formattedValue = value.toString();
          }
        } else if (value instanceof Date) {
          // Format dates
          formattedValue = value.toLocaleDateString();
        } else if (Array.isArray(value)) {
          // Arrays are handled by dynamic lists
          formattedValue = '[Array Data]';
        } else {
          formattedValue = String(value);
        }
        
        result = result.replace(new RegExp(token, 'g'), formattedValue);
      }
    }
    
    return result;
  }
  
  private createMockTokenContext(): TokenContext {
    const context: TokenContext = {};
    
    // Add all available tokens with their mock values
    for (const token of AVAILABLE_TOKENS) {
      context[token.key] = token.mockValue;
    }
    
    return context;
  }
  
  // Get the canvas if using HTMLCanvasEpsonPrinter
  getCanvas(): HTMLCanvasElement | null {
    if (this.printer instanceof HTMLCanvasEpsonPrinter) {
      return (this.printer as any).canvas;
    }
    return null;
  }
}
