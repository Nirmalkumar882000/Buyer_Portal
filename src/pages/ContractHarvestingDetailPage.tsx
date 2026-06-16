import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface ChatMessage {
  id: string;
  sender: 'farmer' | 'buyer';
  senderInitial: string;
  text: string;
  timestamp: string;
}

interface ContractHarvestingDetailPageProps {
  onBackToList: () => void;
}

export const ContractHarvestingDetailPage: React.FC<ContractHarvestingDetailPageProps> = ({
  onBackToList,
}) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'farmer',
      senderInitial: 'RM',
      text: 'Hello, I have 20 MT Ponni paddy ready for Aug harvest. Price ₹18,000/q. Interested?',
      timestamp: '10 Jul, 10:22 AM',
    },
    {
      id: '2',
      sender: 'buyer',
      senderInitial: 'RK',
      text: 'Yes, interested. Can you confirm moisture level and bagging standard?',
      timestamp: '10 Jul, 11:05 AM',
    },
    {
      id: '3',
      sender: 'farmer',
      senderInitial: 'RM',
      text: 'Moisture will be 13–14%. Standard HDPE bags 50kg. Can deliver to Thoothukudi.',
      timestamp: '10 Jul, 11:30 AM',
    },
  ]);

  const [inputVal, setInputVal] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const timeString = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newMsg: ChatMessage = {
      id: String(messages.length + 1),
      sender: 'buyer',
      senderInitial: 'RK',
      text: inputVal,
      timestamp: `Today, ${timeString}`,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    // Simulate farmer reply
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const farmerReply: ChatMessage = {
        id: String(messages.length + 2),
        sender: 'farmer',
        senderInitial: 'RM',
        text: 'Sure, we can discuss delivery timelines and contract terms once you request details.',
        timestamp: `Today, ${replyTime}`,
      };
      setMessages((prev) => [...prev, farmerReply]);
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onBackToList} className="hover:text-slate-600 underline font-semibold">Contract Harvesting</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">Rajan Murugesan &mdash; Paddy</span>
      </div>

      {/* Screen Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Contract Harvesting Detail</h1>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Profile, Map, Specs, Actions) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Farmer Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl shrink-0">
              👨‍🌾
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-850">Rajan Murugesan</h2>
              <p className="text-[10px] text-slate-450 font-bold flex items-center gap-1.5">
                📍 Thoothukudi, Tamil Nadu
                <span className="bg-emerald-50 text-emerald-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm border border-emerald-100">
                  Verified Farmer
                </span>
              </p>
            </div>
          </div>

          {/* Location Map Placeholder */}
          <div className="bg-emerald-50/20 border border-slate-200 rounded-lg p-5 text-center flex flex-col items-center justify-center gap-3">
            <div className="text-3xl select-none">🗺️</div>
            <div className="space-y-0.5 text-xs font-semibold text-slate-700">
              <p className="font-bold text-slate-850">Farm Location Map</p>
              <p className="text-[10px] text-slate-450 font-medium">Thoothukudi District, Tamil Nadu</p>
              <p className="text-[10px] text-[#1b4d4f] font-bold">GPS: 8.7642°N, 77.7567°E</p>
            </div>
          </div>

          {/* Crop Specs Grid */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs font-semibold text-slate-700">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">CROP</span>
                <span className="text-slate-850">Paddy (Ponni Variety)</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">FARM SIZE</span>
                <span className="text-slate-855">15 acres</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">EST. QUANTITY</span>
                <span className="text-slate-855">20 MT</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">HARVEST DATE</span>
                <span className="text-slate-855">Aug 15&ndash;20, 2025</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">PRICE INDICATION</span>
                <span className="text-[#1b4d4f] font-extrabold">₹18,000/q (negotiable)</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">MOISTURE</span>
                <span className="text-slate-855">13&ndash;14% (expected)</span>
              </div>
            </div>
          </div>

          {/* Commit Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => showToast('Details info request sent! You will be notified when the farmer responds.', 'success')}
              className="bg-white hover:bg-slate-50 text-slate-750 border border-slate-350 text-xs font-bold py-3 rounded-md transition text-center shadow-2xs flex items-center justify-center gap-1.5"
            >
              📄 Request Details
            </button>
            <button
              onClick={() => showToast('Opening farm visit scheduler...', 'info')}
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-3 rounded-md transition text-center shadow-2xs flex items-center justify-center gap-1.5"
            >
              🚗 Book Farm Visit
            </button>
            <button
              onClick={() => showToast('Negotiation chat thread activated!', 'success')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-md transition text-center shadow-xs flex items-center justify-center gap-1.5"
            >
              💬 Start Negotiation
            </button>
          </div>
        </div>

        {/* Right Column (WhatsApp-style negotiation thread) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs flex flex-col justify-between h-[520px]">
          {/* Chat Header */}
          <div className="bg-slate-50 px-4.5 py-3 border-b border-slate-100 flex justify-between items-center shrink-0">
            <h3 className="text-xs font-bold text-slate-800">Negotiation Thread</h3>
            <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-sm">
              Active
            </span>
          </div>

          {/* Chat Bubbles Feed */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3.5 bg-slate-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-start max-w-[85%]
                  ${msg.sender === 'buyer' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar Initials */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs
                    ${msg.sender === 'buyer'
                      ? 'bg-[#1b4d4f] text-white'
                      : 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                    }`}
                >
                  {msg.senderInitial}
                </div>

                {/* Bubble content */}
                <div
                  className={`rounded-lg p-3 text-xs leading-relaxed font-semibold
                    ${msg.sender === 'buyer'
                      ? 'bg-[#e2f2f1] text-[#1b4d4f] rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] text-slate-400 block mt-1.5 text-right font-medium">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-50/70 border-t border-slate-100 flex gap-2 shrink-0">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 text-xs p-2.5 bg-white border border-slate-305 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-750 font-medium"
            />
            <button
              type="submit"
              className="bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow-xs"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
