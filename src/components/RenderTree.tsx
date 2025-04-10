import React from "react";

// Definir el tipo de nodo
interface TreeNode {
  id: string;
  props?: Record<string, unknown>;
  children?: TreeNode[];
}

interface RenderTreeProps {
  components: Record<string, React.ComponentType<Record<string, unknown>>>;
  structure: TreeNode[];
}

const RenderTree: React.FC<RenderTreeProps> = ({ components, structure }) => {
  const renderNode = (node: TreeNode): React.ReactNode => {
    const Component = components[node.id];

    if (!Component) {
      console.error(
        `Component with id "${node.id}" not found in components registry`
      );
      return null;
    }

    // Si es un elemento HTML básico (div, span, etc.)
    if (typeof Component === "string") {
      const ElementType = Component as unknown as keyof JSX.IntrinsicElements;
      return React.createElement(
        ElementType,
        { ...node.props, key: node.id },
        node.children?.map(renderNode)
      );
    }

    // Si es un componente React
    return (
      <Component key={node.id} {...node.props}>
        {node.children?.map(renderNode)}
      </Component>
    );
  };

  return <>{structure.map(renderNode)}</>;
};

export default RenderTree;
