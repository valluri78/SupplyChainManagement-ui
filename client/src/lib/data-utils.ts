import { FlowNode, FlowEdge, NetworkData, RegionData, EfficiencyData, Node, Edge } from "./types";

// Convert backend nodes to React Flow nodes
export const convertToFlowNodes = (nodes: Node[]): FlowNode[] => {
  return nodes.map((node) => ({
    id: node.nodeId,
    position: { x: node.positionX, y: node.positionY },
    data: {
      label: node.label,
      nodeType: node.type,
      capacity: node.capacity,
      processingTime: node.processingTime,
      description: node.description,
      isActive: node.isActive,
    },
    type: getNodeTypeComponent(node.type),
    style: getNodeStyle(node.type),
  }));
};

// Convert backend edges to React Flow edges
export const convertToFlowEdges = (edges: Edge[]): FlowEdge[] => {
  return edges.map((edge) => ({
    id: edge.edgeId,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: edge.type === 'standard' ? 'default' : 
          edge.type === 'conditional' ? 'step' : 'smoothstep',
    animated: edge.type === 'standard' ? false : true,
    style: { stroke: '#9ca3af', strokeWidth: 2 },
  }));
};

// Get node component type based on node type
export const getNodeTypeComponent = (nodeType: string): string => {
  switch (nodeType) {
    case 'warehouse':
      return 'warehouseNode';
    case 'factory':
      return 'factoryNode';
    case 'transport':
      return 'transportNode';
    case 'retailer':
      return 'retailerNode';
    case 'customer':
      return 'customerNode';
    default:
      return 'default';
  }
};

// Get node style based on node type
export const getNodeStyle = (nodeType: string): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    padding: 10,
    borderRadius: 4,
    width: 160,
    textAlign: 'center',
  };

  switch (nodeType) {
    case 'warehouse':
      return {
        ...baseStyle,
        backgroundColor: 'rgba(63, 81, 181, 0.1)', 
        border: '1px solid rgba(63, 81, 181, 0.3)',
      };
    case 'factory':
      return {
        ...baseStyle,
        backgroundColor: 'rgba(0, 150, 136, 0.1)', 
        border: '1px solid rgba(0, 150, 136, 0.3)',
      };
    case 'transport':
      return {
        ...baseStyle,
        backgroundColor: 'rgba(255, 152, 0, 0.1)', 
        border: '1px solid rgba(255, 152, 0, 0.3)',
      };
    case 'retailer':
      return {
        ...baseStyle,
        backgroundColor: 'rgba(156, 39, 176, 0.1)', 
        border: '1px solid rgba(156, 39, 176, 0.3)',
      };
    case 'customer':
      return {
        ...baseStyle,
        backgroundColor: 'rgba(244, 67, 54, 0.1)', 
        border: '1px solid rgba(244, 67, 54, 0.3)',
      };
    default:
      return baseStyle;
  }
};

// Get icon name based on node type
export const getIconForNodeType = (nodeType: string): string => {
  switch (nodeType) {
    case 'warehouse':
      return 'warehouse';
    case 'factory':
      return 'factory';
    case 'transport':
      return 'local_shipping';
    case 'retailer':
      return 'storefront';
    case 'customer':
      return 'groups';
    default:
      return 'device_hub';
  }
};

// Get color based on node type
export const getColorForNodeType = (nodeType: string): string => {
  switch (nodeType) {
    case 'warehouse':
      return '#3f51b5'; // primary.main
    case 'factory':
      return '#009688'; // secondary.main
    case 'transport':
      return '#ff9800'; // warning.main
    case 'retailer':
      return '#9c27b0'; // purple
    case 'customer':
      return '#f44336'; // error.main
    default:
      return '#757575'; // grey
  }
};

// Format currency values
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Sample region performance data for visualization
export const getRegionPerformanceData = (): RegionData[] => {
  return [
    { name: 'North America', shipmentVolume: 45, processingTime: 15, deliveryRate: 25 },
    { name: 'Europe', shipmentVolume: 35, processingTime: 20, deliveryRate: 20 },
    { name: 'Asia Pacific', shipmentVolume: 40, processingTime: 10, deliveryRate: 30 },
    { name: 'Latin America', shipmentVolume: 30, processingTime: 25, deliveryRate: 15 },
  ];
};

// Sample efficiency trend data for line chart
export const getEfficiencyTrendData = (): EfficiencyData[] => {
  return [
    { quarter: 'Q1', networkEfficiency: 80, capacityUtilization: 50, costEfficiency: 30 },
    { quarter: 'Q2', networkEfficiency: 70, capacityUtilization: 60, costEfficiency: 35 },
    { quarter: 'Q3', networkEfficiency: 85, capacityUtilization: 70, costEfficiency: 45 },
    { quarter: 'Q4', networkEfficiency: 75, capacityUtilization: 85, costEfficiency: 55 },
    { quarter: 'Q1', networkEfficiency: 90, capacityUtilization: 80, costEfficiency: 60 },
  ];
};

// Generate sample network data for force graph
export const getNetworkData = (region: string = 'all'): NetworkData => {
  // This is a sample structure of the network data
  // In a real application, this would come from the API based on the region
  const allNodes = [
    { id: 'hub', name: 'Central Hub', type: 'central' as const, value: 100, group: 'global' },
    { id: 'dc1', name: 'US Distribution', type: 'distribution' as const, value: 60, group: 'north_america' },
    { id: 'dc2', name: 'EU Distribution', type: 'distribution' as const, value: 60, group: 'europe' },
    { id: 'dc3', name: 'Asia Distribution', type: 'distribution' as const, value: 60, group: 'asia_pacific' },
    { id: 'dc4', name: 'LATAM Distribution', type: 'distribution' as const, value: 60, group: 'latin_america' },
    { id: 'r1', name: 'NY Retail', type: 'retail' as const, value: 30, group: 'north_america' },
    { id: 'r2', name: 'LA Retail', type: 'retail' as const, value: 30, group: 'north_america' },
    { id: 'r3', name: 'London Retail', type: 'retail' as const, value: 30, group: 'europe' },
    { id: 'r4', name: 'Paris Retail', type: 'retail' as const, value: 30, group: 'europe' },
    { id: 'r5', name: 'Tokyo Retail', type: 'retail' as const, value: 30, group: 'asia_pacific' },
    { id: 'r6', name: 'Sydney Retail', type: 'retail' as const, value: 30, group: 'asia_pacific' },
    { id: 'r7', name: 'Mexico City Retail', type: 'retail' as const, value: 30, group: 'latin_america' },
    { id: 'r8', name: 'Sao Paulo Retail', type: 'retail' as const, value: 30, group: 'latin_america' },
  ];

  const allLinks = [
    { source: 'hub', target: 'dc1', value: 5 },
    { source: 'hub', target: 'dc2', value: 5 },
    { source: 'hub', target: 'dc3', value: 5 },
    { source: 'hub', target: 'dc4', value: 5 },
    { source: 'dc1', target: 'r1', value: 3 },
    { source: 'dc1', target: 'r2', value: 3 },
    { source: 'dc2', target: 'r3', value: 3 },
    { source: 'dc2', target: 'r4', value: 3 },
    { source: 'dc3', target: 'r5', value: 3 },
    { source: 'dc3', target: 'r6', value: 3 },
    { source: 'dc4', target: 'r7', value: 3 },
    { source: 'dc4', target: 'r8', value: 3 },
  ];

  // Filter by region if specified
  if (region !== 'all' && region !== '') {
    const filteredNodes = allNodes.filter(node => 
      node.group === region || node.type === 'central'
    );
    
    const nodeIds = filteredNodes.map(n => n.id);
    
    const filteredLinks = allLinks.filter(link => 
      nodeIds.includes(link.source) && nodeIds.includes(link.target)
    );
    
    return {
      nodes: filteredNodes,
      links: filteredLinks
    };
  }

  return {
    nodes: allNodes,
    links: allLinks
  };
};
