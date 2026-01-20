import { useState } from "react";
import { AuthService } from "../../services/auth.service";
import { authStore } from "../../auth/auth.store";
import { useNavigate, Link } from "react-router-dom";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import logo from '../../assets/logo.png';

type Gender = "male" | "female" | "other";

export const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    gender: "male" as Gender,
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async () => {
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    // Validation
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.firstName) newErrors.firstName = "First name required";
    if (!form.lastName) newErrors.lastName = "Last name required";
    if (!form.address) newErrors.address = "Address required";
    if (!form.password) newErrors.password = "Password required";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
        phoneNumber: form.phoneNumber,
        address: form.address,
        password: form.password,
      };

      const res = await AuthService.register(payload);
      authStore.setSession(res);
      if (res.user.role === "admin") navigate("/admin");
      else navigate("/user");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-2xl shadow-xl">
      
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-24 h-24 mb-4" />
          <h1 className="text-2xl font-bold text-[#2563EB] mb-1 text-center">Create Account</h1>
          <p className="text-center text-gray-500 text-sm">Fill in your details to register</p>
        </div>

      
        {errors.general && (
          <p className="text-red-600 mb-3 text-sm text-center">{errors.general}</p>
        )}

        <form onSubmit={(e) => { e.preventDefault(); register(); }} className="grid grid-cols-1 md:grid-cols-2 gap-3">
   
          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="email" className="block mb-1 font-medium text-gray-700 text-sm">Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={onChange}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

         
          <div>
            <Label htmlFor="firstName" className="block mb-1 font-medium text-gray-700 text-sm">First Name</Label>
            <Input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={onChange}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
          </div>

       
          <div>
            <Label htmlFor="lastName" className="block mb-1 font-medium text-gray-700 text-sm">Last Name</Label>
            <Input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={onChange}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
          </div>

         
          <div>
            <Label htmlFor="gender" className="block mb-1 font-medium text-gray-700 text-sm">Gender</Label>
            <select
              name="gender"
              value={form.gender}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

        
          <div>
            <Label htmlFor="phoneNumber" className="block mb-1 font-medium text-gray-700 text-sm">Phone Number (optional)</Label>
            <Input
              name="phoneNumber"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition"
            />
          </div>

        
          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="address" className="block mb-1 font-medium text-gray-700 text-sm">Address</Label>
            <Input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={onChange}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition ${errors.address ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
          </div>

       
          <div>
            <Label htmlFor="password" className="block mb-1 font-medium text-gray-700 text-sm">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Password (min 8 chars)"
              value={form.password}
              onChange={onChange}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition ${errors.password ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

         
          <div>
            <Label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700 text-sm">Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={onChange}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-[#2563EB] hover:bg-blue-700 text-white py-2 rounded-md font-semibold text-sm transition disabled:bg-gray-400"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </div>
        </form>

        <p className="text-xs mt-5 text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/" className="text-[#2563EB] font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};
