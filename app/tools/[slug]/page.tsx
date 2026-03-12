import { notFound } from 'next/navigation';
import { getAllTools, getToolBySlug } from '@/lib/tools';
import CronVisualizer from '@/components/tools/cron-visualizer';
import DbSchemaVisualizer from '@/components/tools/db-schema-visualizer';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  
  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: `${tool.name} - RealTech Tools`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} - RealTech Tools`,
      description: tool.description,
      type: 'website',
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {tool.slug === 'cron-visualizer' ? (
        <CronVisualizer />
      ) : tool.slug === 'db-schema-visualizer' ? (
        <DbSchemaVisualizer />
      ) : (
        <div className="max-w-4xl mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold mb-4">{tool.name}</h1>
          <p className="text-xl text-gray-600 mb-8">{tool.description}</p>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <p className="text-gray-600">Tool coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
}
