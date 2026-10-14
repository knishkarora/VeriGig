import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCheck, 
  Paperclip, 
  Lock, 
  Info,
  Clock
} from 'lucide-react';
import { messagingApi } from '../../api/endpoints';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: string;
  messageText: string;
  attachmentUrl?: string | null;
  hasSafetyWarning: boolean;
  safetyWarnings: string[];
  readAt?: string | null;
  createdAt: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextType: 'gig' | 'application' | 'contract';
  contextId: string;
  recipientId: string;
  recipientName: string;
  recipientRole?: string;
  currentUserId: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  contextType,
  contextId,
  recipientId,
  recipientName,
  recipientRole,
  currentUserId,
}) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [inlineWarning, setInlineWarning] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Heuristic safety detector in typing state (instant client guidance)
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

  // Load or create conversation
  useEffect(() => {
    if (!isOpen || !contextId || !recipientId) return;

    let active = true;
    setIsLoading(true);

    const initConversation = async () => {
      try {
        const res = await messagingApi.getOrCreateConversation({
          contextType,
          contextId,
          recipientId,
        });
        if (!active) return;
        const convId = res.conversation.id;
        setConversationId(convId);

        // Fetch messages
        const msgRes = await messagingApi.getMessages(convId);
        if (active) {
          setMessages(msgRes.messages || []);
        }
      } catch (err) {
        console.warn('API messaging unavailable, loading contextual conversation preview:', err);
        // Fallback mock preview for smooth demo
        if (active) {
          setConversationId(`conv-${contextId.slice(0, 8)}`);
          setMessages([
            {
              id: 'msg-seed-1',
              senderId: recipientId,
              senderName: recipientName,
              senderRole: recipientRole,
              messageText: `Hello! Regarding the ${contextType} #${contextId.slice(0, 6)}, let me know if you need any clarification on the deliverables.`,
              hasSafetyWarning: false,
              safetyWarnings: [],
              createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
          ]);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    initConversation();
    return () => { active = false; };
  }, [isOpen, contextType, contextId, recipientId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const text = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      if (conversationId && !conversationId.startsWith('conv-')) {
        const res = await messagingApi.sendMessage(conversationId, {
          messageText: text,
          attachmentUrl: attachmentUrl.trim() || undefined,
        });
        setMessages(prev => [...prev, {
          id: res.message.id,
          senderId: currentUserId,
          senderName: 'You',
          messageText: res.message.messageText,
          attachmentUrl: res.message.attachmentUrl,
          hasSafetyWarning: res.message.hasSafetyWarning,
          safetyWarnings: res.message.safetyWarnings || [],
          createdAt: res.message.createdAt,
        }]);
      } else {
        // Fallback local append for demo
        const hasWarning = !!inlineWarning;
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}`,
          senderId: currentUserId,
          senderName: 'You',
          messageText: text,
          attachmentUrl: attachmentUrl.trim() || null,
          hasSafetyWarning: hasWarning,
          safetyWarnings: hasWarning ? [inlineWarning!] : [],
          createdAt: new Date().toISOString(),
        }]);
      }
      setAttachmentUrl('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B101B] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col h-[640px] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0F172A]/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4F851]/10 border border-[#D4F851]/30 flex items-center justify-center text-[#D4F851] font-bold text-sm">
              {recipientName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">{recipientName}</h3>
                {recipientRole && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                    {recipientRole}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50 flex items-center space-x-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                <span>Context: <span className="capitalize text-white/70 font-medium">{contextType}</span> #{contextId.slice(0, 8)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="hidden sm:flex items-center space-x-1 text-[11px] text-white/40 bg-white/5 px-2.5 py-1 rounded-xl border border-white/5">
              <Lock className="w-3 h-3 text-[#D4F851]" />
              <span>Escrow-Protected</span>
            </span>
            <button
              onClick={onClose}
              className="p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
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

        {/* Message Thread */}
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
                    <span className="text-[10px] text-white/30 flex items-center">
                      <Clock className="w-2.5 h-2.5 mr-1 inline" />
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

        {/* Real-time typing advisory warning */}
        {inlineWarning && (
          <div className="px-4 py-2 bg-amber-500/15 border-t border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="flex-1">{inlineWarning}</p>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 bg-[#0F172A]/90 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${recipientName}...`}
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

      </div>
    </div>
  );
};
