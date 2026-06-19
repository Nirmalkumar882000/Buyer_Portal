import React, { useState, useEffect } from 'react';
import { updateProfileApi, getProfileApi } from '../api/auth';
import { useToast } from '../context/ToastContext';

// ── Types ─────────────────────────────────────────────────────────────────────

type Section = 'personal' | 'business' | 'bank' | 'notifications' | 'security';

interface NotifRow {
  label: string;
  sms: boolean;
  whatsapp: boolean;
  email: boolean;
}

interface ProfileSettingsPageProps {
  formData: any;
  onBackToDashboard: () => void;
  onSaveSuccess?: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const mask = (val: string) => {
  if (!val) return '';
  const visible = val.slice(-4);
  return '**** **** ' + visible;
};

const SectionLink: React.FC<{
  id: Section;
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}> = ({ id: _id, active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left flex items-center gap-2.5 px-4 py-3 text-sm font-semibold rounded-md transition-all duration-150 ${active
      ? 'bg-[#e2f2f1] text-[#1a4a49] border-l-4 border-[#1a4a49]'
      : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
      }`}
  >
    <span className="text-base">{icon}</span>
    {label}
  </button>
);

const Field: React.FC<{
  label: string;
  value: string;
  onChange?: (v: string) => void;
  editable?: boolean;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  masked?: boolean;
}> = ({ label, value, onChange, editable = false, type = 'text', placeholder, readOnly, masked }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      value={masked && !editable ? mask(value) : value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={!editable || readOnly}
      placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 rounded-md border text-xs font-semibold outline-hidden transition
        ${!editable || readOnly
          ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-default'
          : 'bg-white border-slate-300 text-slate-800 focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]'
        }`}
    />
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({
  formData,
  onBackToDashboard,
  onSaveSuccess,
}) => {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<Section>('personal');

  // ── Personal Info State ────────────────────────────────────────────────────
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: formData?.fullName || '',
    mobile: formData?.mobile || '',
    email: formData?.email || '',
    state: formData?.state || '',
  });

  // ── Business Details State ─────────────────────────────────────────────────
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    businessName: formData?.businessName || '',
    businessType: formData?.businessType || '',
    gstin: formData?.gstin || '',
    district: formData?.district || '',
    address: formData?.address || '',
    turnover: formData?.turnover || '',
  });

  // ── Bank Details State ─────────────────────────────────────────────────────
  const [editingBank, setEditingBank] = useState(false);
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [bankInfo, setBankInfo] = useState({
    bankName: '',
    accountNumber: '',
    ifsc: '',
    accountName: '',
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileApi();
        // Check if the response matches successResponse format { status: true, data: { user: {...} } }
        const u = res?.data?.user || res?.user;
        if (u) {
          setPersonalInfo(p => ({
            ...p,
            fullName: u.username || p.fullName,
            mobile: u.mobile_number || p.mobile,
            email: u.email || p.email,
            state: u.state || p.state,
          }));
          setBusinessInfo(b => ({
            ...b,
            businessName: u.business_name || b.businessName,
            businessType: u.business_type || b.businessType,
            gstin: u.gst_no || b.gstin,
            district: u.district || b.district,
            address: u.address || b.address,
            turnover: u.annual_turnover || b.turnover,
          }));
          setBankInfo(b => ({
            ...b,
            bankName: u.bank_name || b.bankName,
            accountNumber: u.account_number || b.accountNumber,
            ifsc: u.ifsc_code || b.ifsc,
            accountName: u.account_holder || b.accountName,
          }));
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
        showToast('Failed to load profile details.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [showToast]);

  // ── Notification Preferences State ─────────────────────────────────────────
  const [notifRows, setNotifRows] = useState<NotifRow[]>([
    { label: 'Auction Win / Outbid', sms: true, whatsapp: true, email: true },
    { label: 'Wallet Top Up / Withdrawal', sms: true, whatsapp: true, email: false },
    { label: 'Delivery Updates', sms: true, whatsapp: true, email: false },
    { label: 'Demand Quotes Received', sms: false, whatsapp: true, email: true },
    { label: 'Agent Registration Status', sms: true, whatsapp: true, email: true },
    { label: 'New Auctions Available', sms: false, whatsapp: true, email: false },
  ]);

  // ── Security State ─────────────────────────────────────────────────────────
  const [deviceRows] = useState([
    { device: 'Chrome — MacBook Pro', location: 'Thoothukudi, Tamil Nadu', lastActive: 'Active now', current: true },
    { device: 'Safari — iPhone 14', location: 'Thoothukudi, Tamil Nadu', lastActive: '2 hrs ago', current: false },
  ]);

  const toggleNotif = (rowIdx: number, col: 'sms' | 'whatsapp' | 'email') => {
    setNotifRows((prev) =>
      prev.map((r, i) => (i === rowIdx ? { ...r, [col]: !r[col] } : r))
    );
  };

  const handleBankEditClick = () => {
    setEditingBank(true);
  };

  const handleOtpVerify = () => {
    if (otpInput.length >= 4) {
      setShowOtpPrompt(false);
      setOtpInput('');
      setEditingBank(true);
    }
  };

  const handleSaveAll = async () => {
    try {
      const payload = {
        username: personalInfo.fullName,
        email: personalInfo.email,
        state: personalInfo.state,
        business_name: businessInfo.businessName,
        business_type: businessInfo.businessType,
        gst_no: businessInfo.gstin,
        district: businessInfo.district,
        address: businessInfo.address,
        annual_turnover: businessInfo.turnover,
        bank_name: bankInfo.bankName,
        account_number: bankInfo.accountNumber,
        ifsc_code: bankInfo.ifsc,
        account_holder: bankInfo.accountName,
      };

      await updateProfileApi(payload);

      setEditingPersonal(false);
      setEditingBusiness(false);
      setEditingBank(false);
      showToast('Profile updated successfully!', 'success');
      onSaveSuccess?.();
    } catch (error) {
      console.error('Failed to update profile:', error);
      showToast('Failed to update profile. Please try again.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1b4d4f] mb-4"></div>
        <p className="text-slate-500 text-sm font-medium">Loading profile details...</p>
      </div>
    );
  }

  // ── Nav sections ───────────────────────────────────────────────────────────
  const sections = [
    { id: 'personal' as Section, icon: '👤', label: 'Personal Info' },
    { id: 'business' as Section, icon: '🏢', label: 'Business Details' },
    { id: 'bank' as Section, icon: '🏦', label: 'Bank Details' },
    // { id: 'notifications' as Section, icon: '🔔', label: 'Notifications' },
    // { id: 'security' as Section, icon: '🔒', label: 'Security' },
  ];

  return (
    <div className="space-y-0 font-sans">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="text-xs text-slate-400 font-medium mb-1">
            <button onClick={onBackToDashboard} className="hover:text-slate-600 underline">Home</button>
            <span className="mx-1.5">›</span>
            <span className="text-slate-500 font-semibold">Profile &amp; Settings</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Profile &amp; Settings</h1>
        </div>
        <button
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold rounded-md shadow-xs transition shrink-0"
        >
          💾 Save All Changes
        </button>
      </div>

      {/* ── Two-column layout ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Nav */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-xs p-3 flex flex-col gap-1">
          {sections.map((s) => (
            <SectionLink
              key={s.id}
              id={s.id}
              active={activeSection === s.id}
              icon={s.icon}
              label={s.label}
              onClick={() => setActiveSection(s.id)}
            />
          ))}
        </div>

        {/* Right Content */}
        <div className="lg:col-span-9 space-y-6">

          {/* ── PERSONAL INFO ─────────────────────────────────────────────── */}
          {activeSection === 'personal' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Personal Information</h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">Your registered contact details</p>
                </div>
                {!editingPersonal ? (
                  <button
                    onClick={() => setEditingPersonal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#1b4d4f] border border-[#1b4d4f] rounded-md hover:bg-teal-50 transition"
                  >
                    ✏ Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingPersonal(false)}
                      className="px-3.5 py-2 text-xs font-bold text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAll}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-[#1b4d4f] rounded-md hover:bg-[#123637] transition"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" value={personalInfo.fullName}
                  editable={editingPersonal} onChange={(v) => setPersonalInfo(p => ({ ...p, fullName: v }))} />
                <Field label="Mobile" value={personalInfo.mobile}
                  editable={editingPersonal} readOnly={true} type="tel" onChange={(v) => setPersonalInfo(p => ({ ...p, mobile: v }))} />
                <Field label="Email" value={personalInfo.email}
                  editable={editingPersonal} type="email" onChange={(v) => setPersonalInfo(p => ({ ...p, email: v }))} />
                <Field label="State" value={personalInfo.state}
                  editable={editingPersonal} onChange={(v) => setPersonalInfo(p => ({ ...p, state: v }))} />
              </div>
            </div>
          )}

          {/* ── BUSINESS DETAILS ──────────────────────────────────────────── */}
          {activeSection === 'business' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Business Details</h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">Your trading entity details</p>
                </div>
                {!editingBusiness ? (
                  <button
                    onClick={() => setEditingBusiness(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#1b4d4f] border border-[#1b4d4f] rounded-md hover:bg-teal-50 transition"
                  >
                    ✏ Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditingBusiness(false)} className="px-3.5 py-2 text-xs font-bold text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition">Cancel</button>
                    <button onClick={handleSaveAll} className="px-3.5 py-2 text-xs font-bold text-white bg-[#1b4d4f] rounded-md hover:bg-[#123637] transition">Save</button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Business Name" value={businessInfo.businessName} editable={editingBusiness}
                  onChange={(v) => setBusinessInfo(b => ({ ...b, businessName: v }))} />
                <Field label="Business Type" value={businessInfo.businessType} editable={editingBusiness}
                  onChange={(v) => setBusinessInfo(b => ({ ...b, businessType: v }))} />
                <Field label="GSTIN" value={businessInfo.gstin} editable={editingBusiness}
                  onChange={(v) => setBusinessInfo(b => ({ ...b, gstin: v }))} />
                <Field label="District" value={businessInfo.district} editable={editingBusiness}
                  onChange={(v) => setBusinessInfo(b => ({ ...b, district: v }))} />
                <Field label="Annual Turnover" value={businessInfo.turnover} editable={editingBusiness}
                  onChange={(v) => setBusinessInfo(b => ({ ...b, turnover: v }))} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Business Address</label>
                <textarea
                  value={businessInfo.address}
                  readOnly={!editingBusiness}
                  onChange={(e) => setBusinessInfo(b => ({ ...b, address: e.target.value }))}
                  rows={2}
                  className={`w-full px-3.5 py-2.5 rounded-md border text-xs font-semibold outline-hidden transition resize-none
                    ${!editingBusiness ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-800 focus:border-[#1b4d4f]'}`}
                />
              </div>

              {/* GSTIN Verification badge */}
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                  ✓ GSTIN Verified
                </span>
                <span className="text-slate-400 text-[10px]">Verified on 12 Jun 2025 via GST Portal</span>
              </div>
            </div>
          )}

          {/* ── BANK DETAILS ──────────────────────────────────────────────── */}
          {activeSection === 'bank' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Bank Details <span className="text-slate-400 font-normal text-xs">(for Withdrawals)</span></h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">Manage your withdrawal bank account</p>
                </div>
                {!editingBank ? (
                  <button
                    onClick={handleBankEditClick}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#1b4d4f] border border-[#1b4d4f] rounded-md hover:bg-teal-50 transition"
                  >
                    ✏ Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditingBank(false)} className="px-3.5 py-2 text-xs font-bold text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition">Cancel</button>
                    <button onClick={handleSaveAll} className="px-3.5 py-2 text-xs font-bold text-white bg-[#1b4d4f] rounded-md hover:bg-[#123637] transition">Save</button>
                  </div>
                )}
              </div>



              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Bank Name" value={bankInfo.bankName} editable={editingBank}
                  onChange={(v) => setBankInfo(b => ({ ...b, bankName: v }))} />
                <Field label="Account Number" value={bankInfo.accountNumber} editable={editingBank}
                  masked={true} onChange={(v) => setBankInfo(b => ({ ...b, accountNumber: v }))} />
                <Field label="IFSC Code" value={bankInfo.ifsc} editable={editingBank}
                  onChange={(v) => setBankInfo(b => ({ ...b, ifsc: v }))} />
                <Field label="Account Name" value={bankInfo.accountName} editable={editingBank}
                  onChange={(v) => setBankInfo(b => ({ ...b, accountName: v }))} />
              </div>

              {!editingBank && (
                <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-[10px] text-slate-500 flex items-center gap-2">
                  <span>🔒</span>
                  <span>Bank account details are securely masked. Click <strong>Edit</strong> to update.</span>
                </div>
              )}
            </div>
          )}

          {/* {activeSection === 'notifications' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Notification Preferences</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Changes save immediately. Controls what alerts you receive per channel.</p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-5 py-3 font-bold text-slate-700">Event</th>
                      <th className="px-5 py-3 font-bold text-[#1b4d4f] text-center">SMS</th>
                      <th className="px-5 py-3 font-bold text-[#25d366] text-center">WhatsApp</th>
                      <th className="px-5 py-3 font-bold text-blue-600 text-center">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {notifRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="px-5 py-3.5 text-slate-700 font-semibold">{row.label}</td>
                        {(['sms', 'whatsapp', 'email'] as const).map((col) => (
                          <td key={col} className="px-5 py-3.5 text-center">
                            <button
                              onClick={() => toggleNotif(idx, col)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center mx-auto transition-all duration-150
                                ${row[col]
                                  ? col === 'sms'
                                    ? 'bg-[#1b4d4f] border-[#1b4d4f]'
                                    : col === 'whatsapp'
                                      ? 'bg-[#25d366] border-[#25d366]'
                                      : 'bg-blue-600 border-blue-600'
                                  : 'bg-white border-slate-300 hover:border-slate-400'
                                }`}
                              title={`Toggle ${col} for ${row.label}`}
                            >
                              {row[col] && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-md p-3.5 text-[10px] text-blue-800 font-semibold flex items-start gap-2 leading-relaxed">
                <span className="text-sm">ℹ️</span>
                <span>Notification settings sync to the <strong>Velaan Bay Mobile App</strong> within 5 minutes. Critical security alerts (logins, withdrawals) are always sent regardless of your preferences.</span>
              </div>
            </div>
          )} */}

          {/* ── SECURITY ─────────────────────────────────────────────────── */}
          {/* {activeSection === 'security' && (
            <div className="space-y-5">
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-800">Security Settings</h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">Manage your account security and active sessions</p>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <span>🔑</span> Login PIN / OTP
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Login uses mobile OTP. Disable OTP only if your number is changed.
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-md w-fit">
                      ✓ OTP Login Active
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <span>🛡️</span> Two-Factor Authentication
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      All wallet withdrawals and profile edits require OTP re-verification.
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-md w-fit">
                      ✓ Enforced for Sensitive Actions
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <span>⏱️</span> Session Timeout
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Auto-logout after 15 minutes of inactivity. Keeps your account safe on shared devices.
                    </p>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-700 font-semibold outline-hidden focus:border-[#1b4d4f]">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>60 minutes</option>
                    </select>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <span>📱</span> Mobile App Sync
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Profile and preferences sync to the Velaan Bay Mobile App automatically.
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#1b4d4f] bg-teal-50 border border-teal-100 px-2.5 py-1.5 rounded-md w-fit">
                      ✓ Synced — Last: 2 mins ago
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Active Sessions</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Devices currently logged into your account</p>
                  </div>
                  <button className="text-xs text-rose-600 font-bold border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-md transition">
                    Log Out All Others
                  </button>
                </div>
                <div className="space-y-3">
                  {deviceRows.map((d, i) => (
                    <div key={i} className={`flex justify-between items-center p-4 rounded-lg border ${d.current ? 'border-teal-200 bg-teal-50/30' : 'border-slate-200 bg-white'}`}>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          {d.device}
                          {d.current && <span className="text-[9px] font-bold bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-sm">This Device</span>}
                        </p>
                        <p className="text-[10px] text-slate-400">📍 {d.location} · {d.lastActive}</p>
                      </div>
                      {!d.current && (
                        <button className="text-[10px] text-rose-600 font-bold hover:underline">
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-rose-700">⚠ Danger Zone</h3>
                <p className="text-[10px] text-rose-600 leading-relaxed">
                  Permanently delete your account and all associated data. This action is irreversible. All wallet balance must be withdrawn first.
                </p>
                <button className="text-xs text-rose-700 font-bold border border-rose-300 bg-white hover:bg-rose-50 px-4 py-2 rounded-md transition">
                  Request Account Deletion
                </button>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};
