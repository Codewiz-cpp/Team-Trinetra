// ===== TAB SWITCHING =====
function showTabBase(name) {
    if (name === 'sponsors') {
        document.body.classList.add('sponsors-light-theme');
    } else {
        document.body.classList.remove('sponsors-light-theme');
    }

    ['data-tab', 'sim-tab', 'sponsors-tab', 'plan-tab', 'vehicles-tab'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    // Clear all toolbar buttons (btn-home, btn-plan, btn-setup, btn-sponsors, btn-simulation)
    ['home', 'plan', 'setup', 'sponsors', 'simulation', 'help'].forEach(t => {
        const btn = document.getElementById('btn-' + t);
        if (btn) btn.classList.remove('active');
    });

    // 'home' and 'data' both map to the home/data tab (btn-home)
    if (name === 'home' || name === 'data') {
        const homeBtn = document.getElementById('btn-home');
        if (homeBtn) homeBtn.classList.add('active');
        const tab = document.getElementById('data-tab');
        if (tab) {
            tab.style.display = 'flex';
            setTimeout(() => tab.classList.add('home-visible'), 40);
        }
    } else if (name === 'sim' || name === 'simulation') {
        const btn = document.getElementById('btn-simulation');
        if (btn) btn.classList.add('active');
        document.getElementById('sim-tab').style.display = 'flex';
    } else if (name === 'sponsors') {
        const btn = document.getElementById('btn-sponsors');
        if (btn) btn.classList.add('active');
        document.getElementById('sponsors-tab').style.display = 'flex';

        // Update Swiper layout and reset to middle slide once the container is visible
        const swiperEl = document.getElementById('sponsors-swiper');
        if (swiperEl && swiperEl.swiper) {
            swiperEl.swiper.update();
            swiperEl.swiper.slideToLoop(2, 0);
        }
    } else if (name === 'plan') {
        const btn = document.getElementById('btn-plan');
        if (btn) btn.classList.add('active');
        const tab = document.getElementById('plan-tab');
        if (tab) tab.style.display = 'flex';
    } else if (name === 'setup' || name === 'vehicles') {
        const btn = document.getElementById('btn-setup');
        if (btn) btn.classList.add('active');
        document.getElementById('vehicles-tab').style.display = 'flex';
    }
}

function showTab(name) {
    showTabBase(name);
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
        image: 'images/a.jpeg', portfolio: '#', github: '#', linkedin: '#'
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


// Initialise the team section (replaces old Leaflet map init)
function initPlanMap() {
    populateTeamCards();
    // Set default background text initially
    splitTextAndAnimate('TRINETRA', 'down', '#ffffff');

    // Add this to start the cursor physics!
    initTeamHero();
}

let activeHeroText = 'TRINETRA';
let pinnedMember = null;
let surnameWrapRef = null;
let isCursorPinned = false;
let hoverTimer;

function populateTeamCards() {
    const container = document.getElementById('team-thumbnails-container');
    const cursor = document.getElementById('team-cursor');
    if (!container) return;
    container.innerHTML = '';

    const images = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?q=80&w=200&auto=format&fit=crop"
    ];
    const thumbsArray = [];
    const baseSize = 60, maxSize = 120, gap = 12, maxDist = 140, containerWidth = 552;
    const startXOffset = (containerWidth - (images.length * baseSize + gap * (images.length - 1))) / 2;

    TEAM_MEMBERS.forEach((member, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'new-team-thumb';
        const imgSrc = member.image ? member.image : images[index % images.length];
        thumb.innerHTML = `<img src="${imgSrc}" alt="${member.name}">`;

        gsap.set(thumb, { x: startXOffset + (index * (baseSize + gap)), yPercent: -50 });

        // ── 1. HOVER LOGIC ──
        thumb.addEventListener('mouseenter', () => {
            if (pinnedMember) return;
            clearTimeout(hoverTimer);

            hoverTimer = setTimeout(() => {
                const firstName = member.name.split(' ')[0].toUpperCase();
                if (activeHeroText !== firstName) {
                    activeHeroText = firstName;
                    splitTextAndAnimate(firstName, 'hover', '#F00020');
                }
            }, 120);
        });

        thumb.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
        });

        // ── 2. CLICK LOGIC (Bulletproof Override) ──
        thumb.addEventListener('click', (e) => {
            const firstNameText = member.name.split(' ')[0].toUpperCase();
            const lastNameText = member.name.split(' ').slice(1).join(' ').toUpperCase();

            // 🔴 UNPIN LOGIC
            if (pinnedMember === member) {
                pinnedMember = null;
                isCursorPinned = false;
                container.classList.remove('is-frozen');

                gsap.to(cursor, { x: e.clientX, y: e.clientY, scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' });

                const textContainer = document.getElementById('team-bg-text-container');
                const firstNameWrap = textContainer.querySelector('.team-bg-text-wrap:not(.surname)');
                if (firstNameWrap) gsap.to(firstNameWrap, { x: 0, duration: 0.5, ease: 'power3.out' });

                if (surnameWrapRef) {
                    const surnameLetters = surnameWrapRef.querySelectorAll('.letter-inner');
                    gsap.killTweensOf(surnameLetters);
                    gsap.to(surnameLetters, {
                        yPercent: 105, duration: 0.35, ease: 'power3.inOut', stagger: { amount: 0.08, from: "edges" },
                        onComplete: () => {
                            if (surnameWrapRef) surnameWrapRef.remove();
                            surnameWrapRef = null;
                        }
                    });
                }

                thumbsArray.forEach((t, i) => {
                    gsap.to(t, {
                        x: startXOffset + (i * (baseSize + gap)),
                        width: baseSize, height: baseSize,
                        opacity: 1, filter: 'grayscale(0)',
                        duration: 0.5, ease: 'power3.out', overwrite: 'auto'
                    });
                });
                return;
            }

            if (pinnedMember !== null) return;

            // 🔴 PIN LOGIC: ABSOLUTE OVERRIDE
            pinnedMember = member;
            isCursorPinned = true;
            container.classList.add('is-frozen');

            // 1. Kill any pending hover animations so they don't corrupt the click!
            clearTimeout(hoverTimer);
            activeHeroText = firstNameText; // Lock the system memory to this name

            gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.3, ease: 'power3.out' });

            // 2. Nuke the container completely to wipe out any glitching text
            const textContainer = document.getElementById('team-bg-text-container');
            gsap.killTweensOf(textContainer.querySelectorAll('.letter-inner'));
            textContainer.innerHTML = '';

            // 3. Build the First Name Instantly
            const firstNameWrap = document.createElement('div');
            firstNameWrap.className = 'team-bg-text-wrap';
            firstNameWrap.style.color = '#F00020';

            [...firstNameText].forEach(char => {
                const box = document.createElement('span'); box.className = 'letter-box';
                const inner = document.createElement('span'); inner.className = 'letter-inner';
                inner.textContent = char === ' ' ? '\u00A0' : char;
                box.appendChild(inner); firstNameWrap.appendChild(box);
            });
            textContainer.appendChild(firstNameWrap);

            // 4. Build the Surname (Hidden below)
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

            // 5. Execute the clean Math and Animation
            const firstWidth = firstNameWrap.offsetWidth;
            const lastWidth = surnameWrapRef.offsetWidth;
            const textGap = 40;
            const slideDistanceFirst = -(lastWidth + textGap) / 2;
            const slideDistanceLast = (firstWidth + textGap) / 2;

            // Animate First Name sliding out of the center
            gsap.fromTo(firstNameWrap, { x: 0 }, { x: slideDistanceFirst, duration: 0.5, ease: 'power3.out' });

            // Animate Surname rolling up
            gsap.set(surnameWrapRef, { x: slideDistanceLast });
            const surnameLetters = surnameWrapRef.querySelectorAll('.letter-inner');
            gsap.set(surnameLetters, { yPercent: 105 });
            gsap.to(surnameLetters, { yPercent: 0, duration: 0.5, ease: 'power3.out', stagger: { amount: 0.12, from: "center" } });

            // Grayscale Wash & Snap Sizes
            const sizes = thumbsArray.map(t => t === thumb ? maxSize : baseSize);
            let currentX = (containerWidth - (sizes.reduce((a, b) => a + b, 0) + (gap * (sizes.length - 1)))) / 2;

            thumbsArray.forEach((t, i) => {
                const isPinnedThumb = (t === thumb);
                gsap.to(t, {
                    x: currentX, width: sizes[i], height: sizes[i],
                    opacity: isPinnedThumb ? 1 : 0.4,
                    filter: isPinnedThumb ? 'grayscale(0)' : 'grayscale(1)',
                    duration: 0.5, ease: 'power3.out', overwrite: 'auto'
                });
                currentX += sizes[i] + gap;
            });
        });

        thumbsArray.push(thumb);
        container.appendChild(thumb);
    });

    // ── 3. DOCK PHYSICS ──
    container.addEventListener('mousemove', (e) => {
        if (pinnedMember) return;

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

    container.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
        if (pinnedMember) return;

        if (activeHeroText !== 'TRINETRA') {
            activeHeroText = 'TRINETRA';
            splitTextAndAnimate('TRINETRA', 'main', '#ffffff');
        }
        thumbsArray.forEach((thumb, i) => {
            gsap.to(thumb, { x: startXOffset + (i * (baseSize + gap)), width: baseSize, height: baseSize, duration: 0.45, ease: 'back.out(1.2)', overwrite: 'auto' });
        });
    });
}

// ── TEXT ANIMATION (With Aggressive Memory Cleanup) ──
function splitTextAndAnimate(text, type, color) {
    const container = document.getElementById('team-bg-text-container');
    if (!container) return;

    // Grab EVERY single old wrap, even stuck ones
    const allOldWraps = container.querySelectorAll('.team-bg-text-wrap');
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
        gsap.set(newInners, { yPercent: -105 }); // TRINETRA Above
    } else {
        gsap.set(newInners, { yPercent: 105 });  // Names Below
    }

    gsap.to(newInners, {
        yPercent: 0, duration: 0.5, delay: incomingDelay, ease: 'power3.out',
        stagger: { amount: 0.12, from: "center" }
    });

    // Animate out and rigorously DELETE old elements from the DOM
    allOldWraps.forEach(oldWrap => {
        const oldInners = oldWrap.querySelectorAll('.letter-inner');
        gsap.killTweensOf(oldInners); // Stop overlapping math calculations

        gsap.to(oldInners, {
            yPercent: 105, duration: 0.35, ease: 'power3.inOut',
            stagger: { amount: 0.12, from: "edges" },
            onComplete: () => { oldWrap.remove(); } // GARBAGE COLLECTION
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
        if (isCursorPinned) return;
        xSet(e.clientX);
        ySet(e.clientY);
    };

    container.addEventListener('mouseenter', () => {
        if (isCursorPinned) return;
        gsap.killTweensOf(cursor);
        gsap.set(cursor, { visibility: 'visible' });
        gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' });
        window.addEventListener('mousemove', moveCursor);
    });

    container.addEventListener('mouseleave', (e) => {
        window.removeEventListener('mousemove', moveCursor);
        if (isCursorPinned) return;

        const r = container.getBoundingClientRect();
        const exitX = (e.clientX - (r.left + r.width / 2)) * 0.5;
        const exitY = (e.clientY - (r.top + r.height / 2)) * 0.5;

        gsap.to(cursor, {
            scale: 0, opacity: 0, x: `+=${exitX}`, y: `+=${exitY}`,
            duration: 0.5, ease: 'power3.out',
            onComplete: () => gsap.set(cursor, { visibility: 'hidden' })
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
    const memberForm = document.getElementById('cp-form-member');
    const sponsorForm = document.getElementById('cp-form-sponsor');
    const btnMember = document.getElementById('cpt-member');
    const btnSponsor = document.getElementById('cpt-sponsor');

    if (tab === 'member') {
        pill.classList.remove('right');
        memberForm.style.display = '';
        sponsorForm.style.display = 'none';
        btnMember.classList.add('active');
        btnSponsor.classList.remove('active');
    } else {
        pill.classList.add('right');
        memberForm.style.display = 'none';
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
    const name = document.getElementById('cp-jn-name').value.trim();
    const email = document.getElementById('cp-jn-email').value.trim();
    const college = document.getElementById('cp-jn-college').value.trim();
    const domain = document.getElementById('cp-jn-domain').value;
    const year = document.getElementById('cp-jn-year').value;
    const msg = document.getElementById('cp-jn-msg').value.trim();

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
    const org = document.getElementById('cp-sp-org').value.trim();
    const name = document.getElementById('cp-sp-name').value.trim();
    const email = document.getElementById('cp-sp-email').value.trim();
    const type = document.getElementById('cp-sp-type').value;
    const msg = document.getElementById('cp-sp-msg').value.trim();

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
    const org = document.getElementById('sp-org').value.trim();
    const name = document.getElementById('sp-name').value.trim();
    const email = document.getElementById('sp-email').value.trim();
    const type = document.getElementById('sp-type').value;
    const msg = document.getElementById('sp-msg').value.trim();

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
    const name = document.getElementById('jn-name').value.trim();
    const email = document.getElementById('jn-email').value.trim();
    const college = document.getElementById('jn-college').value.trim();
    const domain = document.getElementById('jn-domain').value;
    const year = document.getElementById('jn-year').value;
    const msg = document.getElementById('jn-msg').value.trim();

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

// ===== REAL-TIME GEOLOCATION COORDINATES (retired — display element removed) =====
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
    const titlebar = document.getElementById('titlebar');
    const toolbar = document.getElementById('toolbar');
    const main = document.getElementById('main');

    // ── Phase 0: hide the app beneath the splash ──
    [titlebar, toolbar, main].forEach(el => {
        if (el) { el.style.opacity = '0'; el.style.visibility = 'hidden'; }
    });

    const splash = document.getElementById('minimal-splash');
    const brand = splash.querySelector('.splash-brand');
    const tagline = splash.querySelector('.splash-tagline');

    // ── Phase 1 (0 – 1.8s): light background, black TRINETRA, fully visible ──
    splash.style.background = '#f0f0f0';
    splash.style.opacity = '1';
    splash.style.transition = 'none';
    if (brand) brand.style.color = '#111111';
    if (tagline) tagline.style.color = '#111111';

    // ── Phase 2 (at 1800ms): circle-blur #1 — light → dark theme swap ──
    // ::view-transition-new(root) CSS handles the expanding-circle + blur.
    setTimeout(() => {

        const doThemeSwap = () => {
            splash.style.background = '#0d0d0d';
            if (brand) brand.style.color = '#f0f0f0';
            if (tagline) tagline.style.color = '#777777';
        };

        if (document.startViewTransition) {
            const vt1 = document.startViewTransition(doThemeSwap);
            // Wait for circle to fully expand, then hold 400ms before phase 3
            vt1.finished.then(() => setTimeout(phase3, 400));
        } else {
            doThemeSwap();
            setTimeout(phase3, 400);
        }

    }, 1800);

    // ── Phase 3: circle-blur #2 — circle sweeps from TRINETRA to blurred data ──
    // Key: pre-render the app UNDER the splash (z-index keeps splash on top),
    // wait two rAF frames for the browser to paint it, then fire the transition.
    // The callback only removes the splash — old snapshot = TRINETRA,
    // new snapshot = already-painted blurred dashboard. No pop-in.
    function phase3() {
        // 1. Reveal the app beneath the splash (splash z-index:10000 covers it)
        [titlebar, toolbar, main].forEach(el => {
            if (el) { el.style.visibility = 'visible'; el.style.opacity = '1'; }
        });

        // 2. Show data tab and pre-blur it
        const dataTab = document.getElementById('data-tab');
        if (dataTab) dataTab.style.display = 'flex';
        const btnHome = document.getElementById('btn-home');
        if (btnHome) btnHome.classList.add('active');
        if (main) main.style.filter = 'blur(16px)';

        // 3. Two rAF frames — browser paints the blurred dashboard under the splash
        requestAnimationFrame(() => requestAnimationFrame(() => {

            const doRemoveSplash = () => {
                splash.style.display = 'none';
            };

            if (document.startViewTransition) {
                const vt2 = document.startViewTransition(doRemoveSplash);
                vt2.finished.then(() => {
                    // 4. Circle done — clear the blur with a smooth transition
                    requestAnimationFrame(() => {
                        if (main) {
                            main.style.transition = 'filter 0.7s ease';
                            main.style.filter = 'blur(0px)';
                            setTimeout(() => {
                                main.style.transition = '';
                                main.style.filter = '';
                            }, 700);
                        }
                        if (onComplete) onComplete();
                    });
                });
            } else {
                doRemoveSplash();
                if (main) main.style.filter = '';
                if (onComplete) onComplete();
            }
        }));
    }
}


// ===== TAB HTML =====
// Dynamically load tabs from external HTML files
async function loadTabs() {
    try {
        const response = await fetch('tabs/sponsors.html');
        if (response.ok) {
            const html = await response.text();
            const tab = document.getElementById('sponsors-tab');
            if (tab) {
                tab.innerHTML = html;

                // Mount React Sponsor Button
                if (typeof window.mountSponsorButton === 'function') {
                    window.mountSponsorButton();
                }

                // Initialize Swiper for Sponsors Next Page (Skiper 49)
                if (window.Swiper) {
                    new Swiper('#sponsors-swiper', {
                        effect: 'coverflow',
                        grabCursor: true,
                        centeredSlides: true,
                        slidesPerView: 3,
                        loop: true,
                        initialSlide: 2,
                        observer: true,
                        observeParents: true,
                        coverflowEffect: {
                            rotate: 40,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                        },
                        pagination: {
                            el: '.swiper-pagination',
                            clickable: true,
                        }
                    });
                }
            }
        }
    } catch (e) {
        console.error('Failed to load sponsors tab:', e);
    }
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

    const total = slides.length;
    let current = 0;
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
            ? { scale: 1, filter: 'blur(0px)', opacity: 1 }
            : { scale: 0.88, filter: 'blur(4px)', opacity: 0.38 }
        );
    });

    // ── Stop video on a slide (works for both iframes & <video>) ──
    function stopVideo(idx) {
        const slide = slides[idx];
        if (!slide) return;
        const iframe = slide.querySelector('iframe.sv-player');
        const video = slide.querySelector('video.sv-player');
        if (iframe) iframe.src = 'about:blank';   // stops Drive embed
        if (video) video.pause();
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
            `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
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
        const isForwardWrap = prev === total - 1 && next === 0;
        const isBackwardWrap = prev === 0 && next === total - 1;

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
        else goTo(current - 1);
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
        if (e.key === 'ArrowLeft') goTo(current - 1);
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
document.addEventListener('DOMContentLoaded', async () => {
    await loadTabs();          // inject all tab HTML first
    runSplash(() => {
        initHeroAnimation();
        initSimCarousel();
        initPlanMap();         // populates team cards immediately
        showTab('home');       // make home/data tab visible as default
        setTimeout(() => {
            const dt = document.getElementById('data-tab');
            if (dt) dt.classList.add('home-visible');
        }, 40);

        // Hide/Show Toolbar on Scroll
        const toolbar = document.getElementById('toolbar');
        const scrollableTabs = ['data-tab', 'sim-tab', 'sponsors-tab', 'plan-tab', 'vehicles-tab'];

        // Auto-hide timer: if toolbar was revealed by scroll-up but nobody
        // interacts with it, collapse it again after 2 seconds.
        let toolbarAutoHideTimer = null;

        function scheduleToolbarAutoHide() {
            clearTimeout(toolbarAutoHideTimer);
            toolbarAutoHideTimer = setTimeout(() => {
                toolbar?.classList.add('toolbar-hidden');
            }, 2000);
        }

        function cancelToolbarAutoHide() {
            clearTimeout(toolbarAutoHideTimer);
        }

        // Hovering over the toolbar cancels the auto-hide
        toolbar?.addEventListener('mouseenter', cancelToolbarAutoHide);

        scrollableTabs.forEach(id => {
            const tab = document.getElementById(id);
            if (!tab) return;

            let lastScrollTop = 0;
            tab.addEventListener('scroll', () => {
                const scrollTop = tab.scrollTop;

                // 1. Always show if near the top — cancel any pending auto-hide
                if (scrollTop <= 50) {
                    toolbar?.classList.remove('toolbar-hidden');
                    cancelToolbarAutoHide();
                    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                    return;
                }

                // 2. Ignore rubber-banding at the bottom (macOS/iOS)
                const maxScroll = tab.scrollHeight - tab.clientHeight;
                if (scrollTop >= maxScroll) {
                    lastScrollTop = scrollTop;
                    return;
                }

                // 3. Require a minimum scroll delta to prevent layout-shift stutters
                if (Math.abs(scrollTop - lastScrollTop) < 15) {
                    return;
                }

                // 4. Toggle based on direction
                if (scrollTop > lastScrollTop) {
                    // Scrolling down — hide toolbar immediately, cancel any pending auto-hide
                    toolbar?.classList.add('toolbar-hidden');
                    cancelToolbarAutoHide();
                } else {
                    // Scrolling up — show toolbar, then auto-hide after 2s if untouched
                    toolbar?.classList.remove('toolbar-hidden');
                    scheduleToolbarAutoHide();
                }

                lastScrollTop = scrollTop;
            });
        });
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

// --- Sponsors Scroll Animation ---
document.addEventListener('DOMContentLoaded', () => {
    const sponsorsTab = document.getElementById('sponsors-tab');

    if (sponsorsTab) {
        sponsorsTab.addEventListener('scroll', () => {
            const nextPage = document.getElementById('sp-next-page');
            const heading = document.getElementById('sp-carousel-heading');
            if (!nextPage || !heading) return;

            const st = sponsorsTab.scrollTop;
            const maxScroll = 400; // Complete animation over 400px of scrolling
            let progress = Math.min(st / maxScroll, 1);

            // Ease out cubic for a smoother, premium finish
            const easeOut = 1 - Math.pow(1 - progress, 3);

            // Ribbon shrinks from 50px to 0px
            const newRibbonSize = 50 * (1 - easeOut);

            // Heading settles down by 30px as user scrolls in
            const headingOffset = -30 + (30 * easeOut);

            nextPage.style.setProperty('--ribbon-size', `${newRibbonSize}px`);
            nextPage.style.setProperty('--heading-offset', `${headingOffset}px`);
            nextPage.style.setProperty('--subheading-opacity', easeOut);
        });
    }
});

// ===== HERO TYPOGRAPHY ANIMATION =====
function initHeroAnimation() {
    const heroTextContainer = document.getElementById('hero-text-container');
    if (!heroTextContainer) return;

    heroTextContainer.innerHTML = '';

    const linesText = [
        "© TEAM TRINETRA",
        "SECURING THE SKIES",
        "TO SAVE LIVES",
        "AT SUAS ➤ 2026"
    ];

    const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    const charElements = [];

    linesText.forEach((text, lineIndex) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = `hero-line hero-line-${lineIndex + 1}`;
        heroTextContainer.appendChild(lineDiv);

        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.className = 'hero-char';

            const isArrow = (lineIndex === 3 && i === 8);

            if (isArrow) {
                span.innerHTML = '<img src="arrow-right-svgrepo-com.svg" style="width: 1.2em; height: 1.2em; filter: invert(1); vertical-align: middle;">';
            } else {
                span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
            }

            span.dataset.char = text[i];

            if (lineIndex === 3) {
                if (i >= 8) {
                    span.style.fontSize = "0.5em";
                    span.style.verticalAlign = "top";
                    span.style.position = "relative";
                    span.style.top = "-0.2em";
                }

                if (i === 8) {
                    span.style.display = "inline-flex";
                    span.style.alignItems = "center";
                    span.style.margin = "0 1em 0 0.2em";
                    span.style.top = "-0.3em";
                }

                if (i >= text.length - 4) {
                    span.style.fontFamily = "'Elios Regular', sans-serif";
                    span.style.textTransform = "none";
                    span.style.fontWeight = "normal";
                    span.style.top = "-0.1em";
                }
            }

            span.style.opacity = '0';
            lineDiv.appendChild(span);
            charElements.push({
                element: span,
                char: text[i] === ' ' ? '\u00A0' : text[i],
                isSpace: text[i] === ' ',
                isArrow: isArrow
            });
        }
    });

    const N = charElements.length;
    const scrambleDuration = 1.0;
    const displayDuration = 4.0;
    const hideDuration = 0.5;
    const windowSize = 0.3; // 30% of the string is scrambling at any moment

    function runCycle() {
        const tl = gsap.timeline();

        // --- ENTRANCE SCRAMBLE (Left to Right) ---
        gsap.set('.hero-line', { opacity: 1 });
        gsap.set('#hero-text-container', { scale: 1 });

        const proxyEnter = { val: 0 };
        tl.to(proxyEnter, {
            val: 1 + windowSize,
            duration: scrambleDuration,
            ease: "power1.inOut",
            onUpdate: () => {
                const progress = proxyEnter.val;
                charElements.forEach((item, i) => {
                    const threshold = i / N;
                    if (threshold < progress - windowSize) {
                        if (!item.isArrow) item.element.textContent = item.char;
                        item.element.style.opacity = 1;
                    } else if (threshold <= progress) {
                        item.element.style.opacity = 1;
                        if (!item.isSpace && !item.isArrow && Math.random() < 0.5) {
                            item.element.textContent = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                        }
                    } else {
                        item.element.style.opacity = 0;
                    }
                });
            },
            onComplete: () => {
                charElements.forEach(item => {
                    if (!item.isArrow) item.element.textContent = item.char;
                    item.element.style.opacity = 1;
                });
            }
        });

        // --- HOLD PHASE ---
        tl.to({}, { duration: displayDuration });

        // --- EXIT SCRAMBLE (Right to Left) ---
        // Slightly zoom out while scrambling
        tl.to('#hero-text-container', {
            scale: 1.05,
            duration: scrambleDuration,
            ease: 'power2.in'
        }, "+=0");

        const proxyExit = { val: 1 + windowSize };
        tl.to(proxyExit, {
            val: 0,
            duration: scrambleDuration,
            ease: "power1.inOut",
            onUpdate: () => {
                const progress = proxyExit.val;
                charElements.forEach((item, i) => {
                    const threshold = i / N;
                    if (threshold >= progress) {
                        item.element.style.opacity = 0;
                    } else if (threshold >= progress - windowSize) {
                        item.element.style.opacity = 1;
                        if (!item.isSpace && !item.isArrow && Math.random() < 0.5) {
                            item.element.textContent = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                        }
                    } else {
                        if (!item.isArrow) item.element.textContent = item.char;
                        item.element.style.opacity = 1;
                    }
                });
            },
            onComplete: () => {
                charElements.forEach(item => {
                    item.element.style.opacity = 0;
                });
            }
        }, "-=" + scrambleDuration);
    }

    // Start the animation loop after a 500ms initial delay
    setTimeout(runCycle, 500);
}
