import {
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
  CardActions,
  Button,
  Box,
  TextField,
  InputAdornment,
  Snackbar,
  SnackbarContent,
  useTheme,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import Scanner from "@/components/Scanner";
import { ModalProps } from "@/types/modal";
import { useState } from "react";
import { PageProps } from "@/types/pageProps";
import { useRouter } from "next/router";
import ProductCard from "@/components/ProductCard";
import Modal from "@/components/Modal";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import DeleteIcon from "@mui/icons-material/Delete";

type Mode = "idle" | "scanning" | "manual";

export default function Home({ userData }: PageProps) {
  const [mode, setMode] = useState<Mode>("idle");
  const [modal, setModal] = useState<ModalProps>({
    open: false,
    onClose: () => {},
    title: "",
    children: <></>,
    actions: [],
  });
  const router = useRouter();
  const isScanning = mode === "scanning"; // creates a boolean based on the mode useState
  const isManual = mode === "manual";
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const theme = useTheme();
  // Delete product hook with callbacks
  const deletion = useDeleteProduct({
    onSuccess: (deletedProduct) => {
      setModal((prev) => ({ ...prev, open: false }));
      setSnackbarMessage(
        `Product "${deletedProduct.name}" deleted successfully`
      );
      setSnackbarOpen(true);
    },
    onError: () => {
      setSnackbarMessage("Error deleting product");
      setSnackbarOpen(true);
    },
  });

  function handleResult(ean: string) {
    setMode("idle"); // stop scanning after a successful scan
    checkEAN(ean);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    handleResult(data.ean as string);
  }

  function checkEAN(ean: string) {
    const existingProduct = userData?.products.find(
      (product) => product.ean === Number(ean)
    );
    if (existingProduct) {
      setModal({
        open: true,
        onClose: () => setModal((prev) => ({ ...prev, open: false })),
        title: "Product Details",
        children: (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ProductCard product={existingProduct} />
          </Box>
        ),
        actions: [
          {
            label: "Delete",
            variant: "outlined",
            color: "error",
            startIcon: <DeleteIcon />,
            onClick: () => deletion.askDelete(existingProduct),
          },
          {
            label: "Edit",
            onClick: () => {
              setModal((prev) => ({ ...prev, open: false }));
              router.push(`/product/${existingProduct.ean}/edit`);
            },
            variant: "outlined",
            startIcon: <EditIcon />,
          },
          {
            label: "Close",
            onClick: () => {
              setModal((prev) => ({ ...prev, open: false }));
            },
            variant: "contained",
            color: "primary",
            startIcon: <CloseIcon />,
          },
        ],
      });
    } else {
      // Check if product data is available at API happens in /product/[ean]/add
      setModal({
        open: true,
        onClose: () => setModal((prev) => ({ ...prev, open: false })),
        title: "Product Not Found in Your Yummies",
        children: (
          <>
            <SentimentVeryDissatisfiedIcon fontSize="large" />
            <Typography>
              This product isn’t in your Yummies yet. Want to add it?
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.500", mt: 1 }}>
              EAN: {ean}
            </Typography>
          </>
        ),
        actions: [
          {
            label: "Cancel",
            onClick: () => {
              setModal((prev) => ({ ...prev, open: false }));
            },
            variant: "outlined",
          },
          {
            label: "Add Product",
            onClick: () => {
              setModal((prev) => ({ ...prev, open: false }));
              router.push(`/product/${ean}/add`);
            },
            variant: "contained",
            color: "primary",
          },
        ],
      });
    }
  }

  return (
    <>
      <Stack spacing={5}>
        <Card
          sx={{
            borderRadius: 4,
            p: 2,
            backgroundImage: "url('/yummy-rater_card_background_star.jpg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right bottom",
            backgroundSize: "cover",
          }}
        >
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              Get started
            </Typography>
            <Typography variant="body2">
              {`It looks like you don't have any Yummies yet. Start by scanning a
              product and then add it to your Yummies.`}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <IconButton
              sx={{
                width: 60,
                height: 60,
                "& .MuiSvgIcon-root": {
                  fontSize: 35, // Icon-Größe
                },
              }}
              onClick={() =>
                document
                  .getElementById("scan-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              color="primary"
              aria-label="jump to scan"
            >
              <ArrowDownwardIcon />
            </IconButton>
          </CardActions>
        </Card>
        <Card
          id="scan-section"
          sx={{
            borderRadius: 4,
            p: 2,
            backgroundColor: "secondary.main",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Scan a product
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {`Scan a barcode or enter an article number to find it in your rated products or add it to your collection.`}
            </Typography>
            <Scanner onScan={handleResult} isScanning={isScanning} />
            <CardActions disableSpacing sx={{ flexDirection: "column", p: 0 }}>
              <Button
                disabled={isManual}
                variant="contained"
                color="primary"
                onClick={() => setMode(isScanning ? "idle" : "scanning")}
                sx={{ mt: 2, width: "100%", maxWidth: "640px", mr: 0 }}
              >
                {isScanning ? "Stop Scanning" : "Start Scanning"}
              </Button>
              {!isManual ? (
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={isScanning}
                  onClick={() => setMode("manual")}
                  sx={{ mt: 1, width: "100%", maxWidth: "640px" }}
                >
                  Enter article number
                </Button>
              ) : (
                <Box
                  component="form"
                  sx={{ width: "100%", maxWidth: "640px" }}
                  onSubmit={handleSubmit}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                    mt={1.5}
                  >
                    <TextField
                      autoFocus
                      name="ean"
                      sx={{ width: "100%" }}
                      label="Article Number"
                      placeholder="e.g., 43879528"
                      helperText="Enter a EAN or UPC Number"
                      variant="outlined"
                      size="small"
                      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              aria-label="Clear"
                              onClick={() => {
                                setMode("idle");
                              }}
                              edge="end"
                            >
                              <ClearIcon
                                sx={{
                                  fontSize:
                                    "1.25rem" /* Reduce IconButton size */,
                                }}
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <IconButton
                      aria-label="Submit article number"
                      type="submit"
                      color="primary"
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </Stack>
                </Box>
              )}
            </CardActions>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}></CardActions>
        </Card>
        <Card
          sx={{
            borderRadius: 4,
            p: 2,
            backgroundColor: "#EFEBE9",
          }}
        >
          <CardContent>
            <StarOutlineIcon fontSize="large" />
            <Typography variant="h6" component="h3" gutterBottom>
              My Yummies
            </Typography>
            <Typography variant="body2">
              {`View and manage the foods you've rated and want to remember.`}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button
              href="/products"
              variant="outlined"
              color="primary"
              sx={{ width: "100%", maxWidth: "640px" }}
            >
              Go to your rated products
            </Button>
          </CardActions>
        </Card>
      </Stack>
      <Modal
        open={modal.open}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
        title={modal.title ?? undefined}
        actions={modal.actions}
      >
        {modal.children}
      </Modal>
      <DeleteConfirmModal
        open={deletion.open}
        product={deletion.productToDelete}
        loading={deletion.loading}
        onCancel={deletion.cancelDelete}
        onConfirm={deletion.confirmDelete}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <SnackbarContent
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: "black",
          }}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setSnackbarOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>
    </>
  );
}
