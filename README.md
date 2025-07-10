# ReceiptCraft - Visual Receipt Designer for BytePOS

A modern, browser-based receipt designer with drag-and-drop functionality, built for the BytePOS hackathon. This "Extra Crispy" implementation includes a visual layout editor, DSL compilation, and interpretation for Epson printers.

## 🚀 Features

- **Visual Editor**: Drag-and-drop interface for designing receipts
- **Component Library**: Pre-built components for text, barcodes, QR codes, tables, and more
- **Real-time Preview**: See your receipt rendered using HTML5 Canvas
- **DSL Compilation**: Converts visual layouts to printer-compatible commands
- **Token System**: Dynamic value replacement for receipts (order numbers, totals, etc.)
- **Dark Mode UI**: Modern, developer-friendly interface

## 🛠️ Tech Stack

- **Next.js 15.3.4** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **@dnd-kit** - Drag and drop functionality
- **HTML5 Canvas** - Receipt rendering

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page with demo
│   ├── editor/            # Visual receipt editor
│   ├── component-library/ # Component showcase
│   └── demo/              # Printer demo
├── components/            # React components
│   └── receipt-components/ # Individual receipt components
├── interfaces/            # TypeScript interfaces
├── compiler.ts            # Layout to DSL compiler
├── interpreter.ts         # DSL command interpreter
└── html-canvas-printer.ts # Canvas-based printer implementation
```

## 🚦 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Usage

### Visual Editor

1. Navigate to the Visual Editor from the home page
2. Drag components from the palette to the canvas
3. Click on components to edit their properties
4. Use arrow buttons to reorder components
5. Preview your receipt or view the compiled DSL

### Component Types

- **Text**: Basic text with formatting options (bold, underline, size, alignment)
- **Barcode**: Various formats (CODE128, CODE39, UPC_A, CODE93)
- **QR Code**: With adjustable size and error correction
- **Divider**: Horizontal lines (solid, dashed, double)
- **Spacer**: Vertical spacing
- **Row**: Multi-column layouts
- **Table**: Structured data with headers

### Token System

Use tokens in your text for dynamic values:
- `{store_name}` - Store name
- `{order_number}` - Order number
- `{total}` - Total amount
- `{date}` - Transaction date
- And many more...

## 🏗️ Architecture

### Data Flow

1. **Visual Design**: Users create layouts using drag-and-drop components
2. **Layout Model**: Components are stored in a structured format
3. **Compilation**: The compiler converts layouts to DSL commands
4. **Interpretation**: The interpreter executes DSL commands on the printer
5. **Rendering**: HTML Canvas simulates the printer output

### Key Interfaces

```typescript
// Component structure
interface Component {
  id: string;
  type: ComponentType;
  // Component-specific properties
}

// DSL command structure
interface DSLCommand {
  type: DSLCommandType;
  // Command-specific parameters
}

// Layout model
interface ConcreteLayoutModel {
  version: string;
  metadata: Metadata;
  components: Component[];
  settings: Settings;
}
```

## 🎯 Hackathon Deliverables

This project implements the "Extra Crispy" option:

✅ **Visual Layout Editor**: Full drag-and-drop interface with live editing  
✅ **Component Library**: All required components plus extras  
✅ **DSL Compilation**: Converts visual layouts to printer commands  
✅ **Interpretation**: Executes DSL commands with token replacement  
✅ **Preview Mode**: Real-time receipt rendering  
✅ **Modern UI**: Dark mode, responsive design, smooth interactions  

## 🔧 Development

### Adding New Components

1. Define the component interface in `src/interfaces/receipt-models.ts`
2. Create the React component in `src/components/receipt-components/`
3. Add compilation logic in `src/compiler.ts`
4. Update the component renderer in `src/components/receipt-components/index.ts`

### Extending the DSL

1. Add new command types to `src/interfaces/receipt-models.ts`
2. Implement compilation logic in `src/compiler.ts`
3. Add interpretation logic in `src/interpreter.ts`

## 🎨 Design Decisions

- **TypeScript First**: Full type safety for better developer experience
- **Component-Based**: Modular architecture for easy extension
- **Dark Mode**: Reduces eye strain during long coding sessions
- **Canvas Rendering**: Accurate receipt preview without external dependencies
- **JSON DSL**: Human-readable intermediate format

## 🚀 Future Enhancements

- Save/load receipt templates
- Export to various formats
- Custom component creation
- Multi-language support
- Cloud storage integration
- Real printer testing

## 📄 License

MIT License - see LICENSE file for details

## 🏆 Hackathon Submission

**Team**: Solo Developer  
**Category**: Extra Crispy  
**Time**: Completed within hackathon timeframe  

Built with ❤️ for the BytePOS Hackathon

