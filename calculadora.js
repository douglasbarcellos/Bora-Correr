// Classe PaceCalculator - Motor de Cálculo
class PaceCalculator {
    /**
     * Converte HH:MM:SS para o total de segundos (Unidade Base)
     */
    static timeToSeconds(hours, minutes, seconds) {
        return (Number(hours) * 3600) + (Number(minutes) * 60) + Number(seconds);
    }

    /**
     * Converte total de segundos de volta para um objeto legível
     */
    static secondsToTimeObject(totalSeconds) {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.round(totalSeconds % 60); // Math.round evita 59.9999
        return { hours: h, minutes: m, seconds: s };
    }

    /**
     * Formata para string "HH:MM:SS" ou "MM:SS"
     */
    static formatTime(totalSeconds) {
        const time = this.secondsToTimeObject(totalSeconds);
        const pad = (num) => num.toString().padStart(2, '0');
        
        // Se tiver horas, mostra HH:MM:SS, senão apenas MM:SS
        if (time.hours > 0) {
            return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
        }
        return `${pad(time.minutes)}:${pad(time.seconds)}`;
    }

    /**
     * CALCULAR PACE (min/km ou min/100m para natação)
     * Retorna o pace em SEGUNDOS por unidade base
     */
    static calculatePace(totalSeconds, distance, sportType = 'running', unit = 'km') {
        if (distance <= 0) return 0;
        
        // Para natação, a unidade base é 100m
        if (sportType === 'swimming') {
            const distanceIn100m = distance / 0.1; // Converter km para 100m
            return totalSeconds / distanceIn100m;
        }
        
        // Para corrida e ciclismo, usar a distância normalmente
        return totalSeconds / distance;
    }

    /**
     * CALCULAR VELOCIDADE (km/h)
     * Usado para Bike/Ciclismo
     */
    static calculateSpeed(totalSeconds, distanceKm) {
        if (totalSeconds <= 0) return 0;
        const hours = totalSeconds / 3600;
        return distanceKm / hours; // km/h
    }

    /**
     * CALCULAR TEMPO PREVISTO
     * Baseado em uma distância e um pace alvo (em segundos/unidade)
     */
    static calculatePredictedTime(paceSeconds, distance, sportType = 'running') {
        if (sportType === 'swimming') {
            const distanceIn100m = distance / 0.1;
            return paceSeconds * distanceIn100m;
        }
        return paceSeconds * distance;
    }

    /**
     * CALCULAR DISTÂNCIA
     * Baseado em tempo e pace
     */
    static calculateDistance(totalSeconds, paceSeconds, sportType = 'running') {
        if (paceSeconds <= 0) return 0;
        
        if (sportType === 'swimming') {
            const distanceIn100m = totalSeconds / paceSeconds;
            return distanceIn100m * 0.1; // Converter 100m para km
        }
        
        return totalSeconds / paceSeconds;
    }

    /**
     * Converter entre km e milhas
     */
    static convertKmToMiles(km) {
        return km / 1.60934;
    }

    static convertMilesToKm(miles) {
        return miles * 1.60934;
    }
}

// Gerenciamento da Interface
const UI = {
    getSportType: () => document.getElementById('sport-type').value,
    getUnit: () => document.querySelector('input[name="unit"]:checked').value,
    getCalcMode: () => document.getElementById('calc-mode').value,
    
    updateUnits: function() {
        const unit = this.getUnit();
        const unitText = unit === 'km' ? 'km' : 'mi';
        
        // Atualizar todos os textos de unidade
        document.getElementById('pace-distance-unit').textContent = unitText;
        document.getElementById('time-distance-unit').textContent = unitText;
        document.getElementById('time-pace-unit').textContent = unitText;
        document.getElementById('dist-pace-unit').textContent = unitText;
        document.getElementById('result-pace-unit').textContent = this.getPaceUnitText();
        document.getElementById('result-distance-unit').textContent = unitText;
    },
    
    getPaceUnitText: function() {
        const sport = this.getSportType();
        const unit = this.getUnit();
        
        if (sport === 'swimming') {
            return 'min/100m';
        }
        return unit === 'km' ? 'min/km' : 'min/mi';
    },
    
    showForm: function(mode) {
        // Esconder todos os formulários
        document.getElementById('form-pace').classList.add('d-none');
        document.getElementById('form-time').classList.add('d-none');
        document.getElementById('form-distance').classList.add('d-none');
        
        // Mostrar o formulário correto
        document.getElementById(`form-${mode}`).classList.remove('d-none');
    },
    
    showResults: function() {
        document.getElementById('results').classList.remove('d-none');
    },
    
    hideResults: function() {
        document.getElementById('results').classList.add('d-none');
    },
    
    showWarning: function(message) {
        const warningDiv = document.getElementById('result-warning');
        document.getElementById('warning-message').textContent = message;
        warningDiv.classList.remove('d-none');
    },
    
    hideWarning: function() {
        document.getElementById('result-warning').classList.add('d-none');
    },
    
    validatePace: function(paceSeconds) {
        // Pace muito rápido (menos de 1 min/km = 60 seg/km)
        if (paceSeconds < 60) {
            this.showWarning('Pace muito rápido! Verifique os valores inseridos.');
            return false;
        }
        // Pace muito lento (mais de 50 min/km = 3000 seg/km)
        if (paceSeconds > 3000) {
            this.showWarning('Pace muito lento! Verifique os valores inseridos.');
            return false;
        }
        this.hideWarning();
        return true;
    },
    
    validateSpeed: function(speed) {
        // Velocidade muito alta (mais de 50 km/h para corrida)
        const sport = this.getSportType();
        if (sport === 'running' && speed > 50) {
            this.showWarning('Velocidade muito alta para corrida! Verifique os valores.');
            return false;
        }
        // Velocidade muito baixa (menos de 1 km/h)
        if (speed < 1) {
            this.showWarning('Velocidade muito baixa! Verifique os valores.');
            return false;
        }
        return true;
    }
};

// Funções de Cálculo
function calculatePace() {
    const distance = parseFloat(document.getElementById('pace-distance').value);
    const hours = parseInt(document.getElementById('pace-hours').value) || 0;
    const minutes = parseInt(document.getElementById('pace-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('pace-seconds').value) || 0;
    
    // Validação
    if (!distance || distance <= 0) {
        alert('Por favor, insira uma distância válida maior que zero.');
        return;
    }
    
    if (hours === 0 && minutes === 0 && seconds === 0) {
        alert('Por favor, insira um tempo válido.');
        return;
    }
    
    // Converter tempo para segundos
    const totalSeconds = PaceCalculator.timeToSeconds(hours, minutes, seconds);
    
    // Converter unidade se necessário
    let distanceKm = distance;
    const unit = UI.getUnit();
    if (unit === 'mi') {
        distanceKm = PaceCalculator.convertMilesToKm(distance);
    }
    
    // Calcular pace
    const sportType = UI.getSportType();
    const paceSeconds = PaceCalculator.calculatePace(totalSeconds, distanceKm, sportType, unit);
    
    // Validar pace
    if (!UI.validatePace(paceSeconds) && sportType === 'running') {
        // Continuar mesmo com warning
    }
    
    // Calcular velocidade
    const speed = PaceCalculator.calculateSpeed(totalSeconds, distanceKm);
    UI.validateSpeed(speed);
    
    // Exibir resultados
    document.getElementById('result-pace-value').textContent = PaceCalculator.formatTime(paceSeconds);
    document.getElementById('result-speed-value').textContent = speed.toFixed(1);
    document.getElementById('result-time-value').textContent = PaceCalculator.formatTime(totalSeconds);
    document.getElementById('result-distance-value').textContent = distance.toFixed(2);
    
    // Mostrar/esconder resultados baseado no esporte
    if (sportType === 'cycling') {
        document.getElementById('result-pace').classList.add('d-none');
        document.getElementById('result-speed').classList.remove('d-none');
    } else {
        document.getElementById('result-pace').classList.remove('d-none');
        document.getElementById('result-speed').classList.remove('d-none');
    }
    
    document.getElementById('result-time').classList.remove('d-none');
    document.getElementById('result-distance').classList.remove('d-none');
    
    UI.showResults();
}

function calculateTime() {
    const distance = parseFloat(document.getElementById('time-distance').value);
    const paceMinutes = parseInt(document.getElementById('time-pace-minutes').value) || 0;
    const paceSeconds = parseInt(document.getElementById('time-pace-seconds').value) || 0;
    
    // Validação
    if (!distance || distance <= 0) {
        alert('Por favor, insira uma distância válida maior que zero.');
        return;
    }
    
    if (paceMinutes === 0 && paceSeconds === 0) {
        alert('Por favor, insira um pace válido.');
        return;
    }
    
    // Converter pace para segundos
    const paceInSeconds = PaceCalculator.timeToSeconds(0, paceMinutes, paceSeconds);
    
    // Converter unidade se necessário
    let distanceKm = distance;
    const unit = UI.getUnit();
    if (unit === 'mi') {
        distanceKm = PaceCalculator.convertMilesToKm(distance);
    }
    
    // Calcular tempo previsto
    const sportType = UI.getSportType();
    const totalSeconds = PaceCalculator.calculatePredictedTime(paceInSeconds, distanceKm, sportType);
    
    // Calcular velocidade
    const speed = PaceCalculator.calculateSpeed(totalSeconds, distanceKm);
    UI.validateSpeed(speed);
    
    // Exibir resultados
    document.getElementById('result-time-value').textContent = PaceCalculator.formatTime(totalSeconds);
    document.getElementById('result-pace-value').textContent = PaceCalculator.formatTime(paceInSeconds);
    document.getElementById('result-speed-value').textContent = speed.toFixed(1);
    document.getElementById('result-distance-value').textContent = distance.toFixed(2);
    
    // Mostrar/esconder resultados baseado no esporte
    if (sportType === 'cycling') {
        document.getElementById('result-pace').classList.add('d-none');
        document.getElementById('result-speed').classList.remove('d-none');
    } else {
        document.getElementById('result-pace').classList.remove('d-none');
        document.getElementById('result-speed').classList.remove('d-none');
    }
    
    document.getElementById('result-time').classList.remove('d-none');
    document.getElementById('result-distance').classList.remove('d-none');
    
    UI.showResults();
}

function calculateDistance() {
    const hours = parseInt(document.getElementById('dist-hours').value) || 0;
    const minutes = parseInt(document.getElementById('dist-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('dist-seconds').value) || 0;
    const paceMinutes = parseInt(document.getElementById('dist-pace-minutes').value) || 0;
    const paceSeconds = parseInt(document.getElementById('dist-pace-seconds').value) || 0;
    
    // Validação
    if (hours === 0 && minutes === 0 && seconds === 0) {
        alert('Por favor, insira um tempo válido.');
        return;
    }
    
    if (paceMinutes === 0 && paceSeconds === 0) {
        alert('Por favor, insira um pace válido.');
        return;
    }
    
    // Converter para segundos
    const totalSeconds = PaceCalculator.timeToSeconds(hours, minutes, seconds);
    const paceInSeconds = PaceCalculator.timeToSeconds(0, paceMinutes, paceSeconds);
    
    // Calcular distância
    const sportType = UI.getSportType();
    let distanceKm = PaceCalculator.calculateDistance(totalSeconds, paceInSeconds, sportType);
    
    // Converter unidade se necessário
    const unit = UI.getUnit();
    let distanceDisplay = distanceKm;
    if (unit === 'mi') {
        distanceDisplay = PaceCalculator.convertKmToMiles(distanceKm);
    }
    
    // Calcular velocidade
    const speed = PaceCalculator.calculateSpeed(totalSeconds, distanceKm);
    UI.validateSpeed(speed);
    
    // Exibir resultados
    document.getElementById('result-distance-value').textContent = distanceDisplay.toFixed(2);
    document.getElementById('result-time-value').textContent = PaceCalculator.formatTime(totalSeconds);
    document.getElementById('result-pace-value').textContent = PaceCalculator.formatTime(paceInSeconds);
    document.getElementById('result-speed-value').textContent = speed.toFixed(1);
    
    // Mostrar/esconder resultados baseado no esporte
    if (sportType === 'cycling') {
        document.getElementById('result-pace').classList.add('d-none');
        document.getElementById('result-speed').classList.remove('d-none');
    } else {
        document.getElementById('result-pace').classList.remove('d-none');
        document.getElementById('result-speed').classList.remove('d-none');
    }
    
    document.getElementById('result-time').classList.remove('d-none');
    document.getElementById('result-distance').classList.remove('d-none');
    
    UI.showResults();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar unidades quando mudar
    document.querySelectorAll('input[name="unit"]').forEach(radio => {
        radio.addEventListener('change', () => {
            UI.updateUnits();
            UI.hideResults();
        });
    });
    
    // Mudar formulário quando mudar o modo de cálculo
    document.getElementById('calc-mode').addEventListener('change', function() {
        const mode = this.value;
        UI.showForm(mode);
        UI.hideResults();
    });
    
    // Atualizar unidades quando mudar esporte
    document.getElementById('sport-type').addEventListener('change', function() {
        UI.updateUnits();
        UI.hideResults();
    });
    
    // Inicializar
    UI.updateUnits();
    UI.showForm(UI.getCalcMode());
});

