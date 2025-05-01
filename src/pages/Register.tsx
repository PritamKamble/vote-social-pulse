
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import RegisterForm from '@/components/auth/RegisterForm';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleRegister = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(undefined);
      
      const { error } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now login.",
      });
      
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50">
      <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={error} />
    </div>
  );
};

export default Register;
