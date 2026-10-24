import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Send, 
  ShieldAlert, 
  AlertTriangle, 
  Check,
  CheckCheck, 
  Paperclip, 
  Lock, 
  Info,
  Clock,
  MessageSquare,
  ChevronLeft
} from 'lucide-react';
import { messagingApi } from '../../api/endpoints';
import { useMarketplace } from '../../context/MarketplaceContext';

export interface ChatMessage {
  id: string;
  conversationId?: string;
  senderId: string;
  senderName: string;
  senderRole?: string;
  messageText: string;
  attachmentUrl?: string | null;
  hasSafetyWarning: boolean;
  safetyWarnings: string[];
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  readAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
}

export interface ConversationThread {
  id: string;
  contextType: 'gig' | 'application' | 'contract';
  contextId: string;
  title: string;
  recipientId: string;
  recipientName: string;
  recipientRole?: string;
  lastMessageText?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  participants: string[];
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextType?: 'gig' | 'application' | 'contract';
  contextId?: string;
  recipientId?: string;
  recipientName?: string;
  recipientRole?: string;
  currentUserId: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  contextType: initialContextType = 'application',
  contextId: initialContextId,
  recipientId: initialRecipientId,
  recipientName: initialRecipientName = 'Workspace Contact',
  recipientRole: initialRecipientRole,
  currentUserId,
}) => {
  const { currentUser, addNotification } = useMarketplace();

  // Active conversation state
  const [activeContextType, setActiveContextType] = useState<'gig' | 'application' | 'contract'>(initialContextType);
  const [activeContextId, setActiveContextId] = useState<string>(initialContextId || 'general');
  const [activeRecipientId, setActiveRecipientId] = useState<string>(initialRecipientId || '');
  const [activeRecipientName, setActiveRecipientName] = useState<string>(initialRecipientName);
  const [activeRecipientRole, setActiveRecipientRole] = useState<string | undefined>(initialRecipientRole);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [inlineWarning, setInlineWarning] = useState<string | null>(null);
  
  // Multi-thread navigation
  const [availableThreads, setAvailableThreads] = useState<ConversationThread[]>([]);
  const [showThreadList, setShowThreadList] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync props to active thread when modal opens or props change
  useEffect(() => {
    if (initialContextId && initialRecipientId) {
      setActiveContextType(initialContextType);
      setActiveContextId(initialContextId);
      setActiveRecipientId(initialRecipientId);
      setActiveRecipientName(initialRecipientName || 'Workspace Contact');
      setActiveRecipientRole(initialRecipientRole);
      setShowThreadList(false);
    }
  }, [initialContextType, initialContextId, initialRecipientId, initialRecipientName, initialRecipientRole]);

  // Load available conversation threads
  const loadThreads = useCallback(async () => {
    let threads: ConversationThread[] = [];

    // 1. Read from localStorage index
    try {
      const stored = localStorage.getItem('verigig_conversations');
      if (stored) {
        const parsed: ConversationThread[] = JSON.parse(stored);
        threads = parsed.filter(t => t.participants?.includes(currentUserId) || !t.participants?.length);
      }
    } catch (e) {
      console.warn('Error reading stored conversations:', e);
    }

    // 2. Fetch from backend API
    try {
      const apiRes = await messagingApi.listConversations();
      if (apiRes && Array.isArray(apiRes.conversations)) {
        const mapped: ConversationThread[] = apiRes.conversations.map((c: any) => ({
          id: c.id,
          contextType: c.contextType || 'application',
          contextId: c.contextId,
          title: `Context #${c.contextId ? c.contextId.slice(0, 8) : 'Chat'}`,
          recipientId: c.otherParticipant?.id || '',
          recipientName: c.otherParticipant?.name || 'Contact',
          recipientRole: c.otherParticipant?.role || '',
          lastMessageText: c.lastMessageText || '',
          lastMessageAt: c.lastMessageAt || c.createdAt,
          unreadCount: c.unreadCount || 0,
          participants: [currentUserId, c.otherParticipant?.id].filter(Boolean),
        }));

        for (const m of mapped) {
          if (!threads.some(t => t.id === m.id || (t.contextId === m.contextId && t.recipientId === m.recipientId))) {
            threads.unshift(m);
          }
        }
      }
    } catch (err) {
      // Backend offline fallback
    }

    // Ensure currently active thread is registered in threads list
    if (activeContextId && activeRecipientId) {
      const currentExists = threads.some(t => t.contextId === activeContextId && t.recipientId === activeRecipientId);
      if (!currentExists) {
        const newThread: ConversationThread = {
          id: conversationId || `conv-${activeContextId.slice(0, 8)}`,
          contextType: activeContextType,
          contextId: activeContextId,
          title: `Project #${activeContextId.slice(0, 8)}`,
          recipientId: activeRecipientId,
          recipientName: activeRecipientName,
          recipientRole: activeRecipientRole,
          lastMessageText: '',
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0,
          participants: [currentUserId, activeRecipientId],
        };
        threads.unshift(newThread);
      }
    }

    setAvailableThreads(threads);

    // If opened from Navbar with no explicit initial props, auto-select the latest thread
    if (!initialContextId && threads.length > 0 && (!activeRecipientId || activeContextId === 'general')) {
      const top = threads[0];
      setActiveContextType(top.contextType);
      setActiveContextId(top.contextId);
      setActiveRecipientId(top.recipientId);
      setActiveRecipientName(top.recipientName);
      setActiveRecipientRole(top.recipientRole);
    }
  }, [currentUserId, activeContextId, activeRecipientId, activeContextType, activeRecipientName, activeRecipientRole, conversationId, initialContextId]);

  useEffect(() => {
    if (isOpen) {
      loadThreads();
    }
  }, [isOpen, loadThreads]);

  // Real-time heuristic safety detector in typing state
  useEffect(() => {
    const text = inputText.toLowerCase();
    const phonePattern = /(?:\+?91[\s-]?)?[6-9]\d{9}|\b(?:\+?1[\s-]?)?\d{3}[\s.-]\d{3}[\s.-]\d{4}\b/;
    const upiPattern = /\b[\w.-]+@(?:okhdfc|okaxis|oksbi|paytm|ybl|upi|apl|axl|ibl)\b/;
    const offPlatformKeys = /\b(?:whatsapp|wa\.me|telegram|tg|gpay|phonepe|direct transfer|pay outside|bypass escrow)\b/;

    if (phonePattern.test(inputText) || offPlatformKeys.test(text)) {
      setInlineWarning('⚠️ Off-platform contact sharing or payment terms detected. Keep communication inside VeriGig to preserve milestone escrow protection.');
    } else if (upiPattern.test(text)) {
      setInlineWarning('🚨 UPI handle detected. Direct payments violate platform policy and forfeit fraud protection.');
    } else {
      setInlineWarning(null);
    }
  }, [inputText]);

  // Mark unread messages sent by the other party as seen/read
  const markMessagesAsRead = useCallback((convId: string, msgs: ChatMessage[]) => {
    let hasUpdated = false;
    const now = new Date().toISOString();

    const updated = msgs.map(m => {
      const isMe = m.senderId === currentUserId || m.senderName === 'You';
      if (!isMe && !m.readAt) {
        hasUpdated = true;
        return { ...m, readAt: now, status: 'read' as const };
      }
      return m;
    });

    if (hasUpdated) {
      setMessages(updated);
      try {
        localStorage.setItem(`verigig_chat_messages_${convId}`, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('verigig_message_read', {
          detail: { conversationId: convId, readerId: currentUserId, readAt: now }
        }));
      } catch (e) {
        console.warn('Failed to update read status in localStorage:', e);
      }
    }
  }, [currentUserId]);

  // Load conversation and messages
  const fetchMessagesForThread = useCallback(async (convId: string) => {
    let localMsgs: ChatMessage[] = [];
    try {
      const stored = localStorage.getItem(`verigig_chat_messages_${convId}`);
      if (stored) {
        localMsgs = JSON.parse(stored);
      }
    } catch {}

    try {
      if (!convId.startsWith('conv-')) {
        const msgRes = await messagingApi.getMessages(convId);
        if (msgRes && Array.isArray(msgRes.messages)) {
          const apiMsgs: ChatMessage[] = msgRes.messages.map((m: any) => ({
            id: m.id,
            conversationId: m.conversationId,
            senderId: m.senderId,
            senderName: m.senderName || (m.senderId === currentUserId ? 'You' : activeRecipientName),
            senderRole: m.senderRole,
            messageText: m.messageText,
            attachmentUrl: m.attachmentUrl,
            hasSafetyWarning: Boolean(m.hasSafetyWarning),
            safetyWarnings: m.safetyWarnings || [],
            readAt: m.readAt,
            status: m.readAt ? 'read' : 'delivered',
            createdAt: m.createdAt,
          }));

          // Merge API and local messages
          const combined = [...apiMsgs];
          for (const lm of localMsgs) {
            if (!combined.some(cm => cm.id === lm.id)) {
              combined.push(lm);
            }
          }
          combined.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          setMessages(combined);
          markMessagesAsRead(convId, combined);
          return;
        }
      }
    } catch (err) {
      console.warn('API getMessages fallback to local storage:', err);
    }

    if (localMsgs.length > 0) {
      setMessages(localMsgs);
      markMessagesAsRead(convId, localMsgs);
    } else {
      // Seed initial conversation preview
      const seedMsg: ChatMessage = {
        id: `msg-seed-${activeContextId.slice(0, 6)}`,
        conversationId: convId,
        senderId: activeRecipientId,
        senderName: activeRecipientName,
        senderRole: activeRecipientRole,
        messageText: `Hello! Regarding the ${activeContextType} #${activeContextId.slice(0, 6)}, let me know if you need any clarification on the deliverables.`,
        hasSafetyWarning: false,
        safetyWarnings: [],
        status: 'read',
        readAt: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      };
      setMessages([seedMsg]);
      try {
        localStorage.setItem(`verigig_chat_messages_${convId}`, JSON.stringify([seedMsg]));
      } catch {}
    }
  }, [activeContextId, activeRecipientId, activeRecipientName, activeRecipientRole, activeContextType, currentUserId, markMessagesAsRead]);

  // Initialize conversation session
  useEffect(() => {
    if (!isOpen || !activeContextId || !activeRecipientId) return;

    let active = true;
    setIsLoading(true);

    const initConversation = async () => {
      let resolvedConvId = `conv-${activeContextId.slice(0, 8)}`;

      try {
        const res = await messagingApi.getOrCreateConversation({
          contextType: activeContextType,
          contextId: activeContextId,
          recipientId: activeRecipientId,
        });
        if (!active) return;
        if (res && res.conversation && res.conversation.id) {
          resolvedConvId = res.conversation.id;
        }
      } catch (err) {
        console.warn('Could not initialize conversation via API, using contextual local session:', err);
      }

      if (active) {
        setConversationId(resolvedConvId);
        await fetchMessagesForThread(resolvedConvId);
        setIsLoading(false);
      }
    };

    initConversation();
    return () => { active = false; };
  }, [isOpen, activeContextType, activeContextId, activeRecipientId, fetchMessagesForThread]);

  // Background polling while chat is open
  useEffect(() => {
    if (!isOpen || !conversationId) return;

    const interval = setInterval(() => {
      fetchMessagesForThread(conversationId);
    }, 3500);

    return () => clearInterval(interval);
  }, [isOpen, conversationId, fetchMessagesForThread]);

  // Listen to cross-window and cross-role events (read receipts & message delivery)
  useEffect(() => {
    if (!conversationId) return;
    const activeConvId = conversationId;

    const handleReadNotification = (e: any) => {
      if (e.detail?.conversationId === activeConvId) {
        const readTime = e.detail?.readAt || new Date().toISOString();
        setMessages(prev => prev.map(m => {
          const isMe = m.senderId === currentUserId || m.senderName === 'You';
          if (isMe && (!m.readAt || m.status !== 'read')) {
            return { ...m, readAt: readTime, status: 'read' as const };
          }
          return m;
        }));
      }
    };

    const handleMessageSent = (e: any) => {
      if (e.detail?.conversationId === activeConvId && e.detail?.message) {
        setMessages(prev => {
          if (prev.some(m => m.id === e.detail.message.id)) return prev;
          const updated = [...prev, e.detail.message];
          markMessagesAsRead(activeConvId, updated);
          return updated;
        });
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `verigig_chat_messages_${activeConvId}` && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setMessages(parsed);
          markMessagesAsRead(activeConvId, parsed);
        } catch {}
      }
    };

    window.addEventListener('verigig_message_read', handleReadNotification);
    window.addEventListener('verigig_message_sent', handleMessageSent);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('verigig_message_read', handleReadNotification);
      window.removeEventListener('verigig_message_sent', handleMessageSent);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [conversationId, currentUserId, markMessagesAsRead]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const text = inputText.trim();
    setInputText('');
    setIsSending(true);

    const tempId = `msg-${Date.now()}`;
    const targetConvId = conversationId || `conv-${activeContextId.slice(0, 8)}`;
    const hasWarning = Boolean(inlineWarning);

    // Step 1: Initial Sending State -> status = 'sending' (Clock icon)
    const pendingMsg: ChatMessage = {
      id: tempId,
      conversationId: targetConvId,
      senderId: currentUserId,
      senderName: 'You',
      messageText: text,
      attachmentUrl: attachmentUrl.trim() || null,
      hasSafetyWarning: hasWarning,
      safetyWarnings: hasWarning ? [inlineWarning!] : [],
      status: 'sending',
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, pendingMsg]);

    try {
      let finalMessage = { ...pendingMsg };

      // Attempt API Dispatch
      if (targetConvId && !targetConvId.startsWith('conv-')) {
        try {
          const res = await messagingApi.sendMessage(targetConvId, {
            messageText: text,
            attachmentUrl: attachmentUrl.trim() || undefined,
          });
          if (res && res.message) {
            finalMessage = {
              id: res.message.id,
              conversationId: targetConvId,
              senderId: currentUserId,
              senderName: 'You',
              messageText: res.message.messageText,
              attachmentUrl: res.message.attachmentUrl,
              hasSafetyWarning: res.message.hasSafetyWarning,
              safetyWarnings: res.message.safetyWarnings || [],
              status: 'sent',
              createdAt: res.message.createdAt,
            };
          }
        } catch (apiErr) {
          console.warn('API sendMessage fallback to local broadcast:', apiErr);
          finalMessage.status = 'sent';
        }
      } else {
        finalMessage.status = 'sent';
      }

      // Step 2: Message Sent confirmation -> status = 'sent' (Single tick)
      setMessages(prev => prev.map(m => m.id === tempId ? finalMessage : m));

      // Step 3: Message Delivered to recipient -> status = 'delivered' (Double gray tick)
      setTimeout(() => {
        setMessages(prev => {
          const updated = prev.map(m => {
            if (m.id === finalMessage.id && !m.readAt && m.status !== 'read') {
              return { ...m, status: 'delivered' as const, deliveredAt: new Date().toISOString() };
            }
            return m;
          });

          // Save to local storage for persistence across tabs
          try {
            localStorage.setItem(`verigig_chat_messages_${targetConvId}`, JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent('verigig_message_sent', {
              detail: { conversationId: targetConvId, message: finalMessage }
            }));
          } catch {}

          return updated;
        });
      }, 700);

      // Register or update conversation metadata in index
      try {
        const stored = localStorage.getItem('verigig_conversations');
        let threads: ConversationThread[] = stored ? JSON.parse(stored) : [];
        const existingIdx = threads.findIndex(t => t.id === targetConvId || (t.contextId === activeContextId && t.recipientId === activeRecipientId));
        
        const updatedThread: ConversationThread = {
          id: targetConvId,
          contextType: activeContextType,
          contextId: activeContextId,
          title: `Project #${activeContextId.slice(0, 8)}`,
          recipientId: activeRecipientId,
          recipientName: activeRecipientName,
          recipientRole: activeRecipientRole,
          lastMessageText: text,
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0,
          participants: [currentUserId, activeRecipientId],
        };

        if (existingIdx >= 0) {
          threads[existingIdx] = updatedThread;
        } else {
          threads.unshift(updatedThread);
        }
        localStorage.setItem('verigig_conversations', JSON.stringify(threads));
        setAvailableThreads(threads);

        // Dispatch instant notification for recipient
        addNotification(
          `New message from ${currentUser.name || 'Contact'}`,
          text,
          'message',
          undefined,
          activeRecipientId,
          {
            contextType: activeContextType,
            contextId: activeContextId,
            recipientId: currentUserId,
            recipientName: currentUser.name || (activeRecipientRole === 'student' ? 'Employer' : 'Candidate'),
            recipientRole: activeRecipientRole === 'student' ? 'employer' : 'student',
          }
        );
      } catch (e) {
        console.warn('Failed to update conversation index:', e);
      }

      setAttachmentUrl('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Helper to render message delivery status ticks & clock
  const renderMessageStatus = (m: ChatMessage, isMe: boolean) => {
    if (!isMe) return null;

    // 1. Pending sending: Clock icon
    if (m.status === 'sending') {
      return (
        <span className="inline-flex items-center ml-1.5 text-white/40" title="Message not sent yet from your side">
          <Clock className="w-3 h-3 animate-spin" />
        </span>
      );
    }

    const isRead = Boolean(m.readAt || m.status === 'read');
    const isDelivered = Boolean(m.status === 'delivered' || isRead);

    // 2. Seen / Read by student: Colored sky-blue double tick
    if (isRead) {
      return (
        <span className="inline-flex items-center ml-1.5 text-[#38BDF8]" title="Seen by student">
          <CheckCheck className="w-3.5 h-3.5" />
        </span>
      );
    }

    // 3. Received / Delivered to student: Neutral double tick
    if (isDelivered) {
      return (
        <span className="inline-flex items-center ml-1.5 text-white/50" title="Delivered to student">
          <CheckCheck className="w-3.5 h-3.5" />
        </span>
      );
    }

    // 4. Sent from user's side: Single tick
    return (
      <span className="inline-flex items-center ml-1.5 text-white/50" title="Sent from your side">
        <Check className="w-3.5 h-3.5" />
      </span>
    );
  };

  const selectThread = (thread: ConversationThread) => {
    setActiveContextType(thread.contextType);
    setActiveContextId(thread.contextId);
    setActiveRecipientId(thread.recipientId);
    setActiveRecipientName(thread.recipientName);
    setActiveRecipientRole(thread.recipientRole);
    setShowThreadList(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B101B] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col h-[640px] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0F172A]/80">
          <div className="flex items-center space-x-3">
            {showThreadList ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowThreadList(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  title="Back to conversation"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="font-bold text-white text-base">Conversations ({availableThreads.length})</h3>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-2xl bg-[#D4F851]/10 border border-[#D4F851]/30 flex items-center justify-center text-[#D4F851] font-bold text-sm">
                  {activeRecipientName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-base">{activeRecipientName}</h3>
                    {activeRecipientRole && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                        {activeRecipientRole}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/50 flex items-center space-x-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    <span>Context: <span className="capitalize text-white/70 font-medium">{activeContextType}</span> #{activeContextId.slice(0, 8)}</span>
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {availableThreads.length > 1 && !showThreadList && (
              <button
                onClick={() => setShowThreadList(true)}
                className="flex items-center space-x-1.5 text-xs text-white/70 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                title="View all conversations"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#D4F851]" />
                <span>Chats ({availableThreads.length})</span>
              </button>
            )}

            <span className="hidden sm:flex items-center space-x-1 text-[11px] text-white/40 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
              <Lock className="w-3 h-3 text-[#D4F851]" />
              <span>Escrow-Protected</span>
            </span>

            <button
              onClick={onClose}
              className="p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Close chat modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VeriGig Policy Shield Banner */}
        <div className="px-5 py-2.5 bg-[#D4F851]/5 border-b border-[#D4F851]/10 flex items-center space-x-2 text-xs text-[#D4F851]/90">
          <ShieldAlert className="w-4 h-4 shrink-0 text-[#D4F851]" />
          <span>Real-time safety active: Off-platform contact & payment solicitations are flagged for arbitration integrity.</span>
        </div>

        {/* Body: Thread List or Active Message Thread */}
        {showThreadList ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {availableThreads.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/40">
                <Info className="w-8 h-8 mb-2 text-white/20" />
                <p className="text-sm font-medium text-white/60">No active conversations</p>
                <p className="text-xs mt-1">When an employer or student messages you regarding a proposal or gig, it will appear here.</p>
              </div>
            ) : (
              availableThreads.map((th) => {
                const isActive = th.contextId === activeContextId && th.recipientId === activeRecipientId;
                return (
                  <div
                    key={th.id}
                    onClick={() => selectThread(th)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-white/10 border-[#D4F851]/40 shadow-sm'
                        : 'bg-[#101827] border-white/5 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#D4F851]/10 border border-[#D4F851]/30 flex items-center justify-center text-[#D4F851] font-bold text-sm">
                        {th.recipientName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white">{th.recipientName}</h4>
                          {th.recipientRole && (
                            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded-md bg-white/10 text-white/70">
                              {th.recipientRole}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/40 truncate max-w-xs mt-0.5">
                          {th.lastMessageText || `Context: ${th.contextType} #${th.contextId.slice(0, 6)}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-white/30 block">
                        {th.lastMessageAt ? new Date(th.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recent'}
                      </span>
                      {isActive && (
                        <span className="text-[10px] text-[#D4F851] font-bold bg-[#D4F851]/10 px-2 py-0.5 rounded-full inline-block mt-1">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Message Thread */
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-sm text-white/40">
                <div className="animate-spin w-5 h-5 border-2 border-[#D4F851] border-t-transparent rounded-full mr-2"></div>
                Loading conversation history...
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/40">
                <Info className="w-8 h-8 mb-2 text-white/20" />
                <p className="text-sm font-medium text-white/60">No messages yet</p>
                <p className="text-xs mt-1">Start the conversation directly within the secure project workspace.</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.senderId === currentUserId || m.senderName === 'You';
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline space-x-2 mb-1 px-1">
                      <span className="text-[11px] font-semibold text-white/60">{m.senderName}</span>
                      <span className="text-[10px] text-white/40 flex items-center">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {renderMessageStatus(m, isMe)}
                      </span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isMe
                          ? 'bg-[#1E293B] border border-white/10 text-white rounded-br-sm'
                          : 'bg-[#101827] border border-white/10 text-white/90 rounded-bl-sm'
                      } ${m.hasSafetyWarning ? 'border-amber-500/50 bg-amber-500/10' : ''}`}
                    >
                      <p className="whitespace-pre-wrap">{m.messageText}</p>
                      
                      {m.attachmentUrl && (
                        <a
                          href={m.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center space-x-1.5 text-xs text-[#D4F851] hover:underline bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"
                        >
                          <Paperclip className="w-3 h-3" />
                          <span>View Attachment</span>
                        </a>
                      )}

                      {/* Inline Safety Warning Tag */}
                      {m.hasSafetyWarning && (
                        <div className="mt-2.5 pt-2 border-t border-amber-500/30 text-[11px] text-amber-300 flex items-start space-x-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            {m.safetyWarnings?.length > 0 ? (
                              m.safetyWarnings.map((w, idx) => <p key={idx}>{w}</p>)
                            ) : (
                              <p>Safety alert: Off-platform contact or transaction handle detected.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Real-time typing advisory warning */}
        {inlineWarning && !showThreadList && (
          <div className="px-4 py-2 bg-amber-500/15 border-t border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="flex-1">{inlineWarning}</p>
          </div>
        )}

        {/* Input Bar */}
        {!showThreadList && (
          <form onSubmit={handleSendMessage} className="p-4 bg-[#0F172A]/90 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeRecipientName}...`}
                className="flex-1 bg-[#1E293B] border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#D4F851] transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="bg-[#D4F851] text-[#121214] font-bold px-4 py-2.5 rounded-2xl hover:bg-[#C5F82A] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1 text-sm shadow-md"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
