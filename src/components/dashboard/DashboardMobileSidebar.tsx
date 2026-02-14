import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { SidebarItem } from '../../types/dashboard';
import { brandColors } from '../../utils/colors';
import logoImage from 'figma:asset/faed1dd832314fe381fd34c35312b9faa571832d.png';

interface DashboardMobileSidebarProps {
  sidebarItems: SidebarItem[];
  activeTab: string;
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
}

export function DashboardMobileSidebar({
  sidebarItems,
  activeTab,
  isOpen,
  onClose,
  onTabChange,
}: DashboardMobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="fixed left-0 top-0 h-screen w-64 bg-white z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-200">
          <img src={logoImage} alt="NextIgnition" className="h-8" />
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="px-3 pt-4">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                onTabChange(item.label);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                activeTab === item.label
                  ? 'bg-gradient-to-r text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={activeTab === item.label ? {
                background: `linear-gradient(135deg, ${brandColors.atomicOrange}, ${brandColors.electricBlue})`
              } : {}}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </motion.aside>
    </div>
  );
}
