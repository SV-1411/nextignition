import { Menu, Bell } from 'lucide-react';
import { RoleSwitcher, UserRole } from '../RoleSwitcher';

interface DashboardHeaderProps {
  activeTab: string;
  currentRole: UserRole;
  onMenuClick: () => void;
  onRoleChange: (role: UserRole) => void;
  onNotificationsClick: () => void;
  hasNotification?: boolean;
  userAvatar?: string;
}

export function DashboardHeader({
  activeTab,
  currentRole,
  onMenuClick,
  onRoleChange,
  onNotificationsClick,
  hasNotification = true,
  userAvatar = 'JD',
}: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-[24px] py-[12px]">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{activeTab}</h1>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Desktop Role Switcher */}
          <div className="hidden lg:block">
            <RoleSwitcher 
              currentRole={currentRole} 
              onRoleChange={onRoleChange}
            />
          </div>
          <button 
            onClick={onNotificationsClick}
            className="relative p-2 hover:bg-gray-100 rounded-full"
          >
            <Bell className="w-6 h-6" />
            {hasNotification && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          <button className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center text-white font-bold">
            {userAvatar}
          </button>
        </div>
      </div>
    </header>
  );
}
