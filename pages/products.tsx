import { useMemo, useState } from "react";
import Fuse from "fuse.js";

import { PageProps } from "@/types/pageProps";
import { IProduct } from "@/types/product";
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
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from "next/router";

export default function Products({ userData }: PageProps) {
  const allProducts = useMemo(() => {
    return userData?.products.toSorted((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [userData]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [filterTerm, setFilterTerm] = useState("");
  const router = useRouter();

  const modalOpen = !!selectedProduct; // converts selectedProduct to a boolean value
  const modalActions: ModalAction[] = [
    {
      label: "Edit",
      variant: "contained",
      onClick: () => {
        if (selectedProduct)
          router.push(`/product/${selectedProduct.ean}/edit`);
      },
      startIcon: <EditIcon />,
    },
    {
      label: "Close",
      variant: "contained",
      onClick: () => setSelectedProduct(null),
      startIcon: <CloseIcon />,
    },
  ];
  const theme = useTheme(); // if no ThemeProvider is defined in the project, it uses the default theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // isMobile is true if screen width < 600px (because standard breakpoint for "sm" is 600px,
  // "breakpoints.down" generates a media query string meaning "max-width: 600px")

  const columnVisibilityModel = {
    image: true,
    name: true,
    brand: !isMobile,
    user_rating: true,
    user_note: !isMobile,
  };

  const fuse = useMemo(() => {
    return new Fuse(allProducts, {
      keys: ["name", "brand", "ean", "description", "user_note"],
      threshold: 0.3, // Je niedriger der Wert, desto strenger die Suche
    });
  }, [allProducts]);
  // useMemo is used here to prevent the creation of a new instance of Fuse on every render

  const displayedProducts = useMemo(() => {
    return filterTerm
      ? fuse.search(filterTerm).map((result) => result.item)
      : allProducts;
  }, [filterTerm, allProducts, fuse]);

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

  const handleRowClick = (params: GridRowParams) => {
    setSelectedProduct(params.row.product);
  };

  if (!allProducts || allProducts.length === 0) {
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
            autoPageSize
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
        onClose={() => setSelectedProduct(null)}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {modalOpen && <ProductCard product={selectedProduct} />}
        </Box>
      </Modal>
    </>
  );
}
