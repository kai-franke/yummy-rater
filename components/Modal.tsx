import { ModalProps } from "@/types/modal";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export default function Modal({
  open,
  onClose,
  title,
  children,
  actions = [],
}: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      aria-label={title || "Dialog"}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            variant={action.variant}
            color={action.color}
            startIcon={action.startIcon}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
}
