import { useState } from "react";

import { PageProps } from "@/types/pageProps";
import { ModalAction } from "@/types/modal";
import Modal from "@/components/Modal";
import ProductCard from "@/components/ProductCard";

import {
  Avatar,
  Box,
  Paper,
  Rating,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
  GridRenderCellParams,
  GridRowParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import CloseIcon from "@mui/icons-material/Close";

export default function Products({ userData }: PageProps) {
  const allProducts = userData?.products.toSorted((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
  const [selectedProduct, setSelectedProduct] = useState(allProducts[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const modalActions: ModalAction[] = [
    {
      label: "Close",
      variant: "contained",
      onClick: () => setModalOpen(false),
      startIcon: <CloseIcon />,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "",
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        console.log(params),
        (
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
        )
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
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value} followCursor>
          <Box sx={{ display: "inline-block" }}>
            <Rating precision={0.5} value={params.value} readOnly />
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

  const rows: GridRowsProp = allProducts.map((product) => ({
    id: product.ean,
    image: product.image,
    name: product.name,
    brand: product.brand,
    user_rating: product.user_rating,
    user_note: product.user_note,
    product, // speichert zusätzlich das gesamte Produkt als Objekt
  }));

  const handleRowClick = (params: GridRowParams) => {
    setSelectedProduct(params.row.product);
    setModalOpen(true);
  };

  if (!allProducts || allProducts.length === 0) {
    return <Typography>Keine Produkte vorhanden</Typography>;
  }

  return (
    <>
      <Typography variant="h5" component="h2">
        My Products
      </Typography>
      <Paper>
        <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={80}
            onRowClick={handleRowClick}
            disableColumnMenu // hides three-dots-menu in column header
          />
        </Box>
      </Paper>
      {modalOpen && (
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
      )}
    </>
  );
}
