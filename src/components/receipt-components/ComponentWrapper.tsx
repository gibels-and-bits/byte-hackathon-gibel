'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Component } from '../../interfaces/receipt-models';

interface ComponentWrapperProps {
  component: Component;
  children: React.ReactNode;
  isDragging?: boolean;
  isPreview?: boolean;
}

export const ComponentWrapper: React.FC<ComponentWrapperProps> = ({ 
  component, 
  children, 
  isDragging = false,
  isPreview = false 
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging: isCurrentlyDragging } = useDraggable({
    id: component.id,
    data: component
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isCurrentlyDragging ? 0 : 1, // Hide the original when dragging
  };

  if (isPreview) {
    // In preview mode, just render the children without drag functionality
    return <>{children}</>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        cursor-move 
        transition-opacity 
        ${isCurrentlyDragging ? 'z-50' : ''}
      `}
    >
      {children}
    </div>
  );
}; 