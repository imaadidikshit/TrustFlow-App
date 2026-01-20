/**
 * NewLanding - Premium Marketing Landing Page
 * 
 * A high-conversion landing page with glassmorphism, gradient accents,
 * and smooth Framer Motion animations. Uses the marketing component library.
 * 
 * This is separate from the original Landing.jsx to preserve existing logic.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MarketingLayout } from '@/components/marketing';
import HeroSection from '@/components/marketing/HeroSection';
import LogoMarquee from '@/components/marketing/LogoMarquee';
import FrameworkLogos from '@/components/marketing/FrameworkLogos';
import BentoGrid from '@/components/marketing/BentoGrid';
import HowItWorks from '@/components/marketing/HowItWorks';
import TestimonialGrid from '@/components/marketing/TestimonialGrid';
import CTASection from '@/components/marketing/CTASection';

const NewLanding = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is logged in, don't render (will redirect)
  if (user) {
    return null;
  }

  return (
    <MarketingLayout>
      {/* Hero Section with animated background */}
      <HeroSection />

      {/* Social Proof - Logo Marquee */}
      <LogoMarquee />

      {/* How It Works */}
      <HowItWorks />

      {/* Feature Highlights - Bento Grid */}
      <BentoGrid />

      {/* Framework Integrations */}
      <FrameworkLogos />

      {/* Wall of Love - Testimonials */}
      <TestimonialGrid maxItems={4} />

      {/* Bottom CTA */}
      <CTASection />
    </MarketingLayout>
  );
};

export default NewLanding;
