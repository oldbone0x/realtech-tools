import toolsData from '../realtech-tools.json';

export interface Tool {
  name: string;
  slug: string;
  description: string;
  path: string;
  category: string;
  tags: string[];
  builtAt: string;
  status: string;
}

export function getAllTools(): Tool[] {
  return toolsData as Tool[];
}

export function getToolBySlug(slug: string): Tool | undefined {
  return (toolsData as Tool[]).find(tool => tool.slug === slug);
}
