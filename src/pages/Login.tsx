
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    // Demo login logic (in a real app, this would validate against a backend)
    if (email === "admin@gmail.com" && password === "admin") {
      // Store user info in localStorage (in a real app, you would store a token)
      localStorage.setItem("userEmail", email);
      localStorage.setItem("username", "Admin User");
      toast.success("Logged in as Admin");
      navigate("/"); // Redirect to dashboard after login
    } else if (email === "user@example.com" && password === "user") {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("username", "Regular User");
      toast.success("Logged in successfully");
      navigate("/"); // Redirect to dashboard after login
    } else {
      // For demo purposes, allow any login
      localStorage.setItem("userEmail", email);
      localStorage.setItem("username", "User");
      toast.success("Logged in successfully");
      navigate("/"); // Redirect to dashboard after login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#6366F1] text-white p-2 rounded-lg hover:bg-[#6366F1]/90"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/register" className="text-sm text-[#6366F1] hover:underline">
            Don't have an account? Register
          </Link>
        </div>
        <div className="mt-2 text-center">
          <Link to="/forgot-password" className="text-sm text-[#6366F1] hover:underline">
            Forgot Password?
          </Link>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Admin:</strong> admin@gmail.com / admin</p>
            <p><strong>Regular User:</strong> user@example.com / user</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
