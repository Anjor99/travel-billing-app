import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CreateBill from "./pages/Bills/CreateBill/CreateBill";
import BillsList from "./pages/Bills/BillsList/BillsList";
import ViewBill from "./pages/Bills/ViewBill/ViewBill";
import Navbar from "./components/Navbar/Navbar";
import Layout from "./components/Layout/Layout";
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

        {/* Protected Routes */}

        <Route
          path="/create-bill"
          element={

            <ProtectedRoute>

              <Layout>

                <CreateBill />

              </Layout>

            </ProtectedRoute>

          }
        />

        <Route
          path="/bills"
          element={

            <ProtectedRoute>

              <Layout>

                <BillsList />

              </Layout>

            </ProtectedRoute>

          }
        />

        <Route
          path="/bills/:id"
          element={

            <ProtectedRoute>

              <Layout>

                <ViewBill />

              </Layout>

            </ProtectedRoute>

          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;