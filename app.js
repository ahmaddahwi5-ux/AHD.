/**
 * DASH AHD — Global Vehicle Database Engine
 * Highly scalable multi-dimensional object structure.
 */

// Scalable Mock Database Structure
const vehicleDatabase = {
    "Toyota": {
        "Camry": {
            "XV70 (2018-Present)": {
                "2021": {
                    "Sedan": [
                        {
                            engine: "2.5L A25A-FXS I4 (Hybrid)",
                            fuel: "Hybrid (Petrol/Electric)",
                            transmission: "e-CVT",
                            viscosity: "0W-20",
                            spec: "API SP / ILSAC GF-6A",
                            capacityWithFilter: "4.5 Liters",
                            capacityNoFilter: "4.2 Liters",
                            filterOEM: "OEM #04152-YZZA1",
                            oilType: "Full Synthetic",
                            intervalKm: 10000,
                            intervalMonths: 6,
                            notes: "Strictly use low-viscosity 0W-20 for optimal hybrid powertrain efficiency and VVT-iE operation."
                        },
                        {
                            engine: "3.5L 2GR-FKS V6",
                            fuel: "Petrol",
                            transmission: "8-Speed Automatic",
                            viscosity: "0W-20",
                            spec: "API SN Plus / ILSAC GF-5",
                            capacityWithFilter: "6.1 Liters",
                            capacityNoFilter: "5.7 Liters",
                            filterOEM: "OEM #04152-YZZA1",
                            oilType: "Full Synthetic",
                            intervalKm: 10000,
                            intervalMonths: 6,
                            notes: "Check oil level every 5,000 km under heavy driving conditions."
                        }
                    ]
                }
            }
        },
        "Land Cruiser": {
            "J300 (2022-Present)": {
                "2023": {
                    "SUV": [
                        {
                            engine: "3.4L V35A-FTS Twin-Turbo V6",
                            fuel: "Petrol",
                            transmission: "10-Speed Automatic",
                            viscosity: "0W-20",
                            spec: "API SP / ILSAC GF-6A",
                            capacityWithFilter: "6.8 Liters",
                            capacityNoFilter: "6.4 Liters",
                            filterOEM: "OEM #04152-YZZA8",
                            oilType: "Full Synthetic High Thermal Stability",
                            intervalKm: 10000,
                            intervalMonths: 6,
                            notes: "Twin-turbocharged configuration requires premium synthetic oil to withstand severe thermal degradation."
                        }
                    ]
                }
            }
        }
    },
    "BMW": {
        "M3": {
            "G80 (2021-Present)": {
                "2022": {
                    "Sedan": [
                        {
                            engine: "3.0L S58 Twin-Turbo I6",
                            fuel: "Petrol",
                            transmission: "8-Speed M Steptronic",
                            viscosity: "0W-30",
                            spec: "BMW Longlife-12 FE / LL-01 FE",
                            capacityWithFilter: "7.0 Liters",
                            capacityNoFilter: "6.5 Liters",
                            filterOEM: "OEM #11427852163",
                            oilType: "M Performance Synthetic",
                            intervalKm: 10000,
                            intervalMonths: 12,
                            notes: "High-performance S58 engine requires strict adherence to BMW Longlife specs to maintain turbo bearings warranty."
                        }
                    ]
                }
            }
        }
    },
    "Mercedes-Benz": {
        "G-Class": {
            "W463 (2018-Present)": {
                "2022": {
                    "SUV": [
                        {
                            engine: "4.0L M177 Twin-Turbo V8 (AMG G63)",
                            fuel: "Petrol",
                            transmission: "9-Speed AMG SPEEDSHIFT",
                            viscosity: "0W-40",
                            spec: "MB 229.5 / MB 229.52",
                            capacityWithFilter: "9.5 Liters",
                            capacityNoFilter: "9.0 Liters",
                            filterOEM: "OEM #2781800009",
                            oilType: "Full Synthetic Competition Grade",
                            intervalKm: 10000,
                            intervalMonths: 12,
                            notes: "Requires MB 229.5 approved full synthetic oil for high-torque high-temperature stability."
                        }
                    ]
                }
            }
        }
    },
    "Porsche": {
        "911": {
            "992 (2019-Present)": {
                "2023": {
                    "Coupe": [
                        {
                            engine: "3.0L Twin-Turbo Flat-6 (Carrera S)",
                            fuel: "Petrol",
                            transmission: "8-Speed PDK",
                            viscosity: "0W-40",
                            spec: "Porsche C40",
                            capacityWithFilter: "8.3 Liters",
                            capacityNoFilter: "7.8 Liters",
                            filterOEM: "OEM #9A719840500",
                            oilType: "Full Synthetic Porsche Approved C40",
                            intervalKm: 15000,
                            intervalMonths: 12,
                            notes: "CRITICAL: Do NOT use A40 specification. Porsche 992 requires C40 specification for particulate filter protection."
                        }
                    ]
                }
            }
        }
    }
};

// Global State
let activeSelection = null;
let savedGarage = JSON.parse(localStorage.getItem('dash_ahd_garage')) || [];

// DOM Elements
const selectMake = document.getElementById('select-make');
const selectModel = document.getElementById('select-model');
const selectYear = document.getElementById('select-year');
const selectGeneration = document.getElementById('select-generation');
const selectBody = document.getElementById('select-body');
const selectEngine = document.getElementById('select-engine');
const selectFuel = document.getElementById('select-fuel');

const globalSearch = document.getElementById('global-search');
const loader = document.getElementById('loader');
const resultsDashboard = document.getElementById('results-dashboard');

// Init Platform
document.addEventListener('DOMContentLoaded', () => {
    populateMakes();
    setupEventListeners();
    renderGarage();
});

// Cascading Engine Functions
function populateMakes() {
    selectMake.innerHTML = '<option value="">-- اختر الشركة --</option>';
    Object.keys(vehicleDatabase).sort().forEach(make => {
        const option = document.createElement('option');
        option.value = make;
        option.textContent = make;
        selectMake.appendChild(option);
    });
}

function setupEventListeners() {
    selectMake.addEventListener('change', (e) => {
        resetDropdowns(1);
        const make = e.target.value;
        if (!make) return;

        selectModel.innerHTML = '<option value="">-- اختر الموديل --</option>';
        Object.keys(vehicleDatabase[make]).sort().forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            selectModel.appendChild(option);
        });
        selectModel.disabled = false;
    });

    selectModel.addEventListener('change', (e) => {
        resetDropdowns(2);
        const make = selectMake.value;
        const model = e.target.value;
        if (!model) return;

        selectYear.innerHTML = '<option value="">-- اختر السنة --</option>';
        const generations = vehicleDatabase[make][model];
        
        let availableYears = new Set();
        Object.keys(generations).forEach(gen => {
            Object.keys(generations[gen]).forEach(year => availableYears.add(year));
        });

        Array.from(availableYears).sort().reverse().forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            selectYear.appendChild(option);
        });
        selectYear.disabled = false;
    });

    selectYear.addEventListener('change', (e) => {
        resetDropdowns(3);
        const make = selectMake.value;
        const model = selectModel.value;
        const year = e.target.value;
        if (!year) return;

        selectGeneration.innerHTML = '<option value="">-- اختر الجيل --</option>';
        const generations = vehicleDatabase[make][model];

        Object.keys(generations).forEach(gen => {
            if (generations[gen][year]) {
                const option = document.createElement('option');
                option.value = gen;
                option.textContent = gen;
                selectGeneration.appendChild(option);
            }
        });
        selectGeneration.disabled = false;
    });

    selectGeneration.addEventListener('change', (e) => {
        resetDropdowns(4);
        const make = selectMake.value;
        const model = selectModel.value;
        const year = selectYear.value;
        const gen = e.target.value;
        if (!gen) return;

        selectBody.innerHTML = '<option value="">-- اختر الهيكل --</option>';
        const bodies = vehicleDatabase[make][model][gen][year];

        Object.keys(bodies).forEach(body => {
            const option = document.createElement('option');
            option.value = body;
            option.textContent = body;
            selectBody.appendChild(option);
        });
        selectBody.disabled = false;
    });

    selectBody.addEventListener('change', (e) => {
        resetDropdowns(5);
        const make = selectMake.value;
        const model = selectModel.value;
        const year = selectYear.value;
        const gen = selectGeneration.value;
        const body = e.target.value;
        if (!body) return;

        selectEngine.innerHTML = '<option value="">-- اختر المحرك --</option>';
        const engines = vehicleDatabase[make][model][gen][year][body];

        engines.forEach((item, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = item.engine;
            selectEngine.appendChild(option);
        });
        selectEngine.disabled = false;
    });

    selectEngine.addEventListener('change', (e) => {
        resetDropdowns(6);
        const make = selectMake.value;
        const model = selectModel.value;
        const year = selectYear.value;
        const gen = selectGeneration.value;
        const body = selectBody.value;
        const engineIdx = e.target.value;
        if (engineIdx === "") return;

        const targetVehicle = vehicleDatabase[make][model][gen][year][body][engineIdx];

        selectFuel.innerHTML = `<option value="${targetVehicle.fuel}">${targetVehicle.fuel}</option>`;
        selectFuel.disabled = false;

        // Trigger Full Output Display
        displayVehicleData(make, model, year, gen, body, targetVehicle);
    });

    // Instant Direct Global Keyword Search Mock
    globalSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 3) return;

        // Quick exact/partial match demo
        if (query.includes('camry')) {
            const data = vehicleDatabase["Toyota"]["Camry"]["XV70 (2018-Present)"]["2021"]["Sedan"][0];
            displayVehicleData("Toyota", "Camry", "2021", "XV70 (2018-Present)", "Sedan", data);
        } else if (query.includes('m3') || query.includes('bmw')) {
            const data = vehicleDatabase["BMW"]["M3"]["G80 (2021-Present)"]["2022"]["Sedan"][0];
            displayVehicleData("BMW", "M3", "2022", "G80 (2021-Present)", "Sedan", data);
        } else if (query.includes('911') || query.includes('porsche')) {
            const data = vehicleDatabase["Porsche"]["911"]["992 (2019-Present)"]["2023"]["Coupe"][0];
            displayVehicleData("Porsche", "911", "2023", "992 (2019-Present)", "Coupe", data);
        }
    });

    // Mileage Calculation Action
    document.getElementById('btn-calculate-status').addEventListener('click', calculateMileageStatus);

    // Garage LocalStorage Actions
    document.getElementById('btn-save-to-garage').addEventListener('click', saveCurrentToGarage);

    // WhatsApp Direct Action
    document.getElementById('btn-share-whatsapp').addEventListener('click', sendWhatsAppDetails);
    document.getElementById('whatsapp-direct-btn').addEventListener('click', () => {
        window.open('https://wa.me/?text=' + encodeURIComponent('مرحباً منصة DASH AHD، أحتاج إلى استفسار بخصوص صيانة سيارتي.'), '_blank');
    });
}

function resetDropdowns(level) {
    if (level <= 1) { selectModel.innerHTML = '<option value="">-- اختر الموديل --</option>'; selectModel.disabled = true; }
    if (level <= 2) { selectYear.innerHTML = '<option value="">-- اختر السنة --</option>'; selectYear.disabled = true; }
    if (level <= 3) { selectGeneration.innerHTML = '<option value="">-- اختر الجيل --</option>'; selectGeneration.disabled = true; }
    if (level <= 4) { selectBody.innerHTML = '<option value="">-- اختر الهيكل --</option>'; selectBody.disabled = true; }
    if (level <= 5) { selectEngine.innerHTML = '<option value="">-- اختر المحرك --</option>'; selectEngine.disabled = true; }
    if (level <= 6) { selectFuel.innerHTML = '<option value="">-- اختر نوع الوقود --</option>'; selectFuel.disabled = true; }
    resultsDashboard.classList.add('hidden');
}

// Display Data in Dashboard UI
function displayVehicleData(make, model, year, gen, body, data) {
    loader.classList.remove('hidden');
    resultsDashboard.classList.add('hidden');

    setTimeout(() => {
        loader.classList.add('hidden');
        resultsDashboard.classList.remove('hidden');

        activeSelection = { make, model, year, gen, body, ...data };

        document.getElementById('res-vehicle-title').textContent = `${make} ${model} ${data.engine} (${year})`;
        document.getElementById('res-vehicle-specs-tag').textContent = `${gen} | ${body} | ناقل الحركة: ${data.transmission}`;

        document.getElementById('res-oil-viscosity').textContent = data.viscosity;
        document.getElementById('res-oil-spec').textContent = data.spec;
        document.getElementById('res-oil-capacity').textContent = data.capacityWithFilter;
        document.getElementById('res-oil-capacity-nofilter').textContent = data.capacityNoFilter;
        document.getElementById('res-oil-filter').textContent = data.filterOEM;
        document.getElementById('res-oil-type').textContent = data.oilType;

        document.getElementById('res-interval-km').textContent = `${data.intervalKm.toLocaleString()} كم`;
        document.getElementById('res-interval-months').textContent = `${data.intervalMonths} أشهر`;
        document.getElementById('res-notes').textContent = data.notes;

        // Reset Calculator Panel
        document.getElementById('calc-results-display').classList.add('hidden');
        document.getElementById('input-current-km').value = '';
        document.getElementById('input-last-service-km').value = '';

        // Smooth Scroll to Results
        resultsDashboard.scrollIntoView({ behavior: 'smooth' });
    }, 400);
}

// Mileage & Service Logic Engine
function calculateMileageStatus() {
    if (!activeSelection) return;

    const currentKm = parseInt(document.getElementById('input-current-km').value);
    const lastServiceKm = parseInt(document.getElementById('input-last-service-km').value);

    if (isNaN(currentKm) || isNaN(lastServiceKm) || currentKm < lastServiceKm) {
        alert('يرجى إدخال قراءات عداد صحيحة ومطابقة للواقع (العداد الحالي يجب أن يكون أكبر من عداد آخر تغيير).');
        return;
    }

    const interval = activeSelection.intervalKm;
    const driven = currentKm - lastServiceKm;
    const remaining = interval - driven;
    const nextService = lastServiceKm + interval;

    const displayContainer = document.getElementById('calc-results-display');
    const statusBadge = document.getElementById('status-badge');
    const statusText = document.getElementById('status-text');

    document.getElementById('metric-driven').textContent = `${driven.toLocaleString()} KM`;
    document.getElementById('metric-remaining').textContent = `${remaining.toLocaleString()} KM`;
    document.getElementById('metric-next').textContent = `${nextService.toLocaleString()} KM`;

    statusBadge.className = 'status-indicator';

    if (remaining <= 0) {
        statusBadge.classList.add('status-alert');
        statusText.textContent = 'تغيير الزيت مستحق فوراً! (تجاوزت المسافة الموصى بها)';
    } else if (remaining <= 1500) {
        statusBadge.classList.add('status-warning');
        statusText.textContent = 'اقترب موعد التغيير (اقتربت من نهاية مسافة الزيت)';
    } else {
        statusBadge.classList.add('status-ok');
        statusText.textContent = 'حالة الزيت ممتازة وآمنة';
    }

    displayContainer.classList.remove('hidden');
}

// LocalStorage Garage Handling
function saveCurrentToGarage() {
    if (!activeSelection) return;

    const exists = savedGarage.some(item => 
        item.make === activeSelection.make && 
        item.model === activeSelection.model && 
        item.year === activeSelection.year &&
        item.engine === activeSelection.engine
    );

    if (exists) {
        alert('هذه السيارة موجودة بالفعل في كراجك المحفوظ!');
        return;
    }

    savedGarage.push({
        id: Date.now(),
        ...activeSelection,
        savedDate: new Date().toLocaleDateString('ar-EG')
    });

    localStorage.setItem('dash_ahd_garage', JSON.stringify(savedGarage));
    renderGarage();
    alert('تمت إضافة السيارة بنجاح إلى كراجك الخاص!');
}

function renderGarage() {
    const garageList = document.getElementById('garage-list');
    const emptyState = document.getElementById('garage-empty-state');

    garageList.innerHTML = '';

    if (savedGarage.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    savedGarage.forEach(item => {
        const card = document.createElement('div');
        card.className = 'garage-item-card';
        card.innerHTML = `
            <div class="garage-item-header">
                <h4>${item.make} ${item.model} (${item.year})</h4>
                <button class="btn-delete" onclick="removeFromGarage(${item.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">${item.engine}</p>
            <div style="font-size:0.85rem;">
                <div><strong>اللزوجة:</strong> <span style="color:var(--primary-gold);">${item.viscosity}</span></div>
                <div><strong>السعة:</strong> ${item.capacityWithFilter}</div>
            </div>
        `;
        garageList.appendChild(card);
    });
}

function removeFromGarage(id) {
    savedGarage = savedGarage.filter(item => item.id !== id);
    localStorage.setItem('dash_ahd_garage', JSON.stringify(savedGarage));
    renderGarage();
}

// WhatsApp Dynamic Data Formatter
function sendWhatsAppDetails() {
    if (!activeSelection) return;

    const text = `*بيانات صيانة السيارة عبر DASH AHD* 🚗\n\n` +
                 `*السيارة:* ${activeSelection.make} ${activeSelection.model} (${activeSelection.year})\n` +
                 `*المحرك:* ${activeSelection.engine}\n` +
                 `*لزوجة الزيت:* ${activeSelection.viscosity}\n` +
                 `*المواصفة المطلوب:* ${activeSelection.spec}\n` +
                 `*سعة الزيت:* ${activeSelection.capacityWithFilter}\n` +
                 `*فلتر الزيت:* ${activeSelection.filterOEM}\n\n` +
                 `أحتاج إلى حجز موعد صيانة أو الاستفسار عن توفر الزيت والفلتر المناسبين.`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
}