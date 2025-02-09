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

export default function Products({ userData }: PageProps) {
  const allProducts = userData?.products.slice().sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  }); // useMemo verwenden?
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

  function handleProductClick(product: IProduct) {
    setSelectedProduct(product);
    setModalOpen(true);
  }

  if (!allProducts || allProducts.length === 0) {
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
                <TableCell>User Rating</TableCell>
                <TableCell>User Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allProducts.map((product) => (
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
