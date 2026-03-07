import { useState, useEffect } from "react";

import LOGO_URI from "./safelink_logo.jpeg";

// ── Brand tokens ───────────────────────────────────────────────
const C = {
  red:      '#D0021B',
  redDark:  '#A50115',
  redGlow:  'rgba(208,2,27,0.25)',
  black:    '#0A0A0A',
  blackMid: '#141414',
  blackSoft:'#1E1E1E',
  card:     '#1A1A1A',
  border:   '#2A2A2A',
  white:    '#FFFFFF',
  offWhite: '#F5F5F5',
  grey:     '#888888',
  greyMid:  '#555555',
  greyLight:'#CCCCCC',
  green:    '#00C853',
  greenBg:  'rgba(0,200,83,0.12)',
  amber:    '#FFB300',
  amberBg:  'rgba(255,179,0,0.12)',
};

// ── Injected styles ────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0A0A; font-family: 'DM Sans', sans-serif; }

  .phone {
    width: 390px; height: 844px;
    background: ${C.black};
    border-radius: 48px;
    border: 1.5px solid ${C.border};
    overflow: hidden;
    position: relative;
    box-shadow: 0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.03);
    display: flex; flex-direction: column;
  }

  .status-bar {
    height: 50px; min-height: 50px;
    background: ${C.black};
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px;
    flex-shrink: 0;
  }
  .notch {
    width: 120px; height: 34px;
    background: ${C.black};
    border-radius: 0 0 20px 20px;
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    z-index: 10;
  }

  .screen {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    background: ${C.black};
    scrollbar-width: none;
  }
  .screen::-webkit-scrollbar { display: none; }

  .nav-bar {
    height: 72px; min-height: 72px;
    background: rgba(10,10,10,0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid ${C.border};
    display: flex; align-items: center; justify-content: space-around;
    flex-shrink: 0;
    padding-bottom: 8px;
  }

  .nav-item {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    cursor: pointer; padding: 8px 16px; border-radius: 12px;
    transition: all 0.2s;
    border: none; background: none;
  }
  .nav-item.active .nav-icon { color: ${C.red}; }
  .nav-item.active .nav-label { color: ${C.red}; }
  .nav-icon { font-size: 20px; color: ${C.greyMid}; transition: all 0.2s; }
  .nav-label { font-size: 10px; color: ${C.greyMid}; font-family: 'DM Sans'; font-weight: 500; letter-spacing: 0.5px; }

  .header {
    padding: 20px 24px 16px;
    background: ${C.black};
  }
  .header-top {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 4px;
  }

  .logo-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px; letter-spacing: 3px;
    color: ${C.white};
  }
  .logo-red { color: ${C.red}; }

  .badge {
    background: ${C.redDark};
    color: ${C.white};
    font-size: 10px; font-weight: 700;
    padding: 3px 8px; border-radius: 20px;
    letter-spacing: 1px;
  }

  .card {
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: 16px;
    overflow: hidden;
  }

  .btn-primary {
    width: 100%;
    background: ${C.red};
    color: white;
    border: none; border-radius: 14px;
    padding: 16px; font-size: 15px; font-weight: 700;
    font-family: 'DM Sans'; letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 20px ${C.redGlow};
  }
  .btn-primary:hover { background: ${C.redDark}; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }

  .btn-secondary {
    width: 100%;
    background: transparent;
    color: ${C.white};
    border: 1px solid ${C.border}; border-radius: 14px;
    padding: 14px; font-size: 14px; font-weight: 600;
    font-family: 'DM Sans';
    cursor: pointer; transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: ${C.red}; color: ${C.red}; }

  .input-field {
    background: ${C.blackSoft};
    border: 1px solid ${C.border};
    border-radius: 12px;
    padding: 14px 16px;
    color: ${C.white};
    font-family: 'DM Sans'; font-size: 14px;
    width: 100%;
    outline: none;
    transition: border 0.2s;
  }
  .input-field:focus { border-color: ${C.red}; }
  .input-label {
    font-size: 11px; font-weight: 600; color: ${C.grey};
    letter-spacing: 1px; text-transform: uppercase;
    margin-bottom: 6px; display: block;
  }

  .select-field {
    background: ${C.blackSoft};
    border: 1px solid ${C.border};
    border-radius: 12px;
    padding: 14px 16px;
    color: ${C.white};
    font-family: 'DM Sans'; font-size: 14px;
    width: 100%; outline: none;
    appearance: none;
    transition: border 0.2s;
  }
  .select-field:focus { border-color: ${C.red}; }

  .section-title {
    font-size: 11px; font-weight: 700; color: ${C.red};
    letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 12px;
  }

  .stat-card {
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: 16px;
    padding: 18px;
    flex: 1;
  }

  .pulse { animation: pulse 2s infinite; }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .slide-up { animation: slideUp 0.3s ease; }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600;
  }
  .chip-red { background: rgba(208,2,27,0.15); color: ${C.red}; border: 1px solid rgba(208,2,27,0.3); }
  .chip-green { background: ${C.greenBg}; color: ${C.green}; border: 1px solid rgba(0,200,83,0.3); }
  .chip-amber { background: ${C.amberBg}; color: ${C.amber}; border: 1px solid rgba(255,179,0,0.3); }
  .chip-grey { background: rgba(255,255,255,0.06); color: ${C.greyLight}; border: 1px solid ${C.border}; }

  .progress-bar {
    height: 4px; background: ${C.blackSoft}; border-radius: 2px; overflow: hidden;
  }
  .progress-fill {
    height: 100%; background: ${C.red}; border-radius: 2px;
    transition: width 0.5s ease;
  }

  .toggle {
    width: 44px; height: 24px; border-radius: 12px;
    border: none; cursor: pointer; position: relative;
    transition: background 0.3s;
  }
  .toggle::after {
    content: ''; position: absolute;
    width: 18px; height: 18px; border-radius: 50%;
    background: white; top: 3px; transition: left 0.3s;
  }
  .toggle.on { background: ${C.red}; }
  .toggle.on::after { left: 23px; }
  .toggle.off { background: ${C.greyMid}; }
  .toggle.off::after { left: 3px; }

  .checkbox-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid ${C.border};
    cursor: pointer;
  }
  .checkbox-row:last-child { border-bottom: none; }
  .checkbox {
    width: 20px; height: 20px; border-radius: 6px;
    border: 1.5px solid ${C.border};
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.2s;
  }
  .checkbox.checked { background: ${C.red}; border-color: ${C.red}; }

  .back-btn {
    width: 36px; height: 36px; border-radius: 10px;
    background: ${C.blackSoft}; border: 1px solid ${C.border};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; color: ${C.white};
    flex-shrink: 0;
  }

  .risk-high { color: ${C.red}; }
  .risk-medium { color: ${C.amber}; }
  .risk-low { color: ${C.green}; }

  .divider { height: 1px; background: ${C.border}; margin: 16px 0; }

  .match-banner {
    background: linear-gradient(135deg, #1A0000, #2A0008);
    border: 1px solid rgba(208,2,27,0.4);
    border-radius: 16px; padding: 20px;
    position: relative; overflow: hidden;
  }
  .match-banner::before {
    content: ''; position: absolute;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(208,2,27,0.15), transparent);
    top: -60px; right: -60px;
  }
`;

// ═══════════════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════════════

// ── LOGIN SCREEN ────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('vfr');
  return (
    <div className="screen slide-up" style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'40px 24px 32px' }}>
      <div style={{ textAlign:'center', marginTop: 20 }}>
        <img src={LOGO_URI} alt="SafeLink SA" style={{ width:160, height:'auto', margin:'0 auto', display:'block', filter:'drop-shadow(0 4px 24px rgba(208,2,27,0.3))' }} />
        <div style={{ marginTop:16, fontSize:13, color: C.grey, fontWeight:400 }}>GBV Emergency Shelter Coordination</div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div>
          <span className="input-label">Sign in as</span>
          <div style={{ display:'flex', gap:8 }}>
            {[['vfr','👮 VFR'],['shelter','🏠 Shelter'],['admin','⚙️ Admin']].map(([val,label]) => (
              <button key={val} onClick={()=>setRole(val)} style={{
                flex:1, padding:'10px 4px', borderRadius:12, fontSize:11, fontWeight:700,
                fontFamily:'DM Sans', cursor:'pointer', letterSpacing:0.3,
                background: role===val ? C.red : C.blackSoft,
                color: role===val ? C.white : C.grey,
                border: role===val ? `1px solid ${C.red}` : `1px solid ${C.border}`,
                transition:'all 0.2s'
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div>
          <span className="input-label">Force Number / ID</span>
          <input className="input-field" defaultValue="JHB-S-2847" placeholder="Enter your ID" />
        </div>
        <div>
          <span className="input-label">PIN</span>
          <input className="input-field" type="password" defaultValue="••••••" placeholder="Enter PIN" />
        </div>

        <button className="btn-primary" onClick={()=>onLogin(role)} style={{ marginTop:8 }}>
          SIGN IN SECURELY
        </button>

        <div style={{ textAlign:'center', fontSize:11, color: C.greyMid, marginTop:4 }}>
          🔒 POPIA Compliant · End-to-End Encrypted
        </div>
      </div>
    </div>
  );
}

// ── VFR DASHBOARD ───────────────────────────────────────────────
function VFRDashboard({ onNavigate }) {
  return (
    <div className="screen slide-up" style={{ padding:'0 0 20px' }}>
      <div className="header">
        <div className="header-top">
          <div>
            <div style={{ fontSize:12, color: C.grey, marginBottom:2 }}>Good morning,</div>
            <div style={{ fontSize:18, fontWeight:700, color: C.white }}>Sgt. Mokoena</div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background: C.green }} className="pulse" />
            <span style={{ fontSize:11, color: C.green, fontWeight:600 }}>SYSTEM LIVE</span>
          </div>
        </div>
        <div style={{ fontSize:11, color: C.grey, marginTop:2 }}>
          📍 Johannesburg South VFR 1 · {new Date().toLocaleDateString('en-ZA')}
        </div>
      </div>

      <div style={{ padding:'0 20px', display:'flex', flexDirection:'column', gap:16 }}>

        {/* Big action button */}
        <button className="btn-primary" onClick={()=>onNavigate('vfr-form')} style={{ padding:'20px', fontSize:16, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
          <span style={{ fontSize:22 }}>⚡</span>
          NEW SHELTER REQUEST
        </button>

        {/* Stats row */}
        <div style={{ display:'flex', gap:10 }}>
          {[
            { label:'My Cases', value:'12', sub:'This month', color: C.red },
            { label:'Matched', value:'10', sub:'83% rate', color: C.green },
            { label:'Open', value:'2', sub:'Pending', color: C.amber },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ textAlign:'center', padding:'14px 8px' }}>
              <div style={{ fontSize:26, fontWeight:800, color: s.color, fontFamily:'DM Mono' }}>{s.value}</div>
              <div style={{ fontSize:11, fontWeight:700, color: C.white, marginTop:2 }}>{s.label}</div>
              <div style={{ fontSize:10, color: C.grey }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Shelters nearby */}
        <div>
          <div className="section-title">Available Shelters Nearby</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              { name:'Soweto Safe Haven', beds:8, area:'Soweto', disability:true, hours:'24hr' },
              { name:'JHB South Women\'s Refuge', beds:12, area:'JHB South', disability:true, hours:'24hr' },
              { name:'Lenasia Family Centre', beds:6, area:'Lenasia', disability:false, hours:'Office hrs' },
              { name:'Ennerdale Disability Shelter', beds:10, area:'Ennerdale', disability:true, hours:'Office hrs' },
              { name:'Eldorado Park Safe House', beds:5, area:'Eldorado Park', disability:false, hours:'24hr' },
            ].map((s,i) => (
              <div key={i} className="card" style={{ padding:'14px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color: C.white }}>{s.name}</div>
                    <div style={{ fontSize:11, color: C.grey, marginTop:2 }}>📍 {s.area} · {s.hours}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:20, fontWeight:800, color: s.beds>5?C.green:C.amber, fontFamily:'DM Mono' }}>{s.beds}</div>
                    <div style={{ fontSize:9, color: C.grey }}>beds</div>
                  </div>
                </div>
                {s.disability && (
                  <div style={{ marginTop:8 }}>
                    <span className="chip chip-red" style={{ fontSize:10 }}>♿ Disability Support</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent cases */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <div className="section-title" style={{ margin:0 }}>Recent Cases</div>
            <button onClick={()=>onNavigate('cases')} style={{ fontSize:11, color: C.red, background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>View All →</button>
          </div>
          {[
            { id:'SL-JHB-2026-0012', outcome:'MATCHED', risk:'HIGH', time:'09:14' },
            { id:'SL-JHB-2026-0011', outcome:'MATCHED', risk:'MEDIUM', time:'Yesterday' },
            { id:'SL-JHB-2026-0010', outcome:'NO MATCH', risk:'HIGH', time:'Yesterday' },
          ].map((c,i) => (
            <div key={i} className="card" style={{ padding:'12px 16px', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color: C.white, fontFamily:'DM Mono' }}>{c.id}</div>
                <div style={{ fontSize:11, color: C.grey, marginTop:2 }}>{c.time}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                <span className={`chip ${c.outcome==='MATCHED'?'chip-green':'chip-red'}`}>{c.outcome==='MATCHED'?'✓ MATCHED':'✗ NO MATCH'}</span>
                <span className={`chip ${c.risk==='HIGH'?'chip-red':c.risk==='MEDIUM'?'chip-amber':'chip-grey'}`}>{c.risk}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── VFR REFERRAL FORM ───────────────────────────────────────────
function VFRForm({ onNavigate, onSubmit }) {
  const [step, setStep] = useState(1);
  const [disability, setDisability] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const TOTAL = 4;

  const toggleItem = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(v=>v!==val) : [...prev, val]);
  };

  return (
    <div className="screen slide-up" style={{ padding:'0 0 24px' }}>
      {/* Header */}
      <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:`1px solid ${C.border}` }}>
        <button className="back-btn" onClick={()=>step>1?setStep(s=>s-1):onNavigate('vfr-dashboard')}>←</button>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:700, color: C.white }}>New Shelter Request</div>
          <div style={{ fontSize:11, color: C.grey }}>Step {step} of {TOTAL}</div>
        </div>
        <div className="chip chip-red">LIVE</div>
      </div>

      {/* Progress */}
      <div style={{ padding:'12px 20px 0' }}>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width:`${(step/TOTAL)*100}%` }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
          {['Officer','Survivor','Case','Safety'].map((s,i) => (
            <span key={s} style={{ fontSize:9, color: i<step?C.red:C.greyMid, fontWeight:700, letterSpacing:0.5 }}>{s.toUpperCase()}</span>
          ))}
        </div>
      </div>

      <div style={{ padding:'20px' }}>

        {/* STEP 1 — Officer Details */}
        {step===1 && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="section-title">VFR Details</div>
            <div>
              <span className="input-label">VFR Station *</span>
              <select className="select-field">
                <option>Johannesburg South VFR 1</option>
                <option>Johannesburg South VFR 2</option>
              </select>
            </div>
            <div>
              <span className="input-label">Organisation / Station Name *</span>
              <input className="input-field" defaultValue="Johannesburg South Police Station" />
            </div>
            <div>
              <span className="input-label">Officer Full Name *</span>
              <input className="input-field" defaultValue="Sgt. T. Mokoena" />
            </div>
            <div>
              <span className="input-label">Officer Rank *</span>
              <select className="select-field">
                <option>Sergeant</option><option>Constable</option><option>Warrant Officer</option><option>Lieutenant</option>
              </select>
            </div>
            <div>
              <span className="input-label">Direct Contact Number *</span>
              <input className="input-field" defaultValue="011 555 0100" />
            </div>
            <button className="btn-primary" onClick={()=>setStep(2)}>Continue →</button>
          </div>
        )}

        {/* STEP 2 — Survivor Info */}
        {step===2 && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="match-banner" style={{ marginBottom:4 }}>
              <div style={{ fontSize:11, color: C.red, fontWeight:700, letterSpacing:1, marginBottom:4 }}>🔒 PRIVACY PROTECTED</div>
              <div style={{ fontSize:12, color: C.greyLight }}>No name or ID number is collected. A Case ID will be auto-generated.</div>
            </div>
            <div>
              <span className="input-label">Survivor Gender *</span>
              <select className="select-field">
                <option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option>
              </select>
            </div>
            <div>
              <span className="input-label">Survivor Age *</span>
              <input className="input-field" type="number" placeholder="Age in years" />
            </div>
            <div>
              <span className="input-label">Nationality *</span>
              <input className="input-field" placeholder="e.g. South African, Zimbabwean" />
            </div>
            <div>
              <span className="input-label">Home Language</span>
              <select className="select-field">
                <option>Zulu</option><option>Xhosa</option><option>Sotho</option><option>Afrikaans</option><option>English</option><option>Other</option>
              </select>
            </div>
            <div className="section-title" style={{ marginTop:8 }}>Disability / Access Needs *</div>
            <div className="card" style={{ padding:'0 16px' }}>
              {['No disability','Wheelchair access','Visual impairment','Hearing impairment','Intellectual disability','Mental health / psychiatric'].map(item => (
                <div key={item} className="checkbox-row" onClick={()=>toggleItem(disability,setDisability,item)}>
                  <div className={`checkbox ${disability.includes(item)?'checked':''}`}>
                    {disability.includes(item) && <span style={{ color:'white', fontSize:12 }}>✓</span>}
                  </div>
                  <span style={{ fontSize:13, color: C.white }}>{item}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={()=>setStep(3)}>Continue →</button>
          </div>
        )}

        {/* STEP 3 — Case Details */}
        {step===3 && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="section-title">Case Type & Legal Status</div>
            <div className="card" style={{ padding:'0 16px' }}>
              {['Domestic Violence','Sexual Assault / Rape','Human Trafficking','Child Abuse','Stalking / Harassment'].map(item => (
                <div key={item} className="checkbox-row" onClick={()=>toggleItem(caseTypes,setCaseTypes,item)}>
                  <div className={`checkbox ${caseTypes.includes(item)?'checked':''}`}>
                    {caseTypes.includes(item) && <span style={{ color:'white', fontSize:12 }}>✓</span>}
                  </div>
                  <span style={{ fontSize:13, color: C.white }}>{item}</span>
                </div>
              ))}
            </div>
            <div>
              <span className="input-label">Criminal Case Opened? *</span>
              <select className="select-field">
                <option>Yes — case number available</option>
                <option>Yes — case number not yet available</option>
                <option>No</option><option>Unknown</option>
              </select>
            </div>
            <div>
              <span className="input-label">Protection Order? *</span>
              <select className="select-field">
                <option>Yes — currently active</option>
                <option>Yes — application pending</option>
                <option>No</option><option>Unknown</option>
              </select>
            </div>
            <div>
              <span className="input-label">Children Accompanying? *</span>
              <select className="select-field">
                <option>No</option><option>Yes</option>
              </select>
            </div>
            <div>
              <span className="input-label">Current Location / Area *</span>
              <select className="select-field">
                <option>Johannesburg South</option><option>Soweto</option><option>Lenasia</option><option>Ennerdale</option><option>Eldorado Park</option>
              </select>
            </div>
            <button className="btn-primary" onClick={()=>setStep(4)}>Continue →</button>
          </div>
        )}

        {/* STEP 4 — Safety & Submit */}
        {step===4 && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="section-title">Urgency & Safety</div>
            <div>
              <span className="input-label">Immediate Safety Risk Level *</span>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { val:'HIGH', label:'🔴 HIGH — Survivor in immediate danger', color: C.red },
                  { val:'MEDIUM', label:'🟡 MEDIUM — Safe now, at risk if returned home', color: C.amber },
                  { val:'LOW', label:'🟢 LOW — Safe, placement within 24 hrs', color: C.green },
                ].map(opt => (
                  <div key={opt.val} className="card" style={{ padding:'14px 16px', border:`1px solid ${opt.color}33`, cursor:'pointer' }}>
                    <span style={{ fontSize:13, color: C.white }}>{opt.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="input-label">Placement Required *</span>
              <select className="select-field">
                <option>Yes — within the next 2 hours</option>
                <option>Yes — within today</option>
                <option>No — within 24–48 hours</option>
              </select>
            </div>
            <div>
              <span className="input-label">Transport to Shelter? *</span>
              <select className="select-field">
                <option>Yes</option>
                <option>No — transport assistance needed</option>
                <option>Unknown</option>
              </select>
            </div>

            <div className="divider" />

            <div className="match-banner">
              <div style={{ fontSize:12, color: C.red, fontWeight:700, marginBottom:6 }}>⚡ READY TO MATCH</div>
              <div style={{ fontSize:13, color: C.white, marginBottom:4 }}>Your request will be matched against all available shelters in seconds.</div>
              <div style={{ fontSize:11, color: C.grey }}>A Case ID will be automatically generated and logged.</div>
            </div>

            <button className="btn-primary" onClick={()=>{ onSubmit(); onNavigate('match-result'); }} style={{ fontSize:16, padding:'18px' }}>
              ⚡ FIND SHELTER NOW
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MATCH RESULT ────────────────────────────────────────────────
function MatchResult({ onNavigate }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(()=>{ const t = setTimeout(()=>setLoaded(true), 1200); return ()=>clearTimeout(t); },[]);

  if (!loaded) return (
    <div className="screen" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}>
      <div style={{ fontSize:48 }}>⚡</div>
      <div style={{ fontFamily:'Bebas Neue', fontSize:32, letterSpacing:4, color: C.white }}>MATCHING...</div>
      <div style={{ fontSize:13, color: C.grey }}>Scanning shelter database</div>
      <div style={{ width:200, marginTop:8 }}>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width:'70%', animation:'pulse 1s infinite' }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="screen slide-up" style={{ padding:'0 0 24px' }}>
      <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:`1px solid ${C.border}` }}>
        <button className="back-btn" onClick={()=>onNavigate('vfr-dashboard')}>←</button>
        <div style={{ fontSize:15, fontWeight:700, color: C.white }}>Match Result</div>
      </div>

      <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:16 }}>

        {/* Case ID banner */}
        <div style={{ background:'linear-gradient(135deg,#1A0000,#2A0008)', border:`1px solid rgba(208,2,27,0.5)`, borderRadius:16, padding:'16px 20px', textAlign:'center' }}>
          <div style={{ fontSize:11, color: C.red, fontWeight:700, letterSpacing:2, marginBottom:4 }}>CASE ID GENERATED</div>
          <div style={{ fontFamily:'DM Mono', fontSize:22, fontWeight:700, color: C.white, letterSpacing:2 }}>SL-JHB-2026-0013</div>
          <div style={{ fontSize:11, color: C.grey, marginTop:4 }}>
            {new Date().toLocaleDateString('en-ZA')} · {new Date().toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'})}
          </div>
        </div>

        {/* Match status */}
        <div style={{ background: C.greenBg, border:`1px solid rgba(0,200,83,0.3)`, borderRadius:16, padding:'16px 20px', display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ fontSize:36 }}>✅</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color: C.green }}>3 SHELTERS MATCHED</div>
            <div style={{ fontSize:12, color: C.greyLight }}>All criteria met including disability support</div>
          </div>
        </div>

        {/* Top match */}
        <div>
          <div className="section-title">Top Match</div>
          <div className="card" style={{ padding:'18px', border:`1px solid rgba(208,2,27,0.3)` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color: C.white }}>Soweto Safe Haven</div>
                <div style={{ fontSize:11, color: C.grey, marginTop:2 }}>📍 Soweto · 24hr intake</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'DM Mono', fontSize:28, fontWeight:800, color: C.green }}>8</div>
                <div style={{ fontSize:9, color: C.grey }}>beds avail.</div>
              </div>
            </div>
            <div className="divider" style={{ margin:'10px 0' }} />
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                ['📞 Call', '011 555 0101'],
                ['💬 WhatsApp', '071 555 0101'],
                ['🌙 After Hours', '082 555 0101'],
                ['🕐 Intake', '24-hour, walk-in accepted'],
                ['♿ Disability', 'Wheelchair + Mental Health ✓'],
                ['📋 Max Stay', 'Up to 3 months'],
              ].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:12, color: C.grey }}>{k}</span>
                  <span style={{ fontSize:12, color: C.white, fontWeight:500, textAlign:'right', maxWidth:180 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:14, display:'flex', gap:8 }}>
              <button className="btn-primary" style={{ flex:1, padding:12, fontSize:13 }}>📞 Call Now</button>
              <button className="btn-secondary" style={{ flex:1, padding:12, fontSize:13 }}>💬 WhatsApp</button>
            </div>
          </div>
        </div>

        {/* Other matches */}
        <div>
          <div className="section-title">Other Matches</div>
          {[
            { name:'JHB South Women\'s Refuge', beds:12, area:'JHB South' },
            { name:'Lenasia Family Crisis Centre', beds:6, area:'Lenasia' },
          ].map((s,i)=>(
            <div key={i} className="card" style={{ padding:'14px 16px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color: C.white }}>{s.name}</div>
                <div style={{ fontSize:11, color: C.grey }}>📍 {s.area}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'DM Mono', fontSize:20, color: C.green, fontWeight:700 }}>{s.beds}</div>
                <div style={{ fontSize:9, color: C.grey }}>beds</div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-secondary" onClick={()=>onNavigate('vfr-dashboard')}>← Back to Dashboard</button>
      </div>
    </div>
  );
}

// ── SHELTER DASHBOARD ───────────────────────────────────────────
function ShelterDashboard({ onNavigate }) {
  const [accepting, setAccepting] = useState(true);
  const [beds, setBeds] = useState(8);

  return (
    <div className="screen slide-up" style={{ padding:'0 0 20px' }}>
      <div className="header">
        <div className="header-top">
          <div>
            <div style={{ fontSize:12, color: C.grey }}>Shelter Portal</div>
            <div style={{ fontSize:17, fontWeight:700, color: C.white }}>Soweto Safe Haven</div>
          </div>
          <span className={`chip ${accepting?'chip-green':'chip-red'}`}>
            {accepting?'● ACCEPTING':'● CLOSED'}
          </span>
        </div>
      </div>

      <div style={{ padding:'0 20px', display:'flex', flexDirection:'column', gap:16 }}>

        {/* Accepting referrals toggle */}
        <div className="card" style={{ padding:'18px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color: C.white }}>Accepting Referrals</div>
              <div style={{ fontSize:11, color: C.grey, marginTop:2 }}>Toggle off if shelter is full or closed</div>
            </div>
            <button className={`toggle ${accepting?'on':'off'}`} onClick={()=>setAccepting(a=>!a)} />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color: C.grey, marginBottom:6 }}>Available Beds Right Now *</div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <button onClick={()=>setBeds(b=>Math.max(0,b-1))} style={{ width:36, height:36, borderRadius:10, background: C.blackSoft, border:`1px solid ${C.border}`, color: C.white, fontSize:20, cursor:'pointer', fontFamily:'DM Sans' }}>−</button>
                <div style={{ fontFamily:'DM Mono', fontSize:36, fontWeight:800, color: beds>0?C.green:C.red, flex:1, textAlign:'center' }}>{beds}</div>
                <button onClick={()=>setBeds(b=>b+1)} style={{ width:36, height:36, borderRadius:10, background: C.blackSoft, border:`1px solid ${C.border}`, color: C.white, fontSize:20, cursor:'pointer', fontFamily:'DM Sans' }}>+</button>
              </div>
              <div style={{ fontSize:10, color: C.grey, textAlign:'center', marginTop:4 }}>of 20 total capacity</div>
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop:14, padding:12, fontSize:13 }}>
            💾 Update Capacity
          </button>
        </div>

        {/* Weekly reminder */}
        <div style={{ background: C.amberBg, border:`1px solid rgba(255,179,0,0.3)`, borderRadius:14, padding:'14px 16px', display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ fontSize:24 }}>⏰</span>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color: C.amber }}>Monday Reminder</div>
            <div style={{ fontSize:11, color: C.greyLight }}>Update bed count every Monday by 08:00</div>
          </div>
        </div>

        {/* Disability support */}
        <div>
          <div className="section-title">Disability Support Offered</div>
          <div className="card" style={{ padding:'0 16px' }}>
            {[
              { label:'Wheelchair Access', active:true },
              { label:'Visual Impairment', active:false },
              { label:'Hearing Impairment', active:false },
              { label:'Intellectual Disability', active:false },
              { label:'Mental Health / Psychiatric', active:true },
            ].map(item => (
              <div key={item.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:13, color: C.white }}>{item.label}</span>
                <span className={`chip ${item.active?'chip-green':'chip-grey'}`}>{item.active?'✓ Yes':'✗ No'}</span>
              </div>
            ))}
          </div>
          <button className="btn-secondary" style={{ marginTop:10, padding:12, fontSize:13 }} onClick={()=>onNavigate('shelter-profile')}>
            ✏️ Edit Full Profile
          </button>
        </div>

        {/* Recent referrals received */}
        <div>
          <div className="section-title">Referrals Received</div>
          {[
            { id:'SL-JHB-2026-0013', time:'Today 09:15', status:'Incoming', risk:'HIGH' },
            { id:'SL-JHB-2026-0009', time:'Yesterday', status:'Accepted', risk:'MEDIUM' },
            { id:'SL-JHB-2026-0006', time:'2 days ago', status:'Accepted', risk:'LOW' },
          ].map((r,i)=>(
            <div key={i} className="card" style={{ padding:'12px 16px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:12, fontFamily:'DM Mono', color: C.white, fontWeight:700 }}>{r.id}</div>
                <div style={{ fontSize:11, color: C.grey, marginTop:2 }}>{r.time}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end' }}>
                <span className={`chip ${r.status==='Incoming'?'chip-red':r.status==='Accepted'?'chip-green':'chip-grey'}`}>{r.status}</span>
                <span className={`chip ${r.risk==='HIGH'?'chip-red':r.risk==='MEDIUM'?'chip-amber':'chip-grey'}`}>{r.risk}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ADMIN DASHBOARD ─────────────────────────────────────────────
function AdminDashboard({ onNavigate }) {
  return (
    <div className="screen slide-up" style={{ padding:'0 0 20px' }}>
      <div className="header">
        <div className="header-top">
          <div>
            <div style={{ fontSize:12, color: C.grey }}>Admin Portal</div>
            <div style={{ fontSize:17, fontWeight:700, color: C.white }}>Pathway Impact Labs</div>
          </div>
          <span className="chip chip-green">● LIVE</span>
        </div>
        <div style={{ fontSize:11, color: C.grey, marginTop:2 }}>Johannesburg South Pilot · v2.0</div>
      </div>

      <div style={{ padding:'0 20px', display:'flex', flexDirection:'column', gap:16 }}>

        {/* Key metrics */}
        <div>
          <div className="section-title">Today's Overview</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { label:'Total Cases', value:'147', sub:'All time', color: C.white },
              { label:'Match Rate', value:'86%', sub:'This month', color: C.green },
              { label:'Avg Response', value:'47s', sub:'Match time', color: C.red },
              { label:'Active Shelters', value:'5/5', sub:'Online', color: C.green },
            ].map(s=>(
              <div key={s.label} className="stat-card">
                <div style={{ fontFamily:'DM Mono', fontSize:30, fontWeight:800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize:12, fontWeight:700, color: C.white, marginTop:4 }}>{s.label}</div>
                <div style={{ fontSize:10, color: C.grey }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shelter status */}
        <div>
          <div className="section-title">Shelter Network Status</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              { name:'Soweto Safe Haven', beds:8, total:20, accepting:true },
              { name:'JHB South Women\'s Refuge', beds:12, total:25, accepting:true },
              { name:'Lenasia Family Crisis Centre', beds:0, total:15, accepting:false },
              { name:'Ennerdale Disability Shelter', beds:10, total:18, accepting:true },
              { name:'Eldorado Park Safe House', beds:5, total:10, accepting:true },
            ].map((s,i)=>(
              <div key={i} className="card" style={{ padding:'14px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div style={{ fontSize:13, fontWeight:700, color: C.white, flex:1, marginRight:8 }}>{s.name}</div>
                  <span className={`chip ${s.accepting?'chip-green':'chip-red'}`} style={{ flexShrink:0 }}>{s.accepting?'● Open':'● Full'}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div className="progress-bar" style={{ flex:1 }}>
                    <div className="progress-fill" style={{ width:`${(s.beds/s.total)*100}%`, background: s.beds===0?C.red:C.green }} />
                  </div>
                  <span style={{ fontFamily:'DM Mono', fontSize:13, color: s.beds===0?C.red:C.green, fontWeight:700, flexShrink:0 }}>{s.beds}/{s.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VFR performance */}
        <div>
          <div className="section-title">VFR Station Activity</div>
          {[
            { name:'JHB South VFR 1', cases:8, matched:7, rate:'88%' },
            { name:'JHB South VFR 2', cases:5, matched:4, rate:'80%' },
          ].map((v,i)=>(
            <div key={i} className="card" style={{ padding:'14px 16px', marginBottom:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <div style={{ fontSize:13, fontWeight:700, color: C.white }}>{v.name}</div>
                <span style={{ fontFamily:'DM Mono', fontSize:16, fontWeight:800, color: C.green }}>{v.rate}</span>
              </div>
              <div style={{ display:'flex', gap:16 }}>
                <div style={{ fontSize:11, color: C.grey }}>Cases today: <span style={{ color: C.white, fontWeight:700 }}>{v.cases}</span></div>
                <div style={{ fontSize:11, color: C.grey }}>Matched: <span style={{ color: C.green, fontWeight:700 }}>{v.matched}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div>
          <div className="section-title">Quick Actions</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              ['📋', 'View Full Case Log', ()=>onNavigate('cases')],
              ['🏠', 'Manage Shelter Database', ()=>{}],
              ['👮', 'Manage VFR Users', ()=>{}],
              ['📊', 'Download Monthly Report', ()=>{}],
            ].map(([icon, label, action],i)=>(
              <button key={i} onClick={action} className="btn-secondary" style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:12, textAlign:'left', justifyContent:'flex-start' }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                <span>{label}</span>
                <span style={{ marginLeft:'auto', color: C.greyMid }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CASE LOG ────────────────────────────────────────────────────
function CaseLog({ onNavigate }) {
  const [filter, setFilter] = useState('ALL');
  const cases = [
    { id:'SL-JHB-2026-0013', date:'Today 09:15', vfr:'VFR 1', outcome:'MATCHED', risk:'HIGH', shelter:'Soweto Safe Haven', disability:true },
    { id:'SL-JHB-2026-0012', date:'Today 08:47', vfr:'VFR 2', outcome:'MATCHED', risk:'MEDIUM', shelter:'JHB South Refuge', disability:false },
    { id:'SL-JHB-2026-0011', date:'Yesterday', vfr:'VFR 1', outcome:'MATCHED', risk:'HIGH', shelter:'Ennerdale Shelter', disability:true },
    { id:'SL-JHB-2026-0010', date:'Yesterday', vfr:'VFR 1', outcome:'NO MATCH', risk:'HIGH', shelter:'—', disability:true },
    { id:'SL-JHB-2026-0009', date:'2 days ago', vfr:'VFR 2', outcome:'MATCHED', risk:'LOW', shelter:'Soweto Safe Haven', disability:false },
    { id:'SL-JHB-2026-0008', date:'2 days ago', vfr:'VFR 1', outcome:'MATCHED', risk:'MEDIUM', shelter:'Lenasia Centre', disability:false },
    { id:'SL-JHB-2026-0007', date:'3 days ago', vfr:'VFR 2', outcome:'NO MATCH', risk:'MEDIUM', shelter:'—', disability:false },
  ];

  const filtered = filter==='ALL' ? cases : cases.filter(c=>c.outcome.replace(' ','_')===filter||c.outcome===filter);

  return (
    <div className="screen slide-up" style={{ padding:'0 0 20px' }}>
      <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:`1px solid ${C.border}` }}>
        <button className="back-btn" onClick={()=>onNavigate('admin-dashboard')}>←</button>
        <div style={{ fontSize:15, fontWeight:700, color: C.white }}>Case Log</div>
        <span className="chip chip-grey" style={{ marginLeft:'auto' }}>147 total</span>
      </div>

      <div style={{ padding:'16px 20px 8px' }}>
        <div style={{ display:'flex', gap:6 }}>
          {['ALL','MATCHED','NO MATCH'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              flex:1, padding:'8px 4px', borderRadius:10, fontSize:10, fontWeight:700,
              letterSpacing:0.5, cursor:'pointer', fontFamily:'DM Sans',
              background: filter===f?C.red:C.blackSoft,
              color: filter===f?C.white:C.grey,
              border: filter===f?`1px solid ${C.red}`:`1px solid ${C.border}`,
              transition:'all 0.2s'
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:'0 20px' }}>
        {filtered.map((c,i)=>(
          <div key={i} className="card" style={{ padding:'14px 16px', marginBottom:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <div>
                <div style={{ fontFamily:'DM Mono', fontSize:13, fontWeight:700, color: C.white }}>{c.id}</div>
                <div style={{ fontSize:11, color: C.grey, marginTop:2 }}>{c.date} · {c.vfr}</div>
              </div>
              <span className={`chip ${c.outcome==='MATCHED'?'chip-green':'chip-red'}`}>
                {c.outcome==='MATCHED'?'✓ MATCHED':'✗ NO MATCH'}
              </span>
            </div>
            <div className="divider" style={{ margin:'8px 0' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:11, color: C.grey }}>Shelter</div>
                <div style={{ fontSize:12, color: C.white, fontWeight:600 }}>{c.shelter}</div>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                {c.disability && <span className="chip chip-red" style={{ fontSize:9 }}>♿</span>}
                <span className={`chip ${c.risk==='HIGH'?'chip-red':c.risk==='MEDIUM'?'chip-amber':'chip-grey'}`} style={{ fontSize:9 }}>{c.risk}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('login');
  const [role, setRole] = useState('vfr');

  const navigate = (s) => setScreen(s);
  const handleLogin = (r) => { setRole(r); navigate(r===`vfr`?'vfr-dashboard':r===`shelter`?'shelter-dashboard':'admin-dashboard'); };

  const navItems = {
    vfr: [
      { icon:'🏠', label:'Home', screen:'vfr-dashboard' },
      { icon:'⚡', label:'Request', screen:'vfr-form' },
      { icon:'📋', label:'Cases', screen:'cases' },
    ],
    shelter: [
      { icon:'🏠', label:'Dashboard', screen:'shelter-dashboard' },
      { icon:'✏️', label:'Profile', screen:'shelter-profile' },
      { icon:'📋', label:'Referrals', screen:'cases' },
    ],
    admin: [
      { icon:'📊', label:'Dashboard', screen:'admin-dashboard' },
      { icon:'📋', label:'Cases', screen:'cases' },
      { icon:'🏠', label:'Shelters', screen:'shelter-dashboard' },
    ],
  };

  const showNav = screen !== 'login' && screen !== 'match-result';
  const currentNav = navItems[role] || navItems.vfr;

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight:'100vh', background:'#050505', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', flexDirection:'column', gap:24 }}>

        {/* App title above phone */}
        <div style={{ textAlign:'center' }}>
          <img src={LOGO_URI} alt="SafeLink SA" style={{ width:120, height:'auto', display:'block', margin:'0 auto', filter:'drop-shadow(0 2px 12px rgba(208,2,27,0.4)) brightness(1.1)' }} />
          <div style={{ fontSize:11, color:'#555', letterSpacing:3, marginTop:8 }}>INTERACTIVE PROTOTYPE · v2.0</div>
        </div>

        {/* Phone frame */}
        <div className="phone">
          <div className="notch" />
          <div className="status-bar">
            <span style={{ fontSize:12, fontWeight:700, color:'white', fontFamily:'DM Mono' }}>9:41</span>
            <span style={{ fontSize:12, color:'white' }}>●●●●  WiFi  🔋</span>
          </div>

          {screen === 'login'          && <LoginScreen onLogin={handleLogin} />}
          {screen === 'vfr-dashboard'  && <VFRDashboard onNavigate={navigate} />}
          {screen === 'vfr-form'       && <VFRForm onNavigate={navigate} onSubmit={()=>{}} />}
          {screen === 'match-result'   && <MatchResult onNavigate={navigate} />}
          {screen === 'shelter-dashboard' && <ShelterDashboard onNavigate={navigate} />}
          {screen === 'admin-dashboard'   && <AdminDashboard onNavigate={navigate} />}
          {screen === 'cases'          && <CaseLog onNavigate={navigate} />}

          {showNav && (
            <div className="nav-bar">
              {currentNav.map(item => (
                <button key={item.screen} className={`nav-item ${screen===item.screen?'active':''}`} onClick={()=>navigate(item.screen)}>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Screen labels */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
          {[
            ['login','🔐 Login'],
            ['vfr-dashboard','👮 VFR Home'],
            ['vfr-form','📝 Request Form'],
            ['match-result','⚡ Match Result'],
            ['shelter-dashboard','🏠 Shelter View'],
            ['admin-dashboard','📊 Admin View'],
            ['cases','📋 Case Log'],
          ].map(([s, label])=>(
            <button key={s} onClick={()=>setScreen(s)} style={{
              padding:'6px 14px', borderRadius:20, fontSize:11, fontWeight:600,
              cursor:'pointer', fontFamily:'DM Sans', letterSpacing:0.3,
              background: screen===s?C.red:'#1A1A1A',
              color: screen===s?'white':'#666',
              border: screen===s?`1px solid ${C.red}`:'1px solid #2A2A2A',
              transition:'all 0.2s'
            }}>{label}</button>
          ))}
        </div>

        {/* Trademark / Credit */}
        <div style={{
          borderTop: '1px solid #1E1E1E',
          paddingTop: 20,
          width: '100%',
          maxWidth: 480,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            <div style={{
              width: 1, height: 16, background: '#D0021B', opacity: 0.6
            }} />
            <span style={{
              fontFamily: 'DM Mono', fontSize: 10, color: '#D0021B',
              letterSpacing: 3, fontWeight: 500
            }}>PROPRIETARY SOFTWARE</span>
            <div style={{
              width: 1, height: 16, background: '#D0021B', opacity: 0.6
            }} />
          </div>
          <div style={{
            fontSize: 12, color: '#666', fontFamily: 'DM Sans', fontWeight: 400, letterSpacing: 0.3
          }}>
            Developed by <span style={{ color: '#fff', fontWeight: 600 }}>Simone Jonkers</span>
          </div>
          <div style={{
            fontSize: 11, color: '#444', fontFamily: 'DM Sans'
          }}>
            <span style={{ color: '#D0021B', fontWeight: 600 }}>Pathway Impact Labs</span>
            <span style={{ color: '#333', margin: '0 6px' }}>·</span>
            <span style={{ color: '#444' }}>A division of Pathway Films</span>
          </div>
          <div style={{
            fontSize: 10, color: '#333', fontFamily: 'DM Mono', letterSpacing: 1, marginTop: 2
          }}>
            © {new Date().getFullYear()} ALL RIGHTS RESERVED
          </div>
        </div>

      </div>
    </>
  );
}
