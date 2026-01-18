import { AuthLayout } from "../components/Layout";
import { LoginForm } from "./LoginForm";

export const Login = () => {
    return (
    <AuthLayout>
        <LoginForm/> 
    </AuthLayout>
);
}