import CryptoJS from "crypto-js";
import { TextField, Modal } from "@mui/material";
import { useState } from "react";

export const PasscodeInput = (props) => {
  const { isLoginPassOpen, setIsLoginPassOpen } = props;
  const [formattedValue, setFormattedValue] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    // Remove any non-numeric characters
    const newValue = value.replace(/\D/g, "");
    if (newValue.length === 4) {
      loginSubmit(CryptoJS.MD5(newValue).toString());
    }
    // Format the input with dash separators
    const formatted = newValue.replace(/(\d{1})/g, "$1-").slice(0, 7);
    setFormattedValue(formatted);
  };

  const handleClose = () => {
    setIsLoginPassOpen(false);
  };

  const loginSubmit = (passkey) => {
    const url = `${window._env_.CODE_SNIPPETS_BACKEND}/login`;
    const requestBody = {
      passkey: passkey,
    };
    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };

    fetch(url, options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          const { resource } = data;
          localStorage.setItem("resource", resource);
          setFormattedValue("");
          setIsLoginPassOpen(false);
        }
      })
      .catch((error) => {
        console.error("Error occured while login", error);
      });
  };

  return (
    <div>
      <Modal open={isLoginPassOpen} onClose={handleClose} aria-labelledby="formatted-textfield-modal" aria-describedby="formatted-textfield-modal-description">
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            boxShadow: 24,
            p: 4,
          }}
        >
          <div className="login-modal-root">
            <div>Enter Passkey to Login</div>
            <TextField
              label=""
              value={formattedValue}
              onChange={handleChange}
              variant="outlined"
              autoComplete="off"
              // fullWidth
              InputProps={{
                inputProps: {
                  maxLength: 7,
                },
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
