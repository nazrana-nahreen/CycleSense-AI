import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Activity, 
  TrendingUp, 
  MoreHorizontal, 
  BookOpen, 
  Bot, 
  FileText, 
  ShieldCheck, 
  Settings, 
  X,
  Brain
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, language, t } = useApp();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'calendar', label: t.nav.calendar, icon: CalendarIcon },
    { id: 'symptoms', label: t.nav.symptoms, icon: Activity },
    { id: 'mentalHealth', label: language === 'bn' ? 'মন ও মেজাজ' : 'Mood', icon: Brain },
  ];

  const moreTabs = [
    { id: 'insights', label: t.nav.insights, icon: TrendingUp },
    { id: 'education', label: t.nav.education, icon: BookOpen },
    { id: 'aiAssistant', label: t.nav.aiAssistant, icon: Bot },
    { id: 'reports', label: t.nav.reports, icon: FileText },
    { id: 'profile', label: t.nav.profile, icon: ShieldCheck },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  const handleSelectTab = (id: string) => {
    setCurrentPage(id);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* Mobile Drawer for More Items */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-40 lg:hidden bg-plum-950/40 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-surface rounded-t-3xl p-5 shadow-2xl border-t border-rose-100 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-3">
              <h3 className="font-bold text-sm text-plum-900">
                {language === 'bn' ? 'আরও মেনু' : 'More Menu'}
              </h3>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 rounded-full text-plum-400 hover:bg-rose-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {moreTabs.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-rose-100/70 text-rose-800 border border-rose-200'
                        : 'bg-peach-50/40 hover:bg-peach-50 text-plum-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-600' : 'text-plum-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-md border-t border-rose-100 px-1 py-1 flex items-center justify-between shadow-lg">
        {mainTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentPage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-rose-600 font-semibold' : 'text-plum-400 hover:text-plum-700'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'scale-110 text-rose-600' : ''}`} />
              <span className="text-[10px] mt-0.5 truncate w-full text-center leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer ${
            showMoreMenu || moreTabs.some(t => t.id === currentPage)
              ? 'text-rose-600 font-semibold'
              : 'text-plum-400 hover:text-plum-700'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 shrink-0" />
          <span className="text-[10px] mt-0.5 truncate w-full text-center leading-tight">
            {language === 'bn' ? 'আরও' : 'More'}
          </span>
        </button>
      </nav>
    </>
  );
};
