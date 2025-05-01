
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Vote } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-100 to-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <Vote size={60} className="mx-auto text-primary mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Create and Share Polls Instantly
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              Make decisions together with real-time voting and beautiful results visualization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary-600 text-lg">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-primary hover:bg-primary-600 text-lg">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Use Social Pulse?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
              <p className="text-gray-600">
                Watch votes come in instantly. No refreshing needed to see the latest results.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Beautiful Visualization</h3>
              <p className="text-gray-600">
                See results in stunning charts that make data interpretation easy and intuitive.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Voting</h3>
              <p className="text-gray-600">
                Our system ensures one vote per user with secure authentication and data storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create Your First Poll?</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Join thousands of users making better decisions with Social Pulse.
          </p>
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary-600">
                Create a Poll Now
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button size="lg" className="bg-primary hover:bg-primary-600">
                Sign Up for Free
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
