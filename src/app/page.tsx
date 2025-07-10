import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              ReceiptCraft
            </h1>
            <p className="text-xl text-gray-300">
              Visual Receipt Designer for BytePOS
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Built for the BytePOS Hackathon - Extra Crispy Edition 🍗
            </p>
          </div>
          
          {/* Main Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Link href="/editor" className="group">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/20 h-full">
                <div className="text-4xl mb-4">🎨</div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                  Visual Editor
                </h2>
                <p className="text-gray-400">
                  Design receipts with our intuitive drag-and-drop interface. No coding required!
                </p>
              </div>
            </Link>
            
            <Link href="/component-library" className="group">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all hover:shadow-xl hover:shadow-purple-500/20 h-full">
                <div className="text-4xl mb-4">📦</div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                  Component Library
                </h2>
                <p className="text-gray-400">
                  Explore and test individual receipt components in an interactive playground
                </p>
              </div>
            </Link>
            
            <Link href="/demo" className="group">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-all hover:shadow-xl hover:shadow-green-500/20 h-full">
                <div className="text-4xl mb-4">🖨️</div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-green-400 transition-colors">
                  Printer Demo
                </h2>
                <p className="text-gray-400">
                  See the HTML Canvas printer in action with sample receipts
                </p>
              </div>
            </Link>
          </div>
          
          {/* Quick Start Guide */}
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">🚀 Quick Start Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">1️⃣</div>
                <h3 className="font-semibold mb-2">Design</h3>
                <p className="text-gray-400 text-sm">
                  Use the Visual Editor to create your receipt layout
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">2️⃣</div>
                <h3 className="font-semibold mb-2">Preview</h3>
                <p className="text-gray-400 text-sm">
                  See real-time preview of your receipt design
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">3️⃣</div>
                <h3 className="font-semibold mb-2">Export</h3>
                <p className="text-gray-400 text-sm">
                  Generate DSL commands for Epson printers
                </p>
              </div>
            </div>
          </div>
          
          {/* Features & Tech Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">✨ Key Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Drag-and-drop receipt designer with live editing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Real-time preview using HTML5 Canvas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>DSL compilation for Epson printer compatibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Dynamic token system for runtime data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Support for text, barcodes, QR codes, tables, and more</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Dark mode UI with modern design</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">🛠️ Built With</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">▸</span>
                  <span><strong>Next.js 15</strong> - React framework with App Router</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">▸</span>
                  <span><strong>TypeScript</strong> - Type-safe development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">▸</span>
                  <span><strong>Tailwind CSS</strong> - Utility-first styling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">▸</span>
                  <span><strong>@dnd-kit</strong> - Drag and drop functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">▸</span>
                  <span><strong>HTML5 Canvas</strong> - Receipt rendering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">▸</span>
                  <span><strong>Custom DSL</strong> - Printer command generation</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Link href="/editor">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start Designing Your Receipt →
              </button>
            </Link>
          </div>
          
          {/* Footer */}
          <div className="mt-16 text-center text-gray-500 text-sm">
            <p>Created for the BytePOS Hackathon</p>
            <p className="mt-1">Extra Crispy Edition 🍗 | Full-stack implementation with visual editor, compiler, and interpreter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
