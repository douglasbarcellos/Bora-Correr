# BoraCorrer

Bora Correr é uma aplicação web mobile-first para monitoramento de corridas em tempo real, desenvolvida com JavaScript vanilla, Bootstrap e Leaflet.js.

## 🎯 Funcionalidades

- **Monitoramento em Tempo Real**
  - Distância percorrida
  - Tempo de corrida
  - Pace (minutos por quilômetro)
  - Visualização do percurso no mapa

- **Controles de Corrida**
  - Iniciar corrida
  - Pausar/Retomar
  - Finalizar corrida

- **Histórico de Corridas**
  - Registro automático de corridas finalizadas
  - Visualização de estatísticas por corrida
  - Ordenação por data (mais recente primeiro)

## 🛠️ Tecnologias Utilizadas

- **HTML5**
  - Geolocation API
  - LocalStorage para persistência de dados

- **CSS3**
  - Bootstrap 5.3.0 para layout responsivo
  - Animações e transições personalizadas

- **JavaScript**
  - Vanilla JS (ES6+)
  - Leaflet.js para mapas interativos
  - Promises e Async/Await para operações assíncronas

## 📱 Design Mobile-First

A aplicação foi desenvolvida seguindo o princípio mobile-first, garantindo:
- Interface otimizada para dispositivos móveis
- Elementos de tamanho adequado para touch
- Layout responsivo que se adapta a diferentes tamanhos de tela

## 🗺️ Funcionalidades do Mapa

- Visualização em tempo real do percurso
- Traçado automático da rota
- Centralização automática na posição atual
- Zoom otimizado para visualização do percurso

## ⚡ Performance

- Carregamento otimizado de recursos
- Código modular e organizado
- Manipulação eficiente do DOM
- Gerenciamento de estado centralizado

## 🔒 Tratamento de Permissões

- Verificação automática de permissão de geolocalização
- Mensagens de erro amigáveis
- Instruções claras para o usuário
- Fallback para navegadores sem suporte

## 💾 Armazenamento de Dados

- Histórico de corridas salvo localmente
- Persistência através do LocalStorage
- Formato de dados otimizado
- Não requer conexão com servidor

## 🎨 Interface

### Telas
1. **Tela Inicial**
   - Botão de início de corrida
   - Histórico de corridas anteriores

2. **Tela de Corrida**
   - Mapa em tempo real
   - Estatísticas atuais
   - Controles de corrida

### Componentes
- Cards com sombras suaves
- Botões com feedback visual
- Alertas informativos
- Ícones intuitivos

## 📊 Estrutura de Dados

### Corrida
```javascript
{
    distance: "0.00",    // Distância em km
    time: "00:00:00",    // Tempo total
    pace: "0:00",        // Minutos por km
    date: "DD/MM/YYYY"   // Data da corrida
}
```

## 🚀 Como Usar

1. Abra a aplicação no navegador
2. Permita o acesso à localização quando solicitado
3. Clique em "Iniciar Corrida"
4. Durante a corrida:
   - Visualize suas estatísticas em tempo real
   - Pause/retome quando necessário
   - Finalize quando concluir
5. Visualize o histórico de corridas na tela inicial

## ⚠️ Requisitos

- Navegador moderno com suporte a:
  - Geolocation API
  - LocalStorage
  - ES6+ JavaScript
- Permissão de localização ativada
- GPS disponível (para melhor precisão)

## 🔍 Tratamento de Erros

- Verificação de suporte do navegador
- Validação de permissões
- Feedback visual para erros
- Instruções de recuperação

## 🛡️ Boas Práticas

- Código limpo e bem documentado
- Funções modulares e reutilizáveis
- Tratamento adequado de erros
- Interface intuitiva e responsiva

## 📝 Notas de Desenvolvimento

- Aplicação desenvolvida com foco em performance
- Design minimalista e funcional
- Código organizado e escalável
- Pronto para futuras implementações