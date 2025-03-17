import { useState, ReactNode } from "react";
import { useLocation } from "wouter";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Badge,
  Avatar,
  styled,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import Sidebar from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const drawerWidth = 280;
const collapsedWidth = 60;

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${theme.palette.grey[300]}`,
  width: "100%",
  maxWidth: 400,
  margin: 0,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.grey[500],
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.grey[900],
  padding: theme.spacing(1),
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "20ch",
  },
}));

const Layout = ({ children, sidebarOpen, toggleSidebar }: LayoutProps) => {
  const theme = useTheme();
  const [location] = useLocation();
  
  // Get the page title based on location
  const getPageTitle = () => {
    if (location === "/") return "Dashboard";
    if (location === "/inventory") return "Inventory";
    if (location === "/suppliers") return "Suppliers";
    if (location.startsWith("/supplier/")) return "Supplier Details";
    if (location === "/workflow") return "Workflow";
    if (location === "/visualization") return "Visualization";
    if (location === "/settings") return "Settings";
    return "Supply Chain Management";
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          marginLeft: 0, // Remove the left margin
          transition: theme.transitions.create("all", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            backgroundColor: "white", 
            color: "text.primary",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 0, marginLeft:'15px' }}>
              {getPageTitle()}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                size="large"
                aria-label="show new notifications"
                color="inherit"
                sx={{ position: "relative" }}
              >
                <Badge badgeContent="" color="primary" variant="dot">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  JS
                </Avatar>
                <Typography
                  variant="subtitle2"
                  sx={{ ml: 1, display: { xs: "none", sm: "block" } }}
                >
                  John Smith
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            p: 2,
            height: "calc(100vh - 64px)", // Removed footer height
            overflow: "auto",
            backgroundColor: theme.palette.grey[100],
          }}
        >
          {children}
        </Box>
        {/* Footer removed */}
      </Box>
    </Box>
  );
};

export default Layout;
