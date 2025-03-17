import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  Grid,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center";
  format?: (value: any) => string | React.ReactNode;
}

export interface Action {
  name: string;
  onClick: (item: any) => void;
  disabled?: (item: any) => boolean;
}

interface DynamicTableProps {
  columns: Column[];
  data: any[];
  actions?: Action[];
  title?: string;
  emptyMessage?: string;
}

export default function DynamicTable({
  columns,
  data,
  actions = [],
  title,
  emptyMessage = "No data found",
}: DynamicTableProps) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, item: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: Action) => {
    if (selectedItem) {
      action.onClick(selectedItem);
    }
    handleMenuClose();
  };

  const open = Boolean(anchorEl);

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
      {title && (
        <Grid
          container
          sx={{
            p: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Grid item>
            <Typography variant="h6" fontWeight="600">
              {title}
            </Typography>
          </Grid>
        </Grid>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell align="right" sx={{ width: 60 }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align || "left"}>
                          {column.format ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                    {actions.length > 0 && (
                      <TableCell align="right">
                        <IconButton
                          aria-label="more"
                          id={`long-button-${index}`}
                          aria-controls={open ? "long-menu" : undefined}
                          aria-expanded={open ? "true" : undefined}
                          aria-haspopup="true"
                          onClick={(e) => handleMenuClick(e, row)}
                          size="small"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.name}
            onClick={() => handleActionClick(action)}
            disabled={action.disabled && selectedItem ? action.disabled(selectedItem) : false}
          >
            {action.name}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
}