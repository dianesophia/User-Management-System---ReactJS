import { useState } from "react";
import { AuthService } from "../../services/auth.service";
import { authStore } from "../../auth/auth.store";
import { useNavigate, Link } from "react-router-dom";

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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async () => {
    try {
      setError("");

      if (form.password !== form.confirmPassword) {
        return setError("Passwords do not match");
      }

      if (form.password.length < 8) {
        return setError("Password must be at least 8 characters");
      }

      setLoading(true);

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

      // Store session after successful registration
      authStore.setSession(res);

      // Navigate based on role
      if (res.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded w-full max-w-md shadow">
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          value={form.email}
          onChange={onChange}
          required
        />

        <input
          name="firstName"
          placeholder="First Name"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          value={form.firstName}
          onChange={onChange}
          required
        />

        <input
          name="lastName"
          placeholder="Last Name"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          value={form.lastName}
          onChange={onChange}
          required
        />

        <select
          name="gender"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          onChange={onChange}
          value={form.gender}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input
          name="phoneNumber"
          placeholder="Phone Number (optional)"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          value={form.phoneNumber}
          onChange={onChange}
        />

        <input
          name="address"
          placeholder="Address"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          value={form.address}
          onChange={onChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min 8 characters)"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          value={form.password}
          onChange={onChange}
          required
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          value={form.confirmPassword}
          onChange={onChange}
          required
        />

        <button
          disabled={loading}
          onClick={register}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold disabled:bg-gray-400"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
