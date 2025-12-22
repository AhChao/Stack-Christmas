<script setup>
import { ref, computed, onMounted } from 'vue';
import { GameLogic } from '../logic/gameLogic';
import { TileGenerator } from '../logic/tileGenerator';
import { gameConfig } from '../config';
import GameBoard from './GameBoard.vue';
import PlayerArea from './PlayerArea.vue';
import GameHUD from './GameHUD.vue';
import { AiAgent } from '../logic/aiAgent';

const props = defineProps(['mode', 'difficulty']);
const emit = defineEmits(['back']);

const colors = ['R', 'G', 'B'];
const board = ref([]);
const settings = ref({ ...gameConfig });
const handLimit = computed(() => settings.value.largeHand ? 4 : 3);

const deck = ref([]);
const players = ref([]);
const currentPlayerIndex = ref(0);
const gameOver = ref(false);
const winner = ref(null);
const selectedTileIndex = ref(-1);
const selectedTileRotation = ref(0);
const tilesPlayedThisTurn = ref(0);
const moveHistory = ref([]);
const matchedRegion = ref(null);
const selectedDecorationColor = ref(null);
const starOnBoard = ref(false);
const waitingForStar = ref(false);
const victoryCeremonyActive = ref(false);
const showToast = ref(false);
const startToast = ref({ show: false, message: '' });
const showRedrawMessage = ref(false);
const turnCount = ref(1);
const lastMove = ref(null);
const highlightedCell = ref(null);

function initBoard() {
    const layouts = [
        [['R', 'G', 'B'], ['B', 'R', 'G'], ['G', 'B', 'R']],
        [['G', 'B', 'R'], ['R', 'G', 'B'], ['B', 'R', 'G']],
        [['B', 'R', 'G'], ['G', 'B', 'R'], ['R', 'G', 'B']]
    ];
    const selectedLayout = layouts[Math.floor(Math.random() * 3)];
    board.value = selectedLayout.map(row => 
        row.map(color => ({ color, pattern: null, rotation: 0, lastPlaced: false }))
    );
}

function initDeck() {
    const allValidTiles = TileGenerator.generateAllValidTiles();
    for (let i = allValidTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allValidTiles[i], allValidTiles[j]] = [allValidTiles[j], allValidTiles[i]];
    }
    deck.value = allValidTiles;
}

function drawInitialHands() {
    players.value.forEach(p => p.hand = []);
    players.value.forEach(p => {
        for (let i = 0; i < handLimit.value; i++) {
            if (deck.value.length > 0) {
                p.hand.push(deck.value.pop());
            }
        }
    });

    const shouldRedraw = players.value.some(p => {
        if (p.hand.length < handLimit.value) return false;
        const playerColors = p.hand.map(t => t.ornamentColor);
        return playerColors.every(c => c === playerColors[0]);
    });

    if (shouldRedraw) {
        showRedrawMessage.value = true;
        setTimeout(() => {
            showRedrawMessage.value = false;
            initDeck();
            drawInitialHands();
        }, 2000);
    }
}

const selectedTileColor = computed(() => {
    if (selectedTileIndex.value === -1) return null;
    const player = players.value[currentPlayerIndex.value];
    return player.hand[selectedTileIndex.value]?.ornamentColor;
});

function handlePlace(r, c) {
    if (gameOver.value || selectedTileIndex.value === -1 || showRedrawMessage.value) return;
    const player = players.value[currentPlayerIndex.value];
    if (player.isAi) return;

    const tile = player.hand[selectedTileIndex.value];
    if (board.value[r][c].color === tile.ornamentColor) return;

    moveHistory.value.push({
        boardSnapshot: JSON.parse(JSON.stringify(board.value[r][c])),
        tileSnapshot: { ...tile },
        coord: { r, c },
        tileIndex: selectedTileIndex.value,
        turnCountSnapshot: turnCount.value,
        lastMoveSnapshot: lastMove.value ? JSON.parse(JSON.stringify(lastMove.value)) : null
    });

    board.value.forEach(row => row.forEach(cell => cell.lastPlaced = false));
    board.value[r][c] = {
        color: tile.ornamentColor,
        pattern: tile.pattern,
        rotation: selectedTileRotation.value,
        lastPlaced: true
    };
    
    // Update lastMove before turnCount increments
    lastMove.value = {
        playerName: player.name,
        tile: JSON.parse(JSON.stringify(tile)),
        row: r,
        col: c,
        turn: turnCount.value
    };

    tilesPlayedThisTurn.value++;
    player.hand.splice(selectedTileIndex.value, 1);

    let bestRotation = -1;
    let regionFound = null;

    regionFound = GameLogic.findMatchingRegion(board.value, tile.ornamentColor, GameLogic.rotatePatternTimes(tile.pattern, selectedTileRotation.value), r, c);
    if (regionFound) {
        bestRotation = selectedTileRotation.value;
    } else {
        for (let rot = 0; rot < 4; rot++) {
            if (rot === selectedTileRotation.value) continue;
            const rotatedPattern = GameLogic.rotatePatternTimes(tile.pattern, rot);
            regionFound = GameLogic.findMatchingRegion(board.value, tile.ornamentColor, rotatedPattern, r, c);
            if (regionFound) {
                bestRotation = rot;
                break;
            }
        }
    }

    if (bestRotation !== -1) {
        setTimeout(() => {
            board.value[r][c].rotation = bestRotation;
            matchedRegion.value = regionFound;
            turnCount.value++; // Increment turn after match confirmed
        }, 300);

        setTimeout(() => {
            let drawCount = settings.value.flexibleDraw ? tilesPlayedThisTurn.value : 1;
            const decoEnabled = settings.value.exquisiteDecoration && settings.value.playerCount === 2;
            if (decoEnabled && selectedDecorationColor.value) {
                if (tile.ornamentColor === selectedDecorationColor.value && player.decorationUses[tile.ornamentColor]) {
                    if (player.hand.length < handLimit.value) {
                        player.decorationUses[tile.ornamentColor] = false;
                        drawCount++;
                    }
                }
            } else if (settings.value.luckyColorEnabled && tile.ornamentColor === player.luckyColor) {
                drawCount++;
            }

            for (let i = 0; i < drawCount; i++) {
                if (deck.value.length > 0 && player.hand.length < handLimit.value) {
                    player.hand.push(deck.value.pop());
                }
            }
            nextTurn();
        }, 1200);
    } else {
        if (player.hand.length === 0) {
            player.eliminated = true;
            checkGameOver();
        }
        // No match found, but hand not empty. Turn does NOT end.
        // User (or AI) can continue to place tiles.
    }
    selectedTileIndex.value = -1;
    selectedTileRotation.value = 0;
}

function checkGameOver() {
    const activePlayers = players.value.filter(p => !p.eliminated);
    if (activePlayers.length <= 1) {
        if (activePlayers.length === 1) {
            winner.value = activePlayers[0].name;
            victoryCeremonyActive.value = true;
        } else {
            gameOver.value = true;
            winner.value = '無人';
        }
    } else {
        nextTurn();
    }
}

async function handleAiTurn() {
    if (gameOver.value) return;
    const player = players.value[currentPlayerIndex.value];
    if (!player.isAi) return;

    const gameState = {
        board: board.value,
        hand: player.hand,
        opponentHand: players.value.find(p => !p.isAi).hand,
        deckSize: deck.value.length,
        decorationUses: player.decorationUses,
        isExquisiteMode: settings.value.exquisiteDecoration
    };

    const move = AiAgent.computeMove(gameState, props.difficulty || 'normal');
    if (move) {
        selectedTileIndex.value = move.tileIndex;
        selectedTileRotation.value = move.rotation;
        await new Promise(r => setTimeout(r, 1200));
        
        const tile = player.hand[selectedTileIndex.value];
        board.value.forEach(row => row.forEach(cell => cell.lastPlaced = false));
        board.value[move.row][move.col] = {
            color: tile.ornamentColor,
            pattern: tile.pattern,
            rotation: move.rotation,
            lastPlaced: true
        };

        // Update lastMove for AI
        lastMove.value = {
            playerName: player.name,
            tile: JSON.parse(JSON.stringify(tile)),
            row: move.row,
            col: move.col,
            turn: turnCount.value
        };

        const region = GameLogic.findMatchingRegion(board.value, tile.ornamentColor, GameLogic.rotatePatternTimes(tile.pattern, move.rotation), move.row, move.col);
        setTimeout(() => {
            board.value[move.row][move.col].rotation = move.rotation;
            matchedRegion.value = region;
            if (region) turnCount.value++;
        }, 300);

        tilesPlayedThisTurn.value++;
        player.hand.splice(selectedTileIndex.value, 1);

        setTimeout(() => {
            if (region) {
                // Survival match achieved! Draw and end turn.
                let drawCount = settings.value.flexibleDraw ? tilesPlayedThisTurn.value : 1;
                for (let i = 0; i < drawCount; i++) {
                    if (deck.value.length > 0 && player.hand.length < handLimit.value) {
                        player.hand.push(deck.value.pop());
                    }
                }
                nextTurn();
            } else {
                // No match from this placement.
                if (player.hand.length === 0) {
                    // Out of cards and no match -> Eliminated
                    player.eliminated = true;
                    checkGameOver();
                } else {
                    // Still has cards, try to play another one to get a match!
                    handleAiTurn();
                }
            }
        }, 1500);
    } else {
        // AI Concession
        startToast.value = { show: true, message: '小精靈認輸了！' };
        setTimeout(() => {
            startToast.value.show = false;
            winner.value = players.value.find(p => !p.isAi).name;
            victoryCeremonyActive.value = true;
        }, 1500);
    }
    selectedTileIndex.value = -1;
    selectedTileRotation.value = 0;
}

function handleUndo() {
    if (moveHistory.value.length === 0 || matchedRegion.value !== null) return;
    const lastState = moveHistory.value.pop();
    const player = players.value[currentPlayerIndex.value];
    board.value[lastState.coord.r][lastState.coord.c] = lastState.boardSnapshot;
    player.hand.splice(lastState.tileIndex, 0, lastState.tileSnapshot);
    turnCount.value = lastState.turnCountSnapshot;
    lastMove.value = lastState.lastMoveSnapshot;
    tilesPlayedThisTurn.value--;
    selectedTileIndex.value = -1;
    selectedTileRotation.value = 0;
    highlightedCell.value = null;
}

function nextTurn() {
    tilesPlayedThisTurn.value = 0;
    matchedRegion.value = null;
    moveHistory.value = [];
    
    let nextIndex = (currentPlayerIndex.value + 1) % players.value.length;
    while (players.value[nextIndex].eliminated) {
        nextIndex = (nextIndex + 1) % players.value.length;
    }
    currentPlayerIndex.value = nextIndex;
    selectedDecorationColor.value = null;

    if (players.value[currentPlayerIndex.value].isAi) {
        setTimeout(handleAiTurn, 1000);
    }
}

function confirmVictoryModal() {
    victoryCeremonyActive.value = false;
    waitingForStar.value = true;
}

function handleBoardClick(r, c) {
    if (waitingForStar.value) {
        if (r === 1 && c === 1) {
            starOnBoard.value = true;
            waitingForStar.value = false;
            showToast.value = true;
            setTimeout(() => {
                showToast.value = false;
                gameOver.value = true;
            }, 3000);
        }
        return;
    }
    handlePlace(r, c);
}

function startGame() {
    gameOver.value = false;
    winner.value = null;
    starOnBoard.value = false;
    waitingForStar.value = false;
    victoryCeremonyActive.value = false;
    matchedRegion.value = null;
    turnCount.value = 1;
    lastMove.value = null;
    highlightedCell.value = null;
    moveHistory.value = [];
    
    initBoard();
    initDeck();
    
    const diffLabels = { beginner: '新手', normal: '普通', hard: '困難', expert: '專家' };
    if (props.mode === 'ai') {
        const isAiFirst = Math.random() > 0.5;
        players.value = [
            { id: 1, name: '玩家', hand: [], eliminated: false, isAi: false, decorationUses: { 'R': true, 'G': true, 'B': true } },
            { id: 2, name: `聖誕小精靈 (${diffLabels[props.difficulty] || '普通'})`, hand: [], eliminated: false, isAi: true, decorationUses: { 'R': true, 'G': true, 'B': true } }
        ];
        currentPlayerIndex.value = isAiFirst ? 1 : 0;
        startToast.value = { show: true, message: `新的一局開始，重新發牌中... 這局由${isAiFirst ? '聖誕小精靈' : '你'}先開始` };
    } else {
        players.value = [
            { id: 1, name: '玩家 1', hand: [], eliminated: false, isAi: false, hasMulligan: true, decorationUses: { 'R': true, 'G': true, 'B': true } },
            { id: 2, name: '玩家 2', hand: [], eliminated: false, isAi: false, hasMulligan: true, decorationUses: { 'R': true, 'G': true, 'B': true } }
        ];
        currentPlayerIndex.value = 0;
        startToast.value = { show: true, message: '新的一局開始，重新發牌中... 由玩家 1 先開始' };
    }
    
    setTimeout(() => startToast.value.show = false, 3000);
    drawInitialHands();
    if (players.value[currentPlayerIndex.value].isAi) {
        setTimeout(handleAiTurn, 1500);
    }
}

onMounted(() => {
    startGame();
});
</script>

<template>
  <div class="face-to-face-layout">
    <!-- 頂部按鈕 -->
    <div class="top-nav">
      <button class="back-btn" @click="emit('back')">🏠 返回首頁</button>
    </div>

    <!-- 玩家 2 -->
    <PlayerArea 
      v-if="players[1]"
      :player="players[1]" 
      :is-current="currentPlayerIndex === 1" 
      :is-rotated="true"
      :mulligan-enabled="settings.mulliganEnabled"
      @select-tile="(i) => !players[1].isAi && (selectedTileIndex = i)"
      @rotate-tile="!players[1].isAi && (selectedTileRotation = (selectedTileRotation + 1) % 4)"
      :selected-index="currentPlayerIndex === 1 ? selectedTileIndex : -1"
      :rotation="selectedTileRotation"
      :deco-enabled="settings.exquisiteDecoration && settings.playerCount === 2"
      :selected-deco="selectedDecorationColor"
      @select-deco="(color) => !players[1].isAi && (selectedDecorationColor = color)"
      :can-undo="!players[1].isAi && moveHistory.length > 0"
      @undo="handleUndo"
    />

    <div class="middle-area">
      <GameHUD 
        :turn-count="turnCount" 
        :last-move="lastMove"
        @highlight-move="(move, persistent) => highlightedCell = move ? { ...move, persistent } : null"
      />

      <div class="board-wrapper">
        <GameBoard 
          :board="board" 
          :selected-tile-color="selectedTileColor"
          :has-star="starOnBoard"
          :highlight-center="waitingForStar"
          :matched-region="matchedRegion"
          :highlighted-cell="highlightedCell"
          @place="handleBoardClick" 
        />
        
        <div v-show="waitingForStar" class="star-side-float">
          <img src="../assets/star.png" alt="star" />
          <div class="arrow">⬅️</div>
        </div>
        
        <div v-if="showRedrawMessage" class="redraw-overlay">
          <div class="msg">偵測到起手三張同色，重新發牌中...</div>
        </div>

        <div v-if="gameOver" class="game-over-overlay">
          <h2>遊戲結束</h2>
          <p>{{ winner }} 獲勝！</p>
          <button @click="startGame">重新開始</button>
        </div>
      </div>
    </div>

    <!-- 玩家 1 -->
    <PlayerArea 
      v-if="players[0]"
      :player="players[0]" 
      :is-current="currentPlayerIndex === 0" 
      :is-rotated="false"
      :mulligan-enabled="settings.mulliganEnabled"
      @select-tile="(i) => !players[0].isAi && (selectedTileIndex = i)"
      @rotate-tile="!players[0].isAi && (selectedTileRotation = (selectedTileRotation + 1) % 4)"
      :selected-index="currentPlayerIndex === 0 ? selectedTileIndex : -1"
      :rotation="selectedTileRotation"
      :deco-enabled="settings.exquisiteDecoration && settings.playerCount === 2"
      :selected-deco="selectedDecorationColor"
      @select-deco="(color) => !players[0].isAi && (selectedDecorationColor = color)"
      :can-undo="!players[0].isAi && moveHistory.length > 0"
      @undo="handleUndo"
    />

    <!-- Modal & Toasts -->
    <div v-if="victoryCeremonyActive" class="modal-overlay">
      <div class="modal">
        <div class="star-icon">⭐</div>
        <template v-if="winner.includes('聖誕小精靈')">
          <h2 class="elf-win-msg">
            恭喜小精靈贏了<br>
            小精靈想謝謝你陪他玩，想請你幫他放星星，你能幫他放嗎？
          </h2>
        </template>
        <template v-else>
          <h2>恭喜！{{ winner }} 贏了！</h2>
          <p>你獲得了把星星放上聖誕樹頂端的權利</p>
        </template>
        <button @click="confirmVictoryModal">去放星星</button>
      </div>
    </div>

    <div v-if="showToast" class="toast-overlay">
      <div class="toast">🎄 聖誕快樂！聖誕樹裝飾完成！ 🎅</div>
    </div>

    <div v-if="startToast.show" class="start-toast-overlay">
      <div class="start-toast">{{ startToast.message }}</div>
    </div>
  </div>
</template>

<style scoped>
.face-to-face-layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  padding: 10px;
  width: 100%;
  max-width: 800px; /* Increased to accommodate sidebar HUD on desktop */
  position: relative;
  margin: 0 auto; /* Center the layout */
}

.top-nav {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
}

.back-btn {
  background: rgba(255,255,255,0.8);
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  color: #333;
}

.middle-area {
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1 / 1;
  width: 90vmin;
  height: 90vmin;
  max-width: 500px;
  max-height: 500px;
  background: url("/src/assets/pot.png");
  background-size: 140%;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0 auto;
  position: relative;

}

.board-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.modal-overlay, .game-over-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  border-radius: 20px;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
}

.game-over-overlay {
  flex-direction: column;
  color: white;
}

.star-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.toast-overlay, .start-toast-overlay {
  position: fixed;
  left: 0; right: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 3000;
}

.toast-overlay { bottom: 50px; }
.start-toast-overlay { top: 50%; transform: translateY(-50%); }

.toast, .start-toast {
  background: rgba(46, 204, 113, 0.9);
  color: white;
  padding: 15px 30px;
  border-radius: 50px;
  font-weight: bold;
}

.start-toast {
  background: rgba(44, 62, 80, 0.95);
  font-size: 1.5rem;
  border: 2px solid gold;
}

.star-side-float {
  position: absolute;
  right: -80px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
}

.star-side-float img { width: 50px; }
.arrow { font-size: 1.5rem; }

.redraw-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(231, 76, 60, 0.9);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  z-index: 100;
}
</style>
