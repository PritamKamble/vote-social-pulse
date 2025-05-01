
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AppLayout: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // If still loading auth state, show minimal layout
  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="h-16 bg-primary" /> {/* Navbar placeholder */}
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={user ? { email: user.email || '' } : null} 
        onLogout={handleLogout} 
      />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
