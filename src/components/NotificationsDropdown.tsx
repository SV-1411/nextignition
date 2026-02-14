import { motion } from 'motion/react';
import { 
  Calendar, 
  MessageCircle, 
  DollarSign, 
  Star, 
  Clock, 
  Award,
  X,
  TrendingUp,
  Users,
  FileText,
  Video,
  Bell,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Notification {
  id: number;
  type: 'booking' | 'message' | 'payment' | 'review' | 'reminder' | 'achievement' | 'update' | 'alert' | 'milestone';
  title: string;
  message: string;
  time: string;
  unread: boolean;
  icon: any;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'founder' | 'investor' | 'expert';
}

export function NotificationsDropdown({ isOpen, onClose, userRole }: NotificationsDropdownProps) {
  const getNotifications = (): Notification[] => {
    switch (userRole) {
      case 'founder':
        return [
          {
            id: 1,
            type: 'message',
            title: 'New Message from Investor',
            message: 'Sarah Johnson from Acme Ventures wants to schedule a meeting',
            time: '5 min ago',
            unread: true,
            icon: MessageCircle
          },
          {
            id: 2,
            type: 'milestone',
            title: 'Milestone Achieved',
            message: 'You\'ve reached 1,000 active users! 🎉',
            time: '1 hour ago',
            unread: true,
            icon: TrendingUp
          },
          {
            id: 3,
            type: 'booking',
            title: 'Upcoming Session',
            message: 'Your mentorship session with Dr. Johnson starts in 30 minutes',
            time: '2 hours ago',
            unread: true,
            icon: Calendar
          },
          {
            id: 4,
            type: 'update',
            title: 'Application Update',
            message: 'Your Y Combinator application moved to next round',
            time: '3 hours ago',
            unread: false,
            icon: FileText
          },
          {
            id: 5,
            type: 'message',
            title: 'Expert Response',
            message: 'Marcus Williams replied to your consultation request',
            time: '5 hours ago',
            unread: false,
            icon: MessageCircle
          },
          {
            id: 6,
            type: 'alert',
            title: 'Task Reminder',
            message: 'Don\'t forget to update your pitch deck for tomorrow',
            time: '1 day ago',
            unread: false,
            icon: AlertCircle
          }
        ];
      
      case 'investor':
        return [
          {
            id: 1,
            type: 'alert',
            title: 'New Deal Opportunity',
            message: 'TechFlow AI matched your investment criteria (AI/ML, Series A)',
            time: '10 min ago',
            unread: true,
            icon: TrendingUp
          },
          {
            id: 2,
            type: 'message',
            title: 'Founder Message',
            message: 'Sarah Chen from TechFlow AI sent you a pitch deck',
            time: '30 min ago',
            unread: true,
            icon: MessageCircle
          },
          {
            id: 3,
            type: 'update',
            title: 'Portfolio Update',
            message: 'GreenScale hit $1M ARR milestone',
            time: '2 hours ago',
            unread: true,
            icon: TrendingUp
          },
          {
            id: 4,
            type: 'booking',
            title: 'Meeting Scheduled',
            message: 'Due diligence call with StartupHub confirmed for Jan 28',
            time: '4 hours ago',
            unread: false,
            icon: Calendar
          },
          {
            id: 5,
            type: 'payment',
            title: 'Investment Processed',
            message: '$500K investment in HealthAI has been processed',
            time: '1 day ago',
            unread: false,
            icon: DollarSign
          },
          {
            id: 6,
            type: 'achievement',
            title: 'Portfolio Milestone',
            message: 'You\'ve invested in 25 startups this year!',
            time: '2 days ago',
            unread: false,
            icon: Award
          }
        ];
      
      case 'expert':
      default:
        return [
          {
            id: 1,
            type: 'booking',
            title: 'New Booking Request',
            message: 'Alex Johnson wants to book a session about Product-Market Fit',
            time: '5 min ago',
            unread: true,
            icon: Calendar
          },
          {
            id: 2,
            type: 'message',
            title: 'New Message',
            message: 'Sarah Chen sent you a message',
            time: '15 min ago',
            unread: true,
            icon: MessageCircle
          },
          {
            id: 3,
            type: 'payment',
            title: 'Payment Received',
            message: 'You received $450 from GreenScale consultation',
            time: '1 hour ago',
            unread: true,
            icon: DollarSign
          },
          {
            id: 4,
            type: 'review',
            title: 'New Review',
            message: 'Emily Rodriguez left you a 5-star review',
            time: '2 hours ago',
            unread: false,
            icon: Star
          },
          {
            id: 5,
            type: 'reminder',
            title: 'Session Reminder',
            message: 'Your session with TechFlow AI starts in 30 minutes',
            time: '3 hours ago',
            unread: false,
            icon: Clock
          },
          {
            id: 6,
            type: 'achievement',
            title: 'Achievement Unlocked',
            message: 'You\'ve reached 100 completed sessions!',
            time: '1 day ago',
            unread: false,
            icon: Award
          }
        ];
    }
  };

  const notifications = getNotifications();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed right-4 lg:right-6 top-20 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                Mark all read
              </button>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[500px] overflow-y-auto">
          {notifications.map((notification, idx) => {
            const Icon = notification.icon;
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                  notification.unread ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.type === 'booking' ? 'bg-blue-100' :
                    notification.type === 'message' ? 'bg-purple-100' :
                    notification.type === 'payment' ? 'bg-green-100' :
                    notification.type === 'review' ? 'bg-yellow-100' :
                    notification.type === 'reminder' ? 'bg-orange-100' :
                    notification.type === 'milestone' ? 'bg-pink-100' :
                    notification.type === 'update' ? 'bg-blue-100' :
                    notification.type === 'alert' ? 'bg-red-100' :
                    'bg-purple-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      notification.type === 'booking' ? 'text-blue-600' :
                      notification.type === 'message' ? 'text-purple-600' :
                      notification.type === 'payment' ? 'text-green-600' :
                      notification.type === 'review' ? 'text-yellow-600' :
                      notification.type === 'reminder' ? 'text-orange-600' :
                      notification.type === 'milestone' ? 'text-pink-600' :
                      notification.type === 'update' ? 'text-blue-600' :
                      notification.type === 'alert' ? 'text-red-600' :
                      'text-purple-600'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-sm text-gray-900">{notification.title}</h4>
                      {notification.unread && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{notification.message}</p>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 text-center">
            View All Notifications
          </button>
        </div>
      </motion.div>
    </>
  );
}