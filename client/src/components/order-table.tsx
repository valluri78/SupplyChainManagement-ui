import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  TablePagination,
  useTheme,
} from "@mui/material";
import { useLocation } from "wouter";
import { ChevronRight } from "@mui/icons-material";
import { Order } from "@/lib/types";

interface OrderTableProps {
  orders: Order[];
  title?: string;
  hideActions?: boolean;
  onViewOrder?: (orderId: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "success";
    case "processing":
      return "info";
    case "in_transit":
      return "warning";
    case "delayed":
      return "error";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "delivered":
      return "Delivered";
    case "processing":
      return "Processing";
    case "in_transit":
      return "In Transit";
    case "delayed":
      return "Delayed";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const OrderTable = ({ orders, title, hideActions, onViewOrder }: OrderTableProps) => {
  const theme = useTheme();
  const [, navigate] = useLocation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewOrder = (order: Order) => {
    if (onViewOrder) {
      onViewOrder(order.id);
    } else {
      // Navigate to order detail
      navigate(`/orders/${order.id}`);
      console.log(`Viewing order: ${order.orderId}`);
    }
  };

  return (
    <Paper sx={{ borderRadius: 2, overflow: "hidden" }} elevation={0}>
      {title && (
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
            {title}
          </Typography>
          {!hideActions && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<span style={{ fontSize: "1.25rem" }}>+</span>}
            >
              New Order
            </Button>
          )}
        </Box>
      )}
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow
                  key={order.id}
                  hover
                  onClick={() => handleViewOrder(order)}
                  sx={{ cursor: "pointer", "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {order.orderId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 2,
                          bgcolor: theme.palette.primary.light,
                          fontSize: "0.875rem",
                        }}
                      >
                        AC
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {order.supplierId === 1 ? "Acme Corp" : 
                           order.supplierId === 2 ? "TechCore Inc" : 
                           order.supplierId === 3 ? "Global Logistics" : 
                           "Stellar Systems"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.supplierId === 1 ? "New York, USA" : 
                           order.supplierId === 2 ? "San Francisco, USA" : 
                           order.supplierId === 3 ? "London, UK" : 
                           "Berlin, Germany"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.time}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(order.status)}
                      color={getStatusColor(order.status) as "success" | "info" | "warning" | "error" | "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatCurrency(Number(order.amount))}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      color="primary"
                      endIcon={<ChevronRight />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOrder(order);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No orders found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default OrderTable;
