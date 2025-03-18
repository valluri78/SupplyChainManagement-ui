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
import {
  getRegionPerformanceData,
  getEfficiencyTrendData,
  getNetworkData,
} from "@/lib/data-utils";
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

  const [graphData, setGraphData] = useState<{
    nodes: NetworkData["nodes"];
    links: NetworkData["links"];
  }>({
    nodes: [
      {
        id: "hub",
        name: "Central Hub",
        type: "central",
        value: 100,
        group: "central",
      },
    ],
    links: [],
  });

  const handleNodeClick = (node: any) => {
    if (node.type === "central") {
      // Show only Distributors
      const newNodes = networkData.nodes.filter(
        (n) => n.type === "central" || n.type === "distribution"
      );
      const newLinks = networkData.links.filter((l) => l.source === "hub");
      setGraphData({ nodes: newNodes, links: newLinks });
    } else if (node.type === "distribution") {
      // Show only clicked Distributor and its Retail nodes
      const newNodes = networkData.nodes.filter(
        (n) =>
          n.id === node.id ||
          n.type === "central" ||
          n.type === "distribution" ||
          networkData.links.some(
            (l) => l.source === node.id && l.target === n.id
          )
      );
      const newLinks = networkData.links.filter(
        (l) => l.source === node.id || l.source === "hub"
      );
      setGraphData({ nodes: newNodes, links: newLinks });
    } else if (node.type === "retail") {
      // Show only clicked Distributor and its Retail nodes
      const newNodes = networkData.nodes.filter(
        (n) =>
          n.id === node.id ||
          n.type === "central" ||
          n.type === "distribution" ||
          networkData.links.some(
            (l) => l.source === node.id && l.target === n.id
          )
      );
      const newLinks = networkData.links.filter(
        (l) => l.source === node.id || l.source === "hub"
      );
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
        <Typography variant="h6" fontWeight="400" color="text.primary">
          Supply Chain Visualization
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Region</InputLabel>
            <Select value={region} onChange={handleRegionChange} label="Region">
              <MenuItem value="all">All Regions</MenuItem>
              <MenuItem value="north_america">North America</MenuItem>
              <MenuItem value="europe">Europe</MenuItem>
              <MenuItem value="asia_pacific">Asia Pacific</MenuItem>
              <MenuItem value="latin_america">Latin America</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" color="inherit" startIcon={<FilterList />}>
            Filters
          </Button>
          <Button variant="outlined" color="inherit" startIcon={<Download />}>
            Export
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <IconButton aria-label="fullscreen" onClick={toggleFullScreen}>
              <Fullscreen />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          height: "calc(100vh - 180px)",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          bgcolor: theme.palette.grey[50],
          overflow: "hidden",
          position: "relative",
          textAlign: "center",
        }}
      >
        <ForceGraph2D
          graphData={graphData}
          nodeLabel={(node: any) => `${node.name}`}
          nodeAutoColorBy="type"
          nodeRelSize={4}
          linkWidth={2}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          minZoom={10}
          maxZoom={15}
          backgroundColor="#f8f9fa"
          onNodeClick={handleNodeClick} // Ensure node click works
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;

            // Measure text width
            const textWidth = ctx.measureText(label).width;

            // Calculate node size dynamically based on text width
            const minNodeSize = 10 / globalScale; // Minimum node size
            const padding = 6 / globalScale; // Padding around text
            const nodeSize = Math.max(minNodeSize, textWidth / 2 + padding); // Ensure node can contain text

            // Draw Node Background
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
            ctx.closePath(); // Ensure path is closed for event detection

            // Set color based on node type
            if (node.type === "central") {
              ctx.fillStyle = theme.palette.primary.main;
            } else if (node.type === "distribution") {
              ctx.fillStyle = theme.palette.secondary.main;
            } else {
              ctx.fillStyle = theme.palette.warning.main;
            }

            ctx.fill();

            // Draw Label inside the node
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "white"; // Ensure contrast
            ctx.fillText(label, node.x, node.y);
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI, false); // Same size as node
            ctx.fill();
          }}
        />
      </Box>
    </Box>
  );
};

export default Visualization;
