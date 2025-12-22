<script setup>
const props = defineProps({
  turnCount: Number,
  lastMove: Object
});

const emit = defineEmits(['highlightMove']);
</script>

<template>
  <div class="game-hud">
    <!-- Turn Indicator -->
    <div class="hud-box turn-box">
      <div class="label">TURN</div>
      <div class="value">{{ turnCount }}</div>
    </div>

    <!-- Last Move Indicator -->
    <div 
      v-if="lastMove" 
      class="hud-box last-move-box"
      @mouseenter="$emit('highlightMove', lastMove)"
      @mouseleave="$emit('highlightMove', null)"
      @click="$emit('highlightMove', lastMove, true)"
    >
      <div class="label">LAST MOVE</div>
      <div class="move-info">
        <div class="player">{{ lastMove.playerName }}</div>
        <div class="detail">
          <span class="color-dot" :class="lastMove.tile.ornamentColor.toLowerCase()"></span>
          {{ String.fromCharCode(65 + lastMove.col) }}{{ lastMove.row + 1 }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-hud {
  position: absolute;
  left: -110px; /* Position to the left of the board on desktop */
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 100;
  pointer-events: none;
}

.hud-box {
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 2px solid #2c3e50;
  text-align: center;
  min-width: 80px;
  pointer-events: auto;
  transition: all 0.2s ease;
}

.turn-box {
  width: 80px;
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.last-move-box {
  cursor: pointer;
  text-align: left;
  min-width: 100px;
}

.last-move-box:hover {
  transform: translateX(5px);
  background: #f8f9fa;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #95a5a6;
  letter-spacing: 1.5px;
  margin-bottom: 4px;
}

.value {
  font-size: 2.2rem;
  font-weight: 900;
  color: #2c3e50;
  line-height: 1;
}

.move-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.player {
  font-weight: 700;
  color: #2c3e50;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.detail {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e67e22;
  display: flex;
  align-items: center;
  gap: 5px;
}

.color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.color-dot.r { background: var(--r-color, #e74c3c); }
.color-dot.g { background: var(--g-color, #2ecc71); }
.color-dot.b { background: var(--b-color, #795548); }

@media (max-width: 1024px) {
  .game-hud {
    left: -20px; /* Tighter on tablet */
    transform: translateY(-50%) scale(0.9);
  }
}

@media (max-width: 768px) {
  .game-hud {
    top: 50%;
    left: -40px; /* Pin further left for rotation */
    transform: translateY(-50%) rotate(-90deg) scale(0.7);
    flex-direction: row;
    transform-origin: center left;
  }
  
  .hud-box {
    padding: 8px;
    min-width: 60px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
  
  .turn-box { width: 60px; }

  .last-move-box:hover {
    transform: translateY(-5px); /* Adjusted for rotation */
  }
}
</style>

