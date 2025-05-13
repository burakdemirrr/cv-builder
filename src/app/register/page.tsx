'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(email, password);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="glass-card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500 bg-opacity-20 text-white p-3 rounded-lg mb-4">
            Registration successful! Please check your email to confirm your account.
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="glass-input w-full"
              required
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full flex justify-center"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <p className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-300 hover:text-purple-100">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 