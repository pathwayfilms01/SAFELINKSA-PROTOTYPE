import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import LOGO_URI from "./safelink_logo.jpeg";

// ── Supabase ─────────────────────────────────────────────────────
const SUPABASE_URL = "https://jnhuawinagsjznuwdnft.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z2THAKF6AKAw8cWqwED1uA_JDhHXEDH";
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Brand ────────────────────────────────────────────────────────
const C = {
  red:"#D0021B",redDark:"#A50115",redGlow:"rgba(208,2,27,0.25)",
  black:"#0A0A0A",blackMid:"#141414",blackSoft:"#1E1E1E",
  card:"#1A1A1A",border:"#2A2A2A",
  white:"#FFFFFF",offWhite:"#F5F5F5",
  grey:"#888888",greyMid:"#555555",greyLight:"#CCCCCC",
  green:"#00C853",greenBg:"rgba(0,200,83,0.12)",
  amber:"#FFB300",amberBg:"rgba(255,179,0,0.12)",
  blue:"#2196F3",blueBg:"rgba(33,150,243,0.12)",
  purple:"#9C27B0",purpleBg:"rgba(156,39,176,0.12)",
};

// ── Translations ─────────────────────────────────────────────────

// ── Styles ────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0A0A0A;font-family:'DM Sans',sans-serif;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:#141414;} ::-webkit-scrollbar-thumb{background:#D0021B;border-radius:2px;}
  .phone-shell{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 30%,rgba(208,2,27,0.08) 0%,#0A0A0A 70%);}
  @media(max-width:500px){.phone-shell{background:#0A0A0A;}.phone-frame{width:100%!important;height:100%!important;border-radius:0!important;border:none!important;box-shadow:none!important;}}
  .phone-frame{width:390px;height:844px;background:#141414;border-radius:44px;border:2px solid #2A2A2A;box-shadow:0 0 0 8px #111,0 40px 80px rgba(0,0,0,0.8),0 0 60px rgba(208,2,27,0.1);overflow:hidden;position:relative;display:flex;flex-direction:column;}
  .screen{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;}
  .btn{border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;transition:all 0.2s;border-radius:12px;}
  .btn-red{background:#D0021B;color:#fff;} .btn-red:hover{background:#A50115;}
  .btn-ghost{background:transparent;color:#D0021B;border:1.5px solid #D0021B;} .btn-ghost:hover{background:rgba(208,2,27,0.1);}
  .btn-dark{background:#1E1E1E;color:#fff;border:1.5px solid #2A2A2A;} .btn-dark:hover{background:#252525;}
  .input{width:100%;padding:14px 16px;background:#1E1E1E;border:1.5px solid #2A2A2A;border-radius:12px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color 0.2s;}
  .input:focus{border-color:#D0021B;} .input::placeholder{color:#555;}
  .select{width:100%;padding:14px 16px;background:#1E1E1E;border:1.5px solid #2A2A2A;border-radius:12px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;appearance:none;}
  .select:focus{border-color:#D0021B;}
  .card{background:#1A1A1A;border:1px solid #2A2A2A;border-radius:16px;padding:16px;}
  .tag{display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.5px;}
  .fade-in{animation:fadeIn 0.3s ease;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
  .pulse{animation:pulse 2s infinite;}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
  .spin{animation:spin 1s linear infinite;}
  @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  .panic-pulse{animation:panicPulse 1s infinite;}
  @keyframes panicPulse{0%,100%{box-shadow:0 0 0 0 rgba(208,2,27,0.4);}50%{box-shadow:0 0 0 12px rgba(208,2,27,0);}}
  .whatsapp-slide{animation:slideUp 0.4s ease;}
  @keyframes slideUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
`;

// ── Helpers ───────────────────────────────────────────────────────
function genCaseId() {
  const y = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `SL-JHB-${y}-${n}`;
}
async function hashPassword(pw) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
}

// ── Language Context ──────────────────────────────────────────────
const t = {
    appName:'SAFELINK SA', tagline:'GBV Shelter Referral System',
    signIn:'Sign In', register:'Register', email:'Email Address',
    password:'Password', confirmPassword:'Confirm Password',
    fullName:'Full Name', phone:'Phone Number', organisation:'Organisation / Station Name',
    role:'Role', createAccount:'Create Account', signingIn:'Please wait...',
    vfr:'VFR Member', socialWorker:'Social Worker', shelterCoord:'Shelter Coordinator',
    newRequest:'+ New Shelter Request', welcomeBack:'Welcome back',
    totalCases:'Total Cases', matched:'Matched', open:'Open',
    shelterAvailability:'SHELTER AVAILABILITY', recentCases:'RECENT CASES',
    viewAll:'View all', beds:'beds',
    matchFound:'SHELTER MATCHED', noMatch:'NO MATCH FOUND',
    returnHome:'Return to Dashboard', finding:'Finding best match...',
    caseLog:'CASE LOG', noCases:'No cases found', noCase:'No cases found',
    home:'Home', request:'Request', cases:'Cases',
    popiaNotes:'No survivor names or ID numbers collected. POPIA compliant.',
    step:'Step', of:'of', next:'Next →', back:'Back',
    findMatch:'🔍 Find Shelter Match',
    yourShelter:'YOUR SHELTER', acceptingReferrals:'Accepting Referrals',
    availableBeds:'AVAILABLE BEDS', supportProfile:'SUPPORT PROFILE',
    recentReferrals:'RECENT REFERRALS TO YOUR SHELTER', noReferrals:'No referrals yet',
    referrals:'Referrals', adminPanel:'ADMIN PANEL', systemOverview:'SYSTEM OVERVIEW',
    totalUsers:'Total Users', matchRate:'Match Rate', bedsAvailable:'Beds Available',
    shelterNetwork:'SHELTER NETWORK', overview:'Overview', users:'Users',
    userMgmt:'USER MANAGEMENT', registeredUsers:'users', tapManage:'Tap to manage →',
    changeRole:'CHANGE ROLE', approved:'✓ APPROVED', suspended:'✗ SUSPENDED',
    suspendUser:'⏸ Suspend User', approveUser:'✓ Approve User', deleteUser:'🗑 Delete User',
    roleUpdated:'Role updated', userSuspended:'User suspended',
    userApproved:'User approved', userDeleted:'User deleted',
    shelterProfiles:'SHELTER PROFILES', viewProfile:'View Profile',
    capacity:'Capacity', intakeHours:'Intake Hours', caseTypes:'Case Types',
    contact:'Contact', whatsapp:'WhatsApp', afterHours:'After Hours',
    wheelchair:'Wheelchair', mentalHealth:'Mental Health', children:'Children',
    visual:'Visual', hearing:'Hearing', open2:'OPEN', closed:'CLOSED',
    monthlyReport:'MONTHLY REPORT', exportPDF:'Export Report',
    generating:'Generating...', casesThisMonth:'Cases this month',
    avgResponse:'Avg response', sheltersActive:'Shelters active',
    timeline:'CASE TIMELINE', submitted:'Submitted', processing:'Processing',
    placed:'Placed', noMatchTimeline:'No match found',
    whatsappSent:'📱 WhatsApp notification sent',
    language:'Language', logout:'Logout',
    survivorInfo:'SURVIVOR INFO', caseDetails:'CASE DETAILS', locationSafety:'LOCATION & SAFETY',
    gender:'Gender', age:'Age (approximate)', hasChildren:'Children accompanying?',
    numChildren:'Number of children', disabilities:'Disability / Support Needs',
    caseType:'Type of Case', location:'Current Area / Location', riskLevel:'Safety Risk Level',
    notes:'Additional Notes (optional)', yes:'Yes', no:'No',
    female:'Female', male:'Male', other:'Other',
    low:'Low', medium:'Medium', high:'High', critical:'Critical',
    topMatch:'TOP MATCH', otherMatches:'OTHER AVAILABLE SHELTERS',
    caseId:'Case ID', submitter:'Submitted by',
    noMatchMsg:'No shelters currently match this profile. Contact your supervisor.',
    map:'Map', report:'Report',
    invalidLogin:'Invalid email or password.',
    suspendedMsg:'Your account has been suspended. Please contact the administrator.',
    loginFailed:'Login failed. Please try again.',
    fillAll:'Please fill in all fields.',
    passwordMatch:'Passwords do not match.',
    passwordLength:'Password must be at least 6 characters.',
    emailExists:'An account with this email already exists.',
    regFailed:'Registration failed. Please try again.',
};
function useLang() { return t; }

// ── Top Bar ───────────────────────────────────────────────────────
function TopBar({ user, onLogout, t }) {
  const [showPwModal, setShowPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current:"", newPw:"", confirm:"" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  async function handleChangePassword() {
    setPwError(""); setPwSuccess(false);
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) { setPwError("Please fill in all fields."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError("New passwords do not match."); return; }
    if (pwForm.newPw.length < 6) { setPwError("Password must be at least 6 characters."); return; }
    setPwLoading(true);
    try {
      const currentHash = await hashPassword(pwForm.current);
      const { data } = await sb.from("users").select("id").eq("id", user.id).eq("password_hash", currentHash);
      if (!data || data.length === 0) { setPwError("Current password is incorrect."); setPwLoading(false); return; }
      const newHash = await hashPassword(pwForm.newPw);
      await sb.from("users").update({ password_hash: newHash }).eq("id", user.id);
      setPwSuccess(true); setPwLoading(false);
      setPwForm({ current:"", newPw:"", confirm:"" });
      setTimeout(() => { setShowPwModal(false); setPwSuccess(false); }, 2000);
    } catch(e) { setPwError("Something went wrong. Try again."); setPwLoading(false); }
  }

  return (
    <>
      <div style={{ padding:"14px 16px 10px", background:C.black, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <img src={LOGO_URI} alt="SafeLink SA" style={{ height:28, objectFit:"contain" }} />
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ textAlign:"right", cursor:"pointer" }} onClick={() => setShowPwModal(true)}>
            <div style={{ fontSize:11, color:C.grey }}>{user?.role?.replace("_"," ").toUpperCase()}</div>
            <div style={{ fontSize:12, color:C.white, fontWeight:600 }}>{user?.full_name?.split(" ")[0]} <span style={{ fontSize:10, color:C.red }}>✎</span></div>
          </div>
          <button className="btn btn-dark" style={{ padding:"6px 10px", fontSize:11 }} onClick={onLogout}>{t.logout}</button>
        </div>
      </div>
      {showPwModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:24, width:"100%", maxWidth:340 }}>
            <div style={{ fontFamily:"Bebas Neue", fontSize:22, color:C.white, marginBottom:4 }}>CHANGE PASSWORD</div>
            <div style={{ fontSize:12, color:C.grey, marginBottom:20 }}>Tap your name anytime to update your password</div>
            {pwSuccess ? (
              <div style={{ background:C.greenBg, border:`1px solid ${C.green}`, borderRadius:12, padding:16, textAlign:"center", color:C.green, fontWeight:600 }}>✅ Password updated successfully!</div>
            ) : (
              <>
                {pwError && <div style={{ background:"rgba(208,2,27,0.1)", border:`1px solid ${C.red}`, borderRadius:10, padding:12, fontSize:13, color:C.red, marginBottom:12 }}>{pwError}</div>}
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:12, color:C.grey, marginBottom:6 }}>Current Password</div>
                  <input className="input" type="password" placeholder="Enter current password" value={pwForm.current} onChange={e => setPwForm(f => ({...f, current:e.target.value}))} />
                </div>
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:12, color:C.grey, marginBottom:6 }}>New Password</div>
                  <input className="input" type="password" placeholder="Enter new password" value={pwForm.newPw} onChange={e => setPwForm(f => ({...f, newPw:e.target.value}))} />
                </div>
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:12, color:C.grey, marginBottom:6 }}>Confirm New Password</div>
                  <input className="input" type="password" placeholder="Confirm new password" value={pwForm.confirm} onChange={e => setPwForm(f => ({...f, confirm:e.target.value}))} />
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button className="btn btn-dark" style={{ flex:1, padding:12, fontSize:13 }} onClick={() => { setShowPwModal(false); setPwError(""); setPwForm({ current:"", newPw:"", confirm:"" }); }}>Cancel</button>
                  <button className="btn btn-red" style={{ flex:2, padding:12, fontSize:13 }} onClick={handleChangePassword} disabled={pwLoading}>{pwLoading ? "Saving..." : "Update Password"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── Auth Screen ───────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const t = useLang();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ full_name:"", email:"", phone:"", organisation:"", role:"vfr", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  async function handleLogin() {
    setError(""); setLoading(true);
    try {
      const hash = await hashPassword(form.password);
      const { data, error:e } = await sb.from("users").select("*").eq("email", form.email.toLowerCase().trim()).eq("password_hash", hash);
      if (e || !data || data.length === 0) { setError(t.invalidLogin); setLoading(false); return; }
      const user = data[0];
      if (user.approved === false) { setError(t.suspendedMsg); setLoading(false); return; }
      onAuth(user);
    } catch(err) { setError(t.loginFailed); setLoading(false); }
  }

  async function handleRegister() {
    setError("");
    if (!form.full_name||!form.email||!form.phone||!form.organisation||!form.password) { setError(t.fillAll); return; }
    if (form.password !== form.confirm) { setError(t.passwordMatch); return; }
    if (form.password.length < 6) { setError(t.passwordLength); return; }
    setLoading(true);
    try {
      const hash = await hashPassword(form.password);
      const { data:existing } = await sb.from("users").select("id").eq("email", form.email.toLowerCase()).single();
      if (existing) { setError(t.emailExists); setLoading(false); return; }
      const { data, error:e } = await sb.from("users").insert([{
        full_name:form.full_name, email:form.email.toLowerCase(),
        phone:form.phone, organisation:form.organisation,
        role:form.role, password_hash:hash
      }]).select().single();
      if (e) { setError(t.regFailed); setLoading(false); return; }
      onAuth(data);
    } catch { setError(t.regFailed); setLoading(false); }
  }

  return (
    <div className="screen fade-in" style={{ background:`radial-gradient(ellipse at 50% 0%, rgba(208,2,27,0.15) 0%, ${C.black} 60%)`, minHeight:"100%", padding:"32px 24px 32px" }}>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
        
      </div>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <img src={LOGO_URI} alt="SafeLink SA" style={{ height:48, objectFit:"contain", marginBottom:12 }} />
        <div style={{ fontFamily:"Bebas Neue", fontSize:26, color:C.white, letterSpacing:2 }}>{t.appName}</div>
        <div style={{ fontSize:12, color:C.grey, marginTop:4 }}>{t.tagline}</div>
      </div>
      <div style={{ display:"flex", background:C.blackSoft, borderRadius:12, padding:4, marginBottom:20 }}>
        {["login","register"].map(m => (
          <button key={m} className="btn" onClick={() => { setMode(m); setError(""); }}
            style={{ flex:1, padding:"10px", fontSize:13, borderRadius:10, background:mode===m?C.red:"transparent", color:mode===m?C.white:C.grey }}>
            {m==="login"?t.signIn:t.register}
          </button>
        ))}
      </div>
      {error && <div style={{ background:"rgba(208,2,27,0.12)", border:`1px solid ${C.red}`, borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13, color:"#ff6b6b" }}>{error}</div>}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {mode==="register" && (<>
          <input className="input" placeholder={t.fullName} value={form.full_name} onChange={e=>set("full_name",e.target.value)} />
          <input className="input" placeholder={t.phone} value={form.phone} onChange={e=>set("phone",e.target.value)} />
          <input className="input" placeholder={t.organisation} value={form.organisation} onChange={e=>set("organisation",e.target.value)} />
          <select className="select" value={form.role} onChange={e=>set("role",e.target.value)}>
            <option value="vfr">{t.vfr}</option>
            <option value="social_worker">{t.socialWorker}</option>
            <option value="shelter">{t.shelterCoord}</option>
          </select>
        </>)}
        <input className="input" placeholder={t.email} type="email" value={form.email} onChange={e=>set("email",e.target.value)} />
        <input className="input" placeholder={t.password} type="password" value={form.password} onChange={e=>set("password",e.target.value)} />
        {mode==="register" && <input className="input" placeholder={t.confirmPassword} type="password" value={form.confirm} onChange={e=>set("confirm",e.target.value)} />}
        <button className="btn btn-red" style={{ padding:"16px", fontSize:15, marginTop:8 }}
          onClick={mode==="login"?handleLogin:handleRegister} disabled={loading}>
          {loading?t.signingIn:mode==="login"?t.signIn:t.createAccount}
        </button>
      </div>
      <div style={{ textAlign:"center", marginTop:20, fontSize:11, color:C.greyMid, lineHeight:1.6 }}>
        Protected by POPIA · All data encrypted{"\n"}
        <span>Pathway Impact Labs · © {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}

// ── WhatsApp Notification ─────────────────────────────────────────
function WhatsAppNotif({ caseId, shelter, onClose, t }) {
  return (
    <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)", zIndex:100, display:"flex", alignItems:"flex-end" }}>
      <div className="whatsapp-slide" style={{ width:"100%", background:"#075E54", borderRadius:"20px 20px 0 0", padding:"20px 20px 32px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:"#25D366", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>💬</div>
          <div>
            <div style={{ fontSize:14, color:C.white, fontWeight:700 }}>SafeLink SA</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>WhatsApp Business · now</div>
          </div>
        </div>
        <div style={{ background:"#128C7E", borderRadius:"4px 16px 16px 16px", padding:"14px 16px", marginBottom:12 }}>
          <div style={{ fontSize:13, color:C.white, lineHeight:1.6 }}>
            ✅ *SHELTER MATCH FOUND*{"\n\n"}
            Case: *{caseId}*{"\n"}
            Matched to: *{shelter?.shelter_name}*{"\n"}
            Area: {shelter?.area}{"\n"}
            Contact: {shelter?.primary_contact}{"\n"}
            Beds available: {shelter?.available_beds}{"\n\n"}
            Please proceed with placement immediately.{"\n"}
            — SafeLink SA System
          </div>
        </div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", textAlign:"right", marginBottom:16 }}>✓✓ Delivered</div>
        <button className="btn btn-red" style={{ width:"100%", padding:"14px" }} onClick={onClose}>
          {t.returnHome}
        </button>
      </div>
    </div>
  );
}



// ── Shelter Map ───────────────────────────────────────────────────
function ShelterMap({ shelters, onBack, t }) {
  const coords = {
    "Soweto Safe Haven":      { x:30, y:62 },
    "JHB South Women's Refuge":{ x:48, y:72 },
    "Lenasia Family Crisis Centre":{ x:22, y:75 },
    "Ennerdale Disability Shelter":{ x:35, y:80 },
    "Eldorado Park Safe House":{ x:42, y:68 },
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"16px 20px", background:C.black, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
        <button className="btn btn-dark" style={{ padding:"8px 12px", fontSize:13 }} onClick={onBack}>← {t.back}</button>
        <div style={{ fontFamily:"Bebas Neue", fontSize:20, color:C.white, letterSpacing:1 }}>SHELTER MAP — JHB SOUTH</div>
      </div>
      <div style={{ flex:1, position:"relative", background:"#0D1A0D", overflow:"hidden" }}>
        {/* Stylised map background */}
        <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }}>
          {/* Roads */}
          <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#1A2A1A" strokeWidth="8"/>
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#1A2A1A" strokeWidth="6"/>
          <line x1="20%" y1="0" x2="30%" y2="100%" stroke="#1A2A1A" strokeWidth="4"/>
          <line x1="70%" y1="0" x2="65%" y2="100%" stroke="#1A2A1A" strokeWidth="4"/>
          <line x1="0" y1="35%" x2="100%" y2="40%" stroke="#1A2A1A" strokeWidth="3"/>
          <line x1="0" y1="80%" x2="100%" y2="78%" stroke="#1A2A1A" strokeWidth="3"/>
          {/* Areas */}
          <circle cx="30%" cy="62%" r="40" fill="rgba(0,100,0,0.08)" stroke="#1A3A1A" strokeWidth="1"/>
          <circle cx="48%" cy="72%" r="35" fill="rgba(0,100,0,0.08)" stroke="#1A3A1A" strokeWidth="1"/>
          <circle cx="22%" cy="75%" r="30" fill="rgba(0,100,0,0.08)" stroke="#1A3A1A" strokeWidth="1"/>
          <circle cx="35%" cy="80%" r="28" fill="rgba(0,100,0,0.08)" stroke="#1A3A1A" strokeWidth="1"/>
          <circle cx="42%" cy="68%" r="25" fill="rgba(0,100,0,0.08)" stroke="#1A3A1A" strokeWidth="1"/>
          {/* JHB CBD marker */}
          <circle cx="52%" cy="30%" r="8" fill="rgba(33,150,243,0.3)" stroke="#2196F3" strokeWidth="1"/>
          <text x="55%" y="28%" fill="#2196F3" fontSize="9" fontFamily="DM Sans">JHB CBD</text>
        </svg>

        {/* Shelter pins */}
        {shelters.map((s, i) => {
          const pos = coords[s.shelter_name] || { x:50+i*5, y:50+i*5 };
          return (
            <div key={s.id} style={{ position:"absolute", left:`${pos.x}%`, top:`${pos.y}%`, transform:"translate(-50%,-100%)", zIndex:10 }}>
              <div style={{ background:s.available_beds>0?C.green:C.red, width:12, height:12, borderRadius:"50%", border:"2px solid white", boxShadow:`0 0 8px ${s.available_beds>0?C.green:C.red}` }} />
              <div style={{ background:"rgba(0,0,0,0.85)", border:`1px solid ${s.available_beds>0?C.green:C.red}`, borderRadius:8, padding:"4px 8px", marginTop:4, whiteSpace:"nowrap", backdropFilter:"blur(4px)" }}>
                <div style={{ fontSize:10, color:C.white, fontWeight:600 }}>{s.shelter_name.split(" ").slice(0,2).join(" ")}</div>
                <div style={{ fontSize:10, color:s.available_beds>0?C.green:C.red }}>{s.available_beds} {t.beds}</div>
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div style={{ position:"absolute", bottom:16, left:16, background:"rgba(0,0,0,0.85)", borderRadius:12, padding:"10px 14px", backdropFilter:"blur(4px)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:C.green }} />
            <span style={{ fontSize:11, color:C.greyLight }}>{t.open2}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:C.red }} />
            <span style={{ fontSize:11, color:C.greyLight }}>{t.closed} / Full</span>
          </div>
        </div>
      </div>

      {/* Shelter list */}
      <div style={{ maxHeight:200, overflowY:"auto", padding:"8px 12px", background:C.blackMid, borderTop:`1px solid ${C.border}` }}>
        {shelters.map(s => (
          <div key={s.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 4px", borderBottom:`1px solid ${C.border}` }}>
            <div>
              <div style={{ fontSize:12, color:C.white, fontWeight:600 }}>{s.shelter_name}</div>
              <div style={{ fontSize:11, color:C.grey }}>{s.area}</div>
            </div>
            <span className="tag" style={{ background:s.available_beds>0?C.greenBg:"rgba(208,2,27,0.12)", color:s.available_beds>0?C.green:C.red, fontSize:10 }}>
              {s.available_beds} {t.beds}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Monthly Report ────────────────────────────────────────────────
function MonthlyReport({ cases, shelters, users, onBack, t }) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = cases.filter(c => new Date(c.created_at) >= monthStart);
  const matched = thisMonth.filter(c => c.outcome === "MATCHED");
  const matchRate = thisMonth.length ? Math.round((matched.length / thisMonth.length) * 100) : 0;
  const totalBeds = shelters.reduce((a,s) => a+(s.available_beds||0), 0);
  const caseTypes = {};
  thisMonth.forEach(c => { if(c.case_type) caseTypes[c.case_type] = (caseTypes[c.case_type]||0)+1; });

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"16px 20px", background:C.black, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
        <button className="btn btn-dark" style={{ padding:"8px 12px", fontSize:13 }} onClick={onBack}>← {t.back}</button>
        <div style={{ fontFamily:"Bebas Neue", fontSize:20, color:C.white, letterSpacing:1 }}>{t.monthlyReport}</div>
      </div>
      <div className="screen fade-in" style={{ padding:"16px" }}>

        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,${C.redDark},${C.red})`, borderRadius:16, padding:"16px 20px", marginBottom:16, textAlign:"center" }}>
          <div style={{ fontFamily:"Bebas Neue", fontSize:20, color:C.white, letterSpacing:1 }}>SAFELINK SA</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>Pathway Impact Labs · Monthly Performance Report</div>
          <div style={{ fontSize:13, color:C.white, marginTop:4, fontWeight:600 }}>
            {now.toLocaleString("en-ZA",{month:"long",year:"numeric"})}
          </div>
        </div>

        {/* Key metrics */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {[
            { label:t.casesThisMonth, value:thisMonth.length, color:C.white, icon:"📋" },
            { label:t.matchRate, value:`${matchRate}%`, color:C.green, icon:"✅" },
            { label:t.bedsAvailable, value:totalBeds, color:C.amber, icon:"🏠" },
            { label:"Registered Users", value:users.length, color:C.blue, icon:"👥" },
          ].map(m => (
            <div key={m.label} className="card" style={{ textAlign:"center", padding:"14px 10px" }}>
              <div style={{ fontSize:18, marginBottom:4 }}>{m.icon}</div>
              <div style={{ fontFamily:"Bebas Neue", fontSize:28, color:m.color }}>{m.value}</div>
              <div style={{ fontSize:10, color:C.grey, marginTop:2 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Case breakdown by type */}
        <div className="card" style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, color:C.grey, fontWeight:600, marginBottom:12 }}>CASES BY TYPE</div>
          {Object.entries(caseTypes).length === 0
            ? <div style={{ fontSize:13, color:C.greyMid, textAlign:"center", padding:"12px 0" }}>No cases this month yet</div>
            : Object.entries(caseTypes).sort((a,b)=>b[1]-a[1]).map(([type,count]) => (
              <div key={type} style={{ marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, color:C.greyLight }}>{type}</span>
                  <span style={{ fontSize:12, color:C.white, fontWeight:600 }}>{count}</span>
                </div>
                <div style={{ background:C.blackSoft, borderRadius:4, height:6 }}>
                  <div style={{ height:"100%", background:C.red, borderRadius:4, width:`${(count/thisMonth.length)*100}%`, transition:"width 0.5s" }} />
                </div>
              </div>
            ))
          }
        </div>

        {/* Shelter performance */}
        <div className="card" style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, color:C.grey, fontWeight:600, marginBottom:12 }}>SHELTER PERFORMANCE</div>
          {shelters.map(s => {
            const placed = thisMonth.filter(c => c.matched_shelter === s.shelter_name).length;
            return (
              <div key={s.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, color:C.greyLight }}>{s.shelter_name}</span>
                  <span style={{ fontSize:12, color:C.green }}>{placed} placed</span>
                </div>
                <div style={{ background:C.blackSoft, borderRadius:4, height:6 }}>
                  <div style={{ height:"100%", background:C.green, borderRadius:4, width:`${s.total_capacity?(s.available_beds/s.total_capacity)*100:0}%` }} />
                </div>
                <div style={{ fontSize:10, color:C.greyMid, marginTop:2 }}>{s.available_beds}/{s.total_capacity} beds remaining</div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ background:C.blackSoft, borderRadius:12, padding:"12px 16px", textAlign:"center" }}>
          <div style={{ fontSize:11, color:C.grey, lineHeight:1.6 }}>
            Generated by SafeLink SA · Pathway Impact Labs{"\n"}
            Developed by Simone Jonkers · © {now.getFullYear()} All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Case Timeline ─────────────────────────────────────────────────
function CaseTimeline({ c, onBack, t }) {
  const steps = [
    { label:t.submitted, time:c.created_at, done:true, icon:"📝" },
    { label:t.processing, time:c.created_at, done:true, icon:"⚡" },
    { label:c.outcome==="MATCHED"?t.placed:t.noMatchTimeline, time:c.created_at, done:true, icon:c.outcome==="MATCHED"?"✅":"⚠️" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"16px 20px", background:C.black, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
        <button className="btn btn-dark" style={{ padding:"8px 12px", fontSize:13 }} onClick={onBack}>← {t.back}</button>
        <div style={{ fontFamily:"Bebas Neue", fontSize:18, color:C.white, letterSpacing:1 }}>{t.timeline}</div>
      </div>
      <div className="screen" style={{ padding:"20px 16px" }}>
        <div className="card" style={{ marginBottom:16, border:`1px solid ${c.outcome==="MATCHED"?C.green:C.amber}` }}>
          <div style={{ fontFamily:"DM Mono", fontSize:14, color:C.white, marginBottom:4 }}>{c.case_id}</div>
          <div style={{ fontSize:12, color:C.grey }}>{c.case_type} · {c.survivor_gender} · Risk: {c.safety_risk}</div>
          {c.matched_shelter && <div style={{ fontSize:12, color:C.green, marginTop:4 }}>→ {c.matched_shelter}</div>}
        </div>

        {/* Timeline */}
        <div style={{ position:"relative", paddingLeft:32 }}>
          <div style={{ position:"absolute", left:11, top:12, bottom:12, width:2, background:`linear-gradient(${C.green},${c.outcome==="MATCHED"?C.green:C.amber})` }} />
          {steps.map((s,i) => (
            <div key={i} style={{ position:"relative", marginBottom:24 }}>
              <div style={{ position:"absolute", left:-32, top:0, width:24, height:24, borderRadius:"50%", background:s.done?(c.outcome==="MATCHED"||i<2?C.green:C.amber):C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>
                {s.icon}
              </div>
              <div className="card">
                <div style={{ fontSize:14, color:C.white, fontWeight:600 }}>{s.label}</div>
                <div style={{ fontSize:11, color:C.grey, marginTop:4 }}>{new Date(s.time).toLocaleString("en-ZA")}</div>
                {i===0 && <div style={{ fontSize:12, color:C.greyLight, marginTop:6 }}>Submitted by {c.submitter_name} · {c.organisation}</div>}
                {i===1 && <div style={{ fontSize:12, color:C.greyLight, marginTop:6 }}>Matching engine scanned {c.outcome==="MATCHED"?"5":"5"} shelters</div>}
                {i===2 && c.matched_shelter && <div style={{ fontSize:12, color:C.green, marginTop:6 }}>Placed at {c.matched_shelter} · {c.matched_contact}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Shelter Profiles ──────────────────────────────────────────────
function ShelterProfiles({ shelters, onBack, t }) {
  const [selected, setSelected] = useState(null);
  if (selected) return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"16px 20px", background:C.black, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
        <button className="btn btn-dark" style={{ padding:"8px 12px", fontSize:13 }} onClick={() => setSelected(null)}>← {t.back}</button>
        <div style={{ fontFamily:"Bebas Neue", fontSize:18, color:C.white, letterSpacing:1 }}>SHELTER PROFILE</div>
      </div>
      <div className="screen fade-in" style={{ padding:"16px" }}>
        <div style={{ background:`linear-gradient(135deg,#0A1A0A,#0A2A0A)`, border:`1px solid rgba(0,200,83,0.3)`, borderRadius:20, padding:"20px", marginBottom:16 }}>
          <div style={{ fontFamily:"Bebas Neue", fontSize:22, color:C.white }}>{selected.shelter_name}</div>
          <div style={{ fontSize:13, color:C.grey }}>{selected.area}</div>
          <span className="tag" style={{ marginTop:8, background:selected.accepting_referrals?C.greenBg:"rgba(208,2,27,0.12)", color:selected.accepting_referrals?C.green:C.red }}>
            {selected.accepting_referrals?t.open2:t.closed}
          </span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {[
            { label:t.availableBeds, value:selected.available_beds, color:selected.available_beds>0?C.green:C.red },
            { label:t.capacity, value:selected.total_capacity, color:C.white },
            { label:t.intakeHours, value:selected.intake_hours, color:C.amber },
            { label:"Gender", value:selected.gender_served, color:C.blue },
          ].map(m => (
            <div key={m.label} className="card" style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"Bebas Neue", fontSize:22, color:m.color }}>{m.value}</div>
              <div style={{ fontSize:10, color:C.grey }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ marginBottom:12 }}>
          <div style={{ fontSize:12, color:C.grey, fontWeight:600, marginBottom:10 }}>{t.contact}</div>
          {[
            { icon:"📞", label:t.contact, value:selected.primary_contact },
            { icon:"💬", label:t.whatsapp, value:selected.whatsapp },
            { icon:"🌙", label:t.afterHours, value:selected.after_hours },
          ].map(r => (
            <div key={r.label} style={{ background:C.blackSoft, borderRadius:10, padding:"10px 12px", marginBottom:8 }}>
              <div style={{ fontSize:11, color:C.grey }}>{r.icon} {r.label}</div>
              <div style={{ fontSize:13, color:C.white, marginTop:2 }}>{r.value||"—"}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ marginBottom:12 }}>
          <div style={{ fontSize:12, color:C.grey, fontWeight:600, marginBottom:10 }}>{t.supportProfile}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {[
              { k:"wheelchair", l:`♿ ${t.wheelchair}` },
              { k:"mental_health", l:`🧠 ${t.mentalHealth}` },
              { k:"accepts_children", l:`👶 ${t.children}` },
              { k:"visual_impairment", l:`👁 ${t.visual}` },
              { k:"hearing_impairment", l:`👂 ${t.hearing}` },
            ].map(({k,l}) => (
              <span key={k} className="tag" style={{ background:selected[k]?C.greenBg:C.blackSoft, color:selected[k]?C.green:C.greyMid, border:`1px solid ${selected[k]?"rgba(0,200,83,0.3)":C.border}` }}>{l}</span>
            ))}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize:12, color:C.grey, fontWeight:600, marginBottom:8 }}>{t.caseTypes}</div>
          <div style={{ fontSize:13, color:C.greyLight }}>{selected.case_types?.replace(/,/g," · ")||"—"}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"16px 20px", background:C.black, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
        <button className="btn btn-dark" style={{ padding:"8px 12px", fontSize:13 }} onClick={onBack}>← {t.back}</button>
        <div style={{ fontFamily:"Bebas Neue", fontSize:20, color:C.white, letterSpacing:1 }}>{t.shelterProfiles}</div>
      </div>
      <div className="screen" style={{ padding:"12px 16px" }}>
        {shelters.map(s => (
          <div key={s.id} className="card fade-in" style={{ marginBottom:12, cursor:"pointer" }} onClick={() => setSelected(s)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <div style={{ fontSize:15, color:C.white, fontWeight:700 }}>{s.shelter_name}</div>
                <div style={{ fontSize:12, color:C.grey }}>{s.area}</div>
              </div>
              <span className="tag" style={{ background:s.accepting_referrals?C.greenBg:"rgba(208,2,27,0.12)", color:s.accepting_referrals?C.green:C.red }}>
                {s.accepting_referrals?t.open2:t.closed}
              </span>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ background:C.blackSoft, borderRadius:8, padding:"8px 12px", flex:1, textAlign:"center" }}>
                <div style={{ fontFamily:"Bebas Neue", fontSize:20, color:s.available_beds>0?C.green:C.red }}>{s.available_beds}</div>
                <div style={{ fontSize:10, color:C.grey }}>{t.beds}</div>
              </div>
              <div style={{ background:C.blackSoft, borderRadius:8, padding:"8px 12px", flex:1, textAlign:"center" }}>
                <div style={{ fontFamily:"Bebas Neue", fontSize:20, color:C.white }}>{s.total_capacity}</div>
                <div style={{ fontSize:10, color:C.grey }}>{t.capacity}</div>
              </div>
              <div style={{ background:C.blackSoft, borderRadius:8, padding:"8px 12px", flex:2, textAlign:"center" }}>
                <div style={{ fontSize:11, color:C.amber, fontWeight:600 }}>{s.intake_hours}</div>
                <div style={{ fontSize:10, color:C.grey }}>{t.intakeHours}</div>
              </div>
            </div>
            <div style={{ fontSize:11, color:C.greyMid, marginTop:8 }}>{t.viewProfile} →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Referral Form ─────────────────────────────────────────────────
function ReferralForm({ user, shelters, onBack, onMatch, t }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    survivor_gender:"", survivor_age:"", has_children:false, num_children:0,
    disability_needs:[], case_type:"", safety_risk:"Medium",
    location_area:"", additional_notes:""
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const toggleDisability = d => set("disability_needs", form.disability_needs.includes(d)?form.disability_needs.filter(x=>x!==d):[...form.disability_needs,d]);

  async function submit() {
    setLoading(true);
    const caseId = genCaseId();
    let matches = shelters.filter(s => s.available_beds>0 && s.accepting_referrals);
    if (form.survivor_gender==="Female") matches = matches.filter(s=>s.gender_served==="All"||s.gender_served==="Female");
    else if (form.survivor_gender==="Male") matches = matches.filter(s=>s.gender_served==="All"||s.gender_served==="Male");
    if (form.has_children) matches = matches.filter(s=>s.accepts_children);
    if (form.disability_needs.includes("Wheelchair")) matches = matches.filter(s=>s.wheelchair);
    if (form.disability_needs.includes("Mental Health")) matches = matches.filter(s=>s.mental_health);
    const topMatch = matches[0]||null;
    const outcome = topMatch?"MATCHED":"NO MATCH";
    await sb.from("cases").insert([{
      case_id:caseId, submitted_by:user.id,
      submitter_name:user.full_name, organisation:user.organisation,
      survivor_gender:form.survivor_gender, survivor_age:parseInt(form.survivor_age)||null,
      has_children:form.has_children, num_children:form.num_children,
      disability_needs:form.disability_needs.join(","),
      case_type:form.case_type||"Other", safety_risk:form.safety_risk,
      location_area:form.location_area, outcome,
      matched_shelter:topMatch?.shelter_name||null,
      matched_contact:topMatch?.primary_contact||null, status:"OPEN"
    }]);
    if (topMatch) await sb.from("shelters").update({ available_beds:topMatch.available_beds-1 }).eq("id",topMatch.id);
    onMatch({ caseId, outcome, shelter:topMatch, allMatches:matches });
  }

  const disabilities = ["Wheelchair","Visual Impairment","Hearing Impairment","Intellectual Disability","Mental Health"];
  const caseTypes = ["Domestic Violence","Sexual Assault","Human Trafficking","Stalking","Child Abuse","Other"];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"14px 16px", background:C.black, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
        <button className="btn btn-dark" style={{ padding:"8px 12px", fontSize:13, background:undefined }} onClick={onBack}>← {t.back}</button>
        <div style={{ fontFamily:"Bebas Neue", fontSize:18, color:C.white, letterSpacing:1 }}>
          "NEW SHELTER REQUEST"
        </div>
      </div>
      <div style={{ padding:"10px 16px", background:C.blackMid }}>
        <div style={{ display:"flex", gap:6 }}>
          {[1,2,3].map(s => <div key={s} style={{ flex:1, height:4, borderRadius:2, background:step>=s?C.red:C.border, transition:"background 0.3s" }} />)}
        </div>
        <div style={{ fontSize:11, color:C.grey, marginTop:6 }}>{t.step} {step} {t.of} 3 — {[t.survivorInfo,t.caseDetails,t.locationSafety][step-1]}</div>
      </div>
      <div className="screen fade-in" style={{ padding:"16px", flex:1 }}>
        {step===1 && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ fontSize:12, color:C.grey, fontWeight:600 }}>{t.survivorInfo}</div>
            <div>
              <div style={{ fontSize:12, color:C.greyLight, marginBottom:8 }}>{t.gender}</div>
              <div style={{ display:"flex", gap:8 }}>
                {[t.female,t.male,t.other].map((g,i) => {
                  const val = ["Female","Male","Other"][i];
                  return <button key={g} className="btn" onClick={() => set("survivor_gender",val)}
                    style={{ flex:1, padding:"11px 6px", fontSize:12, background:form.survivor_gender===val?C.red:C.blackSoft, color:form.survivor_gender===val?C.white:C.grey, border:`1.5px solid ${form.survivor_gender===val?C.red:C.border}`, borderRadius:12 }}>{g}</button>;
                })}
              </div>
            </div>
            <div>
              <div style={{ fontSize:12, color:C.greyLight, marginBottom:8 }}>{t.age}</div>
              <input className="input" placeholder="e.g. 28" type="number" value={form.survivor_age} onChange={e=>set("survivor_age",e.target.value)} />
            </div>
            <div>
              <div style={{ fontSize:12, color:C.greyLight, marginBottom:8 }}>{t.hasChildren}</div>
              <div style={{ display:"flex", gap:8 }}>
                {[{v:false,l:t.no},{v:true,l:t.yes}].map(o => (
                  <button key={o.l} className="btn" onClick={() => set("has_children",o.v)}
                    style={{ flex:1, padding:"11px", fontSize:13, background:form.has_children===o.v?C.red:C.blackSoft, color:form.has_children===o.v?C.white:C.grey, border:`1.5px solid ${form.has_children===o.v?C.red:C.border}`, borderRadius:12 }}>{o.l}</button>
                ))}
              </div>
            </div>
            {form.has_children && <input className="input" placeholder={t.numChildren} type="number" value={form.num_children} onChange={e=>set("num_children",parseInt(e.target.value)||0)} />}
            <div>
              <div style={{ fontSize:12, color:C.greyLight, marginBottom:8 }}>{t.disabilities}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {disabilities.map(d => (
                  <button key={d} className="btn" onClick={() => toggleDisability(d)}
                    style={{ padding:"7px 12px", fontSize:11, background:form.disability_needs.includes(d)?C.red:C.blackSoft, color:form.disability_needs.includes(d)?C.white:C.grey, border:`1.5px solid ${form.disability_needs.includes(d)?C.red:C.border}`, borderRadius:20 }}>{d}</button>
                ))}
              </div>
            </div>
          </div>
        )}
        {step===2 && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ fontSize:12, color:C.grey, fontWeight:600, marginBottom:4 }}>{t.caseDetails}</div>
            {caseTypes.map(ct => (
              <button key={ct} className="btn" onClick={() => set("case_type",ct)}
                style={{ padding:"12px 16px", fontSize:13, textAlign:"left", background:form.case_type===ct?"rgba(208,2,27,0.15)":C.blackSoft, color:form.case_type===ct?C.red:C.greyLight, border:`1.5px solid ${form.case_type===ct?C.red:C.border}`, borderRadius:12 }}>
                {form.case_type===ct?"● ":"○ "}{ct}
              </button>
            ))}
          </div>
        )}
        {step===3 && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ fontSize:12, color:C.grey, fontWeight:600 }}>{t.locationSafety}</div>
            <div>
              <div style={{ fontSize:12, color:C.greyLight, marginBottom:8 }}>{t.location}</div>
              <input className="input" placeholder="e.g. Soweto, Lenasia, JHB South" value={form.location_area} onChange={e=>set("location_area",e.target.value)} />
            </div>
            <div>
              <div style={{ fontSize:12, color:C.greyLight, marginBottom:8 }}>{t.riskLevel}</div>
              <div style={{ display:"flex", gap:8 }}>
                {[t.low,t.medium,t.high,t.critical].map((r,i) => {
                  const val = ["Low","Medium","High","Critical"][i];
                  return <button key={r} className="btn" onClick={() => set("safety_risk",val)}
                    style={{ flex:1, padding:"9px 4px", fontSize:11, background:form.safety_risk===val?C.red:C.blackSoft, color:form.safety_risk===val?C.white:C.grey, border:`1.5px solid ${form.safety_risk===val?C.red:C.border}`, borderRadius:12 }}>{r}</button>;
                })}
              </div>
            </div>
            <textarea className="input" placeholder={t.notes} value={form.additional_notes} onChange={e=>set("additional_notes",e.target.value)} style={{ minHeight:70, resize:"none" }} />
            <div style={{ background:C.amberBg, border:`1px solid rgba(255,179,0,0.3)`, borderRadius:12, padding:"10px 14px" }}>
              <div style={{ fontSize:11, color:C.amber, fontWeight:600, marginBottom:2 }}>⚠ POPIA</div>
              <div style={{ fontSize:11, color:C.greyLight }}>{t.popiaNotes}</div>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding:"12px 16px", background:C.blackMid, borderTop:`1px solid ${C.border}`, display:"flex", gap:10 }}>
        {step>1 && <button className="btn btn-dark" style={{ flex:1, padding:"13px" }} onClick={() => setStep(s=>s-1)}>{t.back}</button>}
        {step<3
          ? <button className="btn btn-red" style={{ flex:2, padding:"13px", fontSize:14 }} onClick={() => setStep(s=>s+1)}>{t.next}</button>
          : <button className="btn btn-red" style={{ flex:2, padding:"13px", fontSize:14 }} onClick={submit} disabled={loading}>
              {loading?"⏳ Finding match...":t.findMatch}
            </button>
        }
      </div>
    </div>
  );
}

// ── Match Result ──────────────────────────────────────────────────
function MatchResult({ result, onDone, onShowWhatsApp, t }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => { setShow(true); if(result.outcome==="MATCHED") setTimeout(onShowWhatsApp,2000); },800); },[]);
  const matched = result.outcome==="MATCHED";
  return (
    <div className="screen fade-in" style={{ background:matched?`radial-gradient(ellipse at 50% 0%,rgba(0,200,83,0.1) 0%,${C.black} 60%)`:`radial-gradient(ellipse at 50% 0%,rgba(208,2,27,0.1) 0%,${C.black} 60%)`, minHeight:"100%", padding:"36px 20px 32px" }}>
      {!show
        ? <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:300, gap:16 }}>
            <div style={{ width:56, height:56, border:`3px solid ${C.red}`, borderTopColor:"transparent", borderRadius:"50%" }} className="spin" />
            <div style={{ color:C.grey, fontSize:13 }}>{t.finding}</div>
          </div>
        : <>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontSize:60, marginBottom:10 }}>{matched?"✅":"⚠️"}</div>
            <div style={{ fontFamily:"Bebas Neue", fontSize:30, color:matched?C.green:C.amber, letterSpacing:2 }}>
              {matched?t.matchFound:t.noMatch}
            </div>
            <div style={{ fontFamily:"DM Mono", fontSize:12, color:C.grey, marginTop:6 }}>{result.caseId}</div>
          </div>
          {matched && result.shelter && (
            <div className="card" style={{ marginBottom:14, border:`1px solid ${C.green}` }}>
              <div style={{ fontSize:10, color:C.green, fontWeight:600, letterSpacing:1, marginBottom:10 }}>{t.topMatch}</div>
              <div style={{ fontSize:17, color:C.white, fontWeight:700, marginBottom:2 }}>{result.shelter.shelter_name}</div>
              <div style={{ fontSize:12, color:C.grey, marginBottom:14 }}>{result.shelter.area}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                <div style={{ background:C.blackSoft, borderRadius:10, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, color:C.grey }}>Available Beds</div>
                  <div style={{ fontFamily:"Bebas Neue", fontSize:22, color:C.green }}>{result.shelter.available_beds}</div>
                </div>
                <div style={{ background:C.blackSoft, borderRadius:10, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, color:C.grey }}>Intake</div>
                  <div style={{ fontSize:12, color:C.white, fontWeight:600 }}>{result.shelter.intake_hours}</div>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:12 }}>
                <div style={{ fontSize:12, color:C.greyLight }}>📞 {result.shelter.primary_contact}</div>
                <div style={{ fontSize:12, color:C.greyLight }}>🌙 {result.shelter.after_hours}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <a href={"https://wa.me/"+((result.shelter.whatsapp||"").replace(/D/g,""))+"?text=Hi%2C%20this%20is%20a%20SafeLink%20SA%20referral.%20Case%20ID%3A%20"+result.caseId+".%20I%20have%20a%20survivor%20who%20needs%20placement.%20Are%20you%20able%20to%20assist%3F"}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"13px", background:"#25D366", borderRadius:12, color:"#fff", fontWeight:700, fontSize:14, textDecoration:"none" }}>
                  💬 Message Shelter on WhatsApp
                </a>
                <a href={"tel:"+result.shelter.primary_contact}
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"13px", background:C.blackSoft, borderRadius:12, color:C.white, fontWeight:600, fontSize:13, textDecoration:"none", border:"1px solid "+C.border }}>
                  📞 Call Shelter Coordinator
                </a>
              </div>
            </div>
          )}
          {!matched && (
            <div className="card" style={{ marginBottom:14, border:`1px solid ${C.amber}` }}>
              <div style={{ fontSize:13, color:C.amber, fontWeight:600, marginBottom:6 }}>{t.noMatch}</div>
              <div style={{ fontSize:12, color:C.greyLight, lineHeight:1.6 }}>{t.noMatchMsg}</div>
            </div>
          )}
          <button className="btn btn-red" style={{ width:"100%", padding:"15px", fontSize:14 }} onClick={onDone}>{t.returnHome}</button>
        </>
      }
    </div>
  );
}

// ── Case Log ──────────────────────────────────────────────────────
function CaseLog({ cases, onBack, onSelectCase, t }) {
  const [filter, setFilter] = useState("ALL");
  const filtered = filter==="ALL"?cases:cases.filter(c=>c.outcome===filter);
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"14px 16px", background:C.black, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
        <button className="btn btn-dark" style={{ padding:"8px 12px", fontSize:13 }} onClick={onBack}>← {t.back}</button>
        <div style={{ fontFamily:"Bebas Neue", fontSize:20, color:C.white, letterSpacing:1 }}>{t.caseLog}</div>
      </div>
      <div style={{ display:"flex", gap:8, padding:"10px 14px", background:C.blackMid }}>
        {["ALL","MATCHED","NO MATCH"].map(f => (
          <button key={f} className="btn" onClick={() => setFilter(f)}
            style={{ padding:"7px 14px", fontSize:11, background:filter===f?C.red:C.blackSoft, color:filter===f?C.white:C.grey, border:`1.5px solid ${filter===f?C.red:C.border}`, borderRadius:20 }}>{f}</button>
        ))}
      </div>
      <div className="screen" style={{ padding:"10px 14px" }}>
        {filtered.length===0
          ? <div style={{ textAlign:"center", padding:"40px 0", color:C.grey }}>{t.noCase}</div>
          : filtered.map(c => (
            <div key={c.id} className="card fade-in" style={{ marginBottom:10, cursor:"pointer" }} onClick={() => onSelectCase(c)}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                <div style={{ fontFamily:"DM Mono", fontSize:12, color:C.white }}>{c.case_id}</div>
                <span className="tag" style={{ background:c.status==="CONFIRMED"?"rgba(0,200,83,0.2)":c.outcome==="MATCHED"?C.greenBg:C.amberBg, color:c.status==="CONFIRMED"?C.green:c.outcome==="MATCHED"?C.green:C.amber, fontSize:10 }}>{c.status==="CONFIRMED"?"CONFIRMED ✓":c.outcome||"PENDING"}</span>
              </div>
              <div style={{ fontSize:11, color:C.grey }}>{c.case_type} · {c.survivor_gender} · Risk: {c.safety_risk}</div>
              {c.matched_shelter && <div style={{ fontSize:11, color:C.green, marginTop:3 }}>→ {c.matched_shelter}</div>}
              <div style={{ fontSize:10, color:C.greyMid, marginTop:5 }}>{new Date(c.created_at).toLocaleString("en-ZA")} · Tap for timeline →</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ── VFR / Social Worker Dashboard ────────────────────────────────
function ReferralDashboard({ user, onLogout }) {
  const t = useLang();
  const [screen, setScreen] = useState("home");
  const [cases, setCases] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [matchResult, setMatchResult] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  
  useEffect(() => { 
    loadCases(); 
    loadShelters(); 
    const interval = setInterval(loadCases, 15000);
    return () => clearInterval(interval);
  }, []);

  async function loadCases() {
    const { data } = await sb.from("cases").select("*").eq("submitted_by",user.id).order("created_at",{ascending:false});
    setCases(data||[]);
  }
  async function loadShelters() {
    const { data } = await sb.from("shelters").select("*").eq("accepting_referrals",true).eq("active",true);
    setShelters(data||[]);
  }

  const matchedCount = cases.filter(c=>c.outcome==="MATCHED").length;
  const openCount = cases.filter(c=>c.status==="OPEN").length;

  if (selectedCase) return <CaseTimeline c={selectedCase} onBack={() => setSelectedCase(null)} t={t} />;
  if (screen==="form") return <ReferralForm user={user} shelters={shelters} onBack={() => { setScreen("home"); }} onMatch={r => { setMatchResult(r); setScreen("result"); loadCases(); }} t={t} />;
  if (screen==="result") return (
    <>
      <MatchResult result={matchResult} onDone={() => { setScreen("home"); setShowWhatsApp(false); }} onShowWhatsApp={() => setShowWhatsApp(true)} t={t} />
      {showWhatsApp && <WhatsAppNotif caseId={matchResult.caseId} shelter={matchResult.shelter} onClose={() => { setShowWhatsApp(false); setScreen("home"); }} t={t} />}
    </>
  );
  if (screen==="log") return <CaseLog cases={cases} onBack={() => setScreen("home")} onSelectCase={c => setSelectedCase(c)} t={t} />;
  if (screen==="shelters") return <ShelterProfiles shelters={shelters} onBack={() => setScreen("home")} t={t} />;
  if (screen==="map") return <ShelterMap shelters={shelters} onBack={() => setScreen("home")} t={t} />;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <TopBar user={user} onLogout={onLogout} t={t} />
      <div className="screen fade-in" style={{ padding:"16px 16px 100px" }}>
        <div style={{ background:`linear-gradient(135deg,${C.redDark},${C.red})`, borderRadius:20, padding:"18px 20px", marginBottom:16, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginBottom:2 }}>{t.welcomeBack}</div>
          <div style={{ fontFamily:"Bebas Neue", fontSize:22, color:C.white, letterSpacing:1 }}>{user.full_name}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>{user.organisation}</div>
          <button className="btn" onClick={() => { setScreen("form"); }}
            style={{ marginTop:14, padding:"10px 20px", background:"rgba(255,255,255,0.15)", color:C.white, fontSize:13, borderRadius:12, backdropFilter:"blur(4px)", border:"1px solid rgba(255,255,255,0.2)" }}>
            {t.newRequest}
          </button>
        </div>

        

        {cases.filter(c=>c.status==="CONFIRMED").length > 0 && (
          <div style={{ background:C.greenBg, border:"1px solid "+C.green, borderRadius:14, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <div className="pulse" style={{ width:8, height:8, borderRadius:"50%", background:C.green }} />
              <div style={{ fontSize:12, color:C.green, fontWeight:700 }}>SHELTER CONFIRMED — READY TO RECEIVE</div>
            </div>
            {cases.filter(c=>c.status==="CONFIRMED").slice(0,2).map(c => (
              <div key={c.id} style={{ background:"rgba(0,200,83,0.08)", borderRadius:10, padding:"10px 12px", marginBottom:6 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <div style={{ fontFamily:"DM Mono", fontSize:12, color:C.white }}>{c.case_id}</div>
                  <span style={{ fontSize:10, fontWeight:700, color:C.green, background:"rgba(0,200,83,0.15)", padding:"3px 8px", borderRadius:20 }}>CONFIRMED ✓</span>
                </div>
                <div style={{ fontSize:12, color:C.white, fontWeight:600, marginBottom:2 }}>{c.matched_shelter}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>{c.case_type} · {c.location_area}</div>
                <div style={{ fontSize:11, color:C.green, marginTop:6, fontWeight:600 }}>✅ Shelter is ready — proceed with placement</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
          {[{label:t.totalCases,value:cases.length,color:C.white},{label:t.matched,value:matchedCount,color:C.green},{label:t.open,value:openCount,color:C.amber}].map(s => (
            <div key={s.label} className="card" style={{ textAlign:"center", padding:"12px 6px" }}>
              <div style={{ fontFamily:"Bebas Neue", fontSize:22, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:10, color:C.grey, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, color:C.grey, marginBottom:10, fontWeight:600 }}>{t.shelterAvailability}</div>
          {shelters.slice(0,3).map(s => (
            <div key={s.id} className="card" style={{ marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }} onClick={() => setScreen("shelters")}>
              <div>
                <div style={{ fontSize:13, color:C.white, fontWeight:600 }}>{s.shelter_name}</div>
                <div style={{ fontSize:11, color:C.grey }}>{s.area}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"Bebas Neue", fontSize:20, color:s.available_beds>0?C.green:C.red }}>{s.available_beds}</div>
                <div style={{ fontSize:10, color:C.grey }}>{t.beds}</div>
              </div>
            </div>
          ))}
        </div>

        {cases.length>0 && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontSize:12, color:C.grey, fontWeight:600 }}>{t.recentCases}</div>
              <button className="btn" style={{ fontSize:11, color:C.red, padding:"4px 8px", background:"transparent" }} onClick={() => setScreen("log")}>{t.viewAll}</button>
            </div>
            {cases.slice(0,3).map(c => (
              <div key={c.id} className="card" style={{ marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }} onClick={() => setSelectedCase(c)}>
                <div>
                  <div style={{ fontSize:12, fontFamily:"DM Mono", color:C.white }}>{c.case_id}</div>
                  <div style={{ fontSize:11, color:C.grey }}>{new Date(c.created_at).toLocaleDateString("en-ZA")}</div>
                </div>
                <span className="tag" style={{ background:c.outcome==="MATCHED"?C.greenBg:C.amberBg, color:c.outcome==="MATCHED"?C.green:C.amber, fontSize:10 }}>{c.outcome||"PENDING"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:C.blackMid, borderTop:`1px solid ${C.border}`, display:"flex", padding:"10px 0 18px" }}>
        {[{icon:"🏠",label:t.home,s:"home"},{icon:"➕",label:t.request,s:"form"},{icon:"🗺",label:t.map,s:"map"},{icon:"🏠",label:"Shelters",s:"shelters"},{icon:"📋",label:t.cases,s:"log"}].map(n => (
          <button key={n.s} className="btn" onClick={() => n.s==="form"?setScreen("form"):setScreen(n.s)}
            style={{ flex:1, background:"transparent", color:screen===n.s?C.red:C.grey, fontSize:9, padding:"4px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <span style={{ fontSize:18 }}>{n.icon}</span>{n.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Shelter Coordinator Dashboard ─────────────────────────────────
function ShelterDashboard({ user, onLogout }) {
  const t = useLang();
  const [shelter, setShelter] = useState(null);
  const [cases, setCases] = useState([]);
  const [saving, setSaving] = useState(false);
  const [screen, setScreen] = useState("home");
  const [editDesc, setEditDesc] = useState(false);
  const [descText, setDescText] = useState("");
  const [intakeText, setIntakeText] = useState("");
  const [showIntake, setShowIntake] = useState(false);
  const [pendingReferral, setPendingReferral] = useState(null);

  useEffect(() => { loadShelter(); loadCases(); }, []);

  async function loadShelter() {
    const { data } = await sb.from("shelters").select("*").limit(1).single();
    setShelter(data);
  }
  async function loadCases() {
    const { data } = await sb.from("cases").select("*").order("created_at",{ascending:false}).limit(20);
    setCases(data||[]);
  }
  async function updateBeds(delta) {
    if (!shelter) return;
    const newVal = Math.max(0,Math.min(shelter.total_capacity||99, shelter.available_beds+delta));
    setSaving(true);
    await sb.from("shelters").update({ available_beds:newVal }).eq("id",shelter.id);
    setShelter(s=>({...s,available_beds:newVal}));
    setSaving(false);
  }
  async function toggleAccepting() {
    if (!shelter) return;
    await sb.from("shelters").update({ accepting_referrals:!shelter.accepting_referrals }).eq("id",shelter.id);
    setShelter(s=>({...s,accepting_referrals:!s.accepting_referrals}));
  }

  if (screen==="log") return <CaseLog cases={cases} onBack={() => setScreen("home")} onSelectCase={() => {}} t={t} />;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <TopBar user={user} onLogout={onLogout} t={t} />
      <div className="screen fade-in" style={{ padding:"16px 16px 100px" }}>
        {shelter ? (<>
          <div style={{ background:"linear-gradient(135deg,#1A0000,#2A0008)", border:"1px solid "+C.border, borderRadius:20, padding:"18px 20px", marginBottom:16 }}>
            <div style={{ fontSize:11, color:C.grey, marginBottom:3 }}>{t.yourShelter}</div>
            <div style={{ fontFamily:"Bebas Neue", fontSize:20, color:C.white, letterSpacing:1 }}>{shelter.shelter_name}</div>
            <div style={{ fontSize:12, color:C.grey, marginBottom:10 }}>{shelter.area}</div>
            {editDesc ? (
              <div>
                <textarea value={descText} onChange={e=>setDescText(e.target.value)} placeholder="Write a short description of your shelter..."
                  style={{ width:"100%", minHeight:80, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:10, color:"#fff", fontSize:12, padding:"10px 12px", fontFamily:"DM Sans", resize:"none", outline:"none" }} />
                <div style={{ marginTop:8 }}>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", marginBottom:6 }}>Show intake process publicly?</div>
                  <div style={{ display:"flex", gap:8 }}>
                    {[{v:true,l:"Yes — show"},{v:false,l:"Keep private"}].map(o => (
                      <button key={String(o.v)} onClick={() => setShowIntake(o.v)}
                        style={{ flex:1, padding:"8px 6px", fontSize:11, background:showIntake===o.v?"rgba(208,2,27,0.3)":"rgba(255,255,255,0.08)", color:showIntake===o.v?"#fff":"rgba(255,255,255,0.5)", border:"1px solid "+(showIntake===o.v?C.red:"rgba(255,255,255,0.15)"), borderRadius:8, cursor:"pointer" }}>{o.l}</button>
                    ))}
                  </div>
                </div>
                {showIntake && (
                  <textarea value={intakeText} onChange={e=>setIntakeText(e.target.value)} placeholder="Describe your intake process..."
                    style={{ width:"100%", minHeight:70, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:10, color:"#fff", fontSize:12, padding:"10px 12px", fontFamily:"DM Sans", resize:"none", outline:"none", marginTop:8 }} />
                )}
                <div style={{ display:"flex", gap:8, marginTop:10 }}>
                  <button onClick={() => setEditDesc(false)} style={{ flex:1, padding:"9px", fontSize:12, background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, cursor:"pointer" }}>Cancel</button>
                  <button onClick={async () => { await sb.from("shelters").update({ description:descText, show_intake:showIntake, intake_process:intakeText }).eq("id",shelter.id); setShelter(s=>({...s,description:descText,show_intake:showIntake,intake_process:intakeText})); setEditDesc(false); }}
                    style={{ flex:2, padding:"9px", fontSize:12, background:C.red, color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontWeight:600 }}>Save</button>
                </div>
              </div>
            ) : (
              <div>
                {shelter.description ? <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", lineHeight:1.6, marginBottom:8 }}>{shelter.description}</div> : <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", fontStyle:"italic", marginBottom:8 }}>No description yet</div>}
                {shelter.show_intake && shelter.intake_process && (
                  <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:8, padding:"8px 10px", marginBottom:8 }}>
                    <div style={{ fontSize:10, color:C.amber, fontWeight:600, marginBottom:4 }}>INTAKE PROCESS</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.6 }}>{shelter.intake_process}</div>
                  </div>
                )}
                <button onClick={() => { setDescText(shelter.description||""); setIntakeText(shelter.intake_process||""); setShowIntake(shelter.show_intake||false); setEditDesc(true); }}
                  style={{ padding:"7px 14px", fontSize:11, background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, cursor:"pointer" }}>✎ Edit Description</button>
              </div>
            )}
          </div>
          <div className="card" style={{ marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:13, color:C.white, fontWeight:600 }}>{t.acceptingReferrals}</div>
              <div style={{ fontSize:11, color:C.grey, marginTop:2 }}>Toggle availability</div>
            </div>
            <button onClick={toggleAccepting}
              style={{ width:50, height:26, borderRadius:13, background:shelter.accepting_referrals?C.green:C.greyMid, border:"none", cursor:"pointer", position:"relative", transition:"background 0.3s" }}>
              <div style={{ position:"absolute", top:3, left:shelter.accepting_referrals?27:3, width:20, height:20, borderRadius:"50%", background:C.white, transition:"left 0.3s" }} />
            </button>
          </div>
          <div className="card" style={{ marginBottom:12, textAlign:"center" }}>
            <div style={{ fontSize:12, color:C.grey, marginBottom:14 }}>{t.availableBeds}</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:20 }}>
              <button onClick={() => updateBeds(-1)} disabled={saving}
                style={{ width:42, height:42, borderRadius:"50%", background:C.blackSoft, border:`1.5px solid ${C.border}`, color:C.white, fontSize:22, cursor:"pointer" }}>−</button>
              <div style={{ fontFamily:"Bebas Neue", fontSize:52, color:shelter.available_beds>0?C.green:C.red, lineHeight:1 }}>{shelter.available_beds}</div>
              <button onClick={() => updateBeds(1)} disabled={saving}
                style={{ width:42, height:42, borderRadius:"50%", background:C.blackSoft, border:`1.5px solid ${C.border}`, color:C.white, fontSize:22, cursor:"pointer" }}>+</button>
            </div>
            <div style={{ fontSize:11, color:C.grey, marginTop:6 }}>of {shelter.total_capacity} total</div>
          </div>
          <div className="card" style={{ marginBottom:12 }}>
            <div style={{ fontSize:12, color:C.grey, marginBottom:10, fontWeight:600 }}>{t.supportProfile}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {[{k:"wheelchair",l:`♿ ${t.wheelchair}`},{k:"mental_health",l:`🧠 ${t.mentalHealth}`},{k:"accepts_children",l:`👶 ${t.children}`},{k:"visual_impairment",l:`👁 ${t.visual}`},{k:"hearing_impairment",l:`👂 ${t.hearing}`}].map(({k,l}) => (
                <span key={k} className="tag" style={{ background:shelter[k]?C.greenBg:C.blackSoft, color:shelter[k]?C.green:C.greyMid, border:`1px solid ${shelter[k]?"rgba(0,200,83,0.3)":C.border}` }}>{l}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:12, color:C.grey, fontWeight:600, marginBottom:10 }}>{t.recentReferrals}</div>
            {cases.filter(c=>c.matched_shelter===shelter.shelter_name).length > 0 && (
              <div style={{ background:"rgba(208,2,27,0.08)", border:"1px solid "+C.red, borderRadius:14, padding:"14px 16px", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <div className="pulse" style={{ width:8, height:8, borderRadius:"50%", background:C.red }} />
                  <div style={{ fontSize:12, color:C.red, fontWeight:700 }}>NEW REFERRAL INCOMING</div>
                </div>
                {(() => { const c = cases.filter(x=>x.matched_shelter===shelter.shelter_name)[0]; return (
                  <div>
                    <div style={{ fontFamily:"DM Mono", fontSize:12, color:C.white, marginBottom:8 }}>{c.case_id}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:10 }}>
                      {[{l:"Case Type",v:c.case_type},{l:"Gender",v:c.survivor_gender},{l:"Risk Level",v:c.safety_risk},{l:"Location",v:c.location_area}].map(({l,v}) => (
                        <div key={l} style={{ background:C.blackSoft, borderRadius:8, padding:"7px 10px" }}>
                          <div style={{ fontSize:10, color:C.grey }}>{l}</div>
                          <div style={{ fontSize:12, color:C.white, fontWeight:600 }}>{v||"—"}</div>
                        </div>
                      ))}
                    </div>
                    {c.has_children && <div style={{ fontSize:11, color:C.amber, marginBottom:8 }}>👶 Has {c.num_children} child(ren)</div>}
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:10 }}>⚠ No personal details — POPIA compliant</div>
                    {pendingReferral===c.id ? (
                      <div style={{ background:C.greenBg, border:"1px solid "+C.green, borderRadius:10, padding:"12px", textAlign:"center" }}>
                        <div style={{ fontSize:14, color:C.green, fontWeight:700 }}>✅ Confirmed!</div>
                        <div style={{ fontSize:11, color:C.green, marginTop:4 }}>VFR officer notified. Please prepare for arrival.</div>
                      </div>
                    ) : pendingReferral==="declined_"+c.id ? (
                      <div style={{ background:"rgba(208,2,27,0.1)", border:"1px solid "+C.red, borderRadius:10, padding:"12px", textAlign:"center" }}>
                        <div style={{ fontSize:13, color:C.red, fontWeight:600 }}>Referral Declined</div>
                        <div style={{ fontSize:11, color:C.grey, marginTop:4 }}>VFR officer will find an alternative placement.</div>
                      </div>
                    ) : (
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={async () => { 
                          setPendingReferral(c.id); 
                          await sb.from("cases").update({ status:"CONFIRMED", outcome:"CONFIRMED" }).eq("id",c.id); 
                        }}
                          style={{ flex:2, padding:"12px", background:C.green, color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer" }}>✓ Confirm — We Can Help</button>
                        <button onClick={() => setPendingReferral("declined_"+c.id)}
                          style={{ flex:1, padding:"12px", background:"transparent", color:C.red, border:"1.5px solid "+C.red, borderRadius:10, fontWeight:600, fontSize:12, cursor:"pointer" }}>✗ Decline</button>
                      </div>
                    )}
                  </div>
                ); })()}
              </div>
            )}
            {cases.filter(c=>c.matched_shelter===shelter.shelter_name).slice(0,3).map(c => (
              <div key={c.id} className="card" style={{ marginBottom:8 }}>
                <div style={{ fontFamily:"DM Mono", fontSize:12, color:C.white }}>{c.case_id}</div>
                <div style={{ fontSize:11, color:C.grey, marginTop:3 }}>{c.case_type} · {new Date(c.created_at).toLocaleDateString("en-ZA")}</div>
              </div>
            ))}
            {cases.filter(c=>c.matched_shelter===shelter.shelter_name).length===0 && <div style={{ color:C.grey, fontSize:12, textAlign:"center", padding:"16px 0" }}>{t.noReferrals}</div>}
          </div>
        </>) : <div style={{ textAlign:"center", padding:"60px 0", color:C.grey }} className="pulse">Loading...</div>}
      </div>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:C.blackMid, borderTop:`1px solid ${C.border}`, display:"flex", padding:"10px 0 18px" }}>
        {[{icon:"🏠",label:t.home,s:"home"},{icon:"📋",label:t.referrals,s:"log"}].map(n => (
          <button key={n.s} className="btn" onClick={() => setScreen(n.s)}
            style={{ flex:1, background:"transparent", color:screen===n.s?C.red:C.grey, fontSize:10, padding:"4px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <span style={{ fontSize:20 }}>{n.icon}</span>{n.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Admin User Management ─────────────────────────────────────────
function AdminUsers({ users:initialUsers, onBack, t }) {
  const [users, setUsers] = useState(initialUsers);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const roleColors = { vfr:C.blue, social_worker:C.green, shelter:C.amber, admin:C.red };

  useEffect(() => setUsers(initialUsers),[initialUsers]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""),3000); }

  async function updateRole(userId, newRole) {
    setSaving(true);
    await sb.from("users").update({ role:newRole }).eq("id",userId);
    setUsers(us=>us.map(u=>u.id===userId?{...u,role:newRole}:u));
    setSelected(u=>u?{...u,role:newRole}:null);
    setSaving(false); showToast(t.roleUpdated);
  }
  async function toggleApproval(userId, current) {
    setSaving(true);
    await sb.from("users").update({ approved:!current }).eq("id",userId);
    setUsers(us=>us.map(u=>u.id===userId?{...u,approved:!current}:u));
    setSelected(u=>u?{...u,approved:!current}:null);
    setSaving(false); showToast(current?t.userSuspended:t.userApproved);
  }
  async function deleteUser(userId) {
    setSaving(true);
    await sb.from("users").delete().eq("id",userId);
    setUsers(us=>us.filter(u=>u.id!==userId));
    setSelected(null); setSaving(false); showToast(t.userDeleted);
  }

  const filtered = filter==="ALL"?users:filter==="PENDING"?users.filter(u=>!u.approved):users.filter(u=>u.role===filter.toLowerCase());

  if (selected) {
    const u = selected;
    return (
      <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
        <div style={{ padding:"14px 16px", background:C.black, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn btn-dark" style={{ padding:"8px 12px", fontSize:13 }} onClick={() => setSelected(null)}>← {t.back}</button>
          <div style={{ fontFamily:"Bebas Neue", fontSize:18, color:C.white, letterSpacing:1 }}>USER DETAILS</div>
        </div>
        <div className="screen fade-in" style={{ padding:"16px" }}>
          <div className="card" style={{ marginBottom:14, border:`1px solid ${roleColors[u.role]||C.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:`${roleColors[u.role]||C.grey}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                {u.role==="vfr"?"👮":u.role==="social_worker"?"🧑‍💼":u.role==="shelter"?"🏠":"⚙️"}
              </div>
              <span className="tag" style={{ background:`${roleColors[u.role]}22`, color:roleColors[u.role]||C.grey }}>{u.role?.replace("_"," ").toUpperCase()}</span>
            </div>
            <div style={{ fontSize:17, color:C.white, fontWeight:700, marginBottom:10 }}>{u.full_name}</div>
            {[{icon:"🏢",label:"Organisation",value:u.organisation},{icon:"📧",label:"Email",value:u.email},{icon:"📞",label:"Phone",value:u.phone},{icon:"📅",label:"Registered",value:new Date(u.created_at).toLocaleDateString("en-ZA")}].map(row => (
              <div key={row.label} style={{ background:C.blackSoft, borderRadius:10, padding:"8px 12px", marginBottom:6 }}>
                <div style={{ fontSize:10, color:C.grey }}>{row.icon} {row.label}</div>
                <div style={{ fontSize:12, color:C.white, marginTop:2 }}>{row.value||"—"}</div>
              </div>
            ))}
            <span className="tag" style={{ marginTop:8, background:u.approved!==false?C.greenBg:"rgba(208,2,27,0.12)", color:u.approved!==false?C.green:C.red }}>
              {u.approved!==false?t.approved:t.suspended}
            </span>
          </div>
          <div className="card" style={{ marginBottom:12 }}>
            <div style={{ fontSize:12, color:C.grey, fontWeight:600, marginBottom:10 }}>{t.changeRole}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {["vfr","social_worker","shelter","admin"].map(r => (
                <button key={r} className="btn" onClick={() => updateRole(u.id,r)} disabled={saving||u.role===r}
                  style={{ padding:"9px 8px", fontSize:11, background:u.role===r?`${roleColors[r]}22`:C.blackSoft, color:u.role===r?roleColors[r]:C.grey, border:`1.5px solid ${u.role===r?roleColors[r]:C.border}`, borderRadius:10 }}>
                  {r==="vfr"?"👮 VFR":r==="social_worker"?"🧑‍💼 Social Worker":r==="shelter"?"🏠 Shelter":"⚙️ Admin"}
                </button>
              ))}
            </div>
          </div>
          <button className="btn" onClick={() => toggleApproval(u.id, u.approved!==false)} disabled={saving}
            style={{ width:"100%", padding:"13px", fontSize:13, marginBottom:10, background:u.approved!==false?C.amberBg:C.greenBg, color:u.approved!==false?C.amber:C.green, border:`1.5px solid ${u.approved!==false?C.amber:C.green}`, borderRadius:12 }}>
            {u.approved!==false?t.suspendUser:t.approveUser}
          </button>
          {u.role!=="admin" && (
            <button className="btn" onClick={() => { if(window.confirm(`Delete ${u.full_name}?`)) deleteUser(u.id); }} disabled={saving}
              style={{ width:"100%", padding:"13px", fontSize:13, background:"rgba(208,2,27,0.12)", color:C.red, border:`1.5px solid ${C.red}`, borderRadius:12 }}>
              {t.deleteUser}
            </button>
          )}
        </div>
        {toast && <div style={{ position:"absolute", bottom:30, left:20, right:20, background:C.green, color:C.black, borderRadius:12, padding:"12px 16px", textAlign:"center", fontSize:13, fontWeight:600, zIndex:999 }}>{toast}</div>}
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"14px 16px", background:C.black, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
        <button className="btn btn-dark" style={{ padding:"8px 12px", fontSize:13 }} onClick={onBack}>← {t.back}</button>
        <div style={{ fontFamily:"Bebas Neue", fontSize:20, color:C.white, letterSpacing:1 }}>{t.userMgmt}</div>
        <div style={{ marginLeft:"auto", fontSize:12, color:C.grey }}>{users.length} {t.registeredUsers}</div>
      </div>
      <div style={{ display:"flex", gap:6, padding:"10px 14px", background:C.blackMid, overflowX:"auto" }}>
        {["ALL","PENDING","VFR","SOCIAL_WORKER","SHELTER","ADMIN"].map(f => (
          <button key={f} className="btn" onClick={() => setFilter(f)}
            style={{ padding:"6px 12px", fontSize:10, whiteSpace:"nowrap", background:filter===f?C.red:C.blackSoft, color:filter===f?C.white:C.grey, border:`1.5px solid ${filter===f?C.red:C.border}`, borderRadius:20 }}>
            {f==="SOCIAL_WORKER"?"SOCIAL WORKER":f}
            {f==="PENDING"&&users.filter(u=>!u.approved).length>0&&<span style={{ marginLeft:4, background:C.red, color:C.white, borderRadius:"50%", padding:"1px 5px", fontSize:9 }}>{users.filter(u=>!u.approved).length}</span>}
          </button>
        ))}
      </div>
      <div className="screen" style={{ padding:"10px 14px" }}>
        {filtered.length===0
          ? <div style={{ textAlign:"center", padding:"40px 0", color:C.grey }}>No users found</div>
          : filtered.map(u => (
            <div key={u.id} className="card fade-in" style={{ marginBottom:10, cursor:"pointer", border:`1px solid ${u.approved===false?C.red:C.border}` }} onClick={() => setSelected(u)}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:C.white, fontWeight:600 }}>{u.full_name}</div>
                  <div style={{ fontSize:11, color:C.grey }}>{u.organisation}</div>
                  <div style={{ fontSize:11, color:C.greyMid }}>{u.email}</div>
                  <div style={{ fontSize:11, color:C.greyMid }}>{u.phone}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
                  <span className="tag" style={{ background:`${roleColors[u.role]}22`, color:roleColors[u.role]||C.grey, fontSize:10 }}>{u.role?.replace("_"," ").toUpperCase()}</span>
                  {u.approved===false&&<span className="tag" style={{ background:"rgba(208,2,27,0.12)", color:C.red, fontSize:10 }}>SUSPENDED</span>}
                </div>
              </div>
              <div style={{ fontSize:10, color:C.greyMid, marginTop:6 }}>Registered {new Date(u.created_at).toLocaleDateString("en-ZA")} · {t.tapManage}</div>
            </div>
          ))
        }
      </div>
      {toast&&<div style={{ position:"absolute", bottom:30, left:20, right:20, background:C.green, color:C.black, borderRadius:12, padding:"12px 16px", textAlign:"center", fontSize:13, fontWeight:600, zIndex:999 }}>{toast}</div>}
    </div>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────

// ── Admin Referral Proxy ──────────────────────────────────────────────
function AdminReferralProxy({ user, shelters, onBack, t }) {
  const [vfrName, setVfrName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  if (matchResult) {
    return (
      <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
        <div style={{ padding:"14px 16px", background:C.black, borderBottom:"1px solid "+C.border, display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn btn-dark" style={{ padding:"8px 12px", fontSize:13 }} onClick={onBack}>Back</button>
          <div style={{ fontFamily:"Bebas Neue", fontSize:18, color:C.white }}>REFERRAL SUBMITTED</div>
        </div>
        <div className="screen fade-in" style={{ padding:"20px" }}>
          <div style={{ background:C.greenBg, border:"1px solid "+C.green, borderRadius:16, padding:"20px", marginBottom:16, textAlign:"center" }}>
            <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
            <div style={{ fontFamily:"Bebas Neue", fontSize:22, color:C.green }}>MATCH FOUND</div>
            <div style={{ fontSize:12, color:C.grey, marginTop:4 }}>Submitted on behalf of: {vfrName||"VFR Officer"}</div>
          </div>
          {matchResult.shelter && (
            <div className="card" style={{ border:"1px solid "+C.green, marginBottom:12 }}>
              <div style={{ fontSize:10, color:C.green, fontWeight:600, marginBottom:8 }}>MATCHED SHELTER</div>
              <div style={{ fontSize:17, color:C.white, fontWeight:700, marginBottom:4 }}>{matchResult.shelter.shelter_name}</div>
              <div style={{ fontSize:12, color:C.grey, marginBottom:12 }}>{matchResult.shelter.area}</div>
              <a href={"https://wa.me/"+((matchResult.shelter.whatsapp||"").replace(/\D/g,""))+"?text=Hi%2C%20SafeLink%20SA%20Admin%20referral%20on%20behalf%20of%20"+encodeURIComponent(vfrName||"VFR Officer")+".%20Case%3A%20"+matchResult.caseId+".%20Please%20confirm%20availability."}
                target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px", background:"#25D366", borderRadius:10, color:"#fff", fontWeight:700, fontSize:13, textDecoration:"none" }}>
                💬 Message Shelter on WhatsApp
              </a>
            </div>
          )}
          <button className="btn btn-dark" style={{ width:"100%", padding:"13px" }} onClick={onBack}>Return to Admin Dashboard</button>
        </div>
      </div>
    );
  }

  if (showForm) {
    return <ReferralForm user={{...user, full_name: vfrName||user.full_name}} shelters={shelters} onBack={() => setShowForm(false)} onMatch={r => setMatchResult(r)} t={t} />;
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"14px 16px", background:C.black, borderBottom:"1px solid "+C.border, display:"flex", alignItems:"center", gap:12 }}>
        <button className="btn btn-dark" style={{ padding:"8px 12px", fontSize:13 }} onClick={onBack}>Back</button>
        <div style={{ fontFamily:"Bebas Neue", fontSize:18, color:C.white }}>SUBMIT ON BEHALF OF VFR</div>
      </div>
      <div className="screen fade-in" style={{ padding:"16px" }}>
        <div className="card" style={{ marginBottom:16, border:"1px solid "+C.blue }}>
          <div style={{ fontSize:11, color:C.blue, fontWeight:600, marginBottom:8 }}>👮 VFR OFFICER DETAILS</div>
          <div style={{ fontSize:12, color:C.grey, marginBottom:10 }}>Who are you submitting this referral on behalf of?</div>
          <input className="input" placeholder="VFR Officer or Social Worker name" value={vfrName} onChange={e=>setVfrName(e.target.value)} style={{ marginBottom:14 }} />
          <button className="btn btn-red" style={{ width:"100%", padding:"13px", fontSize:13 }} onClick={() => setShowForm(true)}>
            Continue to Referral Form →
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ user, onLogout }) {
  const t = useLang();
  const [users, setUsers] = useState([]);
  const [cases, setCases] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [screen, setScreen] = useState("home");
  const [showAdminReferral, setShowAdminReferral] = useState(false);

  const loadAll = useCallback(async () => {
    const [u,c,s] = await Promise.all([
      sb.from("users").select("*").order("created_at",{ascending:false}),
      sb.from("cases").select("*").order("created_at",{ascending:false}),
      sb.from("shelters").select("*"),
    ]);
    setUsers(u.data||[]); setCases(c.data||[]); setShelters(s.data||[]);
  },[]);

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 30000);
    return () => clearInterval(interval);
  },[loadAll]);

  const matchRate = cases.length?Math.round((cases.filter(c=>c.outcome==="MATCHED").length/cases.length)*100):0;
  const totalBeds = shelters.reduce((a,s)=>a+(s.available_beds||0),0);

  if (screen==="users") return <AdminUsers users={users} onBack={() => { setScreen("home"); loadAll(); }} t={t} />;
  if (screen==="cases") return <CaseLog cases={cases} onBack={() => setScreen("home")} onSelectCase={() => {}} t={t} />;
  if (screen==="shelters") return <ShelterProfiles shelters={shelters} onBack={() => setScreen("home")} t={t} />;
  if (screen==="map") return <ShelterMap shelters={shelters} onBack={() => setScreen("home")} t={t} />;
  if (screen==="report") return <MonthlyReport cases={cases} shelters={shelters} users={users} onBack={() => setScreen("home")} t={t} />;
  if (showAdminReferral) return <AdminReferralProxy user={user} shelters={shelters} onBack={() => setShowAdminReferral(false)} t={t} />;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <TopBar user={user} onLogout={onLogout} t={t} />
      <div className="screen fade-in" style={{ padding:"16px 16px 100px" }}>
        <div style={{ background:`linear-gradient(135deg,#0A0A1A,#0A1A2A)`, border:`1px solid rgba(33,150,243,0.3)`, borderRadius:20, padding:"18px 20px", marginBottom:16 }}>
          <div style={{ fontSize:11, color:C.blue, fontWeight:600, letterSpacing:1, marginBottom:3 }}>{t.adminPanel}</div>
          <div style={{ fontFamily:"Bebas Neue", fontSize:22, color:C.white, letterSpacing:1 }}>{t.systemOverview}</div>
          <div style={{ fontSize:11, color:C.grey }}>Pathway Impact Labs · Live data</div>
          <div style={{ fontSize:10, color:C.greyMid, marginTop:4 }}>Auto-refreshes every 30s</div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {[{label:t.totalUsers,value:users.length,color:C.blue,icon:"👥"},{label:"Total Cases",value:cases.length,color:C.white,icon:"📋"},{label:t.matchRate,value:`${matchRate}%`,color:C.green,icon:"✅"},{label:t.bedsAvailable,value:totalBeds,color:C.amber,icon:"🏠"}].map(m => (
            <div key={m.label} className="card" style={{ padding:"14px 10px" }}>
              <div style={{ fontSize:18, marginBottom:4 }}>{m.icon}</div>
              <div style={{ fontFamily:"Bebas Neue", fontSize:26, color:m.color }}>{m.value}</div>
              <div style={{ fontSize:10, color:C.grey }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <button className="btn btn-red" style={{ width:"100%", padding:"13px", fontSize:13, marginBottom:10, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }} onClick={() => setShowAdminReferral(true)}>
          <span style={{ fontSize:18 }}>{"➕"}</span> Submit Referral on Behalf of VFR
        </button>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {[{icon:"👥",label:"Manage Users",s:"users",color:C.blue},{icon:"🗺",label:t.map,s:"map",color:C.green},{icon:"🏠",label:"Shelter Profiles",s:"shelters",color:C.amber},{icon:"📊",label:t.monthlyReport,s:"report",color:C.purple}].map(a => (
            <button key={a.s} className="btn" onClick={() => setScreen(a.s)}
              style={{ padding:"14px 10px", background:`${a.color}11`, border:`1px solid ${a.color}44`, borderRadius:14, color:a.color, fontSize:12, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:22 }}>{a.icon}</span>{a.label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, color:C.grey, fontWeight:600, marginBottom:10 }}>{t.shelterNetwork}</div>
          {shelters.map(s => (
            <div key={s.id} className="card" style={{ marginBottom:8, cursor:"pointer" }} onClick={() => setScreen("shelters")}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div style={{ fontSize:13, color:C.white, fontWeight:600 }}>{s.shelter_name}</div>
                <span className="tag" style={{ background:s.accepting_referrals?C.greenBg:"rgba(208,2,27,0.12)", color:s.accepting_referrals?C.green:C.red, fontSize:10 }}>{s.accepting_referrals?t.open2:t.closed}</span>
              </div>
              <div style={{ background:C.blackSoft, borderRadius:4, height:5, overflow:"hidden" }}>
                <div style={{ height:"100%", background:s.available_beds>3?C.green:s.available_beds>0?C.amber:C.red, width:`${s.total_capacity?(s.available_beds/s.total_capacity)*100:0}%`, transition:"width 0.5s" }} />
              </div>
              <div style={{ fontSize:10, color:C.grey, marginTop:3 }}>{s.available_beds}/{s.total_capacity} beds · {s.area}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontSize:12, color:C.grey, fontWeight:600 }}>RECENT CASES</div>
            <button className="btn" style={{ fontSize:11, color:C.red, padding:"4px 8px", background:"transparent" }} onClick={() => setScreen("cases")}>{t.viewAll}</button>
          </div>
          {cases.slice(0,4).map(c => (
            <div key={c.id} className="card" style={{ marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:11, fontFamily:"DM Mono", color:C.white }}>{c.case_id}</div>
                <div style={{ fontSize:10, color:C.grey }}>{c.submitter_name} · {c.organisation}</div>
              </div>
              <span className="tag" style={{ background:c.outcome==="MATCHED"?C.greenBg:C.amberBg, color:c.outcome==="MATCHED"?C.green:C.amber, fontSize:10 }}>{c.outcome||"PENDING"}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:C.blackMid, borderTop:`1px solid ${C.border}`, display:"flex", padding:"10px 0 18px" }}>
        {[{icon:"📊",label:t.overview,s:"home"},{icon:"👥",label:t.users,s:"users"},{icon:"📋",label:t.cases,s:"cases"},{icon:"🗺",label:t.map,s:"map"},{icon:"📊",label:t.report,s:"report"}].map(n => (
          <button key={n.s} className="btn" onClick={() => setScreen(n.s)}
            style={{ flex:1, background:"transparent", color:screen===n.s?C.red:C.grey, fontSize:9, padding:"4px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <span style={{ fontSize:16 }}>{n.icon}</span>{n.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("safelink_user");
    const savedLang = localStorage.getItem("safelink_lang");
    if (saved) { try { setUser(JSON.parse(saved)); } catch {} }
      },[]);

  function handleAuth(u) { setUser(u); localStorage.setItem("safelink_user",JSON.stringify(u)); }
  function handleLogout() { setUser(null); localStorage.removeItem("safelink_user"); }
  function handleLang(l) { setLang(l); localStorage.setItem("safelink_lang",l); }

  function renderDashboard() {
    if (!user) return <AuthScreen onAuth={handleAuth} />;
    switch(user.role) {
      case "admin": return <AdminDashboard user={user} onLogout={handleLogout} />;
      case "shelter": return <ShelterDashboard user={user} onLogout={handleLogout} />;
      default: return <ReferralDashboard user={user} onLogout={handleLogout} />;
    }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="phone-shell">
        <div className="phone-frame">{renderDashboard()}</div>
      </div>
      <div style={{ position:"fixed", bottom:10, left:0, right:0, textAlign:"center", fontSize:10, color:"rgba(255,255,255,0.15)", pointerEvents:"none", zIndex:999 }}>
        Developed by Simone Jonkers · Pathway Impact Labs · A division of Pathway Films · © {new Date().getFullYear()} ALL RIGHTS RESERVED
      </div>
    </>
  );
}
