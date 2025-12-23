<script setup>
import { computed } from 'vue';
import TileCard from './TileCard.vue';
import { GameLogic } from '../logic/gameLogic';

// Import decoration images explicitly for Vite
import decoR1 from '../assets/deco_r1.png';
import decoR2 from '../assets/deco_r2.png';
import decoG1 from '../assets/deco_g1.png';
import decoG2 from '../assets/deco_g2.png';
import decoB1 from '../assets/deco_b1.png';
import decoB2 from '../assets/deco_b2.png';

// Import elf images for AI avatar
import noviceImg from '../assets/elves/novice.png';
import normalImg from '../assets/elves/normal.png';
import hardImg from '../assets/elves/hard.png';
import expertImg from '../assets/elves/expert.png';

const decoImages = {
  'r1': decoR1,
  'r2': decoR2,
  'g1': decoG1,
  'g2': decoG2,
  'b1': decoB1,
  'b2': decoB2
};

const getDecoImage = (color, playerId) => {
  const key = `${color.toLowerCase()}${playerId}`;
  return decoImages[key];
};

const elfImages = {
  beginner: noviceImg,
  normal: normalImg,
  hard: hardImg,
  expert: expertImg
};

const props = defineProps([
  'player', 
  'isCurrent', 
  'isRotated', 
  'selectedIndex', 
  'rotation',
  'mulliganEnabled',
  'decoEnabled',
  'selectedDeco',
  'canUndo',
  'paidMulliganEnabled',
  'difficulty'
]);

const emit = defineEmits([
  'selectTile', 
  'rotateTile', 
  'mulligan', 
  'selectDeco', 
  'undo',
  'requestPaidMulligan',
  'surrender'
]);

const availableTokensCount = computed(() => {
  return Object.values(props.player.decorationUses).filter(u => u).length;
});
</script>

<template>
  <div class="player-area" :class="{ 'is-rotated': isRotated, 'is-current': isCurrent }">
    <div class="header">
      <div class="player-info">
        <!-- AI Avatar -->
        <div v-if="player.isAi" class="ai-avatar-box" :class="[difficulty, { 'rotated': isRotated }]">
          <img :src="elfImages[difficulty] || normalImg" alt="Elf Avatar" />
        </div>

        <div class="player-ident">
          <span class="name">{{ player.name }}</span>
          <div class="lucky-indicator" :class="'color-' + player.luckyColor?.toLowerCase()">
            {{ player.luckyColor }}
          </div>
        </div>
      </div>

      <!-- 精心裝飾小圓框 -->
      <div v-if="decoEnabled" class="deco-container">
        <div 
          v-for="color in ['R', 'G', 'B']" 
          :key="color"
          class="deco-box"
          :class="{ 
            'is-selected': selectedDeco === color,
            'is-used': !player.decorationUses[color]
          }"
          @click="player.decorationUses[color] && $emit('selectDeco', selectedDeco === color ? null : color)"
        >
          <img :src="getDecoImage(color, player.id)" :alt="color" />
        </div>

        <!-- Paid Mulligan Button (Only for current human player) -->
        <button 
          v-if="paidMulliganEnabled && isCurrent && !player.isAi"
          class="paid-mulligan-icon-btn"
          :disabled="availableTokensCount < 2"
          @click="$emit('requestPaidMulligan')"
          title="消耗兩個指示物重抽"
        >
          ♻️
        </button>
      </div>

      <span v-if="player.eliminated" class="eliminated">已淘汰</span>
    </div>
    
    <div class="hand">
      <div 
        v-for="(tile, index) in player.hand" 
        :key="index"
        class="tile-container"
        :class="{ 'selected': selectedIndex === index }"
        @click="$emit('selectTile', index)"
      >
        <TileCard 
          :tile="tile" 
          :rotation="tile.rotation" 
        />
      </div>
    </div>

    <div v-if="isCurrent" class="controls">
      <div class="main-controls">
        <button @click.stop="$emit('rotateTile')" class="rotate-btn">旋轉圖樣 ↻</button>
        <button v-if="!player.isAi" @click.stop="$emit('surrender')" class="surrender-btn" title="將放置星星的權利讓給對方">投降 🏳️</button>
      </div>
      <button 
        v-if="canUndo" 
        @click.stop="$emit('undo')" 
        class="undo-btn"
      >
        復原上一步 ↩️
      </button>
      <button 
        v-if="mulliganEnabled && player.hasMulligan" 
        @click.stop="$emit('mulligan')" 
        class="mulligan-btn"
      >
        手牌重整 (限一次)
      </button>
      <p class="hint">點擊板面處放置</p>
    </div>
  </div>
</template>

<style scoped>
.player-area {
  padding: 15px;
  background: rgba(255,255,255,0.7);
  border-radius: 15px;
  transition: all 0.3s;
}

.is-rotated {
  transform: rotate(180deg);
}

.is-current {
  background: white;
  box-shadow: 0 0 20px rgba(46, 204, 113, 0.2);
  border: 2px solid var(--g-color);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.player-ident {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lucky-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.color-r { background: var(--r-color); }
.color-g { background: var(--g-color); }
.color-b { background: var(--b-color); }

.name { font-weight: bold; }
.eliminated { color: var(--r-color); font-weight: bold; }

.ai-avatar-box {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  padding: 3px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #bdc3c7;
  z-index: 5;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
}

.ai-avatar-box.beginner { border-color: #2ecc71; box-shadow: 0 0 10px rgba(46, 204, 113, 0.3); }
.ai-avatar-box.normal { border-color: #3498db; box-shadow: 0 0 10px rgba(52, 152, 219, 0.3); }
.ai-avatar-box.hard { border-color: #e67e22; box-shadow: 0 0 10px rgba(230, 126, 34, 0.3); }
.ai-avatar-box.expert { border-color: #e74c3c; box-shadow: 0 0 15px rgba(231, 76, 60, 0.5); }

.ai-avatar-box:hover {
  transform: scale(1.15) translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
}

.ai-avatar-box.rotated {
  transform: rotate(180deg);
}

.ai-avatar-box.rotated:hover {
  transform: rotate(180deg) scale(1.15) translateY(5px);
}

.ai-avatar-box img {
  width: 90%;
  height: 90%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.hand {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.tile-container {
  padding: 4px;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
}

.tile-container.selected {
  border-color: var(--g-color);
  background: rgba(46, 204, 113, 0.1);
}

.controls {
  margin-top: 10px;
  text-align: center;
}

.rotate-btn, .undo-btn, .mulligan-btn {
  border-radius: 50px;
  padding: 8px 16px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  color: white;
  margin: 0 5px;
  font-size: 0.85rem;
}

.main-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
}

.rotate-btn {
  background: #3498db;
}

.undo-btn {
  background: #9b59b6;
}

.mulligan-btn {
  background: #f39c12;
}

.rotate-btn:hover, .undo-btn:hover, .mulligan-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  filter: brightness(1.1);
}

.rotate-btn:active, .undo-btn:active, .mulligan-btn:active, .surrender-btn:active {
  transform: translateY(0) scale(0.95);
}

.surrender-btn {
  background: #7f8c8d;
}

.surrender-btn:hover {
  background: #95a5a6;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.hint {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin: 5px 0 0 0;
}

.deco-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.deco-box {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  padding: 2px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.deco-box.is-selected {
  border-color: #f1c40f;
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(241, 196, 15, 0.5);
}

.deco-box.is-used {
  filter: grayscale(100%);
  opacity: 0.5;
  cursor: not-allowed;
}

.deco-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.paid-mulligan-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #e67e22;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  margin-left: 5px;
}

.paid-mulligan-icon-btn:hover:not(:disabled) {
  background: #fff5e6;
  transform: scale(1.1);
}

.paid-mulligan-icon-btn:disabled {
  filter: grayscale(1);
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #ccc;
}
</style>
