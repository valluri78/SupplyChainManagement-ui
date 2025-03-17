import { pgTable, text, serial, integer, boolean, date, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Order status type
export const OrderStatus = z.enum([
  "pending",
  "processing",
  "in_transit",
  "delivered",
  "delayed",
  "canceled"
]);

export type OrderStatusType = z.infer<typeof OrderStatus>;

// Supplier status type
export const SupplierStatus = z.enum([
  "active",
  "inactive",
  "review",
  "suspended"
]);

export type SupplierStatusType = z.infer<typeof SupplierStatus>;

// Product category type
export const ProductCategory = z.enum([
  "electronics",
  "mechanical",
  "raw_materials",
  "packaging",
  "components"
]);

export type ProductCategoryType = z.infer<typeof ProductCategory>;

// Inventory status type
export const InventoryStatus = z.enum([
  "in_stock",
  "low_stock",
  "out_of_stock",
  "discontinued",
  "on_order"
]);

export type InventoryStatusType = z.infer<typeof InventoryStatus>;

// Workflow node types
export const NodeType = z.enum([
  "warehouse",
  "factory",
  "transport",
  "retailer",
  "customer"
]);

export type NodeTypeType = z.infer<typeof NodeType>;

// Suppliers
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull(),
  location: text("location").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  ordersThisMonth: integer("orders_this_month").notNull(),
  onTimeDelivery: numeric("on_time_delivery").notNull(),
  totalSpend: numeric("total_spend").notNull(),
  productCategories: integer("product_categories").notNull(),
  logoInitials: text("logo_initials").notNull(),
  logoColor: text("logo_color").notNull(),
});

export const insertSupplierSchema = createInsertSchema(suppliers);
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull().unique(),
  supplierId: integer("supplier_id").notNull(),
  date: date("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull(),
  amount: numeric("amount").notNull(),
  products: text("products").notNull(),
});

export const insertOrderSchema = createInsertSchema(orders);
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Workflow nodes
export const nodes = pgTable("nodes", {
  id: serial("id").primaryKey(),
  nodeId: text("node_id").notNull().unique(),
  type: text("type").notNull(),
  label: text("label").notNull(),
  positionX: integer("position_x").notNull(),
  positionY: integer("position_y").notNull(),
  capacity: integer("capacity"),
  processingTime: integer("processing_time"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertNodeSchema = createInsertSchema(nodes);
export type InsertNode = z.infer<typeof insertNodeSchema>;
export type Node = typeof nodes.$inferSelect;

// Workflow edges
export const edges = pgTable("edges", {
  id: serial("id").primaryKey(),
  edgeId: text("edge_id").notNull().unique(),
  source: text("source").notNull(),
  target: text("target").notNull(),
  type: text("type").notNull(),
  label: text("label"),
});

export const insertEdgeSchema = createInsertSchema(edges);
export type InsertEdge = z.infer<typeof insertEdgeSchema>;
export type Edge = typeof edges.$inferSelect;

// Statistics
export const statistics = pgTable("statistics", {
  id: serial("id").primaryKey(),
  totalOrders: integer("total_orders").notNull(),
  inventoryValue: numeric("inventory_value").notNull(),
  activeSuppliers: integer("active_suppliers").notNull(),
  onTimeDelivery: numeric("on_time_delivery").notNull(),
});

export const insertStatisticsSchema = createInsertSchema(statistics);
export type InsertStatistics = z.infer<typeof insertStatisticsSchema>;
export type Statistics = typeof statistics.$inferSelect;

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Inventory items
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  supplier: text("supplier").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price").notNull(),
  status: text("status").notNull(),
  lastUpdated: date("last_updated").notNull(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems);
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;
