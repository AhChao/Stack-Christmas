<script setup>
import { ref, computed, defineEmits } from 'vue';

const emit = defineEmits(['start']);

const lang = ref('zh'); // 'zh' or 'en'

const translations = {
  zh: {
    designer: '設計師',
    players: '人數',
    time: '時間',
    age: '年齡',
    designerName: 'Steven Chao',
    imagesName: 'Gemini Nano Banana',
    playerCount: '2 人',
    suggestedAge: '8+',
    gameTime: '20 - 30 分鐘',
    title: '疊疊聖誕',
    subtitle: 'Stack Christmas',
    tags: ['板塊拼放', '手牌管理', '抽象策略'],
    goalsTitle: '遊戲目標',
    goalsContent: '輪流在 3x3 的聖誕樹盤面上放置掛飾板塊，完成圖樣搭配。當手牌用完仍然無法完成裝飾的人就被淘汰。誰能穩穩地把樹裝得最完整，就能來為我們的聖誕樹掛上樹頂的星星喔！',
    turnTitle: '輪到你時',
    turnContent: '從手牌選一張板塊放到盤面上（不能放在底色與裝飾顏色相同的格子上）。放下去的板塊必須和另外三個板塊組成自己的圖樣才算配對成功，只看最後放下去的板塊及它上面的圖樣。每回合必須完成至少一個配對，否則遊戲結束。',
    winTitle: '補牌與勝利',
    winContent: '完成配對後，抽取一張。此時可選擇消耗對應顏色的「精心裝飾指示物」額外多補一張板塊。當有人手牌耗盡且無法配對時遊戲結束，最後完成配對者獲勝！',
    prepTitle: '遊戲準備',
    prepStepBoard: '1. 底版鋪設',
    prepStepBoardDesc: '先把聖誕樹底版放在兩個人中間，然後找那九張純色底版（上面沒有圖樣的），隨機抽一張放在中間，然後按照這張圖上對應的內容把剩下八格排完。',
    prepStepHand: '2. 分發初始飾物板塊',
    prepStepHandDesc: '隨機配置聖誕樹盤面，每人拿取紅、綠、棕三色「精心裝飾指示物」各一枚。每人抽取 3 張初始板塊並公開。',
    selectMode: '選擇遊戲模式',
    pvpMode: '雙人對戰',
    aiMode: '挑戰 AI',
    selectDifficulty: '挑戰難度',
    backToMode: '← 返回模式',
    enterGame: '線上試玩',
    startGame: '開始裝飾 🎄',
    nextStep: '下一步',
    examplesTitle: '規則圖解 (範例)',
    legalMatchLabel: '合法：達成配對 ✅ 中間紅色框起來的是放下去的板塊，本來下面底版是咖啡色，蓋下去後和黃色框框的板塊拼成了自己中間的圖樣（三紅一綠的配對）',
    illegalColorLabel: '不合法：底色衝突 ❌ 右上角的飾物顏色是紅色，所以不能堆疊在底版上這些紅色板塊的地方，但假如之後被別的顏色覆蓋，就可以再放上去。',
    noMatchLabel: '合法：放置紅色的板塊到中間本來是咖啡色的底版位置，這是一個合法的放置，但沒有達成配對 - 如果你手上仍有別的牌，你可以繼續出牌來嘗試達成配置。',
    reshuffleLabel: '重新發牌範例：三張初始板塊皆為同色（如均為棕色裝飾），此時需將手牌洗入牌庫重新抽取。',
    setupTitle: '遊戲設置',
    setupContent: '先把聖誕樹底版放在兩個人中間，然後找那九張純色底版（上面沒有圖樣的），隨機抽一張放在中間，然後按照這張圖上對應的內容把剩下八格排完。',
    advancedTitle: '進階規則變體',
    advancedIntro: '如果基本規則還意猶未盡，不妨嘗嘗進階規則吧！這些規則會為你添增刺激感與更多的思考空間喔！（可選擇加一個或複數個）',
    variants: [
      { title: '最後趕工', desc: '聖誕節就要到了！現在開始，你們商議好一個時間（建議為 30 - 60 秒，可以使用沙漏輔助） ，每個人每回合必須在限制時間內完成，否則視作沒能完成圖樣！' },
      { title: '精心規劃', desc: '果然還是要多知道一點比較好佈置！把板塊堆改為正面朝上，所以你們現在都看得到最上面的那張板塊是什麼。' }
    ],
    componentsTitle: '遊戲組件',
    components: {
      board: { name: '聖誕樹盤面 1 個 (3x3) + 三色基底板塊共 9 個（無圖樣）', desc: '配置三色基底板塊到聖誕樹盤面上形成初始盤面。' },
      tiles: { name: '掛飾板塊 (54張)', desc: '板塊中央帶有 2x2 圖樣，邊緣則是掛飾的飾品色。如左圖是咖啡色的飾品。' },
      tokens: { name: '精心裝飾指示物 (6個)', desc: '三色各兩枚。消耗對應色指示物可在用該裝飾色的掛飾板塊完成配對時額外多抽一張牌。' },
      star: { name: '星星板塊 (1張)', desc: '勝利的象徵。最後完成配對的人可將星星掛上樹頂（中間板塊）。' }
    },
    diffLabels: {
      beginner: '新手 👶',
      normal: '普通 🤖',
      hard: '困難 ⚔️',
      expert: '專家 🔥'
    },
    downloadPnp: '下載 PNP 檔案'
  },
  en: {
    designer: 'Designer',
    players: 'Players',
    time: 'Time',
    age: 'Age',
    designerName: 'Steven Chao',
    imagesName: 'Gemini Nano Banana',
    playerCount: '2 Players',
    suggestedAge: '8+',
    gameTime: '20-30 Mins',
    title: 'Stack Christmas',
    subtitle: 'Stacking Ornaments',
    tags: ['Tile Placement', 'Hand Management', 'Abstract Strategy'],
    goalsTitle: 'Objective',
    goalsContent: 'Take turns placing ornament tiles on a 3x3 tree board to complete patterns. Players are eliminated if they cannot make a match on their turn. The last player remaining wins the honor of placing the star on top of the tree!',
    winContent: 'After making a match, draw ONE tile. You may then choose to spend a matching "Exquisite Decoration" token to draw one additional tile. The game ends when a player ran out of cards and cannot make a move; the last person to complete a match wins!',
    prepTitle: 'Preparation',
    prepStepBoard: '1. Board Setup',
    prepStepBoardDesc: 'Place the tree board between players. Find the 9 solid base tiles (no patterns), randomly place one in the center, and arrange the other 8 according to the setup map.',
    prepStepHand: '2. Initial Hand Distribution',
    prepStepHandDesc: 'Each player receives three "Exquisite Decoration" tokens (Red, Green, and Brown) and 3 starting tiles. If EITHER player\'s starting hand consists of tiles all of the same color, reshuffle and redraw.',
    turnTitle: 'On Your Turn',
    turnContent: 'Select a tile from your hand and place it on the board (it cannot be placed on a cell where the background color matches the tile\'s ornament color). A match counts ONLY if the tile YOU place completes a 2x2 pattern with three other tiles. Only the final tile placed and its pattern determine the match. You must achieve at least one match per turn to stay in the game.',
    winTitle: 'Drawing & Victory',
    selectMode: 'Select Mode',
    pvpMode: 'PvP Mode',
    aiMode: 'Challenge AI',
    selectDifficulty: 'Difficulty',
    backToMode: '← Back',
    enterGame: 'Enter Game',
    startGame: 'Start 🎄',
    nextStep: 'Next',
    examplesTitle: 'Visual Examples',
    legalMatchLabel: 'Legal: Pattern Match ✅ The center red-framed tile is the one just placed. It was placed on a brown base, and combined with the tiles in the yellow frames to complete its own pattern (three reds and one green).',
    illegalColorLabel: 'Illegal: Color Clash ❌ The ornament color in the top right is red, so it cannot be placed on these red base tiles. However, if these cells are later covered by other colors, it can be placed there.',
    noMatchLabel: 'Legal: Placing a red tile onto a cell that was originally brown is a legal move, but no pattern was completed. If you still have other cards in hand, you can continue playing to try and achieve a match.',
    reshuffleLabel: 'Reshuffle Case: All 3 starting tiles are the same color (e.g., all brown). In this case, reshuffle them into the deck and redraw.',
    setupTitle: 'Game Setup',
    setupContent: 'Place the tree board between players. Find the 9 solid base tiles (no patterns), randomly place one in the center, and arrange the other 8 according to the setup map.',
    advancedTitle: 'Advanced Rule Variants',
    advancedIntro: 'If the basic rules aren\'t enough, try these advanced variants! They add excitement and more strategic depth. (Choose one or more)',
    variants: [
      { title: 'Last Minute Rush', desc: 'Christmas is coming! Agree on a time limit (suggested 30-60s) per turn. Fail to complete a match within the time limit, and you are eliminated!' },
      { title: 'Exquisite Planning', desc: 'Better planning makes for a better tree! Play with the tile deck face-up so the next available tile is always visible.' }
    ],
    componentsTitle: 'Game Components',
    components: {
      board: { name: '1 Tree Board (3x3) + 9 Base Tiles (no patterns)', desc: 'Arrange the Base Tiles on the Tree Board to create the starting layout.' },
      tiles: { name: 'Ornament Tiles (54)', desc: 'Tiles with a 2x2 pattern in the center and a matching ornament color border. For example, the one on the left has a brown ornament.' },
      tokens: { name: 'Exquisite Decoration Tokens (6)', desc: '2 per color. Spend a matching token to draw an extra tile when completing a match of that color.' },
      star: { name: 'Star Piece (1)', desc: 'Symbol of victory. The winner places the star on the tree top (center cell).' }
    },
    diffLabels: {
      beginner: 'Novice 👶',
      normal: 'Normal 🤖',
      hard: 'Hard ⚔️',
      expert: 'Expert 🔥'
    },
    downloadPnp: 'Download PNP'
  }
};

const t = computed(() => translations[lang.value]);

const gameInfo = computed(() => ({
  designer: t.value.designerName,
  images: t.value.imagesName,
  players: t.value.playerCount,
  time: t.value.gameTime,
  age: t.value.suggestedAge
}));

const rules = computed(() => [
  { title: t.value.goalsTitle, content: t.value.goalsContent }
]);

const state = ref('info'); // info, select-mode, select-difficulty
const selectedMode = ref('pvp');
const selectedDifficulty = ref('normal');

const handleStartClick = () => {
  if (state.value === 'info') {
    state.value = 'select-mode';
  } else if (state.value === 'select-difficulty') {
    emit('start', { mode: 'ai', difficulty: selectedDifficulty.value });
  } else if (selectedMode.value === 'pvp') {
    emit('start', { mode: 'pvp' });
  } else {
    state.value = 'select-difficulty';
  }
};
</script>

<template>
  <div class="intro-container">
    <!-- Language Switcher -->
    <div class="lang-switcher">
      <button 
        :class="{ active: lang === 'zh' }" 
        @click="lang = 'zh'"
      >繁體中文</button>
      <span class="sep">|</span>
      <button 
        :class="{ active: lang === 'en' }" 
        @click="lang = 'en'"
      >EN</button>
    </div>

    <div class="intro-card">
      <div class="header-image">
        <img src="../assets/header.png" alt="Stack Christmas Header" />
        <div class="title-overlay">
          <h1>{{ t.title }}</h1>
          <p class="subtitle">{{ t.subtitle }}</p>
          <div class="badge-row">
            <span v-for="tag in t.tags" :key="tag" class="badge">{{ tag }}</span>
          </div>
        </div>
      </div>

      <div class="content-scroll">
        <template v-if="state === 'info'">
          <div class="pages-container">
            <!-- Page 1: Overview & Setup -->
            <div class="rule-page page-1">
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">{{ t.designer }}</span>
                  <span class="value">{{ gameInfo.designer }}</span>
                </div>
                <div class="info-item">
                  <span class="label">{{ t.players }}</span>
                  <span class="value">{{ gameInfo.players }}</span>
                </div>
                <div class="info-item">
                  <span class="label">{{ t.age }}</span>
                  <span class="value">{{ gameInfo.age }}</span>
                </div>
                <div class="info-item">
                  <span class="label">{{ t.time }}</span>
                  <span class="value">{{ gameInfo.time }}</span>
                </div>
              </div>

              <div class="rule-section intro-section">
                <h2 class="section-header">✨ {{ t.goalsTitle }}</h2>
                <div class="section-card goal-card">
                  <p>{{ t.goalsContent }}</p>
                </div>
              </div>

              <div class="rule-section components-section">
                <h2 class="section-header">📦 {{ t.componentsTitle }}</h2>
                <div class="components-grid">
                  <div class="component-card">
                    <img src="../assets/components/board_preview.png" alt="Board" />
                    <div class="comp-info">
                      <h4>{{ t.components.board.name }}</h4>
                      <p>{{ t.components.board.desc }}</p>
                    </div>
                  </div>
                  <div class="component-card">
                    <img src="../assets/components/tile_preview.png" alt="Tiles" />
                    <div class="comp-info">
                      <h4>{{ t.components.tiles.name }}</h4>
                      <p>{{ t.components.tiles.desc }}</p>
                    </div>
                  </div>
                  <div class="component-card">
                    <img src="../assets/components/token_preview.png" alt="Tokens" />
                    <div class="comp-info">
                      <h4>{{ t.components.tokens.name }}</h4>
                      <p>{{ t.components.tokens.desc }}</p>
                    </div>
                  </div>
                  <div class="component-card">
                    <img src="../assets/components/star_preview.png" alt="Star" />
                    <div class="comp-info">
                      <h4>{{ t.components.star.name }}</h4>
                      <p>{{ t.components.star.desc }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="rule-section setup-section">
                <h2 class="section-header">🛠️ {{ t.prepTitle }}</h2>
                <div class="prep-flow">
                  <div class="prep-step">
                    <h4 class="step-title">📍 {{ t.prepStepBoard }}</h4>
                    <div class="section-card setup-card">
                      <img src="../assets/setup.png" alt="Setup" />
                      <p>{{ t.prepStepBoardDesc }}</p>
                    </div>
                  </div>
                  <div class="prep-step">
                    <h4 class="step-title">🃏 {{ t.prepStepHand }}</h4>
                    <div class="section-card prep-card">
                      <p class="step-text">{{ t.prepStepHandDesc }}</p>
                      <div class="reshuffle-box">
                        <img src="../assets/reshuffle-case.png" :alt="t.reshuffleLabel" />
                        <p class="caption">⚠️ {{ t.reshuffleLabel }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Page 2: Gameplay & Reference -->
            <div class="rule-page page-2">
              <div class="rule-section play-section">
                <h2 class="section-header">🎯 {{ t.turnTitle }}</h2>
                <div class="section-card main-rule-card">
                  <p class="rule-text">{{ t.turnContent }}</p>
                  
                  <div class="inline-examples">
                    <div class="example-item">
                      <img src="../assets/rules/legal_match.png" :alt="t.legalMatchLabel" />
                      <p>{{ t.legalMatchLabel }}</p>
                    </div>
                    <div class="example-item">
                      <img src="../assets/rules/illegal_color.png" :alt="t.illegalColorLabel" />
                      <p>{{ t.illegalColorLabel }}</p>
                    </div>
                    <div class="example-item">
                      <img src="../assets/rules/illegal_no_match.png" :alt="t.noMatchLabel" />
                      <p>{{ t.noMatchLabel }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="rule-section win-section">
                <h2 class="section-header">🏆 {{ t.winTitle }}</h2>
                <div class="section-card win-card">
                  <p>{{ t.winContent }}</p>
                </div>
              </div>

              <div class="rule-section advanced-section">
                <h2 class="section-header">🔥 {{ t.advancedTitle }}</h2>
                <div class="section-card advanced-card">
                  <p class="section-intro">{{ t.advancedIntro }}</p>
                  <div class="variants-grid">
                    <div v-for="(v, idx) in t.variants" :key="idx" class="variant-item">
                      <h4>{{ v.title }}</h4>
                      <p>{{ v.desc }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="state === 'select-mode'">
          <div class="selection-view">
            <h3>{{ t.selectMode }}</h3>
            <div class="mode-options">
              <div 
                class="option-card" 
                :class="{ active: selectedMode === 'pvp' }"
                @click="selectedMode = 'pvp'"
              >
                <span class="icon">👥</span>
                <span class="label">{{ t.pvpMode }}</span>
              </div>
              <div 
                class="option-card" 
                :class="{ active: selectedMode === 'ai' }"
                @click="selectedMode = 'ai'"
              >
                <span class="icon">🤖</span>
                <span class="label">{{ t.aiMode }}</span>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="state === 'select-difficulty'">
          <div class="selection-view">
            <div class="header-with-back">
              <button class="back-link" @click="state = 'select-mode'">{{ t.backToMode }}</button>
              <h3>{{ t.selectDifficulty }}</h3>
            </div>
            <div class="difficulty-grid">
              <div 
                v-for="(label, key) in t.diffLabels" 
                :key="key"
                class="diff-card"
                :class="{ active: selectedDifficulty === key }"
                @click="selectedDifficulty = key"
              >
                {{ label }}
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="footer-actions">
        <a href="../assets/christmas_tree_pnp.pdf" download="Stack_Christmas_PNP.pdf" class="pnp-btn">
          <span class="icon">📄</span> {{ t.downloadPnp }}
        </a>
        <button class="start-btn" @click="handleStartClick">
          {{ state === 'info' ? t.enterGame : (state === 'select-difficulty' || selectedMode === 'pvp' ? t.startGame : t.nextStep) }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- Design Tokens & Base --- */
.intro-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #1a472a 0%, #0d2516 100%);
  font-family: 'Inter', sans-serif;
}

.intro-card {
  background: white;
  width: 95%;
  max-width: 500px;
  max-height: 95vh;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  transition: max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 1100px) {
  .intro-card {
    max-width: 1260px;
  }
}

/* Header & Meta */
.header-image {
  position: relative;
  height: 200px;
  flex-shrink: 0;
}

.header-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.8));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  color: white;
  text-align: center;
}

.title-overlay h1 {
  margin: 0;
  font-size: 2.2rem;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.subtitle {
  margin: 5px 0 10px;
  opacity: 0.9;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.badge-row {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.badge {
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255,255,255,0.3);
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 25px;
  background: #f0f4f0;
}

/* Page Structure */
.pages-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.rule-page {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 35px;
}

@media (min-width: 1100px) {
  .pages-container {
    flex-direction: row;
    gap: 25px;
    align-items: flex-start;
  }

  .rule-page {
    flex: 1;
    min-width: 0;
    min-height: 820px;
  }
}

/* Unified Section Components */
.rule-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.section-header {
  font-size: 1.2rem;
  color: #1a472a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 4px solid #1a472a;
  padding-left: 12px;
  text-align: left;
}

.section-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.2s;
}

.section-card p {
  margin: 0;
  line-height: 1.7;
  color: #333;
}

/* Specific Variations */
.goal-card {
  background: #fffafa;
  border-color: #ffeded;
}

.main-rule-card {
  background: #f8fbf8;
  border-color: #e8f0e8;
}

.setup-card, .prep-card, .win-card, .advanced-card {
  background: #fafafa;
}

/* Key Metrics Grid */
.info-grid {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 15px 25px;
  background: #f8fbf8;
  border: 1px solid #e8f0e8;
  border-radius: 12px;
  margin-bottom: 5px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.info-item .label {
  font-size: 0.65rem;
  color: #777;
  text-transform: uppercase;
}

.info-item .value {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a472a;
}

/* Components Inventory */
.components-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

@media (min-width: 480px) {
  .components-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.component-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
}

.component-card img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.comp-info h4 {
  margin: 0 0 2px;
  font-size: 0.9rem;
  color: #1a472a;
}

.comp-info p {
  margin: 0;
  font-size: 0.75rem;
  color: #666;
  line-height: 1.4;
}

/* Step-by-Step Prep */
.prep-flow {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.step-title {
  font-size: 1rem;
  color: #2c3e50;
  margin: 0 0 10px;
  font-weight: 700;
}

.setup-card img {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
}

.reshuffle-box {
  margin-top: 15px;
  background: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 12px;
  padding: 15px;
}

.reshuffle-box img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
}

.reshuffle-box .caption {
  font-size: 0.85rem;
  color: #795548;
  font-weight: 500;
  margin: 0;
}

/* Interactive Rules */
.rule-text {
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 25px !important;
  font-weight: 500;
}

.inline-examples {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.example-item {
  background: white;
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}

.example-item img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
}

.example-item p {
  font-size: 0.85rem;
  color: #555 !important;
  line-height: 1.5;
}

/* Variant Styling */
.variants-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
}

.variant-item {
  border-left: 3px solid #c0392b;
  padding-left: 15px;
}

.variant-item h4 {
  margin: 0 0 5px;
  color: #c0392b;
  font-size: 1rem;
}

.variant-item p {
  font-size: 0.85rem;
  color: #666;
}

.section-intro {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
  margin-bottom: 5px;
}

/* Footer & Actions */
.footer-actions {
  padding: 20px;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  gap: 15px;
}

.start-btn {
  flex: 2;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.start-btn:hover {
  transform: translateY(-2px);
  background: #c0392b;
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.pnp-btn {
  flex: 1;
  background: white;
  color: #1a472a;
  border: 2px solid #1a472a;
  padding: 16px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s;
}

.pnp-btn:hover { background: #f0f7f2; }

/* Selection View Styles */
.selection-view {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
}

.selection-view h3 { color: #1a472a; margin: 0; }

.mode-options, .difficulty-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

@media (min-width: 480px) {
  .mode-options, .difficulty-options { grid-template-columns: repeat(2, 1fr); }
}

.option-card {
  background: #f9f9f9;
  border: 2px solid #eee;
  padding: 25px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
}

.option-card:hover { border-color: #1a472a; }
.option-card.active { border-color: #e74c3c; background: #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }

.option-card .icon { font-size: 2.2rem; }
.option-card .label { font-weight: 700; }

.diff-card {
  background: #f9f9f9;
  border: 2px solid #eee;
  padding: 18px;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.diff-card:hover { border-color: #1a472a; }
.diff-card.active { background: white; border-color: #e74c3c; color: #e74c3c; }

.header-with-back {
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
}

.back-link {
  position: absolute;
  left: 0;
  background: none;
  border: none;
  color: #666;
  font-size: 0.85rem;
  cursor: pointer;
}

.back-link:hover { color: #e74c3c; text-decoration: underline; }

/* Utils */
.lang-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10001;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
  padding: 4px 12px;
  border-radius: 20px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255,255,255,0.2);
}

.lang-switcher button { background: none; border: none; color: white; opacity: 0.6; cursor: pointer; }
.lang-switcher button.active { opacity: 1; font-weight: 700; }

.content-scroll::-webkit-scrollbar { width: 6px; }
.content-scroll::-webkit-scrollbar-track { background: transparent; }
.content-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
</style>
