'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search, Bell, CheckCircle, Clock, AlertCircle, X, FileText,
  MapPin, CalendarDays, Send, Eye, DollarSign, TrendingUp,
} from 'lucide-react';
import ActivityPanel from '@/components/ui/ActivityPanel';
import toast from 'react-hot-toast';

/* ========= Types ========= */
interface VerificationTask {
  id: string;
  title: string;
  description: string;
  icon: typeof Clock;
  iconBg: string;
  iconColor: string;
  buttonLabel: string;
  buttonColor: string;
  status: 'pending' | 'approved' | 'rejected';
}

const initialTasks: VerificationTask[] = [
  {
    id: 'farm-verify',
    title: 'Farm Verification',
    description: 'Green Valley Extension requesting audit.',
    icon: Clock,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    buttonLabel: 'Review Request',
    buttonColor: 'text-[#38B26D]',
    status: 'pending',
  },
  {
    id: 'token-mint',
    title: 'Token Minting',
    description: 'Batch #CB-2024-001 ready for tokens.',
    icon: CheckCircle,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    buttonLabel: 'Approve Minting',
    buttonColor: 'text-blue-600',
    status: 'pending',
  },
  {
    id: 'marketplace-bid',
    title: 'Marketplace',
    description: 'New bid on Batch #CB-2023-089',
    icon: AlertCircle,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    buttonLabel: 'View Bid',
    buttonColor: 'text-purple-600',
    status: 'pending',
  },
];

const notifications = [
  { id: 1, text: 'Farm verification approved for Plot A', time: '10 min ago', read: false },
  { id: 2, text: '150 credits minted successfully', time: '1 hr ago', read: false },
  { id: 3, text: 'New bid of ₹8,500 received', time: '3 hrs ago', read: true },
  { id: 4, text: 'Carbon report ready for download', time: '1 day ago', read: true },
];

/* ========= Modal Component ========= */
function Modal({ open, onClose, title, children }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-100 rounded-t-2xl">
          <h3 className="text-lg font-bold text-[#1F2937]">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}

/* ========= Main Component ========= */
export default function RightSidebar({ onClose }: { onClose?: () => void }) {
  const [search, setSearch] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const [readNotifs, setReadNotifs] = useState<Set<number>>(new Set());
  const notifRef = useRef<HTMLDivElement>(null);

  const [tasks, setTasks] = useState(initialTasks);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Farm verification form
  const [verifyNotes, setVerifyNotes] = useState('');
  // Mint form
  const [mintQty, setMintQty] = useState('');
  // Bid form
  const [bidAmount, setBidAmount] = useState('');

  // Close notification dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredTasks = search.trim()
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase()),
      )
    : tasks;

  const unreadCount = notifications.filter((n) => !n.read && !readNotifs.has(n.id)).length;

  function markAllRead() {
    setReadNotifs(new Set(notifications.map((n) => n.id)));
  }

  function handleApproveVerification() {
    setTasks((prev) => prev.map((t) => (t.id === 'farm-verify' ? { ...t, status: 'approved' as const } : t)));
    setActiveModal(null);
    setVerifyNotes('');
    toast.success('Farm verification approved!');
  }

  function handleRejectVerification() {
    if (!verifyNotes.trim()) {
      toast.error('Please add review notes before rejecting.');
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === 'farm-verify' ? { ...t, status: 'rejected' as const } : t)));
    setActiveModal(null);
    setVerifyNotes('');
    toast.success('Farm verification request rejected.');
  }

  function handleMintApprove() {
    const qty = parseInt(mintQty, 10);
    if (!qty || qty <= 0) {
      toast.error('Enter a valid token quantity.');
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === 'token-mint' ? { ...t, status: 'approved' as const } : t)));
    setActiveModal(null);
    setMintQty('');
    toast.success(`${qty} carbon tokens minted successfully!`);
  }

  function handleBidAccept() {
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) {
      toast.error('Enter a valid counter-offer or accept the current bid.');
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === 'marketplace-bid' ? { ...t, status: 'approved' as const } : t)));
    setActiveModal(null);
    setBidAmount('');
    toast.success('Bid accepted! Transaction initiated.');
  }

  function handleBidReject() {
    setTasks((prev) => prev.map((t) => (t.id === 'marketplace-bid' ? { ...t, status: 'rejected' as const } : t)));
    setActiveModal(null);
    setBidAmount('');
    toast.success('Bid rejected.');
  }

  const statusBadge = (status: string) => {
    if (status === 'approved') return <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Approved</span>;
    if (status === 'rejected') return <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Rejected</span>;
    return null;
  };

  return (
    <>
      <aside className="w-full bg-white flex flex-col h-full">
        <div className="p-5 space-y-6">

          {/* Close btn (mobile only) + header */}
          <div className="flex items-center justify-between xl:hidden">
            <h2 className="text-base font-bold text-[#1F2937]">Panel</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Search & Notifications */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#38B26D]/20 outline-none text-gray-600 placeholder:text-gray-400"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              )}
            </div>

            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 flex items-center justify-center bg-red-500 rounded-full text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifs && (
                <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <span className="text-sm font-bold text-[#1F2937]">Notifications</span>
                    <button onClick={markAllRead} className="text-xs text-[#38B26D] font-semibold hover:underline">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b border-gray-50 last:border-0 ${
                          !n.read && !readNotifs.has(n.id) ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <p className="text-xs text-gray-700">{n.text}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Verification Tasks */}
          <div>
            <h3 className="text-base font-bold text-[#1F2937] mb-3">Verification Tasks</h3>
            <div className="space-y-3">
              {filteredTasks.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No matching tasks found.</p>
              )}
              {filteredTasks.map((task) => {
                const Icon = task.icon;
                return (
                  <div
                    key={task.id}
                    className="p-4 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 ${task.iconBg} ${task.iconColor} rounded-lg shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-[#1F2937]">{task.title}</h4>
                          {statusBadge(task.status)}
                        </div>
                        <p className="text-xs text-[#6B7280] mt-1">{task.description}</p>
                        {task.status === 'pending' ? (
                          <button
                            onClick={() => setActiveModal(task.id)}
                            className={`mt-3 text-xs font-semibold ${task.buttonColor} hover:underline`}
                          >
                            {task.buttonLabel}
                          </button>
                        ) : (
                          <p className="mt-2 text-[10px] text-gray-400">
                            {task.status === 'approved' ? '✓ Completed' : '✕ Declined'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="pt-4 border-t border-gray-100">
            <ActivityPanel />
          </div>
        </div>
      </aside>

      {/* ===== MODALS ===== */}

      {/* Farm Verification Modal */}
      <Modal open={activeModal === 'farm-verify'} onClose={() => setActiveModal(null)} title="Farm Verification Review">
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">Green Valley Extension</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-amber-700">
              <div>
                <p className="text-amber-500">Farm Size</p>
                <p className="font-medium">12.5 acres</p>
              </div>
              <div>
                <p className="text-amber-500">Crop Type</p>
                <p className="font-medium">Rice Paddy</p>
              </div>
              <div>
                <p className="text-amber-500">Submitted</p>
                <p className="font-medium">2 days ago</p>
              </div>
              <div>
                <p className="text-amber-500">Est. Credits</p>
                <p className="font-medium">45.2 tCO₂e</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
            <FileText className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="text-xs text-gray-500">Documents: Soil Report, Land Title, Geo-tag Photos</span>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Review Notes</label>
            <textarea
              value={verifyNotes}
              onChange={(e) => setVerifyNotes(e.target.value)}
              placeholder="Add notes about this verification request..."
              rows={3}
              className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:ring-2 focus:ring-[#38B26D]/20 focus:border-[#38B26D] outline-none resize-none text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRejectVerification}
              className="flex-1 py-2.5 px-4 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={handleApproveVerification}
              className="flex-1 py-2.5 px-4 bg-[#38B26D] text-white text-sm font-medium rounded-xl hover:bg-[#2ea35e] transition-colors"
            >
              Approve
            </button>
          </div>
        </div>
      </Modal>

      {/* Token Minting Modal */}
      <Modal open={activeModal === 'token-mint'} onClose={() => setActiveModal(null)} title="Approve Token Minting">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Batch #CB-2024-001</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-blue-700">
              <div>
                <p className="text-blue-500">Verified Credits</p>
                <p className="font-medium">150.8 tCO₂e</p>
              </div>
              <div>
                <p className="text-blue-500">Farms Included</p>
                <p className="font-medium">3 farms</p>
              </div>
              <div>
                <p className="text-blue-500">Verification Date</p>
                <p className="font-medium">Jan 15, 2025</p>
              </div>
              <div>
                <p className="text-blue-500">Methodology</p>
                <p className="font-medium">Verra VCS 0042</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Tokens to Mint</label>
            <div className="relative">
              <input
                type="number"
                value={mintQty}
                onChange={(e) => setMintQty(e.target.value)}
                placeholder="e.g. 150"
                min="1"
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none text-gray-700 placeholder:text-gray-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">tokens</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Max: 150 tokens (1 token = 1 tCO₂e)</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveModal(null)}
              className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleMintApprove}
              className="flex-1 py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" /> Mint Tokens
            </button>
          </div>
        </div>
      </Modal>

      {/* Marketplace Bid Modal */}
      <Modal open={activeModal === 'marketplace-bid'} onClose={() => setActiveModal(null)} title="Marketplace Bid">
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-800">Batch #CB-2023-089</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-purple-700">
              <div>
                <p className="text-purple-500">Bid From</p>
                <p className="font-medium">TechCorp Inc.</p>
              </div>
              <div>
                <p className="text-purple-500">Bid Amount</p>
                <p className="font-medium text-lg">₹8,500</p>
              </div>
              <div>
                <p className="text-purple-500">Credits</p>
                <p className="font-medium">50 tCO₂e</p>
              </div>
              <div>
                <p className="text-purple-500">Price/Credit</p>
                <p className="font-medium">₹170/tCO₂e</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
            <Eye className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="text-xs text-gray-500">Market avg: ₹155/tCO₂e — This bid is <span className="text-emerald-600 font-semibold">9.7% above market</span></span>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Counter-offer (optional)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="8500"
                min="1"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Leave empty and click Accept to take the current bid.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBidReject}
              className="flex-1 py-2.5 px-4 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors"
            >
              Reject Bid
            </button>
            <button
              onClick={() => {
                if (!bidAmount.trim()) setBidAmount('8500');
                handleBidAccept();
              }}
              className="flex-1 py-2.5 px-4 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors"
            >
              Accept Bid
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
