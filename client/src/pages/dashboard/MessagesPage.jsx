import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, User as UserIcon, Clock } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MessagesPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialUserId = searchParams.get('user');

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch all conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when a conversation is selected or initialUserId is present
  useEffect(() => {
    if (activeConversation) {
      const otherUserId = activeConversation.participants.find(p => p._id !== user._id)._id;
      fetchMessages(otherUserId);
    } else if (initialUserId) {
      fetchMessages(initialUserId);
    }
  }, [activeConversation, initialUserId]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/messages/conversations');
      setConversations(data.conversations);
      if (!activeConversation && !initialUserId && data.conversations.length > 0) {
        setActiveConversation(data.conversations[0]);
      }
    } catch (err) {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const { data } = await api.get(`/messages/${otherUserId}`);
      setMessages(data.messages);
      
      // If we don't have an active conversation object but we have messages/initialUserId
      if (!activeConversation && data.conversationId) {
        // Need to update conversations list to show this new/active one
        fetchConversations();
      }
    } catch (err) {
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    let receiverId;
    if (activeConversation) {
      receiverId = activeConversation.participants.find(p => p._id !== user._id)._id;
    } else if (initialUserId) {
      receiverId = initialUserId;
    } else {
      return;
    }

    setSending(true);
    try {
      const { data } = await api.post('/messages', {
        receiverId,
        text: newMessage
      });
      setMessages([...messages, data.message]);
      setNewMessage('');
      fetchConversations(); // Refresh last message in sidebar
      
      // Clear URL param if it was a new chat
      if (initialUserId && !activeConversation) {
        setSearchParams({});
      }
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conv) => {
    return conv.participants.find(p => p._id !== user._id) || {};
  };

  if (loading) return <div className="pt-8"><LoadingSpinner /></div>;

  const currentChatUser = activeConversation 
    ? getOtherParticipant(activeConversation) 
    : (initialUserId ? { _id: initialUserId, name: 'Loading...' } : null);

  return (
    <div className="bg-surface-elevated rounded-xl border border-surface-border overflow-hidden flex h-[calc(100vh-140px)] min-h-[600px]">
      {/* Sidebar - Conversations List */}
      <div className="w-1/3 border-r border-surface-border flex flex-col bg-surface-card hidden md:flex">
        <div className="p-4 border-b border-surface-border">
          <h2 className="text-lg font-semibold text-white">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              No conversations yet.
            </div>
          ) : (
            conversations.map(conv => {
              const otherUser = getOtherParticipant(conv);
              const isActive = activeConversation?._id === conv._id || otherUser._id === initialUserId;
              
              return (
                <div 
                  key={conv._id}
                  onClick={() => {
                    setActiveConversation(conv);
                    setSearchParams({});
                  }}
                  className={`p-4 border-b border-surface-border cursor-pointer transition-colors flex gap-3
                    ${isActive ? 'bg-primary-500/10 border-l-2 border-l-primary-500' : 'hover:bg-surface-elevated border-l-2 border-l-transparent'}`}
                >
                  <img 
                    src={otherUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.name}`}
                    alt=""
                    className="w-12 h-12 rounded-full bg-surface-border object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`font-medium truncate ${isActive ? 'text-primary-400' : 'text-white'}`}>
                        {otherUser.name}
                      </h3>
                      <span className="text-[10px] text-gray-500 shrink-0">
                        {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {conv.lastMessage || 'Start a conversation'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-surface-elevated">
        {currentChatUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-surface-border bg-surface-card flex items-center gap-3">
              <img 
                src={currentChatUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentChatUser.name}`}
                alt=""
                className="w-10 h-10 rounded-full bg-surface-border object-cover"
              />
              <div>
                <h3 className="font-semibold text-white">{currentChatUser.name}</h3>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 flex-col">
                  <UserIcon className="w-12 h-12 mb-2 opacity-20" />
                  <p>Send a message to start the conversation!</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMine = msg.sender === user._id;
                  return (
                    <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isMine 
                          ? 'bg-primary-600 text-white rounded-tr-none' 
                          : 'bg-surface-card border border-surface-border text-gray-200 rounded-tl-none'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                        <span className={`text-[10px] mt-1 block ${isMine ? 'text-primary-200 text-right' : 'text-gray-500 text-left'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-surface-border bg-surface-card">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="input flex-1 bg-surface-elevated border-surface-border focus:border-primary-500"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim() || sending}
                  className="btn-primary w-12 h-12 p-0 flex items-center justify-center rounded-xl shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 flex-col">
            <UserIcon className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
