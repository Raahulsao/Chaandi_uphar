'use client';
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Phone, User, Mail, Lock, Gem, Sparkles, Gift } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const SignUpPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!auth) {
      toast({
        title: "Authentication Error",
        description: "Firebase authentication is not available. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Client-side validation
    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    if (!email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with name
      await updateProfile(user, {
        displayName: name,
      });
      
      // Store additional user data (mobile, referral code) in your database here
      console.log('User created with:', { 
        uid: user.uid, 
        name, 
        email, 
        mobileNumber, 
        referralCode 
      });
      
      toast({
        title: "Account Created Successfully!",
        description: `Welcome to Chaandi Uphar, ${name}!`,
      });
      
      router.push('/account');
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        toast({
          title: "Email Already Registered",
          description: (
            <div className="space-y-2">
              <p>This email is already associated with an account.</p>
              <Link href="/auth/login" className="text-[#ff8fab] hover:text-[#ff7a9a] font-semibold underline">
                Sign in instead?
              </Link>
            </div>
          ),
          variant: "destructive",
          duration: 8000,
        });
      } else if (error.code === 'auth/weak-password') {
        toast({
          title: "Weak Password",
          description: "Password should be at least 6 characters long.",
          variant: "destructive",
        });
      } else if (error.code === 'auth/invalid-email') {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign Up Failed",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!auth || !googleProvider) {
      toast({
        title: "Authentication Error",
        description: "Firebase authentication is not available. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Store additional data if needed
      console.log('Google sign up:', { 
        uid: user.uid, 
        name: user.displayName, 
        email: user.email 
      });
      
      toast({
        title: "Account Created Successfully!",
        description: `Welcome ${user.displayName || 'User'}!`,
      });
      
      router.push('/account');
    } catch (error: any) {
      console.error('Google sign up error:', error);
      
      // Handle specific Firebase errors for Google authentication
      if (error.code === 'auth/account-exists-with-different-credential') {
        toast({
          title: "Account Already Exists",
          description: (
            <div className="space-y-2">
              <p>An account with this email already exists using a different sign-in method.</p>
              <Link href="/auth/login" className="text-[#ff8fab] hover:text-[#ff7a9a] font-semibold underline">
                Try signing in instead?
              </Link>
            </div>
          ),
          variant: "destructive",
          duration: 8000,
        });
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast({
          title: "Sign Up Cancelled",
          description: "The Google sign-up process was cancelled.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Google Sign Up Failed",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#ff8fab]/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 -left-8 w-32 h-32 bg-[#ff8fab]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-[#ff8fab]/10 rounded-full blur-xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-[#ff8fab] to-[#ff7a9a] p-3 rounded-full shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">Join Chaandi Uphar</h1>
          <p className="text-gray-600 font-serif">Begin your journey to timeless elegance</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 font-serif">Create Account</CardTitle>
            <CardDescription className="text-gray-600 font-serif">
              Discover exclusive jewelry collections crafted for you
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium font-serif">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 h-12 border-gray-200 focus:border-[#ff8fab] focus:ring-[#ff8fab]/20 rounded-xl font-serif"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium font-serif">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 border-gray-200 focus:border-[#ff8fab] focus:ring-[#ff8fab]/20 rounded-xl font-serif"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-gray-700 font-medium font-serif">
                  Mobile Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="mobileNumber"
                    type="tel"
                    placeholder="Enter your mobile number"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="pl-12 h-12 border-gray-200 focus:border-[#ff8fab] focus:ring-[#ff8fab]/20 rounded-xl font-serif"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium font-serif">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 border-gray-200 focus:border-[#ff8fab] focus:ring-[#ff8fab]/20 rounded-xl font-serif"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralCode" className="text-gray-700 font-medium font-serif">
                  Referral Code (Optional)
                </Label>
                <div className="relative">
                  <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="referralCode"
                    type="text"
                    placeholder="Enter referral code for special benefits"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    className="pl-12 h-12 border-gray-200 focus:border-[#ff8fab] focus:ring-[#ff8fab]/20 rounded-xl font-serif"
                  />
                </div>
                <p className="text-xs text-gray-500 font-serif">Have a referral code? Enter it to unlock exclusive benefits!</p>
              </div>

              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox" 
                  required
                  className="mt-1 rounded border-gray-300 text-[#ff8fab] focus:ring-[#ff8fab]/20" 
                />
                <label className="text-sm text-gray-600 font-serif leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#ff8fab] hover:text-[#ff7a9a] font-semibold">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#ff8fab] hover:text-[#ff7a9a] font-semibold">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#ff8fab] to-[#ff7a9a] hover:from-[#ff7a9a] hover:to-[#ff6b89] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-serif disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 font-serif">Or continue with</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              disabled={loading}
              className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-xl font-serif transition-all duration-300 disabled:opacity-50" 
              onClick={handleGoogleSignUp}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path 
                  fill="#4285F4" 
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path 
                  fill="#34A853" 
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path 
                  fill="#FBBC05" 
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path 
                  fill="#EA4335" 
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? 'Connecting...' : 'Continue with Google'}
            </Button>

            <div className="mt-6 text-center">
              <p className="text-gray-600 font-serif">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-[#ff8fab] hover:text-[#ff7a9a] font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 font-serif leading-relaxed">
            By creating an account, you're joining our exclusive community of jewelry enthusiasts.
            <br />
            Enjoy personalized recommendations and special member benefits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;