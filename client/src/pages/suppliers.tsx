import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  Chip,
  Avatar,
  Pagination,
  useTheme,
} from "@mui/material";
import { Search, Add, LocationOn, ArrowForward } from "@mui/icons-material";
import { Supplier } from "@/lib/types";

const statusColors = {
  active: "success",
  inactive: "default",
  review: "warning",
  suspended: "error",
};

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

const Suppliers = () => {
  const theme = useTheme();
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  const { data: suppliers, isLoading } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const handleSupplierClick = (id: number) => {
    navigate(`/supplier/${id}`);
  };

  const filteredSuppliers = suppliers?.filter(supplier => 
    supplier.name.toLowerCase().includes(search.toLowerCase()) ||
    supplier.category.toLowerCase().includes(search.toLowerCase()) ||
    supplier.location.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const suppliersPerPage = 6;
  const totalPages = Math.ceil((filteredSuppliers.length || 0) / suppliersPerPage);
  const displayedSuppliers = filteredSuppliers.slice(
    (page - 1) * suppliersPerPage,
    page * suppliersPerPage
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
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
          Suppliers
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            placeholder="Search suppliers..."
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 280 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
          >
            Add Supplier
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Typography>Loading suppliers...</Typography>
      ) : displayedSuppliers.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ mt: 5 }}>
          No suppliers found
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {displayedSuppliers.map((supplier) => (
              <Grid item xs={12} md={6} lg={4} key={supplier.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: theme.shadows[4],
                      transform: "translateY(-2px)",
                    },
                  }}
                  onClick={() => handleSupplierClick(supplier.id)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: logoColors[supplier.logoColor as keyof typeof logoColors],
                            color: logoTextColors[supplier.logoColor as keyof typeof logoTextColors],
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                          }}
                        >
                          {supplier.logoInitials}
                        </Avatar>
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6">{supplier.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {supplier.category}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                        color={statusColors[supplier.status as keyof typeof statusColors] as "success" | "default" | "warning" | "error"}
                        size="small"
                      />
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Orders This Month
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 0.5 }}>
                          {supplier.ordersThisMonth}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          On-Time Delivery
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 0.5 }}>
                          {supplier.onTimeDelivery}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Total Spend
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 0.5 }}>
                          ${supplier.totalSpend.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Product Categories
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 0.5 }}>
                          {supplier.productCategories}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Box
                    sx={{
                      px: 3,
                      py: 1.5,
                      bgcolor: "grey.50",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationOn fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {supplier.location}
                      </Typography>
                    </Box>
                    <Button
                      color="primary"
                      sx={{ minWidth: 0, p: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSupplierClick(supplier.id);
                      }}
                    >
                      <ArrowForward />
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Suppliers;
