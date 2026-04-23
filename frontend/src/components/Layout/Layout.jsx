import Navbar from "../Navbar/Navbar";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

function Layout({ children }) {

  return (

    <Box>

      {/* Fixed Navbar */}

      <Navbar />

      {/* Spacer — prevents overlap */}

      <Toolbar />

      {/* Page Content */}

      <Box sx={{ p: 2 }}>

        {children}

      </Box>

    </Box>

  );

}

export default Layout;