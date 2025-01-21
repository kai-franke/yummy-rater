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