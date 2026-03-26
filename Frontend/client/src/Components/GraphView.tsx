import React, { useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  useEdgesState,
  useNodesState,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { getGraphData } from "../services/api";

interface GraphViewProps {
  highlightedNodes: string[];
}

const GraphView: React.FC<GraphViewProps> = ({ highlightedNodes }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const graphData = await getGraphData();
        if (!graphData || !graphData.nodes || !graphData.edges) return;
        const filteredNodes = graphData.nodes.filter((n: any) =>
          highlightedNodes.includes(n.id)
        );
        const updatedNodes: Node[] = filteredNodes.map((n: any, index: number) => {
          const pos = n.position || { x: 100 + index * 200, y: 200 };

          return {
            id: n.id,
            position: pos,
            data: { label: n.data?.label || n.id },
            style: {
              background: "#facc15",
              color: "black",
              padding: 10,
              borderRadius: 8,
              fontSize: "12px",
              border: "2px solid #f59e0b",
            },
          };
        });
        const filteredEdges = graphData.edges.filter(
          (e: Edge) =>
            highlightedNodes.includes(e.source) && highlightedNodes.includes(e.target)
        );

        const updatedEdges: Edge[] = filteredEdges.map((e: Edge) => ({
          ...e,
          animated: true,
          style: { stroke: "#facc15", strokeWidth: 2 },
        }));

        setNodes(updatedNodes);
        setEdges(updatedEdges);
      } catch (error) {
        console.error("Fetch Graph Data Error:", error);
      }
    };

    fetchGraphData();
  }, [highlightedNodes]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default GraphView;