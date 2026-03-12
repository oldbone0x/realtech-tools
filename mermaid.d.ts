declare module 'mermaid/dist/mermaid.esm.min.mjs' {
  const mermaid: {
    initialize: (config: any) => void;
    render: (id: string, text: string) => Promise<{ svg: string; bindFunctions?: (element: Element) => void }>;
    parse: (text: string) => Promise<any>;
  };
  export default mermaid;
}
