import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import toolsData from '../realtech-tools.json';

interface Tool {
  name: string;
  slug: string;
  description: string;
  path: string;
  category: string;
}

const tools = toolsData as Tool[];
import { CronVisualizer } from './tools/cron-visualizer';

const ToolsIndex: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">RealTech Tools</h1>
      <p className="text-gray-600 mb-8">
        A collection of small useful tools built as part of the RealTech AI Tool Factory experiments.
      </p>
      
      <div className="grid gap-6">
        {tools.map((tool) => (
          <div key={tool.slug} className="border rounded-lg p-6 hover:shadow-md transition">
            <h2 className="text-2xl font-semibold mb-2">
              <Link to={`/${tool.slug}`} className="text-blue-600 hover:underline">
                {tool.name}
              </Link>
            </h2>
            <p className="text-gray-600 mb-4">{tool.description}</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {tool.category}
              </span>
              <Link 
                to={`/${tool.slug}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try it →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-8 py-4">
          <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600">
            RealTech Tools
          </Link>
        </div>
      </header>
      
      <main className="py-8">
        <Routes>
          <Route path="/" element={<ToolsIndex />} />
          <Route path="/cron-visualizer" element={<CronVisualizer />} />
          {/* New tools will be automatically added here */}
        </Routes>
      </main>
      
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-8 py-6 text-center text-gray-600">
          <p>Built with ❤️ by RealTech AI Tool Factory</p>
          <p className="text-sm mt-2">
            Part of RealTech Hub (real-tech.online)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
