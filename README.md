# Bora Correr

Aplicação web para monitoramento de corridas em tempo real e cálculo de pace, desenvolvida com JavaScript vanilla.

## 📋 Funcionalidades

### Rastreamento de Corrida
- Monitoramento em tempo real de distância, tempo e pace
- Visualização do percurso no mapa (Leaflet.js)
- Controles de pausar/retomar e finalizar corrida
- Histórico de corridas salvo localmente

### Calculadora de Pace
- Cálculo de pace (min/km) a partir de distância e tempo
- Exibição de velocidade média (km/h)
- Validação de valores e alertas para valores improváveis

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework CSS**: Bootstrap 5.3.0
- **Mapas**: Leaflet.js 1.9.4
- **APIs**: Geolocation API, LocalStorage
- **Ícones**: Bootstrap Icons

## 📁 Estrutura de Arquivos

```
├── index.html          # Página principal (rastreamento)
├── calculadora.html    # Página da calculadora de pace
├── script.js           # Lógica do rastreamento
├── calculadora.js      # Lógica da calculadora
├── style.css           # Estilos compartilhados
└── package.json        # Configuração do projeto
```

## 🚀 Como Usar

### Rastreamento de Corrida
1. Abra `index.html` no navegador
2. Permita acesso à localização quando solicitado
3. Clique em "Iniciar Corrida"
4. Use os controles para pausar/retomar ou finalizar

### Calculadora de Pace
1. Acesse `calculadora.html` ou clique no menu "Calculadora de Pace"
2. Insira a distância (km) e o tempo (horas, minutos, segundos)
3. Clique em "Calcular Pace"
4. Visualize os resultados: pace, velocidade média, tempo total e distância

## ⚙️ Requisitos

- Navegador moderno com suporte a:
  - Geolocation API
  - LocalStorage
  - ES6+ JavaScript
- Permissão de localização (para rastreamento)
- GPS ativo (recomendado para melhor precisão)

## 🔧 Arquitetura

### Rastreamento (`script.js`)
- Estado centralizado em objeto `state`
- Cálculo de distância usando fórmula de Haversine
- Gerenciamento de pausas com compensação de tempo
- Armazenamento de histórico em memória

### Calculadora (`calculadora.js`)
- Classe `PaceCalculator` com métodos estáticos
- Conversão de tempo para segundos (unidade base)
- Validação de valores (pace: 60-3000 seg/km, velocidade: 1-50 km/h)
- Formatação de tempo (HH:MM:SS ou MM:SS)

## 📊 Cálculos

### Pace
```
Pace (seg/km) = Tempo Total (seg) / Distância (km)
```

### Velocidade
```
Velocidade (km/h) = Distância (km) / Tempo (horas)
```

### Distância (Haversine)
```
d = 2R × arcsin(√(sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)))
```

## 🎨 Design

- **Mobile-first**: Interface otimizada para dispositivos móveis
- **Responsivo**: Layout adaptável com Bootstrap
- **Minimalista**: Design limpo e focado na funcionalidade

## 📝 Notas Técnicas

- Aplicação cliente-side (sem backend)
- Dados armazenados apenas no navegador (LocalStorage)
- Cálculos realizados em segundos para evitar erros de precisão
- Tratamento de erros de geolocalização com mensagens amigáveis
