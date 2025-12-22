<script setup>
import { computed } from 'vue';
import { GameLogic } from '../logic/gameLogic';

const props = defineProps(['tile', 'rotation']);

const rotatedPattern = computed(() => {
  return GameLogic.rotatePatternTimes(props.tile.pattern, props.rotation);
});

const getColorClass = (color) => {
  return `color-${color?.toLowerCase()}`;
};
</script>

<template>
  <div class="tile-card" :class="getColorClass(tile.ornamentColor)">
    <div 
      class="pattern-grid" 
      :style="{ transform: `rotate(${rotation * 90}deg)` }"
    >
      <template v-for="(row, r) in tile.pattern" :key="r">
        <div 
          v-for="(color, c) in row" 
          :key="c" 
          class="p-cell"
          :class="getColorClass(color)"
        ></div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.tile-card {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.tile-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-size: cover;
  background-position: center;
  pointer-events: none;
}

.pattern-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px;
  width: 40px;
  height: 40px;
  background: white;
  padding: 2px;
  border-radius: 4px;
  position: relative;
  z-index: 1;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.p-cell {
  border-radius: 2px;
}

.color-r { background-color: var(--r-color); }
.color-g { background-color: var(--g-color); }
.color-b { background-color: var(--b-color); }

.color-r::before { background-image: url('../assets/red.png'); }
.color-g::before { background-image: url('../assets/green.png'); }
.color-b::before { background-image: url('../assets/brown.png'); }
</style>
