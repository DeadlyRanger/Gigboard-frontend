import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gigs from "./pages/Gigs";
import CreateGig from "./pages/CreateGig";
import MyGigs from "./pages/MyGigs";
import MyBids from "./pages/MyBids";
import GigDetails from "./pages/GigDetails";
import GigBids from "./pages/GigBids";
import Dashboard from "./pages/Dashboard"; 
import ClientDashboard from "./pages/ClientDashboard";
import NotFound from "./pages/NotFound"; // ✅ Added NotFound page

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Gigs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gigs/:gigId" element={<GigDetails />} />

          {/* Protected Routes - Freelancer/General */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bids"
            element={
              <ProtectedRoute>
                <MyBids />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Client/Employer */}
          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-gig"
            element={
              <ProtectedRoute>
                <CreateGig />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-gigs"
            element={
              <ProtectedRoute>
                <MyGigs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gigs/:gigId/bids"
            element={
              <ProtectedRoute>
                <GigBids />
              </ProtectedRoute>
            }
          />

          {/* ✅ 404 Catch-All Route */}
          {/* This must always be the last route in the list */}
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;