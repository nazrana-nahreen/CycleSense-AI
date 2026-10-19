import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { userApi } from '../services/api';
import { 
  User, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Save,
  Camera,
  Upload,
  Heart,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Coffee,
  X,
  UserCheck
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const ProfilePrivacyPage: React.FC = () => {
  const { 
    user, 
    updateUserProfile, 
    togglePrivacyMode, 
    resetToDemoData, 
    clearAllHealthData, 
    prediction,
    language, 
    setCurrentPage,
    t 
  } = useApp();

  const isBn = language === 'bn';

  // Personal Information State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [targetCycleLength, setTargetCycleLength] = useState(user.targetCycleLength || 29);
  const [targetPeriodDuration, setTargetPeriodDuration] = useState(user.targetPeriodDuration || 5);
  const [timeZone, setTimeZone] = useState(user.timeZone || 'Asia/Dhaka (GMT+6)');

  // Notification / Feedback states
  const [isSaved, setIsSaved] = useState(false);
  const [photoFeedback, setPhotoFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showPartnerPreviewModal, setShowPartnerPreviewModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPartnerSaving, setIsPartnerSaving] = useState(false);
  const [partnerSaveSuccess, setPartnerSaveSuccess] = useState(false);

  // Partner Sharing State
  const [partnerEnabled, setPartnerEnabled] = useState(user.partnerSharing?.isEnabled ?? false);
  const [partnerName, setPartnerName] = useState(user.partnerSharing?.partnerName || '');
  const [partnerEmail, setPartnerEmail] = useState(user.partnerSharing?.partnerEmail || '');
  const [permissions, setPermissions] = useState(user.partnerSharing?.permissions || {
    sharePeriodDates: true,
    shareCyclePhase: true,
    shareMoodAndSymptoms: false,
    shareDailyTips: true,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      targetCycleLength: Number(targetCycleLength),
      targetPeriodDuration: Number(targetPeriodDuration),
      timeZone,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Avatar Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoFeedback({
        type: 'error',
        message: isBn ? 'ছবির আকার সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।' : 'Image size must be less than 5MB.',
      });
      setTimeout(() => setPhotoFeedback(null), 4000);
      return;
    }

    // Convert file to Base64 Data URL
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      updateUserProfile({ avatarUrl: base64 });
      try {
        await userApi.uploadAvatar(base64);
      } catch {
        // Optimistic update locally
      }
      setPhotoFeedback({
        type: 'success',
        message: t.profilePrivacy.photoUpdated || (isBn ? 'প্রোফাইল ছবি সফলভাবে পরিবর্তিত হয়েছে!' : 'Profile picture updated successfully!'),
      });
      setTimeout(() => setPhotoFeedback(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    updateUserProfile({ avatarUrl: '' });
    try {
      await userApi.uploadAvatar('');
    } catch {}
    setPhotoFeedback({
      type: 'success',
      message: isBn ? 'প্রোফাইল ছবি সরানো হয়েছে।' : 'Profile picture removed.',
    });
    setTimeout(() => setPhotoFeedback(null), 3000);
  };

  // Partner Sharing Settings Save
  const handleSavePartnerSettings = async () => {
    setIsPartnerSaving(true);
    const updatedSharing = {
      ...user.partnerSharing,
      isEnabled: partnerEnabled,
      partnerName,
      partnerEmail,
      permissions,
      status: partnerEnabled ? ((user.partnerSharing?.status === 'connected' ? 'connected' : 'pending') as 'connected' | 'pending') : ('inactive' as const),
      shareCode: user.partnerSharing?.shareCode || 'CYCLE-8492',
    };

    updateUserProfile({ partnerSharing: updatedSharing });

    try {
      if (partnerEnabled) {
        await userApi.invitePartner(partnerName, partnerEmail, permissions);
      } else {
        await userApi.revokePartner();
      }
    } catch {
      // Local optimistic fallback
    }

    setIsPartnerSaving(false);
    setPartnerSaveSuccess(true);
    setTimeout(() => setPartnerSaveSuccess(false), 2500);
  };

  const handleRevokePartner = async () => {
    try {
      await userApi.revokePartner();
    } catch {}

    setPartnerEnabled(false);
    setPartnerName('');
    setPartnerEmail('');
    updateUserProfile({
      partnerSharing: {
        isEnabled: false,
        partnerName: '',
        partnerEmail: '',
        shareCode: 'CYCLE-' + Math.floor(1000 + Math.random() * 9000),
        status: 'inactive',
        permissions: {
          sharePeriodDates: true,
          shareCyclePhase: true,
          shareMoodAndSymptoms: false,
          shareDailyTips: true,
        },
      },
    });
    setShowRevokeModal(false);
  };

  const handleCopyCode = () => {
    const code = user.partnerSharing?.shareCode || 'CYCLE-8492';
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const code = user.partnerSharing?.shareCode || 'CYCLE-8492';
    const link = `${window.location.origin}/#partner_view?code=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportData = () => {
    const backup = {
      user,
      cycles: JSON.parse(localStorage.getItem('cyclesense_cycles') || '[]'),
      symptoms: JSON.parse(localStorage.getItem('cyclesense_symptoms') || '[]'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyclesense-personal-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmPurge = () => {
    clearAllHealthData();
    setShowDeleteModal(false);
    alert(isBn ? 'সমস্ত স্বাস্থ্য তথ্য সফলভাবে মুছে ফেলা হয়েছে।' : 'All health entries successfully cleared.');
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto animate-fadeIn">
      {/* Page Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-plum-900 tracking-tight">
          {t.profilePrivacy.title}
        </h2>
        <p className="text-xs sm:text-sm text-plum-500 mt-0.5">
          {t.profilePrivacy.subtitle}
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-sage-800 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-sage-600 shrink-0" />
          <span>{isBn ? 'প্রোফাইল সেটিংস সফলভাবে আপডেট হয়েছে!' : 'Profile updated successfully!'}</span>
        </div>
      )}

      {photoFeedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs animate-fadeIn ${
            photoFeedback.type === 'success'
              ? 'bg-sage-50 border-sage-200 text-sage-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {photoFeedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-sage-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{photoFeedback.message}</span>
        </div>
      )}

      {/* 1. Profile Picture Management Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-rose-50 font-bold text-base text-plum-900">
          <Camera className="w-5 h-5 text-rose-500" />
          <span>{t.profilePrivacy.profilePhoto}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-5">
          {/* Avatar with Camera overlay on hover */}
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img
              src={
                user.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
              }
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-rose-200 group-hover:ring-rose-400 transition-all shadow-md"
            />
            <div className="absolute inset-0 bg-plum-950/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 bg-rose-500 text-white p-1.5 rounded-full shadow-md border-2 border-white">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <h4 className="font-bold text-sm sm:text-base text-plum-900">
              {user.name}
            </h4>
            <p className="text-xs text-plum-500">
              {t.profilePrivacy.photoSizeLimit}
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={<Upload className="w-3.5 h-3.5" />}
                onClick={() => fileInputRef.current?.click()}
              >
                {t.profilePrivacy.changePhoto}
              </Button>

              {user.avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}
                  onClick={handleRemovePhoto}
                >
                  {t.profilePrivacy.removePhoto}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Partner Cycle Sharing Card */}
      <Card className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-rose-50 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-plum-900">
                  {t.profilePrivacy.partnerSharing}
                </h3>
                {partnerEnabled ? (
                  <Badge variant="sage" size="sm">
                    {user.partnerSharing?.status === 'connected'
                      ? t.profilePrivacy.partnerStatusConnected
                      : t.profilePrivacy.partnerStatusPending}
                  </Badge>
                ) : (
                  <Badge variant="outline" size="sm">
                    {t.profilePrivacy.partnerStatusInactive}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-plum-500 mt-0.5">
                {t.profilePrivacy.partnerSubtitle}
              </p>
            </div>
          </div>

          {/* Master Enable Toggle */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={partnerEnabled}
              onChange={(e) => setPartnerEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-plum-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
          </label>
        </div>

        {partnerSaveSuccess && (
          <div className="p-3.5 rounded-2xl bg-sage-50 border border-sage-200 text-sage-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
            <span>{isBn ? 'পার্টনার শেয়ারিং সেটিংস সংরক্ষিত হয়েছে!' : 'Partner sharing preferences updated!'}</span>
          </div>
        )}

        {partnerEnabled ? (
          <div className="space-y-5 animate-fadeIn">
            {/* Share Code & Direct Link Box */}
            <div className="bg-gradient-to-br from-rose-50/70 via-peach-50/50 to-lavender-50/70 rounded-2xl p-4 sm:p-5 border border-rose-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-plum-700 block">
                    {t.profilePrivacy.shareCodeLabel}
                  </span>
                  <p className="text-[11px] text-plum-500 mt-0.5">
                    {isBn
                      ? 'এই কোডটি আপনার সঙ্গীকে দিন। তিনি কোনো পাসওয়ার্ড ছাড়াই শুধুমাত্র এই কোড দিয়ে আপনার সহযোগী ভিউ দেখতে পারবেন।'
                      : 'Share this 6-character code with your partner to grant read-only support access without exposing your account.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white px-4 py-2 rounded-xl border border-rose-200 font-mono font-bold text-sm tracking-wider text-rose-600 shadow-xs">
                    {user.partnerSharing?.shareCode || 'CYCLE-8492'}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    onClick={handleCopyCode}
                  >
                    {copiedCode ? t.profilePrivacy.copiedCode : t.profilePrivacy.copyShareCode}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-rose-200/50 gap-2">
                <span className="text-xs text-plum-600">
                  {isBn ? 'সরাসরি ব্রাউজারে খোলার লিংক:' : 'Direct Web Companion Link:'}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={copiedLink ? <Check className="w-3.5 h-3.5 text-sage-600" /> : <ExternalLink className="w-3.5 h-3.5" />}
                    onClick={handleCopyLink}
                  >
                    {copiedLink ? (isBn ? 'লিংক কপি হয়েছে!' : 'Link Copied!') : t.profilePrivacy.copyPartnerLink}
                  </Button>
                  <Button
                    variant="soft"
                    size="sm"
                    icon={<Sparkles className="w-3.5 h-3.5 text-rose-600" />}
                    onClick={() => setCurrentPage('partner_view')}
                  >
                    {isBn ? 'ভিউ ওপেন করুন' : 'Open View'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Partner Details Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-plum-700 mb-1">
                  {t.profilePrivacy.partnerNameLabel}
                </label>
                <input
                  type="text"
                  placeholder={isBn ? 'যেমন: তানভীর / প্রিয় মানুষ' : 'e.g., Alex / Supportive Partner'}
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full bg-canvas border border-rose-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-plum-700 mb-1">
                  {t.profilePrivacy.partnerEmailLabel}
                </label>
                <input
                  type="email"
                  placeholder="partner@example.com"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  className="w-full bg-canvas border border-rose-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                />
              </div>
            </div>

            {/* Granular Permissions Section */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-plum-800 uppercase tracking-wider">
                {t.profilePrivacy.permissionsHeading}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label className="flex items-start gap-3 p-3 rounded-2xl bg-canvas border border-rose-100 hover:border-rose-300 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.sharePeriodDates}
                    onChange={(e) =>
                      setPermissions((prev) => ({ ...prev, sharePeriodDates: e.target.checked }))
                    }
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-plum-900 block">
                      {t.profilePrivacy.permPeriodDates}
                    </span>
                    <span className="text-[11px] text-plum-500">
                      {isBn ? 'পরবর্তী সম্ভাব্য পিরিয়ডের দিন এবং দিন গণনা' : 'Upcoming period dates and countdown'}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-2xl bg-canvas border border-rose-100 hover:border-rose-300 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.shareCyclePhase}
                    onChange={(e) =>
                      setPermissions((prev) => ({ ...prev, shareCyclePhase: e.target.checked }))
                    }
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-plum-900 block">
                      {t.profilePrivacy.permCyclePhase}
                    </span>
                    <span className="text-[11px] text-plum-500">
                      {isBn ? 'বর্তমান বায়োলজিক্যাল ফেজ ও এনার্জির মাত্রা' : 'Estimated biological phase and energy levels'}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-2xl bg-canvas border border-rose-100 hover:border-rose-300 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.shareMoodAndSymptoms}
                    onChange={(e) =>
                      setPermissions((prev) => ({ ...prev, shareMoodAndSymptoms: e.target.checked }))
                    }
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-plum-900 block">
                      {t.profilePrivacy.permMoodSymptoms}
                    </span>
                    <span className="text-[11px] text-plum-500">
                      {isBn ? 'শারীরিক অস্বস্তি বা মেজাজের সাধারণ সংকেত' : 'High discomfort or mood shifts'}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-2xl bg-canvas border border-rose-100 hover:border-rose-300 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.shareDailyTips}
                    onChange={(e) =>
                      setPermissions((prev) => ({ ...prev, shareDailyTips: e.target.checked }))
                    }
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-plum-900 block">
                      {t.profilePrivacy.permDailyTips}
                    </span>
                    <span className="text-[11px] text-plum-500">
                      {isBn ? 'সহমর্মিতা ও সেবামূলক টিপস' : 'Thoughtful care & comfort suggestions'}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Privacy Reassurance */}
            <div className="p-3 bg-peach-50/70 rounded-2xl border border-peach-200/60 text-xs text-plum-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-500 shrink-0" />
              <span>
                {isBn
                  ? 'গোপনীয়তা অক্ষুণ্ণ: আপনার ব্যক্তিগত ডায়েরি বা নোট কখনোই শেয়ার হয় না। সঙ্গী শুধু আপনার অনুমোদিত তথ্য দেখতে পাবেন।'
                  : 'Full Privacy Control: Your intimate journals and bleeding measurements remain private to you only.'}
              </span>
            </div>

            {/* Actions for Partner Sharing */}
            <div className="flex flex-wrap items-center justify-between pt-2 gap-3">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<Eye className="w-4 h-4" />}
                  onClick={() => setShowPartnerPreviewModal(true)}
                >
                  {t.profilePrivacy.partnerPreviewBtn}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:text-rose-700"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => setShowRevokeModal(true)}
                >
                  {t.profilePrivacy.revokePartnerBtn}
                </Button>
              </div>

              <Button
                type="button"
                variant="primary"
                size="md"
                icon={<Save className="w-4 h-4" />}
                onClick={handleSavePartnerSettings}
                disabled={isPartnerSaving}
              >
                {isPartnerSaving ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'পার্টনার সেটিংস সংরক্ষণ' : 'Save Partner Settings')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center space-y-2">
            <p className="text-xs text-plum-500 max-w-md mx-auto leading-relaxed">
              {isBn
                ? 'পার্টনার শেয়ারিং বন্ধ রয়েছে। চালু করতে উপরের টগল বাটনে ক্লিক করুন।'
                : 'Partner sharing is currently disabled. Toggle the switch above whenever you wish to invite your companion.'}
            </p>
          </div>
        )}
      </Card>

      {/* Transparent Storage Architecture Notice */}
      <div className="bg-canvas border border-rose-100 rounded-3xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-rose-700 font-bold text-xs sm:text-sm">
          <Lock className="w-4 h-4" />
          <span>{isBn ? 'স্থানীয় ডেটা সুরক্ষা নীতিমালা' : 'Client-Side Data Architecture'}</span>
        </div>
        <p className="text-xs text-plum-600 leading-relaxed">
          {t.profilePrivacy.safetyExplanation}
        </p>
      </div>

      {/* 3. Personal Profile Form */}
      <Card className="p-6">
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-rose-50 font-bold text-base text-plum-900">
            <User className="w-5 h-5 text-rose-500" />
            <span>{t.profilePrivacy.personalDetails}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-plum-700 mb-1">
                {t.profilePrivacy.nameLabel}
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-canvas border border-rose-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-plum-700 mb-1">
                {t.profilePrivacy.emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-canvas border border-rose-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-plum-700 mb-1">
                {t.profilePrivacy.targetCycleLen}
              </label>
              <input
                type="number"
                min="20"
                max="45"
                value={targetCycleLength}
                onChange={e => setTargetCycleLength(Number(e.target.value))}
                className="w-full bg-canvas border border-rose-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-plum-700 mb-1">
                {t.profilePrivacy.targetPeriodLen}
              </label>
              <input
                type="number"
                min="2"
                max="10"
                value={targetPeriodDuration}
                onChange={e => setTargetPeriodDuration(Number(e.target.value))}
                className="w-full bg-canvas border border-rose-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button type="submit" variant="primary" size="md" icon={<Save className="w-4 h-4" />}>
              {isBn ? 'প্রোফাইল পরিবর্তন সংরক্ষণ' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>

      {/* 4. Privacy Controls (Privacy Shield) */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-rose-50 font-bold text-base text-plum-900">
          <ShieldCheck className="w-5 h-5 text-rose-500" />
          <span>{t.profilePrivacy.privacyControls}</span>
        </div>

        <div className="flex items-center justify-between gap-4 p-4 bg-canvas rounded-2xl border border-rose-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-plum-900">
                {t.profilePrivacy.privacyModeLabel}
              </span>
              {user.privacyMode && (
                <Badge variant="plum" size="sm">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-xs text-plum-500 mt-1 max-w-lg">
              {t.profilePrivacy.privacyModeDesc}
            </p>
          </div>

          <button
            onClick={togglePrivacyMode}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              user.privacyMode
                ? 'bg-plum-900 text-white border-plum-900'
                : 'bg-white text-plum-600 border-plum-200 hover:bg-peach-50'
            }`}
          >
            {user.privacyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </Card>

      {/* 5. Data Management & Erasure */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-rose-50 font-bold text-base text-plum-900">
          <Download className="w-5 h-5 text-plum-600" />
          <span>{t.profilePrivacy.dataManagement}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="md"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportData}
            className="w-full text-xs"
          >
            {t.profilePrivacy.exportDataBtn}
          </Button>

          <Button
            variant="soft"
            size="md"
            icon={<RotateCcw className="w-4 h-4 text-rose-600" />}
            onClick={() => {
              resetToDemoData();
              alert(isBn ? 'ডেমো ডেটা পুনরায় সেট করা হয়েছে!' : 'Reset to realistic demo dataset!');
            }}
            className="w-full text-xs"
          >
            {t.profilePrivacy.resetDataBtn}
          </Button>

          <Button
            variant="danger"
            size="md"
            icon={<Trash2 className="w-4 h-4 text-rose-600" />}
            onClick={() => setShowDeleteModal(true)}
            className="w-full text-xs"
          >
            {t.profilePrivacy.deleteDataBtn}
          </Button>
        </div>
      </Card>

      {/* Interactive Partner Preview Modal */}
      {showPartnerPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface max-w-xl w-full rounded-3xl p-6 shadow-2xl border border-rose-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  <Heart className="w-4 h-4 fill-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-plum-900">
                    {t.profilePrivacy.partnerPreviewBtn}
                  </h3>
                  <p className="text-[11px] text-plum-500">
                    {isBn ? 'আপনার নির্বাচিত পারমিশন অনুযায়ী সঙ্গী যা দেখতে পাবেন' : 'Exact view rendered for your partner'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPartnerPreviewModal(false)}
                className="p-1.5 text-plum-400 hover:text-plum-700 rounded-xl hover:bg-rose-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulating Partner Card Header */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-lavender-50 border border-rose-100 flex items-center gap-3">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-300"
              />
              <div>
                <p className="font-bold text-sm text-plum-900">{user.name}</p>
                <p className="text-xs text-rose-700 font-medium">
                  {partnerName ? (isBn ? `${partnerName} এর জন্য সঙ্গী ভিউ` : `Partner support for ${partnerName}`) : (isBn ? 'সঙ্গী ভিউ সক্রিয়' : 'Active Partner View')}
                </p>
              </div>
            </div>

            {/* Simulated Data Points */}
            <div className="space-y-3">
              {permissions.sharePeriodDates ? (
                <div className="p-4 rounded-2xl bg-canvas border border-rose-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-plum-700 block">
                      {isBn ? 'পরবর্তী সম্ভাব্য পিরিয়ড' : 'Estimated Next Period'}
                    </span>
                    <span className="text-lg font-bold text-plum-900">
                      {isBn ? 'প্রায় ৬ দিন পর (অক্টোবর ২৫)' : 'In ~6 Days (Oct 25)'}
                    </span>
                  </div>
                  <Badge variant="rose" size="sm">
                    {isBn ? '±২ দিন সীমা' : '±2 Days Variation'}
                  </Badge>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-canvas border border-dashed border-plum-200 text-xs text-plum-400 italic text-center">
                  {isBn ? 'পিরিয়ডের দিন শেয়ারিং নিষ্ক্রিয়' : 'Period dates hidden by your privacy preference'}
                </div>
              )}

              {permissions.shareCyclePhase ? (
                <div className="p-4 rounded-2xl bg-canvas border border-rose-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-plum-700 block">
                      {isBn ? 'বর্তমান বায়োলজিক্যাল ফেজ' : 'Current Cycle Phase'}
                    </span>
                    <span className="text-sm font-bold text-lavender-800">
                      {prediction.currentPhase === 'luteal' ? (isBn ? 'লুটিয়াল পর্যায় (Luteal / PMS)' : 'Luteal Phase (PMS Window)') : `${prediction.currentPhase} phase`}
                    </span>
                  </div>
                  <Badge variant="lavender" size="sm">
                    {isBn ? 'শক্তি কিছুটা কম' : 'Lower Energy'}
                  </Badge>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-canvas border border-dashed border-plum-200 text-xs text-plum-400 italic text-center">
                  {isBn ? 'সাইকেল ফেজ শেয়ারিং নিষ্ক্রিয়' : 'Cycle phase hidden by your privacy preference'}
                </div>
              )}

              {/* Partner Care & Love Spotlight */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-peach-50 border border-rose-100 flex items-center gap-4">
                <img
                  src="/images/partner-care-bubu-dudu.png"
                  alt="Partner Care"
                  className="w-20 h-auto object-contain rounded-xl shadow-xs bg-white p-1"
                />
                <div>
                  <span className="text-xs font-bold text-rose-700 block">
                    {isBn ? 'সঙ্গীর যত্ন ও ভালোবাসা' : 'Your Partner Takes Care of You'}
                  </span>
                  <p className="text-[11px] text-plum-600 mt-0.5 leading-relaxed">
                    {isBn
                      ? 'হিটিং প্যাড, প্রিয় স্ন্যাকস ও সহমর্মিতার বার্তা সঙ্গীর স্ক্রিনে প্রদর্শিত হয়।'
                      : 'Reminds your partner to bring heating pads, comfort snacks, and extra patience.'}
                  </p>
                </div>
              </div>

              {permissions.shareDailyTips && (
                <div className="p-4 rounded-2xl bg-peach-50/70 border border-peach-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-plum-800">
                    <Coffee className="w-3.5 h-3.5 text-rose-500" />
                    <span>{isBn ? 'আজ সঙ্গীর জন্য যত্নের টিপস' : 'Support Tips for Partner Today'}</span>
                  </div>
                  <p className="text-xs text-plum-700 leading-relaxed">
                    {isBn
                      ? '🌸 তাকে এক কাপ গরম ভেষজ চা বানিয়ে দিন এবং তার কথা মনোযোগ দিয়ে শুনুন।'
                      : '🌸 Offer a comforting warm beverage and help minimize stressful chores today.'}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowPartnerPreviewModal(false)}
              >
                {isBn ? 'ঠিক আছে' : 'Close Preview'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Disconnect Partner Confirmation Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface max-w-md w-full rounded-3xl p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-plum-900">
                  {t.profilePrivacy.revokePartnerBtn}
                </h3>
                <p className="text-xs text-plum-500">
                  {t.profilePrivacy.revokeConfirm}
                </p>
              </div>
            </div>

            <p className="text-xs text-plum-600 leading-relaxed">
              {isBn
                ? 'শেয়ারিং বন্ধ করলে আপনার বর্তমান পার্টনার কোডটি বাতিল হয়ে যাবে এবং আপনার সঙ্গী আর কোনো সাইকেল বা টিপস দেখতে পাবেন না।'
                : 'Disconnecting will immediately invalidate your current share code. Your partner will lose all access.'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRevokeModal(false)}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleRevokePartner}
              >
                {isBn ? 'হ্যাঁ, বন্ধ করুন' : 'Yes, Disconnect'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface max-w-md w-full rounded-3xl p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-plum-900">
                  {isBn ? 'সমস্ত স্বাস্থ্য তথ্য মুছে ফেলবেন?' : 'Purge All Health Records?'}
                </h3>
                <p className="text-xs text-plum-500">
                  {isBn ? 'এই কাজটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।' : 'This action is irreversible.'}
                </p>
              </div>
            </div>

            <p className="text-xs text-plum-600 leading-relaxed">
              {isBn
                ? 'আপনার স্থানীয় ব্রাউজারে সংরক্ষিত সমস্ত পিরিয়ড এবং লক্ষণের রেকর্ড সম্পূর্ণ মুছে যাবে।'
                : 'All your logged cycle episodes, daily symptom journals, and personal notes stored in local storage will be permanently wiped.'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmPurge}
                className="bg-rose-600 hover:bg-rose-700"
              >
                {isBn ? 'হ্যাঁ, সমস্ত তথ্য মুছুন' : 'Yes, Delete Everything'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
