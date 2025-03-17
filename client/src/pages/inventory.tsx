import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Grid,
  TextField,
  InputAdornment,
  Button,
  useTheme,
  Typography,
  Card,
  CardContent,
  Chip as Badge,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import DynamicTable, { Column, Action } from "@/components/dynamic-table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InventoryItem } from "@shared/schema";

export default function Inventory() {
  const theme = useTheme();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Query to get inventory data
  const { data: inventoryItems = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
    staleTime: 60000,
  });

  // Define table columns
  const columns: Column[] = [
    { id: "sku", label: "SKU", minWidth: 100 },
    { id: "name", label: "Product Name", minWidth: 170 },
    { id: "category", label: "Category", minWidth: 120 },
    { id: "supplier", label: "Supplier", minWidth: 150 },
    { 
      id: "quantity", 
      label: "Quantity", 
      minWidth: 100, 
      align: "right",
      format: (value) => value.toLocaleString()
    },
    { 
      id: "unitPrice", 
      label: "Unit Price", 
      minWidth: 120, 
      align: "right",
      format: (value) => `$${value.toFixed(2)}`
    },
    { 
      id: "status", 
      label: "Status", 
      minWidth: 120,
      format: (value) => {
        // Handle null or undefined status
        if (!value) {
          return (
            <Badge
              color="default"
              label="Unknown"
              variant="filled"
              size="small"
              sx={{ borderRadius: '4px', padding: '0 8px', fontWeight: 500 }}
            />
          );
        }
        
        const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
          switch (status) {
            case 'in_stock':
              return 'success';
            case 'low_stock':
              return 'warning';
            case 'out_of_stock':
              return 'error';
            case 'discontinued':
              return 'default';
            case 'on_order':
              return 'info';
            default:
              return 'default';
          }
        };
        
        const getStatusText = (status: string) => {
          return status.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        };
        
        return (
          <Badge
            color={getStatusColor(value)}
            label={getStatusText(value)}
            variant="filled"
            size="small"
            sx={{ borderRadius: '4px', padding: '0 8px', fontWeight: 500 }}
          />
        );
      }
    },
    { 
      id: "lastUpdated", 
      label: "Last Updated", 
      minWidth: 130,
      format: (value) => new Date(value).toLocaleDateString()
    }
  ];

  // Define table actions
  const actions: Action[] = [
    {
      name: "View Details",
      onClick: (item) => {
        toast({
          title: "View Details",
          description: `Viewing details for ${item.name}`,
        });
      }
    },
    {
      name: "Edit",
      onClick: (item) => {
        toast({
          title: "Edit Item",
          description: `Editing ${item.name}`,
        });
      }
    },
    {
      name: "Delete",
      onClick: async (item) => {
        if (confirm(`Are you sure you want to delete ${item.name}?`)) {
          try {
            await apiRequest(
              'DELETE',
              `/api/inventory/${item.id}`
            );
            
            // Invalidate the inventory items query to refetch the list
            queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
            
            toast({
              title: "Item Deleted",
              description: `${item.name} has been deleted successfully`,
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to delete the item. Please try again.",
              variant: "destructive",
            });
          }
        }
      },
      disabled: (item) => !item || !item.status || item.status === "out_of_stock"
    }
  ];

  // Handle search
  const filteredItems = inventoryItems.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.sku && item.sku.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query)) ||
      (item.supplier && item.supplier.toLowerCase().includes(query))
    );
  });

  // Count items by status for summary cards
  const totalItems = inventoryItems.length;
  const inStockItems = inventoryItems.filter(item => item.status && item.status === "in_stock").length;
  const lowStockItems = inventoryItems.filter(item => item.status && item.status === "low_stock").length;
  const outOfStockItems = inventoryItems.filter(item => item.status && item.status === "out_of_stock").length;

  return (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" variant="overline">
                  Total Items
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
                  {totalItems}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Items in inventory
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" variant="overline">
                  In Stock
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, mb: 1, color: 'success.main' }}>
                  {inStockItems}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" variant="overline">
                  Low Stock
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, mb: 1, color: 'warning.main' }}>
                  {lowStockItems}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Need reordering
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" variant="overline">
                  Out of Stock
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, mb: 1, color: 'error.main' }}>
                  {outOfStockItems}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Urgent reordering needed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Search and Actions */}
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name, SKU, category, or supplier..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                toast({
                  title: "Add New Item",
                  description: "Form to add a new inventory item would open here",
                });
              }}
            >
              Add New Item
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* Inventory Table */}
      <Grid item xs={12}>
        <DynamicTable
          title="Inventory Items"
          columns={columns}
          data={filteredItems}
          actions={actions}
          emptyMessage={
            searchQuery 
              ? "No items match your search criteria" 
              : "No inventory items found. Add some items to get started."
          }
        />
      </Grid>
    </Grid>
  );
}