import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Grid,
  Typography,
  Box,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  useTheme,
} from "@mui/material";
import {
  ShoppingCart,
  Inventory2,
  People,
  LocalShipping,
  Refresh,
  MoreVert,
} from "@mui/icons-material";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardCard from "@/components/ui/dashboard-card";
import SparklineChart from "@/components/ui/sparkline-chart";
import OrderTable from "@/components/order-table";
import { Order, Statistics } from "@/lib/types";

const Dashboard = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState("today");

  const { data: statistics, isLoading: isLoadingStats } = useQuery<Statistics>({
    queryKey: ["/api/statistics"],
  });

  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: string | null
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  // Sparkline data
  const totalOrdersSparkline = [5, 7, 4, 8, 10, 9, 12];
  const inventoryValueSparkline = [10, 11, 12, 11, 9, 8, 7];
  const suppliersSparkline = [7, 6, 8, 9, 8, 10, 12];
  const deliverySparkline = [8, 9, 7, 10, 8, 9, 11];

  // Bar chart data
  const barChartData = [
    { month: "Jan", orders: 120 },
    { month: "Feb", orders: 150 },
    { month: "Mar", orders: 180 },
    { month: "Apr", orders: 210 },
    { month: "May", orders: 190 },
    { month: "Jun", orders: 240 },
    { month: "Jul", orders: 280 },
    { month: "Aug", orders: 250 },
  ];

  // Pie chart data
  const pieChartData = [
    { name: "In Stock", value: 40, color: theme.palette.secondary.main },
    { name: "In Transit", value: 35, color: theme.palette.primary.main },
    { name: "Low Stock", value: 15, color: theme.palette.warning.main },
    { name: "Out of Stock", value: 10, color: theme.palette.error.main },
  ];

  if (isLoadingStats || isLoadingOrders) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading dashboard data...</Typography>
      </Box>
    );
  }

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
          Supply Chain Overview
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Paper
            sx={{ display: "flex", alignItems: "center", borderRadius: 1 }}
            elevation={0}
          >
            <ToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={handleTimeRangeChange}
              aria-label="time range"
              size="small"
            >
              <ToggleButton value="today" aria-label="today">
                Today
              </ToggleButton>
              <ToggleButton value="week" aria-label="week">
                Week
              </ToggleButton>
              <ToggleButton value="month" aria-label="month">
                Month
              </ToggleButton>
              <ToggleButton value="year" aria-label="year">
                Year
              </ToggleButton>
            </ToggleButtonGroup>
          </Paper>
          <Button
            variant="outlined"
            color="inherit"
            sx={{ minWidth: 0, p: 1 }}
            aria-label="refresh"
          >
            <Refresh />
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            sx={{ minWidth: 0, p: 1 }}
            aria-label="more options"
          >
            <MoreVert />
          </Button>
        </Box>
      </Box>

      {/* Stats Cards Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Orders"
            value={statistics?.totalOrders.toLocaleString() || "0"}
            change={12.5}
            period="this month"
            icon={<ShoppingCart />}
            color={theme.palette.primary.main}
            chartComponent={
              <SparklineChart
                data={totalOrdersSparkline}
                color={theme.palette.primary.main}
              />
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Inventory Value"
            value={`$${(Number(statistics?.inventoryValue) / 1000000).toFixed(2)}M`}
            change={-3.2}
            period="this month"
            icon={<Inventory2 />}
            color={theme.palette.secondary.main}
            chartComponent={
              <SparklineChart
                data={inventoryValueSparkline}
                color={theme.palette.secondary.main}
              />
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Active Suppliers"
            value={statistics?.activeSuppliers.toString() || "0"}
            change={4.1}
            period="this month"
            icon={<People />}
            color={theme.palette.warning.main}
            chartComponent={
              <SparklineChart
                data={suppliersSparkline}
                color={theme.palette.warning.main}
              />
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="On-Time Delivery"
            value={`${statistics?.onTimeDelivery.toString() || "0"}%`}
            change={1.8}
            period="this month"
            icon={<LocalShipping />}
            color={theme.palette.success.main}
            chartComponent={
              <SparklineChart
                data={deliverySparkline}
                color={theme.palette.success.main}
              />
            }
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{ p: 3, height: "100%", borderRadius: 2 }}
            elevation={0}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="600">
                Order Volume Trends
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Export
                </Button>
                <Button
                  variant="text"
                  color="inherit"
                  sx={{ minWidth: 0, p: 1 }}
                >
                  <MoreVert />
                </Button>
              </Box>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{ p: 3, height: "100%", borderRadius: 2 }}
            elevation={0}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="600">
                Inventory Status
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Export
                </Button>
                <Button
                  variant="text"
                  color="inherit"
                  sx={{ minWidth: 0, p: 1 }}
                >
                  <MoreVert />
                </Button>
              </Box>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders Table */}
      <OrderTable
        orders={orders || []}
        title="Recent Orders"
      />
    </Box>
  );
};

export default Dashboard;
