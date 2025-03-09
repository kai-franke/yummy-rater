import { useEffect, useState } from "react";

import { PageProps } from "@/types/pageProps";
import { ModalAction } from "@/types/modal";
import Modal from "@/components/Modal";
import ProductCard from "@/components/ProductCard";

import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Rating,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import ClearIcon from "@mui/icons-material/Clear";
import Fuse from "fuse.js";

export default function Products({ userData }: PageProps) {
  const initialProducts = userData?.products.toSorted((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
  const [displayedProducts, setDisplayedProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(initialProducts[0]);
  const [filterTerm, setFilterTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const modalActions: ModalAction[] = [
    {
      label: "Close",
      variant: "contained",
      onClick: () => setModalOpen(false),
      startIcon: <CloseIcon />,
    },
  ];
  const theme = useTheme(); // if no ThemeProvider is defined in the project, it uses the default theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // isMobile is true if screen width < 600px (because standard breakpoint for "sm" is 600px,
  // "breakpoints.down" generates a media query string meaning "max-width: 600px")

  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "",
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Avatar
            src={params.value}
            alt={params.row.name}
            variant="rounded"
            sx={{ width: 60, height: 60 }}
          >
            <ImageNotSupportedIcon />
          </Avatar>
        </Box>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: "name",
      headerName: "Product Name",
      flex: 0.5,
    },
    {
      field: "brand",
      headerName: "Brand",
      flex: 0.35,
    },
    {
      field: "user_rating",
      headerName: "User Rating",
      width: isMobile ? 130 : 140,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value} followCursor>
          <Box sx={{ display: "inline-block" }}>
            <Rating
              precision={0.5}
              value={params.value}
              readOnly
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        </Tooltip>
      ),
      filterable: false,
    },
    {
      field: "user_note",
      headerName: "User Note",
      flex: 1,
      sortable: false,
    },
  ];

  const rows: GridRowsProp = displayedProducts.map((product) => ({
    id: product.ean,
    image: product.image,
    name: product.name,
    brand: product.brand,
    user_rating: product.user_rating,
    user_note: product.user_note,
    product, // saves additionally the complete product object in order to access it in handleRowClick for the product card.
  }));

  // define the visibility of the columns
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    image: true,
    name: true,
    brand: true,
    user_rating: true,
    user_note: true,
  });

  // re-run the effect when isMobile changes and update the visibility of the columns
  useEffect(() => {
    setColumnVisibilityModel((prev) => ({
      ...prev,
      brand: !isMobile,
      user_note: !isMobile,
    }));
  }, [isMobile]);

  // Filter products by search term
  useEffect(() => {
    if (!filterTerm) {
      setDisplayedProducts(initialProducts);
    } else {
      const fuse = new Fuse(initialProducts, {
        keys: ["name", "brand", "ean", "description", "user_note"],
        threshold: 0.3, // Je niedriger der Wert, desto strenger die Suche
      });

      const results = fuse.search(filterTerm);

      setDisplayedProducts(results.map((result) => result.item));
    }
  }, [filterTerm]);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedProduct(params.row.product);
    setModalOpen(true);
  };

  if (!initialProducts || initialProducts.length === 0) {
    return <Typography>No products</Typography>;
  }

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        My Products
      </Typography>
      <Paper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            padding: 1,
          }}
        >
          <TextField
            sx={{ my: 1, minWidth: isMobile ? "100%" : 320 }}
            label="Filter"
            placeholder="e.g. Applepie or 4478738324"
            variant="outlined"
            size="small"
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {filterTerm ? (
                    <FilterAltIcon fontSize="small" />
                  ) : (
                    <FilterAltOffIcon fontSize="small" color="disabled" />
                  )}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setFilterTerm("")} size="small">
                    {<ClearIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box
          sx={{
            height: "calc(100vh - 270px)",
            width: "100%",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={80}
            onRowClick={handleRowClick}
            disableColumnMenu // hides three-dots-menu in column header
            columnVisibilityModel={columnVisibilityModel}
          />
        </Box>
      </Paper>
      {/* Modal doesn't need an extra condition because it has its own "open" prop that controls its visibility*/}
      <Modal
        title="Product Details"
        open={modalOpen}
        actions={modalActions}
        onClose={() => setModalOpen(false)}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ProductCard product={selectedProduct} />
        </Box>
      </Modal>
    </>
  );
}
