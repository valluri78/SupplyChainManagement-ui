import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  styled,
  useTheme,
} from "@mui/material";
import {
  Dashboard,
  Inventory,
  People,
  AccountTree,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const drawerWidth = 280;
const collapsedWidth = 60;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const Logo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  color: theme.palette.primary.main,
}));

const StyledListItem = styled(ListItem)<{ active: number }>(({ theme, active }) => ({
  borderRadius: "0 24px 24px 0",
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(1.5, 2),
  color: active ? theme.palette.common.white : theme.palette.grey[400],
  backgroundColor: active ? theme.palette.primary.dark : "transparent",
  "&:hover": {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.grey[800],
    color: theme.palette.common.white,
  },
  cursor: "pointer",
}));

const Sidebar = ({ open, onToggle }: SidebarProps) => {
  const theme = useTheme();
  const [location] = useLocation();
  const [activeRoute, setActiveRoute] = useState("/");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setActiveRoute(location);
  }, [location]);

  // Use the hovered state to determine if sidebar should be open
  const isOpen = open || isHovered;

  const navItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Inventory", icon: <Inventory />, path: "/inventory" },
    { text: "Suppliers", icon: <People />, path: "/suppliers" },
    { text: "Workflow", icon: <AccountTree />, path: "/workflow" },
    { text: "Visualization", icon: <BarChart />, path: "/visualization" },
    { text: "Settings", icon: <Settings />, path: "/settings" },
  ];

  return (
    <Drawer
      sx={{
        width: isOpen ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        "& .MuiDrawer-paper": {
          width: isOpen ? drawerWidth : collapsedWidth,
          backgroundColor: theme.palette.grey[900],
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
        },
      }}
      variant="permanent"
      anchor="left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <DrawerHeader>
        <LogoContainer>
          <Logo>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 2a2 2 0 00-2 2v1h18V4a2 2 0 00-2-2H4z"></path>
              <path
                fillRule="evenodd"
                d="M18 7H2v9a2 2 0 002 2h12a2 2 0 002-2V7zM4 11a1 1 0 011-1h6a1 1 0 110 2H5a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H5z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Logo>
          <Box
            sx={{
              fontSize: "1.25rem",
              fontWeight: 500,
              transition: "opacity 0.2s",
              opacity: isOpen ? 1 : 0,
            }}
          >
            SCM System
          </Box>
        </LogoContainer>
        <IconButton onClick={onToggle} sx={{ color: "white" }}>
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ mt: 2 }}>
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <StyledListItem active={activeRoute === item.path ? 1 : 0}>
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: isOpen ? 1 : 0,
                  transition: "opacity 0.2s",
                }}
              />
            </StyledListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
