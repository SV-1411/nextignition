import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Minimize2,
  Settings,
  X,
  Paperclip,
  Mic,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ChevronLeft,
  MoreVertical
} from 'lucide-react';
import { brandColors } from '../utils/colors';

type UserRole = 'founder' | 'expert' | 'investor';

interface Message {
  id: number;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  actionCard?: {
    title: string;
    description: string;
    ctaText: string;
    ctaAction: () => void;
  };
}

interface QuickAction {
  id: number;
  icon: string;
  label: string;
  role: UserRole;
}

interface IgnishaAIProps {
  userRole: UserRole;
  isOpen?: boolean;
  onClose?: () => void;
}

const quickActions: QuickAction[] = [
    // Founder actions
    { id: 1, icon: '📊', label: 'Analyze My Pitch Deck', role: 'founder' },
    { id: 2, icon: '🎯', label: 'Find Co-founders', role: 'founder' },
    { id: 3, icon: '💡', label: 'Validate Business Idea', role: 'founder' },
    { id: 4, icon: '📈', label: 'Get Growth Tips', role: 'founder' },
    { id: 5, icon: '🔍', label: 'Competitor Analysis', role: 'founder' },
    { id: 6, icon: '💰', label: 'Financial Projections', role: 'founder' },
    { id: 7, icon: '✍️', label: 'Improve My Post', role: 'founder' },
    
    // Investor actions
    { id: 8, icon: '📊', label: 'Analyze This Deal', role: 'investor' },
    { id: 9, icon: '📈', label: 'Market Trend Insights', role: 'investor' },
    { id: 10, icon: '💼', label: 'Portfolio Analytics', role: 'investor' },
    { id: 11, icon: '⚠️', label: 'Risk Assessment', role: 'investor' },
    { id: 12, icon: '🔍', label: 'Find Co-investment Opportunities', role: 'investor' },
    
    // Expert actions
    { id: 13, icon: '👥', label: 'Find Ideal Clients', role: 'expert' },
    { id: 14, icon: '📝', label: 'Generate Content Ideas', role: 'expert' },
    { id: 15, icon: '📅', label: 'Prepare for Session', role: 'expert' },
    { id: 16, icon: '💡', label: 'Resource Recommendations', role: 'expert' },
    { id: 17, icon: '📊', label: 'Analyze Client Progress', role: 'expert' },
  ];

const mockAIResponses = [
  "I'd be happy to help! Based on your profile and current stage, here are some key recommendations...",
  "Great question! Let me analyze that for you. I've found 3 relevant insights that might help...",
  "I've analyzed your request. Here's what I discovered along with actionable next steps...",
];

export function IgnishaAI({ userRole, isOpen = false, onClose }: IgnishaAIProps) {
  const [isMinimized, setIsMinimized] = useState(true); // Start minimized on desktop
  const [isMobileView, setIsMobileView] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm Ignisha AI, your personal startup assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredActions = quickActions.filter(action => action.role === userRole);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Set follow-up suggestions
      setSuggestions(['Tell me more', 'Show examples', 'Refine results']);
      setTimeout(() => setSuggestions([]), 30000); // Clear after 30s
    }, 1500);
  };

  const handleQuickAction = (action: QuickAction) => {
    setInputValue(action.label);
  };

  const handleSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Minimized state (desktop) - no button, handled by EnhancedIgnishaAI
  if (isMinimized && !isMobileView) {
    return null;
  }

  // Mobile full-screen view
  if (isMobileView) {
    if (!isOpen) {
      // Floating action button (mobile)
      return (
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 h-14 px-6 rounded-full bg-gradient-to-r from-[#6666FF] to-[#F78405] shadow-lg flex items-center gap-2 z-50"
          onClick={onClose}
          style={{
            boxShadow: '0px 4px 12px rgba(102, 102, 255, 0.3)'
          }}
        >
          <Sparkles className="w-5 h-5 text-white" />
          <span className="text-white font-semibold text-sm">Ask AI</span>
        </motion.button>
      );
    }

    return (
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-white z-50 flex flex-col"
      >
        <style>{`
          .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Header */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white shadow-sm">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6666FF] to-[#F78405] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-[#6666FF]">Ignisha AI</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-b border-gray-200 overflow-x-auto hide-scrollbar">
          <div className="flex gap-3">
            {filteredActions.slice(0, 6).map(action => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="flex-shrink-0 w-[140px] h-[100px] border border-[#6666FF] rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#6666FF] hover:text-white transition-colors"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs font-medium text-center px-2">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-4 bg-gray-50">
          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              {message.type === 'user' && (
                <div className="flex justify-end">
                  <div className="max-w-[70%]">
                    <div className="bg-gradient-to-r from-[#6666FF] to-[#F78405] text-white rounded-2xl rounded-br-sm px-4 py-3">
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              )}

              {message.type === 'ai' && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#6666FF] to-[#F78405] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="max-w-[75%]">
                    <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm px-4 py-3">
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-gray-500">{formatTime(message.timestamp)}</p>
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                          <ThumbsUp className="w-3 h-3 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                          <ThumbsDown className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {message.type === 'system' && (
                <div className="flex justify-center">
                  <p className="text-xs text-gray-500 italic">{message.content}</p>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#6666FF] to-[#F78405] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-200 bg-white">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestion(suggestion)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs whitespace-nowrap hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-end gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex-1 bg-gray-100 rounded-3xl px-4 py-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#6666FF]">
              <Sparkles className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message Ignisha..."
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
            </div>

            {inputValue.trim() ? (
              <button
                onClick={handleSendMessage}
                className="w-10 h-10 rounded-full bg-[#6666FF] flex items-center justify-center flex-shrink-0 hover:bg-[#5555EE] transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            ) : (
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Desktop floating popup (when expanded) - same as desktop sidebar but positioned as modal
  if (!isMobileView && !isMinimized) {
    return (
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed right-5 bottom-5 w-80 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50"
      >
        <style>{`
          .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6666FF] to-[#F78405] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#6666FF]">Ignisha AI</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Minimize2 className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-b border-gray-200 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2">
            {filteredActions.map(action => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="px-3 py-1.5 border border-[#6666FF] rounded-full text-xs font-medium text-[#6666FF] whitespace-nowrap hover:bg-[#6666FF] hover:text-white transition-colors flex items-center gap-1"
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-4 bg-gray-50">
          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              {message.type === 'user' && (
                <div className="flex justify-end">
                  <div className="max-w-[240px]">
                    <div className="bg-gradient-to-r from-[#6666FF] to-[#F78405] text-white rounded-2xl rounded-br-md px-3 py-2">
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              )}

              {message.type === 'ai' && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#6666FF] to-[#F78405] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="max-w-[260px]">
                    <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-3 py-2">
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-gray-500">{formatTime(message.timestamp)}</p>
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                          <ThumbsUp className="w-3 h-3 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                          <ThumbsDown className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {message.type === 'system' && (
                <div className="flex justify-center">
                  <p className="text-xs text-gray-500 italic">{message.content}</p>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#6666FF] to-[#F78405] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="px-3 py-2 border-t border-gray-200 bg-white">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestion(suggestion)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex items-end gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </button>
            
            <div className="flex-1 bg-gray-100 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#6666FF]">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Ignisha anything..."
                className="w-full bg-transparent border-none outline-none text-sm"
              />
            </div>

            {inputValue.trim() ? (
              <button
                onClick={handleSendMessage}
                className="w-9 h-9 rounded-full bg-[#6666FF] flex items-center justify-center flex-shrink-0 hover:bg-[#5555EE] transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            ) : (
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Return null when minimized on desktop (button is shown above)
  return null;
}