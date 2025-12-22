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
    prepTitle: '遊戲準備',
    prepContent: '隨機配置聖誕樹盤面，每人拿取紅、綠、棕三色「精心裝飾指示物」各一枚。每人抽取 3 張初始板塊並公開。若其中一人起手皆為同色重新發牌。',
    turnTitle: '輪到你時',
    turnContent: '從手牌選一張板塊放到盤面上（不能放在底色與裝飾顏色相同的格子上）。放下去的板塊必須和另外三個板塊組成自己的圖樣才算配對成功，只看最後放下去的板塊及它上面的圖樣。每回合必須完成至少一個配對，否則遊戲結束。',
    winTitle: '補牌與勝利',
    winContent: '完成配對後，抽取一張。此時可選擇消耗對應顏色的「精心裝飾指示物」額外多補一張板塊。當有人手牌耗盡且無法配對時遊戲結束，最後完成配對者獲勝！',
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
    prepContent: 'Set up the 3x3 board randomly. Each player receives three "Exquisite Decoration" tokens (Red, Green, and Brown) and 3 starting tiles. If EITHER player\'s starting hand consists of tiles all of the same color, reshuffle and redraw.',
    turnTitle: 'On Your Turn',
    turnContent: 'Select a tile from your hand and place it on the board (it cannot be placed on a cell where the background color matches the tile\'s ornament color). A match counts ONLY if the tile YOU place completes a 2x2 pattern with three other tiles. Only the final tile placed and its pattern determine the match. You must achieve at least one match per turn to stay in the game.',
    winTitle: 'Drawing & Victory',
    winContent: 'After making a match, draw ONE tile. You may then choose to spend a matching "Exquisite Decoration" token to draw one additional tile. The game ends when a player ran out of cards and cannot make a move; the last person to complete a match wins!',
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
  { title: t.value.goalsTitle, content: t.value.goalsContent },
  { title: t.value.prepTitle, content: t.value.prepContent },
  { title: t.value.turnTitle, content: t.value.turnContent },
  { title: t.value.winTitle, content: t.value.winContent }
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
          
          <div class="components-section">
            <h2 class="section-title">{{ t.componentsTitle }}</h2>
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

          <div class="setup-section">
            <h2 class="section-title">{{ t.setupTitle }}</h2>
            <div class="setup-card">
              <img src="../assets/setup.png" alt="Setup" />
              <p>{{ t.setupContent }}</p>
            </div>
          </div>

          <div class="rules-section">
            <div v-for="(rule, index) in rules" :key="index" class="rule-block">
              <h3>{{ rule.title }}</h3>
              <p>{{ rule.content }}</p>
            </div>
          </div>

          <!-- Visual Examples -->
          <div class="examples-section">
            <h2 class="section-title">{{ t.examplesTitle }}</h2>
            <div class="examples-grid">
              <div class="example-item">
                <img src="../assets/rules/legal_match.png" :alt="t.legalMatchLabel" />
                <span>{{ t.legalMatchLabel }}</span>
              </div>
              <div class="example-item">
                <img src="../assets/rules/illegal_color.png" :alt="t.illegalColorLabel" />
                <span>{{ t.illegalColorLabel }}</span>
              </div>
              <div class="example-item">
                <img src="../assets/rules/illegal_no_match.png" :alt="t.noMatchLabel" />
                <span>{{ t.noMatchLabel }}</span>
              </div>
              <div class="example-item">
                <img src="../assets/reshuffle-case.png" :alt="t.reshuffleLabel" />
                <span>{{ t.reshuffleLabel }}</span>
              </div>
            </div>
          </div>

          <div class="advanced-section">
            <h2 class="section-title">{{ t.advancedTitle }}</h2>
            <p class="section-intro">{{ t.advancedIntro }}</p>
            <div class="variants-grid">
              <div v-for="(v, idx) in t.variants" :key="idx" class="variant-card">
                <h4>{{ v.title }}</h4>
                <p>{{ v.desc }}</p>
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
.intro-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a472a 0%, #0d2b18 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 10000;
  font-family: 'Inter', sans-serif;
}

.lang-switcher {
  position: absolute;
  top: 30px;
  right: 30px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 0.85rem;
  z-index: 10001;
  border: 1px solid rgba(255,255,255,0.2);
}

.lang-switcher button {
  background: none;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  font-weight: 700;
  transition: color 0.2s;
  padding: 0;
}

.lang-switcher button.active {
  color: white;
}

.lang-switcher button:hover {
  color: white;
}

.lang-switcher .sep {
  opacity: 0.3;
}

.intro-card {
  background: white;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

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
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 20px;
  color: white;
  text-align: center;
}

.title-overlay h1 {
  margin: 0;
  font-size: 2.5rem;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  margin: 5px 0 10px;
  font-size: 1rem;
  opacity: 0.9;
  letter-spacing: 1px;
}

.badge-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.badge {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  backdrop-filter: blur(4px);
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #fdfdfd;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 25px;
  background: #f5f6f7;
  padding: 15px;
  border-radius: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.info-item .label {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 4px;
}

.info-item .value {
  font-weight: 700;
  color: #1a472a;
  font-size: 0.9rem;
}

.components-section {
  margin-top: 30px;
  padding-bottom: 25px;
  border-bottom: 2px dashed #eee;
}

.components-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.component-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.component-card img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 10px;
  background: white;
  padding: 6px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.comp-info h4 {
  margin: 0 0 4px 0;
  font-size: 0.95rem;
  color: #1a472a;
}

.comp-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
  line-height: 1.5;
}

.setup-section {
  margin-top: 30px;
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 2px dashed #eee;
}

.setup-card {
  background: white;
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
}

.setup-card img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
}

.setup-card p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #444;
}

.rules-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.rule-block h3 {
  margin: 0 0 8px;
  color: #e74c3c;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rule-block h3::before {
  content: '✦';
  font-size: 0.8rem;
}

.rule-block p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #444;
}

.advanced-section {
  margin-top: 40px;
  margin-bottom: 30px;
  padding-top: 30px;
  border-top: 2px dashed #eee;
}

.section-intro {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.variants-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.variant-card {
  background: #fff5f5;
  border-left: 4px solid #e74c3c;
  padding: 15px;
  border-radius: 0 12px 12px 0;
}

.variant-card h4 {
  margin: 0 0 8px;
  color: #c0392b;
  font-size: 1rem;
}

.variant-card p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #555;
}

.examples-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px dashed #eee;
}

.section-title {
  font-size: 1.2rem;
  color: #1a472a;
  margin-bottom: 20px;
  text-align: center;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
}

.example-item {
  background: white;
  border-radius: 16px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
}

.example-item img {
  width: 100%;
  max-width: 240px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.example-item span {
  font-size: 0.9rem;
  font-weight: 700;
  color: #333;
}

@media (min-width: 400px) {
  .examples-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

.footer-actions {
  padding: 20px;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  gap: 16px;
  align-items: center;
}

.start-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 16px 40px;
  font-size: 1.25rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  box-shadow: 0 8px 20px rgba(231, 76, 60, 0.3);
}

.start-btn:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.start-btn:active {
  transform: translateY(0);
}

.pnp-btn {
  background: white;
  color: #1a472a;
  border: 2px solid #1a472a;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.pnp-btn:hover {
  background: #f5f6f7;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}

.pnp-btn:active {
  transform: translateY(0);
}

/* Selection Views */
.selection-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
}

.selection-view h3 {
  margin: 0;
  color: #1a472a;
  font-size: 1.25rem;
}

.mode-options {
  display: flex;
  gap: 15px;
}

.option-card {
  flex: 1;
  background: #f5f6f7;
  padding: 30px 20px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
  border: 3px solid transparent;
}

.option-card .icon {
  font-size: 2.5rem;
}

.option-card .label {
  font-weight: 700;
  color: #333;
}

.option-card:hover {
  transform: translateY(-4px);
  background: #fff;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.option-card.active {
  background: white;
  border-color: #e74c3c;
  box-shadow: 0 10px 20px rgba(231, 76, 60, 0.1);
}

.difficulty-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.diff-card {
  background: #f5f6f7;
  padding: 20px 10px;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.diff-card:hover {
  background: #fff;
  transform: scale(1.02);
}

.diff-card.active {
  background: white;
  border-color: #e74c3c;
  color: #e74c3c;
}

.header-with-back {
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  margin-bottom: 5px;
}

.back-link {
  position: absolute;
  left: 0;
  background: none;
  border: none;
  color: #666;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
}

.back-link:hover {
  color: #e74c3c;
  text-decoration: underline;
}

/* Custom Scrollbar */
.content-scroll::-webkit-scrollbar {
  width: 6px;
}

.content-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.content-scroll::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}
</style>
