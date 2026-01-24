import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, signOut as supabaseSignOut } from '@/lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState('system'); // 'light', 'dark', 'system'

  // Apply theme to document
  const applyTheme = useCallback((themePreference) => {
    const root = document.documentElement;
    
    if (themePreference === 'system') {
      // Follow system preference
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (themePreference === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // Listen for system theme changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  // Set theme and persist to DB
  const setTheme = useCallback(async (newTheme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // Persist to localStorage for immediate effect on next load
    localStorage.setItem('theme_preference', newTheme);
    
    // Persist to database if user is logged in
    if (user?.id) {
      try {
        await supabase
          .from('profiles')
          .update({ theme_preference: newTheme })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    }
  }, [user, applyTheme]);

  // Helper: Fetch Profile from DB
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      setProfile(data || null);
      
      // Apply theme from profile if available
      if (data?.theme_preference) {
        setThemeState(data.theme_preference);
        applyTheme(data.theme_preference);
        localStorage.setItem('theme_preference', data.theme_preference);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [applyTheme]);

  // Initialize theme from localStorage on mount
  // BUT only apply user's theme if they are logged in (check happens in fetchProfile)
  // For public pages, keep light theme as default
  useEffect(() => {
    // Don't apply any theme on initial mount - let it be light by default
    // User's theme will be applied after login when fetchProfile runs
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // 1. MANUAL TOKEN PARSING (The Fix)
        // If we see a hash with access_token, manually set the session
        if (window.location.hash && window.location.hash.includes('access_token')) {
          const params = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (!error && data.session) {
              console.log("Manual session set successfully");
              // Clear the ugly hash from the URL
              window.history.replaceState(null, '', window.location.pathname);
            }
          }
        }

        // 2. Standard Session Check
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          const currentUser = session?.user || null;
          setUser(currentUser);
          if (currentUser) {
            fetchProfile(currentUser.id);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth Init Error:', error);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // 3. Listen for changes (Sign In / Sign Out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        if (currentUser) {
          fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = async () => {
    try {
      // 1. Tell Supabase to kill the session on the server
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      // 2. Remove dark theme for public pages (user's theme shouldn't persist after logout)
      document.documentElement.classList.remove('dark');
      
      // 3. Force clear ALL local storage (Removes the cached Supabase token)
      localStorage.clear();
      sessionStorage.clear();

      // 4. Reset User State (if you have a setUser function)
      // If 'setUser' is also not defined, you can remove this line too, 
      // but it is usually present in AuthContext.
      if (typeof setUser === 'function') {
        setUser(null);
      }

      // 5. HARD Redirect to login
      // This forces a browser refresh, which wipes all React memory/state
      // making 'setSession(null)' unnecessary.
      window.location.replace('/login'); 
    }
  };

  const value = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile: useCallback(() => user && fetchProfile(user.id), [user, fetchProfile]),
    theme,
    setTheme,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};