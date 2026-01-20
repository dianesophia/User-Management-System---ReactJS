import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { UsersService } from "../../services/users.service";
import type { CreateUserDto, UpdateUserDto } from "../../services/users.service";
import type { User } from "../../auth/AuthContext";
import logo from "../../assets/logo.png";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalUser, setModalUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
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
      let data = await UsersService.getAll();
      data.sort((a, b) => a.firstName.localeCompare(b.firstName));
      setUsers(data);
      setFilteredUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) return setFilteredUsers(users);
    const lowerQuery = query.toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          u.firstName.toLowerCase().includes(lowerQuery) ||
          u.lastName.toLowerCase().includes(lowerQuery) ||
          u.email.toLowerCase().includes(lowerQuery)
      )
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenModal = (user: User, edit = false) => {
    setModalUser(user);
    setIsEditing(edit);
    setEditFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      gender: user.gender || "male",
      role: user.role || "user",
    });
  };

  const handleCloseModal = () => {
    setModalUser(null);
    setIsEditing(false);
    setEditFormData({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (userId: string) => {
    try {
      await UsersService.update(userId, editFormData);
      handleCloseModal();
      await loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleCreate = async () => {
    try {
      await UsersService.create(formData);
      setShowNewUserModal(false);
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
      setError(err.response?.data?.message || "Failed to create user");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    await UsersService.remove(id);
    await loadUsers();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-3">
            <img src={logo} className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-semibold text-[#2563EB]">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">User Management Panel</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 text-center">{error}</div>}

        <div className="flex flex-wrap gap-3 justify-between items-center">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-xs rounded-xl"
          />
          <button
            onClick={() => setShowNewUserModal(true)}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:opacity-90"
          >
            + New User
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          {loading ? (
            <p className="p-6 text-center text-sm text-gray-500">Loading users...</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  {["Email", "Name", "Role", "Phone", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{u.email}</td>
                    <td className="px-6 py-3">{u.firstName} {u.lastName}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${u.role === "admin" ? "bg-red-600" : "bg-[#2563EB]"}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3">{u.phoneNumber || "—"}</td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        onClick={() => handleOpenModal(u, false)}
                        className="text-gray-700 hover:underline text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleOpenModal(u, true)}
                        className="text-[#2563EB] hover:underline text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {modalUser && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-200/80">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={handleCloseModal}
              >
                ✕
              </button>
              <h2 className="text-lg font-semibold text-[#2563EB] mb-4">
                {isEditing ? "Edit User" : "View User"}
              </h2>

              <div className="space-y-3">
                {["email", "firstName", "lastName", "phoneNumber", "address"].map((field) => (
                  <div key={field} className="flex flex-col">
                    <Label className="text-xs capitalize">{field}</Label>
                    {isEditing ? (
                      <Input
                        name={field}
                        value={(editFormData as any)[field] || ""}
                        onChange={handleEditChange}
                        className="rounded-lg"
                      />
                    ) : (
                      <p className="text-sm text-gray-700">{(modalUser as any)[field] || "—"}</p>
                    )}
                  </div>
                ))}

                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label className="text-xs">Gender</Label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={editFormData.gender || modalUser.gender}
                        onChange={handleEditChange}
                        className="rounded-lg w-full px-2 py-1 border"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="text-sm text-gray-700 capitalize">{modalUser.gender}</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Role</Label>
                    {isEditing ? (
                      <select
                        name="role"
                        value={editFormData.role || modalUser.role}
                        onChange={handleEditChange}
                        className="rounded-lg w-full px-2 py-1 border"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <p className="text-sm text-gray-700">{modalUser.role.toUpperCase()}</p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={() => handleSaveEdit(modalUser.id)}
                  className="mt-4 w-full px-4 py-2 bg-[#2563EB] text-white rounded-lg"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        )}

        {showNewUserModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-200/80">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowNewUserModal(false)}
              >
                ✕
              </button>

              <h2 className="text-lg font-semibold text-[#2563EB] mb-4">New User</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["email", "firstName", "lastName", "phoneNumber", "address", "password"].map((field) => (
                  <div key={field} className="flex flex-col">
                    <Label className="text-xs capitalize">{field}</Label>
                    <Input
                      name={field}
                      type={field === "password" ? "password" : "text"}
                      value={(formData as any)[field]}
                      onChange={handleChange}
                      className="rounded-lg"
                    />
                  </div>
                ))}

                <div>
                  <Label className="text-xs">Gender</Label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="rounded-lg w-full px-2 py-1 border"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs">Role</Label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="rounded-lg w-full px-2 py-1 border"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCreate}
                className="mt-4 w-full px-4 py-2 bg-[#2563EB] text-white rounded-lg"
              >
                Create User
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
