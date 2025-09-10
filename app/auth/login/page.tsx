'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Phone, Lock, Gem, Heart } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Convert mobile number to email format for Firebase
      const email = `${mobileNumber}@chaandiuphar.com`;
      await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to Chaandi Uphar!",
      });
      
      router.push('/account');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        toast({
          title: "Account Not Found",
          description: (
            <div className="space-y-2">
              <p>No account found with this mobile number.</p>
              <Link href="/auth/signup" className="text-[#ff8fab] hover:text-[#ff7a9a] font-semibold underline">
                Create an account instead?
              </Link>
            </div>
          ),
          variant: "destructive",
          duration: 8000,
        });
      } else if (error.code === 'auth/wrong-password') {
        toast({
          title: "Incorrect Password",
          description: "The password you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      } else if (error.code === 'auth/invalid-email') {
        toast({
          title: "Invalid Email Format",
          description: "Please check your mobile number format.",
          variant: "destructive",
        });
      } else if (error.code === 'auth/too-many-requests') {
        toast({
          title: "Too Many Attempts",
          description: "Account temporarily disabled due to many failed login attempts. Try again later.",
          variant: "destructive",
          duration: 10000,
        });
      } else {
        toast({
          title: "Login Failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      toast({
        title: "Login Successful",
        description: `Welcome ${user.displayName || 'User'}!`,
      });
      
      router.push('/account');
    } catch (error: any) {
      console.error('Google login error:', error);
      
      // Handle specific Firebase errors for Google authentication
      if (error.code === 'auth/popup-closed-by-user') {
        toast({
          title: "Login Cancelled",
          description: "The Google login process was cancelled.",
          variant: "destructive",
        });
      } else if (error.code === 'auth/popup-blocked') {
        toast({
          title: "Popup Blocked",
          description: "Please allow popups for this site to sign in with Google.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Google Login Failed",
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
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#ff8fab]/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 -right-8 w-32 h-32 bg-[#ff8fab]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-[#ff8fab]/10 rounded-full blur-xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-[#ff8fab] p-3 rounded-full shadow-lg">
              <Gem className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">Chaandi Uphar</h1>
          <p className="text-gray-600 font-serif">Where Timeless Beauty Meets You</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center pb-8">
            <CardTitle className="text-2xl font-bold text-gray-900 font-serif">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600 font-serif">
              Sign in to continue your jewelry journey
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-6">
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
                    placeholder="Enter your password"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-[#ff8fab] focus:ring-[#ff8fab]/20" />
                  <span className="text-sm text-gray-600 font-serif">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-[#ff8fab] hover:text-[#ff7a9a] font-serif">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-[#ff8fab] hover:bg-[#ff7a9a] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-serif disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative my-8">
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
              onClick={handleGoogleLogin}
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

            <div className="mt-8 text-center">
              <p className="text-gray-600 font-serif">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-[#ff8fab] hover:text-[#ff7a9a] font-semibold">
                  Create Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 font-serif">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-[#ff8fab] hover:text-[#ff7a9a]">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#ff8fab] hover:text-[#ff7a9a]">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;