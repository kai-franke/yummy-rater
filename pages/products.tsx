import { useEffect, useState } from "react";

import Modal from "@/components/Modal";
import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/types/product";
import { PageProps } from "@/types/pageProps";
import { ModalAction } from "@/types/modal";

import {
  Box,
  Button,
  Paper,
  TableCell,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import CloseIcon from "@mui/icons-material/Close";
import SearchOffIcon from "@mui/icons-material/SearchOff";

export default function Products({ userData }: PageProps) {
  const initialProducts = userData?.products || [];
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IProduct;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const modalActions: ModalAction[] = [
    {
      label: "Close",
      variant: "contained",
      onClick: () => setModalOpen(false),
      startIcon: <CloseIcon />,
    },
  ];

  // initiale Sortierung nach Erstellungsdatum
  useEffect(() => {
    sortProducts("createdAt", "desc");
  }, []);

  function sortProducts(key: keyof IProduct, direction: "asc" | "desc") {
    const sortedProducts = [...products].sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      if (valA instanceof Date && valB instanceof Date) {
        valA = valA.getTime();
        valB = valB.getTime();
      } else {
        valA = typeof valA === "string" ? valA?.toLowerCase() ?? "" : valA ?? 0;
        valB = typeof valB === "string" ? valB?.toLowerCase() ?? "" : valB ?? 0;
      }

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setProducts(sortedProducts);
  }

  function handleSort(key: keyof IProduct, direction?: "asc" | "desc") {
    const newDirection =
      direction || (sortConfig.key === key && sortConfig.direction === "asc")
        ? "desc"
        : "asc";
    setSortConfig({ key, direction: newDirection });
    sortProducts(key, newDirection);
  }

  function handleProductClick(product: IProduct) {
    setSelectedProduct(product);
    setModalOpen(true);
  }

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        My Products
      </Typography>

      <Paper>
        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: 1 }}>
          <Button
            onClick={() => handleSort("createdAt", "desc")}
            disabled={sortConfig.key === "createdAt"}
          >
            Default Sorting
          </Button>
        </Box>
        <TableContainer sx={{ maxHeight: "calc(100vh - 200px)" }}>
          <Table size="small" aria-label="Products table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === "name"}
                    direction={
                      sortConfig.key === "name" ? sortConfig.direction : "asc"
                    }
                    onClick={() => handleSort("name")}
                  >
                    Product Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === "brand"}
                    direction={
                      sortConfig.key === "brand" ? sortConfig.direction : "asc"
                    }
                    onClick={() => handleSort("brand")}
                  >
                    Brand
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === "user_rating"}
                    direction={
                      sortConfig.key === "user_rating"
                        ? sortConfig.direction
                        : "asc"
                    }
                    onClick={() => handleSort("user_rating")}
                  >
                    User Rating{" "}
                  </TableSortLabel>
                </TableCell>
                <TableCell>User Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!products || products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <SearchOffIcon color="disabled" fontSize="large" />
                    <Typography variant="body1" gutterBottom>
                      No products found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.ean}
                    onClick={() => handleProductClick(product)}
                    hover
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      <Avatar
                        src={product.image}
                        alt={product.name}
                        variant="rounded"
                      >
                        <ImageNotSupportedIcon />
                      </Avatar>
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>
                      <Tooltip title={product.user_rating} followCursor>
                        <Box sx={{ display: "inline-block" }}>
                          <Rating
                            precision={0.5}
                            value={product.user_rating}
                            readOnly
                          />
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: "250px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.user_note}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          actions={modalActions}
          title="Product Details"
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
