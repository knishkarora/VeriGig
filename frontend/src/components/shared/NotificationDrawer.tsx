import React from 'react';
import { X, Check, Bell, ExternalLink, ArrowRight, ShieldAlert, Sparkles, Wallet } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Link } from 'react-router-dom';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useMarketplace();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111827] border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Activity Alerts</h3>
                <p className="text-xs text-slate-400">Real-time webhook notifications</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors px-2 py-1 rounded hover:bg-slate-800"
                title="Mark all as read"
              >
                Mark all read
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-800/40">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Bell size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No notifications yet.</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const getIcon = () => {
                  switch (notif.type) {
                    case 'payment':
                      return <Wallet size={16} className="text-emerald-400" />;
                    case 'milestone':
                      return <Sparkles size={16} className="text-indigo-400" />;
                    case 'verification':
                      return <ShieldAlert size={16} className="text-amber-400" />;
                    default:
                      return <Bell size={16} className="text-slate-400" />;
                  }
                };

                return (
                  <div 
                    key={notif.id}
                    className={`pt-3 first:pt-0 p-3 rounded-xl transition-colors ${
                      notif.read ? 'bg-transparent' : 'bg-slate-800/40 border border-indigo-500/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-slate-800 border border-slate-700/60">
                        {getIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-xs font-semibold ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 whitespace-nowrap">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2.5">
                          {notif.link && (
                            <Link 
                              to={notif.link} 
                              onClick={() => {
                                markNotificationRead(notif.id);
                                onClose();
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300"
                            >
                              View details <ArrowRight size={11} />
                            </Link>
                          )}
                          {!notif.read && (
                            <button
                              onClick={() => markNotificationRead(notif.id)}
                              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                            >
                              <Check size={11} /> Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/30 text-center text-[11px] text-slate-500">
            Escrow state changes trigger simulated instant webhook web-events.
          </div>
        </div>
      </div>
    </div>
  );
};
