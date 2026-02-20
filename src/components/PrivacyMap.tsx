import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

const PrivacyMap = () => {
  const [showMap, setShowMap] = useState(false);

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "500px" }, // same as iframe width
        height: "450px", // same height
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#ccc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!showMap ? (
        <>
          <img
            src={"mappreview.png"} // local static preview image fdrom public folder
            alt="Map preview"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              bottom: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              background: "rgba(0,0,0,0.5)",
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
            }}
          >
            Clicking "Show Map" loads Google Maps, which may set cookies.
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => setShowMap(true)}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "9999px",
              padding: "0.75rem 1.5rem",
              fontWeight: "bold",
            }}
          >
            Show Map
          </Button>
        </>
      ) : (
        <iframe
          title="Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d971.446641685806!2d24.447727009582213!3d46.4751227644953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474bc71d28039119%3A0xd4ce147438af6822!2sWaste%20Powertech!5e0!3m2!1sen!2sro!4v1760514130638!5m2!1sen!2sro"
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0 }}
          allowFullScreen
        />
      )}
    </Box>
  );
};

export default PrivacyMap;
