import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  Avatar,
  Divider,
  IconButton,
  useTheme,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Add,
  Person,
  Email,
  Phone,
  Memory,
  DeveloperBoard,
  Smartphone,
  MoreVert,
  LocationOn,
  ChevronRight,
} from "@mui/icons-material";
import OrderTable from "@/components/order-table";
import { Supplier, Order } from "@/lib/types";

const logoColors = {
  blue: "rgb(235, 239, 254)",
  purple: "rgb(242, 236, 254)",
  red: "rgb(254, 235, 235)",
  green: "rgb(236, 254, 239)"
};

const logoTextColors = {
  blue: "rgb(45, 85, 255)",
  purple: "rgb(145, 70, 255)",
  red: "rgb(255, 70, 70)",
  green: "rgb(38, 198, 94)"
};

const SupplierDetail = ({ params }: { params: { id: string } }) => {
  const theme = useTheme();
  const [, navigate] = useLocation();
  const supplierId = parseInt(params.id);

  const { data: supplier, isLoading: isLoadingSupplier } = useQuery<Supplier>({
    queryKey: [`/api/suppliers/${supplierId}`],
  });

  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: [`/api/suppliers/${supplierId}/orders`],
  });

  const handleBackClick = () => {
    navigate("/suppliers");
  };

  if (isLoadingSupplier || isLoadingOrders) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading supplier details...</Typography>
      </Box>
    );
  }

  if (!supplier) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Supplier not found</Typography>
        <Button variant="outlined" onClick={handleBackClick} sx={{ mt: 2 }}>
          Back to Suppliers
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          color="inherit"
          onClick={handleBackClick}
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="600">
          Supplier Details
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 2, mb: 3, overflow: "hidden" }}>
        <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  backgroundColor: logoColors[supplier.logoColor as keyof typeof logoColors],
                  color: logoTextColors[supplier.logoColor as keyof typeof logoTextColors],
                }}
              >
                {supplier.logoInitials}
              </Avatar>
              <Box sx={{ ml: 3 }}>
                <Typography variant="h4" fontWeight="500">
                  {supplier.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <LocationOn fontSize="small" sx={{ color: "text.secondary", mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    {supplier.location}
                  </Typography>
                  <Box component="span" sx={{ mx: 1, color: "text.secondary" }}>
                    •
                  </Box>
                  <Chip
                    label={supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                    color={
                      supplier.status === "active"
                        ? "success"
                        : supplier.status === "review"
                        ? "warning"
                        : "default"
                    }
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
            <Box>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
              >
                New Order
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="500" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex" }}>
                  <Person sx={{ color: "text.secondary", mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2">{supplier.contactName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Procurement Manager
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex" }}>
                  <Email sx={{ color: "text.secondary", mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2">{supplier.contactEmail}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Primary Contact
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex" }}>
                  <Phone sx={{ color: "text.secondary", mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2">{supplier.contactPhone}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Business Hours
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="500" gutterBottom>
                Financial Information
              </Typography>
              <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Terms
                  </Typography>
                  <Typography variant="subtitle2">Net 30</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Currency
                  </Typography>
                  <Typography variant="subtitle2">USD ($)</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Tax ID
                  </Typography>
                  <Typography variant="subtitle2">XX-XXXXXXX</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Credit Limit
                  </Typography>
                  <Typography variant="subtitle2">$250,000</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Current Balance
                  </Typography>
                  <Typography variant="subtitle2">${supplier.totalSpend.toLocaleString()}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="500" gutterBottom>
                Performance Metrics
              </Typography>
              <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Quality Rating
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="subtitle2" sx={{ mr: 1 }}>
                      4.8/5.0
                    </Typography>
                    <Box sx={{ display: "flex", color: "warning.main" }}>
                      {"★★★★½".split("").map((star, i) => (
                        <Typography key={i} variant="subtitle2" sx={{ lineHeight: 1 }}>
                          {star}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    On-Time Delivery
                  </Typography>
                  <Typography variant="subtitle2">{supplier.onTimeDelivery}%</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Response Time
                  </Typography>
                  <Typography variant="subtitle2">4.5 hours</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Order Accuracy
                  </Typography>
                  <Typography variant="subtitle2">98.2%</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Return Rate
                  </Typography>
                  <Typography variant="subtitle2">1.3%</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Recent Orders */}
      <OrderTable
        orders={orders || []}
        title="Recent Orders"
      />

      {/* Product Categories */}
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 2, 
          mb: 3, 
          mt: 3, 
          overflow: "hidden" 
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Product Categories
          </Typography>
          <IconButton>
            <MoreVert />
          </IconButton>
        </Box>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 1,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    <Memory sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="500">
                      Microprocessors
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Intel-compatible processors with various clock speeds and core counts.
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="500">450</Box> units in inventory
                    </Typography>
                    <IconButton size="small" color="primary">
                      <ChevronRight fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 1,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    <DeveloperBoard sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="500">
                      Circuit Boards
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Printed circuit boards for various electronic device applications.
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="500">320</Box> units in inventory
                    </Typography>
                    <IconButton size="small" color="primary">
                      <ChevronRight fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 1,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    <Smartphone sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="500">
                      Display Components
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    LCD and OLED display panels with various sizes and resolutions.
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="500">280</Box> units in inventory
                    </Typography>
                    <IconButton size="small" color="primary">
                      <ChevronRight fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default SupplierDetail;
