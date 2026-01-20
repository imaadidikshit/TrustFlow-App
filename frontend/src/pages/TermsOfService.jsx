/**
 * TermsOfService - Terms of Service Page
 * 
 * Required for Google OAuth Verification.
 * Clean, readable legal page with proper structure.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar } from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';
import { companyInfo, legalPageData } from '@/data/landingPageData';

const TermsOfService = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
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
                <FileText className="w-3 h-3 mr-1" />
                Legal
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Terms of Service
              </h1>
              
              <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>Last Updated: {legalPageData.termsOfService.lastUpdated}</span>
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
                    1. Agreement to Terms
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    By accessing or using {companyInfo.name}'s services, website, or applications 
                    (collectively, the "Services"), you agree to be bound by these Terms of Service 
                    ("Terms"). If you do not agree to these Terms, please do not use our Services.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                    These Terms apply to all visitors, users, and others who access or use the Services. 
                    By using the Services, you represent that you are at least 18 years of age and have 
                    the legal capacity to enter into these Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    2. Description of Services
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {companyInfo.name} provides a platform for collecting, managing, and displaying 
                    customer testimonials. Our Services include:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 mt-4">
                    <li>Testimonial collection forms and pages</li>
                    <li>Video and text testimonial recording</li>
                    <li>Embeddable widgets for displaying testimonials</li>
                    <li>Dashboard for managing testimonials and spaces</li>
                    <li>Integration tools and APIs</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    3. User Accounts
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    To access certain features of our Services, you must create an account. When 
                    creating an account, you agree to:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 mt-4">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Keep your password secure and confidential</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                    We reserve the right to suspend or terminate your account at any time for 
                    violations of these Terms or for any other reason at our sole discretion.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    4. Acceptable Use Policy
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    You agree not to use our Services to:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe upon the intellectual property rights of others</li>
                    <li>Transmit harmful, offensive, or misleading content</li>
                    <li>Engage in fraudulent or deceptive practices</li>
                    <li>Collect or harvest user data without consent</li>
                    <li>Interfere with or disrupt the Services</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use the Services for spam or unsolicited communications</li>
                    <li>Create fake testimonials or manipulate reviews</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    5. User Content
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    You retain ownership of all content you submit through our Services ("User Content"). 
                    By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free 
                    license to use, store, display, and distribute your User Content solely for the 
                    purpose of providing our Services.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                    You represent and warrant that you have all necessary rights to submit User Content 
                    and that your User Content does not violate any third-party rights or applicable laws.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    6. Intellectual Property
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    The Services and their original content, features, and functionality are owned by 
                    {companyInfo.name} and are protected by international copyright, trademark, patent, 
                    trade secret, and other intellectual property laws.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                    Our trademarks and trade dress may not be used in connection with any product or 
                    service without our prior written consent.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    7. Payment and Billing
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Certain features of our Services require payment. By subscribing to a paid plan, 
                    you agree to pay all applicable fees. All fees are non-refundable except as 
                    expressly stated in our refund policy.
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 mt-4">
                    <li>Subscription fees are billed in advance on a monthly or annual basis</li>
                    <li>You authorize us to charge your payment method on a recurring basis</li>
                    <li>Prices may be changed with 30 days' notice</li>
                    <li>Failure to pay may result in suspension or termination of your account</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    8. Cancellation and Refunds
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    You may cancel your subscription at any time. Upon cancellation:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 mt-4">
                    <li>Your access will continue until the end of the current billing period</li>
                    <li>No refunds will be provided for partial periods</li>
                    <li>You may request a full refund within 30 days of your first purchase</li>
                    <li>Data may be retained for a reasonable period after cancellation</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    9. Disclaimer of Warranties
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                    EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES 
                    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                    We do not guarantee that the Services will be uninterrupted, secure, or error-free. 
                    We are not responsible for any content or communications transmitted through our Services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    10. Limitation of Liability
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, {companyInfo.name.toUpperCase()} SHALL NOT 
                    BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, 
                    OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                    Our total liability for any claims related to the Services shall not exceed the 
                    amount you paid us in the twelve (12) months preceding the claim.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    11. Indemnification
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    You agree to indemnify and hold harmless {companyInfo.name}, its officers, directors, 
                    employees, and agents from any claims, damages, losses, liabilities, and expenses 
                    (including legal fees) arising out of your use of the Services, your User Content, 
                    or your violation of these Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    12. Modifications to Terms
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We reserve the right to modify these Terms at any time. We will provide notice of 
                    material changes by posting the updated Terms on our website and updating the 
                    "Last Updated" date. Your continued use of the Services after such changes 
                    constitutes acceptance of the new Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    13. Termination
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We may terminate or suspend your access to the Services immediately, without prior 
                    notice, for any reason, including breach of these Terms. Upon termination, your 
                    right to use the Services will cease immediately.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    14. Governing Law
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of the 
                    State of Delaware, United States, without regard to its conflict of law provisions.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    15. Dispute Resolution
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Any disputes arising from these Terms or your use of the Services shall first be 
                    resolved through good-faith negotiations. If negotiations fail, disputes shall be 
                    resolved through binding arbitration in accordance with the rules of the American 
                    Arbitration Association.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    16. Severability
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    If any provision of these Terms is found to be unenforceable or invalid, that 
                    provision shall be limited or eliminated to the minimum extent necessary, and the 
                    remaining provisions shall remain in full force and effect.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    17. Contact Information
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    If you have any questions about these Terms, please contact us at:
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
  );
};

export default TermsOfService;
