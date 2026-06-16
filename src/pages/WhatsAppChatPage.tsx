import React, { useState } from 'react';

interface Contact {
  id: string;
  name: string;
  role: 'Mandi Agent' | 'Farmer' | 'Driver';
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  phone: string;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

interface WhatsAppChatPageProps {
  onBackToDashboard: () => void;
}

const initialContacts: Contact[] = [
  {
    id: 'c1',
    name: 'Murugan Kandasamy',
    role: 'Mandi Agent',
    avatar: '👨‍💼',
    lastMessage: 'Sure, let me assign a mini truck from Velaan Cargo.',
    time: '10:26 AM',
    unreadCount: 0,
    phone: '919444000001',
  },
  {
    id: 'c2',
    name: 'Rajan Farm',
    role: 'Farmer',
    avatar: '👨‍🌾',
    lastMessage: 'Please check the moisture level of the paddy.',
    time: 'Yesterday',
    unreadCount: 1,
    phone: '919444000002',
  },
  {
    id: 'c3',
    name: 'Arjunan Nair',
    role: 'Mandi Agent',
    avatar: '👨‍💼',
    lastMessage: 'Price negotiation complete. Invoice generated.',
    time: '2 days ago',
    unreadCount: 0,
    phone: '919444000003',
  },
  {
    id: 'c4',
    name: 'Krishnamurthy P.',
    role: 'Driver',
    avatar: '🚚',
    lastMessage: 'Arrived at the Clock Tower junction.',
    time: '3 days ago',
    unreadCount: 0,
    phone: '919444000004',
  },
];

const initialMessagesMap: Record<string, Message[]> = {
  c1: [
    {
      id: 'm1',
      sender: 'them',
      text: "Hello Ravi, I've checked the Paddy Lot #A-2295. The grade is excellent and moisture is 13.5%.",
      time: '10:23 AM',
    },
    {
      id: 'm2',
      sender: 'them',
      text: 'Are you ready to confirm the transport booking?',
      time: '10:24 AM',
    },
    {
      id: 'm3',
      sender: 'me',
      text: 'Yes, please arrange for an enclosed vehicle. I need the delivery before 6 PM.',
      time: '10:25 AM',
    },
    {
      id: 'm4',
      sender: 'them',
      text: 'Sure, let me assign a mini truck from Velaan Cargo. It should be dispatched shortly.',
      time: '10:26 AM',
    },
    {
      id: 'm5',
      sender: 'me',
      text: 'Perfect. Thanks for your help.',
      time: '10:27 AM',
    },
  ],
  c2: [
    {
      id: 'm2_1',
      sender: 'them',
      text: 'Hello, the harvest is expected next week.',
      time: 'Yesterday',
    },
    {
      id: 'm2_2',
      sender: 'them',
      text: 'Please check the moisture level of the paddy.',
      time: 'Yesterday',
    },
  ],
  c3: [
    {
      id: 'm3_1',
      sender: 'them',
      text: 'Negotiation complete.',
      time: '2 days ago',
    },
  ],
  c4: [
    {
      id: 'm4_1',
      sender: 'them',
      text: 'Arrived at the Clock Tower junction.',
      time: '3 days ago',
    },
  ],
};

export const WhatsAppChatPage: React.FC<WhatsAppChatPageProps> = ({ onBackToDashboard }) => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [activeContactId, setActiveContactId] = useState('c1');
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(initialMessagesMap);
  const [inputText, setInputText] = useState('');

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];
  const activeMessages = messagesMap[activeContact.id] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: 'msg_' + Date.now(),
      sender: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
    }));

    // Update last message in contact list
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeContact.id
          ? { ...c, lastMessage: inputText, time: 'Now' }
          : c
      )
    );

    setInputText('');
  };

  const selectContact = (id: string) => {
    setActiveContactId(id);
    // Mark as read
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const openWhatsAppDeepLink = () => {
    const message = encodeURIComponent(`Hello ${activeContact.name}, referring to Velaan Bay Buyer Portal...`);
    window.open(`https://wa.me/${activeContact.phone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Top Navigation Row */}
      <div>
        <div className="text-xs text-slate-400 font-semibold mb-1">
          <span className="text-slate-455">Home</span>
          <span className="mx-1.5">&rsaquo;</span>
          <span className="text-slate-500 font-semibold">Communications</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">WhatsApp Sourcing Chat</h1>
      </div>

      {/* Main Container: 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-slate-200 rounded-lg shadow-sm overflow-hidden h-[600px] bg-white">
        
        {/* Left Column: Contacts list (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <input
              type="text"
              placeholder="Search chat or contact..."
              className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-700 font-medium"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {contacts.map((c) => {
              const isActive = c.id === activeContactId;
              return (
                <div
                  key={c.id}
                  onClick={() => selectContact(c.id)}
                  className={`p-3.5 flex gap-3 items-center cursor-pointer transition
                    ${isActive
                      ? 'bg-[#e2f2f1]/80 text-[#1b4d4f] border-l-4 border-[#1b4d4f]'
                      : 'hover:bg-slate-100 text-slate-700'
                    }`}
                >
                  {/* Avatar circle */}
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                    {c.avatar}
                  </div>

                  {/* Contact Summary Info */}
                  <div className="flex-1 min-w-0 space-y-0.5 text-xs font-semibold">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-800 font-black truncate">{c.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">{c.time}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                      <span className="truncate">{c.lastMessage}</span>
                      {c.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center shrink-0 shadow-2xs">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat view (8 cols) */}
        <div className="md:col-span-8 flex flex-col h-full bg-[#f0f2f5] relative">
          
          {/* Chat Header: WhatsApp Green Bar */}
          <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-sm z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-white/20 flex items-center justify-center text-lg shrink-0 shadow-sm">
                {activeContact.avatar}
              </div>
              <div className="text-xs font-bold leading-normal">
                <h3 className="text-sm font-black tracking-tight">{activeContact.name}</h3>
                <span className="text-emerald-300 flex items-center gap-1 font-semibold text-[10px] uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
            </div>

            {/* Link out button */}
            <button
              onClick={openWhatsAppDeepLink}
              className="px-3.5 py-1.5 bg-[#128c7e] hover:bg-[#0b665c] text-white text-[11px] font-black rounded-md shadow-xs transition flex items-center gap-1 border-none"
            >
              💬 Open in WhatsApp
            </button>
          </div>

          {/* Messages Area Stack */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-95">
            
            {/* Day separator */}
            <div className="flex justify-center my-2">
              <span className="bg-white/80 border border-slate-200/50 text-[10px] text-slate-500 font-bold px-3 py-1 rounded-md shadow-2xs">
                Today, 10:22 AM
              </span>
            </div>

            {/* Bubble loops */}
            {activeMessages.map((m) => {
              const isMe = m.sender === 'me';
              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-md rounded-lg px-3 py-2 shadow-2xs relative text-xs font-semibold leading-relaxed
                      ${isMe
                        ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none'
                      }`}
                  >
                    <p className="pr-8">{m.text}</p>
                    <span className="absolute bottom-1 right-1.5 text-[9px] text-slate-400 font-bold">
                      {m.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-[#f0f2f5] border-t border-slate-200 flex gap-2.5 items-center shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message..."
              className="flex-1 text-xs p-3 bg-white border border-slate-200 rounded-lg focus:border-[#1b4d4f] outline-hidden text-slate-700 font-bold shadow-2xs"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f72] text-white flex items-center justify-center text-sm shadow-md transition shrink-0 cursor-pointer border-none"
            >
              ➔
            </button>
          </form>

        </div>

      </div>

      {/* Return button */}
      <div>
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md transition text-center"
        >
          Back to Dashboard
        </button>
      </div>

    </div>
  );
};
