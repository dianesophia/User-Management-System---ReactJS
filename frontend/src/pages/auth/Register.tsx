import { useState } from "react";
import { AuthService } from "../../services/auth.service";
import { authStore } from "../../auth/auth.store";
import { useNavigate, Link } from "react-router-dom";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import logo from '../../assets/logo.png';
import { Eye, EyeOff } from "lucide-react"; 

type Gender = "male" | "female" | "other";

interface RegisterForm {
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  phoneNumber: string;
  address: string;
  password: string;
  confirmPassword: string;
}

interface RegisterErrors {
  [key: string]: string;
}

export const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    email: "",
    firstName: "",
    lastName: "",
    gender: "male",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = (): RegisterErrors => {
    const newErrors: RegisterErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = form.email.trim();
    const trimmedFirstName = form.firstName.trim();
    const trimmedLastName = form.lastName.trim();
    const trimmedAddress = form.address.trim();
    const trimmedPassword = form.password.trim();
    const trimmedConfirmPassword = form.confirmPassword.trim();

    if (!trimmedEmail) newErrors.email = "Email is required";
    else if (!emailRegex.test(trimmedEmail)) newErrors.email = "Invalid email address";

    if (!trimmedFirstName) newErrors.firstName = "First name is required";
    if (!trimmedLastName) newErrors.lastName = "Last name is required";
    if (!trimmedAddress) newErrors.address = "Address is required";

    if (!trimmedPassword) {
      newErrors.password = "Password is required";
    } else if (trimmedPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])/.test(trimmedPassword)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(trimmedPassword)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(trimmedPassword)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/(?=.*[@$!%*?&#])/.test(trimmedPassword)) {
      newErrors.password = "Password must contain at least one special character (@$!%*?&#)";
    }

    if (!trimmedConfirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (trimmedPassword !== trimmedConfirmPassword) newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const register = async () => {
    setErrors({});
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        gender: form.gender,
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
        password: form.password.trim(),
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

          {/* Password Field with Eye */}
          <div className="relative">
            <Label htmlFor="password" className="block mb-1 font-medium text-gray-700 text-sm">Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Min 8 chars (A-Z, a-z, 0-9, special char)"
              value={form.password}
              onChange={onChange}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition ${errors.password ? "border-red-500" : "border-gray-300"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="relative">
            <Label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700 text-sm">Confirm Password</Label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={onChange}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
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
