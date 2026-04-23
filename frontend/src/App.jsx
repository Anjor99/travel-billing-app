import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CreateBill from "./pages/Bills/CreateBill/CreateBill";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Login */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* Register */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Route */}

        <Route
          path="/create-bill"
          element={
            <ProtectedRoute>

              <CreateBill />

            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;