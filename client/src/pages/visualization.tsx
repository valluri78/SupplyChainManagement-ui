import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  Slider,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material";
import {
  FilterList,
  Download,
  Fullscreen,
  LocationOn,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ForceGraph2D from "react-force-graph-2d";
import { getRegionPerformanceData, getEfficiencyTrendData, getNetworkData } from "@/lib/data-utils";
import { RegionData, EfficiencyData, NetworkData } from "@/lib/types";

const Visualization = () => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState("network");
  const [region, setRegion] = useState("all");
  const [zoom, setZoom] = useState(100);
  
  // Get sample data
  const regionData: RegionData[] = getRegionPerformanceData();
  const efficiencyData: EfficiencyData[] = getEfficiencyTrendData();
  const networkData: NetworkData = getNetworkData(region);

  const handleRegionChange = (event: any) => {
    setRegion(event.target.value);
  };

  const handleZoomChange = (event: any, newValue: number | number[]) => {
    setZoom(newValue as number);
  };

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
  };
  const [isFullScreen, setIsFullScreen] = useState(false);


  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  const [graphData, setGraphData] = useState<{ nodes: NetworkData['nodes'], links: NetworkData['links'] }>({ nodes: [{ id: "hub", name: "Central Hub", type: "central", value: 100, group: "central" }], links: [] });

  const handleNodeClick = (node: any) => {
    if (node.type === "central") {
      // Show only Distributors
      const newNodes = networkData.nodes.filter((n) => n.type === "central" || n.type === "distribution");
      const newLinks = networkData.links.filter((l) => l.source === "hub");
      setGraphData({ nodes: newNodes, links: newLinks });
    } else if (node.type === "distribution") {
      // Show only clicked Distributor and its Retail nodes
      const newNodes = networkData.nodes.filter((n) => n.id === node.id || n.type === "central" || n.type === "distribution" || networkData.links.some((l) => l.source === node.id && l.target === n.id));
      const newLinks = networkData.links.filter((l) => l.source === node.id || l.source === "hub");
      setGraphData({ nodes: newNodes, links: newLinks });
    }
    else if (node.type === "retail") {
      // Show only clicked Distributor and its Retail nodes
      const newNodes = networkData.nodes.filter((n) => n.id === node.id || n.type === "central" || n.type === "distribution" || networkData.links.some((l) => l.source === node.id && l.target === n.id));
      const newLinks = networkData.links.filter((l) => l.source === node.id || l.source === "hub");
      setGraphData({ nodes: networkData.nodes, links: networkData.links });
    }
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
          Supply Chain Visualization
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Region</InputLabel>
            <Select
              value={region}
              onChange={handleRegionChange}
              label="Region"
            >
              <MenuItem value="all">All Regions</MenuItem>
              <MenuItem value="north_america">North America</MenuItem>
              <MenuItem value="europe">Europe</MenuItem>
              <MenuItem value="asia_pacific">Asia Pacific</MenuItem>
              <MenuItem value="latin_america">Latin America</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<FilterList />}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Download />}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <ButtonGroup variant="outlined" aria-label="view mode">
            <Button
              variant={viewMode === "network" ? "contained" : "outlined"}
              color={viewMode === "network" ? "primary" : "inherit"}
              onClick={() => handleViewModeChange("network")}
            >
              Network View
            </Button>
            <Button
              variant={viewMode === "geographic" ? "contained" : "outlined"}
              color={viewMode === "geographic" ? "primary" : "inherit"}
              onClick={() => handleViewModeChange("geographic")}
            >
              Geographic View
            </Button>
            <Button
              variant={viewMode === "timeline" ? "contained" : "outlined"}
              color={viewMode === "timeline" ? "primary" : "inherit"}
              onClick={() => handleViewModeChange("timeline")}
            >
              Timeline View
            </Button>
          </ButtonGroup>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <IconButton aria-label="fullscreen" onClick={toggleFullScreen}>
              <Fullscreen />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            height: "calc(100vh - 380px)",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: theme.palette.grey[50],
            overflow: "hidden",
            position: "relative",
          }}
        >
          {viewMode === "network" && (
            <ForceGraph2D
              graphData={graphData}
              nodeLabel={(node: any) => `${node.name}`}
              nodeAutoColorBy="type"
              nodeRelSize={8}
              linkWidth={2}
              linkDirectionalParticles={2}
              linkDirectionalParticleWidth={2}
              backgroundColor="#f8f9fa"
              onNodeClick={handleNodeClick}
              nodeCanvasObject={(node: any, ctx, globalScale) => {
                const label = node.name;
                const fontSize = 12/globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const nodeSize = Math.max(4, (node.value || 10) / 3) / globalScale;
                
                // Node background
                ctx.beginPath();
                ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
                
                // Set color based on node type
                if (node.type === 'central') {
                  ctx.fillStyle = theme.palette.primary.main;
                } else if (node.type === 'distribution') {
                  ctx.fillStyle = theme.palette.secondary.main;
                } else {
                  ctx.fillStyle = theme.palette.warning.main;
                }
                
                ctx.fill();
                
                // Draw label
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fillRect(
                  node.x - textWidth / 2 - 2,
                  node.y + nodeSize + 2,
                  textWidth + 4,
                  fontSize + 2
                );
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#000';
                ctx.fillText(label, node.x, node.y + nodeSize + 2 + fontSize / 2);
              }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: theme.palette.primary.main,
                  mr: 1,
                }}
              />
              <Typography variant="body2">Central Hub</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: theme.palette.secondary.main,
                  mr: 1,
                }}
              />
              <Typography variant="body2">Distribution Centers</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: theme.palette.warning.main,
                  mr: 1,
                }}
              />
              <Typography variant="body2">Retail Locations</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Visualization;
