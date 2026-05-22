import { useState, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Libre+Baskerville:ital@0;1&family=Josefin+Sans:wght@300;400;600&display=swap');`;

const styles = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --parchment: #f5efe0;
    --parchment-dark: #ede3cc;
    --ink: #2a1f0e;
    --ink-light: #5c4a2a;
    --rust: #b8490a;
    --rust-light: #e06030;
    --sage: #4a6741;
    --sky: #3a6b8a;
    --gold: #c9922a;
    --card: #faf5e8;
    --border: #c4aa7a;
  }
  body { font-family: 'Libre Baskerville', Georgia, serif; background: var(--parchment); color: var(--ink); min-height: 100vh; }
  .app {
    min-height: 100vh;
    background: radial-gradient(ellipse at 10% 20%, rgba(184,73,10,0.06) 0%, transparent 50%),
                radial-gradient(ellipse at 90% 80%, rgba(74,103,65,0.06) 0%, transparent 50%),
                var(--parchment);
  }
  .header {
    padding: 28px 40px 20px;
    border-bottom: 2px solid var(--border);
    display: flex; align-items: baseline; gap: 16px;
    background: rgba(245,239,224,0.95);
    position: sticky; top: 0; z-index: 100;
  }
  .header-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 900; color: var(--ink); }
  .header-title span { color: var(--rust); }
  .header-sub { font-family: 'Josefin Sans', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--ink-light); font-weight: 300; }
  .main { max-width: 1100px; margin: 0 auto; padding: 40px 24px 60px; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  /* INTRO */
  .intro-card {
    background: var(--card); border: 1.5px solid var(--border); border-radius: 4px;
    padding: 40px 44px; box-shadow: 4px 4px 0 var(--border);
    max-width: 680px; margin: 0 auto; animation: fadeUp 0.5s ease both;
  }
  .intro-eyebrow { font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--rust); margin-bottom: 10px; font-weight: 600; }
  .intro-headline { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; line-height: 1.15; color: var(--ink); margin-bottom: 8px; }
  .intro-headline em { font-style: italic; color: var(--rust); }
  .intro-desc { font-size: 14px; color: var(--ink-light); line-height: 1.7; margin-bottom: 32px; border-top: 1px solid var(--border); padding-top: 16px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--ink-light); font-weight: 600; }
  .form-input, .form-select {
    padding: 11px 14px; border: 1.5px solid var(--border); border-radius: 3px;
    background: var(--parchment); font-family: 'Libre Baskerville', serif; font-size: 14px; color: var(--ink);
    transition: border-color 0.2s, box-shadow 0.2s; outline: none;
  }
  .form-input:focus, .form-select:focus { border-color: var(--rust); box-shadow: 0 0 0 3px rgba(184,73,10,0.12); }
  .vibes { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
  .vibe-btn {
    padding: 6px 14px; border: 1.5px solid var(--border); border-radius: 20px;
    background: var(--parchment); font-family: 'Josefin Sans', sans-serif; font-size: 11px;
    letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink-light); cursor: pointer; transition: all 0.15s; font-weight: 600;
  }
  .vibe-btn:hover { border-color: var(--rust); color: var(--rust); }
  .vibe-btn.active { background: var(--rust); border-color: var(--rust); color: white; }
  .btn-primary {
    width: 100%; padding: 14px 28px; background: var(--rust); color: white; border: none; border-radius: 3px;
    font-family: 'Josefin Sans', sans-serif; font-size: 13px; letter-spacing: 2.5px; text-transform: uppercase;
    font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 3px 3px 0 var(--ink-light);
  }
  .btn-primary:hover { background: var(--rust-light); transform: translate(-1px,-1px); box-shadow: 4px 4px 0 var(--ink-light); }
  .btn-primary:active { transform: translate(1px,1px); box-shadow: 2px 2px 0 var(--ink-light); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .error-msg { background: #fdf0ed; border: 1.5px solid #e8b4a0; border-radius: 3px; padding: 12px 16px; font-size: 13px; color: #8b2500; margin-top: 12px; }

  /* LOADING */
  .loading-state { text-align: center; padding: 80px 20px; animation: fadeUp 0.4s ease both; }
  .loading-compass { font-size: 48px; display: block; margin-bottom: 20px; animation: spin 3s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .loading-text { font-family: 'Playfair Display', serif; font-size: 22px; font-style: italic; color: var(--ink-light); margin-bottom: 8px; }
  .loading-sub { font-family: 'Josefin Sans', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); }

  /* REVIEW */
  .review-layout { animation: fadeUp 0.5s ease both; }
  .section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; }
  .section-title span { color: var(--rust); font-style: italic; }
  .section-meta { font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--ink-light); }
  .route-bar {
    background: var(--card); border: 1.5px solid var(--border); border-radius: 3px;
    padding: 12px 20px; display: flex; align-items: center; gap: 12px; margin-bottom: 28px;
    font-family: 'Josefin Sans', sans-serif; font-size: 12px; letter-spacing: 1px; color: var(--ink-light);
  }
  .route-bar strong { color: var(--ink); font-size: 14px; }
  .route-arrow { color: var(--rust); font-size: 18px; }
  .stops-grid { display: grid; gap: 14px; margin-bottom: 32px; }
  .stop-card {
    background: var(--card); border: 1.5px solid var(--border); border-radius: 4px;
    padding: 20px 22px; display: grid; grid-template-columns: 36px 1fr auto; gap: 16px;
    align-items: start; transition: all 0.2s; position: relative; overflow: hidden;
  }
  .stop-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--border); transition: background 0.2s; }
  .stop-card.approved::before { background: var(--sage); }
  .stop-card.rejected { opacity: 0.45; }
  .stop-number {
    width: 36px; height: 36px; border-radius: 50%; background: var(--parchment-dark); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: var(--ink-light); flex-shrink: 0;
  }
  .stop-card.approved .stop-number { background: var(--sage); border-color: var(--sage); color: white; }
  .stop-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
  .stop-type { font-family: 'Josefin Sans', sans-serif; font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--rust); font-weight: 600; margin-bottom: 7px; }
  .stop-desc { font-size: 13px; color: var(--ink-light); line-height: 1.65; }
  .stop-why { font-size: 12px; color: var(--sage); font-style: italic; margin-top: 6px; line-height: 1.5; }
  .stop-actions { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
  .action-btn {
    width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--border);
    background: var(--parchment); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.15s;
  }
  .action-btn.approve:hover, .action-btn.approve.active { background: var(--sage); border-color: var(--sage); color: white; }
  .action-btn.reject:hover, .action-btn.reject.active { background: #c0392b; border-color: #c0392b; color: white; }
  .build-btn-wrap { text-align: center; }
  .btn-secondary {
    padding: 13px 36px; background: transparent; color: var(--rust); border: 1.5px solid var(--rust); border-radius: 3px;
    font-family: 'Josefin Sans', sans-serif; font-size: 12px; letter-spacing: 2.5px; text-transform: uppercase;
    font-weight: 600; cursor: pointer; transition: all 0.2s; margin-right: 12px;
  }
  .btn-secondary:hover { background: var(--rust); color: white; }

  /* FINAL */
  .final-layout { animation: fadeUp 0.5s ease both; }
  .trip-title-block { text-align: center; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 2px solid var(--border); position: relative; }
  .trip-title-block::after { content: '✦ ✦ ✦'; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); background: var(--parchment); padding: 0 12px; font-size: 10px; color: var(--gold); letter-spacing: 6px; }
  .trip-eyebrow { font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--rust); font-weight: 600; margin-bottom: 10px; }
  .trip-big-title { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 900; line-height: 1.1; color: var(--ink); margin-bottom: 10px; }
  .trip-big-title em { color: var(--rust); font-style: italic; }
  .trip-stats { display: flex; justify-content: center; gap: 32px; margin-top: 18px; }
  .trip-stat { text-align: center; font-family: 'Josefin Sans', sans-serif; }
  .trip-stat-num { font-size: 22px; font-weight: 600; color: var(--ink); display: block; }
  .trip-stat-label { font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--ink-light); }
  .final-body { display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start; }
  .map-panel { background: var(--card); border: 1.5px solid var(--border); border-radius: 4px; overflow: hidden; box-shadow: 4px 4px 0 var(--border); position: sticky; top: 100px; }
  .map-header { padding: 12px 18px; border-bottom: 1px solid var(--border); font-family: 'Josefin Sans', sans-serif; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: var(--ink-light); font-weight: 600; }
  .map-viz { background: #dde8d0; height: 420px; position: relative; overflow: hidden; }
  .map-pin { position: absolute; transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s; z-index: 10; }
  .map-pin:hover { transform: translate(-50%, -100%) scale(1.15); }
  .map-pin-dot { width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 2px 2px 6px rgba(0,0,0,0.25); }
  .map-pin-dot.start { background: var(--sage); }
  .map-pin-dot.stop { background: var(--rust); }
  .map-pin-dot.end { background: var(--sky); }
  .map-pin-num { transform: rotate(45deg); color: white; font-family: 'Playfair Display', serif; font-size: 11px; font-weight: 700; }
  .map-pin-label { margin-top: 4px; background: white; border: 1px solid var(--border); border-radius: 2px; padding: 2px 6px; font-family: 'Josefin Sans', sans-serif; font-size: 9px; letter-spacing: 1px; color: var(--ink); white-space: nowrap; box-shadow: 1px 1px 3px rgba(0,0,0,0.15); font-weight: 600; }
  .itinerary-stop { display: flex; gap: 20px; margin-bottom: 32px; animation: fadeUp 0.4s ease both; }
  .it-line { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .it-dot { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: white; flex-shrink: 0; box-shadow: 2px 2px 0 rgba(0,0,0,0.15); }
  .it-dot.start { background: var(--sage); }
  .it-dot.waypoint { background: var(--rust); }
  .it-dot.end { background: var(--sky); }
  .it-connector { width: 2px; flex: 1; min-height: 32px; background: repeating-linear-gradient(to bottom, var(--border) 0, var(--border) 4px, transparent 4px, transparent 8px); margin: 6px 0; }
  .it-content { padding-top: 6px; flex: 1; }
  .it-stop-type { font-family: 'Josefin Sans', sans-serif; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: var(--rust); font-weight: 600; margin-bottom: 3px; }
  .it-stop-type.start { color: var(--sage); }
  .it-stop-type.end { color: var(--sky); }
  .it-stop-name { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
  .it-stop-body { font-size: 13px; color: var(--ink-light); line-height: 1.7; margin-bottom: 8px; }
  .it-tip { display: inline-flex; align-items: center; gap: 6px; background: var(--parchment-dark); border: 1px solid var(--border); border-radius: 2px; padding: 5px 10px; font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 1px; color: var(--sage); font-weight: 600; }
  .reset-btn { display: block; margin: 40px auto 0; padding: 10px 28px; background: transparent; border: 1.5px solid var(--border); border-radius: 3px; font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--ink-light); cursor: pointer; transition: all 0.2s; }
  .reset-btn:hover { border-color: var(--rust); color: var(--rust); }

  @media (max-width: 768px) {
    .header { padding: 18px 20px; }
    .intro-card { padding: 28px 24px; }
    .form-row { grid-template-columns: 1fr; }
    .final-body { grid-template-columns: 1fr; }
    .map-panel { position: static; }
    .trip-big-title { font-size: 30px; }
  }
`;

const VIBES = ["Coastal", "Mountains", "Small Towns", "Desert", "Forests", "Historic", "Off-Beat", "Food & Wine"];

function pinPositions(count) {
  const positions = [];
  const lanes = [20, 35, 50, 65, 80];
  for (let i = 0; i < count; i++) {
    const xPct = 8 + (i / (count - 1 || 1)) * 84;
    const y = lanes[i % lanes.length] + (Math.random() * 10 - 5);
    positions.push({ x: xPct, y: Math.min(Math.max(y, 15), 80) });
  }
  return positions;
}

async function callAI(prompt) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  const clean = data.text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

export default function Driftway() {
  const [phase, setPhase] = useState("intro");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("3");
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [stops, setStops] = useState([]);
  const [approved, setApproved] = useState({});
  const [error, setError] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const pinPos = useRef([]);

  const toggleVibe = (v) => setSelectedVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const toggleStop = (id, val) => setApproved(prev => ({ ...prev, [id]: prev[id] === val ? null : val }));
  const finalStops = stops.filter(s => approved[s.id] !== false);

  async function generateStops() {
    if (!origin.trim() || !destination.trim()) { setError("Please enter both a starting point and destination."); return; }
    setError("");
    setPhase("loading");
    const vibeStr = selectedVibes.length ? selectedVibes.join(", ") : "varied and interesting";
    const STOP_TYPES = ["Scenic Overlook","Historic Landmark","Natural Wonder","Small Town Gem","State/National Park","Roadside Attraction","Culinary Stop","Hidden Gem"];
    const prompt = `You are a road trip curator. Generate 5 scenic stops for a road trip from ${origin} to ${destination} over ${days} days. The traveler's vibe preferences: ${vibeStr}.

For each stop provide: name, type (one of: ${STOP_TYPES.join(", ")}), description (2 sentences), why (1 sentence on why it fits this specific trip), distanceNote (rough drive from previous stop), insiderTip (1 actionable sentence).

Respond ONLY with a valid JSON array, no markdown, no preamble:
[{"name":"...","type":"...","description":"...","why":"...","distanceNote":"...","insiderTip":"..."}]`;

    try {
      const parsed = await callAI(prompt);
      const withIds = parsed.map((s, i) => ({ ...s, id: `stop_${i}` }));
      setStops(withIds);
      const initApproved = {};
      withIds.forEach(s => { initApproved[s.id] = true; });
      setApproved(initApproved);
      pinPos.current = pinPositions(withIds.length + 2);
      setPhase("review");
    } catch (e) {
      setError("Couldn't generate stops. Please try again.");
      setPhase("intro");
    }
  }

  async function buildItinerary() {
    setLoadingItinerary(true);
    setError("");
    const approvedStops = stops.filter(s => approved[s.id] !== false);
    const stopNames = approvedStops.map(s => s.name).join(", ");
    const prompt = `Create a concise road trip itinerary from ${origin} to ${destination} over ${days} days, hitting these stops in order: ${stopNames}.

For each stop (including origin and destination), write a 2-sentence atmospheric description of what to do/experience there.

Respond ONLY with valid JSON, no markdown:
{"stops":[{"name":"...","description":"...","type":"start|waypoint|end"}]}`;

    try {
      const parsed = await callAI(prompt);
      setItinerary(parsed);
      pinPos.current = pinPositions(parsed.stops.length);
      setPhase("final");
    } catch (e) {
      setError("Couldn't build itinerary. Please try again.");
    }
    setLoadingItinerary(false);
  }

  function reset() {
    setPhase("intro"); setOrigin(""); setDestination(""); setDays("3");
    setSelectedVibes([]); setStops([]); setApproved({}); setItinerary(null); setError("");
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="header-title">Drift<span>w</span>ay</div>
          <div className="header-sub">Scenic Route Builder</div>
        </header>
        <main className="main">

          {phase === "intro" && (
            <div className="intro-card">
              <div className="intro-eyebrow">Plan Your Journey</div>
              <h1 className="intro-headline">The road less<br /><em>optimized.</em></h1>
              <p className="intro-desc">Enter your route and preferences. We'll suggest scenic stops, hidden gems, and landmarks worth pulling over for — then build a full itinerary around the ones you choose.</p>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Starting Point</label>
                  <input className="form-input" placeholder="e.g. Portland, OR" value={origin} onChange={e => setOrigin(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Destination</label>
                  <input className="form-input" placeholder="e.g. San Francisco, CA" value={destination} onChange={e => setDestination(e.target.value)} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Trip Length</label>
                <select className="form-select" value={days} onChange={e => setDays(e.target.value)}>
                  {["1","2","3","4","5","6","7","10","14"].map(d => <option key={d} value={d}>{d} day{d !== "1" ? "s" : ""}</option>)}
                </select>
              </div>
              <div className="form-label" style={{ marginBottom: 10 }}>Trip Vibe <span style={{ fontFamily: 'Libre Baskerville', fontStyle: 'italic', fontSize: 11, letterSpacing: 0, textTransform: 'none', fontWeight: 400 }}>(optional)</span></div>
              <div className="vibes">
                {VIBES.map(v => (
                  <button key={v} className={`vibe-btn${selectedVibes.includes(v) ? " active" : ""}`} onClick={() => toggleVibe(v)}>{v}</button>
                ))}
              </div>
              {error && <div className="error-msg">{error}</div>}
              <button className="btn-primary" onClick={generateStops}>Find Scenic Stops →</button>
            </div>
          )}

          {phase === "loading" && (
            <div className="loading-state">
              <span className="loading-compass">🧭</span>
              <div className="loading-text">Charting the scenic route…</div>
              <div className="loading-sub">Finding hidden gems along the way</div>
            </div>
          )}

          {phase === "review" && (
            <div className="review-layout">
              <div className="section-header">
                <div className="section-title">Suggested <span>Stops</span></div>
                <div className="section-meta">{stops.length} stops · approve to keep</div>
              </div>
              <div className="route-bar">
                <strong>{origin}</strong>
                <span className="route-arrow">⟶</span>
                <strong>{destination}</strong>
                <span style={{ marginLeft: 'auto' }}>{days} days · {selectedVibes.join(", ") || "Mixed vibe"}</span>
              </div>
              <div className="stops-grid">
                {stops.map((stop, i) => (
                  <div key={stop.id} className={`stop-card ${approved[stop.id] === false ? "rejected" : approved[stop.id] === true ? "approved" : ""}`}>
                    <div className="stop-number">{approved[stop.id] !== false ? "✓" : i + 1}</div>
                    <div>
                      <div className="stop-name">{stop.name}</div>
                      <div className="stop-type">{stop.type}</div>
                      <div className="stop-desc">{stop.description}</div>
                      <div className="stop-why">✦ {stop.why}</div>
                    </div>
                    <div className="stop-actions">
                      <button className={`action-btn approve${approved[stop.id] === true ? " active" : ""}`} onClick={() => toggleStop(stop.id, true)}>✓</button>
                      <button className={`action-btn reject${approved[stop.id] === false ? " active" : ""}`} onClick={() => toggleStop(stop.id, false)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              {error && <div className="error-msg">{error}</div>}
              <div className="build-btn-wrap">
                <button className="btn-secondary" onClick={reset}>Start Over</button>
                <button className="btn-primary" style={{ width: 'auto' }} disabled={loadingItinerary} onClick={buildItinerary}>
                  {loadingItinerary ? "Building…" : `Build Itinerary with ${finalStops.length} Stops →`}
                </button>
              </div>
            </div>
          )}

          {phase === "final" && itinerary && (
            <div className="final-layout">
              <div className="trip-title-block">
                <div className="trip-eyebrow">Your Road Trip</div>
                <h1 className="trip-big-title">{origin} <em>to</em><br />{destination}</h1>
                <div className="trip-stats">
                  <div className="trip-stat"><span className="trip-stat-num">{days}</span><span className="trip-stat-label">Days</span></div>
                  <div className="trip-stat"><span className="trip-stat-num">{itinerary.stops.length - 2}</span><span className="trip-stat-label">Stops</span></div>
                  <div className="trip-stat"><span className="trip-stat-num">{selectedVibes[0] || "Mixed"}</span><span className="trip-stat-label">Vibe</span></div>
                </div>
              </div>
              <div className="final-body">
                <div>
                  {itinerary.stops.map((stop, i) => (
                    <div key={i}>
                      <div className="itinerary-stop" style={{ animationDelay: `${i * 0.08}s` }}>
                        <div className="it-line">
                          <div className={`it-dot ${stop.type}`}>
                            {stop.type === "start" ? "A" : stop.type === "end" ? "B" : i}
                          </div>
                          {i < itinerary.stops.length - 1 && <div className="it-connector" />}
                        </div>
                        <div className="it-content">
                          <div className={`it-stop-type ${stop.type}`}>
                            {stop.type === "start" ? "Departure" : stop.type === "end" ? "Destination" : `Stop ${i}`}
                          </div>
                          <div className="it-stop-name">{stop.name}</div>
                          <div className="it-stop-body">{stop.description}</div>
                          {stops.find(s => s.name === stop.name)?.insiderTip && (
                            <div className="it-tip">💡 {stops.find(s => s.name === stop.name).insiderTip}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="map-panel">
                  <div className="map-header">Route Map · {itinerary.stops.length} Points</div>
                  <div className="map-viz">
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} viewBox="0 0 400 300" preserveAspectRatio="none">
                      <defs>
                        <pattern id="terrain" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                          <circle cx="10" cy="10" r="1" fill="rgba(74,103,65,0.12)" />
                          <circle cx="30" cy="25" r="1.5" fill="rgba(74,103,65,0.08)" />
                        </pattern>
                      </defs>
                      <rect width="400" height="300" fill="url(#terrain)" />
                      <ellipse cx="60" cy="60" rx="50" ry="30" fill="rgba(74,103,65,0.15)" />
                      <ellipse cx="320" cy="200" rx="60" ry="35" fill="rgba(74,103,65,0.12)" />
                      <ellipse cx="200" cy="250" rx="80" ry="25" fill="rgba(58,107,138,0.1)" />
                      {pinPos.current.length > 1 && (
                        <polyline
                          points={pinPos.current.map(p => `${p.x * 4},${p.y * 3}`).join(" ")}
                          stroke="#8b6914" strokeWidth="3" fill="none" strokeDasharray="8,4" opacity="0.6"
                        />
                      )}
                    </svg>
                    {itinerary.stops.map((stop, i) => {
                      const pos = pinPos.current[i] || { x: 50, y: 50 };
                      return (
                        <div key={i} className="map-pin" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
                          <div className={`map-pin-dot ${stop.type === "start" ? "start" : stop.type === "end" ? "end" : "stop"}`}>
                            <span className="map-pin-num">{stop.type === "start" ? "A" : stop.type === "end" ? "B" : i}</span>
                          </div>
                          <div className="map-pin-label">{stop.name.split(",")[0]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <button className="reset-btn" onClick={reset}>← Plan Another Trip</button>
            </div>
          )}

        </main>
      </div>
    </>
  );
}
