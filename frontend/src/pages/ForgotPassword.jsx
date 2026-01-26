import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, KeyRound, Loader2, Mail, CheckCircle2, AlertCircle, Star, Shield, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Testimonials data - rotates randomly on each page load
// TODO: Later can be connected to a space to show real testimonials
const testimonials = [
  { quote: "TrustWall helped us increase conversions by 40%. The testimonial widgets are beautiful and easy to embed.", name: "Sarah Johnson", role: "CEO, TechStart", avatar: "SJ" },
  { quote: "We went from 0 to 200+ testimonials in just 2 months. Our customers love how easy it is to leave video reviews.", name: "Michael Chen", role: "Founder, SaaSify", avatar: "MC" },
  { quote: "The Wall of Love widget is absolutely stunning. It's the first thing visitors notice on our landing page.", name: "Emily Rodriguez", role: "Head of Marketing, GrowthCo", avatar: "ER" },
  { quote: "Finally, a testimonial tool that's both powerful AND beautiful. TrustWall is now essential to our sales process.", name: "David Kim", role: "Sales Director, CloudBase", avatar: "DK" },
  { quote: "Setting up took less than 5 minutes. I was collecting video testimonials the same day. Absolutely brilliant!", name: "Jessica Thompson", role: "Product Manager, AppFlow", avatar: "JT" },
  { quote: "Our conversion rate jumped 25% after adding TrustWall testimonials. The ROI is incredible.", name: "Ryan Martinez", role: "CEO, MarketPro", avatar: "RM" },
  { quote: "The embed codes work flawlessly with our React app. Best testimonial solution we've tried.", name: "Amanda Lee", role: "CTO, DevStack", avatar: "AL" },
  { quote: "Video testimonials were a game-changer for us. TrustWall made it so easy to collect and display them.", name: "Chris Brown", role: "Founder, VideoFirst", avatar: "CB" },
  { quote: "I love how professional everything looks. Our testimonials now match our premium brand perfectly.", name: "Sophie Anderson", role: "Brand Manager, LuxeStyle", avatar: "SA" },
  { quote: "TrustWall's analytics helped us understand which testimonials drive the most conversions.", name: "James Wilson", role: "Growth Lead, MetricsMaster", avatar: "JW" },
  { quote: "The star ratings and customizable themes are perfect. We can match any client's branding.", name: "Olivia Taylor", role: "Agency Owner, DigitalEdge", avatar: "OT" },
  { quote: "Customer support is exceptional. They helped us set up a custom integration in no time.", name: "Nathan Davis", role: "Tech Lead, IntegrateHub", avatar: "ND" },
  { quote: "We embedded TrustWall on our pricing page and saw immediate improvement in conversions.", name: "Maria Garcia", role: "VP Sales, PriceSmart", avatar: "MG" },
  { quote: "The multi-space feature is perfect for our agency. We manage all clients from one dashboard.", name: "Alex Turner", role: "Agency Director, WebPro", avatar: "AT" },
  { quote: "Collecting testimonials used to be a chore. TrustWall automated the entire process for us.", name: "Laura White", role: "Operations, StreamLine", avatar: "LW" },
  { quote: "The Wall of Love is my favorite feature. It's like having a live feed of happy customers.", name: "Daniel Moore", role: "Founder, HappyClients", avatar: "DM" },
  { quote: "TrustWall integrates beautifully with our Webflow site. The widgets are responsive and fast.", name: "Rachel Green", role: "Designer, PixelPerfect", avatar: "RG" },
  { quote: "We replaced three different tools with TrustWall. It does everything we need in one place.", name: "Kevin Scott", role: "Product Lead, AllInOne", avatar: "KS" },
  { quote: "The form customization is amazing. We match our brand colors and even add custom questions.", name: "Hannah Baker", role: "Marketing Lead, BrandFirst", avatar: "HB" },
  { quote: "Our team loves the notification system. We never miss a new testimonial submission now.", name: "Tom Harris", role: "Customer Success, NotifyPro", avatar: "TH" }
];

// Get a random testimonial on component mount
const getRandomTestimonial = () => testimonials[Math.floor(Math.random() * testimonials.length)];

const ForgotPassword = () => {
  // Random testimonial for branding side
  const [randomTestimonial] = useState(getRandomTestimonial);
  
  // --- STATE ---
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error State
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  // --- HELPERS ---
  const clearFieldError = (field) => {
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
    setError('');
  };

  // --- STEP 1: SEND OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate Email
    if (!email.trim()) {
      setFieldErrors(prev => ({ ...prev, email: "Email is required." }));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldErrors(prev => ({ ...prev, email: "Please enter a valid email." }));
      return;
    }

    setLoading(true);

    try {
      // 1. Pre-check: Does email exist?
      const { data: emailExists, error: rpcError } = await supabase.rpc('check_email_exists', { 
        email_to_check: email 
      });

      if (rpcError) throw rpcError;

      if (!emailExists) {
        setFieldErrors(prev => ({ ...prev, email: "This email is not registered." }));
        setLoading(false);
        return;
      }

      // 2. Send Password Reset OTP
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      setStep(2);
      toast.success('Reset code sent!', { description: `We sent a code to ${email}` });

    } catch (error) {
      setError(error.message);
      toast.error('Failed to send code', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: VERIFY OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length < 6) {
      setFieldErrors(prev => ({ ...prev, otp: "Please enter the 6-digit code." }));
      return;
    }

    setLoading(true);

    try {
      // Verify OTP (Type: recovery)
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery',
      });

      if (error) throw error;

      // OTP Correct -> Move to New Password
      setStep(3);
      toast.success('Code verified!', { description: 'Now set your new password.' });

    } catch (error) {
      setFieldErrors(prev => ({ ...prev, otp: "Invalid or expired OTP." }));
      setError("Invalid code. Please try again.");
      toast.error('Verification failed', { description: 'Invalid or expired code.' });
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 3: UPDATE PASSWORD ---
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    let isValid = true;
    const newErrors = { password: '', confirmPassword: '' };

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    if (!isValid) {
      setFieldErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }

    setLoading(true);

    try {
      // 1. Update the password
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;

      // Kill the session immediately
      await supabase.auth.signOut();
      localStorage.clear();

      // 2. Show Success UI
      setStep(4);
      toast.success('Password updated!', { description: 'You can now log in with your new password.' });
      
      // 3. Redirect to Login
      setTimeout(() => {
        navigate('/login');
      }, 5000);

    } catch (error) {
      setError(error.message);
      toast.error('Update failed', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 1: return <Star className="w-6 h-6 text-white fill-white" />;
      case 2: return <Shield className="w-6 h-6 text-white" />;
      case 3: return <Lock className="w-6 h-6 text-white" />;
      case 4: return <CheckCircle2 className="w-6 h-6 text-white" />;
      default: return <Star className="w-6 h-6 text-white fill-white" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Forgot password?";
      case 2: return "Verify your email";
      case 3: return "Create new password";
      case 4: return "Password updated!";
      default: return "Reset Password";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return "No worries, we'll send you reset instructions.";
      case 2: return `Enter the 6-digit code sent to ${email}`;
      case 3: return "Create a strong password for your account.";
      case 4: return "Your password has been successfully reset.";
      default: return "";
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password - TrustWall</title>
      </Helmet>
      
      <div className="min-h-screen flex">
        {/* Left Side - Branding (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
          </div>

          <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
            {/* Logo - Top */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Star className="w-7 h-7 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold text-white">TrustWall</span>
            </Link>

            {/* Testimonial Card - Center */}
            <div className="flex-1 flex items-center justify-center py-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                className="bg-white rounded-2xl p-8 shadow-2xl shadow-black/20 max-w-md w-full"
              >
                {/* Quote */}
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  "{randomTestimonial.quote}"
                </p>
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-lg">
                    {randomTestimonial.avatar}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-lg">{randomTestimonial.name}</p>
                    <p className="text-gray-500 text-base">{randomTestimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom - Security note */}
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Shield className="w-4 h-4" />
              <span>Your account security is our priority</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <Link to="/" className="flex lg:hidden items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                TrustWall
              </span>
            </Link>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-violet-500/10 border border-gray-100 dark:border-gray-800 p-8"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 shadow-lg shadow-violet-500/25 ${
                  step === 4 
                    ? 'bg-gradient-to-br from-green-400 to-emerald-600' 
                    : 'bg-gradient-to-br from-violet-600 to-indigo-600'
                }`}>
                  {getStepIcon()}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getStepTitle()}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  {getStepDescription()}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {/* STEP 1: EMAIL INPUT */}
                {step === 1 && (
                  <motion.form 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSendOtp} 
                    className="space-y-5" 
                    noValidate
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email" className={`text-sm font-medium ${fieldErrors.email ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>
                        Email address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        onFocus={() => clearFieldError('email')}
                        className={`h-12 rounded-xl px-4 ${fieldErrors.email 
                          ? "border-red-500 focus-visible:ring-red-500" 
                          : "border-gray-200 dark:border-gray-700 focus-visible:ring-violet-500"}`}
                      />
                      {fieldErrors.email && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {fieldErrors.email}
                        </motion.p>
                      )}
                    </div>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      >
                        <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</span>
                      </motion.div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 font-medium text-base shadow-lg shadow-violet-500/25" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                      Send Reset Code
                    </Button>
                  </motion.form>
                )}

                {/* STEP 2: OTP INPUT */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-center py-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-violet-400 rounded-full blur-xl opacity-30 animate-pulse" />
                        <div className="relative bg-gradient-to-br from-violet-500 to-indigo-600 p-5 rounded-2xl">
                          <Mail className="w-10 h-10 text-white" />
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={otp}
                          onChange={(val) => { setOtp(val); setError(''); clearFieldError('otp'); }}
                          className="gap-3"
                        >
                          <InputOTPGroup className="gap-2">
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                              <InputOTPSlot 
                                key={index}
                                index={index} 
                                className={`w-12 h-14 text-xl font-semibold rounded-xl border-2 ${fieldErrors.otp 
                                  ? "border-red-500 text-red-500" 
                                  : "border-gray-200 dark:border-gray-700 focus:border-violet-500"}`} 
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      {fieldErrors.otp && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-red-500 text-center font-medium flex items-center justify-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {fieldErrors.otp}
                        </motion.p>
                      )}

                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                        >
                          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                          <span className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</span>
                        </motion.div>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 font-medium text-base shadow-lg shadow-violet-500/25" 
                        disabled={loading || otp.length < 6}
                      >
                        {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        Verify Code
                      </Button>
                    </form>

                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        Didn't receive code?{' '}
                        <button type="button" onClick={handleSendOtp} className="text-violet-600 hover:underline font-medium">
                          Resend
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: NEW PASSWORD */}
                {step === 3 && (
                  <motion.form 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleUpdatePassword} 
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="password" className={`text-sm font-medium ${fieldErrors.password ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(''); }}
                          onFocus={() => clearFieldError('password')}
                          className={`h-12 rounded-xl px-4 pr-12 ${fieldErrors.password 
                            ? "border-red-500 focus-visible:ring-red-500" 
                            : "border-gray-200 dark:border-gray-700 focus-visible:ring-violet-500"}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {fieldErrors.password}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className={`text-sm font-medium ${fieldErrors.confirmPassword ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                          onFocus={() => clearFieldError('confirmPassword')}
                          className={`h-12 rounded-xl px-4 pr-12 ${fieldErrors.confirmPassword 
                            ? "border-red-500 focus-visible:ring-red-500" 
                            : "border-gray-200 dark:border-gray-700 focus-visible:ring-violet-500"}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {fieldErrors.confirmPassword && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {fieldErrors.confirmPassword}
                        </motion.p>
                      )}
                    </div>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      >
                        <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</span>
                      </motion.div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 font-medium text-base shadow-lg shadow-violet-500/25" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                      Reset Password
                    </Button>
                  </motion.form>
                )}

                {/* STEP 4: SUCCESS */}
                {step === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4 space-y-6"
                  >
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-30 animate-pulse" />
                        <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Your password has been successfully reset. You can now log in with your new credentials.
                      </p>
                      
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 py-3 px-5 rounded-full mb-6">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting to login...
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700" 
                        onClick={() => navigate('/login')}
                      >
                        Go to Login Now
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* BACK TO LOGIN LINK (Only for steps 1-3) */}
              {step < 4 && (
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm text-gray-500 hover:text-violet-600 font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
