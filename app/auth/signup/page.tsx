'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const SignUpPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement sign-up logic here
    console.log('Sign up attempt with:', { mobileNumber, name, email, password });
    // Redirect to home or dashboard after successful sign-up
    router.push('/account');
  };

  const handleGoogleSignUp = () => {
    // Implement Google sign-up logic here
    console.log('Continue with Google');
    // Redirect after successful Google sign-up
    router.push('/account');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md border-2 border-purple-300 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-extrabold text-purple-600">Join Us!</CardTitle>
          <CardDescription className="text-md text-gray-600">Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="e.g., +1234567890"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">Sign Up</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
              Login
            </Link>
          </div>
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">Or continue with</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-6 bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50" onClick={handleGoogleSignUp}>
            <svg className="mr-2 h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.24v3.52h6.08c-.24 1.44-.96 2.88-2.08 3.84l-.08.08-2.88 2.24c-1.76 1.36-4 2.16-6.4 2.16-4.96 0-9.04-4.08-9.04-9.04s4.08-9.04 9.04-9.04c2.64 0 4.96 1.04 6.72 2.72l2.56-2.56c-2.24-2.16-5.2-3.52-8.28-3.52-6.8 0-12.32 5.52-12.32 12.32s5.52 12.32 12.32 12.32c7.04 0 12.32-5.04 12.32-12.32 0-.8-.08-1.6-.24-2.4h-12.08z"/>
            </svg>
            Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;