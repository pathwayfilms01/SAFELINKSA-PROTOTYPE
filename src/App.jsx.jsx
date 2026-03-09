import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import LOGO_URI from "./safelink_logo.jpeg";

// ── Supabase ────────────────────────────────────────────────────
const SUPABASE_URL = "https://jnhuawinagsjznuwdnft.supabase.co";
const SUPABASE_KEY = "sb_publishable_mOzgbag3biuDonPPnK0Kaw_zJV_v_Y7";
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Brand tokens ────────────────────────────────────────────────
const C = {
  red: "#D0021B", redDark: "#A50115", redGlow: "rgba(208,2,27,0.25)",
  black: "#0A0A0A", blackMid: "#141414", blackSoft: "#1E1E1E",
  card: "#1A1A1A", border: "#2A2A2A",
  white: "#FFFFFF", offWhite: "#F5F5F5",
  grey: "#888888", greyMid: "#555555", greyLight: "#CCCCCC",
  green: "#00C853", greenBg: "rgba(0,200,83,0.12)",
  amber: "#FFB300", amberBg: "rgba(255,179,0,0.12)",
  blue: "#2196F3", blueBg: "rgba(33,150,243,0.12)",
};

// ── Styles ──────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0A0A0A;font-family:'DM Sans',sans-serif;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:#141414;} ::-webkit-scrollbar-thumb{background:#D0021B;border-radius:2px;}
  .phone-shell{
    position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
    background:radial-gradient(ellipse at 50% 30%,rgba(208,2,27,0.08) 0%,#0A0A0A 70%);
  }
  @media(max-width:500px){
    .phone-shell{background:#0A0A0A;}
    .phone-frame{width:100%!important;height:100%!important;border-radius:0!important;border:none!important;box-shadow:none!important;}
  }
  .phone-frame{
    width:390px;height:844px;background:#141414;border-radius:44px;
    border:2px solid #2A2A2A;box-shadow:0 0 0 8px #111,0 40px 80px rgba(0,0,0,0.8),0 0 60px rgba(208,2,27,0.1);
    overflow:hidden;position:relative;display:flex;flex-direction:column;
  }
  .screen{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;}
  .btn{border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;transition:all 0.2s;border-radius:12px;}
  .btn-red{background:#D0021B;color:#fff;} .btn-red:hover{background:#A50115;}
  .btn-ghost{background:transparent;color:#D0021B;border:1.5px solid #D0021B;} .btn-ghost:hover{background:rgba(208,2,27,0.1);}
  .btn-dark{background:#1E1E1E;color:#fff;border:1.5px solid #2A2A2A;} .btn-dark:hover{background:#252525;}
  .input{width:100%;padding:14px 16px;background:#1E1E1E;border:1.5px solid #2A2A2A;border-radius:12px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color 0.2s;}
  .input:focus{border-color:#D0021B;}
  .input::placeholder{color:#555;}
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
`;

// ── Helpers ─────────────────────────────────────────────────────
function genCaseId() {
  const y = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `SL-JHB-${y}-${n}`;
}

async function hashPassword(pw) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Top Nav ─────────────────────────────────────────────────────
function TopBar({ user, onLogout }) {
  return (
    <div style={{ padding: "16px 20px 12px", background: C.black, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <img src={LOGO_URI} alt="SafeLink SA" style={{ height: 32, objectFit: "contain" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: C.grey }}>{user?.role?.replace("_", " ").toUpperCase()}</div>
          <div style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>{user?.full_name?.split(" ")[0]}</div>
        </div>
        <button className="btn btn-dark" style={{ padding: "6px 12px", fontSize: 12 }} onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

// ── Auth Screen ─────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", organisation: "", role: "vfr", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleLogin() {
    setError(""); setLoading(true);
    try {
      const hash = await hashPassword(form.password);
      const { data, error: e } = await sb.from("users").select("*").eq("email", form.email.toLowerCase()).eq("password_hash", hash).single();
      if (e || !data) { setError("Invalid email or password."); setLoading(false); return; }
      onAuth(data);
    } catch { setError("Login failed. Please try again."); setLoading(false); }
  }

  async function handleRegister() {
    setError("");
    if (!form.full_name || !form.email || !form.phone || !form.organisation || !form.password) { setError("Please fill in all fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const hash = await hashPassword(form.password);
      const { data: existing } = await sb.from("users").select("id").eq("email", form.email.toLowerCase()).single();
      if (existing) { setError("An account with this email already exists."); setLoading(false); return; }
      const { data, error: e } = await sb.from("users").insert([{
        full_name: form.full_name, email: form.email.toLowerCase(),
        phone: form.phone, organisation: form.organisation,
        role: form.role, password_hash: hash
      }]).select().single();
      if (e) { setError("Registration failed. Please try again."); setLoading(false); return; }
      onAuth(data);
    } catch { setError("Registration failed. Please try again."); setLoading(false); }
  }

  return (
    <div className="screen fade-in" style={{ background: `radial-gradient(ellipse at 50% 0%, rgba(208,2,27,0.15) 0%, ${C.black} 60%)`, minHeight: "100%", padding: "40px 24px 32px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <img src={LOGO_URI} alt="SafeLink SA" style={{ height: 52, objectFit: "contain", marginBottom: 16 }} />
        <div style={{ fontFamily: "Bebas Neue", fontSize: 28, color: C.white, letterSpacing: 2 }}>SAFELINK SA</div>
        <div style={{ fontSize: 13, color: C.grey, marginTop: 4 }}>GBV Shelter Referral System</div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", background: C.blackSoft, borderRadius: 12, padding: 4, marginBottom: 24 }}>
        {["login", "register"].map(m => (
          <button key={m} className="btn" onClick={() => { setMode(m); setError(""); }}
            style={{ flex: 1, padding: "10px", fontSize: 14, borderRadius: 10, background: mode === m ? C.red : "transparent", color: mode === m ? C.white : C.grey }}>
            {m === "login" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: "rgba(208,2,27,0.12)", border: `1px solid ${C.red}`, borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#ff6b6b" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mode === "register" && (
          <>
            <input className="input" placeholder="Full Name" value={form.full_name} onChange={e => set("full_name", e.target.value)} />
            <input className="input" placeholder="Phone Number" value={form.phone} onChange={e => set("phone", e.target.value)} />
            <input className="input" placeholder="Organisation / Station Name" value={form.organisation} onChange={e => set("organisation", e.target.value)} />
            <select className="select" value={form.role} onChange={e => set("role", e.target.value)}>
              <option value="vfr">VFR Member</option>
              <option value="social_worker">Social Worker</option>
              <option value="shelter">Shelter Coordinator</option>
            </select>
          </>
        )}
        <input className="input" placeholder="Email Address" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={e => set("password", e.target.value)} />
        {mode === "register" && (
          <input className="input" placeholder="Confirm Password" type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)} />
        )}

        <button className="btn btn-red" style={{ padding: "16px", fontSize: 15, marginTop: 8 }}
          onClick={mode === "login" ? handleLogin : handleRegister} disabled={loading}>
          {loading ? "⏳ Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: C.grey, lineHeight: 1.6 }}>
        Protected by POPIA · All data encrypted{"\n"}
        <span style={{ color: C.greyMid }}>Pathway Impact Labs · © {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}

// ── VFR / Social Worker Dashboard ───────────────────────────────
function ReferralDashboard({ user, onLogout }) {
  const [screen, setScreen] = useState("home"); // home | form | result | log
  const [cases, setCases] = useState([]);
  const [matchResult, setMatchResult] = useState(null);
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    loadCases();
    loadShelters();
  }, []);

  async function loadCases() {
    const { data } = await sb.from("cases").select("*").eq("submitted_by", user.id).order("created_at", { ascending: false });
    setCases(data || []);
  }

  async function loadShelters() {
    const { data } = await sb.from("shelters").select("*").eq("accepting_referrals", true).eq("active", true);
    setShelters(data || []);
  }

  const activeCases = cases.filter(c => c.status === "OPEN").length;
  const matchedCases = cases.filter(c => c.outcome === "MATCHED").length;

  if (screen === "form") return <ReferralForm user={user} shelters={shelters} onBack={() => setScreen("home")} onMatch={r => { setMatchResult(r); setScreen("result"); loadCases(); }} />;
  if (screen === "result") return <MatchResult result={matchResult} onDone={() => setScreen("home")} />;
  if (screen === "log") return <CaseLog cases={cases} onBack={() => setScreen("home")} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar user={user} onLogout={onLogout} />
      <div className="screen fade-in" style={{ padding: "20px 20px 100px" }}>

        {/* Hero */}
        <div style={{ background: `linear-gradient(135deg, ${C.redDark}, ${C.red})`, borderRadius: 20, padding: "20px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Welcome back</div>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 24, color: C.white, letterSpacing: 1 }}>{user.full_name}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{user.organisation}</div>
          <button className="btn" onClick={() => setScreen("form")}
            style={{ marginTop: 16, padding: "12px 24px", background: "rgba(255,255,255,0.15)", color: C.white, fontSize: 14, borderRadius: 12, backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.2)" }}>
            + New Shelter Request
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total Cases", value: cases.length, color: C.white },
            { label: "Matched", value: matchedCases, color: C.green },
            { label: "Open", value: activeCases, color: C.amber },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: "center", padding: "14px 8px" }}>
              <div style={{ fontSize: 24, fontFamily: "Bebas Neue", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.grey, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Shelter availability */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: C.grey, marginBottom: 12, fontWeight: 600, letterSpacing: 0.5 }}>SHELTER AVAILABILITY</div>
          {shelters.slice(0, 3).map(s => (
            <div key={s.id} className="card" style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>{s.shelter_name}</div>
                <div style={{ fontSize: 12, color: C.grey }}>{s.area}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontFamily: "Bebas Neue", color: s.available_beds > 0 ? C.green : C.red }}>{s.available_beds}</div>
                <div style={{ fontSize: 11, color: C.grey }}>beds</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent cases */}
        {cases.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: C.grey, fontWeight: 600, letterSpacing: 0.5 }}>RECENT CASES</div>
              <button className="btn" style={{ fontSize: 12, color: C.red, padding: "4px 8px", background: "transparent" }} onClick={() => setScreen("log")}>View all</button>
            </div>
            {cases.slice(0, 3).map(c => (
              <div key={c.id} className="card" style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontFamily: "DM Mono", color: C.white }}>{c.case_id}</div>
                  <div style={{ fontSize: 12, color: C.grey }}>{new Date(c.created_at).toLocaleDateString("en-ZA")}</div>
                </div>
                <span className="tag" style={{ background: c.outcome === "MATCHED" ? C.greenBg : C.amberBg, color: c.outcome === "MATCHED" ? C.green : C.amber }}>
                  {c.outcome || "PENDING"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.blackMid, borderTop: `1px solid ${C.border}`, display: "flex", padding: "12px 0 20px" }}>
        {[{ icon: "🏠", label: "Home", s: "home" }, { icon: "➕", label: "Request", s: "form" }, { icon: "📋", label: "Cases", s: "log" }].map(n => (
          <button key={n.s} className="btn" onClick={() => setScreen(n.s)}
            style={{ flex: 1, background: "transparent", color: screen === n.s ? C.red : C.grey, fontSize: 10, padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>{n.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Referral Form ────────────────────────────────────────────────
function ReferralForm({ user, shelters, onBack, onMatch }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    survivor_gender: "", survivor_age: "", has_children: false, num_children: 0,
    disability_needs: [], case_type: "", safety_risk: "Medium", location_area: "",
    additional_notes: ""
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleDisability = d => set("disability_needs", form.disability_needs.includes(d) ? form.disability_needs.filter(x => x !== d) : [...form.disability_needs, d]);

  async function submit() {
    setLoading(true);
    const caseId = genCaseId();

    // Matching logic
    let matches = shelters.filter(s => s.available_beds > 0 && s.accepting_referrals);
    if (form.survivor_gender === "Male") matches = matches.filter(s => s.gender_served === "All" || s.gender_served === "Male");
    else if (form.survivor_gender === "Female") matches = matches.filter(s => s.gender_served === "All" || s.gender_served === "Female");
    if (form.has_children) matches = matches.filter(s => s.accepts_children);
    if (form.disability_needs.includes("Wheelchair")) matches = matches.filter(s => s.wheelchair);
    if (form.disability_needs.includes("Mental Health")) matches = matches.filter(s => s.mental_health);

    const topMatch = matches[0] || null;
    const outcome = topMatch ? "MATCHED" : "NO MATCH";

    await sb.from("cases").insert([{
      case_id: caseId, submitted_by: user.id,
      submitter_name: user.full_name, organisation: user.organisation,
      survivor_gender: form.survivor_gender, survivor_age: parseInt(form.survivor_age) || null,
      has_children: form.has_children, num_children: form.num_children,
      disability_needs: form.disability_needs.join(","),
      case_type: form.case_type, safety_risk: form.safety_risk,
      location_area: form.location_area, outcome,
      matched_shelter: topMatch?.shelter_name || null,
      matched_contact: topMatch?.primary_contact || null,
      status: "OPEN"
    }]);

    if (topMatch) {
      await sb.from("shelters").update({ available_beds: topMatch.available_beds - 1 }).eq("id", topMatch.id);
    }

    onMatch({ caseId, outcome, shelter: topMatch, allMatches: matches });
  }

  const disabilities = ["Wheelchair", "Visual Impairment", "Hearing Impairment", "Intellectual Disability", "Mental Health"];
  const caseTypes = ["Domestic Violence", "Sexual Assault", "Human Trafficking", "Stalking", "Child Abuse", "Other"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 20px", background: C.black, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn btn-dark" style={{ padding: "8px 12px", fontSize: 13 }} onClick={onBack}>← Back</button>
        <div style={{ fontFamily: "Bebas Neue", fontSize: 20, color: C.white, letterSpacing: 1 }}>NEW SHELTER REQUEST</div>
      </div>

      {/* Progress */}
      <div style={{ padding: "12px 20px", background: C.blackMid }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? C.red : C.border, transition: "background 0.3s" }} />
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.grey, marginTop: 8 }}>
          Step {step} of 3 — {["Survivor Info", "Case Details", "Location & Safety"][step - 1]}
        </div>
      </div>

      <div className="screen fade-in" style={{ padding: "20px", flex: 1 }}>
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 13, color: C.grey, fontWeight: 600, marginBottom: 4 }}>SURVIVOR INFORMATION</div>
            <div>
              <div style={{ fontSize: 13, color: C.greyLight, marginBottom: 8 }}>Gender</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Female", "Male", "Other"].map(g => (
                  <button key={g} className="btn" onClick={() => set("survivor_gender", g)}
                    style={{ flex: 1, padding: "12px 8px", fontSize: 13, background: form.survivor_gender === g ? C.red : C.blackSoft, color: form.survivor_gender === g ? C.white : C.grey, border: `1.5px solid ${form.survivor_gender === g ? C.red : C.border}`, borderRadius: 12 }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.greyLight, marginBottom: 8 }}>Age (approximate)</div>
              <input className="input" placeholder="e.g. 28" type="number" value={form.survivor_age} onChange={e => set("survivor_age", e.target.value)} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.greyLight, marginBottom: 8 }}>Children accompanying?</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ v: false, l: "No" }, { v: true, l: "Yes" }].map(o => (
                  <button key={o.l} className="btn" onClick={() => set("has_children", o.v)}
                    style={{ flex: 1, padding: "12px 8px", fontSize: 13, background: form.has_children === o.v ? C.red : C.blackSoft, color: form.has_children === o.v ? C.white : C.grey, border: `1.5px solid ${form.has_children === o.v ? C.red : C.border}`, borderRadius: 12 }}>
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
            {form.has_children && (
              <div>
                <div style={{ fontSize: 13, color: C.greyLight, marginBottom: 8 }}>Number of children</div>
                <input className="input" placeholder="e.g. 2" type="number" value={form.num_children} onChange={e => set("num_children", parseInt(e.target.value) || 0)} />
              </div>
            )}
            <div>
              <div style={{ fontSize: 13, color: C.greyLight, marginBottom: 8 }}>Disability / Support Needs</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {disabilities.map(d => (
                  <button key={d} className="btn" onClick={() => toggleDisability(d)}
                    style={{ padding: "8px 14px", fontSize: 12, background: form.disability_needs.includes(d) ? C.red : C.blackSoft, color: form.disability_needs.includes(d) ? C.white : C.grey, border: `1.5px solid ${form.disability_needs.includes(d) ? C.red : C.border}`, borderRadius: 20 }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 13, color: C.grey, fontWeight: 600, marginBottom: 4 }}>CASE DETAILS</div>
            <div>
              <div style={{ fontSize: 13, color: C.greyLight, marginBottom: 8 }}>Type of Case</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {caseTypes.map(t => (
                  <button key={t} className="btn" onClick={() => set("case_type", t)}
                    style={{ padding: "12px 16px", fontSize: 13, textAlign: "left", background: form.case_type === t ? "rgba(208,2,27,0.15)" : C.blackSoft, color: form.case_type === t ? C.red : C.greyLight, border: `1.5px solid ${form.case_type === t ? C.red : C.border}`, borderRadius: 12 }}>
                    {form.case_type === t ? "● " : "○ "}{t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 13, color: C.grey, fontWeight: 600, marginBottom: 4 }}>LOCATION & SAFETY</div>
            <div>
              <div style={{ fontSize: 13, color: C.greyLight, marginBottom: 8 }}>Current Area / Location</div>
              <input className="input" placeholder="e.g. Soweto, Lenasia, JHB South" value={form.location_area} onChange={e => set("location_area", e.target.value)} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.greyLight, marginBottom: 8 }}>Safety Risk Level</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Low", "Medium", "High", "Critical"].map(r => (
                  <button key={r} className="btn" onClick={() => set("safety_risk", r)}
                    style={{ flex: 1, padding: "10px 4px", fontSize: 12, background: form.safety_risk === r ? C.red : C.blackSoft, color: form.safety_risk === r ? C.white : C.grey, border: `1.5px solid ${form.safety_risk === r ? C.red : C.border}`, borderRadius: 12 }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.greyLight, marginBottom: 8 }}>Additional Notes (optional)</div>
              <textarea className="input" placeholder="Any additional context..." value={form.additional_notes} onChange={e => set("additional_notes", e.target.value)}
                style={{ minHeight: 80, resize: "none" }} />
            </div>

            {/* POPIA notice */}
            <div style={{ background: C.amberBg, border: `1px solid rgba(255,179,0,0.3)`, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, color: C.amber, fontWeight: 600, marginBottom: 4 }}>⚠ POPIA NOTICE</div>
              <div style={{ fontSize: 11, color: C.greyLight, lineHeight: 1.5 }}>No survivor names or ID numbers are collected. This referral is anonymised and compliant with POPIA regulations.</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 20px", background: C.blackMid, borderTop: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
        {step > 1 && <button className="btn btn-dark" style={{ flex: 1, padding: "14px" }} onClick={() => setStep(s => s - 1)}>Back</button>}
        {step < 3
          ? <button className="btn btn-red" style={{ flex: 2, padding: "14px", fontSize: 15 }} onClick={() => setStep(s => s + 1)}>Next →</button>
          : <button className="btn btn-red" style={{ flex: 2, padding: "14px", fontSize: 15 }} onClick={submit} disabled={loading}>
              {loading ? "⏳ Finding match..." : "🔍 Find Shelter Match"}
            </button>
        }
      </div>
    </div>
  );
}

// ── Match Result ─────────────────────────────────────────────────
function MatchResult({ result, onDone }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 800); }, []);
  const matched = result.outcome === "MATCHED";

  return (
    <div className="screen fade-in" style={{ background: matched ? `radial-gradient(ellipse at 50% 0%, rgba(0,200,83,0.1) 0%, ${C.black} 60%)` : `radial-gradient(ellipse at 50% 0%, rgba(208,2,27,0.1) 0%, ${C.black} 60%)`, minHeight: "100%", padding: "40px 24px 32px" }}>

      {!show ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 16 }}>
          <div style={{ width: 60, height: 60, border: `3px solid ${C.red}`, borderTopColor: "transparent", borderRadius: "50%" }} className="spin" />
          <div style={{ color: C.grey, fontSize: 14 }}>Finding best match...</div>
        </div>
      ) : (
        <>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>{matched ? "✅" : "⚠️"}</div>
            <div style={{ fontFamily: "Bebas Neue", fontSize: 32, color: matched ? C.green : C.amber, letterSpacing: 2 }}>
              {matched ? "SHELTER MATCHED" : "NO MATCH FOUND"}
            </div>
            <div style={{ fontFamily: "DM Mono", fontSize: 13, color: C.grey, marginTop: 8 }}>{result.caseId}</div>
          </div>

          {matched && result.shelter && (
            <div className="card" style={{ marginBottom: 16, border: `1px solid ${C.green}` }}>
              <div style={{ fontSize: 11, color: C.green, fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>TOP MATCH</div>
              <div style={{ fontSize: 18, color: C.white, fontWeight: 700, marginBottom: 4 }}>{result.shelter.shelter_name}</div>
              <div style={{ fontSize: 13, color: C.grey, marginBottom: 16 }}>{result.shelter.area}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                <div style={{ background: C.blackSoft, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: C.grey }}>Available Beds</div>
                  <div style={{ fontSize: 20, fontFamily: "Bebas Neue", color: C.green }}>{result.shelter.available_beds}</div>
                </div>
                <div style={{ background: C.blackSoft, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: C.grey }}>Intake Hours</div>
                  <div style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>{result.shelter.intake_hours}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 13, color: C.greyLight }}>📞 {result.shelter.primary_contact}</div>
                <div style={{ fontSize: 13, color: C.greyLight }}>💬 WhatsApp: {result.shelter.whatsapp}</div>
                <div style={{ fontSize: 13, color: C.greyLight }}>🌙 After hours: {result.shelter.after_hours}</div>
              </div>
            </div>
          )}

          {!matched && (
            <div className="card" style={{ marginBottom: 16, border: `1px solid ${C.amber}` }}>
              <div style={{ fontSize: 14, color: C.amber, fontWeight: 600, marginBottom: 8 }}>No shelters currently match this profile</div>
              <div style={{ fontSize: 13, color: C.greyLight, lineHeight: 1.6 }}>Contact your supervisor or try expanding search criteria. The case has been logged for follow-up.</div>
            </div>
          )}

          <button className="btn btn-red" style={{ width: "100%", padding: "16px", fontSize: 15 }} onClick={onDone}>
            Return to Dashboard
          </button>
        </>
      )}
    </div>
  );
}

// ── Case Log ─────────────────────────────────────────────────────
function CaseLog({ cases, onBack }) {
  const [filter, setFilter] = useState("ALL");
  const filtered = filter === "ALL" ? cases : cases.filter(c => c.outcome === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 20px", background: C.black, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn btn-dark" style={{ padding: "8px 12px", fontSize: 13 }} onClick={onBack}>← Back</button>
        <div style={{ fontFamily: "Bebas Neue", fontSize: 20, color: C.white, letterSpacing: 1 }}>CASE LOG</div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "12px 16px", background: C.blackMid }}>
        {["ALL", "MATCHED", "NO MATCH"].map(f => (
          <button key={f} className="btn" onClick={() => setFilter(f)}
            style={{ padding: "8px 14px", fontSize: 12, background: filter === f ? C.red : C.blackSoft, color: filter === f ? C.white : C.grey, border: `1.5px solid ${filter === f ? C.red : C.border}`, borderRadius: 20 }}>
            {f}
          </button>
        ))}
      </div>
      <div className="screen" style={{ padding: "12px 16px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: C.grey }}>No cases found</div>
        ) : filtered.map(c => (
          <div key={c.id} className="card fade-in" style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ fontFamily: "DM Mono", fontSize: 13, color: C.white }}>{c.case_id}</div>
              <span className="tag" style={{ background: c.outcome === "MATCHED" ? C.greenBg : C.amberBg, color: c.outcome === "MATCHED" ? C.green : C.amber }}>
                {c.outcome || "PENDING"}
              </span>
            </div>
            <div style={{ fontSize: 12, color: C.grey }}>{c.case_type} · {c.survivor_gender} · Risk: {c.safety_risk}</div>
            {c.matched_shelter && <div style={{ fontSize: 12, color: C.green, marginTop: 4 }}>→ {c.matched_shelter}</div>}
            <div style={{ fontSize: 11, color: C.greyMid, marginTop: 6 }}>{new Date(c.created_at).toLocaleString("en-ZA")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Shelter Coordinator Dashboard ────────────────────────────────
function ShelterDashboard({ user, onLogout }) {
  const [shelter, setShelter] = useState(null);
  const [cases, setCases] = useState([]);
  const [saving, setSaving] = useState(false);
  const [screen, setScreen] = useState("home");

  useEffect(() => { loadShelter(); loadCases(); }, []);

  async function loadShelter() {
    const { data } = await sb.from("shelters").select("*").ilike("coordinator_name", `%${user.full_name.split(" ")[0]}%`).single();
    if (!data) {
      // If no match by name, load first shelter for demo
      const { data: d2 } = await sb.from("shelters").select("*").limit(1).single();
      setShelter(d2);
    } else {
      setShelter(data);
    }
  }

  async function loadCases() {
    const { data } = await sb.from("cases").select("*").order("created_at", { ascending: false }).limit(20);
    setCases(data || []);
  }

  async function updateBeds(delta) {
    if (!shelter) return;
    const newVal = Math.max(0, Math.min(shelter.total_capacity || 99, shelter.available_beds + delta));
    setSaving(true);
    await sb.from("shelters").update({ available_beds: newVal }).eq("id", shelter.id);
    setShelter(s => ({ ...s, available_beds: newVal }));
    setSaving(false);
  }

  async function toggleAccepting() {
    if (!shelter) return;
    await sb.from("shelters").update({ accepting_referrals: !shelter.accepting_referrals }).eq("id", shelter.id);
    setShelter(s => ({ ...s, accepting_referrals: !s.accepting_referrals }));
  }

  if (screen === "log") return <CaseLog cases={cases} onBack={() => setScreen("home")} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar user={user} onLogout={onLogout} />
      <div className="screen fade-in" style={{ padding: "20px 20px 100px" }}>

        {shelter ? (
          <>
            {/* Shelter name */}
            <div style={{ background: `linear-gradient(135deg, #1A0000, #2A0008)`, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: C.grey, marginBottom: 4 }}>YOUR SHELTER</div>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 22, color: C.white, letterSpacing: 1 }}>{shelter.shelter_name}</div>
              <div style={{ fontSize: 13, color: C.grey }}>{shelter.area}</div>
            </div>

            {/* Accepting toggle */}
            <div className="card" style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>Accepting Referrals</div>
                <div style={{ fontSize: 12, color: C.grey, marginTop: 2 }}>Toggle your availability</div>
              </div>
              <button onClick={toggleAccepting}
                style={{ width: 52, height: 28, borderRadius: 14, background: shelter.accepting_referrals ? C.green : C.greyMid, border: "none", cursor: "pointer", position: "relative", transition: "background 0.3s" }}>
                <div style={{ position: "absolute", top: 3, left: shelter.accepting_referrals ? 27 : 3, width: 22, height: 22, borderRadius: "50%", background: C.white, transition: "left 0.3s" }} />
              </button>
            </div>

            {/* Bed counter */}
            <div className="card" style={{ marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: C.grey, marginBottom: 16 }}>AVAILABLE BEDS</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
                <button onClick={() => updateBeds(-1)} disabled={saving}
                  style={{ width: 44, height: 44, borderRadius: "50%", background: C.blackSoft, border: `1.5px solid ${C.border}`, color: C.white, fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <div style={{ fontFamily: "Bebas Neue", fontSize: 56, color: shelter.available_beds > 0 ? C.green : C.red, lineHeight: 1 }}>
                  {shelter.available_beds}
                </div>
                <button onClick={() => updateBeds(1)} disabled={saving}
                  style={{ width: 44, height: 44, borderRadius: "50%", background: C.blackSoft, border: `1.5px solid ${C.border}`, color: C.white, fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
              <div style={{ fontSize: 12, color: C.grey, marginTop: 8 }}>of {shelter.total_capacity} total capacity</div>
            </div>

            {/* Support profile */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: C.grey, marginBottom: 12, fontWeight: 600 }}>SUPPORT PROFILE</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { k: "wheelchair", l: "♿ Wheelchair" },
                  { k: "mental_health", l: "🧠 Mental Health" },
                  { k: "accepts_children", l: "👶 Children" },
                  { k: "visual_impairment", l: "👁 Visual" },
                  { k: "hearing_impairment", l: "👂 Hearing" },
                ].map(({ k, l }) => (
                  <span key={k} className="tag" style={{ background: shelter[k] ? C.greenBg : C.blackSoft, color: shelter[k] ? C.green : C.greyMid, border: `1px solid ${shelter[k] ? "rgba(0,200,83,0.3)" : C.border}` }}>
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent referrals */}
            <div>
              <div style={{ fontSize: 13, color: C.grey, fontWeight: 600, letterSpacing: 0.5, marginBottom: 12 }}>RECENT REFERRALS TO YOUR SHELTER</div>
              {cases.filter(c => c.matched_shelter === shelter.shelter_name).slice(0, 3).map(c => (
                <div key={c.id} className="card" style={{ marginBottom: 8 }}>
                  <div style={{ fontFamily: "DM Mono", fontSize: 13, color: C.white }}>{c.case_id}</div>
                  <div style={{ fontSize: 12, color: C.grey, marginTop: 4 }}>{c.case_type} · {new Date(c.created_at).toLocaleDateString("en-ZA")}</div>
                </div>
              ))}
              {cases.filter(c => c.matched_shelter === shelter.shelter_name).length === 0 && (
                <div style={{ color: C.grey, fontSize: 13, textAlign: "center", padding: "20px 0" }}>No referrals yet</div>
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div className="pulse" style={{ color: C.grey }}>Loading shelter data...</div>
          </div>
        )}
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.blackMid, borderTop: `1px solid ${C.border}`, display: "flex", padding: "12px 0 20px" }}>
        {[{ icon: "🏠", label: "Home", s: "home" }, { icon: "📋", label: "Referrals", s: "log" }].map(n => (
          <button key={n.s} className="btn" onClick={() => setScreen(n.s)}
            style={{ flex: 1, background: "transparent", color: screen === n.s ? C.red : C.grey, fontSize: 10, padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>{n.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Admin Dashboard ──────────────────────────────────────────────
function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [cases, setCases] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [screen, setScreen] = useState("home");

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    const [u, c, s] = await Promise.all([
      sb.from("users").select("*").order("created_at", { ascending: false }),
      sb.from("cases").select("*").order("created_at", { ascending: false }),
      sb.from("shelters").select("*"),
    ]);
    setUsers(u.data || []);
    setCases(c.data || []);
    setShelters(s.data || []);
  }

  const matchRate = cases.length ? Math.round((cases.filter(c => c.outcome === "MATCHED").length / cases.length) * 100) : 0;
  const totalBeds = shelters.reduce((a, s) => a + (s.available_beds || 0), 0);

  if (screen === "users") return <AdminUsers users={users} onBack={() => setScreen("home")} />;
  if (screen === "cases") return <CaseLog cases={cases} onBack={() => setScreen("home")} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar user={user} onLogout={onLogout} />
      <div className="screen fade-in" style={{ padding: "20px 20px 100px" }}>

        {/* Admin hero */}
        <div style={{ background: `linear-gradient(135deg, #0A0A1A, #0A1A2A)`, border: `1px solid rgba(33,150,243,0.3)`, borderRadius: 20, padding: "20px", marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: C.blue, fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>ADMIN PANEL</div>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 22, color: C.white, letterSpacing: 1 }}>SYSTEM OVERVIEW</div>
          <div style={{ fontSize: 13, color: C.grey, marginTop: 2 }}>Pathway Impact Labs</div>
        </div>

        {/* Key metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total Users", value: users.length, color: C.blue, icon: "👥" },
            { label: "Total Cases", value: cases.length, color: C.white, icon: "📋" },
            { label: "Match Rate", value: `${matchRate}%`, color: C.green, icon: "✅" },
            { label: "Beds Available", value: totalBeds, color: C.amber, icon: "🏠" },
          ].map(m => (
            <div key={m.label} className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{m.icon}</div>
              <div style={{ fontSize: 24, fontFamily: "Bebas Neue", color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 11, color: C.grey }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Shelter network */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: C.grey, fontWeight: 600, letterSpacing: 0.5, marginBottom: 12 }}>SHELTER NETWORK</div>
          {shelters.map(s => (
            <div key={s.id} className="card" style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>{s.shelter_name}</div>
                <span className="tag" style={{ background: s.accepting_referrals ? C.greenBg : "rgba(208,2,27,0.12)", color: s.accepting_referrals ? C.green : C.red }}>
                  {s.accepting_referrals ? "OPEN" : "CLOSED"}
                </span>
              </div>
              <div style={{ background: C.blackSoft, borderRadius: 6, height: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", background: s.available_beds > 3 ? C.green : s.available_beds > 0 ? C.amber : C.red, width: `${s.total_capacity ? (s.available_beds / s.total_capacity) * 100 : 0}%`, transition: "width 0.5s" }} />
              </div>
              <div style={{ fontSize: 11, color: C.grey, marginTop: 4 }}>{s.available_beds} / {s.total_capacity} beds · {s.area}</div>
            </div>
          ))}
        </div>

        {/* Recent cases */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: C.grey, fontWeight: 600, letterSpacing: 0.5 }}>RECENT CASES</div>
            <button className="btn" style={{ fontSize: 12, color: C.red, padding: "4px 8px", background: "transparent" }} onClick={() => setScreen("cases")}>View all</button>
          </div>
          {cases.slice(0, 4).map(c => (
            <div key={c.id} className="card" style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontFamily: "DM Mono", color: C.white }}>{c.case_id}</div>
                <div style={{ fontSize: 11, color: C.grey }}>{c.submitter_name} · {c.organisation}</div>
              </div>
              <span className="tag" style={{ background: c.outcome === "MATCHED" ? C.greenBg : C.amberBg, color: c.outcome === "MATCHED" ? C.green : C.amber, fontSize: 10 }}>
                {c.outcome || "PENDING"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.blackMid, borderTop: `1px solid ${C.border}`, display: "flex", padding: "12px 0 20px" }}>
        {[{ icon: "📊", label: "Overview", s: "home" }, { icon: "👥", label: "Users", s: "users" }, { icon: "📋", label: "Cases", s: "cases" }].map(n => (
          <button key={n.s} className="btn" onClick={() => setScreen(n.s)}
            style={{ flex: 1, background: "transparent", color: screen === n.s ? C.red : C.grey, fontSize: 10, padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>{n.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AdminUsers({ users, onBack }) {
  const roleColors = { vfr: C.blue, social_worker: C.green, shelter: C.amber, admin: C.red };
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 20px", background: C.black, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn btn-dark" style={{ padding: "8px 12px", fontSize: 13 }} onClick={onBack}>← Back</button>
        <div style={{ fontFamily: "Bebas Neue", fontSize: 20, color: C.white, letterSpacing: 1 }}>REGISTERED USERS</div>
      </div>
      <div className="screen" style={{ padding: "12px 16px" }}>
        {users.map(u => (
          <div key={u.id} className="card fade-in" style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>{u.full_name}</div>
                <div style={{ fontSize: 12, color: C.grey, marginTop: 2 }}>{u.organisation}</div>
                <div style={{ fontSize: 12, color: C.greyMid, marginTop: 2 }}>{u.email}</div>
              </div>
              <span className="tag" style={{ background: `${roleColors[u.role]}22`, color: roleColors[u.role] || C.grey }}>
                {u.role?.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: 11, color: C.greyMid, marginTop: 8 }}>Registered {new Date(u.created_at).toLocaleDateString("en-ZA")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Root App ─────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  // Check for saved session
  useEffect(() => {
    const saved = localStorage.getItem("safelink_user");
    if (saved) { try { setUser(JSON.parse(saved)); } catch {} }
  }, []);

  function handleAuth(u) {
    setUser(u);
    localStorage.setItem("safelink_user", JSON.stringify(u));
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("safelink_user");
  }

  function renderDashboard() {
    if (!user) return <AuthScreen onAuth={handleAuth} />;
    switch (user.role) {
      case "admin": return <AdminDashboard user={user} onLogout={handleLogout} />;
      case "shelter": return <ShelterDashboard user={user} onLogout={handleLogout} />;
      default: return <ReferralDashboard user={user} onLogout={handleLogout} />;
    }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="phone-shell">
        <div className="phone-frame">
          {renderDashboard()}
        </div>
      </div>
      {/* Trademark */}
      <div style={{ position: "fixed", bottom: 12, left: 0, right: 0, textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.2)", pointerEvents: "none", zIndex: 999 }}>
        Developed by Simone Jonkers · Pathway Impact Labs · A division of Pathway Films · © {new Date().getFullYear()} ALL RIGHTS RESERVED
      </div>
    </>
  );
}
