<script setup>
import { ref, onMounted } from 'vue';
import IntroView from './components/IntroView.vue';
import GameView from './components/GameView.vue';

const currentGame = ref(null); // { mode, difficulty }
const currentLang = ref('zh');

const checkUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  const difficulty = params.get('difficulty');
  
  if (mode === 'ai' || mode === 'pvp') {
    currentGame.value = { 
      mode, 
      difficulty: difficulty || 'normal',
      randomBoard: params.get('randomBoard') === 'true',
      paidMulligan: params.get('paidMulligan') === 'true'
    };
  } else {
    currentGame.value = null;
  }
};

const handleStart = (settings) => {
  const params = new URLSearchParams();
  params.set('mode', settings.mode);
  if (settings.difficulty) {
    params.set('difficulty', settings.difficulty);
  }
  if (settings.randomBoard) {
    params.set('randomBoard', 'true');
  }
  if (settings.paidMulligan) {
    params.set('paidMulligan', 'true');
  }
  if (settings.lang) {
    currentLang.value = settings.lang;
  }
  
  // 更新 URL 但不刷頁面
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, '', newUrl);
  
  currentGame.value = settings;
};

const handleBack = () => {
  window.history.pushState({}, '', window.location.pathname);
  currentGame.value = null;
};

onMounted(() => {
  checkUrlParams();
  // 監聽返回鍵
  window.addEventListener('popstate', checkUrlParams);
});
</script>

<template>
  <div class="game-container">
    <div class="lang-switcher">
      <button 
        :class="{ active: currentLang === 'zh' }" 
        @click="currentLang = 'zh'"
      >繁體中文</button>
      <span class="sep">|</span>
      <button 
        :class="{ active: currentLang === 'en' }" 
        @click="currentLang = 'en'"
      >EN</button>
    </div>

    <GameView 
      v-if="currentGame" 
      :mode="currentGame.mode" 
      :difficulty="currentGame.difficulty"
      :random-board="currentGame.randomBoard"
      :paid-mulligan="currentGame.paidMulligan"
      :lang="currentLang"
      @back="handleBack"
    />
    <IntroView v-else :lang="currentLang" @start="handleStart" />
  </div>
</template>

<style>
:root {
  --bg-color: #f5f6fa;
  --r-color: #e74c3c;
  --g-color: #2ecc71;
  --b-color: #795548;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: var(--bg-color);
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.game-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Lang Switcher */
.lang-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10001;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 6px 16px;
  border-radius: 24px;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.lang-switcher button {
  background: none;
  border: none;
  color: white;
  opacity: 0.6;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 2px 4px;
}

.lang-switcher button.active {
  opacity: 1;
  font-weight: 800;
  text-shadow: 0 0 10px rgba(255,255,255,0.5);
}

.lang-switcher .sep {
  opacity: 0.3;
  font-size: 0.8rem;
}

/* Big Screen Optimization */
@media (min-width: 1200px) {
  .lang-switcher {
    top: 30px;
    right: 40px;
    background: rgba(0, 0, 0, 0.1);
    color: #1a472a;
    border-color: rgba(26, 71, 42, 0.2);
  }
  .lang-switcher button {
    color: white;
  }
  .lang-switcher button.active {
    color: #e74c3c;
    text-shadow: none;
  }
}

/* On mobile, keep it floating but maybe relative to card if needed, 
   but absolute top-right is usually safest for "always visible" */
@media (max-width: 600px) {
  .lang-switcher {
    top: 15px;
    right: 15px;
    padding: 4px 12px;
    font-size: 0.8rem;
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>
