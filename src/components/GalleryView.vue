<script setup>
import { TileGenerator } from '../logic/tileGenerator';
import TileCard from './TileCard.vue';

const allTiles = TileGenerator.generateAllValidTiles();

// 按圖樣編號分組，方便查看
const groups = {};
allTiles.forEach(tile => {
  if (!groups[tile.patternId]) {
    groups[tile.patternId] = [];
  }
  groups[tile.patternId].push(tile);
});
</script>

<template>
  <div class="gallery">
    <h1>板塊圖庫 (共 {{ allTiles.length }} 款)</h1>
    <p class="desc">展示 24 種在旋轉下唯一的 2x2 圖樣，以及與各裝飾顏色 (R/G/B) 的合法組合。</p>
    
    <div v-for="(members, id) in groups" :key="id" class="pattern-group">
      <h3 class="group-title">圖樣 #{{ id }}</h3>
      <div class="tile-list">
        <div v-for="tile in members" :key="tile.id" class="tile-item">
          <TileCard :tile="tile" :rotation="0" />
          <div class="label">裝飾: {{ tile.ornamentColor }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
  background: #f0f2f5;
  color: #2c3e50;
}

.desc {
  color: #7f8c8d;
  margin-bottom: 20px;
}

.pattern-group {
  margin-bottom: 30px;
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.group-title {
  margin-top: 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  font-size: 1rem;
}

.tile-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 15px;
}

.tile-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.label {
  font-size: 0.8rem;
  font-weight: bold;
}
</style>
