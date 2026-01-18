import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginWithEmailAndPassword } from "@/features/auth/api/requests/login";
import { Form } from "@/components/ui/form";
import { LoginSchema } from "@/features/auth/utils/validation";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface LoginFormValues extends FieldValues {
  email: string;
  password: string;
}

type LoginFormProps = {
  onSucess: () => void;
}
export const LoginForm = ({ onSucess } : LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginWithEmailAndPassword();
  const isSubmitting = loginMutation.isPending;
  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        onSucess();
      },
    });
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Login</h2>
      </div>
      
      <Form<LoginFormValues>
        onSubmit={onSubmit}  
        schema={LoginSchema}
        initialValues={{ email: '', password: '' }}
      >
        {({ register, formState: { errors, isSubmitting: formIsSubmitting } }) => (

          <div className="space-y-6">

            <div className="space-y-1">
              <label htmlFor="email" className="text-base font-medium font-inter tracking-normal text-[#111928] leading-6">
                Email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={isSubmitting || formIsSubmitting} 
                  placeholder="e.g johndoe@gmail.com"
                  className={cn(
                    'w-full px-4 py-3 mt-2 border border-[#DFE4EA] rounded-md text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent',
                    errors.email ? 'border-red-500' : ''
                  )}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-base font-medium font-inter tracking-normal text-[#111928] leading-6">
                Password
              </label>
              <div className="relative">
                <Input 
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  disabled={ isSubmitting || formIsSubmitting }
                  className={cn(
                    'w-full px-4 py-3 mt-2 border border-[#DFE4EA] rounded-md text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent',
                    errors.password ? 'border-red-500' : ''
                  )}
                />
                <Button
                  type="button"
                  variant="link"
                  className='absolute inset-y-0 right-0 flex items-center pr-3 mt-1 text-gray-400 bg-none shadow-none'
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={formIsSubmitting}
                >
                  { showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" /> }
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-1">
              <Button 
                type="submit"
                className="font-inter w-full h-full max-h-12.5 bg-[#3758F9] py-3 text-sm font-medium text-white hover:bg-[#3758F9]/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                { isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </div>
                ): "Login" }
              </Button>
            </div>
          </div>
        )}
      </Form>

      <div className="text-center mt-8 text-gray-600">
        New Here? {" "}
        <Link
          to="/auth/register"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
};