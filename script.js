// ===== TAB SWITCHING =====
function showTabBase(name) {
    ['data-tab', 'sim-tab', 'sponsors-tab', 'plan-tab', 'vehicles-tab'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    ['data', 'plan', 'setup', 'sponsors', 'simulation', 'help'].forEach(t => {
        const btn = document.getElementById('btn-' + t);
        if (btn) btn.classList.remove('active');
    });
    const btn = document.getElementById('btn-' + name);
    if (btn) btn.classList.add('active');

    if (name === 'data') {
        document.getElementById('data-tab').style.display = 'flex';
    } else if (name === 'sim' || name === 'simulation') {
        document.getElementById('sim-tab').style.display = 'flex';
    } else if (name === 'sponsors') {
        document.getElementById('sponsors-tab').style.display = 'flex';
    } else if (name === 'plan') {
        document.getElementById('plan-tab').style.display = 'flex';
    } else if (name === 'setup' || name === 'vehicles') {
        document.getElementById('vehicles-tab').style.display = 'flex';
    }
}

function showTab(name) {
    showTabBase(name);
    // After the tab is visible, let Leaflet know the container size
    requestAnimationFrame(() => {
        if (name === 'data' && dataMap) dataMap.invalidateSize();
        if (name === 'plan' && planMap)  planMap.invalidateSize();
    });
}

// Sub-tab click wiring — called after tabs are injected into DOM
function initSubTabs() {
    document.querySelectorAll('.sub-tab').forEach(t => {
        t.addEventListener('click', () => {
            document.querySelectorAll('.sub-tab').forEach(x => x.classList.remove('active'));
            t.classList.add('active');
        });
    });
}

// ===== HUD DRAWING =====
function drawHUD() {
    const canvas = document.getElementById('hudCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 420, H = 390;
    ctx.clearRect(0, 0, W, H);

    const TAPE_W = 48;
    const horizonY = H * 0.54;

    // Sky
    ctx.fillStyle = '#4a7fb5';
    ctx.fillRect(0, 0, W, horizonY);

    // Ground
    ctx.fillStyle = '#5a8a22';
    ctx.fillRect(0, horizonY, W, H - horizonY);

    // Pitch ladder lines
    ctx.lineWidth = 1.5;
    ctx.font = '11px Segoe UI';
    for (let p = -20; p <= 20; p += 10) {
        if (p === 0) continue;
        const y = horizonY - p * 8;
        const lw = Math.abs(p) === 10 ? 55 : 75;
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.moveTo(W / 2 - lw, y); ctx.lineTo(W / 2 + lw, y);
        ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.textAlign = 'right';
        ctx.fillText(p.toString(), W / 2 - lw - 4, y + 4);
        ctx.textAlign = 'left';
        ctx.fillText(p.toString(), W / 2 + lw + 4, y + 4);
    }

    // Horizon red line segments (gap in center for aircraft symbol)
    ctx.strokeStyle = '#cc2222';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(TAPE_W, horizonY); ctx.lineTo(W / 2 - 60, horizonY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W / 2 + 60, horizonY); ctx.lineTo(W - TAPE_W, horizonY); ctx.stroke();

    // Aircraft symbol (red V / chevron)
    ctx.strokeStyle = '#ff3333';
    ctx.lineWidth = 2.5;
    const cx = W / 2, cy = horizonY;
    ctx.beginPath(); ctx.moveTo(cx - 75, cy); ctx.lineTo(cx - 22, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 22, cy); ctx.lineTo(cx + 75, cy); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 22, cy); ctx.lineTo(cx, cy + 16); ctx.lineTo(cx + 22, cy);
    ctx.stroke();
    ctx.fillStyle = '#ff3333';
    ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();

    // Roll / bank arc indicator at top
    const arcCX = W / 2, arcCY = 36, arcR = 118;
    ctx.strokeStyle = 'rgba(255,255,255,0.65)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(arcCX, arcCY, arcR, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();
    const bankAngles = [
        { deg: -60, label: '60', tick: 8 },
        { deg: -45, label: '45', tick: 6 },
        { deg: -20, label: '20', tick: 5 },
        { deg: -10, label: '10', tick: 4 },
        { deg:   0, label: null, tick: 10 },
        { deg:  10, label: '10', tick: 4 },
        { deg:  20, label: '20', tick: 5 },
        { deg:  45, label: '45', tick: 6 },
        { deg:  60, label: '60', tick: 8 },
    ];
    bankAngles.forEach(({ deg, label, tick }) => {
        const rad = (deg - 90) * Math.PI / 180;
        const x1 = arcCX + arcR * Math.cos(rad);
        const y1 = arcCY + arcR * Math.sin(rad);
        const x2 = arcCX + (arcR - tick) * Math.cos(rad);
        const y2 = arcCY + (arcR - tick) * Math.sin(rad);
        ctx.strokeStyle = 'rgba(255,255,255,0.75)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        if (label) {
            const lx = arcCX + (arcR - tick - 11) * Math.cos(rad);
            const ly = arcCY + (arcR - tick - 11) * Math.sin(rad);
            ctx.save();
            ctx.translate(lx, ly);
            ctx.rotate(rad + Math.PI / 2);
            ctx.fillStyle = '#ccc';
            ctx.font = '9px Segoe UI';
            ctx.textAlign = 'center';
            ctx.fillText(label, 0, 3);
            ctx.restore();
        }
    });
    // Roll pointer triangle (red, top = 0 bank)
    ctx.fillStyle = '#ff3333';
    const ptr0rad = (0 - 90) * Math.PI / 180;
    const ptrX = arcCX + arcR * Math.cos(ptr0rad);
    const ptrY = arcCY + arcR * Math.sin(ptr0rad);
    ctx.beginPath();
    ctx.moveTo(ptrX, ptrY - 9);
    ctx.lineTo(ptrX - 5, ptrY + 1);
    ctx.lineTo(ptrX + 5, ptrY + 1);
    ctx.closePath(); ctx.fill();

    // Heading tape (top strip)
    ctx.fillStyle = '#1a2a3a';
    ctx.fillRect(TAPE_W, 0, W - TAPE_W * 2, 24);
    ctx.strokeStyle = '#445566'; ctx.lineWidth = 1;
    ctx.strokeRect(TAPE_W, 0, W - TAPE_W * 2, 24);
    const headings = ['NW', '330', '345', '0', '15', '30', 'NE'];
    ctx.fillStyle = '#ddd'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'center';
    headings.forEach((lbl, i) => {
        const x = TAPE_W + 20 + i * ((W - TAPE_W * 2 - 20) / 6);
        ctx.fillText(lbl, x, 15);
        ctx.strokeStyle = '#667788'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, 19); ctx.lineTo(x, 24); ctx.stroke();
    });
    // Heading triangle pointer (downward)
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.moveTo(W / 2 - 5, 24); ctx.lineTo(W / 2 + 5, 24); ctx.lineTo(W / 2, 18);
    ctx.closePath(); ctx.fill();
    // Center heading value box
    ctx.fillStyle = '#1a2a3a';
    ctx.fillRect(W / 2 - 14, 24, 28, 14);
    ctx.strokeStyle = '#556677'; ctx.lineWidth = 1;
    ctx.strokeRect(W / 2 - 14, 24, 28, 14);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 10px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText('0', W / 2, 34);

    // Left speed tape
    ctx.fillStyle = 'rgba(20,30,40,0.85)';
    ctx.fillRect(0, 28, TAPE_W, H - 28);
    ctx.strokeStyle = '#445566'; ctx.lineWidth = 1;
    ctx.strokeRect(0, 28, TAPE_W, H - 28);
    [10, 5, 0, -5, -10].forEach((v, i) => {
        const y = 70 + i * 52;
        ctx.fillStyle = '#ccc'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'right';
        ctx.fillText(v.toString(), TAPE_W - 5, y + 4);
        ctx.strokeStyle = '#556677'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(TAPE_W - 5, y); ctx.lineTo(TAPE_W, y); ctx.stroke();
    });
    // Speed reference box (green outline)
    ctx.fillStyle = '#0a1a0a';
    ctx.fillRect(0, horizonY - 11, TAPE_W - 1, 22);
    ctx.strokeStyle = '#22cc44'; ctx.lineWidth = 1.5;
    ctx.strokeRect(0, horizonY - 11, TAPE_W - 1, 22);
    ctx.fillStyle = '#22cc44'; ctx.font = 'bold 11px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText('0m/s', TAPE_W / 2 - 1, horizonY + 4);
    // AS / GS labels
    ctx.fillStyle = '#22dd22'; ctx.font = 'bold 10px Segoe UI'; ctx.textAlign = 'left';
    ctx.fillText('AS 0.0m/s', 2, H - 44);
    ctx.fillText('GS 0.0m/s', 2, H - 31);

    // Right altitude tape
    ctx.fillStyle = 'rgba(20,30,40,0.85)';
    ctx.fillRect(W - TAPE_W, 28, TAPE_W, H - 28);
    ctx.strokeStyle = '#445566'; ctx.lineWidth = 1;
    ctx.strokeRect(W - TAPE_W, 28, TAPE_W, H - 28);
    [10, 5, 0, -5, -10].forEach((v, i) => {
        const y = 70 + i * 52;
        ctx.fillStyle = '#ccc'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'left';
        ctx.fillText(v.toString(), W - TAPE_W + 5, y + 4);
        ctx.strokeStyle = '#556677'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(W - TAPE_W, y); ctx.lineTo(W - TAPE_W + 5, y); ctx.stroke();
    });
    // Altitude reference box (green outline)
    ctx.fillStyle = '#0a1a0a';
    ctx.fillRect(W - TAPE_W + 1, horizonY - 11, TAPE_W - 1, 22);
    ctx.strokeStyle = '#22cc44'; ctx.lineWidth = 1.5;
    ctx.strokeRect(W - TAPE_W + 1, horizonY - 11, TAPE_W - 1, 22);
    ctx.fillStyle = '#22cc44'; ctx.font = 'bold 11px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText('0 m', W - TAPE_W / 2, horizonY + 4);
    // Unknown / 0m>0
    ctx.fillStyle = '#ff5522'; ctx.font = 'bold 10px Segoe UI'; ctx.textAlign = 'right';
    ctx.fillText('Unknown', W - 2, H - 44);
    ctx.fillText('0m>0', W - 2, H - 31);

    // Top-right: 0% with red X strikethrough + timer
    ctx.fillStyle = '#ff3333'; ctx.font = 'bold 11px Segoe UI'; ctx.textAlign = 'right';
    ctx.fillText('0%', W - 4, 50);
    ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(W - 28, 39); ctx.lineTo(W - 4, 52); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - 28, 52); ctx.lineTo(W - 4, 39); ctx.stroke();
    ctx.fillStyle = '#cccccc'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'right';
    ctx.fillText('00:00:00', W - 2, 64);

    // Bottom status bar
    ctx.fillStyle = 'rgba(0,0,0,0.78)';
    ctx.fillRect(0, H - 50, W, 50);
    ctx.fillStyle = '#ff3333'; ctx.font = 'bold 13px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText('Not Ready to Arm', W / 2, H - 30);
    ctx.fillStyle = '#ff2222'; ctx.font = 'bold 10px Segoe UI'; ctx.textAlign = 'left';
    ctx.fillText('Bat1', 2, H - 13);
    ctx.fillStyle = '#ffee00';
    ctx.fillText('10.0', 30, H - 13);
    ctx.fillStyle = '#ff2222';
    ctx.fillText('v  0.0 A  0%', 56, H - 13);
    ctx.fillStyle = '#aaaaaa'; ctx.font = '10px Segoe UI';
    ctx.fillText('EKF', 168, H - 13);
    ctx.fillText('Vibe', 195, H - 13);
    ctx.fillStyle = '#ff3333'; ctx.font = 'bold 10px Segoe UI';
    ctx.fillText('GPS: No GPS', 225, H - 13);
}

// ===== LEAFLET MAP SETUP =====
const HOME_LAT = -35.3632627;
const HOME_LNG = 149.1652383;

// Dark political map tiles (CartoDB Dark Matter) — black bg, white outlines
const DARK_POLITICAL = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    { attribution: '&copy; <a href="https://carto.com/">CARTO</a>', subdomains: 'abcd', maxZoom: 20 }
);
const DARK_POLITICAL2 = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    { attribution: '&copy; <a href="https://carto.com/">CARTO</a>', subdomains: 'abcd', maxZoom: 20 }
);
const DARK_POLITICAL3 = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    { attribution: '&copy; <a href="https://carto.com/">CARTO</a>', subdomains: 'abcd', maxZoom: 20 }
);

// Satellite tiles (for team map toggle)
const ESRI_TILES = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles &copy; Esri', maxZoom: 20 }
);
const ESRI_TILES2 = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles &copy; Esri', maxZoom: 20 }
);
const ESRI_TILES3 = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles &copy; Esri', maxZoom: 20 }
);

let dataMap, simMap, planMap;
let droneMarkerData, droneMarkerSim;
let waypoints = [];
let wpPolyline = null;
let totalDist = 0;

const droneIcon = L.divIcon({
    className: '',
    html: '<div style="width:22px;height:22px;background:#22bb44;border:2px solid #1a8832;border-radius:50%;box-shadow:0 0 6px #22bb44;"></div>',
    iconSize: [22, 22], iconAnchor: [11, 11]
});

const homeIcon = L.divIcon({
    className: '',
    html: '<div style="width:14px;height:14px;background:#ff3333;border:2px solid #cc0000;border-radius:50%;"></div>',
    iconSize: [14, 14], iconAnchor: [7, 7]
});

const wpIcon = (n) => L.divIcon({
    className: '',
    html: `<div style="width:18px;height:18px;background:#c8c800;border:2px solid #7ab000;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;color:#000;font-weight:bold;">${n}</div>`,
    iconSize: [18, 18], iconAnchor: [9, 9]
});

// Glowing white home dot icon
const homeGlowIcon = L.divIcon({
    className: '',
    html: '<div class="home-glow-dot"></div>',
    iconSize: [10, 10], iconAnchor: [5, 5]
});

function initDataMap() {
    dataMap = L.map('map-data', { zoomControl: true, attributionControl: false }).setView([22.5, 82.0], 5);
    DARK_POLITICAL.addTo(dataMap);
    // Glowing white home marker at Gwalior
    L.marker([26.209, 78.22], { icon: homeGlowIcon })
        .addTo(dataMap)
        .bindTooltip('Home Base · Gwalior', { permanent: false, direction: 'top' });
    droneMarkerData = L.marker([26.209, 78.22], { icon: droneIcon, draggable: true }).addTo(dataMap);
    droneMarkerData.bindTooltip('Aircraft', { permanent: false });
}

function initSimMap() {
    // Sim tab no longer has a map — guard so startup doesn't crash
    const el = document.getElementById('map-sim');
    if (!el) return;
    simMap = L.map('map-sim', { zoomControl: false, attributionControl: false }).setView([HOME_LAT, HOME_LNG], 16);
    ESRI_TILES2.addTo(simMap);
    L.marker([HOME_LAT, HOME_LNG], { icon: homeIcon, draggable: true }).addTo(simMap)
        .bindTooltip('Home - Drag Me', { permanent: true, direction: 'right', className: 'wp-label' });
    droneMarkerSim = L.marker([HOME_LAT + 0.001, HOME_LNG], { icon: droneIcon }).addTo(simMap);
}

// ===== TEAM DATA =====
// image: path to photo file, or null to show initials
// Gwalior members are spread on the map so pins don't overlap
const TEAM_MEMBERS = [
    {
        id: 1,
        name: 'Parth Soni',
        role: 'Team Lead · Electrical',
        initials: 'PS',
        color: '#c8c800',
        lat: 25.8910, lng: 78.3339,          // Dabra
        city: 'Dabra, Madhya Pradesh',
        branch: 'Electrical', year: '2nd Year',
        work: 'Camera integration, communication and PCB designing, power distribution board designing, voltage regulation, flight time optimisation and payload mechanism robotics.',
        image: null, portfolio: '#', github: '#', linkedin: '#'
    },
    {
        id: 2,
        name: 'Harsh Vardhan Kaushal',
        role: 'Electrical · PCB Design',
        initials: 'HVK',
        color: '#4a9de0',
        lat: 26.2260, lng: 78.1540,              // DD Nagar, Gwalior
        city: 'DD Nagar, Gwalior',
        branch: 'Electrical', year: '2nd Year',
        work: 'Communication and PCB designing, power distribution board designing, voltage regulation and camera integration.',
        image: null, portfolio: '#', github: '#', linkedin: '#'
    },
    {
        id: 3,
        name: 'Rishabh Dohare',
        role: 'Electrical · Ground Station',
        initials: 'RD',
        color: '#ee6644',
        lat: 24.8411, lng: 77.9797,          // Isagarh
        city: 'Isagarh, Madhya Pradesh',
        branch: 'Electrical', year: '2nd Year',
        work: 'Ground station operator, telemetry and fail safe system.',
        image: null, portfolio: '#', github: '#', linkedin: '#'
    },
    {
        id: 4,
        name: 'Ankit Gurjar',
        role: 'AIML · Navigation',
        initials: 'AG',
        color: '#44bb66',
        lat: 26.33, lng: 78.29,              // Gwalior – NE (close)
        city: 'Gwalior, Madhya Pradesh',
        branch: 'AIML', year: '2nd Year',
        work: 'Autonomous navigation and path planning, AI integration, pilot, sensor integration and LIDAR.',
        image: null, portfolio: '#', github: '#', linkedin: '#'
    },
    {
        id: 5,
        name: 'Moksh Dandotiya',
        role: 'AIR · AI / Computer Vision',
        initials: 'MD',
        color: '#aa55ee',
        lat: 26.11, lng: 78.07,              // Gwalior – SW (close)
        city: 'Gwalior, Madhya Pradesh',
        branch: 'AIR', year: '4th Year',
        work: 'AI engineer, computer vision, YOLO, OpenCV and image processing, ground station handling.',
        image: null, portfolio: '#', github: '#', linkedin: '#'
    },
    {
        id: 6,
        name: 'Aryan Bhadoriya',
        role: 'IT · Documentation',
        initials: 'AB',
        color: '#e0aa00',
        lat: 26.2090, lng: 78.2200,              // Adityapuram, Gwalior
        city: 'Adityapuram, Gwalior',
        branch: 'IT', year: '2nd Year',
        work: 'Documentation and logic designing.',
        image: null, portfolio: '#', github: '#', linkedin: '#'
    },
    {
        id: 7,
        name: 'Kuldeep Sikarwar',
        role: 'Mechanical · Frame Design',
        initials: 'KS',
        color: '#dd4488',
        lat: 26.0382, lng: 77.3138,          // Jaura
        city: 'Jaura, Madhya Pradesh',
        branch: 'Mechanical', year: '2nd Year',
        work: 'AutoCAD, frame design, weight optimisation and payload designing.',
        image: null, portfolio: '#', github: '#', linkedin: '#'
    }
];

let activeTeamMember = null;
let adminMode = false;
let teamMapIsDark = true; // true = dark political, false = satellite

// Listen for baud rate change to enable admin mode (9600)
document.getElementById('sel-baud').addEventListener('change', (e) => {
    adminMode = (e.target.value === '9600');
    
    // Update draggable status for all team markers
    TEAM_MEMBERS.forEach(member => {
        if (member._marker) {
            if (adminMode) {
                member._marker.dragging.enable();
            } else {
                member._marker.dragging.disable();
            }
        }
    });

    if (adminMode) {
        console.log("Admin mode enabled: Drag pins to update locations.");
        // We could also show a small toast here if we had a toast system, 
        // for now console log is fine.
    }
});

// Map style toggle — dark political <-> satellite
function toggleTeamMapStyle() {
    if (!planMap) return;   // map not yet initialised (lazy)
    const btn = document.getElementById('team-map-toggle');
    if (teamMapIsDark) {
        // Switch to satellite
        planMap.removeLayer(DARK_POLITICAL3);
        ESRI_TILES3.addTo(planMap);
        teamMapIsDark = false;
        if (btn) btn.classList.add('is-normal');
    } else {
        // Switch back to dark political
        planMap.removeLayer(ESRI_TILES3);
        DARK_POLITICAL3.addTo(planMap);
        teamMapIsDark = true;
        if (btn) btn.classList.remove('is-normal');
    }
}

// Map pin — teardrop location-pin shape
function makeTeamMarker(member) {
    const html = `
        <div style="
            display:flex; flex-direction:column; align-items:center;
            cursor:pointer;
            filter:drop-shadow(0 3px 6px rgba(0,0,0,0.55));
        ">
            <div style="
                width:38px; height:38px; border-radius:50%;
                background:#111;
                border:2.5px solid ${member.color};
                color:${member.color};
                display:flex; align-items:center; justify-content:center;
                font-size:10px; font-weight:900;
                font-family:'Segoe UI',sans-serif;
                letter-spacing:0.3px;
            ">${member.initials}</div>
            <div style="
                width:0; height:0;
                border-left:5px solid transparent;
                border-right:5px solid transparent;
                border-top:9px solid ${member.color};
                margin-top:-2px;
            "></div>
        </div>`;
    // iconAnchor at bottom of the pointer (18, 49) so tip sits on the location
    return L.divIcon({ className: '', html, iconSize: [38, 49], iconAnchor: [19, 49] });
}


// Initialise the team section (replaces old Leaflet map init)
function initPlanMap() {
    populateTeamCards();
    // Set default background text initially
    splitTextAndAnimate('TRINETRA', 'down', '#ffffff');
    
    // Add this to start the cursor physics!
    initTeamHero();
}

let activeHeroText = 'TRINETRA';
let pinnedMember = null; // 🔴 Tracks who is currently pinned
let surnameWrapRef = null; // Tracks the surname DOM element so we can remove it

// The SVG shapes for swapping the cursor
const ARROW_SVG = `<path d="m15 5 4 4-4 4"></path><path d="M19 9H5"></path>`;
const PIN_SVG = `<line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 11.2V6a3 3 0 0 0-6 0v5.2a2 2 0 0 1-1.11 1.35l-1.78.9A2 2 0 0 0 5 15.24Z"></path>`;

function populateTeamCards() {
    const container = document.getElementById('team-thumbnails-container');
    const cursorIcon = document.getElementById('cursor-icon');
    if (!container) return;
    container.innerHTML = '';

    const images = ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop","https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop","https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop","https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop","https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop","https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop","https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?q=80&w=200&auto=format&fit=crop"];
    const thumbsArray = [];
    const baseSize = 60, maxSize = 120, gap = 12, maxDist = 140, containerWidth = 552;
    const startXOffset = (containerWidth - (images.length * baseSize + gap * (images.length - 1))) / 2;

    TEAM_MEMBERS.forEach((member, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'new-team-thumb';
        thumb.innerHTML = `<img src="${images[index % images.length]}" alt="${member.name}">`;
        
        gsap.set(thumb, { x: startXOffset + (index * (baseSize + gap)), yPercent: -50 });

        // ── 1. HOVER LOGIC (Respects the Pin) ──
        thumb.addEventListener('mouseenter', () => {
            // Do nothing if someone is pinned!
            if (pinnedMember) return; 

            const firstName = member.name.split(' ')[0].toUpperCase();
            if (activeHeroText !== firstName) {
                activeHeroText = firstName;
                splitTextAndAnimate(firstName, 'hover', '#F00020'); 
            }
        });

        // ── 2. CLICK LOGIC (The Shift & Reveal) ──
        thumb.addEventListener('click', () => {
            const firstNameText = member.name.split(' ')[0].toUpperCase();
            const lastNameText = member.name.split(' ').slice(1).join(' ').toUpperCase();
            
            // If they clicked the ALREADY pinned member -> UNPIN THEM
            if (pinnedMember === member) {
                pinnedMember = null;
                cursorIcon.innerHTML = ARROW_SVG; // Revert cursor

                // Find the First Name and Surname elements
                const textContainer = document.getElementById('team-bg-text-container');
                const firstNameWrap = textContainer.querySelector('.team-bg-text-wrap:not(.surname)');
                
                // Glide First Name back to Center
                if (firstNameWrap) {
                    gsap.to(firstNameWrap, { x: 0, duration: 0.5, ease: 'power3.out' });
                }

                // Wobble exit the Surname
                if (surnameWrapRef) {
                    const surnameLetters = surnameWrapRef.querySelectorAll('.letter-inner');
                    gsap.to(surnameLetters, {
                        yPercent: 105, duration: 0.35, ease: 'power3.inOut',
                        stagger: { amount: 0.08, from: "edges" },
                        onComplete: () => { 
                            if(surnameWrapRef) surnameWrapRef.remove(); 
                            surnameWrapRef = null;
                        }
                    });
                }
                return;
            }

            // If someone ELSE is pinned, block it. You must unpin first!
            if (pinnedMember !== null) return;

            // PIN NEW MEMBER
            pinnedMember = member;
            cursorIcon.innerHTML = PIN_SVG; // Change cursor

            // Find the current First Name wrapper
            const textContainer = document.getElementById('team-bg-text-container');
            const firstNameWrap = textContainer.querySelector('.team-bg-text-wrap');
            if (!firstNameWrap) return;

            // Generate Surname Wrapper
            surnameWrapRef = document.createElement('div');
            surnameWrapRef.className = 'team-bg-text-wrap surname';
            surnameWrapRef.style.color = '#ffffff';

            [...lastNameText].forEach(char => {
                const box = document.createElement('span'); box.className = 'letter-box';
                const inner = document.createElement('span'); inner.className = 'letter-inner';
                inner.textContent = char === ' ' ? '\u00A0' : char;
                box.appendChild(inner); surnameWrapRef.appendChild(box);
            });
            textContainer.appendChild(surnameWrapRef);

            // ── THE SHIFT MATH ──
            // Measure both words and the gap between them to calculate perfect centering
            const firstWidth = firstNameWrap.offsetWidth;
            const lastWidth = surnameWrapRef.offsetWidth;
            const textGap = 40; // Pixel gap between first and last name

            const slideDistanceFirst = -(lastWidth + textGap) / 2;
            const slideDistanceLast = (firstWidth + textGap) / 2;

            // 1. Shift First Name Left
            gsap.to(firstNameWrap, { x: slideDistanceFirst, duration: 0.5, ease: 'power3.out' });

            // 2. Position Surname Right & Animate Letters Up
            gsap.set(surnameWrapRef, { x: slideDistanceLast });
            const surnameLetters = surnameWrapRef.querySelectorAll('.letter-inner');
            gsap.set(surnameLetters, { yPercent: 105 });
            
            gsap.to(surnameLetters, { 
                yPercent: 0, duration: 0.5, ease: 'power3.out', 
                stagger: { amount: 0.12, from: "center" } 
            });
        });
        
        thumbsArray.push(thumb);
        container.appendChild(thumb);
    });

    container.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const containerRect = container.getBoundingClientRect();
        const sizes = thumbsArray.map((_, i) => {
            const centerX = containerRect.left + startXOffset + (i * (baseSize + gap)) + (baseSize / 2);
            const dist = Math.min(Math.abs(mouseX - centerX), maxDist);
            return baseSize + (maxSize - baseSize) * Math.pow(1 - dist / maxDist, 1.4);
        });

        let currentX = (containerWidth - (sizes.reduce((a, b) => a + b, 0) + (gap * (sizes.length - 1)))) / 2;
        thumbsArray.forEach((thumb, i) => {
            gsap.to(thumb, { x: currentX, width: sizes[i], height: sizes[i], duration: 0.15, overwrite: 'auto' });
            currentX += sizes[i] + gap;
        });
    });

    // ── LEAVING THE DOCK (Respects the Pin) ──
    container.addEventListener('mouseleave', () => {
        // Do nothing to the text if someone is pinned!
        if (!pinnedMember && activeHeroText !== 'TRINETRA') {
            activeHeroText = 'TRINETRA';
            splitTextAndAnimate('TRINETRA', 'main', '#ffffff'); 
        }
        thumbsArray.forEach((thumb, i) => {
            gsap.to(thumb, { x: startXOffset + (i * (baseSize + gap)), width: baseSize, height: baseSize, duration: 0.45, ease: 'back.out(1.2)', overwrite: 'auto' });
        });
    });
}

function initTeamHero() {
    const cursor = document.getElementById('team-cursor');
    const container = document.getElementById('team-thumbnails-container'); 
    
    if (!cursor || !container) return;

    const xSet = gsap.quickSetter(cursor, "x", "px");
    const ySet = gsap.quickSetter(cursor, "y", "px");

    const moveCursor = (e) => {
        xSet(e.clientX);
        ySet(e.clientY);
    };

    container.addEventListener('mouseenter', (e) => {
        gsap.killTweensOf(cursor);
        gsap.set(cursor, { visibility: 'visible' });
        
        // 🔴 FIXED ENTRANCE: Slower duration (0.5) and smooth ease (power3.out)
        // This stops it from "popping" instantly and mirrors the exit fade perfectly.
        gsap.to(cursor, { 
            scale: 1, 
            opacity: 1, 
            duration: 0.5, 
            ease: 'power3.out' 
        });
        
        window.addEventListener('mousemove', moveCursor);
    });

    container.addEventListener('mouseleave', (e) => {
        window.removeEventListener('mousemove', moveCursor);
        
        const r = container.getBoundingClientRect();
        const centerX = r.left + r.width / 2;
        const centerY = r.top + r.height / 2;
        const exitX = (e.clientX - centerX) * 0.5;
        const exitY = (e.clientY - centerY) * 0.5;

        gsap.to(cursor, {
            scale: 0,
            opacity: 0,
            x: `+=${exitX}`,
            y: `+=${exitY}`,
            duration: 0.5,
            ease: 'power3.out',
            onComplete: () => gsap.set(cursor, { visibility: 'hidden' })
        });
    });
}

// ── RECONSTRUCTED TEXT ANIMATION LOGIC (PERFECT TIMING) ──
function splitTextAndAnimate(text, type, color) {
    const container = document.getElementById('team-bg-text-container');
    if (!container) return;

    const allOldWraps = container.querySelectorAll('.team-bg-text-wrap');
    
    // Increased the delay slightly so the new word WAITS for the fast exit to finish
    const needsDelay = allOldWraps.length > 0;
    const incomingDelay = needsDelay ? 0.25 : 0; 

    const upperText = text.toUpperCase();
    const newWrap = document.createElement('div');
    newWrap.className = 'team-bg-text-wrap';
    newWrap.style.color = color;

    [...upperText].forEach(char => {
        const letterBox = document.createElement('span');
        letterBox.className = 'letter-box';
        const letterInner = document.createElement('span');
        letterInner.className = 'letter-inner';
        letterInner.textContent = char === ' ' ? '\u00A0' : char; 
        letterBox.appendChild(letterInner);
        newWrap.appendChild(letterBox);
    });

    container.appendChild(newWrap);
    const newInners = newWrap.querySelectorAll('.letter-inner');

    if (type === 'main') {
        gsap.set(newInners, { yPercent: -105 }); // TRINETRA starts ABOVE
    } else {
        gsap.set(newInners, { yPercent: 105 });  // Names start BELOW
    }

    // ── INCOMING ANIMATION ──
    gsap.to(newInners, {
        yPercent: 0,
        duration: 0.5,
        delay: incomingDelay, // Waits exactly 0.25s for the screen to clear
        ease: 'power3.out',
        stagger: {
            amount: 0.12,      
            from: "center"     
        }
    });

    // ── OUTGOING ANIMATION (Faster!) ──
    allOldWraps.forEach(oldWrap => {
        const oldInners = oldWrap.querySelectorAll('.letter-inner');
        
        gsap.killTweensOf(oldInners);

        gsap.to(oldInners, {
            yPercent: 105,     
            duration: 0.35,     // FAST EXIT: Dropped from 0.35s to 0.2s
            ease: 'power3.inOut',
            stagger: {
                amount: 0.08,   // FAST STAGGER: The wobble happens much quicker now
                from: "edges"  
            },
            onComplete: () => { oldWrap.remove(); }
        });
    });
}


// ===== CONNECT PANEL =====
let cpOpen = false;
let cpActiveTab = 'member';

function toggleConnectPanel() {
    cpOpen ? closeConnectPanel() : openConnectPanel();
}

function openConnectPanel() {
    document.getElementById('connect-panel').classList.add('open');
    document.getElementById('connect-btn').classList.add('connected');
    cpOpen = true;
}

function closeConnectPanel() {
    document.getElementById('connect-panel').classList.remove('open');
    document.getElementById('connect-btn').classList.remove('connected');
    cpOpen = false;
}

function switchCPTab(tab) {
    cpActiveTab = tab;
    const pill = document.getElementById('cp-toggle-pill');
    const memberForm   = document.getElementById('cp-form-member');
    const sponsorForm  = document.getElementById('cp-form-sponsor');
    const btnMember    = document.getElementById('cpt-member');
    const btnSponsor   = document.getElementById('cpt-sponsor');

    if (tab === 'member') {
        pill.classList.remove('right');
        memberForm.style.display  = '';
        sponsorForm.style.display = 'none';
        btnMember.classList.add('active');
        btnSponsor.classList.remove('active');
    } else {
        pill.classList.add('right');
        memberForm.style.display  = 'none';
        sponsorForm.style.display = '';
        btnMember.classList.remove('active');
        btnSponsor.classList.add('active');
    }
}

// Close panel when clicking outside of it
document.addEventListener('click', (e) => {
    if (!cpOpen) return;
    const wrap = document.getElementById('connect-wrap');
    if (wrap && !wrap.contains(e.target)) closeConnectPanel();
});

function submitCPMember() {
    const name    = document.getElementById('cp-jn-name').value.trim();
    const email   = document.getElementById('cp-jn-email').value.trim();
    const college = document.getElementById('cp-jn-college').value.trim();
    const domain  = document.getElementById('cp-jn-domain').value;
    const year    = document.getElementById('cp-jn-year').value;
    const msg     = document.getElementById('cp-jn-msg').value.trim();

    if (!name || !email || !domain) {
        alert('Please fill in your name, email, and select a domain.');
        return;
    }

    const subject = encodeURIComponent(`[Join Us] ${domain} – ${name}`);
    const body = encodeURIComponent(
        `Team Trinetra – Join Application\n==================================\n` +
        `Name    : ${name}\nEmail   : ${email}\nCollege : ${college || '—'}\n` +
        `Domain  : ${domain}\nYear    : ${year || '—'}\n\nWhy Join?\n${msg || '—'}\n`
    );
    window.location.href = `mailto:${TEAM_EMAIL}?subject=${subject}&body=${body}`;
    closeConnectPanel();
}

function submitCPSponsor() {
    const org   = document.getElementById('cp-sp-org').value.trim();
    const name  = document.getElementById('cp-sp-name').value.trim();
    const email = document.getElementById('cp-sp-email').value.trim();
    const type  = document.getElementById('cp-sp-type').value;
    const msg   = document.getElementById('cp-sp-msg').value.trim();

    if (!name || !email) {
        alert('Please fill in at least your name and email.');
        return;
    }

    const subject = encodeURIComponent(`[Sponsorship] ${type || 'Inquiry'} – ${org || name}`);
    const body = encodeURIComponent(
        `Sponsorship Inquiry\n===================\n` +
        `Organization : ${org || '—'}\nContact : ${name}\nEmail   : ${email}\nType    : ${type || '—'}\n\nMessage:\n${msg || '—'}\n`
    );
    window.location.href = `mailto:${TEAM_EMAIL}?subject=${subject}&body=${body}`;
    closeConnectPanel();
}


// ===== TEAM EMAIL =====
const TEAM_EMAIL = 'team.trinetra2026@gmail.com';

// ===== MODAL OPEN / CLOSE =====
function openModal(id) {
    document.getElementById('modal-' + id).classList.add('open');
}

function closeModal(id) {
    document.getElementById('modal-' + id).classList.remove('open');
}

function closeModalOutside(event, id) {
    // Only close if clicking directly on the dark overlay (not the box inside)
    if (event.target === document.getElementById(id)) closeModal(id.replace('modal-', ''));
}

// Esc key closes any open modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        ['sponsors', 'joinus'].forEach(id => closeModal(id));
    }
});

// ===== SPONSOR FORM SUBMIT =====
function submitSponsor() {
    const org   = document.getElementById('sp-org').value.trim();
    const name  = document.getElementById('sp-name').value.trim();
    const email = document.getElementById('sp-email').value.trim();
    const type  = document.getElementById('sp-type').value;
    const msg   = document.getElementById('sp-msg').value.trim();

    if (!name || !email) {
        alert('Please fill in at least your name and email.');
        return;
    }

    const subject = encodeURIComponent(`[Sponsorship] ${type || 'Inquiry'} – ${org || name}`);
    const body = encodeURIComponent(
        `Sponsorship Inquiry\n` +
        `===================\n` +
        `Organization : ${org || '—'}\n` +
        `Contact      : ${name}\n` +
        `Email        : ${email}\n` +
        `Type         : ${type || '—'}\n\n` +
        `Message:\n${msg || '—'}\n`
    );

    window.location.href = `mailto:${TEAM_EMAIL}?subject=${subject}&body=${body}`;
    closeModal('sponsors');
}

// ===== JOIN US FORM SUBMIT =====
function submitJoinUs() {
    const name    = document.getElementById('jn-name').value.trim();
    const email   = document.getElementById('jn-email').value.trim();
    const college = document.getElementById('jn-college').value.trim();
    const domain  = document.getElementById('jn-domain').value;
    const year    = document.getElementById('jn-year').value;
    const msg     = document.getElementById('jn-msg').value.trim();

    if (!name || !email || !domain) {
        alert('Please fill in your name, email, and select a domain.');
        return;
    }

    const subject = encodeURIComponent(`[Join Us] ${domain} – ${name}`);
    const body = encodeURIComponent(
        `Team Trinetra – Join Application\n` +
        `==================================\n` +
        `Name         : ${name}\n` +
        `Email        : ${email}\n` +
        `College      : ${college || '—'}\n` +
        `Domain       : ${domain}\n` +
        `Year         : ${year || '—'}\n\n` +
        `Why Join?\n${msg || '—'}\n`
    );

    window.location.href = `mailto:${TEAM_EMAIL}?subject=${subject}&body=${body}`;
    closeModal('joinus');
}

// ===== REAL-TIME GEOLOCATION COORDINATES =====
let userLocationMarker = null;
let geoFirstFix = true;

function startGeolocation() {
    const display = document.getElementById('coords-display');
    if (!display) return;

    if (!navigator.geolocation) {
        display.textContent = 'GPS not supported';
        return;
    }

    display.style.color = '#888';
    display.textContent = '-- acquiring GPS --';

    navigator.geolocation.watchPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const alt = pos.coords.altitude !== null
                ? pos.coords.altitude.toFixed(2) + 'm'
                : '---m';

            // Update coords bar
            display.style.color = '#7ab000';
            display.textContent = `${lat.toFixed(8)}  ${lng.toFixed(7)}  ${alt}`;

            // Map: fly on first fix, update marker on subsequent
            if (dataMap) {
                if (geoFirstFix) {
                    geoFirstFix = false;

                    // Smooth animated fly to location
                    dataMap.flyTo([lat, lng], 17, { duration: 1.8, easeLinearity: 0.25 });

                    // Build a custom pulsing marker using a DivIcon
                    const pulseIcon = L.divIcon({
                        className: '',
                        html: `<div class="geo-marker-outer">
                                   <div class="geo-marker-inner"></div>
                               </div>`,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    });

                    userLocationMarker = L.marker([lat, lng], { icon: pulseIcon })
                        .addTo(dataMap)
                        .bindPopup(
                            `<b style="font-family:'Segoe UI';font-size:12px;">You are here</b><br>
                             <span style="font-family:monospace;font-size:11px;">
                               ${lat.toFixed(6)}, ${lng.toFixed(6)}
                             </span>`,
                            { className: 'geo-popup' }
                        )
                        .openPopup();
                } else if (userLocationMarker) {
                    userLocationMarker.setLatLng([lat, lng]);
                }
            }
        },
        (err) => {
            display.style.color = '#e04040';
            display.textContent = 'GPS denied';
        },
        { enableHighAccuracy: true, maximumAge: 2000 }
    );
}

// ===== SPLASH SEQUENCE =====

function runSplash(onComplete) {

    // Hide the main UI until we're done
    const titlebar = document.getElementById('titlebar');
    const toolbar  = document.getElementById('toolbar');
    const main     = document.getElementById('main');
    if (titlebar) titlebar.style.visibility = 'hidden';
    if (toolbar)  toolbar.style.visibility  = 'hidden';
    if (main)     main.style.visibility     = 'hidden';

    // ── Phase 1: CMD Terminal (~2s) ──
    const cmdScreen = document.getElementById('cmd-screen');
    const cmdLines  = document.getElementById('cmd-lines');
    const cmdCursor = document.getElementById('cmd-cursor');
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB').replace(/\//g, '/');
    const timeStr = now.toLocaleTimeString('en-GB');

    const BOOT_LINES = [
        { text: 'Microsoft Windows [Version 10.0.22631.3447]', cls: '' },
        { text: '(c) Microsoft Corporation. All rights reserved.', cls: '' },
        { text: '', cls: '' },
        { text: `C:\\Users\\aryan\\TeamTrinetra> python gcs_launcher.py --mode=full --time=${timeStr}`, cls: '' },
        { text: '', cls: '' },
        { text: '  ████████╗██████╗ ██╗███╗   ██╗███████╗████████╗██████╗  █████╗ ', cls: '' },
        { text: '     ██╔══╝██╔══██╗██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗', cls: '' },
        { text: '     ██║   ██████╔╝██║██╔██╗ ██║█████╗     ██║   ██████╔╝███████║', cls: '' },
        { text: '     ██║   ██╔══██╗██║██║╚██╗██║██╔══╝     ██║   ██╔══██╗██╔══██║', cls: '' },
        { text: '     ██║   ██║  ██║██║██║ ╚████║███████╗   ██║   ██║  ██║██║  ██║', cls: '' },
        { text: '     ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝', cls: '' },
        { text: '', cls: '' },
        { text: '  Ground Control Station  v1.0.0  |  MITS Gwalior  |  ArduPilot Compatible', cls: '' },
        { text: `  Launch timestamp: ${dateStr}  ${timeStr}`, cls: 'dim' },
        { text: '', cls: '' },
        { text: '──────────────────────────────────────────────────────────────────', cls: 'dim' },
        { text: ' [INIT]  Resolving runtime environment...', cls: '' },
        { text: ' [INIT]  Python 3.11.6  (tags/v3.11.6:8d01f18, Oct  2 2023)', cls: '' },
        { text: ' [INIT]  MAVProxy 1.8.71   pymavlink 2.4.41   dronekit 2.9.2', cls: '' },
        { text: ' [INIT]  OpenCV 4.9.0   YOLOv8 8.0.196   numpy 1.26.4', cls: '' },
        { text: ' [INIT]  Leaflet 1.9.4   GSAP 3.12.5', cls: '' },
        { text: '──────────────────────────────────────────────────────────────────', cls: 'dim' },
        { text: '', cls: '' },
        { text: ' [LOAD]  Importing mavlink_router...                        OK', cls: '' },
        { text: ' [LOAD]  Importing telemetry.parser...                      OK', cls: '' },
        { text: ' [LOAD]  Importing telemetry.streams.udp...                 OK', cls: '' },
        { text: ' [LOAD]  Importing telemetry.streams.serial...              OK', cls: '' },
        { text: ' [LOAD]  Importing mission.planner...                       OK', cls: '' },
        { text: ' [LOAD]  Importing mission.geofence...                      OK', cls: '' },
        { text: ' [LOAD]  Importing mission.waypoints...                     OK', cls: '' },
        { text: ' [LOAD]  Importing vision.yolov8_world...                   OK', cls: '' },
        { text: ' [LOAD]  Importing vision.stream_capture...                 OK', cls: '' },
        { text: ' [LOAD]  Importing payload.drop_controller...               OK', cls: '' },
        { text: ' [LOAD]  Importing payload.beacon_tracker...                OK', cls: '' },
        { text: ' [LOAD]  Importing ui.hud_renderer...                       OK', cls: '' },
        { text: ' [LOAD]  Importing ui.map_engine...                         OK', cls: '' },
        { text: ' [LOAD]  Importing ui.simulation_view...                    OK', cls: '' },
        { text: '', cls: '' },
        { text: ' [SCAN]  Enumerating serial ports...', cls: '' },
        { text: ' [SCAN]    COM1  -  Communications Port               [SKIP]', cls: '' },
        { text: ' [SCAN]    COM3  -  USB Serial Device (CP2102)        [SKIP]', cls: '' },
        { text: ' [SCAN]    COM4  -  Cube Orange+ (ArduPilot)          [WAIT]', cls: '' },
        { text: ' [WARN]  No heartbeat received on COM4 (timeout 3s)   RETRYING...', cls: '' },
        { text: ' [WARN]  Autopilot not detected — running in offline mode', cls: '' },
        { text: '', cls: '' },
        { text: ' [NET ]  Binding UDP socket  0.0.0.0:14550...              OK', cls: '' },
        { text: ' [NET ]  Binding UDP socket  0.0.0.0:14551  (GCS mirror)   OK', cls: '' },
        { text: ' [NET ]  TCP listener  127.0.0.1:5760...                   OK', cls: '' },
        { text: '', cls: '' },
        { text: ' [MAP ]  Loading ESRI World Imagery tiles (z=16)...        OK', cls: '' },
        { text: ' [MAP ]  Initializing Leaflet tile cache...                 OK', cls: '' },
        { text: ' [MAP ]  Geofence boundary data loaded  (4 vertices)        OK', cls: '' },
        { text: ' [MAP ]  Home location: 26.2183° N  78.1828° E             OK', cls: '' },
        { text: '', cls: '' },
        { text: ' [AI  ]  Loading YOLOv8x-worldv2 weights (137 MB)...', cls: '' },
        { text: ' [AI  ]  Target classes: [mannequin, canopy, survivor, bottle]', cls: '' },
        { text: ' [AI  ]  CUDA not available — using CPU inference (torch 2.2.0)', cls: '' },
        { text: ' [AI  ]  Model ready  |  conf=0.42  iou=0.55  imgsz=640     OK', cls: '' },
        { text: '', cls: '' },
        { text: ' [SIM ]  Connecting to ArduCopter SITL  127.0.0.1:5760...', cls: '' },
        { text: ' [SIM ]  SITL not running — simulation view in replay mode   OK', cls: '' },
        { text: ' [SIM ]  Loading flight log: mission_2026-05-28.bin          OK', cls: '' },
        { text: '', cls: '' },
        { text: ' [HUD ]  Canvas renderer initialized  (420×390 px)          OK', cls: '' },
        { text: ' [HUD ]  Artificial horizon calibrated  (pitch=0  roll=0)    OK', cls: '' },
        { text: '', cls: '' },
        { text: '──────────────────────────────────────────────────────────────────', cls: 'dim' },
        { text: ' All systems nominal. Launching GCS interface...', cls: '' },
        { text: `C:\\Users\\aryan\\TeamTrinetra> _`, cls: '' },
    ];

    const LINE_INTERVAL = 52;
    let lineIdx = 0;

    function addLine() {
        if (lineIdx >= BOOT_LINES.length) {
            cmdCursor.style.display = 'block';
            setTimeout(startSplashWindow, 200);
            return;
        }
        const { text, cls } = BOOT_LINES[lineIdx++];
        const div = document.createElement('div');
        div.className = 'cmd-line' + (cls ? ' ' + cls : '');
        div.textContent = text;
        cmdLines.appendChild(div);
        void div.offsetWidth;
        setTimeout(addLine, LINE_INTERVAL);
    }

    setTimeout(addLine, 200);

    // ── Phase 2: Splash Window (2s) ──
    function startSplashWindow() {
        const overlay = document.getElementById('splash-overlay');

        // Show splash overlay FIRST (it's fully opaque, covers everything)
        overlay.classList.add('visible');

        // Then fade out CMD screen underneath
        setTimeout(() => {
            cmdScreen.classList.add('hidden');
            setTimeout(() => { cmdScreen.style.display = 'none'; }, 400);
        }, 50);

        // Hold splash for ~2 seconds then dismiss
        setTimeout(() => {
            overlay.classList.remove('visible');
            overlay.classList.add('hidden');

            // Reveal main UI
            if (titlebar) titlebar.style.visibility = '';
            if (toolbar)  toolbar.style.visibility  = '';
            if (main)     main.style.visibility     = '';

            setTimeout(onComplete, 320);
        }, 2000);
    }
}

// ===== LOAD TAB HTML FROM SEPARATE FILES =====
// NOTE: Requires a local web server (e.g. VS Code Live Server)
async function loadTabs() {
    const tabs = [
        { id: 'data-tab',      file: 'tabs/data.html'       },
        { id: 'sim-tab',       file: 'tabs/simulation.html'  },
        { id: 'sponsors-tab',  file: 'tabs/sponsors.html'    },
        { id: 'plan-tab',      file: 'tabs/team.html'        },
        { id: 'vehicles-tab',  file: 'tabs/vehicles.html'    },
    ];
    await Promise.all(tabs.map(async ({ id, file }) => {
        const res  = await fetch(file);
        const html = await res.text();
        document.getElementById(id).innerHTML = html;
    }));
}

// ===== SIMULATION CAROUSEL (GSAP) =====
function initSimCarousel() {
    const slides = document.querySelectorAll('.sv-slide');
    if (!slides.length) return;
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded — sim carousel skipped');
        return;
    }

    const clip = document.getElementById('sim-carousel-clip');
    if (!clip) return;

    const total   = slides.length;
    let current   = 0;
    let animating = false;

    // ── Store each iframe's original src so we can restore after stopping ──
    slides.forEach(slide => {
        const iframe = slide.querySelector('iframe.sv-player');
        if (iframe && iframe.src && !iframe.src.includes('about:blank')) {
            iframe.dataset.origSrc = iframe.src;
        }
    });

    // ── Initial slide positions ──
    slides.forEach((slide, i) => gsap.set(slide, { xPercent: i * 100 }));

    // ── Initial card visual states ──
    slides.forEach((slide, i) => {
        const card = slide.querySelector('.sv-card');
        if (!card) return;
        gsap.set(card, i === 0
            ? { scale: 1,    filter: 'blur(0px)', opacity: 1    }
            : { scale: 0.88, filter: 'blur(4px)', opacity: 0.38 }
        );
    });

    // ── Stop video on a slide (works for both iframes & <video>) ──
    function stopVideo(idx) {
        const slide = slides[idx];
        if (!slide) return;
        const iframe = slide.querySelector('iframe.sv-player');
        const video  = slide.querySelector('video.sv-player');
        if (iframe) iframe.src = 'about:blank';   // stops Drive embed
        if (video)  video.pause();
    }

    // ── Restore iframe src when returning to a slide ──
    function restoreVideo(idx) {
        const slide = slides[idx];
        if (!slide) return;
        const iframe = slide.querySelector('iframe.sv-player');
        if (iframe && iframe.dataset.origSrc) iframe.src = iframe.dataset.origSrc;
    }

    // ── Sync dots + counter (no arrow dimming — circular so always enabled) ──
    function syncUI(idx) {
        document.querySelectorAll('.sv-dot').forEach((d, i) =>
            d.classList.toggle('active', i === idx)
        );
        const counter = document.getElementById('sim-slide-counter');
        if (counter) counter.textContent =
            `${String(idx + 1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
    }

    // ── Core transition with circular wrap support ──
    function goTo(rawIndex) {
        // Modulo wrap for circular
        const index = ((rawIndex % total) + total) % total;
        if (index === current || animating) return;
        animating = true;

        const prev = current;
        const next = index;

        // Stop whatever was playing on the outgoing slide
        stopVideo(prev);
        // Restore the incoming slide's video src (if it was blanked previously)
        restoreVideo(next);

        // ── Circular wrap positioning ──
        const isForwardWrap  = prev === total - 1 && next === 0;
        const isBackwardWrap = prev === 0          && next === total - 1;

        if (isForwardWrap) {
            // Incoming (first) was far left — teleport it to right of current, then slide in
            gsap.set(slides[next], { xPercent: 100 });
            slides.forEach((slide, i) => {
                const xp = (i === prev) ? -100 : (i - next) * 100;
                gsap.to(slide, { xPercent: xp, duration: 0.72, ease: 'power3.inOut' });
            });
        } else if (isBackwardWrap) {
            // Incoming (last) was far right — teleport it to left of current, then slide in
            gsap.set(slides[next], { xPercent: -100 });
            slides.forEach((slide, i) => {
                const xp = (i === prev) ? 100 : (i - next) * 100;
                gsap.to(slide, { xPercent: xp, duration: 0.72, ease: 'power3.inOut' });
            });
        } else {
            // Normal sequential navigation
            slides.forEach((slide, i) => {
                gsap.to(slide, { xPercent: (i - next) * 100, duration: 0.72, ease: 'power3.inOut' });
            });
        }

        // Incoming card → sharp + full size
        const inCard = slides[next].querySelector('.sv-card');
        if (inCard) {
            gsap.to(inCard, {
                scale: 1, filter: 'blur(0px)', opacity: 1,
                duration: 0.55, ease: 'power2.out',
                onComplete: () => { animating = false; }
            });
        } else {
            setTimeout(() => { animating = false; }, 750);
        }

        // All other cards → blurred, scaled down, still visible (peek)
        slides.forEach((slide, i) => {
            if (i === next) return;
            const card = slide.querySelector('.sv-card');
            if (!card) return;
            gsap.to(card, {
                scale: 0.88, filter: 'blur(4px)', opacity: 0.38,
                duration: 0.45, ease: 'power2.out'
            });
        });

        current = next;
        syncUI(current);
    }

    syncUI(0);

    // ── Mouse wheel on the clip (covers full visible area inc. peek zones) ──
    let wheelBlock = false;
    clip.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (wheelBlock) return;
        wheelBlock = true;
        setTimeout(() => { wheelBlock = false; }, 850);
        if (e.deltaY > 0 || e.deltaX > 0) goTo(current + 1);
        else                                goTo(current - 1);
    }, { passive: false });

    // ── Arrow buttons ──
    document.getElementById('sv-prev')?.addEventListener('click', () => goTo(current - 1));
    document.getElementById('sv-next')?.addEventListener('click', () => goTo(current + 1));

    // ── Dots ──
    document.querySelectorAll('.sv-dot').forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i));
    });

    // ── Keyboard (only when sim tab is visible) ──
    document.addEventListener('keydown', (e) => {
        const simTab = document.getElementById('sim-tab');
        if (!simTab || simTab.style.display === 'none') return;
        if (e.key === 'ArrowRight') goTo(current + 1);
        if (e.key === 'ArrowLeft')  goTo(current - 1);
    });

    // ── Touch / swipe ──
    let touchX = 0;
    clip.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    clip.addEventListener('touchend', e => {
        const dx = touchX - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 55) goTo(dx > 0 ? current + 1 : current - 1);
    }, { passive: true });
}

// ===== INITIALISE ON LOAD =====
window.addEventListener('load', async () => {
    await loadTabs();          // inject all tab HTML first
    runSplash(() => {
        initSubTabs();         // wire sub-tab clicks now that DOM exists
        drawHUD();
        initDataMap();
        initSimMap();
        initSimCarousel();
        initPlanMap();         // populates cards immediately (no Leaflet yet)
        showTab('data');       // make data tab visible as default
        document.getElementById('btn-data').classList.add('active');
        // Leaflet plan map init is deferred to first showTab('plan') call
        // makeResizable calls below are safe — they guard against missing IDs
        makeResizable('team-sidebar-resizer', 'team-sidebar');
        makeResizable('team-profile-resizer', 'team-profile-panel');
    });
});



// --- Resizer Logic ---
function makeResizable(resizerId, targetId) {
    const resizer = document.getElementById(resizerId);
    const target = document.getElementById(targetId);
    if (!resizer || !target) return;

    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        resizer.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        e.preventDefault(); // prevent text selection
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        let newWidth = window.innerWidth - e.clientX;
        if (newWidth < 200) newWidth = 200;
        if (newWidth > window.innerWidth * 0.8) newWidth = window.innerWidth * 0.8;
        
        target.style.width = newWidth + 'px';
        
        if (planMap && targetId === 'team-sidebar') {
            planMap.invalidateSize();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            resizer.classList.remove('resizing');
            document.body.style.cursor = '';
        }
    });
}

