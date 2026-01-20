/**
 * MarketingLayout - Wrapper for Public/Marketing Pages
 * 
 * Provides consistent Navbar and Footer for all public pages.
 */

import React from 'react';
import MarketingNavbar from './MarketingNavbar';
import MarketingFooter from './MarketingFooter';

const MarketingLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <MarketingNavbar />
      <main className="flex-1">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
};

export default MarketingLayout;
