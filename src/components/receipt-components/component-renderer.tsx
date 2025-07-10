import React from 'react';
import { Component } from '../../interfaces/receipt-models';
import { TextComponent } from './TextComponent';
import { BarcodeComponent } from './BarcodeComponent';
import { QRCodeComponent } from './QRCodeComponent';
import { DividerComponent } from './DividerComponent';
import { SpacerComponent } from './SpacerComponent';
import { RowComponent } from './RowComponent';
import { TableComponent } from './TableComponent';

export const componentMap = {
  text: TextComponent,
  barcode: BarcodeComponent,
  qrcode: QRCodeComponent,
  divider: DividerComponent,
  spacer: SpacerComponent,
  row: RowComponent,
  table: TableComponent,
  // TODO: Add these when implemented
  image: null,
  'dynamic-list': null,
} as const;

export function renderComponent(
  component: Component, 
  props?: {
    onUpdate?: (updates: Partial<Component>) => void;
    isEditing?: boolean;
    isPreview?: boolean;
    renderComponent?: (component: Component, props?: any) => React.ReactNode;
  }
): React.ReactNode {
  const ComponentClass = componentMap[component.type];
  if (!ComponentClass) {
    return null;
  }
  
  // Create props with the correct type for each component
  const componentProps = {
    component,
    ...props,
    renderComponent
  };
  
  return React.createElement(ComponentClass as any, componentProps);
} 