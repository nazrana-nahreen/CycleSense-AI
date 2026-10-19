import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Activity, 
  TrendingUp, 
  BookOpen, 
  Bot, 
  FileText, 
  ShieldCheck, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Heart,
  Brain
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isSpecial?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, language, t } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const navSections: NavSection[] = [
    {
      title: language === 'bn' ? 'মূল বিবরণ' : 'Overview',
      items: [
        { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
      ],
    },
    {
      title: language === 'bn' ? 'মডিউল ১: পিরিয়ড স্বাস্থ্য' : 'Module 1: Period Health',
      items: [
        { id: 'calendar', label: t.nav.calendar, icon: CalendarIcon },
        { id: 'symptoms', label: t.nav.symptoms, icon: Activity },
        { id: 'insights', label: t.nav.insights, icon: TrendingUp },
        { id: 'education', label: t.nav.education, icon: BookOpen },
      ],
    },
    {
      title: language === 'bn' ? 'মডিউল ২: মানসিক স্বাস্থ্য' : 'Module 2: Mental Health',
      items: [
        { 
          id: 'mentalHealth', 
          label: t.nav.mentalHealth, 
          icon: Brain,
          badge: language === 'bn' ? 'মডিউল ২' : 'Active',
          badgeColor: 'bg-plum-100 text-plum-800 border-plum-200'
        },
      ],
    },
    {
      title: language === 'bn' ? 'টুলস ও অ্যাকাউন্ট' : 'Tools & Account',
      items: [
        { id: 'aiAssistant', label: t.nav.aiAssistant, icon: Bot, isSpecial: true },
        { id: 'reports', label: t.nav.reports, icon: FileText },
        { id: 'profile', label: t.nav.profile, icon: ShieldCheck },
        { id: 'settings', label: t.nav.settings, icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col bg-surface border-r border-rose-100 transition-all duration-300 relative z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-rose-50">
        <div 
          onClick={() => setCurrentPage('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-500 to-lavender-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20 shrink-0">
            <Heart className="w-5 h-5 fill-white/20 stroke-[2.2]" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="font-bold text-lg text-plum-900 tracking-tight block">
                CycleSense<span className="text-rose-500">.ai</span>
              </span>
              <span className="text-[10px] text-plum-400 block -mt-1 font-medium">
                {language === 'bn' ? 'নারীর স্বাস্থ্য প্ল্যাটফর্ম' : "Women's Health Companion"}
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-plum-400 hover:text-plum-700 p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-3 px-3 space-y-3 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-plum-400">
                {section.title}
              </div>
            )}
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs md:text-sm transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs'
                      : 'text-plum-600 hover:bg-peach-50/60 hover:text-plum-900'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-rose-500 rounded-r-full" />
                  )}
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-rose-600 scale-110' : 'text-plum-400'
                    } ${item.isSpecial ? 'text-lavender-600' : ''}`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  {!collapsed && item.isSpecial && (
                    <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-lavender-100 text-lavender-800 border border-lavender-200">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Portfolio Capstone Footer Badge */}
      {!collapsed && (
        <div className="p-4 m-3 bg-gradient-to-br from-peach-100/60 to-lavender-100/60 rounded-2xl border border-rose-100/80 text-xs text-plum-700">
          <div className="flex items-center gap-1.5 font-semibold text-rose-800 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>AI & ML Capstone</span>
          </div>
          <p className="text-[11px] text-plum-500 leading-relaxed">
            {language === 'bn' 
              ? 'নিরাপদ স্থানীয় স্বাস্থ্য বিশ্লেষণ ও দ্বিভাষিক সহায়তা'
              : 'Empowering women with verified cycle science & dual-language NLP.'}
          </p>
        </div>
      )}
    </aside>
  );
};
