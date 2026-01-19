import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { UsersService } from "../../services/users.service";
import type { CreateUserDto, UpdateUserDto } from "../../services/users.service";
import type { User } from "../../auth/AuthContext";

export const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateUserDto>({});
  const [formData, setFormData] = useState<CreateUserDto>({
    email: "",
    firstName: "",
    lastName: "",
    gender: "male",
    phoneNumber: "",
    address: "",
    role: "user",
    password: "",
  });

  const loadUsers = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await UsersService.getAll();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to load users";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(lowerQuery) ||
        user.lastName.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (user: User) => {
    setEditingId(user.id);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      gender: user.gender,
      role: user.role,
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = async (userId: string) => {
    try {
      setError("");
      if (!editFormData.firstName || !editFormData.lastName) {
        setError("First name and last name are required");
        return;
      }

      await UsersService.update(userId, editFormData);
      setEditingId(null);
      setEditFormData({});
      await loadUsers();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update user";
      setError(errorMessage);
    }
  };

  const handleCreate = async () => {
    try {
      setError("");
      if (!formData.email || !formData.firstName || !formData.password) {
        setError("Email, first name, and password are required");
        return;
      }

      await UsersService.create(formData);
      setShowForm(false);
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        gender: "male",
        phoneNumber: "",
        address: "",
        role: "user",
        password: "",
      });
      await loadUsers();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create user";
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setError("");
      await UsersService.remove(id);
      await loadUsers();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete user";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage users, roles and permissions
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-rose-700"
          >
            Logout
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Add User Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-emerald-700"
          >
            {showForm ? "Cancel" : "➕ Add New User"}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="mb-10 rounded-2xl border bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-slate-700">
              Create New User
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { name: "email", type: "email", placeholder: "Email" },
                { name: "firstName", placeholder: "First Name" },
                { name: "lastName", placeholder: "Last Name" },
                { name: "phoneNumber", placeholder: "Phone Number" },
                { name: "address", placeholder: "Address" },
                { name: "password", type: "password", placeholder: "Password" },
              ].map((field) => (
                <input
                  key={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              onClick={handleCreate}
              className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
            >
              Create User
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <p className="mt-2 text-xs text-slate-500">
              Found {filteredUsers.length} of {users.length} users
            </p>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center text-sm text-slate-500">
            Loading users...
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-white shadow-xl">
            <table className="w-full">
              <thead className="border-b bg-slate-100 text-slate-600">
                <tr>
                  {[
                    "Email",
                    "Name",
                    "Role",
                    "Gender",
                    "Phone",
                    "Address",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b transition hover:bg-slate-50"
                  >
                    {editingId === u.id ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            name="email"
                            value={editFormData.email || ""}
                            onChange={handleEditChange}
                            className="w-full rounded border px-2 py-1 text-sm"
                          />
                        </td>

                        <td className="px-4 py-3 flex gap-2">
                          <input
                            name="firstName"
                            value={editFormData.firstName || ""}
                            onChange={handleEditChange}
                            placeholder="First"
                            className="flex-1 rounded border px-2 py-1 text-sm"
                          />
                          <input
                            name="lastName"
                            value={editFormData.lastName || ""}
                            onChange={handleEditChange}
                            placeholder="Last"
                            className="flex-1 rounded border px-2 py-1 text-sm"
                          />
                        </td>

                        <td className="px-4 py-3">
                          <select
                            name="role"
                            value={editFormData.role || u.role}
                            onChange={handleEditChange}
                            className="rounded border px-2 py-1 text-sm"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        <td className="px-4 py-3">
                          <select
                            name="gender"
                            value={editFormData.gender || ""}
                            onChange={handleEditChange}
                            className="rounded border px-2 py-1 text-sm"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </td>

                        <td className="px-4 py-3">
                          <input
                            name="phoneNumber"
                            value={editFormData.phoneNumber || ""}
                            onChange={handleEditChange}
                            className="w-full rounded border px-2 py-1 text-sm"
                          />
                        </td>

                        <td className="px-4 py-3">
                          <input
                            name="address"
                            value={editFormData.address || ""}
                            onChange={handleEditChange}
                            className="w-full rounded border px-2 py-1 text-sm"
                          />
                        </td>

                        <td className="px-4 py-3 flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(u.id)}
                            className="rounded bg-emerald-600 px-3 py-1 text-xs text-white hover:bg-emerald-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditFormData({});
                            }}
                            className="rounded bg-gray-200 px-3 py-1 text-xs hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-sm">{u.email}</td>
                        <td className="px-6 py-4 text-sm">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white ${
                              u.role === "admin"
                                ? "bg-rose-600"
                                : "bg-indigo-600"
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm capitalize">
                          {u.gender}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {u.phoneNumber || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {u.address || "N/A"}
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => handleEditClick(u)}
                            className="rounded-md px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="rounded-md px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="p-10 text-center text-sm text-slate-500">
                😴 No users found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
