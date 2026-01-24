/**
 * HowItWorks - Three Step Process Section
 * 
 * Clean, animated section showing the three-step process.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FolderPlus, Send, Code, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { howItWorksSteps } from '@/data/landingPageData';

// Icon mapping
const iconMap = {
  FolderPlus,
  Send,
  Code,
};

const HowItWorks = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Three simple steps to social proof success
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
            {/* Connection line (desktop) - positioned below step numbers */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 -z-10">
              <div className="h-full bg-gradient-to-r from-violet-200 via-violet-300 to-violet-200 dark:from-violet-800/50 dark:via-violet-600/50 dark:to-violet-800/50" />
            </div>

            {howItWorksSteps.map((step, index) => {
              const Icon = iconMap[step.icon] || FolderPlus;

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className="relative h-full bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-visible">
                    {/* Step number badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/30">
                        {step.step}
                      </div>
                    </div>

                    <CardContent className="pt-10 pb-8 px-6 text-center">
                      {/* Icon */}
                      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 rounded-2xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-600 dark:text-slate-400">
                        {step.description}
                      </p>
                    </CardContent>

                    {/* Arrow (visible on mobile between cards) */}
                    {index < howItWorksSteps.length - 1 && (
                      <div className="md:hidden flex justify-center py-4">
                        <ArrowRight className="w-6 h-6 text-violet-300 dark:text-violet-700 rotate-90" />
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
