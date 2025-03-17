import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertSupplierSchema, 
  insertOrderSchema, 
  insertNodeSchema, 
  insertEdgeSchema, 
  insertInventoryItemSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Statistics endpoint
  app.get('/api/statistics', async (req: Request, res: Response) => {
    const stats = await storage.getStatistics();
    if (!stats) {
      return res.status(404).json({ message: "Statistics not found" });
    }
    res.json(stats);
  });

  // Suppliers endpoints
  app.get('/api/suppliers', async (req: Request, res: Response) => {
    const suppliers = await storage.getAllSuppliers();
    res.json(suppliers);
  });

  app.get('/api/suppliers/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    const supplier = await storage.getSupplier(id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json(supplier);
  });

  app.post('/api/suppliers', async (req: Request, res: Response) => {
    try {
      const newSupplier = insertSupplierSchema.parse(req.body);
      const createdSupplier = await storage.createSupplier(newSupplier);
      res.status(201).json(createdSupplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create supplier" });
    }
  });

  app.put('/api/suppliers/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    try {
      const supplierUpdates = insertSupplierSchema.partial().parse(req.body);
      const updatedSupplier = await storage.updateSupplier(id, supplierUpdates);
      
      if (!updatedSupplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      
      res.json(updatedSupplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update supplier" });
    }
  });

  app.delete('/api/suppliers/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    const success = await storage.deleteSupplier(id);
    if (!success) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(204).send();
  });

  // Orders endpoints
  app.get('/api/orders', async (req: Request, res: Response) => {
    const orders = await storage.getAllOrders();
    res.json(orders);
  });

  app.get('/api/orders/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await storage.getOrder(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  });

  app.get('/api/suppliers/:id/orders', async (req: Request, res: Response) => {
    const supplierId = parseInt(req.params.id);
    if (isNaN(supplierId)) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    const supplier = await storage.getSupplier(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const orders = await storage.getOrdersBySupplier(supplierId);
    res.json(orders);
  });

  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const newOrder = insertOrderSchema.parse(req.body);
      const createdOrder = await storage.createOrder(newOrder);
      res.status(201).json(createdOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put('/api/orders/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    try {
      const orderUpdates = insertOrderSchema.partial().parse(req.body);
      const updatedOrder = await storage.updateOrder(id, orderUpdates);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Workflow nodes endpoints
  app.get('/api/workflow/nodes', async (req: Request, res: Response) => {
    const nodes = await storage.getAllNodes();
    res.json(nodes);
  });

  app.post('/api/workflow/nodes', async (req: Request, res: Response) => {
    try {
      const newNode = insertNodeSchema.parse(req.body);
      const createdNode = await storage.createNode(newNode);
      res.status(201).json(createdNode);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create node" });
    }
  });

  app.put('/api/workflow/nodes/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid node ID" });
    }

    try {
      const nodeUpdates = insertNodeSchema.partial().parse(req.body);
      const updatedNode = await storage.updateNode(id, nodeUpdates);
      
      if (!updatedNode) {
        return res.status(404).json({ message: "Node not found" });
      }
      
      res.json(updatedNode);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update node" });
    }
  });

  app.delete('/api/workflow/nodes/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid node ID" });
    }

    const success = await storage.deleteNode(id);
    if (!success) {
      return res.status(404).json({ message: "Node not found" });
    }

    res.status(204).send();
  });

  // Workflow edges endpoints
  app.get('/api/workflow/edges', async (req: Request, res: Response) => {
    const edges = await storage.getAllEdges();
    res.json(edges);
  });

  app.post('/api/workflow/edges', async (req: Request, res: Response) => {
    try {
      const newEdge = insertEdgeSchema.parse(req.body);
      const createdEdge = await storage.createEdge(newEdge);
      res.status(201).json(createdEdge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create edge" });
    }
  });

  app.put('/api/workflow/edges/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid edge ID" });
    }

    try {
      const edgeUpdates = insertEdgeSchema.partial().parse(req.body);
      const updatedEdge = await storage.updateEdge(id, edgeUpdates);
      
      if (!updatedEdge) {
        return res.status(404).json({ message: "Edge not found" });
      }
      
      res.json(updatedEdge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update edge" });
    }
  });

  app.delete('/api/workflow/edges/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid edge ID" });
    }

    const success = await storage.deleteEdge(id);
    if (!success) {
      return res.status(404).json({ message: "Edge not found" });
    }

    res.status(204).send();
  });

  // Inventory items endpoints
  app.get('/api/inventory', async (req: Request, res: Response) => {
    const items = await storage.getAllInventoryItems();
    res.json(items);
  });

  app.get('/api/inventory/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid inventory item ID" });
    }

    const item = await storage.getInventoryItem(id);
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(item);
  });

  app.get('/api/inventory/sku/:sku', async (req: Request, res: Response) => {
    const sku = req.params.sku;
    
    const item = await storage.getInventoryItemBySku(sku);
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(item);
  });

  app.post('/api/inventory', async (req: Request, res: Response) => {
    try {
      const newItem = insertInventoryItemSchema.parse(req.body);
      const createdItem = await storage.createInventoryItem(newItem);
      res.status(201).json(createdItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });

  app.put('/api/inventory/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid inventory item ID" });
    }

    try {
      const itemUpdates = insertInventoryItemSchema.partial().parse(req.body);
      const updatedItem = await storage.updateInventoryItem(id, itemUpdates);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });

  app.delete('/api/inventory/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid inventory item ID" });
    }

    const success = await storage.deleteInventoryItem(id);
    if (!success) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(204).send();
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}