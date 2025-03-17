import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import { Save, PlayArrow } from "@mui/icons-material";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  Node as ReactFlowNode,
  Edge as ReactFlowEdge,
  Connection,
  NodeChange,
  EdgeChange,
  ConnectionLineType,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Node, Edge, FlowNode, FlowEdge } from "@/lib/types";
import { convertToFlowNodes, convertToFlowEdges, getNodeStyle, getIconForNodeType, getColorForNodeType } from "@/lib/data-utils";

// Custom node types
const nodeTypes = {
  warehouseNode: WarehouseNode,
  factoryNode: FactoryNode,
  transportNode: TransportNode,
  retailerNode: RetailerNode,
  customerNode: CustomerNode,
};

// Node components for each node type
function WarehouseNode({ data }: { data: any }) {
  return (
    <div className="node" style={getNodeStyle('warehouse')}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <span className="material-icons" style={{ color: getColorForNodeType('warehouse') }}>warehouse</span>
      </div>
      <Typography variant="subtitle2" color="textPrimary" fontWeight="500">
        {data.label}
      </Typography>
    </div>
  );
}

function FactoryNode({ data }: { data: any }) {
  return (
    <div className="node" style={getNodeStyle('factory')}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <span className="material-icons" style={{ color: getColorForNodeType('factory') }}>factory</span>
      </div>
      <Typography variant="subtitle2" color="textPrimary" fontWeight="500">
        {data.label}
      </Typography>
    </div>
  );
}

function TransportNode({ data }: { data: any }) {
  return (
    <div className="node" style={getNodeStyle('transport')}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <span className="material-icons" style={{ color: getColorForNodeType('transport') }}>local_shipping</span>
      </div>
      <Typography variant="subtitle2" color="textPrimary" fontWeight="500">
        {data.label}
      </Typography>
    </div>
  );
}

function RetailerNode({ data }: { data: any }) {
  return (
    <div className="node" style={getNodeStyle('retailer')}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <span className="material-icons" style={{ color: getColorForNodeType('retailer') }}>storefront</span>
      </div>
      <Typography variant="subtitle2" color="textPrimary" fontWeight="500">
        {data.label}
      </Typography>
    </div>
  );
}

function CustomerNode({ data }: { data: any }) {
  return (
    <div className="node" style={getNodeStyle('customer')}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <span className="material-icons" style={{ color: getColorForNodeType('customer') }}>groups</span>
      </div>
      <Typography variant="subtitle2" color="textPrimary" fontWeight="500">
        {data.label}
      </Typography>
    </div>
  );
}

function FlowCanvas() {
  const theme = useTheme();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);

  // Fetch nodes and edges from API
  const { data: backendNodes, isLoading: isLoadingNodes } = useQuery<Node[]>({
    queryKey: ['/api/workflow/nodes'],
  });

  const { data: backendEdges, isLoading: isLoadingEdges } = useQuery<Edge[]>({
    queryKey: ['/api/workflow/edges'],
  });

  // Convert backend data to ReactFlow format
  useEffect(() => {
    if (backendNodes && backendEdges) {
      const flowNodes = convertToFlowNodes(backendNodes);
      const flowEdges = convertToFlowEdges(backendEdges);
      
      setNodes(flowNodes);
      setEdges(flowEdges);
      
      // Set counts for new node/edge IDs
      setNodeCount(backendNodes.length);
      setEdgeCount(backendEdges.length);
    }
  }, [backendNodes, backendEdges]);

  // Mutations for nodes and edges
  const createNodeMutation = useMutation({
    mutationFn: async (node: any) => {
      const res = await apiRequest('POST', '/api/workflow/nodes', node);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflow/nodes'] });
    },
  });

  const updateNodeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest('PUT', `/api/workflow/nodes/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflow/nodes'] });
    },
  });

  const createEdgeMutation = useMutation({
    mutationFn: async (edge: any) => {
      const res = await apiRequest('POST', '/api/workflow/edges', edge);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflow/edges'] });
    },
  });

  // Handle node changes
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => {
      const updatedNodes = [...nds];
      changes.forEach(change => {
        if (change.type === 'position' && change.position && change.id) {
          const nodeIndex = updatedNodes.findIndex(n => n.id === change.id);
          if (nodeIndex !== -1) {
            const node = updatedNodes[nodeIndex];
            const nodeToUpdate = backendNodes?.find(n => n.nodeId === change.id);
            
            if (nodeToUpdate) {
              updateNodeMutation.mutate({
                id: nodeToUpdate.id,
                data: {
                  positionX: Math.round(change.position.x),
                  positionY: Math.round(change.position.y)
                }
              });
            }
          }
        }
      });
      return updatedNodes;
    });
  }, [backendNodes, updateNodeMutation]);

  // Handle edge changes
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => eds);
  }, []);

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: ReactFlowNode) => {
    setSelectedNode(node as FlowNode);
  }, []);

  // Handle connection (edge creation)
  const onConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target) {
      const newEdgeId = `edge-${edgeCount + 1}`;
      setEdgeCount(prev => prev + 1);
      
      const newEdge = {
        edgeId: newEdgeId,
        source: connection.source,
        target: connection.target,
        type: 'standard',
        label: `Connection ${edgeCount + 1}`
      };
      
      createEdgeMutation.mutate(newEdge);
      
      setEdges(eds => addEdge({
        ...connection,
        id: newEdgeId,
        type: 'default',
      }, eds as any));
    }
  }, [edgeCount, createEdgeMutation]);

  // Handle dropping a node on the canvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (reactFlowWrapper.current) {
        const nodeType = event.dataTransfer.getData('application/reactflow-type');
        
        if (typeof nodeType === 'string' && nodeType) {
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          const position = project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          });

          const newNodeId = `node-${nodeCount + 1}`;
          setNodeCount(prev => prev + 1);
          
          const newNode = {
            nodeId: newNodeId,
            type: nodeType,
            label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} ${nodeCount + 1}`,
            positionX: Math.round(position.x),
            positionY: Math.round(position.y),
            isActive: true
          };
          
          createNodeMutation.mutate(newNode);
        }
      }
    },
    [nodeCount, project, createNodeMutation]
  );

  // Handle updating a node
  const handleNodeUpdate = (data: any) => {
    if (selectedNode) {
      const nodeToUpdate = backendNodes?.find(n => n.nodeId === selectedNode.id);
      
      if (nodeToUpdate) {
        updateNodeMutation.mutate({
          id: nodeToUpdate.id,
          data: data
        });
      }
    }
  };

  if (isLoadingNodes || isLoadingEdges) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading workflow data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 270px)' }}>
      {/* Node palette */}
      <Paper
        elevation={0}
        sx={{
          width: 250,
          p: 2,
          borderRadius: 2,
          overflowY: 'auto',
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="subtitle1" fontWeight="500" gutterBottom>
          Nodes
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {['warehouse', 'factory', 'transport', 'retailer', 'customer'].map((type) => (
            <Box
              key={type}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow-type', type);
                event.dataTransfer.effectAllowed = 'move';
              }}
              sx={{
                cursor: 'grab',
                p: 1.5,
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: `${getColorForNodeType(type)}15`,
                border: `1px solid ${getColorForNodeType(type)}30`,
                '&:hover': {
                  bgcolor: `${getColorForNodeType(type)}25`,
                },
              }}
            >
              <Box sx={{ mb: 1, color: getColorForNodeType(type) }}>
                <span className="material-icons">{getIconForNodeType(type)}</span>
              </Box>
              <Typography
                variant="body2"
                fontWeight="medium"
                sx={{ color: getColorForNodeType(type) }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight="500" gutterBottom>
          Connectors
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'grey.50' },
            }}
          >
            <span className="material-icons" style={{ marginRight: 8, color: theme.palette.text.secondary }}>
              trending_flat
            </span>
            <Typography variant="body2">Standard Flow</Typography>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'grey.50' },
            }}
          >
            <span className="material-icons" style={{ marginRight: 8, color: theme.palette.text.secondary }}>
              call_split
            </span>
            <Typography variant="body2">Conditional Flow</Typography>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'grey.50' },
            }}
          >
            <span className="material-icons" style={{ marginRight: 8, color: theme.palette.text.secondary }}>
              loop
            </span>
            <Typography variant="body2">Feedback Loop</Typography>
          </Paper>
        </Box>
      </Paper>

      {/* Flow canvas */}
      <Box
        ref={reactFlowWrapper}
        sx={{
          flex: 1,
          height: '100%',
          bgcolor: theme.palette.grey[50],
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          fitView
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          <Controls />
          <MiniMap />
          <Background />
          <Panel position="top-right">
            <Button variant="contained" color="primary" startIcon={<PlayArrow />}>
              Run Simulation
            </Button>
          </Panel>
        </ReactFlow>
      </Box>

      {/* Properties panel */}
      <Paper
        elevation={0}
        sx={{
          width: 320,
          p: 2,
          borderRadius: 2,
          overflowY: 'auto',
          borderLeft: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="subtitle1" fontWeight="500" gutterBottom>
          Node Properties
        </Typography>

        {selectedNode ? (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Node Name"
              variant="outlined"
              size="small"
              fullWidth
              defaultValue={selectedNode.data.label}
              onChange={(e) => handleNodeUpdate({ label: e.target.value })}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedNode.data.nodeType}
                label="Type"
                onChange={(e) => handleNodeUpdate({ type: e.target.value })}
              >
                <MenuItem value="warehouse">Warehouse</MenuItem>
                <MenuItem value="factory">Factory</MenuItem>
                <MenuItem value="transport">Transport</MenuItem>
                <MenuItem value="retailer">Retailer</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Description"
              variant="outlined"
              size="small"
              fullWidth
              multiline
              rows={3}
              defaultValue={selectedNode.data.description || ''}
              onChange={(e) => handleNodeUpdate({ description: e.target.value })}
            />

            <TextField
              label="Capacity"
              variant="outlined"
              size="small"
              fullWidth
              type="number"
              defaultValue={selectedNode.data.capacity || ''}
              onChange={(e) => handleNodeUpdate({ capacity: parseInt(e.target.value) })}
            />

            <TextField
              label="Processing Time (days)"
              variant="outlined"
              size="small"
              fullWidth
              type="number"
              defaultValue={selectedNode.data.processingTime || ''}
              onChange={(e) => handleNodeUpdate({ processingTime: parseInt(e.target.value) })}
            />

            <FormControl component="fieldset">
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Status
              </Typography>
              <RadioGroup
                row
                value={selectedNode.data.isActive ? "active" : "inactive"}
                onChange={(e) => handleNodeUpdate({ isActive: e.target.value === "active" })}
              >
                <FormControlLabel
                  value="active"
                  control={<Radio size="small" />}
                  label="Active"
                />
                <FormControlLabel
                  value="inactive"
                  control={<Radio size="small" />}
                  label="Inactive"
                />
              </RadioGroup>
            </FormControl>

            <Divider sx={{ my: 1 }} />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => console.log('Apply changes')}
            >
              Apply Changes
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Select a node to view its properties
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

const Workflow = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="600" color="text.primary">
          Supply Chain Workflow
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<Save />}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrow />}
          >
            Run Simulation
          </Button>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          height: "calc(100vh - 270px)",
        }}
      >
        <ReactFlowProvider>
          <FlowCanvas />
        </ReactFlowProvider>
      </Paper>
    </Box>
  );
};

export default Workflow;
