import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../auth/AuthContext";
import { UsersService } from "../../services/users.service";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import logo from "../../assets/logo.png";


type Gender = "male" | "female" | "other";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  address: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;


const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="font-medium text-gray-800">{value}</span>
  </div>
);

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Label className="text-xs text-gray-600">{label}</Label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

interface PasswordFieldProps {
  label: string;
  name: keyof FormState;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField = ({
  label,
  name,
  value,
  error,
  placeholder,
  onChange,
}: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <Field label={label} error={error}>
      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete="new-password"
          placeholder={placeholder}
          className="pr-10"
        />

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </Field>
  );
};



export const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormState>({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phoneNumber: user?.phoneNumber ?? "",
    gender: (user?.gender as Gender) ?? "male",
    address: user?.address ?? "",
    password: "",
    confirmPassword: "",
  });


  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "gender" ? (value as Gender) : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setServerError("");

      await UsersService.updateSelf({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        address: formData.address,
        ...(formData.password && { password: formData.password }),
      });

      setEditing(false);
      window.location.reload();
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-10">Loading...</div>;

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();


  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-3">
            <img src={logo} className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-semibold text-[#2563EB]">
                User Dashboard
              </h1>
              <p className="text-xs text-gray-500">User Management Panel</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:opacity-90"
          >
            Logout
          </button>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <aside className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-semibold mb-3">
              {initials}
            </div>

            <h2 className="font-semibold text-gray-800">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>

            <span className="mt-3 px-3 py-1 text-xs rounded-full bg-gray-100 capitalize">
              {user.role}
            </span>
          </aside>

          <section className="bg-white rounded-xl p-6 shadow-sm">
            {serverError && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border p-3 rounded">
                {serverError}
              </div>
            )}

            {!editing ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-800">
                    Profile Details
                  </h3>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoRow label="First Name" value={user.firstName} />
                  <InfoRow label="Last Name" value={user.lastName} />
                  <InfoRow label="Email" value={user.email} />
                  <InfoRow label="Phone" value={user.phoneNumber || "N/A"} />
                  <InfoRow label="Gender" value={user.gender} />
                  <InfoRow label="Address" value={user.address || "N/A"} />
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-gray-800 mb-6">
                  Edit Account
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name" error={errors.firstName}>
                    <Input name="firstName" value={formData.firstName} onChange={handleChange} />
                  </Field>

                  <Field label="Last Name" error={errors.lastName}>
                    <Input name="lastName" value={formData.lastName} onChange={handleChange} />
                  </Field>

                  <Field label="Email" error={errors.email}>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} />
                  </Field>

                  <Field label="Phone">
                    <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                  </Field>

                  <Field label="Address">
                    <Input name="address" value={formData.address} onChange={handleChange} />
                  </Field>

                  <Field label="Gender">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>

                  <PasswordField
                    label="New Password"
                    name="password"
                    value={formData.password}
                    error={errors.password}
                    placeholder="Leave empty to keep current password"
                    onChange={handleChange}
                  />

                  <PasswordField
                    label="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    error={errors.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => setEditing(false)}
                    className="border px-5 py-2 rounded-md text-sm hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
