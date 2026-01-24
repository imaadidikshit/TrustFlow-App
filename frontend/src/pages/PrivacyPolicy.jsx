/**
 * PrivacyPolicy - Privacy Policy Page
 * 
 * Required for Google OAuth Verification.
 * Clean, readable legal page with proper structure.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Shield, Calendar } from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';
import { companyInfo, legalPageData } from '@/data/landingPageData';

const PrivacyPolicy = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <>
      <Helmet>
        <title>Privacy Policy - TrustWall</title>
        <meta name="description" content="TrustWall Privacy Policy - Learn how we collect, use, and protect your data." />
      </Helmet>
      <MarketingLayout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <Badge className="mb-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0">
                <Shield className="w-3 h-3 mr-1" />
                Legal
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Privacy Policy
              </h1>
              
              <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>Last Updated: {legalPageData.privacyPolicy.lastUpdated}</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    1. Introduction
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Welcome to {companyInfo.name} ("we," "our," or "us"). We are committed to protecting 
                    your personal information and your right to privacy. This Privacy Policy explains how 
                    we collect, use, disclose, and safeguard your information when you visit our website 
                    and use our services.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Please read this privacy policy carefully. If you do not agree with the terms of this 
                    privacy policy, please do not access the site or use our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    2. Information We Collect
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    We collect information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                    <li>Register for an account</li>
                    <li>Use our testimonial collection services</li>
                    <li>Contact us with inquiries or support requests</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Participate in surveys or promotions</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                    Personal Data
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Depending on your interactions with our service, personal data we collect may include:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 mt-2">
                    <li>Name and email address</li>
                    <li>Company name and job title</li>
                    <li>Profile pictures and avatars</li>
                    <li>Payment and billing information</li>
                    <li>IP address and browser information</li>
                    <li>Testimonial content (text and video)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    3. How We Use Your Information
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    We use the information we collect for various purposes, including:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                    <li>To provide and maintain our services</li>
                    <li>To process transactions and send related information</li>
                    <li>To send administrative information, updates, and security alerts</li>
                    <li>To respond to inquiries and provide customer support</li>
                    <li>To personalize and improve user experience</li>
                    <li>To analyze usage patterns and improve our services</li>
                    <li>To detect, prevent, and address technical issues</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    4. How We Share Your Information
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    We may share your information in the following situations:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                    <li><strong>With Service Providers:</strong> We may share your information with third-party vendors who perform services on our behalf (e.g., payment processing, analytics, hosting).</li>
                    <li><strong>For Business Transfers:</strong> In connection with any merger, acquisition, or sale of company assets.</li>
                    <li><strong>With Your Consent:</strong> When you give us explicit permission to share your data.</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
                  </ul>
                </section>

                <section id="cookies">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    5. Cookies and Tracking Technologies
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We use cookies and similar tracking technologies to collect and track information about 
                    your browsing activities. Cookies are small data files placed on your device. You can 
                    instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                    We use the following types of cookies:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 mt-2">
                    <li><strong>Essential Cookies:</strong> Required for the operation of our website.</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
                    <li><strong>Functional Cookies:</strong> Remember your preferences and settings.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    6. Data Security
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your 
                    personal information. However, no method of transmission over the Internet or electronic 
                    storage is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    7. Data Retention
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We retain your personal data only for as long as necessary to fulfill the purposes for 
                    which it was collected, including to satisfy any legal, accounting, or reporting requirements.
                  </p>
                </section>

                <section id="gdpr">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    8. Your Privacy Rights (GDPR)
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    If you are a resident of the European Economic Area (EEA), you have certain data 
                    protection rights:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                    <li><strong>Right to Access:</strong> Request copies of your personal data.</li>
                    <li><strong>Right to Rectification:</strong> Request correction of inaccurate data.</li>
                    <li><strong>Right to Erasure:</strong> Request deletion of your personal data.</li>
                    <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing.</li>
                    <li><strong>Right to Data Portability:</strong> Request transfer of your data.</li>
                    <li><strong>Right to Object:</strong> Object to processing of your personal data.</li>
                  </ul>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                    To exercise any of these rights, please contact us at {companyInfo.supportEmail}.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    9. California Privacy Rights (CCPA)
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    California residents have specific rights regarding their personal information under the 
                    California Consumer Privacy Act (CCPA). You have the right to request disclosure of 
                    information we collect, request deletion of your data, and opt-out of the sale of 
                    personal information (we do not sell personal information).
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    10. Children's Privacy
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Our services are not directed to individuals under the age of 13. We do not knowingly 
                    collect personal information from children under 13. If we become aware that we have 
                    collected personal data from a child under 13, we will take steps to delete such information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    11. Changes to This Privacy Policy
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any changes 
                    by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
                    You are advised to review this Privacy Policy periodically for any changes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    12. Contact Us
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    If you have any questions about this Privacy Policy or our data practices, please 
                    contact us at:
                  </p>
                  <div className="mt-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-slate-900 dark:text-white font-semibold">{companyInfo.name}</p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Email: <a href={`mailto:${companyInfo.supportEmail}`} className="text-violet-600 hover:underline">{companyInfo.supportEmail}</a>
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Website: <a href={companyInfo.website} className="text-violet-600 hover:underline">{companyInfo.website}</a>
                    </p>
                  </div>
                </section>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </MarketingLayout>
    </>
  );
};

export default PrivacyPolicy;
