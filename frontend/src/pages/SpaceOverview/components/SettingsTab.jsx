import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, Trash2, Globe, Mail, Download, AlertTriangle, 
  CheckCircle, AlertCircle, Save, Loader2, Lock, ShieldAlert,
  X, Check
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import confetti from 'canvas-confetti';

// --- SHARED COMPONENTS ---

// 1. Premium Notification Toast (Center Position)
const NotificationToast = ({ message, type, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-10 left-1/2 z-[10000] flex items-center justify-center gap-3 px-6 py-3.5 rounded-full shadow-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 w-auto max-w-[90vw] whitespace-nowrap"
        >
          {type === 'success' ? (
            <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="bg-red-100 dark:bg-red-900/30 p-1 rounded-full shrink-0">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          )}
          <span className={`text-sm font-medium truncate ${type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-200'}`}>
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 2. NEW: Smart Confirmation Modal (Works for Google/OAuth Users)
// PasswordModal ko hata kar ye lagaya hai.
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isProcessing, actionType, expectedMatch }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setError(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (inputValue === expectedMatch) {
      onConfirm();
    } else {
      setError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 w-screen h-screen bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-[9991] p-6"
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {actionType === 'delete' ? 'Delete Space?' : 'Change Critical Settings?'}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. To confirm, please type <span className="font-mono font-bold text-gray-900 dark:text-gray-200 select-all">{expectedMatch}</span> below.
            </p>
          </div>

          <div className="space-y-4">
            <Input 
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError(false);
              }}
              placeholder={`Type ${expectedMatch}`}
              className={error ? "border-red-500 ring-red-500 focus-visible:ring-red-500" : ""}
            />
            {error && <p className="text-xs text-red-500">Value does not match.</p>}
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isProcessing || inputValue !== expectedMatch}
                variant="destructive"
                className="flex-1"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "I understand, confirm"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const SettingsTab = ({ space, spaceId, navigate, deleteSpace, updateSpaceState, userEmail }) => {
  // State for editable fields
  const [spaceName, setSpaceName] = useState(space.space_name || '');
  
  // --- SLUG VALIDATION LOGIC ---
  const [spaceSlug, setSpaceSlug] = useState(space.slug || '');
  const [slugStatus, setSlugStatus] = useState('idle');
  const [slugError, setSlugError] = useState('');
  
  // State for toggles
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(false);

  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notification, setNotification] = useState({ isVisible: false, message: '', type: 'success' });
  
  // MODAL STATES (Updated for new logic)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'delete' or 'update_slug'
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const showToast = (message, type = 'success') => {
    setNotification({ isVisible: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, isVisible: false })), 3000);
  };

  // --- LIVE SLUG CHECKER ---
  useEffect(() => {
    const originalSlug = space.slug;
    
    if (spaceSlug === originalSlug) {
      setSlugStatus('idle');
      setSlugError('');
      return;
    }

    if (!spaceSlug || spaceSlug.length < 3) {
      setSlugStatus('error');
      setSlugError('Slug must be at least 3 characters.');
      return;
    }

    if (!/^[a-z0-9-]+$/.test(spaceSlug)) {
        setSlugStatus('error');
        setSlugError('Only lowercase letters, numbers, and dashes allowed.');
        return;
    }

    setSlugStatus('checking');
    setSlugError('');

    const timer = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('spaces')
          .select('id')
          .eq('slug', spaceSlug)
          .neq('id', spaceId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setSlugStatus('taken');
          setSlugError('Slug not available.');
        } else {
          setSlugStatus('available');
          setSlugError('');
        }
      } catch (err) {
        console.error("Slug check failed", err);
        setSlugStatus('error');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [spaceSlug, space.slug, spaceId]);


  // --- HANDLER: INITIATE SAVE ---
  const initiateGeneralSave = () => {
    if (slugStatus === 'taken' || slugStatus === 'checking' || slugStatus === 'error') return;
    
    // Agar Slug change ho raha hai, to Confirmation Modal kholo
    if (spaceSlug !== space.slug) {
      setConfirmAction('update_slug');
      setShowConfirmModal(true);
    } else {
      // Sirf naam change ho raha hai, seedha save karo
      handleGeneralSave();
    }
  };

  // --- CORE ACTIONS (Save/Delete) ---
  
  const handleGeneralSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('spaces')
        .update({ space_name: spaceName, slug: spaceSlug })
        .eq('id', spaceId);

      if (error) throw error;
      
      updateSpaceState({ space_name: spaceName, slug: spaceSlug });
      setShowConfirmModal(false); // Close modal if open

      // Success Effect
      setSaveSuccess(true);
      const scalar = 2;
      confetti({
        particleCount: 100, spread: 70, origin: { y: 0.6 },
        colors: ['#8b5cf6', '#10b981', '#3b82f6'],
        disableForReducedMotion: true
      });
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (error) {
      console.error(error);
      showToast("Something went wrong.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalDelete = async () => {
    setIsProcessingAction(true);
    try {
      await deleteSpace(); 
      navigate('/dashboard'); 
    } catch (error) {
      setShowConfirmModal(false);
      showToast("Delete failed. Please try again.", "error");
      setIsProcessingAction(false);
    }
  };

  // --- ROUTER FOR CONFIRMATION ---
  const onModalConfirm = () => {
    if (confirmAction === 'delete') {
      handleFinalDelete();
    } else if (confirmAction === 'update_slug') {
      handleGeneralSave();
    }
  };

  // --- EXPORT DATA ---
  const handleExportData = async (format = 'csv') => {
    try {
      const { data, error } = await supabase.from('testimonials').select('*').eq('space_id', spaceId);
      if (error) throw error;
      if (!data || data.length === 0) { showToast("No data to export", "error"); return; }

      const cleanedData = data.map(item => ({
        Date: new Date(item.created_at).toLocaleDateString(),
        Name: item.respondent_name || 'Anonymous',
        Email: item.respondent_email || '-',
        Rating: item.rating || '-',
        Message: item.content || '-',
        Type: item.type
      }));

      const headers = Object.keys(cleanedData[0]).join(",");
      const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + cleanedData.map(row => Object.values(row).map(val => `"${val}"`).join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${spaceSlug}_testimonials.${format === 'excel' ? 'xls' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Exported as ${format.toUpperCase()}`, "success");
    } catch (error) {
      showToast("Export failed.", "error");
    }
  };

  const getSlugInputClass = () => {
    if (slugStatus === 'checking') return 'border-blue-300 focus-visible:ring-blue-300';
    if (slugStatus === 'available') return 'border-green-500 focus-visible:ring-green-500';
    if (slugStatus === 'taken' || slugStatus === 'error') return 'border-red-500 focus-visible:ring-red-500';
    return '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 px-2 sm:px-0">
      
      <NotificationToast message={notification.message} type={notification.type} isVisible={notification.isVisible} />

      {/* NEW SMART CONFIRMATION MODAL */}
      <ConfirmationModal 
        isOpen={showConfirmModal}
        onClose={() => {
            setShowConfirmModal(false);
            setIsProcessingAction(false);
        }}
        onConfirm={onModalConfirm}
        isProcessing={isProcessingAction || isSaving}
        actionType={confirmAction}
        // Agar delete kar rahe hain toh CURRENT slug mangao, agar update kar rahe hain toh bhi CURRENT slug confirm karao
        expectedMatch={space.slug} 
      />

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Space Settings</h2>
        <p className="text-muted-foreground">Manage your space preferences and advanced configurations.</p>
      </div>

      <div className="grid gap-6">
        
        {/* 1. GENERAL SETTINGS */}
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/20 rounded-lg">
                <Globe className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-lg">General Settings</CardTitle>
                <CardDescription>Update your space's public identity.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="spaceName">Space Name</Label>
              <Input 
                id="spaceName" value={spaceName} onChange={(e) => setSpaceName(e.target.value)}
                className="max-w-md bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="spaceSlug">Space URL (Slug)</Label>
              <div className="relative max-w-sm">
                <div className="flex items-center">
                  <Badge variant="outline" className="text-muted-foreground font-normal bg-gray-100 dark:bg-gray-800 h-10 px-3 rounded-r-none border-r-0 border-gray-200 dark:border-gray-700 hidden sm:flex">
                    trustflow.app/submit/
                  </Badge>
                  <div className="relative flex-1">
                    <Input 
                        id="spaceSlug" 
                        value={spaceSlug} 
                        onChange={(e) => setSpaceSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                        className={`sm:rounded-l-none pr-10 bg-white dark:bg-gray-950 transition-colors duration-200 ${getSlugInputClass()}`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {slugStatus === 'checking' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                        {slugStatus === 'available' && <CheckCircle className="w-4 h-4 text-green-500 animate-in zoom-in" />}
                        {(slugStatus === 'taken' || slugStatus === 'error') && <X className="w-4 h-4 text-red-500 animate-in zoom-in" />}
                    </div>
                  </div>
                </div>
                <div className="mt-1.5 h-4 text-[11px] font-medium">
                    {slugStatus === 'available' && <span className="text-green-600 flex items-center gap-1">Slug is available</span>}
                    {slugStatus === 'taken' && <span className="text-red-600 flex items-center gap-1">Slug taken.</span>}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 py-3">
            <Button 
                onClick={initiateGeneralSave} 
                disabled={isSaving || slugStatus === 'taken' || slugStatus === 'checking' || slugStatus === 'error'} 
                className={`ml-auto transition-all duration-300 ${saveSuccess ? 'bg-green-600 w-32' : 'bg-violet-600 w-36'}`}
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : saveSuccess ? <>Saved!</> : <>Save Changes</>}
            </Button>
          </CardFooter>
        </Card>

        {/* 2. NOTIFICATIONS & EXPORT (Same as before) */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg"><Mail className="w-5 h-5 text-blue-600" /></div>
                <CardTitle className="text-lg">Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="email-notif">Email Alerts</Label>
                <Switch id="email-notif" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="browser-notif">Browser Notifications</Label>
                <Switch id="browser-notif" checked={browserNotifications} onCheckedChange={setBrowserNotifications} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg"><Download className="w-5 h-5 text-green-600" /></div>
                <CardTitle className="text-lg">Export Data</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">Download a clean report of your testimonials.</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleExportData('csv')}>CSV</Button>
                <Button variant="outline" className="flex-1" onClick={() => handleExportData('excel')}>Excel</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. DANGER ZONE (Updated to use Confirm Action) */}
        <Card className="border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
              <div>
                <CardTitle className="text-lg text-red-700 dark:text-red-400">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions for this space.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-gray-950 rounded-lg border border-red-100 dark:border-red-900/30 gap-4">
              <div className="text-center sm:text-left">
                <h4 className="font-medium text-red-900 dark:text-red-300">Delete this Space</h4>
                <p className="text-sm text-muted-foreground">Permanently remove this space and all of its data.</p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => {
                  setConfirmAction('delete');
                  setShowConfirmModal(true);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Space
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default SettingsTab;