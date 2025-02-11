import { useState } from "react";

import Modal from "@/components/Modal";
import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/types/product";
import { PageProps } from "@/types/pageProps";
import { ModalAction } from "@/types/modal";

import {
  Box,
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
import { set } from "mongoose";

export default function Products({ userData }: PageProps) {
  const [productsToShow, setProductsToShow] = useState<IProduct[]>([
    ...userData?.products.slice().sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }),
  ]);
  const [sorted, setSorted] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" >("asc");
  const [selectedProduct, setSelectedProduct] = useState(productsToShow[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const modalActions: ModalAction[] = [
    {
      label: "Close",
      variant: "contained",
      onClick: () => setModalOpen(false),
      startIcon: <CloseIcon />,
    },
  ];

  function handleProductClick(product: IProduct) {
    setSelectedProduct(product);
    setModalOpen(true);
  }

  function handleSort() {
    setSorted(true);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    const sortedProducts = productsToShow.slice().sort((a, b) => {
      const ratingA = a.user_rating ?? 0;
      const ratingB = b.user_rating ?? 0;
      return sortDirection === "asc" ? ratingA - ratingB : ratingB - ratingA;
    });
    setProductsToShow(sortedProducts) ;
  }

  if (!productsToShow || productsToShow.length === 0) {
    return <Typography>Keine Produkte vorhanden</Typography>;
  }

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        My Products
      </Typography>
      <Paper>
        <TableContainer sx={{ maxHeight: "calc(100vh - 200px)" }}>
          <Table size="small" aria-label="Products table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>
                  User Rating
                  <TableSortLabel
                    active={sorted}
                    direction={sortDirection}
                    onClick={handleSort}
                  />
                </TableCell>
                <TableCell>User Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsToShow.map((product) => (
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
                  <TableCell>{product.user_note}</TableCell>
                </TableRow>
              ))}
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
