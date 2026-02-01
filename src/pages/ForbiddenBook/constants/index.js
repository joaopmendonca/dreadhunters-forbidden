// src/pages/ForbiddenBook/constants/index.js

/**
 * Configuração dos capítulos do Forbidden Book
 * Cada capítulo representa uma seção do grimório
 */
export const CHAPTERS = {
  COVER: 'cover',
  SETTINGS: 'settings',
  LORE: 'lore',
  CLASSES: 'classes',
  SKILLS: 'skills',
  ATTRIBUTES: 'attributes',
  AFFLICTIONS: 'afflictions',
  DAMAGE_TYPES: 'damageTypes',
  ITEMS: 'items',
  ENEMIES: 'enemies',
  QUESTS: 'quests',
  LOCATIONS: 'locations',
  ROLES: 'roles',
};

export const CHAPTER_CONFIG = {
  [CHAPTERS.COVER]: {
    id: CHAPTERS.COVER,
    title: 'Capa',
    icon: '📖',
    subtitle: null,
    endpoint: null,
  },
  [CHAPTERS.SETTINGS]: {
    id: CHAPTERS.SETTINGS,
    title: 'Configurações',
    icon: '⚙️',
    subtitle: 'Ajustes do Grimório',
    endpoint: null,
    intro: `Antes de mergulhar nos segredos deste grimório, configure o servidor 
de onde deseja consultar as informações. Cada servidor pode conter dados diferentes, 
representando mundos paralelos no universo de Dread Hunters.`,
  },
  [CHAPTERS.LORE]: {
    id: CHAPTERS.LORE,
    title: 'A História',
    icon: '📜',
    subtitle: 'As Origens do Mundo Sombrio',
    endpoint: null,
  },
  [CHAPTERS.CLASSES]: {
    id: CHAPTERS.CLASSES,
    title: 'Classes',
    icon: '⚔️',
    subtitle: 'Os Caminhos dos Caçadores',
    endpoint: '/classes',
    intro: `As Classes definem a essência de um personagem. Cada classe representa 
um caminho distinto de poder e especialização, forjado nas trevas que consomem o mundo.

Para cadastrar uma nova Classe, é necessário definir:
• Nome único e identificador (slug)
• Role associada (Tank, DPS, Suporte, etc.)
• Descrição narrativa do caminho
• Modificadores de atributos base
• Árvore de habilidades disponíveis`,
    gameDesign: `**Balanceamento e Progressão**

Cada classe é balanceada através de três pilares:
• **Atributos Base**: Modificadores únicos que definem a identidade (ex: Tank +HP, DPS +Dano)
• **Árvore de Habilidades**: 3-5 habilidades exclusivas por classe, desbloqueadas por nível
• **Sinergia com Role**: Classes compartilham role para facilitar composição de grupo

**Design de Identidade**

Evite overlapping de mecânicas — cada classe deve ter um "momento de brilho" único:
• Tank: Proteger aliados e controlar aggro
• DPS: Burst damage ou sustain damage consistente
• Suporte: Cura, buffs ou debuffs em área
• Hybrid: Trade-offs claros (menos dano OU menos cura que especializados)

**Escalabilidade**

Classes devem escalar de forma linear com nível para evitar power spikes desbalanceados. Use fórmulas consistentes para HP/Mana/Dano ganhos por nível.`,
  },

  [CHAPTERS.SKILLS]: {
    id: CHAPTERS.SKILLS,
    title: 'Habilidades',
    icon: '✨',
    subtitle: 'Os Poderes Ancestrais',
    endpoint: '/skills',
    intro: `As Habilidades são manifestações de poder que os Caçadores dominam em sua 
jornada. Desde golpes devastadores até encantamentos de proteção, cada habilidade 
conta uma história de conquista sobre as trevas.

Para cadastrar uma nova Habilidade:
• Nome e descrição evocativa
• Tipo (Ativa, Passiva, Ultimate)
• Custos (Mana, Stamina, HP)
• Cooldown e duração
• Fórmulas de dano ou efeito
• Tipos de dano associados
• Requisitos de nível`,
    gameDesign: `**Sistema de Custos e Cooldowns**

Habilidades devem ter trade-offs claros:
• **Baixo custo + Alto CD**: Habilidades poderosas de uso tático (8-15s)
• **Alto custo + Baixo CD**: Spam skills para gastar recursos (2-4s)
• **Ultimate (0 CD)**: Custo altíssimo ou condição especial (50%+ mana)

**Fórmulas de Dano**

Use scaling consistente:
\`\`\`
Dano = (BaseDamage + AtributoEscala * Multiplicador) * TipoDano
BaseDamage: 10-50 (low) | 50-100 (mid) | 100-200+ (high)
Multiplicador: 0.5-1.5 para balanceamento
\`\`\`

**Tipos de Habilidades**

• **Ativas**: Requerem input do jogador, impacto imediato
• **Passivas**: Sempre ativas, buffs permanentes modestos (+5-15%)
• **Toggle**: Custo contínuo (ex: -5 mana/s), efeito enquanto ativa
• **Ultimate**: Skill definidora da classe, longo CD ou custo máximo`,
  },

  [CHAPTERS.ATTRIBUTES]: {
    id: CHAPTERS.ATTRIBUTES,
    title: 'Atributos',
    icon: '📊',
    subtitle: 'A Essência do Poder',
    endpoint: '/status',
    intro: `Os Atributos são os pilares fundamentais que definem a força de um Caçador. 
Cada ponto investido molda o destino do personagem, determinando sua capacidade 
de sobreviver aos horrores que espreitam nas sombras.

Para cadastrar um novo Atributo:
• Nome e abreviação (STR, DEX, etc.)
• Categoria (Primário, Secundário, Derivado)
• Descrição do que representa
• Fórmulas de cálculo (para derivados)
• Valor base e limites`,
    gameDesign: `**Categorias de Atributos**

• **Primários (Core)**: STR, DEX, INT, VIT, WIS — Jogador distribui pontos
• **Secundários**: Armadura, Resistências — Derivados de equipamentos
• **Derivados**: HP, Mana, Crit Chance — Calculados por fórmulas

**Economia de Pontos**

Cada nível deve conceder 3-5 pontos de atributo para distribuição.
Limite soft cap em 100-150 pontos para evitar min/maxing extremo.

**Impacto de Atributos**

Cada ponto deve ter impacto perceptível:
• **STR**: +2 HP, +0.5 Dano Físico
• **INT**: +2 Mana, +0.5 Dano Mágico
• **VIT**: +5 HP, +0.2 Regen HP/s
• **DEX**: +0.3% Crit, +0.1% Esquiva
• **WIS**: +2 Mana, +0.2% Regen Mana

**Atributos Derivados**

Use fórmulas transparentes:
\`\`\`
HP = (VIT * 10) + (STR * 2) + BaseHP
Mana = (WIS * 8) + (INT * 3) + BaseMana
Crit% = (DEX * 0.3) + (LUK * 0.2)
\`\`\``,
  },

  [CHAPTERS.AFFLICTIONS]: {
    id: CHAPTERS.AFFLICTIONS,
    title: 'Aflições',
    icon: '☠️',
    subtitle: 'As Maldições que Consomem',
    endpoint: '/afflictions',
    intro: `As Aflições são condições terríveis que assombram os Caçadores. Venenos 
que corroem a alma, maldições ancestrais e doenças sobrenaturais que testam 
até os mais resilientes guerreiros.

Para cadastrar uma nova Aflição:
• Nome sinistro e descrição do horror
• Categoria (Veneno, Maldição, Doença, Mental)
• Efeitos por turno ou duração
• Severidade (Leve, Moderada, Grave, Letal)
• Condições de cura
• Resistências que podem prevenir`,
    gameDesign: `**Sistema de Severidade**

Aflições escalam em severidade para criar tensão progressiva:
• **Leve**: -5-10% stats, removível com item comum
• **Moderada**: -15-25% stats, requer consumível raro
• **Grave**: -30-40% stats + DoT, requer skill/NPC/quest
• **Letal**: Condição terminal, morte em X turnos se não curada

**Mecânica de Empilhamento**

Aflições do mesmo tipo podem empilhar (stack) até 3x, aumentando duração ou severidade.
Exemplo: Veneno Lv1 → Lv2 → Lv3 (Letal)

**Contramedidas**

Cada aflição deve ter múltiplas formas de cura:
• **Itens**: Antídotos, poções de cura
• **Skills**: Habilidades de suporte/cura
• **Resistências**: Atributos WIS/VIT reduzem chance/duração
• **Tempo**: Algumas expiram naturalmente (10-30s)

**Balanceamento PvE vs PvP**

Em PvE, aflições devem ser desafiadoras mas gerenciáveis.
Em PvP, limite duração máxima (5-10s) para evitar perma-CC.`,
  },

  [CHAPTERS.DAMAGE_TYPES]: {
    id: CHAPTERS.DAMAGE_TYPES,
    title: 'Tipos de Dano',
    icon: '🔥',
    subtitle: 'As Forças Elementais',
    endpoint: '/damage-types',
    intro: `Os Tipos de Dano representam as diferentes formas de destruição que existem 
no mundo. Desde o fogo purificador até as trevas consumidoras, cada tipo possui 
interações únicas com resistências e vulnerabilidades.

Para cadastrar um novo Tipo de Dano:
• Nome e ícone representativo
• Cor identificadora (para UI)
• Descrição temática
• Fórmulas de cálculo base
• Atributo que escala (STR, INT, etc.)`,
    gameDesign: `**Sistema de Resistências e Vulnerabilidades**

Cada tipo de dano interage com resistências:
\`\`\`
Dano Final = Dano Base * (1 - Resistência%) * (1 + Vulnerabilidade%)
\`\`\`

**Categorias de Dano**

• **Físico** (STR): Cortante, Perfurante, Contundente
• **Mágico** (INT): Fogo, Gelo, Raio, Arcano
• **Verdadeiro**: Ignora resistências (use com moderação)
• **Híbrido**: 50% Físico + 50% Mágico (anti-tank)

**Balanceamento Elemental**

Crie um ciclo de vantagens:
🔥 Fogo > 🌿 Natureza > 💧 Água > 🔥 Fogo
⚡ Raio > 💧 Água | ❄️ Gelo > 🌿 Natureza

**Escalabilidade**

Todos os tipos devem escalar igualmente:
• Dano Físico = BaseDmg + (STR * 1.0)
• Dano Mágico = BaseDmg + (INT * 1.0)

Evite criar "tipo superior" — diversidade > meta única.`,
  },

  [CHAPTERS.ITEMS]: {
    id: CHAPTERS.ITEMS,
    title: 'Itens',
    icon: '🎒',
    subtitle: 'Relíquias e Equipamentos',
    endpoint: '/items',
    intro: `Os Itens são ferramentas essenciais na sobrevivência de um Caçador. 
De armas forjadas em sangue de demônio a poções que restauram a vontade de viver, 
cada item possui sua própria história e propósito.

Para cadastrar um novo Item:
• Nome, descrição e imagem
• Tipo (Arma, Armadura, Consumível, Material, Quest)
• Raridade (Comum a Lendário)
• Slot de equipamento (se aplicável)
• Modificadores de atributos
• Efeitos especiais e requisitos
• Valor de compra/venda`,
    gameDesign: `**Sistema de Raridade**

Raridade define poder e drop rate:
• **Comum** (Branco): Stats +5-10, drop 50%
• **Incomum** (Verde): Stats +10-20, drop 25%
• **Raro** (Azul): Stats +20-35, 1 efeito, drop 12%
• **Épico** (Roxo): Stats +35-50, 2 efeitos, drop 5%
• **Lendário** (Dourado): Stats +50-80, 3 efeitos únicos, drop 1%

**Economia de Items**

Preço base escala exponencialmente com raridade:
\`\`\`
Comum: 10-100 ouro
Incomum: 100-500 ouro
Raro: 500-2500 ouro
Épico: 2500-10000 ouro
Lendário: Bind on Pickup (não vendível)
\`\`\`

**Slots de Equipamento**

Padronize: Cabeça, Torso, Pernas, Pés, Arma, Off-hand, 2x Acessório
Total: 8 slots para build customization

**Consumíveis**

Devem ter cooldown global (1-2s) para evitar spam.
Poções de cura: 25% / 50% / 75% / 100% HP com preços 10x / 25x / 50x / 100x.`,
  },

  [CHAPTERS.ENEMIES]: {
    id: CHAPTERS.ENEMIES,
    title: 'Inimigos',
    icon: '👹',
    subtitle: 'Os Horrores das Trevas',
    endpoint: '/enemies',
    intro: `Os Inimigos são as criaturas malignas que os Caçadores enfrentam. 
Desde bestas ferais até entidades cósmicas incompreensíveis, cada adversário 
apresenta desafios únicos que testam corpo e mente.

Para cadastrar um novo Inimigo:
• Nome aterrorizante e descrição
• Categoria (Besta, Morto-Vivo, Demônio, Aberração)
• Nível e dificuldade
• Atributos base (HP, dano, defesa)
• Habilidades e padrões de ataque
• Loot table (itens que dropa)
• Localização de spawn`,
    gameDesign: `**Escala de Dificuldade**

• **Trash Mob**: HP baixo (1-2 hits), dano moderado, quantidade alta
• **Elite**: HP médio (5-8 hits), 1 habilidade especial, drop melhor
• **Mini-Boss**: HP alto, 2-3 mecânicas, requer grupo pequeno (2-3)
• **Boss**: HP massivo, fases, mecânicas complexas, grupo completo (4-5)
• **World Boss**: Raid-level, 10+ jogadores, loot lendário

**Fórmula de Stats por Nível**

\`\`\`
HP = BaseHP * (1 + Nivel * 0.15)
Dano = BaseDmg * (1 + Nivel * 0.12)
XP_Drop = 50 * Nivel * DifficultyMultiplier
\`\`\`

**Loot Tables**

Use drop rates balanceadas:
• Comum: 60% de chance
• Incomum: 30%
• Raro: 8%
• Épico: 1.8%
• Lendário: 0.2% (bosses apenas)

**AI Patterns**

Crie padrões telegrafados para fairness:
1. Windup (0.5s): Animação de preparação
2. Ataque: Dano em área/alvo
3. Cooldown (2-5s): Vulnerable window`,
  },

  [CHAPTERS.QUESTS]: {
    id: CHAPTERS.QUESTS,
    title: 'Missões',
    icon: '📋',
    subtitle: 'Os Chamados do Destino',
    endpoint: '/quests',
    intro: `As Missões são os caminhos que guiam os Caçadores em sua jornada. 
Cada missão conta uma história, oferece desafios e recompensas que moldam 
o destino daqueles corajosos o suficiente para aceitá-las.

Para cadastrar uma nova Missão:
• Título épico e descrição narrativa
• Tipo (Principal, Secundária, Diária, Evento)
• Objetivos detalhados
• Requisitos (nível, missões anteriores)
• Recompensas (XP, itens, moedas)
• NPCs envolvidos
• Localização`,
    gameDesign: `**Tipos de Missões**

• **Principal**: História linear, XP massivo, desbloqueia conteúdo
• **Secundária**: Lore opcional, recompensas únicas (itens/skills)
• **Diária**: Reset 24h, XP/gold farming, limite de 3-5 por dia
• **Semanal**: Reset 7 dias, recompensas épicas, dificuldade maior
• **Evento**: Tempo limitado, itens exclusivos, FOMO design

**Recompensas Balanceadas**

\`\`\`
XP = NivelQuest * 100 * TipoMultiplier
Gold = NivelQuest * 50 * TipoMultiplier
Multiplier: Principal (2.0) | Secundária (1.0) | Diária (0.5)
\`\`\`

**Objetivos Variados**

Evite "mate X inimigos" repetitivo. Alterne:
• Coleta de itens (com drop rate 20-40%)
• Exploração (descubra local)
• Escort NPC (defenda contra waves)
• Puzzle/Riddle (engajamento mental)
• Boss fight (skill check)

**Chain Quests**

Crie questlines de 3-5 missões conectadas com:
- Narrativa progressiva
- Recompensa final > soma das individuais
- Unlock de dungeon/área/classe`,
  },

  [CHAPTERS.LOCATIONS]: {
    id: CHAPTERS.LOCATIONS,
    title: 'Localizações',
    icon: '🗺️',
    subtitle: 'Os Domínios Sombrios',
    endpoint: '/locations',
    intro: `As Localizações são os cenários onde as histórias se desenrolam. 
Florestas amaldiçoadas, ruínas ancestrais e cidades decadentes formam 
o palco onde Caçadores enfrentam seus destinos.

Para cadastrar uma nova Localização:
• Nome atmosférico e descrição
• Tipo (Cidade, Dungeon, Área Aberta, Boss Room)
• Nível recomendado
• Inimigos presentes
• NPCs e serviços disponíveis
• Conexões com outras áreas
• Eventos especiais`,
    gameDesign: `**Tipos de Localização**

• **Hub (Cidade)**: Safe zone, NPCs, vendors, bank, sem combate
• **Área Aberta**: Exploração livre, multiple spawns, roaming
• **Dungeon**: Instanciada, grupo recomendado, boss final
• **Raid**: 10+ jogadores, mecânicas complexas, loot tier alto
• **PvP Zone**: Contested territory, risco vs recompensa

**Level Design**

Estruturas dungeons em 3 atos:
1. **Trash gauntlet** (10-15 min): Mobs + mini-boss
2. **Puzzle/Exploration** (5 min): Quebra ritmo, recompensa opcionais
3. **Boss Fight** (5-10 min): Mecânicas únicas, loot

Total: 20-30 min por dungeon run

**Densidade de Inimigos**

• Área Aberta: 1 mob a cada 50-100m, respawn 60-120s
• Dungeon: 3-5 mobs por sala, respawn desabilitado
• Boss Room: 1 boss + adds opcionais em fases

**Serviços por Localização**

Cidades devem ter:
- Vendor (compra/venda)
- Blacksmith (repair/upgrade)
- Inn (rest/logout point)
- Quest Hub (3-5 NPCs)
- Teleport waypoint`,
  },

  [CHAPTERS.ROLES]: {
    id: CHAPTERS.ROLES,
    title: 'Roles',
    icon: '🛡️',
    subtitle: 'As Funções de Combate',
    endpoint: '/roles',
    intro: `As Roles definem a função de um Caçador em grupo. 
Cada role possui responsabilidades únicas que, quando combinadas, 
formam equipes capazes de enfrentar qualquer ameaça.

Para cadastrar uma nova Role:
• Nome e descrição da função
• Cor identificadora
• Ícone representativo
• Estatísticas enfatizadas
• Classes que podem assumir esta role`,
    gameDesign: `**Composição de Grupo**

Composição ideal para conteúdo de grupo (5 players):
• **1 Tank**: Controla aggro, absorve 60-70% do dano
• **2 DPS**: Foco em eliminar ameaças rápido
• **1 Suporte (Healer)**: Mantém grupo vivo (8-12k HPS)
• **1 Flex**: DPS/Suporte híbrido para adaptabilidade

**Responsabilidades por Role**

• **Tank**: Threat generation (+500% aggro), damage mitigation (-40-60%)
• **DPS**: Burst (100k+ em 10s) ou Sustain (60k+ em 60s)
• **Healer**: Cura single-target (50% HP) e AoE (25% HP em área)
• **Suporte**: Buffs (+15-25% stats) ou Debuffs (-15-25% enemy stats)

**Balanceamento de Solo vs Grupo**

Todas as roles devem poder jogar solo, mas com trade-offs:
• Tank: Lento para matar (50% DPS de um DPS puro)
• DPS: Frágil (morre rápido sem suporte)
• Healer: Dano baixo-moderado, sustain alto

**Reward Parity**

XP/Gold/Loot devem ser iguais para todas as roles para evitar "DPS meta".`,
  },

};

export const CHAPTER_ORDER = [
  CHAPTERS.COVER,
  CHAPTERS.SETTINGS,
  CHAPTERS.LORE,
  CHAPTERS.CLASSES,
  CHAPTERS.SKILLS,
  CHAPTERS.ATTRIBUTES,
  CHAPTERS.AFFLICTIONS,
  CHAPTERS.DAMAGE_TYPES,
  CHAPTERS.ITEMS,
  CHAPTERS.ENEMIES,
  CHAPTERS.QUESTS,
  CHAPTERS.LOCATIONS,
  CHAPTERS.ROLES,
];

export const LORE_CONTENT = {
  title: 'A Era dos Caçadores de Temores',
  sections: [
    {
      title: 'O Despertar das Trevas',
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
quis nostrud exercitation ullamco laboris.

Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint 
occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.`,
    },
    {
      title: 'O Surgimento dos Caçadores',
      content: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
doloremque laudantium, totam rem aperiam. Eaque ipsa quae ab illo inventore 
veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. 
Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.`,
    },
    {
      title: 'O Forbidden Book',
      content: `Este grimório que você segura é mais do que um simples livro de regras. 
É um artefato vivo, alimentado pelo conhecimento coletivo de todos os Caçadores 
que vieram antes.

Suas páginas se atualizam constantemente, registrando novas ameaças, habilidades 
descobertas e itens forjados. Diz a lenda que aqueles que dominam completamente 
seu conteúdo podem transcender os limites mortais.

Use este conhecimento com sabedoria, Caçador. As trevas estão sempre observando.`,
    },
  ],
};

export const RARITY_COLORS = {
  common: '#9d9d9d',
  uncommon: '#1eff00',
  rare: '#0070dd',
  epic: '#a335ee',
  legendary: '#ff8000',
  mythic: '#e6cc80',
};

export const MESSAGES = {
  LOADING: 'Decifrando os segredos ancestrais...',
  ERROR: 'O grimório resiste à leitura...',
  NO_DATA: 'Nenhum registro encontrado neste capítulo.',
};
