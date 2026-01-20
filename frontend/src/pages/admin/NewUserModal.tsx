import React, { useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type { CreateUserDto } from "../../services/users.service";

type NewUserModalProps = {
  formData: CreateUserDto;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onClose: () => void;
  onSave: () => void;
};

export const NewUserModal: React.FC<NewUserModalProps> = ({ formData, onChange, onClose, onSave }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fields: (keyof CreateUserDto)[] = [
    "email",
    "firstName",
    "lastName",
    "phoneNumber",
    "address",
    "password",
  ];

  
  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password?.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave();
    }
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

    <h2 className="text-lg font-semibold text-[#2563EB] mb-6">New User</h2>


    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {fields.map((field) => (
        <div key={field} className="flex flex-col">
          <Label className="text-xs capitalize">{field}</Label>
          <Input
            name={field}
            type={field === "password" ? "password" : "text"}
            value={formData[field] || ""}
            onChange={onChange}
            className="rounded-lg"
          />
          {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
        </div>
      ))}

  
      <div>
        <Label className="text-xs">Gender</Label>
        <select
          name="gender"
          value={formData.gender}
          onChange={onChange}
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
          onChange={onChange}
          className="rounded-lg w-full px-2 py-1 border"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>

   
    <button
      onClick={handleSave}
      className="mt-6 w-full px-4 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition"
    >
      Create User
    </button>
  </div>
</div>

  );
};
