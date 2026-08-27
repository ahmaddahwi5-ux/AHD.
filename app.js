/**
 * DASH AHD Engine & Normalized Global Database Engine (1900 - 2026+)
 */

// Normalized Enterprise Data Architecture
const db = {
    manufacturers: {
        "m_ford": {
            name: "Ford",
            country: "United States",
            founded: 1903,
            history: "Pioneer of mass vehicle production. Introducer of Model T in 1908.",
            isVerified: true
        },
        "m_toyota": {
            name: "Toyota",
            country: "Japan",
            founded: 1937,
            history: "Global automotive manufacturer renowned for reliability and early production hybrid systems.",
            isVerified: true
        }
    },
    models: {
        "mod_ford_modelt": { manufacturerId: "m_ford", name: "Model T" },
        "mod_toyota_camry": { manufacturerId: "m_toyota", name: "Camry" }
    },
    generations: {
        "gen_modelt_orig": { modelId: "mod_ford_modelt", name: "Original Series (1908-1927)" },
        "gen_camry_xv70": { modelId: "mod_toyota_camry", name: "XV70 (2018-Present)" }
    },
    facelifts: {
        "fl_modelt_none": { generationId: "gen_modelt_orig", name: "Standard Model T Specification" },
        "fl_camry_2021": { generationId: "gen_camry_xv70", name: "2021 Mid-Cycle Refresh" }
    },
    years: {
        "yr_1915": { faceliftId: "fl_modelt_none", year: 1915 },
        "yr_2021": { faceliftId: "fl_camry_2021", year: 2021 }
    },
    markets: {
        "mkt_1915_us": { yearId: "yr_1915", region: "North America" },
        "mkt_2021_gcc": { yearId: "yr_2021", region: "GCC / Global" }
    },
    bodies: {
        "bdy_1915_touring": { marketId: "mkt_1915_us", style: "Touring / Roadster" },
        "bdy_2021_sedan": { marketId: "mkt_2021_gcc", style: "Sedan" }
    },
    trims: {
        "trm_1915_std": { bodyId: "bdy_1915_touring", trim: "Base Model T" },
        "trm_2021_gle": { bodyId: "bdy_2021_sedan", trim: "GLE Hybrid" }
    },
    engines: {
        "eng_1915_29L": {
            trimId: "trm_1915_std",
            code: "Model T Flathead I4",
            displacement: "2.9L (177 cu in)",
            cylinders: 4,
            aspiration: "Naturally Aspirated",
            hp: 20,
            torque: "112 Nm",
            fuel: "Petrol / Ethanol",
            transmission: "2-Speed Planetary Manual",
            drivetrain: "RWD",
            oilViscosity: "SAE 30 Monograde (Non-Detergent) / Heavy Mineral",
            oilSpec: "Historical Monograde (No Modern API Equivalent)",
            capacityWithFilter: "3.8 Liters (1 US Gallon)",
            capacityNoFilter: "3.8 Liters (No External Filter)",
            filterOEM: "N/A (Splash & Funnel System)",
            intervalKm: 1500,
            intervalMonths: 3,
            notes: "HISTORICAL VEHICLE: Requires non-detergent engine oil or modern vintage-blended SAE 30. Modern detergent synthetic oils can loosen historical engine sludge.",
            dataSource: "Ford Historical Heritage Archives",
            isHistorical: true,
            isVerified: true
        },
        "eng_2021_25L_hyb": {
            trimId: "trm_2021_gle",
            code: "A25A-FXS",
            displacement: "2.5L",
            cylinders: 4,
            aspiration: "Naturally Aspirated (Hybrid Electric Synergy)",
            hp: 208,
            torque: "221 Nm",
            fuel: "Hybrid (Petrol)",
            transmission: "e-CVT",
            drivetrain: "FWD",
            oilViscosity: "0W-20",
            oilSpec: "API SP / ILSAC GF-6A",
            capacityWithFilter: "4.5 Liters",
            capacityNoFilter: "4.2 Liters",
            filterOEM: "OEM #04152-YZZA1",
            intervalKm: 10000,
            intervalMonths: 6,
            notes: "Use low-viscosity synthetic 0W-20 to maintain high fuel efficiency and fast lubrication during frequent engine stop/start cycles.",
            dataSource: "Manufacturer Technical Service Bulletin 2021",
            isHistorical: false,
            isVerified: true
        }
    }
};

// Application Global State
let selectedEngineRecord = null;
let savedGarage = JSON.parse(localStorage.getItem('dash_ahd_garage_historical')) || [];

// Cascading Engine Elements
const selectMake = document.getElementById('select-make');
const selectModel = document.getElementById('select-model');
const selectGen = document.getElementById('select-generation');
const selectFace = document.getElementById('select-facelift');
const selectYear = document.getElementById('select-year');
const selectMkt = document.getElementById('select-market');
const selectBody = document.getElementById('select-body');
const selectTrim = document.getElementById('select-trim');
const selectEng = document.getElementById('select-engine');
const selectFuel = document.getElementById('select-fuel');
const selectTrans = document.getElementById('select-transmission');
const selectDrive = document.getElementById('select-drivetrain');

const resultsDashboard = document.getElementById('results-dashboard');
const loader = document.getElementById('loader');

document.addEventListener('DOMContentLoaded', () => {
    initCascade();
    setupEventListeners();
    renderGarage();
});

function initCascade() {
    selectMake.innerHTML = '<option value="">-- اختر المصنع --</option>';
    Object.keys(db.manufacturers).forEach(mId => {
        const option = document.createElement('option');
        option.value = mId;
        option.textContent = `${db.manufacturers[mId].name} (${db.manufacturers[mId].country})`;
        selectMake.appendChild(option);
    });
}

function setupEventListeners() {
    // Cascading Listeners
    selectMake.addEventListener('change', (e) => {
        resetCascades(1);
        const mId = e.target.value;
        if (!mId) return;

        selectModel.innerHTML = '<option value="">-- اختر الموديل --</option>';
        Object.keys(db.models).forEach(modId => {
            if (db.models[modId].manufacturerId === mId) {
                const opt = document.createElement('option');
                opt.value = modId;
                opt.textContent = db.models[modId].name;
                selectModel.appendChild(opt);
            }
        });
        selectModel.disabled = false;
    });

    selectModel.addEventListener('change', (e) => {
        resetCascades(2);
        const modId = e.target.value;
        if (!modId) return;

        selectGen.innerHTML = '<option value="">-- اختر الجيل --</option>';
        Object.keys(db.generations).forEach(gId => {
            if (db.generations[gId].modelId === modId) {
                const opt = document.createElement('option');
                opt.value = gId;
                opt.textContent = db.generations[gId].name;
                selectGen.appendChild(opt);
            }
        });
        selectGen.disabled = false;
    });

    selectGen.addEventListener('change', (e) => {
        resetCascades(3);
        const gId = e.target.value;
        if (!gId) return;

        selectFace.innerHTML = '<option value="">-- اختر التحديث --</option>';
        Object.keys(db.facelifts).forEach(fId => {
            if (db.facelifts[fId].generationId === gId) {
                const opt = document.createElement('option');
                opt.value = fId;
                opt.textContent = db.facelifts[fId].name;
                selectFace.appendChild(opt);
            }
        });
        selectFace.disabled = false;
    });

    selectFace.addEventListener('change', (e) => {
        resetCascades(4);
        const fId = e.target.value;
        if (!fId) return;

        selectYear.innerHTML = '<option value="">-- اختر السنة --</option>';
        Object.keys(db.years).forEach(yId => {
            if (db.years[yId].faceliftId === fId) {
                const opt = document.createElement('option');
                opt.value = yId;
                opt.textContent = db.years[yId].year;
                selectYear.appendChild(opt);
            }
        });
        selectYear.disabled = false;
    });

    selectYear.addEventListener('change', (e) => {
        resetCascades(5);
        const yId = e.target.value;
        if (!yId) return;

        selectMkt.innerHTML = '<option value="">-- اختر السوق --</option>';
        Object.keys(db.markets).forEach(mkId => {
            if (db.markets[mkId].yearId === yId) {
                const opt = document.createElement('option');
                opt.value = mkId;
                opt.textContent = db.markets[mkId].region;
                selectMkt.appendChild(opt);
            }
        });
        selectMkt.disabled = false;
    });

    selectMkt.addEventListener('change', (e) => {
        resetCascades(6);
        const mkId = e.target.value;
        if (!mkId) return;

        selectBody.innerHTML = '<option value="">-- اختر الهيكل --</option>';
        Object.keys(db.bodies).forEach(bId => {
            if (db.bodies[bId].marketId === mkId) {
                const opt = document.createElement('option');
                opt.value = bId;
                opt.textContent = db.bodies[bId].style;
                selectBody.appendChild(opt);
            }
        });
        selectBody.disabled = false;
    });

    selectBody.addEventListener('change', (e) => {
        resetCascades(7);
        const bId = e.target.value;
        if (!bId) return;

        selectTrim.innerHTML = '<option value="">-- اختر الفئة --</option>';
        Object.keys(db.trims).forEach(tId => {
            if (db.trims[tId].bodyId === bId) {
                const opt = document.createElement('option');
                opt.value = tId;
                opt.textContent = db.trims[tId].trim;
                selectTrim.appendChild(opt);
            }
        });
        selectTrim.disabled = false;
    });

    selectTrim.addEventListener('change', (e) => {
        resetCascades(8);
        const tId = e.target.value;
        if (!tId) return;

        selectEng.innerHTML = '<option value="">-- اختر المحرك --</option>';
        Object.keys(db.engines).forEach(eId => {
            if (db.engines[eId].trimId === tId) {
                const opt = document.createElement('option');
                opt.value = eId;
                opt.textContent = `${db.engines[eId].code} (${db.engines[eId].displacement})`;
                selectEng.appendChild(opt);
            }
        });
        selectEng.disabled = false;
    });

    selectEng.addEventListener('change', (e) => {
        const eId = e.target.value;
        if (!eId) return;

        const eng = db.engines[eId];
        selectedEngineRecord = eng;

        selectFuel.innerHTML = `<option>${eng.fuel}</option>`; selectFuel.disabled = false;
        selectTrans.innerHTML = `<option>${eng.transmission}</option>`; selectTrans.disabled = false;
        selectDrive.innerHTML = `<option>${eng.drivetrain}</option>`; selectDrive.disabled = false;

        renderResults(eng);
    });

    // Global Search Auto Complete Simulation
    document.getElementById('global-search').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.includes('model t') || query.includes('1915') || query.includes('ford')) {
            renderResults(db.engines["eng_1915_29L"]);
        } else if (query.includes('camry') || query.includes('xv70') || query.includes('2021')) {
            renderResults(db.engines["eng_2021_25L_hyb"]);
        }
    });

    // Calculator Listener
    document.getElementById('btn-calculate-status').addEventListener('click', calculateStatus);
    document.getElementById('btn-save-to-garage').addEventListener('click', saveToGarage);
    document.getElementById('btn-import-json').addEventListener('click', importAdminData);
    document.getElementById('btn-share-whatsapp').addEventListener('click', sendWhatsApp);
}

function resetCascades(level) {
    const list = [selectModel, selectGen, selectFace, selectYear, selectMkt, selectBody, selectTrim, selectEng, selectFuel, selectTrans, selectDrive];
    for (let i = level - 1; i < list.length; i++) {
        list[i].innerHTML = `<option value="">-- --</option>`;
        list[i].disabled = true;
    }
    resultsDashboard.classList.add('hidden');
}

function renderResults(eng) {
    loader.classList.remove('hidden');
    resultsDashboard.classList.add('hidden');

    setTimeout(() => {
        loader.classList.add('hidden');
        resultsDashboard.classList.remove('hidden');

        // Historical vs Modern Output Display Logic
        const historyPanel = document.getElementById('historical-info-panel');
        if (eng.isHistorical) {
            historyPanel.classList.remove('hidden');
            document.getElementById('res-manufacturer-history').textContent = db.manufacturers["m_ford"].history;
        } else {
            historyPanel.classList.add('hidden');
        }

        document.getElementById('res-vehicle-title').textContent = `${eng.code} - ${eng.displacement}`;
        document.getElementById('res-oil-viscosity').textContent = eng.oilViscosity || "Specification not verified";
        document.getElementById('res-oil-spec').textContent = eng.oilSpec || "Specification not verified";
        document.getElementById('res-oil-capacity').textContent = eng.capacityWithFilter || "Reliable specification not available";
        document.getElementById('res-oil-capacity-nofilter').textContent = eng.capacityNoFilter || "Reliable specification not available";
        document.getElementById('res-oil-filter').textContent = eng.filterOEM || "N/A";
        document.getElementById('res-data-source').textContent = eng.dataSource || "Internal Automotive Database";

        document.getElementById('res-engine-code').textContent = eng.code;
        document.getElementById('res-engine-disp').textContent = `${eng.displacement} (${eng.cylinders} Cylinders)`;
        document.getElementById('res-engine-aspiration').textContent = eng.aspiration;
        document.getElementById('res-engine-power').textContent = `${eng.hp} HP / ${eng.torque}`;
        document.getElementById('res-drivetrain-trans').textContent = `${eng.drivetrain} | ${eng.transmission}`;
        document.getElementById('res-interval-text').textContent = `${eng.intervalKm.toLocaleString()} KM / ${eng.intervalMonths} Months`;

        document.getElementById('res-notes').textContent = eng.notes;

        resultsDashboard.scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

function calculateStatus() {
    if (!selectedEngineRecord) return;
    const current = parseInt(document.getElementById('input-current-km').value);
    const last = parseInt(document.getElementById('input-last-service-km').value);

    if (isNaN(current) || isNaN(last) || current < last) {
        alert('يرجى إدخال قراءة عداد صحيحة');
        return;
    }

    const interval = selectedEngineRecord.intervalKm;
    const driven = current - last;
    const remaining = interval - driven;
    const nextService = last + interval;

    document.getElementById('calc-results-display').classList.remove('hidden');
    document.getElementById('metric-driven').textContent = `${driven.toLocaleString()} KM`;
    document.getElementById('metric-remaining').textContent = `${remaining.toLocaleString()} KM`;
    document.getElementById('metric-next').textContent = `${nextService.toLocaleString()} KM`;

    const badge = document.getElementById('status-badge');
    const text = document.getElementById('status-text');

    if (remaining <= 0) {
        badge.className = 'status-indicator status-alert';
        text.textContent = 'خدمة التغيير مستحقة الآن!';
    } else {
        badge.className = 'status-indicator status-ok';
        text.textContent = 'حالة الزيت ممتازة';
    }
}

function saveToGarage() {
    if (!selectedEngineRecord) return;
    savedGarage.push({ id: Date.now(), eng: selectedEngineRecord });
    localStorage.setItem('dash_ahd_garage_historical', JSON.stringify(savedGarage));
    renderGarage();
    alert('تم الحفظ في كراجك الخاص');
}

function renderGarage() {
    const list = document.getElementById('garage-list');
    const empty = document.getElementById('garage-empty-state');
    list.innerHTML = '';
    if (savedGarage.length === 0) { empty.classList.remove('hidden'); return; }
    empty.classList.add('hidden');

    savedGarage.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<h4>${item.eng.code}</h4><p>${item.eng.oilViscosity} - ${item.eng.capacityWithFilter}</p>`;
        list.appendChild(div);
    });
}

function importAdminData() {
    const jsonStr = document.getElementById('json-import-input').value;
    try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.engines) {
            Object.assign(db.engines, parsed.engines);
            alert('تم استيراد بيانات المحركات وتحديث الأرشيف بنجاح!');
        }
    } catch (e) {
        alert('خطأ في صيغة JSON المدخلة. يرجى التحقق من القواعد.');
    }
}

function sendWhatsApp() {
    if (!selectedEngineRecord) return;
    const msg = `DASH AHD Historical Report:\nEngine: ${selectedEngineRecord.code}\nViscosity: ${selectedEngineRecord.oilViscosity}\nCapacity: ${selectedEngineRecord.capacityWithFilter}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}