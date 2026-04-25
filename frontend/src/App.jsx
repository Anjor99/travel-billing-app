import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CreateBill from "./pages/Bills/CreateBill/CreateBill";
import BillsList from "./pages/Bills/BillsList/BillsList";
import ViewBill from "./pages/Bills/ViewBill/ViewBill";
import EditBill from "./pages/Bills/EditBill/EditBill";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ResetPassword from "./pages/Auth/ResetPassword";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Settings from "./pages/Settings/Settings";
import Navbar from "./components/Navbar/Navbar";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./utils/ProtectedRoute";
import { AlertProvider } from "./context/AlertContext";

function App() {

  return (

    <AlertProvider>
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

          <Route
            path="/verify-email"
            element={<VerifyEmail />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
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

          <Route
            path="/bills/:id/edit"
            element={

              <ProtectedRoute>

                <Layout>

                  <EditBill />

                </Layout>

              </ProtectedRoute>

            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />

        </Routes>

      </BrowserRouter>
    </AlertProvider>

  );

}

export default App;