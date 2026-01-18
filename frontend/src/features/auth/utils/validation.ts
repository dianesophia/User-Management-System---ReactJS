import * as Yup from 'yup';

export const LoginSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address")
    .max(254, "Email msut be less than 254 characters")
    .trim(),

  password: Yup.string()
    .required("Password is required")
    .min(6)
    .max(20)
});

export const RegisterSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address")
    .max(254, "Email msut be less than 254 characters")
    .trim(),

  name: Yup.string()
    .required("Name is required")
    .max(254, "Name msut be less than 254 characters")
    .trim(),

  password: Yup.string()
    .required("Password is required")
    .min(6)
    .max(20)
});