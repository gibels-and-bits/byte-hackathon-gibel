export { ComponentWrapper } from './ComponentWrapper';
export { TextComponent } from './TextComponent';
export { BarcodeComponent } from './BarcodeComponent';
export { QRCodeComponent } from './QRCodeComponent';
export { DividerComponent } from './DividerComponent';
export { SpacerComponent } from './SpacerComponent';
export { RowComponent } from './RowComponent';
export { TableComponent } from './TableComponent';

// Re-export from component-renderer to avoid circular dependencies
export { componentMap, renderComponent } from './component-renderer'; 