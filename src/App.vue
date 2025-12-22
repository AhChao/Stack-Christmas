<script setup>
import { ref, onMounted } from 'vue';
import IntroView from './components/IntroView.vue';
import GameView from './components/GameView.vue';

const currentGame = ref(null); // { mode, difficulty }

const checkUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  const difficulty = params.get('difficulty');
  
  if (mode === 'ai' || mode === 'pvp') {
    currentGame.value = { mode, difficulty: difficulty || 'normal' };
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
    <GameView 
      v-if="currentGame" 
      :mode="currentGame.mode" 
      :difficulty="currentGame.difficulty"
      @back="handleBack"
    />
    <IntroView v-else @start="handleStart" />
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
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.game-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
