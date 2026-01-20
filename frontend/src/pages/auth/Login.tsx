import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import logo from '../../assets/logo.png';

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors: typeof errors = {};
    if (!email) validationErrors.email = "Email is required";
    else if (!emailRegex.test(email)) validationErrors.email = "Invalid email address";

    if (!password) validationErrors.password = "Password is required";
    else if (password.length < 8) validationErrors.password = "Password must be at least 8 characters";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await login({ email, password });
      const role = localStorage.getItem("role");
      if (role === "admin") navigate("/admin");
      else navigate("/user");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-20 h-20 mb-4" />
          <h1 className="text-2xl font-bold text-center text-[#2563EB] mb-1">Welcome Back</h1>
          <p className="text-center text-gray-500 text-sm">Sign in to your account</p>
        </div>

        {errors.general && (
          <p className="text-red-600 mb-3 text-sm text-center">{errors.general}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
       
          <div>
            <Label htmlFor="email" className="block mb-1 font-medium text-gray-700 text-sm">
              Email
            </Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

         
          <div>
            <Label htmlFor="password" className="block mb-1 font-medium text-gray-700 text-sm">
              Password
            </Label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

      
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 bg-[#2563EB] hover:bg-blue-700 text-white py-2 rounded-md font-semibold text-sm transition disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs mt-5 text-center text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#2563EB] font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
