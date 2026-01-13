import Modal from "@/components/Modal";
import { Typography, Box } from "@mui/material";
import { IProduct } from "@/types/product";

type Props = {
  open: boolean;
  product: IProduct | null;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({
  open,
  product,
  isLoading,
  onCancel,
  onConfirm,
}: Props) {
  if (!product) return null;

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Confirm Deletion"
      actions={[
        {
          label: "Cancel",
          variant: "outlined",
          onClick: onCancel,
        },
        {
          label: "Delete",
          variant: "contained",
          color: "error",
          onClick: onConfirm,
          disabled: isLoading,
        },
      ]}
    >
      <Typography>
        Do you really want to delete the product{" "}
        <Box
          component="span"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          {product?.name}
        </Box>{" "}
        permanently?
      </Typography>
      <Typography color="error.main" mt={1}>
        This action cannot be undone.
      </Typography>
    </Modal>
  );
}
