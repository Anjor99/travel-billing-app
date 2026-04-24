import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* MUI */

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";

import Drawer from "@mui/material/Drawer";

import List from "@mui/material/List";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

import ListItemIcon from "@mui/material/ListItemIcon";
import SettingsIcon
  from "@mui/icons-material/Settings";
import ListItemText from "@mui/material/ListItemText";

import Divider from "@mui/material/Divider";

/* Icons */

import MenuIcon from "@mui/icons-material/Menu";

import DescriptionIcon
  from "@mui/icons-material/Description";

import ReceiptLongIcon
  from "@mui/icons-material/ReceiptLong";

import LogoutIcon
  from "@mui/icons-material/Logout";

function Navbar() {

  const navigate = useNavigate();

  const [open, setOpen] =
    useState(false);

  const toggleDrawer =
    (state) => () => {

      setOpen(state);

  };

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };

  return (

    <>

      {/* TOP BAR */}

      <AppBar position="fixed">

        <Toolbar>

          {/* Hamburger */}

          <IconButton
            color="inherit"
            edge="start"
            onClick={
              toggleDrawer(true)
            }
            sx={{ mr: 2 }}
          >

            <MenuIcon />

          </IconButton>

          {/* Title */}

          <Typography
            variant="h6"
            sx={{ flexGrow: 1 }}
          >

            Travel Billing

          </Typography>

        </Toolbar>

      </AppBar>

      {/* DRAWER */}

      <Drawer
        anchor="left"
        open={open}
        onClose={
          toggleDrawer(false)
        }
      >

        <List
          sx={{ width: 250 }}
        >

          {/* Create Bill */}

          <ListItem disablePadding>

            <ListItemButton
              onClick={() => {

                navigate(
                  "/create-bill"
                );

                setOpen(false);

              }}
            >

              <ListItemIcon>

                <DescriptionIcon />

              </ListItemIcon>

              <ListItemText
                primary="Create Bill"
              />

            </ListItemButton>

          </ListItem>

          {/* View Bills */}

          <ListItem disablePadding>

            <ListItemButton
              onClick={() => {

                navigate("/bills");

                setOpen(false);

              }}
            >

              <ListItemIcon>

                <ReceiptLongIcon />

              </ListItemIcon>

              <ListItemText
                primary="View Bills"
              />

            </ListItemButton>

          </ListItem>
          {/* Settings */}

          <ListItem disablePadding>

            <ListItemButton
              onClick={() => {

                navigate("/settings");

                setOpen(false);

              }}
            >

              <ListItemIcon>

                <SettingsIcon />

              </ListItemIcon>

              <ListItemText
                primary="Settings"
              />

            </ListItemButton>

          </ListItem>

          <Divider />

          {/* Logout */}

          <ListItem disablePadding>

            <ListItemButton
              onClick={handleLogout}
            >

              <ListItemIcon>

                <LogoutIcon />

              </ListItemIcon>

              <ListItemText
                primary="Logout"
              />

            </ListItemButton>

          </ListItem>

        </List>

      </Drawer>

    </>

  );

}

export default Navbar;