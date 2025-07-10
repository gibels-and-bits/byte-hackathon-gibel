import React from 'react';
import { TextComponent } from './TextComponent';
import { BarcodeComponent } from './BarcodeComponent';
import { QRCodeComponent } from './QRCodeComponent';
import { DividerComponent } from './DividerComponent';
import { SpacerComponent } from './SpacerComponent';
import { RowComponent } from './RowComponent';
import { EditableTableComponent } from './TableComponent';
import { ComponentWrapper } from './ComponentWrapper';
import { Component } from '../../interfaces/receipt-models';

interface RenderComponentProps {
  onUpdate?: (updates: Partial<Component>) => void;
  isEditing?: boolean;
  isPreview?: boolean;
}

export function renderComponent(
  component: Component, 
  props: RenderComponentProps = {}
): React.ReactNode {
  const { onUpdate, isEditing = false, isPreview = false } = props;
  
  const componentContent = (() => {
    switch (component.type) {
      case 'text':
        return <TextComponent component={component} onUpdate={onUpdate} isEditing={isEditing} isPreview={isPreview} />;
      case 'barcode':
        return <BarcodeComponent component={component} onUpdate={onUpdate} isEditing={isEditing} isPreview={isPreview} />;
      case 'qrcode':
        return <QRCodeComponent component={component} onUpdate={onUpdate} isEditing={isEditing} isPreview={isPreview} />;
      case 'divider':
        return <DividerComponent component={component} onUpdate={onUpdate} isEditing={isEditing} isPreview={isPreview} />;
      case 'spacer':
        return <SpacerComponent component={component} onUpdate={onUpdate} isEditing={isEditing} isPreview={isPreview} />;
      case 'row':
        return <RowComponent component={component} onUpdate={onUpdate} isEditing={isEditing} isPreview={isPreview} renderComponent={renderComponent} />;
      case 'table':
        return <EditableTableComponent component={component} onUpdate={onUpdate} isEditing={isEditing} renderComponent={renderComponent} />;
      default:
        return <div className="text-red-500">Unknown component type</div>;
    }
  })();
  
  if (isPreview) {
    return componentContent;
  }
  
  return (
    <ComponentWrapper component={component} isPreview={isPreview}>
      {componentContent}
    </ComponentWrapper>
  );
} 