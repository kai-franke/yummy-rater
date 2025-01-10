import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
  color?:
    | "primary"
    | "secondary"
    | "inherit"
    | "success"
    | "error"
    | "info"
    | "warning";
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  content?: React.ReactNode;
  actions?: ModalAction[];
}

export default function Modal({
  open,
  onClose,
  title,
  content,
  actions = [],
}: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="modal-title"
    >
      {title && <DialogTitle id="modal-title">{title}</DialogTitle>}
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            variant={action.variant}
            color={action.color}
          >
            {action.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
}
