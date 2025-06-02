import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Purchases from "./pages/Purchases";
import CreateNewPurchase from "./components/create/CreateNewPurchase";
import EditPurchase from "@/components/EditPurchase";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <QueryClient>
        <AuthProvider>
          <Toaster />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases"
              element={
                <ProtectedRoute>
                  <Purchases />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-new-purchase"
              element={
                <ProtectedRoute>
                  <CreateNewPurchase />
                </ProtectedRoute>
              }
            />
            <Route path="/edit-purchase/:id" element={
              <ProtectedRoute>
                <EditPurchase />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </QueryClient>
    </BrowserRouter>
  );
}

export default App;
