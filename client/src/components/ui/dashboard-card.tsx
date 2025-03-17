import { ReactNode } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  useTheme,
  styled,
} from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

interface DashboardCardProps {
  title: string;
  value: string;
  change: number;
  period: string;
  icon: ReactNode;
  color: string;
  chartComponent?: ReactNode;
}

const CardIconWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const DashboardCard = ({
  title,
  value,
  change,
  period,
  icon,
  color,
  chartComponent,
}: DashboardCardProps) => {
  const theme = useTheme();
  const isPositive = change >= 0;

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        transition: "box-shadow 0.3s",
        "&:hover": {
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ padding: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Box
                component="span"
                sx={{
                  color: isPositive ? "success.main" : "error.main",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.875rem",
                  mr: 0.5,
                }}
              >
                {isPositive ? (
                  <Box component="span" sx={{ fontSize: "1rem", mr: 0.25 }}>
                    ↑
                  </Box>
                ) : (
                  <Box component="span" sx={{ fontSize: "1rem", mr: 0.25 }}>
                    ↓
                  </Box>
                )}
                {Math.abs(change)}%
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                component="span"
              >
                {period}
              </Typography>
            </Box>
          </Box>
          <CardIconWrapper
            sx={{
              bgcolor: `${color}.light`,
              opacity: 0.1,
            }}
          >
            <Box sx={{ color }}>
              {icon}
            </Box>
          </CardIconWrapper>
        </Box>
        {chartComponent && (
          <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            {chartComponent}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
