// Elementos do DOM
const screens = {
    start: document.getElementById('start-screen'),
    running: document.getElementById('running-screen')
};

const elements = {
    distance: document.getElementById('distance'),
    time: document.getElementById('time'),
    pace: document.getElementById('pace'),
    map: document.getElementById('map'),
    runHistory: document.getElementById('run-history')
};

const buttons = {
    start: document.getElementById('start-run'),
    pause: document.getElementById('pause-run'),
    resume: document.getElementById('resume-run'),
    finish: document.getElementById('finish-run')
};

// Estado da aplicação
const state = {
    isRunning: false,
    isPaused: false,
    startTime: null,
    pausedTime: 0,
    totalPausedTime: 0,
    pauseStartTime: null,
    totalDistance: 0,
    previousPosition: null,
    watchId: null,
    map: null,
    path: null,
    timerInterval: null,
    runs: []
};

// Verificação de permissão de geolocalização
async function checkGeolocationPermission() {
    if (!('geolocation' in navigator)) {
        showGeolocationError('Seu navegador não suporta geolocalização.');
        return false;
    }

    try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'denied') {
            showGeolocationError('Permissão de localização negada. Por favor, permita o acesso à sua localização nas configurações do navegador.');
            return false;
        }
        
        return true;
    } catch (error) {
        // Fallback para navegadores que não suportam permissions API
        return true;
    }
}

function showGeolocationError(message) {
    const errorHtml = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    const errorContainer = document.createElement('div');
    errorContainer.innerHTML = errorHtml;
    elements.runHistory.insertAdjacentElement('beforebegin', errorContainer.firstChild);
}

// Inicialização do mapa
function initializeMap() {
    state.map = L.map(elements.map, {
        zoomControl: false,
        attributionControl: false
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(state.map);
    state.path = L.polyline([], { color: '#0d6efd', weight: 4 }).addTo(state.map);
}

// Gerenciamento de telas
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Funções de tempo
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

function updateTimer() {
    if (!state.isRunning || state.isPaused) return;
    
    const currentTime = Date.now();
    const elapsedTime = currentTime - state.startTime - state.totalPausedTime;
    elements.time.textContent = formatTime(elapsedTime);
    updatePace(elapsedTime);
}

function updatePace(elapsedTime) {
    if (state.totalDistance === 0) {
        elements.pace.textContent = '0:00';
        return;
    }

    const paceInMinutesPerKm = (elapsedTime / 60000) / state.totalDistance;
    const paceMinutes = Math.floor(paceInMinutesPerKm);
    const paceSeconds = Math.floor((paceInMinutesPerKm - paceMinutes) * 60);
    elements.pace.textContent = `${paceMinutes}:${pad(paceSeconds)}`;
}

// Gerenciamento de posição
async function startPositionTracking() {
    const hasPermission = await checkGeolocationPermission();
    if (!hasPermission) return;

    if ('geolocation' in navigator) {
        state.watchId = navigator.geolocation.watchPosition(
            updatePosition,
            handleGeolocationError,
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }
}

function updatePosition(position) {
    if (!state.isRunning || state.isPaused) return;

    const { latitude, longitude } = position.coords;
    const currentPosition = [latitude, longitude];

    if (state.previousPosition) {
        const distance = calculateDistance(state.previousPosition, currentPosition);
        state.totalDistance += distance;
        elements.distance.textContent = state.totalDistance.toFixed(2);
    } else {
        state.map.setView(currentPosition, 16);
    }

    state.path.addLatLng(currentPosition);
    state.previousPosition = currentPosition;
    state.map.panTo(currentPosition);
}

function calculateDistance(pos1, pos2) {
    const R = 6371; // Raio da Terra em km
    const [lat1, lon1] = pos1;
    const [lat2, lon2] = pos2;
    
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
             Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
             Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(degrees) {
    return degrees * Math.PI / 180;
}

// Ações da corrida
async function startRun() {
    const hasPermission = await checkGeolocationPermission();
    if (!hasPermission) return;

    state.isRunning = true;
    state.startTime = Date.now();
    state.totalPausedTime = 0;
    state.totalDistance = 0;
    state.previousPosition = null;
    
    showScreen('running');
    startPositionTracking();
    state.timerInterval = setInterval(updateTimer, 1000);
}

function pauseRun() {
    state.isPaused = true;
    state.pauseStartTime = Date.now();
    buttons.pause.classList.add('d-none');
    buttons.resume.classList.remove('d-none');
}

function resumeRun() {
    state.isPaused = false;
    state.totalPausedTime += Date.now() - state.pauseStartTime;
    buttons.resume.classList.add('d-none');
    buttons.pause.classList.remove('d-none');
}

function finishRun() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - state.startTime - state.totalPausedTime;
    
    const runData = {
        distance: state.totalDistance.toFixed(2),
        time: formatTime(elapsedTime),
        pace: elements.pace.textContent,
        date: new Date().toLocaleString()
    };

    state.runs.unshift(runData);
    updateRunHistory();
    
    state.isRunning = false;
    clearInterval(state.timerInterval);
    navigator.geolocation.clearWatch(state.watchId);
    showScreen('start');
}

function updateRunHistory() {
    elements.runHistory.innerHTML = state.runs.map(run => `
        <div class="card shadow-sm mb-3">
            <div class="card-body">
                <div class="row text-center">
                    <div class="col-4">
                        <div class="stat-label">Distância</div>
                        <div class="stat-value">${run.distance}</div>
                        <div class="stat-unit">km</div>
                    </div>
                    <div class="col-4">
                        <div class="stat-label">Tempo</div>
                        <div class="stat-value">${run.time}</div>
                    </div>
                    <div class="col-4">
                        <div class="stat-label">Pace</div>
                        <div class="stat-value">${run.pace}</div>
                        <div class="stat-unit">min/km</div>
                    </div>
                </div>
                <div class="text-muted text-center mt-2">
                    <small>${run.date}</small>
                </div>
            </div>
        </div>
    `).join('');
}

function handleGeolocationError(error) {
    let message = 'Erro ao acessar sua localização.';
    
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = 'Permissão de localização negada. Por favor, permita o acesso à sua localização nas configurações do navegador.';
            break;
        case error.POSITION_UNAVAILABLE:
            message = 'Informações de localização indisponíveis. Verifique sua conexão GPS.';
            break;
        case error.TIMEOUT:
            message = 'Tempo excedido ao tentar obter sua localização. Tente novamente.';
            break;
    }
    
    showGeolocationError(message);
    
    if (state.isRunning) {
        finishRun();
    }
}

// Event Listeners
buttons.start.addEventListener('click', startRun);
buttons.pause.addEventListener('click', pauseRun);
buttons.resume.addEventListener('click', resumeRun);
buttons.finish.addEventListener('click', finishRun);

// Inicialização
initializeMap();