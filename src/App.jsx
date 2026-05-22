import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Libre+Baskerville:ital@0;1&family=Josefin+Sans:wght@300;400;600&display=swap');`;

const styles = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --parchment: #f5efe0; --parchment-dark: #ede3cc; --ink: #2a1f0e; --ink-light: #5c4a2a;
    --rust: #b8490a; --rust-light: #e06030; --sage: #4a6741; --sky: #3a6b8a;
    --gold: #c9922a; --card: #faf5e8; --border: #c4aa7a;
  }
  body { font-family: 'Libre Baskerville', Georgia, serif; background: var(--parchment); color: var(--ink); min-height: 100vh; }
  .app { min-height: 100vh; background: radial-gradient(ellipse at 10% 20%, rgba(184,73,10,0.06) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(74,103,65,0.06) 0%, transparent 50%), var(--parchment); }
  .header { padding: 20px 40px; border-bottom: 2px solid var(--border); display: flex; align-items: baseline; gap: 16px; background: rgba(245,239,224,0.95); position: sticky; top: 0; z-index: 200; }
  .header-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 900; color: var(--ink); }
  .header-title span { color: var(--rust); }
  .header-sub { font-family: 'Josefin Sans', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--ink-light); font-weight: 300; }
  .main { max-width: 1200px; margin: 0 auto; padding: 40px 24px 60px; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .intro-card { background: var(--card); border: 1.5px solid var(--border); border-radius: 4px; padding: 40px 44px; box-shadow: 4px 4px 0 var(--border); max-width: 700px; margin: 0 auto; animation: fadeUp 0.5s ease both; }
  .intro-eyebrow { font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--rust); margin-bottom: 10px; font-weight: 600; }
  .intro-headline { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 700; line-height: 1.15; color: var(--ink); margin-bottom: 8px; }
  .intro-headline em { font-style: italic; color: var(--rust); }
  .intro-desc { font-size: 13px; color: var(--ink-light); line-height: 1.7; margin-bottom: 28px; border-top: 1px solid var(--border); padding-top: 14px; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; position: relative; }
  .form-label { font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--ink-light); font-weight: 600; }
  .form-input, .form-select { padding: 11px 14px; border: 1.5px solid var(--border); border-radius: 3px; background: var(--parchment); font-family: 'Libre Baskerville', serif; font-size: 14px; color: var(--ink); transition: border-color 0.2s, box-shadow 0.2s; outline: none; width: 100%; }
  .form-input:focus, .form-select:focus { border-color: var(--rust); box-shadow: 0 0 0 3px rgba(184,73,10,0.12); }

  /* AUTOCOMPLETE */
  .autocomplete-wrap { position: relative; width: 100%; }
  .autocomplete-dropdown { position: absolute; top: calc(100% + 2px); left: 0; right: 0; background: white; border: 1.5px solid var(--border); border-radius: 3px; z-index: 9999; max-height: 220px; overflow-y: auto; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
  .autocomplete-item { padding: 10px 14px; font-family: 'Josefin Sans', sans-serif; font-size: 12px; color: var(--ink); cursor: pointer; border-bottom: 1px solid var(--parchment-dark); transition: background 0.1s; line-height: 1.4; }
  .autocomplete-item:hover, .autocomplete-item.highlighted { background: var(--parchment); }
  .autocomplete-item:last-child { border-bottom: none; }

  /* WAYPOINTS */
  .waypoints-section { margin-bottom: 12px; }
  .waypoint-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .waypoint-label { font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--ink-light); font-weight: 600; white-space: nowrap; min-width: 48px; }
  .remove-btn { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid var(--border); background: var(--parchment); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: var(--ink-light); transition: all 0.15s; flex-shrink: 0; line-height: 1; }
  .remove-btn:hover { border-color: #c0392b; color: #c0392b; }
  .add-stop-btn { font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--rust); background: none; border: 1px dashed var(--rust); border-radius: 3px; padding: 7px 14px; cursor: pointer; transition: all 0.15s; margin-bottom: 20px; font-weight: 600; }
  .add-stop-btn:hover { background: rgba(184,73,10,0.06); }

  /* DAYS ROW */
  .days-row { margin-bottom: 20px; }

  /* STOP COUNT SLIDER */
  .slider-section { margin-bottom: 20px; }
  .slider-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
  .slider-value { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: var(--rust); }
  .range-input { width: 100%; height: 4px; border-radius: 2px; background: var(--border); outline: none; -webkit-appearance: none; cursor: pointer; }
  .range-input::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--rust); cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
  .range-input::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: var(--rust); cursor: pointer; border: none; }
  .slider-labels { display: flex; justify-content: space-between; font-family: 'Josefin Sans', sans-serif; font-size: 9px; letter-spacing: 1px; color: var(--ink-light); margin-top: 4px; }

  /* COLLAPSIBLE */
  .collapsible { border: 1.5px solid var(--border); border-radius: 3px; margin-bottom: 20px; overflow: hidden; }
  .collapsible-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; cursor: pointer; background: var(--parchment); transition: background 0.15s; user-select: none; }
  .collapsible-header:hover { background: var(--parchment-dark); }
  .collapsible-title { font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--ink-light); font-weight: 600; }
  .collapsible-arrow { font-size: 10px; color: var(--ink-light); transition: transform 0.2s; }
  .collapsible-arrow.open { transform: rotate(180deg); }
  .collapsible-body { padding: 16px; background: var(--card); border-top: 1px solid var(--border); }

  /* TOGGLE */
  .toggle-item { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .toggle-label { font-family: 'Josefin Sans', sans-serif; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink-light); font-weight: 600; }
  .toggle { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: var(--border); border-radius: 22px; transition: 0.2s; }
  .toggle-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.2s; }
  input:checked + .toggle-slider { background: var(--sage); }
  input:checked + .toggle-slider:before { transform: translateX(18px); }

  /* VIBES */
  .vibes { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
  .vibe-btn { padding: 6px 14px; border: 1.5px solid var(--border); border-radius: 20px; background: var(--parchment); font-family: 'Josefin Sans', sans-serif; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink-light); cursor: pointer; transition: all 0.15s; font-weight: 600; }
  .vibe-btn:hover { border-color: var(--rust); color: var(--rust); }
  .vibe-btn.active { background: var(--rust); border-color: var(--rust); color: white; }

  .btn-primary { width: 100%; padding: 14px 28px; background: var(--rust); color: white; border: none; border-radius: 3px; font-family: 'Josefin Sans', sans-serif; font-size: 13px; letter-spacing: 2.5px; text-transform: uppercase; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 3px 3px 0 var(--ink-light); }
  .btn-primary:hover { background: var(--rust-light); transform: translate(-1px,-1px); box-shadow: 4px 4px 0 var(--ink-light); }
  .btn-primary:active { transform: translate(1px,1px); box-shadow: 2px 2px 0 var(--ink-light); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .error-msg { background: #fdf0ed; border: 1.5px solid #e8b4a0; border-radius: 3px; padding: 12px 16px; font-size: 13px; color: #8b2500; margin-top: 12px; }

  .loading-state { text-align: center; padding: 80px 20px; animation: fadeUp 0.4s ease both; }
  .loading-compass { font-size: 48px; display: block; margin-bottom: 20px; animation: spin 3s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .loading-text { font-family: 'Playfair Display', serif; font-size: 22px; font-style: italic; color: var(--ink-light); margin-bottom: 8px; }
  .loading-sub { font-family: 'Josefin Sans', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); }

  .review-layout { animation: fadeUp 0.5s ease both; }
  .section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; }
  .section-title span { color: var(--rust); font-style: italic; }
  .section-meta { font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--ink-light); }
  .route-bar { background: var(--card); border: 1.5px solid var(--border); border-radius: 3px; padding: 12px 20px; display: flex; align-items: center; gap: 10px; margin-bottom: 28px; font-family: 'Josefin Sans', sans-serif; font-size: 12px; letter-spacing: 1px; color: var(--ink-light); flex-wrap: wrap; }
  .route-bar strong { color: var(--ink); font-size: 13px; }
  .route-arrow { color: var(--rust); }
  .stops-grid { display: grid; gap: 14px; margin-bottom: 32px; }
  .stop-card { background: var(--card); border: 1.5px solid var(--border); border-radius: 4px; padding: 20px 22px; display: grid; grid-template-columns: 36px 1fr auto; gap: 16px; align-items: start; position: relative; overflow: hidden; }
  .stop-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--border); transition: background 0.2s; }
  .stop-card.approved::before { background: var(--sage); }
  .stop-card.rejected { opacity: 0.45; }
  .stop-number { width: 36px; height: 36px; border-radius: 50%; background: var(--parchment-dark); border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: var(--ink-light); flex-shrink: 0; }
  .stop-card.approved .stop-number { background: var(--sage); border-color: var(--sage); color: white; }
  .stop-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
  .stop-type { font-family: 'Josefin Sans', sans-serif; font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--rust); font-weight: 600; margin-bottom: 7px; }
  .stop-desc { font-size: 13px; color: var(--ink-light); line-height: 1.65; }
  .stop-why { font-size: 12px; color: var(--sage); font-style: italic; margin-top: 6px; line-height: 1.5; }
  .stop-actions { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
  .action-btn { width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--border); background: var(--parchment); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.15s; }
  .action-btn.approve:hover, .action-btn.approve.active { background: var(--sage); border-color: var(--sage); color: white; }
  .action-btn.reject:hover, .action-btn.reject.active { background: #c0392b; border-color: #c0392b; color: white; }
  .build-btn-wrap { text-align: center; }
  .btn-secondary { padding: 13px 36px; background: transparent; color: var(--rust); border: 1.5px solid var(--rust); border-radius: 3px; font-family: 'Josefin Sans', sans-serif; font-size: 12px; letter-spacing: 2.5px; text-transform: uppercase; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-right: 12px; }
  .btn-secondary:hover { background: var(--rust); color: white; }

  .final-layout { animation: fadeUp 0.5s ease both; }
  .trip-title-block { text-align: center; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 2px solid var(--border); position: relative; }
  .trip-title-block::after { content: '✦ ✦ ✦'; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); background: var(--parchment); padding: 0 12px; font-size: 10px; color: var(--gold); letter-spacing: 6px; }
  .trip-eyebrow { font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--rust); font-weight: 600; margin-bottom: 10px; }
  .trip-big-title { font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 900; line-height: 1.1; color: var(--ink); margin-bottom: 10px; }
  .trip-big-title em { color: var(--rust); font-style: italic; }
  .trip-stats { display: flex; justify-content: center; gap: 32px; margin-top: 18px; flex-wrap: wrap; }
  .trip-stat { text-align: center; font-family: 'Josefin Sans', sans-serif; }
  .trip-stat-num { font-size: 20px; font-weight: 600; color: var(--ink); display: block; }
  .trip-stat-label { font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--ink-light); }
  .final-body { display: grid; grid-template-columns: 1fr 420px; gap: 32px; align-items: start; }
  .map-panel { background: var(--card); border: 1.5px solid var(--border); border-radius: 4px; overflow: hidden; box-shadow: 4px 4px 0 var(--border); position: sticky; top: 80px; }
  .map-header { padding: 12px 18px; border-bottom: 1px solid var(--border); font-family: 'Josefin Sans', sans-serif; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: var(--ink-light); font-weight: 600; }
  .map-container { height: 480px; }
  .gas-estimate { background: var(--parchment-dark); border: 1px solid var(--border); border-radius: 3px; padding: 12px 16px; margin-top: 12px; font-family: 'Josefin Sans', sans-serif; font-size: 11px; letter-spacing: 1px; color: var(--ink-light); display: flex; gap: 20px; flex-wrap: wrap; }
  .gas-stat { display: flex; flex-direction: column; }
  .gas-stat-val { font-size: 16px; font-weight: 600; color: var(--ink); font-family: 'Playfair Display', serif; }
  .gas-stat-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
  .itinerary-stop { display: flex; gap: 20px; margin-bottom: 28px; animation: fadeUp 0.4s ease both; }
  .it-line { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .it-dot { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: white; flex-shrink: 0; box-shadow: 2px 2px 0 rgba(0,0,0,0.15); }
  .it-dot.start { background: var(--sage); }
  .it-dot.waypoint { background: var(--rust); }
  .it-dot.end { background: var(--sky); }
  .it-connector { width: 2px; flex: 1; min-height: 28px; background: repeating-linear-gradient(to bottom, var(--border) 0, var(--border) 4px, transparent 4px, transparent 8px); margin: 6px 0; }
  .it-content { padding-top: 6px; flex: 1; }
  .it-stop-type { font-family: 'Josefin Sans', sans-serif; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: var(--rust); font-weight: 600; margin-bottom: 3px; }
  .it-stop-type.start { color: var(--sage); }
  .it-stop-type.end { color: var(--sky); }
  .it-stop-name { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
  .it-stop-body { font-size: 13px; color: var(--ink-light); line-height: 1.7; margin-bottom: 8px; }
  .it-tip { display: inline-flex; align-items: center; gap: 6px; background: var(--parchment-dark); border: 1px solid var(--border); border-radius: 2px; padding: 5px 10px; font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 1px; color: var(--sage); font-weight: 600; }
  .reset-btn { display: block; margin: 40px auto 0; padding: 10px 28px; background: transparent; border: 1.5px solid var(--border); border-radius: 3px; font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--ink-light); cursor: pointer; transition: all 0.2s; }
  .reset-btn:hover { border-color: var(--rust); color: var(--rust); }
  .mapboxgl-popup-content { font-family: 'Josefin Sans', sans-serif; font-size: 12px; padding: 8px 12px; border-radius: 3px; }

  @media (max-width: 900px) {
    .header { padding: 16px 20px; }
    .intro-card { padding: 28px 20px; }
    .form-row { grid-template-columns: 1fr; }
    .final-body { grid-template-columns: 1fr; }
    .map-panel { position: static; }
    .trip-big-title { font-size: 28px; }
  }
`;

const VIBES = ["Coastal", "Mountains", "Small Towns", "Desert", "Forests", "Historic", "Off-Beat", "Food & Wine"];

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

async function geocodeSearch(query) {
  if (!query || query.length < 2 || !MAPBOX_TOKEN) return [];
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5&country=US&types=place,address,poi,region`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.features || [];
  } catch {
    return [];
  }
}

async function getRoute(coordinates, avoidTolls) {
  if (!MAPBOX_TOKEN || coordinates.length < 2) return null;
  try {
    const coords = coordinates.map(c => c.join(',')).join(';');
    const exclude = avoidTolls ? '&exclude=toll' : '';
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?access_token=${MAPBOX_TOKEN}&geometries=geojson&overview=full${exclude}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.routes || !data.routes[0]) return null;
    return { geometry: data.routes[0].geometry, distance: data.routes[0].distance };
  } catch {
    return null;
  }
}

async function getGasPrice() {
  try {
    const res = await fetch('/api/gasprice');
    const data = await res.json();
    return data.price || 3.50;
  } catch {
    return 3.50;
  }
}

function AutocompleteInput({ value, onChange, onSelect, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const debounceRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    setHighlighted(-1);
    clearTimeout(debounceRef.current);
    if (val.length > 1) {
      debounceRef.current = setTimeout(async () => {
        const results = await geocodeSearch(val);
        setSuggestions(results);
        setOpen(results.length > 0);
      }, 300);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  };

  const handleSelect = (feature) => {
    onSelect(feature.place_name, feature.center);
    setSuggestions([]);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, suggestions.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    if (e.key === 'Enter' && highlighted >= 0) { e.preventDefault(); handleSelect(suggestions[highlighted]); }
    if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div className="autocomplete-wrap">
      <input
        className="form-input"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="false"
      />
      {open && suggestions.length > 0 && (
        <div className="autocomplete-dropdown">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className={`autocomplete-item${i === highlighted ? ' highlighted' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
            >
              {s.place_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MapView({ stops, routeGeometry }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (map.current || !MAPBOX_TOKEN) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      zoom: 4,
      center: [-98, 39],
    });
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  }, []);

  useEffect(() => {
    if (!map.current || !stops?.length) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    const bounds = new mapboxgl.LngLatBounds();
    stops.forEach((stop, i) => {
      if (!stop.coords) return;
      const isStart = i === 0;
      const isEnd = i === stops.length - 1;
      const color = isStart ? '#4a6741' : isEnd ? '#3a6b8a' : '#b8490a';
      const label = isStart ? 'A' : isEnd ? 'B' : String(i);
      const el = document.createElement('div');
      el.style.cssText = `width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};display:flex;align-items:center;justify-content:center;box-shadow:2px 2px 6px rgba(0,0,0,0.3);cursor:pointer;`;
      const inner = document.createElement('div');
      inner.style.cssText = `transform:rotate(45deg);color:white;font-family:'Playfair Display',serif;font-size:13px;font-weight:700;`;
      inner.textContent = label;
      el.appendChild(inner);
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(stop.coords)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(stop.name))
        .addTo(map.current);
      markersRef.current.push(marker);
      bounds.extend(stop.coords);
    });
    if (stops.filter(s => s.coords).length > 0) {
      map.current.fitBounds(bounds, { padding: 60, maxZoom: 12 });
    }
  }, [stops]);

  useEffect(() => {
    if (!map.current || !routeGeometry) return;
    const addRoute = () => {
      if (map.current.getSource('route')) {
        map.current.getSource('route').setData({ type: 'Feature', geometry: routeGeometry });
      } else {
        map.current.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: routeGeometry } });
        map.current.addLayer({ id: 'route', type: 'line', source: 'route', paint: { 'line-color': '#b8490a', 'line-width': 3, 'line-dasharray': [2, 1] } });
      }
    };
    if (map.current.isStyleLoaded()) { addRoute(); } else { map.current.on('load', addRoute); }
  }, [routeGeometry]);

  return (
    <div className="map-panel">
      <div className="map-header">Live Route Map</div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default function Driftway() {
  const [phase, setPhase] = useState("intro");
  const [origin, setOrigin] = useState({ text: '', coords: null });
  const [destination, setDestination] = useState({ text: '', coords: null });
  const [waypoints, setWaypoints] = useState([]);
  const [days, setDays] = useState("3");
  const [stopCount, setStopCount] = useState(5);
  const [mpg, setMpg] = useState("28");
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [travelCostOpen, setTravelCostOpen] = useState(false);
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [stops, setStops] = useState([]);
  const [approved, setApproved] = useState({});
  const [error, setError] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [gasData, setGasData] = useState(null);
  const [mapStops, setMapStops] = useState([]);

  const toggleVibe = (v) => setSelectedVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const toggleStop = (id, val) => setApproved(prev => ({ ...prev, [id]: prev[id] === val ? null : val }));
  const finalStops = stops.filter(s => approved[s.id] !== false);

  const addWaypoint = () => setWaypoints(prev => [...prev, { text: '', coords: null }]);
  const removeWaypoint = (i) => setWaypoints(prev => prev.filter((_, idx) => idx !== i));
  const updateWaypoint = (i, text, coords = null) => setWaypoints(prev => prev.map((w, idx) => idx === i ? { text, coords } : w));

  async function generateStops() {
    if (!origin.text || !destination.text) { setError("Please enter both a starting point and destination."); return; }
    setError("");
    setPhase("loading");
    const vibeStr = selectedVibes.length ? selectedVibes.join(", ") : "varied and interesting";
    const waypointStr = waypoints.filter(w => w.text).map(w => w.text).join(", ");
    const routeDesc = waypointStr ? `${origin.text} → ${waypointStr} → ${destination.text}` : `${origin.text} → ${destination.text}`;
    const STOP_TYPES = ["Scenic Overlook","Historic Landmark","Natural Wonder","Small Town Gem","State/National Park","Roadside Attraction","Culinary Stop","Hidden Gem"];
    const prompt = `You are a road trip curator. Generate exactly ${stopCount} scenic stops for a road trip: ${routeDesc}. Trip length: ${days} days. Vibe: ${vibeStr}.

For each stop provide: name (specific real place name), type (one of: ${STOP_TYPES.join(", ")}), description (2 sentences), why (1 sentence on why it fits this specific route), distanceNote (rough drive from previous stop), insiderTip (1 actionable sentence).

Respond ONLY with a valid JSON array of exactly ${stopCount} items, no markdown, no preamble:
[{"name":"...","type":"...","description":"...","why":"...","distanceNote":"...","insiderTip":"..."}]`;

    try {
      const parsed = await callAI(prompt);
      const withIds = parsed.map((s, i) => ({ ...s, id: `stop_${i}` }));
      setStops(withIds);
      const initApproved = {};
      withIds.forEach(s => { initApproved[s.id] = true; });
      setApproved(initApproved);
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
    const prompt = `Create a concise road trip itinerary from ${origin.text} to ${destination.text} over ${days} days, hitting these stops in order: ${stopNames}.

For each stop (including origin and destination), write a 2-sentence atmospheric description.

Respond ONLY with valid JSON, no markdown:
{"stops":[{"name":"...","description":"...","type":"start|waypoint|end"}]}`;

    try {
      const parsed = await callAI(prompt);
      setItinerary(parsed);
      const geocoded = await Promise.all(
        parsed.stops.map(async (stop) => {
          const results = await geocodeSearch(stop.name);
          return { ...stop, coords: results[0]?.center || null };
        })
      );
      setMapStops(geocoded);
      const coordList = geocoded.filter(s => s.coords).map(s => s.coords);
      if (coordList.length >= 2) {
        const route = await getRoute(coordList, avoidTolls);
        setRouteData(route);
        if (route && mpg && travelCostOpen) {
          const distanceMiles = route.distance * 0.000621371;
          const gallons = distanceMiles / parseFloat(mpg);
          const price = await getGasPrice();
          setGasData({ distanceMiles: Math.round(distanceMiles), gallons: gallons.toFixed(1), price, total: (gallons * price).toFixed(2) });
        } else if (route) {
          const distanceMiles = route.distance * 0.000621371;
          setGasData({ distanceMiles: Math.round(distanceMiles), gallons: null, price: null, total: null });
        }
      }
      setPhase("final");
    } catch (e) {
      setError("Couldn't build itinerary. Please try again.");
    }
    setLoadingItinerary(false);
  }

  function reset() {
    setPhase("intro"); setOrigin({ text: '', coords: null }); setDestination({ text: '', coords: null });
    setWaypoints([]); setDays("3"); setStopCount(5); setMpg("28"); setAvoidTolls(false);
    setSelectedVibes([]); setStops([]); setApproved({}); setItinerary(null);
    setRouteData(null); setGasData(null); setMapStops([]); setError("");
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
              <p className="intro-desc">Enter your route, add stops, and we'll suggest scenic detours and hidden gems — then build a full itinerary around the ones you choose.</p>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Starting Point</label>
                  <AutocompleteInput value={origin.text} onChange={(t) => setOrigin({ text: t, coords: null })} onSelect={(t, c) => setOrigin({ text: t, coords: c })} placeholder="e.g. Portland, OR" />
                </div>
                <div className="form-group">
                  <label className="form-label">Destination</label>
                  <AutocompleteInput value={destination.text} onChange={(t) => setDestination({ text: t, coords: null })} onSelect={(t, c) => setDestination({ text: t, coords: c })} placeholder="e.g. San Francisco, CA" />
                </div>
              </div>

              {waypoints.length > 0 && (
                <div className="waypoints-section">
                  {waypoints.map((wp, i) => (
                    <div key={i} className="waypoint-row">
                      <span className="waypoint-label">Stop {i + 1}</span>
                      <AutocompleteInput value={wp.text} onChange={(t) => updateWaypoint(i, t)} onSelect={(t, c) => updateWaypoint(i, t, c)} placeholder={`Enter location`} />
                      <button className="remove-btn" onClick={() => removeWaypoint(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}
              <button className="add-stop-btn" onClick={addWaypoint}>+ Add a stop</button>

              <div className="days-row">
                <div className="form-group">
                  <label className="form-label">Trip Length</label>
                  <select className="form-select" value={days} onChange={e => setDays(e.target.value)}>
                    {["1","2","3","4","5","6","7","10","14"].map(d => <option key={d} value={d}>{d} day{d !== "1" ? "s" : ""}</option>)}
                  </select>
                </div>
              </div>

              <div className="slider-section">
                <div className="slider-header">
                  <label className="form-label">Suggested Stops</label>
                  <span className="slider-value">{stopCount}</span>
                </div>
                <input type="range" className="range-input" min="1" max="8" value={stopCount} onChange={e => setStopCount(parseInt(e.target.value))} />
                <div className="slider-labels"><span>1</span><span>8</span></div>
              </div>

              <div className="collapsible">
                <div className="collapsible-header" onClick={() => setTravelCostOpen(o => !o)}>
                  <span className="collapsible-title">Estimate Travel Cost</span>
                  <span className={`collapsible-arrow${travelCostOpen ? ' open' : ''}`}>▼</span>
                </div>
                {travelCostOpen && (
                  <div className="collapsible-body">
                    <div className="toggle-item">
                      <label className="toggle">
                        <input type="checkbox" checked={avoidTolls} onChange={e => setAvoidTolls(e.target.checked)} />
                        <span className="toggle-slider"></span>
                      </label>
                      <span className="toggle-label">Avoid Tolls</span>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vehicle MPG</label>
                      <input className="form-input" type="number" min="5" max="150" value={mpg} onChange={e => setMpg(e.target.value)} placeholder="28" />
                    </div>
                  </div>
                )}
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
                <strong>{origin.text}</strong>
                {waypoints.filter(w => w.text).map((w, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="route-arrow">⟶</span>
                    <strong>{w.text}</strong>
                  </span>
                ))}
                <span className="route-arrow">⟶</span>
                <strong>{destination.text}</strong>
                <span style={{ marginLeft: 'auto' }}>{days} days · {avoidTolls ? 'No tolls · ' : ''}{selectedVibes.join(", ") || "Mixed vibe"}</span>
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
                <h1 className="trip-big-title">{origin.text.split(',')[0]} <em>to</em><br />{destination.text.split(',')[0]}</h1>
                <div className="trip-stats">
                  <div className="trip-stat"><span className="trip-stat-num">{days}</span><span className="trip-stat-label">Days</span></div>
                  <div className="trip-stat"><span className="trip-stat-num">{itinerary.stops.length - 2}</span><span className="trip-stat-label">Stops</span></div>
                  {gasData?.distanceMiles && <div className="trip-stat"><span className="trip-stat-num">{gasData.distanceMiles}</span><span className="trip-stat-label">Miles</span></div>}
                  {gasData?.total && <div className="trip-stat"><span className="trip-stat-num">${gasData.total}</span><span className="trip-stat-label">Est. Gas</span></div>}
                </div>
              </div>

              <div className="final-body">
                <div>
                  {itinerary.stops.map((stop, i) => (
                    <div key={i}>
                      <div className="itinerary-stop" style={{ animationDelay: `${i * 0.08}s` }}>
                        <div className="it-line">
                          <div className={`it-dot ${stop.type}`}>{stop.type === "start" ? "A" : stop.type === "end" ? "B" : i}</div>
                          {i < itinerary.stops.length - 1 && <div className="it-connector" />}
                        </div>
                        <div className="it-content">
                          <div className={`it-stop-type ${stop.type}`}>{stop.type === "start" ? "Departure" : stop.type === "end" ? "Destination" : `Stop ${i}`}</div>
                          <div className="it-stop-name">{stop.name}</div>
                          <div className="it-stop-body">{stop.description}</div>
                          {stops.find(s => s.name === stop.name)?.insiderTip && (
                            <div className="it-tip">💡 {stops.find(s => s.name === stop.name).insiderTip}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {gasData?.total && (
                    <div className="gas-estimate">
                      <div className="gas-stat"><span className="gas-stat-val">{gasData.distanceMiles} mi</span><span className="gas-stat-label">Total Distance</span></div>
                      <div className="gas-stat"><span className="gas-stat-val">{gasData.gallons} gal</span><span className="gas-stat-label">Est. Fuel</span></div>
                      <div className="gas-stat"><span className="gas-stat-val">${gasData.price?.toFixed(2)}/gal</span><span className="gas-stat-label">Regional Avg</span></div>
                      <div className="gas-stat"><span className="gas-stat-val">${gasData.total}</span><span className="gas-stat-label">Est. Total Cost</span></div>
                    </div>
                  )}
                </div>
                <MapView stops={mapStops} routeGeometry={routeData?.geometry} />
              </div>
              <button className="reset-btn" onClick={reset}>← Plan Another Trip</button>
            </div>
          )}

        </main>
      </div>
    </>
  );
}
