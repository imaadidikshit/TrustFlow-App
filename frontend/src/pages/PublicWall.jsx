import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Star, Play, ChevronLeft, ChevronRight, BadgeCheck, Loader2, ExternalLink, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// --- Video Player Component ---
const VideoPlayer = ({ videoUrl, corners = 'rounded-xl' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayClick = () => {
    if (videoRef.current) videoRef.current.play();
  };

  return (
    <div className={`relative overflow-hidden bg-black shadow-md ring-1 ring-black/5 aspect-video mb-4 ${corners}`}>
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        controls={isPlaying}
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors backdrop-blur-[1px] cursor-pointer z-10"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg"
            >
              <Play className="w-5 h-5 text-white fill-white ml-1" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Loading Skeleton ---
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <header className="py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <Skeleton className="w-16 h-16 rounded-full mb-4" />
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
    </header>
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </main>
  </div>
);

// --- Error State ---
const ErrorState = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center p-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Heart className="w-8 h-8 text-red-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-slate-600 mb-4">{message}</p>
      <Button onClick={() => window.location.href = '/'}>
        Go Home
      </Button>
    </div>
  </div>
);

// --- Constants ---
const CARD_WIDTH = 300;
const GAP = 24;

// --- Main Public Wall Component ---
const PublicWall = () => {
  const { identifier } = useParams(); // Can be username or space_id
  
  // State
  const [space, setSpace] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const containerRef = useRef(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to find space by slug first, then by ID
        let spaceData = null;
        
        // Try slug
        const { data: slugData, error: slugError } = await supabase
          .from('spaces')
          .select('*, profiles(full_name, avatar_url)')
          .eq('slug', identifier)
          .single();

        if (slugData) {
          spaceData = slugData;
        } else {
          // Try ID
          const { data: idData, error: idError } = await supabase
            .from('spaces')
            .select('*, profiles(full_name, avatar_url)')
            .eq('id', identifier)
            .single();
          
          if (idData) {
            spaceData = idData;
          }
        }

        if (!spaceData) {
          setError('This wall of love does not exist.');
          setLoading(false);
          return;
        }

        setSpace(spaceData);

        // Fetch testimonials
        const { data: testimonialsData } = await supabase
          .from('testimonials')
          .select('*')
          .eq('space_id', spaceData.id)
          .eq('is_liked', true)
          .order('created_at', { ascending: false });

        setTestimonials(testimonialsData || []);

        // Fetch widget settings
        const { data: widgetData } = await supabase
          .from('widget_configurations')
          .select('settings')
          .eq('space_id', spaceData.id)
          .single();

        setSettings(widgetData?.settings || getDefaultSettings());

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (identifier) {
      fetchData();
    }
  }, [identifier]);

  // Default settings
  const getDefaultSettings = () => ({
    layout: 'grid',
    theme: 'light',
    cardTheme: 'light',
    corners: 'smooth',
    shadow: 'medium',
    border: true,
    hoverEffect: 'lift',
    nameSize: 'medium',
    testimonialStyle: 'clean',
    animation: 'fade',
    speed: 'normal',
    maxCount: 12,
    showHeading: true,
    headingText: 'What people say about us',
    headingFont: 'Inter',
    headingColor: '#0f172a',
    headingBold: true,
    showSubheading: true,
    subheadingText: 'Real stories from real customers',
    subheadingFont: 'Inter',
    subheadingColor: '#64748b',
    carouselSameSize: true,
    autoScroll: false
  });

  // Process testimonials
  const displayedTestimonials = useMemo(() => {
    if (!settings) return testimonials;
    let result = [...testimonials];
    if (settings.shuffle) {
      result = result.sort(() => Math.random() - 0.5);
    }
    return result.slice(0, settings.maxCount || 12);
  }, [testimonials, settings?.shuffle, settings?.maxCount]);

  // Carousel items with clones
  const carouselItems = useMemo(() => {
    if (!settings || settings.layout !== 'carousel' || displayedTestimonials.length === 0) {
      return displayedTestimonials;
    }
    const clones = displayedTestimonials.slice(0, visibleCount + 1);
    return [...displayedTestimonials, ...clones];
  }, [displayedTestimonials, settings?.layout, visibleCount]);

  // Responsive layout
  useLayoutEffect(() => {
    if (!settings || settings.layout !== 'carousel' || !containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const count = Math.max(1, Math.floor((width + GAP) / (CARD_WIDTH + GAP)));
        setVisibleCount(count);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [settings?.layout]);

  // Navigation
  const handleNext = () => {
    if (carouselIndex >= displayedTestimonials.length - visibleCount) {
      setCarouselIndex(0);
    } else {
      setCarouselIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (carouselIndex <= 0) {
      setCarouselIndex(displayedTestimonials.length - visibleCount);
    } else {
      setCarouselIndex(prev => prev - 1);
    }
  };

  // Auto-scroll
  useEffect(() => {
    if (!settings?.autoScroll || settings?.layout !== 'carousel') return;
    
    const interval = setInterval(handleNext, (settings.scrollSpeed || 3) * 1000);
    return () => clearInterval(interval);
  }, [settings?.autoScroll, settings?.scrollSpeed, settings?.layout, carouselIndex]);

  // Card styles
  const getCardStyles = () => {
    if (!settings) return '';
    const { cardTheme, corners, shadow, border, hoverEffect, layout } = settings;
    
    let classes = 'p-5 md:p-6 flex flex-col transition-all duration-300 ';
    
    // Corners
    if (corners === 'sharp') classes += 'rounded-none ';
    else if (corners === 'round') classes += 'rounded-3xl ';
    else classes += 'rounded-xl ';

    // Shadow
    if (shadow === 'none') classes += 'shadow-none ';
    else if (shadow === 'light') classes += 'shadow-sm ';
    else if (shadow === 'strong') classes += 'shadow-xl ';
    else classes += 'shadow-md ';

    // Hover
    if (hoverEffect === 'lift') classes += 'hover:-translate-y-1 hover:shadow-lg ';
    else if (hoverEffect === 'scale') classes += 'hover:scale-[1.02] hover:shadow-lg ';
    else if (hoverEffect === 'glow') classes += 'hover:shadow-violet-500/20 hover:border-violet-300 ';

    // Theme
    if (cardTheme === 'dark') {
      classes += 'bg-slate-900 text-slate-100 ';
      classes += border ? 'border border-slate-800 ' : '';
    } else {
      classes += 'bg-white text-slate-800 ';
      classes += border ? 'border border-slate-200 ' : '';
    }

    // Layout specific
    if (layout === 'masonry') classes += 'break-inside-avoid mb-6 ';
    else if (layout === 'carousel') classes += 'flex-shrink-0 h-full ';

    return classes;
  };

  // Animation variants
  const getAnimationVariants = () => {
    if (!settings) return {};
    const { animation, speed } = settings;
    const dur = speed === 'fast' ? 0.3 : speed === 'slow' ? 0.8 : 0.5;
    
    const variants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: dur } }
    };

    switch (animation) {
      case 'slideUp': variants.hidden = { opacity: 0, y: 50 }; break;
      case 'scale': variants.hidden = { opacity: 0, scale: 0.8 }; break;
      case 'pop': 
        variants.hidden = { opacity: 0, scale: 0.5 };
        variants.visible.transition = { type: 'spring', stiffness: 300 };
        break;
    }

    return variants;
  };

  // Render testimonial card
  const renderCard = (testimonial, index) => {
    const bubbleBgClass = settings?.cardTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-100';
    const isBubble = settings?.testimonialStyle === 'bubble';

    return (
      <motion.div
        key={`${testimonial.id}-${index}`}
        variants={getAnimationVariants()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className={settings?.layout === 'carousel' ? 'w-[300px] flex-shrink-0' : ''}
      >
        <div className={getCardStyles()}>
          {/* Rating */}
          {testimonial.rating && (
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 mb-4">
            {testimonial.type === 'video' && testimonial.video_url ? (
              <VideoPlayer 
                videoUrl={testimonial.video_url} 
                corners={settings?.corners === 'sharp' ? 'rounded-none' : 'rounded-xl'} 
              />
            ) : (
              <div className={`
                ${isBubble ? `p-4 ${bubbleBgClass} rounded-lg` : ''}
                ${settings?.testimonialStyle === 'quote' ? 'pl-4 border-l-4 border-violet-400 italic' : ''}
              `}>
                <p className="text-sm leading-relaxed line-clamp-5">
                  {testimonial.content}
                </p>
              </div>
            )}
          </div>

          {/* Author */}
          <div className="flex items-center gap-3 pt-4 border-t border-dashed border-gray-200/50">
            <Avatar className="w-10 h-10 border border-white/20">
              <AvatarImage src={testimonial.respondent_photo_url} />
              <AvatarFallback className="bg-violet-100 text-violet-700 text-xs">
                {testimonial.respondent_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-sm flex items-center gap-1.5">
                {testimonial.respondent_name || "Anonymous"}
                <BadgeCheck className="w-4 h-4 text-white fill-blue-500" />
              </div>
              <div className="text-xs opacity-70">
                {testimonial.respondent_role || 'Verified User'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Loading state
  if (loading) return <LoadingSkeleton />;
  
  // Error state
  if (error) return <ErrorState message={error} />;
  
  if (!space || !settings) return <ErrorState message="Could not load this page." />;

  const isCarousel = settings.layout === 'carousel';
  const isDark = settings.theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      {/* Header */}
      <header className={`py-10 md:py-16 px-4 ${isDark ? 'border-b border-slate-800' : 'border-b border-slate-100'}`}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          {space.logo_url && (
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={space.logo_url}
              alt={space.space_name}
              className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-2xl object-cover shadow-lg"
            />
          )}
          
          {/* Heading */}
          {settings.showHeading && (
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                fontFamily: settings.headingFont,
                color: settings.headingColor,
                fontWeight: settings.headingBold ? 'bold' : 'normal'
              }}
              className="text-3xl md:text-4xl lg:text-5xl mb-4"
            >
              {settings.headingText}
            </motion.h1>
          )}
          
          {/* Subheading */}
          {settings.showSubheading && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                fontFamily: settings.subheadingFont,
                color: settings.subheadingColor
              }}
              className="text-lg md:text-xl max-w-2xl mx-auto"
            >
              {settings.subheadingText}
            </motion.p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main ref={containerRef} className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative">
        {/* Carousel Navigation */}
        {isCarousel && displayedTestimonials.length > visibleCount && (
          <>
            <button 
              onClick={handlePrev}
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110
                ${isDark ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-900 border border-slate-200'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNext}
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110
                ${isDark ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-900 border border-slate-200'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Testimonials Container */}
        <motion.div
          className={`
            ${isCarousel ? 'overflow-hidden' : ''}
          `}
        >
          <motion.div
            className={`
              ${settings.layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
              ${settings.layout === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3 gap-6' : ''}
              ${settings.layout === 'list' ? 'max-w-2xl mx-auto flex flex-col gap-6' : ''}
              ${isCarousel ? `flex gap-6 ${settings.carouselSameSize ? 'items-stretch' : 'items-start'}` : ''}
            `}
            animate={isCarousel ? { x: -(carouselIndex * (CARD_WIDTH + GAP)) } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {(isCarousel ? carouselItems : displayedTestimonials).map((testimonial, index) => 
              renderCard(testimonial, index)
            )}
          </motion.div>
        </motion.div>

        {/* Empty State */}
        {displayedTestimonials.length === 0 && (
          <div className="text-center py-16">
            <Heart className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              No testimonials yet
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`py-8 border-t ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <a 
              href="https://trustflow.app" 
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 text-sm transition-colors hover:opacity-80
                ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            >
              <Heart className="w-4 h-4 fill-violet-500 text-violet-500" />
              Powered by TrustFlow
              <ExternalLink className="w-3 h-3" />
            </a>
            
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              © {new Date().getFullYear()} {space.space_name}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicWall;
