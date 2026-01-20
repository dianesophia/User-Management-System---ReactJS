import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { UsersService } from "../../services/users.service";
import type { UpdateUserDto } from "../../services/users.service";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import logo from "../../assets/logo.png";



const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="font-medium text-gray-800">{value}</span>
  </div>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Label className="text-xs text-gray-600">{label}</Label>
    {children}
  </div>
);


export const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<UpdateUserDto>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    gender: user?.gender || "male",
    address: user?.address || "",
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      navigate("/");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setError("");
      setLoading(true);
      await UsersService.updateSelf(formData);
      setEditing(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-10">Loading...</div>;
  }

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center gap-3">
                  <img src={logo} className="w-10 h-10" />
                  <div>
                    <h1 className="text-xl font-semibold text-[#2563EB]">
                      Admin Dashboard
                    </h1>
                    <p className="text-xs text-gray-500">
                      User Management Panel
                    </p>
                  </div>
                </div>
      
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:opacity-90 transition"
                >
                  Logout
                </button>
              </div>

   
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">


        <aside className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col items-center text-center">
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

      
        <section className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
              {error}
            </div>
          )}

          {!editing ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800">
                  Account Information
                </h3>

                <button
                  onClick={() => setEditing(true)}
                  className="text-sm font-medium text-blue-600 hover:underline"
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
                <Field label="First Name">
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Field>

                <Field label="Last Name">
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Field>

                <Field label="Email">
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Field>

                <Field label="Phone">
                  <Input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </Field>

                 <Field label="Address">
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Field>

                <Field label="Gender">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </Field>


                

              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="border border-gray-300 px-5 py-2 rounded-md text-sm hover:bg-gray-100 transition"
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
