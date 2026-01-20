import React, { useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type { User } from "../../auth/AuthContext";
import type { UpdateUserDto } from "../../services/users.service";

type UserModalProps = {
  user: User;
  isEditing: boolean;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave?: () => void;
};

const userFields = ["email", "firstName", "lastName", "phoneNumber", "address"] as const;

export const UserModal: React.FC<UserModalProps> = ({ user, isEditing, onClose, onChange, onSave }) => {
  const [errors, setErrors] = useState<Partial<Record<typeof userFields[number], string>>>({});
  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!user.firstName?.trim()) newErrors.firstName = "First name is required.";
    if (!user.lastName?.trim()) newErrors.lastName = "Last name is required.";
    if (!user.email?.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(user.email)) newErrors.email = "Email is invalid.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave?.();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-200/80">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-[#2563EB] mb-6">
          {isEditing ? "Edit User" : "View User"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {userFields.map((field) => (
            <div key={field} className="flex flex-col">
              <Label className="text-xs capitalize">{field}</Label>
              <Input
                name={field}
                value={(user as any)[field] || ""}
                onChange={onChange}
                className="rounded-lg"
                disabled={!isEditing}
              />
              {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
            </div>
          ))}

  
          <div className="flex flex-col">
            <Label className="text-xs">Gender</Label>
            <select
              name="gender"
              value={(user as UpdateUserDto).gender || user.gender}
              onChange={onChange}
              className="rounded-lg w-full px-3 py-2 border"
              disabled={!isEditing}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <Label className="text-xs">Role</Label>
            <select
              name="role"
              value={user.role}
              onChange={onChange}
              className="rounded-lg w-full px-3 py-2 border"
              disabled={!isEditing}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {isEditing && onSave && (
          <button
            onClick={handleSave}
            className="mt-6 w-full px-4 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};
