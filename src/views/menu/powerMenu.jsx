import * as React from "react";
import IconButton from "@mui/material/IconButton";
import { Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import { PasscodeInput } from "passcode-input";

export default function PowerMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [isLoginPassOpen, setIsLoginPassOpen] = React.useState(false);

  const resource = localStorage.getItem("resource");

  const handleClick = (event) => {
    setOpen((prev) => !prev);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (action) => {
    if (action === "login") {
      setIsLoginPassOpen((prev) => !prev);
      setOpen((prev) => !prev);
    } else if (action === "logout") {
      localStorage.removeItem("resource");
      /* deleting cookie */
      logoutSubmit();
      setOpen(false);
    } else {
      setOpen((prev) => !prev);
      setAnchorEl(null);
    }
  };
  const logoutSubmit = () => {
    const url = `${window._env_.CODE_SNIPPETS_BACKEND}/login`;
    const options = {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(url, options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          setIsLoginPassOpen(false);
        }
      })
      .catch((error) => {
        console.error("Error occured while logout", error);
      });
  };

  return (
    <div className="admin-menu-root">
      <IconButton aria-label="more" id="long-button" aria-controls={open ? "long-menu" : undefined} aria-expanded={open ? "true" : undefined} aria-haspopup="true" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        className="admin-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {resource ? (
          <MenuItem key="login" onClick={() => handleClose("logout")}>
            <LogoutRoundedIcon />
            Logout
          </MenuItem>
        ) : (
          <MenuItem key="login" onClick={() => handleClose("login")}>
            <LoginRoundedIcon />
            Login
          </MenuItem>
        )}
        {/* <MenuItem key="label" onClick={handleClose}>
            <SettingsApplicationsRoundedIcon />
            Labels Config
          </MenuItem> */}
        <MenuItem key="label" onClick={() => handleClose()}>
          <SettingsApplicationsRoundedIcon />
          Labels Color Config
        </MenuItem>
      </Menu>

      <PasscodeInput isLoginPassOpen={isLoginPassOpen} setIsLoginPassOpen={setIsLoginPassOpen} />
    </div>
  );
}
