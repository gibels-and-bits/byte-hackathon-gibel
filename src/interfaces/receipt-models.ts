// Core receipt/printer data models

// Component types that can be dragged and dropped
export type ComponentType = 
  | 'text' 
  | 'barcode' 
  | 'qrcode' 
  | 'image' 
  | 'divider' 
  | 'spacer'
  | 'row'           // Container for columns
  | 'table'         // For structured data like item lists
  | 'dynamic-list'; // For repeating items

// Base component that all receipt components extend
export interface BaseComponent {
  id: string;
  type: ComponentType;
}

// Text component
export interface TextComponent extends BaseComponent {
  type: 'text';
  content: string; // Can include tokens like {store_name}
  style?: {
    size?: { width: number; height: number };
    bold?: boolean;
    underline?: boolean;
    alignment?: 'left' | 'center' | 'right';
    fontFamily?: string;
  };
}

// Barcode component
export interface BarcodeComponent extends BaseComponent {
  type: 'barcode';
  data: string; // Can include tokens like {order_number}
  format: 'CODE39' | 'CODE128' | 'UPC_A' | 'CODE93';
  options?: {
    width?: number;
    height?: number;
    showText?: 'none' | 'above' | 'below' | 'both';
  };
}

// QR Code component
export interface QRCodeComponent extends BaseComponent {
  type: 'qrcode';
  data: string; // Can include tokens
  options?: {
    size?: number;
    errorCorrection?: 'L' | 'M' | 'Q' | 'H';
  };
}

// Image component
export interface ImageComponent extends BaseComponent {
  type: 'image';
  src: string; // URL or base64
  options?: {
    width?: number;
    height?: number;
    alignment?: 'left' | 'center' | 'right';
  };
}

// Divider component (horizontal line)
export interface DividerComponent extends BaseComponent {
  type: 'divider';
  style?: 'solid' | 'dashed' | 'double';
  character?: string; // e.g., '-', '=', '*'
}

// Spacer component (vertical space)
export interface SpacerComponent extends BaseComponent {
  type: 'spacer';
  lines: number;
}

// Row container - allows multiple columns
export interface RowComponent extends BaseComponent {
  type: 'row';
  columns: Array<{
    width?: 'auto' | 'fill' | number; // percentage (1-100) or 'auto'/'fill'
    alignment?: 'left' | 'center' | 'right';
    component: Component; // Any component can go in a column
  }>;
}

// Table for structured data
export interface TableComponent extends BaseComponent {
  type: 'table';
  columns: Array<{
    key: string;
    header?: string;
    width?: 'auto' | 'fill' | string; // Allow percentage strings like "50%"
    alignment?: 'left' | 'center' | 'right';
  }>;
  rows: Array<{
    [key: string]: string | Component | undefined; // Allow undefined for empty cells
  }>;
  showHeader?: boolean;
  dividerAfterHeader?: boolean;
}

// Dynamic list for variable items (like order items)
export interface DynamicListComponent extends BaseComponent {
  type: 'dynamic-list';
  dataSource: string; // e.g., "order_items"
  template: Component; // Template for each item (usually a row)
  separator?: Component; // Optional separator between items
}

// Union type of all components
export type Component = 
  | TextComponent 
  | BarcodeComponent 
  | QRCodeComponent 
  | ImageComponent 
  | DividerComponent 
  | SpacerComponent
  | RowComponent
  | TableComponent
  | DynamicListComponent;

// The complete layout model
export interface ConcreteLayoutModel extends LayoutModel {
  version: string;
  metadata: {
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    brandId?: string;
    storeId?: string;
  };
  components: Component[];
  settings: {
    paperWidth?: number; // in characters (default: 80)
    defaultFont?: string;
    locale?: string;
  };
}

// DSL command types map directly to printer methods
export type DSLCommandType = 
  | 'text'
  | 'textAlign'
  | 'textSize'
  | 'textStyle'
  | 'feedLine'
  | 'lineSpace'
  | 'barcode'
  | 'qrcode'
  | 'image'
  | 'cutPaper'
  | 'setPosition'    // For column positioning
  | 'columnLayout';  // For multi-column text

// Base command structure
export interface BaseDSLCommand {
  type: DSLCommandType;
}

// Text command
export interface TextCommand extends BaseDSLCommand {
  type: 'text';
  value: string;
  x?: number;      // Horizontal position (0-100%)
  width?: number;  // Text width constraint
  style?: {
    bold?: boolean;
    underline?: boolean;
    fontFamily?: string;
  };
}

// Text alignment command
export interface TextAlignCommand extends BaseDSLCommand {
  type: 'textAlign';
  alignment: 'left' | 'center' | 'right';
}

// Text size command
export interface TextSizeCommand extends BaseDSLCommand {
  type: 'textSize';
  width: number;
  height: number;
}

// Text style command
export interface TextStyleCommand extends BaseDSLCommand {
  type: 'textStyle';
  bold?: boolean;
  underline?: boolean;
  fontFamily?: string;
}

// Feed line command
export interface FeedLineCommand extends BaseDSLCommand {
  type: 'feedLine';
  lines: number;
}

// Line space command
export interface LineSpaceCommand extends BaseDSLCommand {
  type: 'lineSpace';
  space: number;
}

// Barcode command
export interface BarcodeCommand extends BaseDSLCommand {
  type: 'barcode';
  data: string;
  format: 'CODE39' | 'CODE128' | 'UPC_A' | 'CODE93';
  width?: number;
  height?: number;
  hri?: 'none' | 'above' | 'below' | 'both';
}

// QR code command
export interface QRCodeCommand extends BaseDSLCommand {
  type: 'qrcode';
  data: string;
  size?: number;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
}

// Image command
export interface ImageCommand extends BaseDSLCommand {
  type: 'image';
  imageData: string; // Base64 or image data
  width?: number;
  height?: number;
  alignment?: 'left' | 'center' | 'right';
}

// Cut paper command
export interface CutPaperCommand extends BaseDSLCommand {
  type: 'cutPaper';
}

// Position command for column layouts
export interface SetPositionCommand extends BaseDSLCommand {
  type: 'setPosition';
  x: number; // Character position
}

// Column layout command
export interface ColumnLayoutCommand extends BaseDSLCommand {
  type: 'columnLayout';
  columns: Array<{
    start: number;  // Start position (0-100%)
    end: number;    // End position (0-100%)
    alignment: 'left' | 'center' | 'right';
    content: string;
  }>;
}

// Union type of all DSL commands
export type DSLCommand = 
  | TextCommand
  | TextAlignCommand
  | TextSizeCommand
  | TextStyleCommand
  | FeedLineCommand
  | LineSpaceCommand
  | BarcodeCommand
  | QRCodeCommand
  | ImageCommand
  | CutPaperCommand
  | SetPositionCommand
  | ColumnLayoutCommand;

// The complete DSL
export interface ConcreteReceiptDSL extends ReceiptDSL {
  version: string;
  metadata?: {
    generatedAt: string;
    layoutId?: string;
  };
  commands: DSLCommand[];
  tokens?: {
    // Define required/optional tokens for validation
    required: string[];
    optional: string[];
  };
}

// Token definition for dynamic fields
export interface TokenDefinition {
  key: string; // e.g., "store_name"
  description: string;
  mockValue: string | number | any[];
  type: 'string' | 'number' | 'currency' | 'date' | 'array';
}

// Available tokens that can be used in receipts
export const AVAILABLE_TOKENS: TokenDefinition[] = [
  // Store information
  { key: 'store_name', description: 'Store name', mockValue: 'Taco Bell #1234', type: 'string' },
  { key: 'store_address', description: 'Store address', mockValue: '123 Main St, City, ST 12345', type: 'string' },
  { key: 'store_phone', description: 'Store phone number', mockValue: '(555) 123-4567', type: 'string' },
  
  // Transaction information
  { key: 'order_number', description: 'Order number', mockValue: '000123', type: 'string' },
  { key: 'transaction_id', description: 'Transaction ID', mockValue: 'TXN-2024-001234', type: 'string' },
  { key: 'timestamp', description: 'Transaction timestamp', mockValue: '2024-01-15 14:32:10', type: 'date' },
  { key: 'date', description: 'Transaction date', mockValue: '01/15/2024', type: 'date' },
  { key: 'time', description: 'Transaction time', mockValue: '2:32 PM', type: 'date' },
  
  // Staff information
  { key: 'cashier_name', description: 'Cashier name', mockValue: 'John D.', type: 'string' },
  { key: 'cashier_id', description: 'Cashier ID', mockValue: 'EMP001', type: 'string' },
  
  // Financial information
  { key: 'subtotal', description: 'Subtotal amount', mockValue: 24.99, type: 'currency' },
  { key: 'tax', description: 'Tax amount', mockValue: 2.25, type: 'currency' },
  { key: 'total', description: 'Total amount', mockValue: 27.24, type: 'currency' },
  { key: 'amount_paid', description: 'Amount paid', mockValue: 30.00, type: 'currency' },
  { key: 'change', description: 'Change due', mockValue: 2.76, type: 'currency' },
  
  // Order items (array)
  { 
    key: 'order_items', 
    description: 'List of order items', 
    mockValue: [
      { name: 'Crunchy Taco', quantity: 2, price: 3.99 },
      { name: 'Baja Blast', quantity: 1, price: 2.49 },
      { name: 'Nacho Fries', quantity: 1, price: 1.99 }
    ], 
    type: 'array' 
  },
  
  // Payment information
  { key: 'payment_method', description: 'Payment method', mockValue: 'Credit Card', type: 'string' },
  { key: 'card_last_four', description: 'Last 4 digits of card', mockValue: '1234', type: 'string' },
];

// Helper type for token replacement
export interface TokenContext {
  [key: string]: string | number | any[];
}

// Export the base interfaces for backward compatibility
export interface LayoutModel {
    [key: string]: any;
}

export interface ReceiptDSL {
    [key: string]: any;
}

export interface LayoutSettings {
  paperWidth?: number;     // in characters (default: 80)
  defaultFont?: string;    // font family
  defaultSize?: number;    // font size in points
}
