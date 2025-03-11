import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ForgotPasswordPage = () => {
const [email, setEmail] = useState("");
const navigate = useNavigate();

const handleSubmit = (e) => {
    e.preventDefault();
    // Add forgot password logic here (e.g., API call)
    console.log("Reset password for:", email);
    navigate("/login"); // Redirect to Login Page after submission
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Forgot Password</h1>
        <h1 className="text-2x1 text-sm mb-1 text-center text-gray-400">Please enter the email address you'd like your password reset information sent to</h1>
        <form onSubmit={handleSubmit} className="space-y-2">
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
            placeholder="123asbcd@gmail.com"
            required
            />
        </div>
        <button
            type="submit"
            className="w-full bg-[#6366F1] text-white p-2 rounded-lg hover:bg-[#6366F1]/90">
            Submit
        </button>
        </form>
        <div className="mt-4 text-center">
        <Link to="/login" className="text-sm text-[#6366F1] hover:underline">
            Back to Login
        </Link>
        </div>
    </div>
    </div>
);
};

export default ForgotPasswordPage;