import React from 'react';
import { X, Check, Bell, ArrowRight, ShieldAlert, Sparkles, Wallet } from 'lucide-react';
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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-purple-100 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-purple-100 flex items-center justify-between bg-purple-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Activity Alerts</h3>
                <p className="text-xs text-slate-500">Real-time webhook notifications</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-purple-700 hover:text-purple-900 font-semibold px-2 py-1 rounded hover:bg-purple-100 transition-colors"
              >
                Mark all read
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-purple-50">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Bell size={32} className="mx-auto mb-2 opacity-40 text-purple-400" />
                <p className="text-sm">No notifications yet.</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const getIcon = () => {
                  switch (notif.type) {
                    case 'payment':
                      return <Wallet size={16} className="text-emerald-600" />;
                    case 'milestone':
                      return <Sparkles size={16} className="text-purple-600" />;
                    case 'verification':
                      return <ShieldAlert size={16} className="text-amber-600" />;
                    default:
                      return <Bell size={16} className="text-slate-500" />;
                  }
                };

                return (
                  <div 
                    key={notif.id}
                    className={`pt-3 first:pt-0 p-3 rounded-2xl transition-all ${
                      notif.read ? 'bg-transparent' : 'bg-purple-50/70 border border-purple-200/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-xl bg-white border border-purple-100 shadow-sm">
                        {getIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-xs font-bold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
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
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-900"
                            >
                              View details <ArrowRight size={11} />
                            </Link>
                          )}
                          {!notif.read && (
                            <button
                              onClick={() => markNotificationRead(notif.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800"
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
          <div className="p-3 border-t border-purple-100 bg-purple-50/30 text-center text-[11px] text-slate-500">
            Escrow state changes trigger simulated instant webhook web-events.
          </div>
        </div>
      </div>
    </div>
  );
};
