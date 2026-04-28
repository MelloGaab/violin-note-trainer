# Violin Note Trainer — Design Ideas

## Abordagem Escolhida: "Partitura Viva"

### Design Movement
**Music Manuscript + Modern Minimal** — inspirado em partituras manuscritas clássicas, com clareza digital contemporânea.

### Core Principles
1. O pentagrama é o herói absoluto — tudo orbita em torno dele
2. Contraste intencional: fundo creme/papel envelhecido vs. tinta preta precisa
3. Hierarquia visual clara: nota > feedback > controles > estatísticas
4. Espaço em branco generoso para reduzir fadiga visual durante treino prolongado

### Color Philosophy
- **Background**: `oklch(0.97 0.012 85)` — creme suave, como papel de partitura
- **Primary**: `oklch(0.25 0.04 260)` — azul-marinho profundo (tinta de caneta)
- **Accent Success**: `oklch(0.55 0.18 145)` — verde musgo (acerto)
- **Accent Error**: `oklch(0.55 0.22 25)` — vermelho terracota (erro)
- **Staff lines**: `oklch(0.15 0.01 260)` — quase preto
- **Muted**: `oklch(0.75 0.02 85)` — bege médio para elementos secundários

### Layout Paradigm
- **Split assimétrico**: painel esquerdo estreito (controles/config) + área central dominante (pentagrama) + painel direito (progresso)
- Em mobile: stack vertical com pentagrama no topo
- Pentagrama ocupa no mínimo 50% da viewport

### Signature Elements
1. **Linhas do pentagrama** desenhadas via SVG com leve variação de espessura (manuscrito)
2. **Nota animada** com entrada suave (drop + fade) e saída elegante
3. **Indicador de corda** visual: diagrama simplificado do violino ao lado do pentagrama

### Interaction Philosophy
- Feedback imediato e inequívoco (cor + som + ícone)
- Timer visual como arco circular ao redor da nota
- Transições suaves mas rápidas (< 300ms) para não interromper o fluxo de treino

### Animation
- Nota entra: `translateY(-20px) → 0` com `opacity 0 → 1`, duração 250ms, easing `ease-out`
- Nota sai: `scale(1) → scale(0.8)` com `opacity 1 → 0`, duração 200ms
- Feedback correto: flash verde suave no fundo do pentagrama
- Feedback errado: shake horizontal leve (3 ciclos, 300ms total)
- Timer: arco SVG animado com `stroke-dashoffset`

### Typography System
- **Display/Títulos**: `Playfair Display` — serifado elegante, evoca tradição musical
- **UI/Controles**: `DM Sans` — sans-serif limpo e legível
- **Notas/Labels musicais**: `DM Mono` — precisão para nomes de notas
- Hierarquia: 32px título, 18px subtítulo, 14px UI, 12px labels
