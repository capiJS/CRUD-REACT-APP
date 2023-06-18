import React from "react";
import { Box, Button, Typography } from "@mui/material";

const DeleteModal = ({ handleCloseModal, borrarProducto, selected }) => {
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
      onClick={handleBackdropClick}
    >
      <Box
        sx={{
          p: 3,
          backgroundColor: "#FFF",
          borderRadius: 4,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Confirmación Borrado
        </Typography>
        <Typography variant="body1" gutterBottom>
          Esta seguro de borrar este item?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="outlined" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => borrarProducto(selected)}
            sx={{ ml: 2 }}
          >
            Borrar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DeleteModal;
