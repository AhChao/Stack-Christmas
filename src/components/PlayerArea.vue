<script setup>
import TileCard from './TileCard.vue';
import { GameLogic } from '../logic/gameLogic';

const props = defineProps([
  'player', 
  'isCurrent', 
  'isRotated', 
  'selectedIndex', 
  'rotation',
  'mulliganEnabled',
  'decoEnabled',
  'selectedDeco',
  'canUndo'
]);

defineEmits(['selectTile', 'rotateTile', 'mulligan', 'selectDeco', 'undo']);
</script>

<template>
  <div class="player-area" :class="{ 'is-rotated': isRotated, 'is-current': isCurrent }">
    <div class="header">
      <div class="player-info">
        <span class="name">{{ player.name }}</span>
        <div class="lucky-indicator" :class="'color-' + player.luckyColor?.toLowerCase()">
          {{ player.luckyColor }}
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
          <img :src="`./src/assets/deco_${color.toLowerCase()}${player.id}.png`" :alt="color" />
        </div>
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
          :rotation="selectedIndex === index ? rotation : 0" 
        />
      </div>
    </div>

    <div v-if="isCurrent" class="controls">
      <button @click.stop="$emit('rotateTile')" class="rotate-btn">旋轉圖樣 ↻</button>
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
  gap: 8px;
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

.rotate-btn {
  background: #3498db;
  font-size: 0.9rem;
  margin-right: 5px;
}

.undo-btn {
  background: #9b59b6;
  font-size: 0.9rem;
  margin-right: 5px;
}

.mulligan-btn {
  background: #f39c12;
  font-size: 0.9rem;
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
</style>
