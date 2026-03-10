import Link from 'next/link';
import { getAllTools } from '@/lib/tools';

export default function Home() {
  const tools = getAllTools();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            RealTech Tools
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            A collection of small useful tools built as part of the RealTech AI Tool Factory experiments.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {tool.category}
                  </span>
                  <span className="text-green-600 text-sm font-semibold">✓ Live</span>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h2>
                
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {tool.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {tool.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Built {new Date(tool.builtAt).toLocaleDateString()}
                  </span>
                  <span className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Try it →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500">
          <p className="text-lg">Built with ❤️ by RealTech AI Tool Factory</p>
          <p className="mt-2 text-sm">
            Part of RealTech Hub (
            <a href="https://real-tech.online" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              real-tech.online
            </a>
            )
          </p>
        </div>
      </div>
    </div>
  );
}
