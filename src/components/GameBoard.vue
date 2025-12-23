<script setup>
const props = defineProps(['board', 'selectedTileColor', 'hasStar', 'highlightCenter', 'matchedRegion', 'highlightedCell']);
defineEmits(['place']);

const getColorClass = (color) => {
  return `color-${color.toLowerCase()}`;
};

const isInvalid = (color) => {
  return props.selectedTileColor && props.selectedTileColor === color;
};
</script>

<template>
  <div class="board">
    <div v-for="(row, r) in board" :key="r" class="row">
      <div 
        v-for="(cell, c) in row" 
        :key="c" 
        class="cell"
        :class="[
          getColorClass(cell.color), 
          { 
            'invalid': isInvalid(cell.color),
            'pop-anim': cell.lastPlaced
          }
        ]"
        @click="$emit('place', r, c)"
      >
        <!-- Highlight for last move -->
        <div 
          v-if="highlightedCell && highlightedCell.row === r && highlightedCell.col === c" 
          class="highlight-glow"
          :class="{ 'is-persistent': highlightedCell.persistent }"
        ></div>

        <div class="cell-inner">
          <!-- 核心圖樣 (僅在有 pattern 且沒有星星時顯示) -->
          <div v-if="cell.pattern && !(r === 1 && c === 1 && hasStar)" class="board-pattern-grid" :style="{ transform: `rotate(${cell.rotation * 90}deg)` }">
            <template v-for="(pRow, pr) in cell.pattern" :key="pr">
              <div 
                v-for="(pColor, pc) in pRow" 
                :key="pc" 
                class="p-cell"
                :class="getColorClass(pColor)"
              ></div>
            </template>
          </div>

          <!-- 樹頂星星 -->
          <img v-if="r === 1 && c === 1 && hasStar" src="../assets/star.png" class="star-top" />
        </div>
        
        <!-- 匹配高亮亮框 (2x2) -->
        <template v-for="(region, idx) in matchedRegions" :key="idx">
          <div 
            v-if="r >= region.r && r < region.r + 2 && c >= region.c && c < region.c + 2" 
            class="match-highlight"
            :class="{ 
              'top': r === region.r, 
              'left': c === region.c,
              'right': c === region.c + 1,
              'bottom': r === region.r + 1
            }"
          ></div>
        </template>

        <div v-if="r === 1 && c === 1 && highlightCenter" class="center-highlight"></div>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 55.4%;
  height: 55.4%;
  gap: 2.2%;
  padding: 2.3%;
  box-sizing: border-box;
  background: transparent;
  position: relative;
}

.row {
  display: contents;
}

.cell {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
  background: white;
  position: relative;
  overflow: hidden;
}

.cell::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-size: cover;
  background-position: center;
  pointer-events: none;
}

.cell:active {
  transform: scale(0.95);
}

.color-r { background-color: var(--r-color); }
.color-g { background-color: var(--g-color); }
.color-b { background-color: var(--b-color); }

.color-r::before { background-image: url('../assets/red.png'); }
.color-g::before { background-image: url('../assets/green.png'); }
.color-b::before { background-image: url('../assets/brown.png'); }

.cell.invalid {
  cursor: not-allowed;
  opacity: 0.7;
  position: relative;
}

.cell.invalid::after {
  content: '✕';
  position: absolute;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  opacity: 0.8;
  text-shadow: 0 0 5px rgba(0,0,0,0.5);
}

.cell-inner {
  width: 80%;
  height: 80%;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 6px;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.star-top {
  position: absolute;
  width: 90%;
  height: 90%;
  filter: drop-shadow(0 0 10px gold);
  animation: star-shine 2s infinite;
  z-index: 2;
  pointer-events: none;
}

@keyframes star-shine {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px gold); }
  50% { transform: scale(1.1); filter: drop-shadow(0 0 20px gold); }
}

.center-highlight {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border: 4px solid gold;
  border-radius: 8px;
  animation: highlight-pulse 1s infinite;
  pointer-events: none;
  z-index: 3;
}

/* 棋盤上的板塊圖樣 */
.board-pattern-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px;
  width: 65%;
  height: 65%;
  background: white;
  padding: 2px;
  border-radius: 4px;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.p-cell {
  border-radius: 2px;
}

/* 匹配高亮：顯示一個 2x2 的發光邊框 */
.match-highlight {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 100;
  background: radial-gradient(circle at center, rgba(241, 196, 15, 0.2) 0%, transparent 70%);
  pointer-events: none;
  animation: match-glow 1.5s infinite ease-in-out;
  mix-blend-mode: soft-light;
}

.match-highlight.top { border-top: 3px solid rgba(255, 215, 0, 0.7); }
.match-highlight.bottom { border-bottom: 3px solid rgba(255, 215, 0, 0.7); }
.match-highlight.left { border-left: 3px solid rgba(255, 215, 0, 0.7); }
.match-highlight.right { border-right: 3px solid rgba(255, 215, 0, 0.7); }

@keyframes match-glow {
  0% { 
    box-shadow: inset 0 0 15px rgba(241, 196, 15, 0.4); 
    opacity: 0.6;
    transform: scale(0.98);
  }
  50% { 
    box-shadow: inset 0 0 30px rgba(241, 196, 15, 0.9), 0 0 10px rgba(241, 196, 15, 0.5); 
    opacity: 1;
    transform: scale(1);
  }
  100% { 
    box-shadow: inset 0 0 15px rgba(241, 196, 15, 0.4); 
    opacity: 0.6;
    transform: scale(0.98);
  }
}

/* 放置動畫 */
.pop-anim {
  animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop-in {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes highlight-pulse {
  0%, 100% { opacity: 0.5; box-shadow: inset 0 0 10px gold; }
  50% { opacity: 1; box-shadow: inset 0 0 30px gold; }
}

.highlight-glow {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(241, 196, 15, 0.4);
  box-shadow: inset 0 0 15px rgba(241, 196, 15, 0.8);
  border: 2px solid #f1c40f;
  border-radius: 8px;
  z-index: 10;
  pointer-events: none;
  animation: glow-pulse 1s infinite alternate;
}

.highlight-glow.is-persistent {
  animation: none;
  background: rgba(241, 196, 15, 0.2);
}

@keyframes glow-pulse {
  from { opacity: 0.5; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
