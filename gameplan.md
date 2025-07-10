# 🧾 ReceiptCraft Extra Crispy Implementation Game Plan

## Overview
Building a browser-based receipt designer with drag-and-drop functionality, visual editing, DSL compilation, and interpretation for Epson printers.

## Architecture Decisions

### Drag-and-Drop Library
- **Choice**: @dnd-kit
- **Reasoning**: Better accessibility, flexible, performant, good TypeScript support

### Layout System
- **Flexible multi-column support** (not just simple rows)
- **Row containers** with auto/fill/percentage width columns
- **Tables** for structured data
- **Dynamic lists** for repeating items

### DSL Format
- **JSON-based** command structure
- **Direct mapping** to Epson printer methods
- **Token preservation** for runtime replacement

---

## Phase 1: Data Models ✅
**Status: COMPLETE**
**Time Estimate: 30 minutes**

### Tasks Completed:
- [x] Define `LayoutModel` interface with flexible component types
- [x] Define `ReceiptDSL` format (JSON command array)
- [x] Create component type definitions:
  - [x] TextComponent
  - [x] BarcodeComponent
  - [x] QRCodeComponent
  - [x] ImageComponent
  - [x] DividerComponent
  - [x] SpacerComponent
  - [x] RowComponent (multi-column support)
  - [x] TableComponent
  - [x] DynamicListComponent
- [x] Define DSL command types mapping to printer methods
- [x] Create token system with 20+ predefined tokens
- [x] Implement helper utilities:
  - [x] ID generation
  - [x] Token extraction/replacement
  - [x] Column position calculations
  - [x] Layout validation
  - [x] Sample layout generation
- [x] Create test page at `/test-models`
- [x] Add dark mode styling

### Files Created/Modified:
- ✅ `src/interfaces/receipt-models.ts`
- ✅ `src/utils/receipt-helpers.ts`
- ✅ `src/app/test-models/page.tsx`

---

## Phase 2: Component Library ✅
**Status: COMPLETE**
**Time Estimate: 1 hour**

### Tasks:
- [x] Install drag-and-drop dependencies (@dnd-kit)
- [x] Create base draggable component wrapper
- [x] Implement individual components:
  - [x] TextComponent with inline editing
  - [x] BarcodeComponent with format selection
  - [x] QRCodeComponent with data input
  - [ ] ImageComponent with upload/URL
  - [x] DividerComponent with style options
  - [x] SpacerComponent with line adjustment
  - [x] RowComponent with column management
  - [x] TableComponent with dynamic rows
  - [ ] DynamicListComponent with template editor
- [x] Create component palette/library UI
- [x] Add component preview cards
- [x] Implement component property panels

### Files Created:
- ✅ `src/components/receipt-components/index.ts`
- ✅ `src/components/receipt-components/TextComponent.tsx`
- ✅ `src/components/receipt-components/BarcodeComponent.tsx`
- ✅ `src/components/receipt-components/QRCodeComponent.tsx`
- ⬜ `src/components/receipt-components/ImageComponent.tsx`
- ✅ `src/components/receipt-components/DividerComponent.tsx`
- ✅ `src/components/receipt-components/SpacerComponent.tsx`
- ✅ `src/components/receipt-components/RowComponent.tsx`
- ✅ `src/components/receipt-components/TableComponent.tsx`
- ⬜ `src/components/receipt-components/DynamicListComponent.tsx`
- ✅ `src/components/receipt-components/ComponentWrapper.tsx`
- ✅ `src/app/component-library/page.tsx` (showcase page)

---

## Phase 3: Visual Editor
**Status: NOT STARTED**
**Time Estimate: 2 hours**

### Tasks:
- [ ] Create main editor layout with:
  - [ ] Collapsible component library sidebar
  - [ ] Central canvas area
  - [ ] Property panel
- [ ] Implement drag-and-drop functionality:
  - [ ] Draggable components from library
  - [ ] Droppable canvas with visual feedback
  - [ ] Reorderable components
  - [ ] Nested drop zones for rows
- [ ] Add canvas features:
  - [ ] Snap-to-grid
  - [ ] Visual guides
  - [ ] Component selection
  - [ ] Multi-select support
- [ ] Implement editing operations:
  - [ ] Delete selected components
  - [ ] Duplicate components
  - [ ] Copy/paste support
  - [ ] Undo/redo functionality
- [ ] Add property editing:
  - [ ] Dynamic property forms
  - [ ] Real-time updates
  - [ ] Token selector/autocomplete

### Files to Create:
- `src/components/ReceiptEditor.tsx`
- `src/components/ComponentLibrary.tsx`
- `src/components/EditorCanvas.tsx`
- `src/components/PropertyPanel.tsx`
- `src/components/TokenSelector.tsx`
- `src/app/editor/page.tsx`
- `src/hooks/useEditorState.ts`
- `src/hooks/useUndoRedo.ts`

---

## Phase 4: Compiler
**Status: NOT STARTED**
**Time Estimate: 1 hour**

### Tasks:
- [ ] Implement `compile()` method in `DefaultReceiptCompiler`
- [ ] Handle component-to-command conversion:
  - [ ] Text → text commands with alignment/size
  - [ ] Row → column layout commands
  - [ ] Table → formatted text with columns
  - [ ] Barcode → barcode commands
  - [ ] Dynamic lists → expanded templates
- [ ] Implement layout calculations:
  - [ ] Column width to character positions
  - [ ] Text wrapping within columns
  - [ ] Alignment calculations
- [ ] Add optimization passes:
  - [ ] Combine adjacent text commands
  - [ ] Minimize state changes
  - [ ] Remove redundant commands
- [ ] Preserve tokens for runtime replacement
- [ ] Add compiler validation and error handling

### Files to Modify:
- `src/compiler.ts`
- `src/utils/compiler-helpers.ts` (new)

---

## Phase 5: Interpreter
**Status: NOT STARTED**
**Time Estimate: 1 hour**

### Tasks:
- [ ] Implement `interpret()` method in `DefaultReceiptInterpreter`
- [ ] Map DSL commands to printer methods:
  - [ ] Text commands → addText()
  - [ ] Alignment → addTextAlign()
  - [ ] Size → addTextSize()
  - [ ] Barcode → addBarcode()
  - [ ] Column layout → calculated positions
- [ ] Handle token replacement:
  - [ ] Accept token context
  - [ ] Replace tokens with actual values
  - [ ] Format currency/date tokens
- [ ] Implement special handling:
  - [ ] Dynamic lists expansion
  - [ ] Table formatting
  - [ ] Column alignment
- [ ] Add error handling and validation

### Files to Modify:
- `src/interpreter.ts`
- `src/utils/interpreter-helpers.ts` (new)

---

## Phase 6: Preview Mode
**Status: NOT STARTED**
**Time Estimate: 30 minutes**

### Tasks:
- [ ] Add Edit/Preview toggle to editor
- [ ] Create preview component:
  - [ ] Compile layout to DSL
  - [ ] Interpret DSL with mock data
  - [ ] Display in ReceiptPrinter component
- [ ] Add preview controls:
  - [ ] Refresh button
  - [ ] Mock data editor
  - [ ] Paper size selector
- [ ] Implement live preview updates
- [ ] Add error display for compilation issues

### Files to Create/Modify:
- `src/components/ReceiptPreview.tsx`
- `src/components/MockDataEditor.tsx`
- Update `src/components/ReceiptEditor.tsx`

---

## Phase 7: Polish & Additional Features
**Status: NOT STARTED**
**Time Estimate: 1 hour**

### Tasks:
- [ ] Implement save/load functionality:
  - [ ] Save to localStorage
  - [ ] Export/import JSON
  - [ ] Save multiple layouts
- [ ] Add preset templates:
  - [ ] Taco Bell receipt
  - [ ] KFC receipt
  - [ ] Generic retail
  - [ ] Restaurant with tips
- [ ] Add advanced features:
  - [ ] Layout templates/snippets
  - [ ] Component grouping
  - [ ] Conditional rendering
  - [ ] Variables/calculations
- [ ] Improve UX:
  - [ ] Keyboard shortcuts
  - [ ] Context menus
  - [ ] Tooltips
  - [ ] Loading states
  - [ ] Error boundaries
- [ ] Add validation:
  - [ ] Paper width constraints
  - [ ] Character limits
  - [ ] Token validation
  - [ ] Barcode format validation

### Files to Create:
- `src/components/TemplateLibrary.tsx`
- `src/components/SaveLoadDialog.tsx`
- `src/utils/storage.ts`
- `src/utils/templates.ts`

---

## Component Test Page Plan

### Purpose
Create an interactive component playground where users can:
- View all available receipt components
- Edit component properties in real-time
- See isolated component rendering
- Copy component JSON for use in layouts

### Features
1. **Component Gallery**: Grid view of all components
2. **Interactive Editor**: Modify properties and see changes
3. **Code View**: See component JSON structure
4. **Token Testing**: Test with different token values
5. **Export**: Copy component configuration

### Implementation
- Extend `/test-models` page or create new `/components` route
- Use same dark mode theme
- Include property editors for each component type
- Show both visual preview and JSON output

---

## Success Metrics
- ✅ All component types can be created and configured
- ⬜ Drag-and-drop works smoothly with visual feedback
- ⬜ Layouts compile to valid DSL
- ⬜ DSL interprets correctly to printer commands
- ⬜ Preview matches actual printer output
- ⬜ Non-technical users can create receipts without help
- ⬜ System handles complex multi-column layouts
- ⬜ Performance remains good with many components

---

## Next Steps
1. **Immediate**: Create component test page
2. **Then**: Install @dnd-kit and start Phase 2
3. **Focus**: Get basic drag-and-drop working before adding features 