import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { UsersService } from "../../services/users.service";
import type { UpdateUserDto } from "../../services/users.service";

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
  });

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

  
  const handleUpdate = async () => {
    try {
      setError("");
      setLoading(true);
     
      await UsersService.updateSelf(formData);
      setEditing(false);
     
      window.location.reload();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Update failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

       
        {error && <p className="text-red-600 mb-4 text-sm bg-red-50 p-3 rounded">{error}</p>}

        
        {!editing ? (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">First Name</p>
              <p className="font-semibold">{user.firstName}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Last Name</p>
              <p className="font-semibold">{user.lastName}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phone</p>
              <p className="font-semibold">{user.phoneNumber || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Gender</p>
              <p className="font-semibold capitalize">{user.gender}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Role</p>
              <p className="font-semibold uppercase">{user.role}</p>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        ) : (
         
          <div className="space-y-4">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
