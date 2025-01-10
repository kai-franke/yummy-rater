import Modal, { ModalAction } from "@/components/Modal";
import { Button, Typography } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const actions: ModalAction[] = [
    {
      label: "Abbrechen",
      onClick: () => setModalOpen(false),
      variant: "text",
      color: "secondary",
    },
    {
      label: "Speichern",
      onClick: () => {
        /* speichern */ setModalOpen(false);
      },
      variant: "contained",
      color: "primary",
    },
  ];

  return (
    <>
      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Test Modal"
          actions={actions}
          content={<p>Hier kann beliebiger Inhalt stehen</p>}
        ></Modal>
      )}
      <Typography variant="h5" component="h2" gutterBottom>
        Home
      </Typography>
      <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
    </>
  );
}
