// DOM Elements
const sections = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links .nav-link');
const globalsSearchInput = document.getElementById('global-search');
const searchBtn = document.querySelector('.search-btn');

// Lists containers
const bedsList = document.getElementById('beds-list');
const vaccinesList = document.getElementById('vaccines-list');
const feesList = document.getElementById('fees-list');
const doctorsList = document.getElementById('doctors-list');
const hospitalDetailContent = document.getElementById('hospital-detail-content');

// Filters
const cityFilter = document.getElementById('city-filter');
const typeFilter = document.getElementById('type-filter');
const specialtyFilter = document.getElementById('specialty-filter');

// Hash Router
const router = () => {
  let hash = window.location.hash || '#home';

  // Show active section
  sections.forEach(section => {
    section.classList.remove('active');
    if (`#${section.id}` === hash) {
      section.classList.add('active');
    }
  });

  // Update nav link active state
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === hash) {
      link.classList.add('active');
    }
  });

  // Load contextual data based on hash
  if (hash === '#beds') {
    renderHospitals();
  } else if (hash === '#vaccines') {
    renderVaccines();
  } else if (hash === '#fees') {
    renderFees();
  } else if (hash === '#doctors') {
    renderDoctors();
  }
};

// Navigation Event Listener
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  router(); // Initial load
});

// Render Functions
function renderHospitals(hospitalsData = getHospitals()) {
  bedsList.innerHTML = '';

  if (hospitalsData.length === 0) {
    bedsList.innerHTML = '<p>No hospitals found matching your criteria.</p>';
    return;
  }

  hospitalsData.forEach(h => {
    const isAvailable = h.availableBeds > 0;
    const isIcuAvailable = h.availableIcuBeds > 0;

    bedsList.innerHTML += `
      <div class="hospital-card" onclick="viewHospital(${h.id})">
        <div class="hospital-header">
          <h3 style="color: var(--primary-color);">${h.name}</h3>
          <span class="hospital-type">${h.type}</span>
        </div>
        <p style="color: var(--text-secondary); margin-bottom: 0.5rem;"><i class="fa-solid fa-location-dot"></i> ${h.city}</p>
        
        <div class="status-indicator" style="margin-bottom: 0.5rem;">
          <div class="status-dot ${isAvailable ? 'status-green' : 'status-red'}"></div>
          ${isAvailable ? 'Beds Available' : 'Full Capacity'}
        </div>

        <div class="bed-stats">
          <div class="stat">
            <span class="stat-label">Total Ward</span>
            <span class="stat-val">${h.availableBeds}/${h.totalBeds}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Total ICU</span>
            <span class="stat-val" style="color: ${isIcuAvailable ? 'var(--text-primary)' : 'var(--danger-color)'}">${h.availableIcuBeds}/${h.icuBeds}</span>
          </div>
        </div>
        
        <button class="btn" onclick="event.stopPropagation(); viewHospital(${h.id});">View Details</button>
      </div>
    `;
  });
}

function renderVaccines() {
  const centers = getVaccinationCenters();
  vaccinesList.innerHTML = '';

  centers.forEach(c => {
    vaccinesList.innerHTML += `
      <div class="hospital-card">
        <div class="hospital-header">
          <h3 style="color: var(--secondary-color);"><i class="fa-solid fa-clinic-medical"></i> ${c.name}</h3>
        </div>
        <p style="color: var(--text-secondary); margin-bottom: 0.5rem;"><i class="fa-solid fa-location-dot"></i> ${c.location}</p>
        
        <div style="margin: 1rem 0;">
          <strong>Available Vaccines:</strong><br>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.5rem;">
            ${c.vaccines.map(v => `<span style="background:#d1fae5; color:#065f46; padding:0.2rem 0.5rem; border-radius:4px; font-size:0.8rem;">${v}</span>`).join('')}
          </div>
        </div>
        
        <p style="margin-bottom: 1rem;"><strong><i class="fa-regular fa-clock"></i></strong> ${c.schedule}</p>
        
        <button class="btn btn-secondary" onclick="alert('Booking portal is a premium feature!')">Book Appointment</button>
      </div>
    `;
  });
}

function renderFees() {
  const hospitals = getHospitals();
  feesList.innerHTML = '';

  hospitals.forEach(h => {
    feesList.innerHTML += `
      <tr>
        <td style="font-weight: 500; color: var(--primary-color);">${h.name}</td>
        <td>${h.city}</td>
        <td>₹${h.emergencyFee}</td>
        <td>₹${h.consultationFee}</td>
        <td>₹${h.icuCost}</td>
        <td><a href="tel:${h.emergencyContact}" style="color:var(--secondary-color); text-decoration:none;"><i class="fa-solid fa-phone"></i> ${h.emergencyContact}</a></td>
      </tr>
    `;
  });
}

function renderDoctors(doctorsData = getDoctors()) {
  doctorsList.innerHTML = '';

  if (doctorsData.length === 0) {
    doctorsList.innerHTML = '<p>No doctors found matching your criteria.</p>';
    return;
  }

  doctorsData.forEach(d => {
    const hospital = getHospitalById(d.hospitalId);
    doctorsList.innerHTML += `
      <div class="hospital-card doctor-card">
        <img src="${d.image}" alt="${d.name}" class="doctor-img">
        <h3>${d.name}</h3>
        <p class="doc-specialty"><i class="fa-solid fa-stethoscope"></i> ${d.specialty}</p>
        <p style="font-size: 0.9rem; color: var(--text-secondary);"><i class="fa-solid fa-hospital"></i> ${hospital ? hospital.name : 'Independent Clinic'}</p>
        
        <div class="doc-info">
          <span><i class="fa-solid fa-star" style="color: #fbbf24;"></i> ${d.rating}</span>
          <span><i class="fa-solid fa-briefcase"></i> ${d.experience} Yrs</span>
          <span><i class="fa-solid fa-indian-rupee-sign"></i> ${d.fee}</span>
        </div>
        
        <button class="btn" style="margin-top: 1rem;" onclick="alert('Appointment booking coming soon!')">Book Consult</button>
      </div>
    `;
  });
}

// Global Search
searchBtn.addEventListener('click', handleGlobalSearch);
globalsSearchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleGlobalSearch();
});

function handleGlobalSearch() {
  const term = globalsSearchInput.value.toLowerCase().trim();
  if (!term) return;

  window.location.hash = '#beds';
  const filtered = getHospitals().filter(h =>
    h.name.toLowerCase().includes(term) ||
    h.city.toLowerCase().includes(term) ||
    h.services.some(s => s.toLowerCase().includes(term))
  );
  renderHospitals(filtered);
}

// Filtering Lists
cityFilter.addEventListener('change', filterHospitals);
typeFilter.addEventListener('change', filterHospitals);
specialtyFilter.addEventListener('change', filterDoctors);

function filterHospitals() {
  let filtered = getHospitals();
  const city = cityFilter.value;
  const type = typeFilter.value;

  if (city !== 'all') filtered = filtered.filter(h => h.city === city);
  if (type !== 'all') filtered = filtered.filter(h => h.type === type);

  renderHospitals(filtered);
}

function filterDoctors() {
  const spec = specialtyFilter.value;
  if (spec === 'all') {
    renderDoctors(getDoctors());
  } else {
    renderDoctors(getDoctors().filter(d => d.specialty === spec));
  }
}

// View Hospital Details
window.viewHospital = function (id) {
  const h = getHospitalById(id);
  if (!h) return;

  const isAvailable = h.availableBeds > 0;
  const docs = getDoctorsByHospital(id);

  hospitalDetailContent.innerHTML = `
    <div style="background: white; border-radius: var(--border-radius); padding: 2rem; box-shadow: var(--shadow-md);">
      <div style="display:flex; justify-content:space-between; flex-wrap:wrap; align-items:flex-start; margin-bottom: 2rem;">
        <div>
          <h2 style="font-size: 2.5rem; color: var(--primary-color);">${h.name}</h2>
          <p style="font-size: 1.1rem; color: var(--text-secondary);"><i class="fa-solid fa-location-dot"></i> ${h.city} &middot; <span style="text-transform:capitalize;">${h.type}</span> Hospital</p>
        </div>
        <div style="text-align: right; background: #f8fafc; padding: 1rem; border-radius: 8px;">
          <h3 style="margin-bottom:0.5rem;">Emergency Contact</h3>
          <a href="tel:${h.emergencyContact}" style="font-size: 1.5rem; font-weight: bold; color: var(--danger-color); text-decoration: none;">
            <i class="fa-solid fa-phone"></i> ${h.emergencyContact}
          </a>
        </div>
      </div>
      
      <div class="bed-stats" style="margin-bottom: 2rem; background: #f0fdf4; border: 1px solid #bbf7d0;">
        <div class="stat">
          <span class="stat-label">Total Valid Beds</span>
          <span class="stat-val" style="font-size: 2rem;">${h.availableBeds} <span style="font-size:1rem;font-weight:normal;color:var(--text-secondary)">/ ${h.totalBeds} total</span></span>
        </div>
        <div class="stat">
          <span class="stat-label">ICU Vacancy</span>
          <span class="stat-val" style="font-size: 2rem;">${h.availableIcuBeds} <span style="font-size:1rem;font-weight:normal;color:var(--text-secondary)">/ ${h.icuBeds} total</span></span>
        </div>
      </div>

      <h3 style="margin-bottom:1rem;"><i class="fa-solid fa-briefcase-medical" style="color:var(--secondary-color)"></i> Services Offered</h3>
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:2rem;">
        ${h.services.map(s => `<span style="background:var(--background-color); border:1px solid var(--border-color); padding:0.5rem 1rem; border-radius:20px;">${s}</span>`).join('')}
      </div>

      <h3 style="margin-bottom:1rem;"><i class="fa-solid fa-user-md" style="color:var(--primary-color)"></i> Top Doctors Here</h3>
      <div class="list-grid">
        ${docs.length ? docs.map(d => `
          <div class="hospital-card doctor-card" style="box-shadow:none; border:1px solid var(--border-color);">
            <img src="${d.image}" alt="${d.name}" class="doctor-img" style="width:60px; height:60px;">
            <h4>${d.name}</h4>
            <p class="doc-specialty" style="font-size:0.8rem;">${d.specialty}</p>
          </div>
        `).join('') : '<p>No specific doctors listed for this hospital yet.</p>'}
      </div>
    </div>
  `;

  window.location.hash = '#hospital-details';
};
