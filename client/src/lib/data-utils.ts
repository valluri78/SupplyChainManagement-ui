import { FlowNode, FlowEdge, NetworkData, RegionData, EfficiencyData, Node, Edge, NetworkNode } from "./types";

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
  const generateMockData = () => {
    const regions = [
      'north_america', 'europe', 'asia_pacific', 'latin_america', 'africa',
      'middle_east', 'south_asia', 'oceania', 'central_asia', 'caribbean'
    ];
    const retailCities = [
      'NY', 'LA', 'London', 'Paris', 'Tokyo', 'Sydney', 'Mexico City', 'Sao Paulo', 
      'Cape Town', 'Dubai', 'Mumbai', 'Auckland', 'Almaty', 'Havana', 'Toronto', 
      'Berlin', 'Shanghai', 'Buenos Aires', 'Nairobi', 'Singapore'
    ];
  
    // Generate nodes
    const allNodes: NetworkNode[] = [];
    
    // 1 Central Hub
    allNodes.push({ id: 'hub', name: 'Central Hub', type: 'central', value: 100, group: 'global' });
  
    // 50 Distribution Centers (5 per region, 10 regions)
    for (let i = 0; i < 50; i++) {
      const region = regions[i % regions.length] as 'central' | 'distribution' | 'retail';
      allNodes.push({
        id: `dc${i + 1}`,
        name: `${region.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')} DC ${Math.floor(i / regions.length) + 1}`,
        type: 'distribution',
        value: 60,
        group: region
      });
    }
  
    // 949 Retail Locations (distributed across regions)
    for (let i = 0; i < 949; i++) {
      const region = regions[i % regions.length];
      const cityBase = retailCities[i % retailCities.length];
      const suffix = Math.floor(i / retailCities.length) || '';
      allNodes.push({
        id: `r${i + 1}`,
        name: `${cityBase} Retail ${suffix || 1}`,
        type: 'retail',
        value: 30,
        group: region
      });
    }
  
    // Generate links
    const allLinks = [];
  
    // Hub to all distribution centers
    for (let i = 1; i <= 50; i++) {
      allLinks.push({ source: 'hub', target: `dc${i}`, value: 5 });
    }
  
    // Distribution centers to retail (each DC connects to ~19 retail nodes)
    let retailIdx = 0;
    for (let dcIdx = 1; dcIdx <= 50; dcIdx++) {
      const retailCount = dcIdx <= 49 ? 19 : 18; // Last DC gets 18 to fit 949 total
      for (let j = 0; j < retailCount && retailIdx < 949; j++, retailIdx++) {
        allLinks.push({ source: `dc${dcIdx}`, target: `r${retailIdx + 1}`, value: 3 });
      }
    }
  
    return { allNodes, allLinks };
  };

  const { allNodes, allLinks } = generateMockData();

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
