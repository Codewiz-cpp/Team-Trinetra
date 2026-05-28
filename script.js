// ===== TAB SWITCHING =====
function showTabBase(name) {
    ['data-tab', 'sim-tab', 'config-tab', 'plan-tab'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    ['data', 'plan', 'setup', 'config', 'simulation', 'help'].forEach(t => {
        const btn = document.getElementById('btn-' + t);
        if (btn) btn.classList.remove('active');
    });
    const btn = document.getElementById('btn-' + name);
    if (btn) btn.classList.add('active');

    if (name === 'data') {
        document.getElementById('data-tab').style.display = 'flex';
    } else if (name === 'sim' || name === 'simulation' || name === 'setup') {
        document.getElementById('sim-tab').style.display = 'flex';
    } else if (name === 'config') {
        document.getElementById('config-tab').style.display = 'flex';
    } else if (name === 'plan') {
        document.getElementById('plan-tab').style.display = 'flex';
    }
}

function showTab(name) {
    showTabBase(name);
    setTimeout(() => {
        if (name === 'data' && dataMap) dataMap.invalidateSize();
        if (name === 'plan' && planMap) planMap.invalidateSize();
    }, 50);
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

const ESRI_TILES = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles &copy; Esri', maxZoom: 20 }
);
const ESRI_TILES2 = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles &copy; Esri', maxZoom: 20 }
);
const ESRI_TILES3 = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }
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

function initDataMap() {
    dataMap = L.map('map-data', { zoomControl: true, attributionControl: false }).setView([HOME_LAT, HOME_LNG], 17);
    ESRI_TILES.addTo(dataMap);
    L.marker([HOME_LAT, HOME_LNG], { icon: homeIcon }).addTo(dataMap).bindTooltip('Home', { permanent: false });
    droneMarkerData = L.marker([HOME_LAT, HOME_LNG], { icon: droneIcon, draggable: true }).addTo(dataMap);
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
let teamMapIsPolitical = true;

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

// Map style toggle function
function toggleTeamMapStyle() {
    const btn = document.getElementById('team-map-toggle');
    if (teamMapIsPolitical) {
        planMap.removeLayer(ESRI_TILES3);
        if (!window.TEAM_ESRI_NORMAL) {
            window.TEAM_ESRI_NORMAL = L.tileLayer(
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                { attribution: 'Tiles &copy; Esri', maxZoom: 20 }
            );
        }
        window.TEAM_ESRI_NORMAL.addTo(planMap);
        teamMapIsPolitical = false;
        if(btn) btn.classList.add('is-normal');
    } else {
        planMap.removeLayer(window.TEAM_ESRI_NORMAL);
        ESRI_TILES3.addTo(planMap);
        teamMapIsPolitical = true;
        if(btn) btn.classList.remove('is-normal');
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


// Sidebar card avatar — photo if available, else initials
function avatarHtml(member, size = 36) {
    if (member.image) {
        return `<img src="${member.image}" alt="${member.name}"
            style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;
            border:2px solid ${member.color};flex-shrink:0;"
            onerror="this.outerHTML='<div style=width:${size}px;height:${size}px;border-radius:50%;background:${member.color};color:#111;display:flex;align-items:center;justify-content:center;font-size:${Math.round(size*0.28)}px;font-weight:900;border:2px solid #111;flex-shrink:0>${member.initials}</div>'">`;
    }
    return `<div style="width:${size}px;height:${size}px;border-radius:50%;
        background:${member.color};color:#111;
        display:flex;align-items:center;justify-content:center;
        font-size:${Math.round(size*0.28)}px;font-weight:900;
        border:2px solid #111;flex-shrink:0;font-family:'Segoe UI',sans-serif;">${member.initials}</div>`;
}

// Populate the sidebar cards
function populateTeamSidebar() {
    const list = document.getElementById('team-member-list');
    if (!list) return;
    list.innerHTML = '';
    TEAM_MEMBERS.forEach(member => {
        const card = document.createElement('div');
        card.className = 'team-member-card';
        card.id = `tmc-${member.id}`;
        card.style.setProperty('--member-color', member.color);
        card.innerHTML = `
            ${avatarHtml(member, 36)}
            <div class="tmc-info">
                <div class="tmc-name">${member.name}</div>
                <div class="tmc-role">${member.role}</div>
                <div class="tmc-city"> ${member.city.split(',')[0]}</div>
            </div>
            <div class="tmc-arrow">›</div>`;
        card.addEventListener('click', () => openTeamProfile(member));
        list.appendChild(card);
    });
}

// Open profile panel
function openTeamProfile(member) {
    document.querySelectorAll('.team-member-card').forEach(c => c.classList.remove('active'));
    const card = document.getElementById(`tmc-${member.id}`);
    if (card) card.classList.add('active');

    if (planMap) planMap.flyTo([member.lat, member.lng], 11, { duration: 1.0 });

    const linkItems = [];
    if (member.portfolio && member.portfolio !== '#')
        linkItems.push(`<a class="tp-link-btn" href="${member.portfolio}" target="_blank"><span class="tp-link-icon">🌐</span><span>Portfolio</span></a>`);
    if (member.github && member.github !== '#')
        linkItems.push(`<a class="tp-link-btn" href="${member.github}" target="_blank"><span class="tp-link-icon">⌨️</span><span>GitHub</span></a>`);
    if (member.linkedin && member.linkedin !== '#')
        linkItems.push(`<a class="tp-link-btn" href="${member.linkedin}" target="_blank"><span class="tp-link-icon">💼</span><span>LinkedIn</span></a>`);

    const linksHtml = linkItems.length
        ? `<div class="tp-divider"></div><div class="tp-section-label">Links</div><div class="tp-links">${linkItems.join('')}</div>`
        : '';

    // Passport-size photo — shown inside the header alongside name/role
    const photoContent = member.image
        ? `<img src="${member.image}" alt="${member.name}"
               style="width:100%;height:100%;object-fit:cover;display:block;"
               onerror="this.outerHTML='<div class=\\'tp-passport-initials\\'>${member.initials}</div>'">`
        : `<div class="tp-passport-initials" style="background:${member.color};color:#111">${member.initials}</div>`;

    document.getElementById('team-profile-content').innerHTML = `
        <div class="tp-header" style="border-left:4px solid ${member.color}">
            <div class="tp-passport-photo" style="border-color:${member.color}">
                ${photoContent}
            </div>
            <div class="tp-header-info">
                <div class="tp-name">${member.name}</div>
                <div class="tp-role-tag" style="color:${member.color}">${member.role}</div>
                <div class="tp-location">📍 ${member.city}</div>
            </div>
        </div>
        <div class="tp-meta-row">
            <div class="tp-meta-cell"><span class="tp-meta-label">Branch</span><span class="tp-meta-val">${member.branch}</span></div>
            <div class="tp-meta-cell"><span class="tp-meta-label">Year</span><span class="tp-meta-val">${member.year}</span></div>
        </div>
        <div class="tp-divider"></div>
        <div class="tp-section-label">Work Topics</div>
        <div class="tp-bio">${member.work}</div>
        ${linksHtml}`;

    document.getElementById('team-profile-bg').style.display = 'block';
    document.getElementById('team-profile-panel').classList.add('open');
    activeTeamMember = member;
}

// Close profile panel
function closeTeamProfile() {
    document.getElementById('team-profile-bg').style.display = 'none';
    document.getElementById('team-profile-panel').classList.remove('open');
    document.querySelectorAll('.team-member-card').forEach(c => c.classList.remove('active'));
    activeTeamMember = null;
}

// Initialise team map — centred on Madhya Pradesh
function initPlanMap() {
    planMap = L.map('map-plan', { zoomControl: true, attributionControl: true }).setView([26.0, 78.1], 8);
    ESRI_TILES3.addTo(planMap);
    TEAM_MEMBERS.forEach(member => {
        const icon = makeTeamMarker(member);
        member._marker = L.marker([member.lat, member.lng], { icon, draggable: adminMode })
            .addTo(planMap)
            .on('click', () => openTeamProfile(member));
            
        // When admin mode is active and pin is dragged, update coordinates
        member._marker.on('dragend', function(e) {
            const pos = e.target.getLatLng();
            member.lat = pos.lat;
            member.lng = pos.lng;
            console.log(`Updated location for ${member.name}: lat: ${pos.lat.toFixed(4)}, lng: ${pos.lng.toFixed(4)}`);
            
            // If their profile is currently open, we don't necessarily need to re-render everything,
            // but we could. For now, the visual change is enough for the admin.
        });
    });
    populateTeamSidebar();
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

    const BOOT_LINES = [
        { text: 'Microsoft Windows [Version 10.0.19045.4170]', cls: 'dim' },
        { text: '(c) Microsoft Corporation. All rights reserved.', cls: 'dim' },
        { text: '', cls: '' },
        { text: 'C:\\Users\\aryan\\TeamTrinetra>', cls: 'prompt' },
        { text: 'Initializing Team Trinetra GCS v1.0...', cls: '' },
        { text: '', cls: '' },
        { text: '[  OK  ] Loaded MAVLink protocol handler', cls: 'ok' },
        { text: '[  OK  ] Loaded telemetry interface', cls: 'ok' },
        { text: '[  OK  ] Serial port scanner ready', cls: 'ok' },
        { text: '[ WARN ] No autopilot detected on COM ports', cls: 'warn' },
        { text: '[  OK  ] Map tile cache initialized', cls: 'ok' },
        { text: '[  OK  ] HUD renderer online', cls: 'ok' },
        { text: '[  OK  ] Simulation engine standby', cls: 'ok' },
        { text: '', cls: '' },
        { text: 'Starting GUI... Please wait.', cls: '' },
    ];

    const LINE_INTERVAL = 115;
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
        { id: 'data-tab',   file: 'tabs/data.html'       },
        { id: 'sim-tab',    file: 'tabs/simulation.html'  },
        { id: 'config-tab', file: 'tabs/config.html'      },
        { id: 'plan-tab',   file: 'tabs/team.html'        },
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

    const viewport = document.getElementById('sim-carousel-viewport');
    if (!viewport) return;

    const total   = slides.length;
    let current   = 0;
    let animating = false;

    // ── Initial positions: slide i starts at xPercent = i * 100
    slides.forEach((slide, i) => gsap.set(slide, { xPercent: i * 100 }));

    // ── Initial active/inactive visual state
    slides.forEach((slide, i) => {
        const card = slide.querySelector('.sv-card');
        if (!card) return;
        gsap.set(card, i === 0
            ? { scale: 1,    filter: 'blur(0px)',   opacity: 1    }
            : { scale: 0.91, filter: 'blur(3px)',    opacity: 0.38 }
        );
    });

    // ── Sync dots, counter, arrow opacity
    function syncUI(idx) {
        document.querySelectorAll('.sv-dot').forEach((d, i) =>
            d.classList.toggle('active', i === idx)
        );
        const counter = document.getElementById('sim-slide-counter');
        if (counter) counter.textContent =
            `${String(idx + 1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;

        const prev = document.getElementById('sv-prev');
        const next = document.getElementById('sv-next');
        if (prev) prev.style.opacity = idx === 0         ? '0.2' : '1';
        if (next) next.style.opacity = idx === total - 1 ? '0.2' : '1';
    }

    // ── Core transition
    function goTo(index) {
        if (index < 0 || index >= total || index === current || animating) return;
        animating = true;

        const prev = current;
        current    = index;

        // Move all slides horizontally
        slides.forEach((slide, i) => {
            gsap.to(slide, {
                xPercent:  (i - current) * 100,
                duration:  0.72,
                ease:      'power3.inOut',
            });
        });

        // Incoming card → sharp, full size
        const inCard = slides[current].querySelector('.sv-card');
        if (inCard) {
            gsap.to(inCard, {
                scale:    1,
                filter:   'blur(0px)',
                opacity:  1,
                duration: 0.55,
                ease:     'power2.out',
                onComplete: () => { animating = false; }
            });
        } else {
            setTimeout(() => { animating = false; }, 750);
        }

        // Outgoing + all other cards → dim + blur
        slides.forEach((slide, i) => {
            if (i === current) return;
            const card = slide.querySelector('.sv-card');
            if (!card) return;
            gsap.to(card, {
                scale:    0.91,
                filter:   'blur(3px)',
                opacity:  0.38,
                duration: 0.45,
                ease:     'power2.out'
            });
        });

        syncUI(current);
    }

    syncUI(0);

    // ── Mouse wheel (debounced — one slide per swipe gesture)
    let wheelBlock = false;
    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (wheelBlock) return;
        wheelBlock = true;
        setTimeout(() => { wheelBlock = false; }, 850);
        if (e.deltaY > 0 || e.deltaX > 0) goTo(current + 1);
        else                                goTo(current - 1);
    }, { passive: false });

    // ── Arrow buttons
    document.getElementById('sv-prev')?.addEventListener('click', () => goTo(current - 1));
    document.getElementById('sv-next')?.addEventListener('click', () => goTo(current + 1));

    // ── Dots
    document.querySelectorAll('.sv-dot').forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i));
    });

    // ── Keyboard (only when sim tab is visible)
    document.addEventListener('keydown', (e) => {
        const simTab = document.getElementById('sim-tab');
        if (!simTab || simTab.style.display === 'none') return;
        if (e.key === 'ArrowRight') goTo(current + 1);
        if (e.key === 'ArrowLeft')  goTo(current - 1);
    });

    // ── Touch / swipe
    let touchX = 0;
    viewport.addEventListener('touchstart', e => {
        touchX = e.touches[0].clientX;
    }, { passive: true });
    viewport.addEventListener('touchend', e => {
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
        initPlanMap();
        showTab('data');
        document.getElementById('btn-data').classList.add('active');
        startGeolocation();
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

