import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Languages, 
  Eye, 
  EyeOff, 
  Sparkles, 
  User, 
  Settings, 
  LogOut, 
  Check, 
  Calendar as CalendarIcon, 
  Plus
} from 'lucide-react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { 
    user, 
    language, 
    setLanguage, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    setCurrentPage, 
    setIsLoggedIn,
    setIsChatDrawerOpen,
    setIsAddPeriodModalOpen,
    togglePrivacyMode
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-rose-100 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 transition-all">
      {/* Page Title & Context */}
      <div className="min-w-0 flex-1">
        <h1 className="text-sm xs:text-base sm:text-xl md:text-2xl font-bold text-plum-900 tracking-tight truncate flex items-center gap-1.5 sm:gap-2">
          {title}
        </h1>
        <p className="text-xs text-plum-500 hidden sm:block">
          {new Date('2026-10-19').toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
        {/* Quick Log Period Button (Desktop/Tablet) */}
        <button
          onClick={() => setIsAddPeriodModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-rose-200 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'পিরিয়ড যোগ' : 'Log Period'}</span>
        </button>

        {/* Ask AI Assistant Floating Trigger */}
        <button
          onClick={() => setIsChatDrawerOpen(true)}
          className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-500 to-lavender-500 hover:from-rose-600 hover:to-lavender-600 text-white text-xs font-semibold p-1.5 sm:px-3 sm:py-2 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
          title="Open AI Health Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">{language === 'bn' ? 'এআই সহায়ক' : 'Ask AI'}</span>
        </button>

        {/* Privacy Shield (Blur Sensitive Info) */}
        <button
          onClick={togglePrivacyMode}
          className={`p-1.5 sm:p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
            user.privacyMode
              ? 'bg-plum-900 text-white border-plum-900 shadow-sm'
              : 'bg-surface hover:bg-peach-50 text-plum-600 border-plum-200/80'
          }`}
          title={user.privacyMode ? 'Privacy shield ON (Click to reveal)' : 'Privacy shield OFF (Click to obscure)'}
        >
          {user.privacyMode ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-300" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>

        {/* Language Selector (EN / BN) */}
        <div className="flex items-center bg-rose-50/70 p-0.5 rounded-xl border border-rose-200/60">
          <button
            onClick={() => setLanguage('en')}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-plum-600 hover:text-plum-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('bn')}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              language === 'bn'
                ? 'bg-white text-rose-700 shadow-xs font-bengali'
                : 'text-plum-600 hover:text-plum-900 font-bengali'
            }`}
          >
            বাং
          </button>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-1.5 sm:p-2 rounded-xl bg-surface hover:bg-rose-50 text-plum-600 border border-plum-200/80 transition-all relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-14 sm:top-full mt-2 sm:w-96 max-w-sm mx-auto sm:mx-0 bg-surface rounded-2xl shadow-xl border border-rose-100 p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-plum-900">
                    {language === 'bn' ? 'নোটিফিকেশনসমূহ' : 'Notifications'}
                  </h4>
                  {unreadCount > 0 && (
                    <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                      {unreadCount} {language === 'bn' ? 'নতুন' : 'new'}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                  >
                    {language === 'bn' ? 'সব পঠিত হিসেবে চিহ্নিত করুন' : 'Mark all read'}
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto divide-y divide-rose-50">
                {notifications.length === 0 ? (
                  <p className="text-xs text-plum-500 text-center py-4">
                    {language === 'bn' ? 'কোনো নোটিফিকেশন নেই' : 'No notifications'}
                  </p>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`pt-2.5 pb-2 text-xs cursor-pointer rounded-lg p-2 transition-colors ${
                        !notif.isRead ? 'bg-rose-50/70 font-medium' : 'hover:bg-peach-50/40 text-plum-600'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-plum-900">
                          {language === 'bn' ? notif.titleBn : notif.titleEn}
                        </span>
                        <span className="text-[10px] text-plum-400 shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-plum-600 line-clamp-2">
                        {language === 'bn' ? notif.messageBn : notif.messageEn}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-2 sm:pr-2.5 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
          >
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-rose-300"
            />
            <span className="text-xs font-semibold text-plum-800 hidden md:block max-w-[100px] truncate">
              {user.name.split(' ')[0]}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-surface rounded-2xl shadow-xl border border-rose-100 p-2 z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-rose-100">
                <p className="font-bold text-sm text-plum-900 truncate">{user.name}</p>
                <p className="text-xs text-plum-500 truncate">{user.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setCurrentPage('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-plum-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <User className="w-4 h-4 text-rose-500" />
                  <span>{language === 'bn' ? 'প্রোফাইল ও গোপনীয়তা' : 'Profile & Privacy'}</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-plum-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <Settings className="w-4 h-4 text-plum-500" />
                  <span>{language === 'bn' ? 'অ্যাপ সেটিংস' : 'Settings'}</span>
                </button>
              </div>

              <div className="pt-1 border-t border-rose-100">
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setCurrentPage('landing');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'bn' ? 'লগ আউট' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
