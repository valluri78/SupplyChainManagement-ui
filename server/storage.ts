import {
  users, 
  type User, 
  type InsertUser, 
  suppliers, 
  type Supplier, 
  type InsertSupplier,
  orders,
  type Order,
  type InsertOrder,
  nodes,
  type Node,
  type InsertNode,
  edges,
  type Edge,
  type InsertEdge,
  statistics,
  type Statistics,
  type InsertStatistics,
  inventoryItems,
  type InventoryItem,
  type InsertInventoryItem
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Suppliers
  getAllSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;

  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersBySupplier(supplierId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;

  // Inventory Items
  getAllInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItem(id: number): Promise<InventoryItem | undefined>;
  getInventoryItemBySku(sku: string): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;

  // Workflow Nodes
  getAllNodes(): Promise<Node[]>;
  getNode(id: number): Promise<Node | undefined>;
  createNode(node: InsertNode): Promise<Node>;
  updateNode(id: number, node: Partial<InsertNode>): Promise<Node | undefined>;
  deleteNode(id: number): Promise<boolean>;

  // Workflow Edges
  getAllEdges(): Promise<Edge[]>;
  getEdge(id: number): Promise<Edge | undefined>;
  createEdge(edge: InsertEdge): Promise<Edge>;
  updateEdge(id: number, edge: Partial<InsertEdge>): Promise<Edge | undefined>;
  deleteEdge(id: number): Promise<boolean>;

  // Statistics
  getStatistics(): Promise<Statistics | undefined>;
  updateStatistics(stats: Partial<InsertStatistics>): Promise<Statistics | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private suppliers: Map<number, Supplier>;
  private orders: Map<number, Order>;
  private nodes: Map<number, Node>;
  private edges: Map<number, Edge>;
  private inventoryItems: Map<number, InventoryItem>;
  private stats: Statistics | undefined;

  private currentUserId: number;
  private currentSupplierId: number;
  private currentOrderId: number;
  private currentNodeId: number;
  private currentEdgeId: number;
  private currentInventoryItemId: number;
  private currentStatsId: number;

  constructor() {
    this.users = new Map();
    this.suppliers = new Map();
    this.orders = new Map();
    this.nodes = new Map();
    this.edges = new Map();
    this.inventoryItems = new Map();

    this.currentUserId = 1;
    this.currentSupplierId = 1;
    this.currentOrderId = 1;
    this.currentNodeId = 1;
    this.currentEdgeId = 1;
    this.currentInventoryItemId = 1;
    this.currentStatsId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Suppliers
  async getAllSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = this.currentSupplierId++;
    const newSupplier: Supplier = { ...supplier, id };
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }

  async updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const existingSupplier = this.suppliers.get(id);
    if (!existingSupplier) return undefined;

    const updatedSupplier = { ...existingSupplier, ...supplier };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersBySupplier(supplierId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.supplierId === supplierId,
    );
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const newOrder: Order = { ...order, id };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) return undefined;

    const updatedOrder = { ...existingOrder, ...order };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }

  // Inventory Items
  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values());
  }

  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    return this.inventoryItems.get(id);
  }

  async getInventoryItemBySku(sku: string): Promise<InventoryItem | undefined> {
    return Array.from(this.inventoryItems.values()).find(
      (item) => item.sku === sku
    );
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.currentInventoryItemId++;
    const newItem: InventoryItem = { ...item, id };
    this.inventoryItems.set(id, newItem);
    return newItem;
  }

  async updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const existingItem = this.inventoryItems.get(id);
    if (!existingItem) return undefined;

    const updatedItem = { ...existingItem, ...item };
    this.inventoryItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    return this.inventoryItems.delete(id);
  }

  // Workflow Nodes
  async getAllNodes(): Promise<Node[]> {
    return Array.from(this.nodes.values());
  }

  async getNode(id: number): Promise<Node | undefined> {
    return this.nodes.get(id);
  }

  async createNode(node: InsertNode): Promise<Node> {
    const id = this.currentNodeId++;
    const newNode: Node = { ...node, id };
    this.nodes.set(id, newNode);
    return newNode;
  }

  async updateNode(id: number, node: Partial<InsertNode>): Promise<Node | undefined> {
    const existingNode = this.nodes.get(id);
    if (!existingNode) return undefined;

    const updatedNode = { ...existingNode, ...node };
    this.nodes.set(id, updatedNode);
    return updatedNode;
  }

  async deleteNode(id: number): Promise<boolean> {
    return this.nodes.delete(id);
  }

  // Workflow Edges
  async getAllEdges(): Promise<Edge[]> {
    return Array.from(this.edges.values());
  }

  async getEdge(id: number): Promise<Edge | undefined> {
    return this.edges.get(id);
  }

  async createEdge(edge: InsertEdge): Promise<Edge> {
    const id = this.currentEdgeId++;
    const newEdge: Edge = { ...edge, id };
    this.edges.set(id, newEdge);
    return newEdge;
  }

  async updateEdge(id: number, edge: Partial<InsertEdge>): Promise<Edge | undefined> {
    const existingEdge = this.edges.get(id);
    if (!existingEdge) return undefined;

    const updatedEdge = { ...existingEdge, ...edge };
    this.edges.set(id, updatedEdge);
    return updatedEdge;
  }

  async deleteEdge(id: number): Promise<boolean> {
    return this.edges.delete(id);
  }

  // Statistics
  async getStatistics(): Promise<Statistics | undefined> {
    return this.stats;
  }

  async updateStatistics(stats: Partial<InsertStatistics>): Promise<Statistics | undefined> {
    if (!this.stats) return undefined;

    this.stats = { ...this.stats, ...stats };
    return this.stats;
  }

  // Initialize sample data
  private initializeData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "password"
    });

    // Create statistics
    this.stats = {
      id: this.currentStatsId++,
      totalOrders: 3542,
      inventoryValue: "1420000", // $1.42M
      activeSuppliers: 124,
      onTimeDelivery: "94.2"
    };

    // Sample suppliers
    const supplierData: InsertSupplier[] = [
      {
        name: "Acme Corp",
        category: "Electronics Manufacturer",
        status: "active",
        location: "New York, USA",
        contactName: "John Reynolds",
        contactEmail: "john.reynolds@acmecorp.com",
        contactPhone: "+1 (212) 555-1234",
        ordersThisMonth: 32,
        onTimeDelivery: 96.4,
        totalSpend: 128450,
        productCategories: 3,
        logoInitials: "AC",
        logoColor: "blue"
      },
      {
        name: "TechCore Inc",
        category: "Component Supplier",
        status: "active",
        location: "San Francisco, USA",
        contactName: "Sarah Johnson",
        contactEmail: "sjohnson@techcore.com",
        contactPhone: "+1 (415) 555-7890",
        ordersThisMonth: 28,
        onTimeDelivery: "94.2",
        totalSpend: "84320",
        productCategories: 5,
        logoInitials: "TC",
        logoColor: "purple"
      },
      {
        name: "Global Logistics",
        category: "Logistics Partner",
        status: "review",
        location: "London, UK",
        contactName: "David Smith",
        contactEmail: "dsmith@globallogistics.co.uk",
        contactPhone: "+44 20 7946 0958",
        ordersThisMonth: 46,
        onTimeDelivery: "88.7",
        totalSpend: "156780",
        productCategories: 2,
        logoInitials: "GL",
        logoColor: "red"
      },
      {
        name: "Stellar Systems",
        category: "Hardware Manufacturer",
        status: "active",
        location: "Berlin, Germany",
        contactName: "Anna Mueller",
        contactEmail: "anna.m@stellarsystems.de",
        contactPhone: "+49 30 901820",
        ordersThisMonth: 19,
        onTimeDelivery: 97.5,
        totalSpend: 67480,
        productCategories: 4,
        logoInitials: "SS",
        logoColor: "green"
      }
    ];

    supplierData.forEach(supplier => {
      this.createSupplier(supplier);
    });

    // Sample orders
    const orderData: InsertOrder[] = [
      {
        orderId: "#ORD-7352",
        supplierId: 1,
        date: new Date("2023-08-12"),
        time: "09:25 AM",
        status: "delivered",
        amount: 12480,
        products: "Microprocessors (x200), Circuit Boards (x50)",
      },
      {
        orderId: "#ORD-7351",
        supplierId: 2,
        date: new Date("2023-08-11"),
        time: "14:32 PM",
        status: "in_transit",
        amount: 8240.50,
        products: "Memory Modules (x150), Power Supplies (x30)",
      },
      {
        orderId: "#ORD-7350",
        supplierId: 3,
        date: new Date("2023-08-10"),
        time: "10:15 AM",
        status: "delayed",
        amount: 15720.75,
        products: "Shipping Materials (x500), Packaging (x200)",
      },
      {
        orderId: "#ORD-7349",
        supplierId: 4,
        date: new Date("2023-08-09"),
        time: "16:45 PM",
        status: "processing",
        amount: 5150.25,
        products: "Circuit Assemblies (x100), Connectors (x300)",
      },
      {
        orderId: "#ORD-7345",
        supplierId: 1,
        date: new Date("2023-08-05"),
        time: "14:10 PM",
        status: "delivered",
        amount: 18760.50,
        products: "Display Panels (x100), Touch Controllers (x100)",
      },
      {
        orderId: "#ORD-7338",
        supplierId: 1,
        date: new Date("2023-07-28"),
        time: "11:32 AM",
        status: "delivered",
        amount: 24950.75,
        products: "Memory Modules (x500), Power Units (x150)",
      }
    ];

    orderData.forEach(order => {
      this.createOrder(order);
    });

    // Sample inventory items
    const inventoryData: InsertInventoryItem[] = [
      {
        sku: "PROC-1001",
        name: "Intel i7 Processor",
        category: "electronics",
        supplier: "Acme Corp",
        quantity: 156,
        unitPrice: 350.00,
        status: "in_stock",
        lastUpdated: new Date("2023-08-15")
      },
      {
        sku: "MEM-2002",
        name: "32GB RAM Module",
        category: "electronics",
        supplier: "TechCore Inc",
        quantity: 89,
        unitPrice: 175.50,
        status: "in_stock",
        lastUpdated: new Date("2023-08-14")
      },
      {
        sku: "PCB-3003",
        name: "Circuit Board v2",
        category: "components",
        supplier: "Acme Corp",
        quantity: 432,
        unitPrice: 45.20,
        status: "in_stock",
        lastUpdated: new Date("2023-08-10")
      },
      {
        sku: "CASE-4004",
        name: "Aluminum Enclosure",
        category: "mechanical",
        supplier: "Stellar Systems",
        quantity: 122,
        unitPrice: 28.90,
        status: "low_stock",
        lastUpdated: new Date("2023-08-12")
      },
      {
        sku: "PWR-5005",
        name: "Power Supply 650W",
        category: "electronics",
        supplier: "TechCore Inc",
        quantity: 0,
        unitPrice: 115.75,
        status: "out_of_stock",
        lastUpdated: new Date("2023-08-05")
      },
      {
        sku: "BOX-6006",
        name: "Product Packaging",
        category: "packaging",
        supplier: "Global Logistics",
        quantity: 1250,
        unitPrice: 2.35,
        status: "in_stock",
        lastUpdated: new Date("2023-08-08")
      },
      {
        sku: "FAN-7007",
        name: "Cooling Fan 120mm",
        category: "components",
        supplier: "Stellar Systems",
        quantity: 48,
        unitPrice: 18.95,
        status: "low_stock",
        lastUpdated: new Date("2023-08-11")
      },
      {
        sku: "CABLE-8008",
        name: "HDMI Cable 2m",
        category: "electronics",
        supplier: "TechCore Inc",
        quantity: 204,
        unitPrice: 12.50,
        status: "in_stock",
        lastUpdated: new Date("2023-08-14")
      }
    ];

    inventoryData.forEach(item => {
      this.createInventoryItem(item);
    });

    // Sample nodes for workflow
    const nodeData: InsertNode[] = [
      {
        nodeId: "node-1",
        type: "warehouse",
        label: "Main Warehouse",
        positionX: 100,
        positionY: 100,
        capacity: 10000,
        processingTime: 2,
        description: "Primary storage facility for raw materials and components.",
        isActive: true
      },
      {
        nodeId: "node-2",
        type: "transport",
        label: "Transport 1",
        positionX: 300,
        positionY: 100,
        processingTime: 1,
        description: "Shipping from warehouse to assembly plant",
        isActive: true
      },
      {
        nodeId: "node-3",
        type: "factory",
        label: "Assembly Plant",
        positionX: 500,
        positionY: 100,
        capacity: 5000,
        processingTime: 3,
        description: "Main assembly facility for electronic components",
        isActive: true
      },
      {
        nodeId: "node-4",
        type: "transport",
        label: "Transport 2",
        positionX: 500,
        positionY: 250,
        processingTime: 2,
        description: "Shipping from assembly to retailers",
        isActive: true
      },
      {
        nodeId: "node-5",
        type: "retailer",
        label: "Retailer Network",
        positionX: 500,
        positionY: 400,
        capacity: 2000,
        processingTime: 1,
        description: "Network of retail distribution points",
        isActive: true
      }
    ];

    nodeData.forEach(node => {
      this.createNode(node);
    });

    // Sample edges for workflow
    const edgeData: InsertEdge[] = [
      {
        edgeId: "edge-1",
        source: "node-1",
        target: "node-2",
        type: "standard",
        label: "Ship Raw Materials"
      },
      {
        edgeId: "edge-2",
        source: "node-2",
        target: "node-3",
        type: "standard",
        label: "Deliver to Assembly"
      },
      {
        edgeId: "edge-3",
        source: "node-3",
        target: "node-4",
        type: "standard",
        label: "Ship Products"
      },
      {
        edgeId: "edge-4",
        source: "node-4",
        target: "node-5",
        type: "standard",
        label: "Deliver to Retailers"
      }
    ];

    edgeData.forEach(edge => {
      this.createEdge(edge);
    });
  }
}

export const storage = new MemStorage();
