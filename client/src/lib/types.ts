// Types defined based on schema.ts
export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Supplier {
  id: number;
  name: string;
  category: string;
  status: string;
  location: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  ordersThisMonth: number;
  onTimeDelivery: number;
  totalSpend: number;
  productCategories: number;
  logoInitials: string;
  logoColor: string;
}

export interface Order {
  id: number;
  orderId: string;
  supplierId: number;
  date: string; // Date string, will be parsed
  time: string;
  status: string;
  amount: number;
  products: string;
}

export interface Node {
  id: number;
  nodeId: string;
  type: string;
  label: string;
  positionX: number;
  positionY: number;
  capacity?: number;
  processingTime?: number;
  description?: string;
  isActive: boolean;
}

export interface Edge {
  id: number;
  edgeId: string;
  source: string;
  target: string;
  type: string;
  label?: string;
}

export interface Statistics {
  id: number;
  totalOrders: number;
  inventoryValue: number;
  activeSuppliers: number;
  onTimeDelivery: number;
}

// React Flow specific types
export interface FlowNode {
  id: string;
  type?: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    nodeType: string;
    capacity?: number;
    processingTime?: number;
    description?: string;
    isActive: boolean;
  };
  style?: React.CSSProperties;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  animated?: boolean;
  style?: React.CSSProperties;
}

// Visualization data types
export interface RegionData {
  name: string;
  shipmentVolume: number;
  processingTime: number;
  deliveryRate: number;
}

export interface EfficiencyData {
  quarter: string;
  networkEfficiency: number;
  capacityUtilization: number;
  costEfficiency: number;
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'central' | 'distribution' | 'retail';
  value: number;
  group: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}
