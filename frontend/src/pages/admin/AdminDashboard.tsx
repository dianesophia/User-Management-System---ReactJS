  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
  import { useAuth } from "../../auth/AuthContext";
  import { UsersService } from "../../services/users.service";
  import type { CreateUserDto, UpdateUserDto } from "../../services/users.service";
  import type { User } from "../../auth/AuthContext";
  import logo from "../../assets/logo.png";
  import { Input } from "../../components/ui/input";
  import { Label } from "../../components/ui/label";

  type FieldProps = {
    label: string;
    error?: string;
    children: React.ReactNode;
  };

  const Field: React.FC<FieldProps> = ({ label, error, children }) => (
    <div className="flex flex-col">
      <Label className="text-xs mb-1">{label}</Label>
      {children}
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );

  type PasswordFieldProps = {
    label: string;
    name: string;
    value: string;
    error?: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  name,
  value,
  error,
  placeholder,
  onChange,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col">
      <Label className="text-xs mb-1">{label}</Label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className="pr-10 rounded-lg"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

  type InfoRowProps = {
    label: string;
    value: string;
  };

  const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );

  type UserModalProps = {
    user: User & UpdateUserDto;
    isEditing: boolean;
    onClose: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSave?: () => void;
  };

  export const UserModal: React.FC<UserModalProps> = ({
    user,
    isEditing,
    onClose,
    onChange,
    onSave,
  }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-200/80">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
          <h2 className="text-lg font-semibold text-[#2563EB] mb-4">
            {isEditing ? "Edit User" : "View User"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["firstName", "lastName", "email", "phoneNumber", "address"].map((field) => (
              <Field key={field} label={field.charAt(0).toUpperCase() + field.slice(1)}>
                <Input
                  name={field}
                  value={(user as any)[field] || ""}
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </Field>
            ))}

            <Field label="Gender">
              <select
                name="gender"
                value={user.gender}
                onChange={onChange}
                className="w-full rounded-lg px-2 py-1 border"
                disabled={!isEditing}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field label="Role">
              <select
                name="role"
                value={user.role}
                onChange={onChange}
                className="w-full rounded-lg px-2 py-1 border"
                disabled={!isEditing}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
          </div>

          {isEditing && onSave && (
            <button
              onClick={onSave}
              className="mt-4 w-full px-4 py-2 bg-[#2563EB] text-white rounded-lg"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    );
  };

  type NewUserModalProps = {
    formData: CreateUserDto;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    onSave: () => void;
  };

  export const NewUserModal: React.FC<NewUserModalProps> = ({
    formData,
    errors,
    onChange,
    onPasswordChange,
    onClose,
    onSave,
  }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-200/80">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
          <h2 className="text-lg font-semibold text-[#2563EB] mb-4">New User</h2>

          {errors.general && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email" error={errors.email}>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Email"
              />
            </Field>

            <Field label="First Name" error={errors.firstName}>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                placeholder="First name"
              />
            </Field>

            <Field label="Last Name" error={errors.lastName}>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                placeholder="Last Name"
              />
            </Field>

            <Field label="Phone Number">
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={onChange}
                placeholder="Optional"
              />
            </Field>

            <Field label="Address" error={errors.address}>
              <Input
                name="address"
                value={formData.address}
                onChange={onChange}
                placeholder="Address"
              />
            </Field>

            <Field label="Gender">
              <select
                name="gender"
                value={formData.gender}
                onChange={onChange}
                className="w-full rounded-lg px-2 py-1 border"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              error={errors.password}
              placeholder=""
              onChange={onPasswordChange}
            />

            <Field label="Role">
              <select
                name="role"
                value={formData.role}
                onChange={onChange}
                className="w-full rounded-lg px-2 py-1 border"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
          </div>

          <button
            onClick={onSave}
            className="mt-4 w-full px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create User
          </button>
        </div>
      </div>
    );
  };

  export const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [modalUser, setModalUser] = useState<User & UpdateUserDto | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState<UpdateUserDto>({});

    const [showNewUserModal, setShowNewUserModal] = useState(false);
    const [newUserFormData, setNewUserFormData] = useState<CreateUserDto>({
      email: "",
      firstName: "",
      lastName: "",
      gender: "male",
      phoneNumber: "",
      address: "",
      role: "user",
      password: "",
    });
    const [newUserErrors, setNewUserErrors] = useState<Record<string, string>>({});

  // My Profile
  const [showProfile, setShowProfile] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileFormData, setProfileFormData] = useState<UpdateUserDto>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: "male",
    role: "user",
  });
  const [profilePassword, setProfilePassword] = useState("");
  const [profileConfirmPassword, setProfileConfirmPassword] = useState("");
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileLoading, setProfileLoading] = useState(false);

    if (!user) return <p>Loading...</p>; // Prevent TS null error

    // Load users
    const loadUsers = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await UsersService.getAll();
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

    const handleLogout = async () => {
      await logout();
      navigate("/");
    };

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

    const openModal = (targetUser: User, edit = false) => {
      setModalUser({ ...targetUser, ...editFormData });
      setIsEditing(edit);
      setEditFormData({
        firstName: targetUser.firstName || "",
        lastName: targetUser.lastName || "",
        email: targetUser.email || "",
        phoneNumber: targetUser.phoneNumber || "",
        address: targetUser.address || "",
        gender: targetUser.gender || "male",
        role: targetUser.role || "user",
      });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
      setModalUser((prev) => prev && { ...prev, [e.target.name]: e.target.value });
    };

    const handleSaveEdit = async (id: string) => {
      try {
        await UsersService.update(id, editFormData);
        setModalUser(null);
        await loadUsers();
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update user");
      }
    };

    const handleProfileEdit = () => {
      setProfileEditing(true);
      setProfileFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        gender: user.gender || "male",
        role: user.role || "user",
      });
      setProfilePassword("");
      setProfileConfirmPassword("");
      setProfileErrors({});
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
      setProfileErrors({ ...profileErrors, [e.target.name]: "" });
    };

    const handleProfilePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.name === "password") {
        setProfilePassword(e.target.value);
      } else if (e.target.name === "confirmPassword") {
        setProfileConfirmPassword(e.target.value);
      }
      setProfileErrors({ ...profileErrors, [e.target.name]: "" });
    };

    const validateProfile = () => {
      const newErrors: Record<string, string> = {};
      
      if (!profileFormData.firstName?.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!profileFormData.lastName?.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!profileFormData.email?.trim()) {
        newErrors.email = "Email is required";
      }
      
      if (profilePassword) {
        if (profilePassword.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        }
        if (profilePassword !== profileConfirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
      }
      
      setProfileErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleProfileSave = async () => {
      if (!validateProfile()) return;
      
      try {
        setProfileLoading(true);
        setError("");
        
        const updateData: UpdateUserDto = {
          firstName: profileFormData.firstName,
          lastName: profileFormData.lastName,
          email: profileFormData.email,
          phoneNumber: profileFormData.phoneNumber,
          address: profileFormData.address,
          gender: profileFormData.gender,
          ...(profilePassword && { password: profilePassword }),
        };
        
        await UsersService.updateSelf(updateData);
        setProfileEditing(false);
        window.location.reload();
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update profile");
      } finally {
        setProfileLoading(false);
      }
    };

    const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setNewUserFormData({ ...newUserFormData, [e.target.name]: e.target.value });
      setNewUserErrors({ ...newUserErrors, [e.target.name]: "" });
    };

    const handleNewUserPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewUserFormData({ ...newUserFormData, password: e.target.value });
      setNewUserErrors({ ...newUserErrors, password: "" });
    };

    const validateNewUser = () => {
      const errors: Record<string, string> = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!newUserFormData.email.trim()) {
        errors.email = "Email is required";
      } else if (!emailRegex.test(newUserFormData.email.trim())) {
        errors.email = "Invalid email format";
      }

      if (!newUserFormData.firstName.trim()) {
        errors.firstName = "First name is required";
      }

      if (!newUserFormData.lastName.trim()) {
        errors.lastName = "Last name is required";
      }

      if (!newUserFormData.address.trim()) {
        errors.address = "Address is required";
      }

      if (!newUserFormData.password) {
        errors.password = "Password is required";
      } else if (newUserFormData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])/.test(newUserFormData.password)) {
        errors.password = "Password must contain at least one lowercase letter";
      } else if (!/(?=.*[A-Z])/.test(newUserFormData.password)) {
        errors.password = "Password must contain at least one uppercase letter";
      } else if (!/(?=.*\d)/.test(newUserFormData.password)) {
        errors.password = "Password must contain at least one number";
      } else if (!/(?=.*[@$!%*?&#])/.test(newUserFormData.password)) {
        errors.password = "Password must contain at least one special character (@$!%*?&#)";
      }

      setNewUserErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleNewUserSave = async () => {
      if (!validateNewUser()) return;

      try {
        setError("");
        await UsersService.create(newUserFormData);
        setShowNewUserModal(false);
        setNewUserFormData({
          email: "",
          firstName: "",
          lastName: "",
          gender: "male",
          phoneNumber: "",
          address: "",
          role: "user",
          password: "",
        });
        setNewUserErrors({});
        await loadUsers();
      } catch (err: any) {
        setNewUserErrors({ general: err.response?.data?.message || "Failed to create user" });
      }
    };

    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <img src={logo} className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-semibold text-[#2563EB]">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">User Management Panel</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:opacity-90 transition"
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:opacity-90 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 text-center">{error}</div>}

          {/* Search Bar */}
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

          {/* My Profile UI */}
          {showProfile && (
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-semibold mb-3">
                  {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                </div>

                <h2 className="font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>

                <span className="mt-3 px-3 py-1 text-xs rounded-full bg-gray-100 capitalize">
                  {user.role}
                </span>

              </div>

              <section className="bg-white rounded-xl p-6 shadow-sm">
                {!profileEditing ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-gray-800">Profile Details</h3>
                      <button
                        onClick={handleProfileEdit}
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
                    <h3 className="font-semibold text-gray-800 mb-6">Edit Profile</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="First Name" error={profileErrors.firstName}>
                        <Input
                          name="firstName"
                          value={profileFormData.firstName || ""}
                          onChange={handleProfileChange}
                        />
                      </Field>

                      <Field label="Last Name" error={profileErrors.lastName}>
                        <Input
                          name="lastName"
                          value={profileFormData.lastName || ""}
                          onChange={handleProfileChange}
                        />
                      </Field>

                      <Field label="Email" error={profileErrors.email}>
                        <Input
                          type="email"
                          name="email"
                          value={profileFormData.email || ""}
                          onChange={handleProfileChange}
                        />
                      </Field>

                      <Field label="Phone">
                        <Input
                          name="phoneNumber"
                          value={profileFormData.phoneNumber || ""}
                          onChange={handleProfileChange}
                        />
                      </Field>

                      <Field label="Address">
                        <Input
                          name="address"
                          value={profileFormData.address || ""}
                          onChange={handleProfileChange}
                        />
                      </Field>

                      <Field label="Gender">
                        <select
                          name="gender"
                          value={profileFormData.gender}
                          onChange={handleProfileChange}
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
                        value={profilePassword}
                        error={profileErrors.password}
                        placeholder="Leave empty to keep current"
                        onChange={handleProfilePasswordChange}
                      />

                      <PasswordField
                        label="Confirm Password"
                        name="confirmPassword"
                        value={profileConfirmPassword}
                        error={profileErrors.confirmPassword}
                        onChange={handleProfilePasswordChange}
                      />
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleProfileSave}
                        disabled={profileLoading}
                        className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-60"
                      >
                        {profileLoading ? "Saving..." : "Save"}
                      </button>

                      <button
                        onClick={() => setProfileEditing(false)}
                        className="border px-5 py-2 rounded-md text-sm hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </section>
            </div>
          )}

         
          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            {loading ? (
              <p className="p-6 text-center text-sm text-gray-500">Loading users...</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    {["Name", "Email", "Role", "Phone", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-3">{u.firstName} {u.lastName}</td>
                      <td className="px-6 py-3">{u.email}</td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${u.role === "admin" ? "bg-red-600" : "bg-[#2563EB]"}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-3">{u.phoneNumber || "—"}</td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => openModal(u, false)}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openModal(u, true)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          {u.id !== user?.id && (
                            <button
                              onClick={async () => {
                                if (!window.confirm("Delete this user?")) return;
                                await UsersService.remove(u.id);
                                await loadUsers();
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          
          {modalUser && (
            <UserModal
              user={modalUser}
              isEditing={isEditing}
              onClose={() => setModalUser(null)}
              onChange={handleEditChange}
              onSave={isEditing ? () => handleSaveEdit(modalUser.id) : undefined}
            />
          )}

          {showNewUserModal && (
            <NewUserModal
              formData={newUserFormData}
              errors={newUserErrors}
              onChange={handleNewUserChange}
              onPasswordChange={handleNewUserPasswordChange}
              onClose={() => {
                setShowNewUserModal(false);
                setNewUserErrors({});
              }}
              onSave={handleNewUserSave}
            />
          )}
        </div>
      </div>
    );
  };
