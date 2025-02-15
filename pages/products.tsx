import { useEffect, useState } from "react";
import Fuse from "fuse.js";

import Modal from "@/components/Modal";
import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/types/product";
import { PageProps } from "@/types/pageProps";
import { ModalAction } from "@/types/modal";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TableCell,
  TableRow,
  TableSortLabel,
  TextField,
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
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import ClearIcon from "@mui/icons-material/Clear";

export default function Products({ userData }: PageProps) {
  const initialProducts = userData?.products || [];
  const [displayedProducts, setDisplayedProducts] =
    useState<IProduct[]>(initialProducts);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IProduct;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });
  const [selectedProduct, setSelectedProduct] = useState(displayedProducts[0]);
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

  useEffect(() => {
    sortProducts(sortConfig.key, sortConfig.direction);
  }, [displayedProducts]);

  function sortProducts(key: keyof IProduct, direction: "asc" | "desc") {
    const sortedProducts = [...displayedProducts].sort((a, b) => {
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
    setDisplayedProducts(sortedProducts);
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

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        My Products
      </Typography>

      <Paper>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", padding: 1 }}
        >
          <TextField
            sx={{ my: 1, minWidth: "50%" }}
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
          <Button
            onClick={() => handleSort("createdAt", "desc")}
            disabled={sortConfig.key === "createdAt"}
            size="small"
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
              {!displayedProducts || displayedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <SearchOffIcon color="disabled" fontSize="large" />
                    <Typography variant="body1" gutterBottom>
                      No products found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedProducts.map((product) => (
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
