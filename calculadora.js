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
     * CALCULAR PACE (min/km)
     * Retorna o pace em SEGUNDOS por km
     */
    static calculatePace(totalSeconds, distance) {
        if (distance <= 0) return 0;
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

}

// Gerenciamento da Interface
const UI = {
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
        // Velocidade muito alta (mais de 50 km/h)
        if (speed > 50) {
            this.showWarning('Velocidade muito alta! Verifique os valores.');
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

// Função de Cálculo
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
    
    // Calcular pace
    const paceSeconds = PaceCalculator.calculatePace(totalSeconds, distance);
    
    // Validar pace
    UI.validatePace(paceSeconds);
    
    // Calcular velocidade
    const speed = PaceCalculator.calculateSpeed(totalSeconds, distance);
    UI.validateSpeed(speed);
    
    // Exibir resultados
    document.getElementById('result-pace-value').textContent = PaceCalculator.formatTime(paceSeconds);
    document.getElementById('result-speed-value').textContent = speed.toFixed(1);
    document.getElementById('result-time-value').textContent = PaceCalculator.formatTime(totalSeconds);
    document.getElementById('result-distance-value').textContent = distance.toFixed(2);
    
    // Mostrar todos os resultados
    document.getElementById('result-pace').classList.remove('d-none');
    document.getElementById('result-speed').classList.remove('d-none');
    document.getElementById('result-time').classList.remove('d-none');
    document.getElementById('result-distance').classList.remove('d-none');
    
    UI.showResults();
}

