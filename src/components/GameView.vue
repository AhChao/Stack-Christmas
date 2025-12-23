<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { GameLogic } from '../logic/gameLogic';
import { TileGenerator } from '../logic/tileGenerator';
import { gameConfig } from '../config';
import GameBoard from './GameBoard.vue';
import PlayerArea from './PlayerArea.vue';
import GameHUD from './GameHUD.vue';
import { AiAgent } from '../logic/aiAgent';
import { SOLO_BOARDS, getSoloLevel, SOLO_RULES_ZH, SOLO_RULES_EN } from '../logic/soloConstants';
import dogBack from '../assets/dog_back.png';
import catBack from '../assets/cat_back.png';
import starImg from '../assets/star.png';
import potImg from '../assets/pot.png';

const props = defineProps(['mode', 'difficulty', 'randomBoard', 'paidMulligan', 'lang']);
const emit = defineEmits(['back']);

const translations = {
    zh: {
        redrawMsg: '偵測到起手三張同色，重新發牌中...',
        decoComplete: '裝飾完成！',
        scoreLabel: '分數',
        turnLabel: '回合',
        retry: '再次挑戰',
        leaderboard: '🏆 排行榜',
        gameOver: '遊戲結束',
        winSuffix: ' 獲勝！',
        restart: '重新開始',
        concedeMsg: '小精靈認輸了！',
        paidMulliganMsg: ' 消耗了三個指示物重抽了手牌！',
        soloEndMsg: ' 結束了裝飾！',
        surrenderMsg: ' 選擇了投降！',
        aiThinking: '正在思考中最優解...',
        nobody: '無人',
        newGameRedraw: '新的一局開始，重新發牌中...',
        turnStartSuffix: '先開始',
        you: '你',
        player: '玩家',
        elfName: '聖誕小精靈',
        beginner: '新手',
        normal: '普通',
        hard: '困難',
        expert: '專家',
        p1: '玩家 1',
        p2: '玩家 2',
        soloStartMsg: '獨自裝飾模式開始！盡可能完成更多圖樣吧！',
        iSee: '我知道了',
        highScoreTitle: '🎉 新紀錄！',
        enterName: '留下你的大名：',
        submit: '送出',
        leaderboardTitle: '🎄 裝飾大師排行榜',
        rank: '排名',
        playerName: '玩家',
        date: '日期',
        noRecords: '尚無記錄',
        mulliganConfirmedMsg: ' 成功重抽手牌！',
        victoryModalTitle: '裝飾得真漂亮！✨',
        victoryModalSoloDesc: '準備好要來放星星亮起聖誕樹了嗎？',
        victoryModalMultiDesc: '你獲得了把星星放上聖誕樹頂端的權利',
        placeStar: '放星星囉！',
        elfWinMsg: '小精靈贏了！✨\n「謝謝你陪我玩這麼精彩的一局！\n我也想看聖誕樹亮起來，你能幫我把星星放上去嗎？」',
        congratulations: '恭喜！',
        toastMessage: '🎄 聖誕快樂！聖誕樹裝飾完成！ 🎅',
        selectTokensToConsume: '選擇要消耗的',
        tokens: '個指示物',
        paidMulliganDesc: '此動作將消耗指示物且無任何效果，僅用於支付重抽代價',
        rColor: '紅色',
        gColor: '綠色',
        bColor: '棕色',
        cancel: '取消',
        confirmRedraw: '確認重抽',
        confirmSurrender: '確定要投降嗎？',
        confirmSoloSurrender: '確定要放棄裝飾嗎？',
        surrenderDesc: '你確定要把放置星星的權利讓給對方嗎？',
        soloSurrenderDesc: '這次裝飾到這裡就好嗎？那要來放星星囉！',
        confirmSurrenderBtn: '確定投降',
        backHome: '🏠 返回首頁',
        soloRules: '❔ 單人規則',
        handNeeds: '手上圖樣需：',
        boardDist: '盤面底色分佈：',
        anonPlayer: '無名裝飾家'
    },
    en: {
        redrawMsg: 'Starting hand colors are identical. Redrawing...',
        decoComplete: 'Decoration Complete!',
        scoreLabel: 'Score',
        turnLabel: 'Turns',
        retry: 'Retry',
        leaderboard: '🏆 Leaderboard',
        gameOver: 'Game Over',
        winSuffix: ' Wins!',
        restart: 'Restart',
        concedeMsg: 'The elf has conceded!',
        paidMulliganMsg: ' spent 3 tokens to redraw their hand!',
        soloEndMsg: ' finished decorating!',
        surrenderMsg: ' surrendered!',
        aiThinking: 'AI is thinking...',
        nobody: 'Nobody',
        newGameRedraw: 'New game starting, redrawing...',
        turnStartSuffix: ' goes first',
        you: 'You',
        player: 'Player',
        elfName: 'Christmas Elf',
        beginner: 'Novice',
        normal: 'Normal',
        hard: 'Hard',
        expert: 'Expert',
        p1: 'Player 1',
        p2: 'Player 2',
        soloStartMsg: 'Solo mode start! Complete as many patterns as you can!',
        iSee: 'I see',
        highScoreTitle: '🎉 New Record!',
        enterName: 'Enter your name:',
        submit: 'Submit',
        leaderboardTitle: '🎄 Solo Leaderboard',
        rank: 'Rank',
        playerName: 'Player',
        date: 'Date',
        noRecords: 'No records yet',
        mulliganConfirmedMsg: ' successfully redrew their hand!',
        victoryModalTitle: 'Beautifully Decorated! ✨',
        victoryModalSoloDesc: 'Ready to place the star and light up the tree?',
        victoryModalMultiDesc: 'You have earned the right to place the star atop the tree!',
        placeStar: 'Place the Star!',
        elfWinMsg: 'The Elf Won! ✨\n"Thanks for a great game! I want to see the tree light up too, can you help me place the star?"',
        congratulations: 'Congrats!',
        toastMessage: '🎄 Merry Christmas! The tree is complete! 🎅',
        selectTokensToConsume: 'Select',
        tokens: 'tokens to consume',
        paidMulliganDesc: 'This will use tokens to pay for the redraw cost.',
        rColor: 'Red',
        gColor: 'Green',
        bColor: 'Brown',
        cancel: 'Cancel',
        confirmRedraw: 'Confirm Redraw',
        confirmSurrender: 'Confirm Surrender?',
        confirmSoloSurrender: 'Finish Decorating?',
        surrenderDesc: 'Are you sure you want to give the star-placing right to your opponent?',
        soloSurrenderDesc: 'Is this enough for now? Let\'s place the star!',
        confirmSurrenderBtn: 'Surrender',
        backHome: '🏠 Home',
        soloRules: '❔ Solo Rules',
        handNeeds: 'In Hand:',
        boardDist: 'Board Layout:',
        anonPlayer: 'Anonymous Decorator'
    }
};

const gt = computed(() => translations[props.lang || 'zh']);

const colors = ['R', 'G', 'B'];
const board = ref([]);
const settings = ref({ ...gameConfig });
const handLimit = computed(() => {
    if (props.mode === 'solo') return 4;
    return settings.value.largeHand ? 4 : 3;
});

const requiredMulliganTokens = computed(() => {
    return props.mode === 'solo' ? 3 : 2;
});

const soloScore = ref(0);
const scoreFloats = ref([]); // { id, value, r, c }

const deck = ref([]);
const players = ref([]);
const currentPlayerIndex = ref(0);
const gameOver = ref(false);
const winner = ref(null);
const selectedTileIndex = ref(-1);
const selectedTileRotation = computed({
    get() {
        if (selectedTileIndex.value === -1) return 0;
        const player = players.value[currentPlayerIndex.value];
        const tile = player.hand[selectedTileIndex.value];
        return tile ? (tile.rotation || 0) : 0;
    },
    set(val) {
        if (selectedTileIndex.value === -1) return;
        const player = players.value[currentPlayerIndex.value];
        const tile = player.hand[selectedTileIndex.value];
        if (tile) {
            tile.rotation = val;
        }
    }
});
const tilesPlayedThisTurn = ref(0);
const moveHistory = ref([]);
const matchedRegions = ref([]);
const selectedDecorationColor = ref(null);
const starOnBoard = ref(false);
const waitingForStar = ref(false);
const victoryCeremonyActive = ref(false);
const showToast = ref(false);
const startToast = ref({ show: false, message: '' });
const showSoloRulesModal = ref(false);
const showHelper = ref(false);
const showHighScoreModal = ref(false);
const showLeaderboardModal = ref(false);
const topScores = ref(JSON.parse(localStorage.getItem('soloTop3') || '[]'));
const playerNameInput = ref('');
const showRedrawMessage = ref(false);
const turnCount = ref(1);
const lastMove = ref(null);
const highlightedCell = ref(null);
const showPaidMulliganModal = ref(false);
const selectedTokensForPaidMulligan = ref([]);
const showSurrenderModal = ref(false);

function initBoard() {
    if (props.randomBoard) {
        // 3 Red, 3 Green, 3 Brown
        const pool = ['R', 'R', 'R', 'G', 'G', 'G', 'B', 'B', 'B'];
        // Shuffle pool
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        
        const flat = pool.map(color => ({ color, pattern: null, rotation: 0, lastPlaced: false }));
        board.value = [
            [flat[0], flat[1], flat[2]],
            [flat[3], flat[4], flat[5]],
            [flat[6], flat[7], flat[8]]
        ];
    } else if (props.mode === 'solo') {
        const layout = SOLO_BOARDS[Math.floor(Math.random() * SOLO_BOARDS.length)];
        board.value = layout.map(row => 
            row.map(color => ({ color, pattern: null, rotation: 0, lastPlaced: false }))
        );
    } else {
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
        rotation: tile.rotation,
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

    const allMatches = GameLogic.findAllMatchingRegions(board.value, tile.ornamentColor, GameLogic.rotatePatternTimes(tile.pattern, tile.rotation), r, c);
    if (allMatches.length > 0) {
        bestRotation = tile.rotation;
        regionFound = allMatches; // In plural version, this is an array
    } else {
        for (let rot = 0; rot < 4; rot++) {
            if (rot === tile.rotation) continue;
            const rotatedPattern = GameLogic.rotatePatternTimes(tile.pattern, rot);
            const rotMatches = GameLogic.findAllMatchingRegions(board.value, tile.ornamentColor, rotatedPattern, r, c);
            if (rotMatches.length > 0) {
                bestRotation = rot;
                regionFound = rotMatches;
                break;
            }
        }
    }

    if (bestRotation !== -1) {
        setTimeout(() => {
            board.value[r][c].rotation = bestRotation;
            matchedRegions.value = regionFound;
            turnCount.value++; // Increment turn after match confirmed
        }, 300);

        setTimeout(() => {
            let drawCount = settings.value.flexibleDraw ? tilesPlayedThisTurn.value : 1;
            const decoEnabled = settings.value.exquisiteDecoration && settings.value.playerCount === 2;
            if (decoEnabled && selectedDecorationColor.value) {
                if (tile.ornamentColor === selectedDecorationColor.value && player.decorationUses[tile.ornamentColor]) {
                    if (player.hand.length < handLimit.value) {
                        if (typeof player.decorationUses[tile.ornamentColor] === 'number') {
                            player.decorationUses[tile.ornamentColor]--;
                        } else {
                            player.decorationUses[tile.ornamentColor] = false;
                        }
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

            if (props.mode === 'solo') {
                // Scoring logic for Solo Mode
                const matches = matchedRegions.value.length;
                let points = matches > 1 ? 3 : 1;
                
                soloScore.value += points;
                addScoreFloat(points, r, c);
            }

            if (player.hand.length === 0 && deck.value.length === 0) {
                // Out of cards after match and pool empty
                player.eliminated = true;
                checkGameOver();
            } else {
                nextTurn();
            }
        }, 1200);
    } else {
        if (player.hand.length === 0) {
            player.eliminated = true;
            checkGameOver();
        }
        // No match found, but hand not empty. Turn does NOT end.
    }
    selectedTileIndex.value = -1;
}

function checkGameOver() {
    const activePlayers = players.value.filter(p => !p.eliminated);
    
    if (props.mode === 'solo') {
        if (activePlayers.length === 0) {
            gameOver.value = true;
            checkLeaderboard();
        }
        return;
    }

    if (activePlayers.length <= 1) {
        if (activePlayers.length === 1) {
            winner.value = activePlayers[0];
            victoryCeremonyActive.value = true;
        } else {
            gameOver.value = true;
            winner.value = { name: gt.value.nobody };
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
        // The computed setter for selectedTileRotation will update the tile's rotation
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

        const regions = GameLogic.findAllMatchingRegions(board.value, tile.ornamentColor, GameLogic.rotatePatternTimes(tile.pattern, move.rotation), move.row, move.col);
        setTimeout(() => {
            board.value[move.row][move.col].rotation = move.rotation;
            matchedRegions.value = regions;
            if (regions.length > 0) turnCount.value++;
        }, 300);

        tilesPlayedThisTurn.value++;
        player.hand.splice(selectedTileIndex.value, 1);

        setTimeout(() => {
            if (regions.length > 0) {
                // Survival match achieved! Draw and end turn.
                let drawCount = settings.value.flexibleDraw ? tilesPlayedThisTurn.value : 1;
                
                // AI Token / Lucky Color Logic
                const decoEnabled = settings.value.exquisiteDecoration && settings.value.playerCount === 2;
                if (decoEnabled) {
                    // AI heuristic: use token whenever it won't exceed hand limit and token color matches tile
                    if (player.decorationUses[tile.ornamentColor]) {
                        if (player.hand.length + drawCount < handLimit.value) {
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
        startToast.value = { show: true, message: gt.value.concedeMsg };
        setTimeout(() => {
            startToast.value.show = false;
            winner.value = players.value.find(p => !p.isAi);
            victoryCeremonyActive.value = true;
        }, 1500);
    }
    selectedTileIndex.value = -1;
}

function handleUndo() {
    if (moveHistory.value.length === 0 || matchedRegions.value.length > 0) return;
    const lastState = moveHistory.value.pop();
    const player = players.value[currentPlayerIndex.value];
    board.value[lastState.coord.r][lastState.coord.c] = lastState.boardSnapshot;
    player.hand.splice(lastState.tileIndex, 0, lastState.tileSnapshot);
    turnCount.value = lastState.turnCountSnapshot;
    lastMove.value = lastState.lastMoveSnapshot;
    tilesPlayedThisTurn.value--;
    selectedTileIndex.value = -1;
    highlightedCell.value = null;
}

function nextTurn() {
    tilesPlayedThisTurn.value = 0;
    matchedRegions.value = [];
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

function confirmSurrender() {
    const player = players.value[currentPlayerIndex.value];
    showSurrenderModal.value = false;
    
    if (props.mode === 'solo') {
        winner.value = player;
    } else {
        const opponentIndex = (currentPlayerIndex.value + 1) % players.value.length;
        winner.value = players.value[opponentIndex];
    }
    
    // Activate victory ceremony so someone can place the star
    victoryCeremonyActive.value = true;
    
    startToast.value = { 
        show: true, 
        message: props.mode === 'solo' ? player.name + (gt.value.soloEndMsg || ' has finished!') : player.name + gt.value.surrenderMsg 
    };
    setTimeout(() => startToast.value.show = false, 2000);
}

function openPaidMulliganModal() {
    selectedTokensForPaidMulligan.value = [];
    showPaidMulliganModal.value = true;
}

function toggleTokenSelection(color) {
    const player = players.value[currentPlayerIndex.value];
    const currentCount = selectedTokensForPaidMulligan.value.filter(c => c === color).length;
    
    // For Solo, we allow picking the same color twice if we have 2. 
    // In simpler implementation, we'll just treat it as a list of colors to spend.
    if (selectedTokensForPaidMulligan.value.length < requiredMulliganTokens.value || selectedTokensForPaidMulligan.value.includes(color)) {
        const index = selectedTokensForPaidMulligan.value.indexOf(color);
        if (index > -1) {
            selectedTokensForPaidMulligan.value.splice(index, 1);
        } else {
            if (currentCount < player.decorationUses[color]) {
                selectedTokensForPaidMulligan.value.push(color);
            }
        }
    }
}

function handlePaidMulligan() {
    if (selectedTokensForPaidMulligan.value.length !== requiredMulliganTokens.value) return;
    
    const player = players.value[currentPlayerIndex.value];
    
    // Spend tokens
    selectedTokensForPaidMulligan.value.forEach(color => {
        if (typeof player.decorationUses[color] === 'number') {
            player.decorationUses[color]--;
        } else {
            player.decorationUses[color] = false;
        }
    });

    // Mulligan: reshuffle hand into deck
    deck.value.push(...player.hand);
    const drawCount = player.hand.length;
    player.hand = [];
    
    // Shuffle deck
    for (let i = deck.value.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck.value[i], deck.value[j]] = [deck.value[j], deck.value[i]];
    }

    // Draw same number back
    for (let i = 0; i < drawCount; i++) {
        if (deck.value.length > 0) {
            player.hand.push(deck.value.pop());
        }
    }
    
    showPaidMulliganModal.value = false;
    startToast.value = { show: true, message: player.name + gt.value.paidMulliganMsg };
    setTimeout(() => startToast.value.show = false, 2000);
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
                if (props.mode === 'solo') {
                    checkLeaderboard();
                }
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
    matchedRegions.value = [];
    turnCount.value = 1;
    lastMove.value = null;
    highlightedCell.value = null;
    moveHistory.value = [];
    showPaidMulliganModal.value = false;
    soloScore.value = 0;
    scoreFloats.value = [];
    playerNameInput.value = '';
    showHighScoreModal.value = false;
    showLeaderboardModal.value = false;
    
    initBoard();
    initDeck();
    
    const diffLabels = { 
        beginner: gt.value.beginner, 
        normal: gt.value.normal, 
        hard: gt.value.hard, 
        expert: gt.value.expert 
    };
    if (props.mode === 'ai') {
        const isAiFirst = Math.random() > 0.5;
        players.value = [
            { id: 1, name: gt.value.player, hand: [], eliminated: false, isAi: false, decorationUses: { 'R': 1, 'G': 1, 'B': 1 } },
            { id: 2, name: `${gt.value.elfName} (${diffLabels[props.difficulty] || gt.value.normal})`, hand: [], eliminated: false, isAi: true, decorationUses: { 'R': 1, 'G': 1, 'B': 1 } }
        ];
        currentPlayerIndex.value = isAiFirst ? 1 : 0;
        startToast.value = { show: true, message: gt.value.newGameRedraw + ' ' + (isAiFirst ? gt.value.elfName : gt.value.you) + gt.value.turnStartSuffix };
    } else if (props.mode === 'pvp') {
        players.value = [
            { id: 1, name: gt.value.p1, hand: [], eliminated: false, isAi: false, hasMulligan: true, decorationUses: { 'R': 1, 'G': 1, 'B': 1 } },
            { id: 2, name: gt.value.p2, hand: [], eliminated: false, isAi: false, hasMulligan: true, decorationUses: { 'R': 1, 'G': 1, 'B': 1 } }
        ];
        currentPlayerIndex.value = 0;
        startToast.value = { show: true, message: gt.value.newGameRedraw + ' ' + gt.value.p1 + gt.value.turnStartSuffix };
    } else if (props.mode === 'solo') {
        players.value = [
            { id: 1, name: gt.value.you, hand: [], eliminated: false, isAi: false, decorationUses: { 'R': 2, 'G': 2, 'B': 2 } }
        ];
        currentPlayerIndex.value = 0;
        startToast.value = { show: true, message: gt.value.soloStartMsg };
    }
    
    setTimeout(() => startToast.value.show = false, 3000);
    drawInitialHands();
    if (players.value[currentPlayerIndex.value]?.isAi) {
        setTimeout(handleAiTurn, 1500);
    }
}

function addScoreFloat(val, r, c) {
    const id = Date.now();
    scoreFloats.value.push({ id, value: val, r, c });
    setTimeout(() => {
        scoreFloats.value = scoreFloats.value.filter(f => f.id !== id);
    }, 1000);
}

const soloLevel = computed(() => getSoloLevel(soloScore.value, props.lang || 'zh'));

const soloRulesHtml = computed(() => {
    return (props.lang === 'en' ? SOLO_RULES_EN : SOLO_RULES_ZH);
});

const helperStats = computed(() => {
    if (!showHelper.value) return null;
    const player = players.value[currentPlayerIndex.value];
    if (!player) return null;
    
    const needed = { r: 0, g: 0, b: 0 };
    player.hand.forEach(tile => {
        tile.pattern.forEach(row => {
            row.forEach(cell => {
                if (cell === 'R') needed.r++;
                else if (cell === 'G') needed.g++;
                else if (cell === 'B') needed.b++;
            });
        });
    });
    
    const distribution = { r: 0, g: 0, b: 0 };
    board.value.forEach(row => {
        row.forEach(cell => {
            const color = cell.color;
            if (color === 'R') distribution.r++;
            else if (color === 'G') distribution.g++;
            else if (color === 'B') distribution.b++;
        });
    });
    
    return { needed, distribution };
});

function checkLeaderboard() {
    const isTop3 = topScores.value.length < 3 || soloScore.value > topScores.value[topScores.value.length - 1].score;
    if (isTop3) {
        showHighScoreModal.value = true;
    }
}

function saveHighScore() {
    const newRecord = {
        name: playerNameInput.value || gt.value.anonPlayer,
        score: soloScore.value,
        date: new Date().toLocaleDateString()
    };
    
    topScores.value.push(newRecord);
    topScores.value.sort((a, b) => b.score - a.score);
    topScores.value = topScores.value.slice(0, 3);
    
    localStorage.setItem('soloTop3', JSON.stringify(topScores.value));
    showHighScoreModal.value = false;
}

watch(() => props.lang, () => {
    if (!players.value || players.value.length === 0) return;
    
    // Update player names reactively
    if (props.mode === 'ai') {
        players.value[0].name = gt.value.player;
        const diffLabels = { 
            beginner: gt.value.beginner, 
            normal: gt.value.normal, 
            hard: gt.value.hard, 
            expert: gt.value.expert 
        };
        players.value[1].name = `${gt.value.elfName} (${diffLabels[props.difficulty] || gt.value.normal})`;
    } else if (props.mode === 'pvp') {
        players.value[0].name = gt.value.p1;
        players.value[1].name = gt.value.p2;
    } else if (props.mode === 'solo') {
        players.value[0].name = gt.value.you;
    }
});

onMounted(() => {
    startGame();
});
</script>

<template>
  <div class="face-to-face-layout">
    <!-- 頂部按鈕 -->
    <div class="top-nav">
      <div class="nav-left">
        <button class="back-btn" @click="emit('back')">{{ gt.backHome }}</button>
        <button v-if="props.mode === 'solo'" class="help-btn" @click="showSoloRulesModal = true">{{ gt.soloRules }}</button>
      </div>
      <div v-if="props.mode === 'solo'" class="solo-score-hud">
        <div class="score-label">SCORE</div>
        <div class="score-num">{{ soloScore }}</div>
      </div>
    </div>

    <div v-if="props.mode === 'solo'" class="solo-top-stats">
      <GameHUD 
        :turn-count="turnCount" 
        :last-move="lastMove"
        :lang="props.lang"
        class="solo-embedded-hud"
        @highlight-move="(move, persistent) => highlightedCell = move ? { ...move, persistent } : null"
      />
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
      :deco-enabled="props.mode === 'solo' || (settings.exquisiteDecoration && settings.playerCount === 2)"
      :selected-deco="selectedDecorationColor"
      @select-deco="(color) => !players[1].isAi && (selectedDecorationColor = color)"
      :can-undo="!players[1].isAi && moveHistory.length > 0"
      @undo="handleUndo"
      :paid-mulligan-enabled="props.paidMulligan"
      :mulligan-tokens-cost="requiredMulliganTokens"
      @request-paid-mulligan="openPaidMulliganModal"
      :difficulty="props.difficulty"
      @surrender="showSurrenderModal = true"
      :show-helper="showHelper"
      @toggle-helper="showHelper = !showHelper"
      :mode="props.mode"
      :lang="props.lang"
    />

    <div class="middle-area">
      <GameHUD 
        v-if="props.mode !== 'solo'"
        :turn-count="turnCount" 
        :last-move="lastMove"
        :lang="props.lang"
        @highlight-move="(move, persistent) => highlightedCell = move ? { ...move, persistent } : null"
      />

      <div class="board-wrapper">
        <GameBoard 
          :board="board" 
          :selected-tile-color="selectedTileColor"
          :has-star="starOnBoard"
          :highlight-center="waitingForStar"
          :matched-regions="matchedRegions"
          :highlighted-cell="highlightedCell"
          @place="handleBoardClick" 
        />
        
        <div v-show="waitingForStar" class="star-side-float">
          <img src="../assets/star.png" alt="star" />
          <div class="arrow">⬅️</div>
        </div>

        <div v-if="showHelper && helperStats" class="helper-overlay">
          <div class="helper-line">
            {{ gt.handNeeds }}
            <span class="c-r">{{ helperStats.needed.r }}{{ gt.rColor[0] }}</span>
            <span class="c-g">{{ helperStats.needed.g }}{{ gt.gColor[0] }}</span>
            <span class="c-b">{{ helperStats.needed.b }}{{ gt.bColor[0] }}</span>
          </div>
          <div class="helper-line">
            {{ gt.boardDist }}
            <span class="c-r">{{ helperStats.distribution.r }}{{ gt.rColor[0] }}</span>
            <span class="c-g">{{ helperStats.distribution.g }}{{ gt.gColor[0] }}</span>
            <span class="c-b">{{ helperStats.distribution.b }}{{ gt.bColor[0] }}</span>
          </div>
        </div>
        
        <div v-if="showRedrawMessage" class="redraw-overlay">
          <div class="msg">{{ gt.redrawMsg }}</div>
        </div>

        <div v-if="gameOver" class="game-over-overlay">
          <template v-if="props.mode === 'solo'">
            <div class="solo-ending-overlay">
              <h2>{{ gt.decoComplete }}</h2>
              <div class="final-score-row">
                <div class="final-score-item">
                  <span class="label">{{ gt.scoreLabel }}</span>
                  <span class="value">{{ soloScore }}</span>
                </div>
                <div class="final-score-item">
                  <span class="label">{{ gt.turnLabel }}</span>
                  <span class="value">{{ turnCount }}</span>
                </div>
              </div>
              <p class="final-level">{{ soloLevel?.name }}</p>
              <p class="final-desc">{{ soloLevel?.desc }}</p>
              <div class="ending-actions">
                <button @click="startGame">{{ gt.retry }}</button>
                <button @click="showLeaderboardModal = true" class="leaderboard-btn">{{ gt.leaderboard }}</button>
              </div>
            </div>
          </template>
          <template v-else>
            <h2>{{ gt.gameOver }}</h2>
            <p>{{ winner?.name }}{{ gt.winSuffix }}</p>
            <button @click="startGame">{{ gt.restart }}</button>
          </template>
        </div>

        <div v-for="f in scoreFloats" :key="f.id" class="score-float" :style="{ top: (f.r * 33.3 + 16.6) + '%', left: (f.c * 33.3 + 16.6) + '%' }">
          +{{ f.value }}
        </div>
      </div>

      <template v-if="props.mode === 'solo'">
        <img :src="dogBack" class="companion dog" alt="dog" />
        <img :src="catBack" class="companion cat" alt="cat" />
      </template>
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
      :deco-enabled="props.mode === 'solo' || (settings.exquisiteDecoration && settings.playerCount === 2)"
      :selected-deco="selectedDecorationColor"
      @select-deco="(color) => !players[0].isAi && (selectedDecorationColor = color)"
      :can-undo="!players[0].isAi && moveHistory.length > 0"
      @undo="handleUndo"
      :paid-mulligan-enabled="props.paidMulligan"
      :mulligan-tokens-cost="requiredMulliganTokens"
      @request-paid-mulligan="openPaidMulliganModal"
      :difficulty="props.difficulty"
      @surrender="showSurrenderModal = true"
      :show-helper="showHelper"
      @toggle-helper="showHelper = !showHelper"
      :mode="props.mode"
      :lang="props.lang"
    />

    <!-- Modal & Toasts -->
    <div v-if="victoryCeremonyActive" class="modal-overlay">
      <div class="modal">
        <div class="star-icon">⭐</div>
        <template v-if="props.mode === 'solo'">
          <h2>{{ gt.victoryModalTitle }}</h2>
          <p>{{ gt.victoryModalSoloDesc }}</p>
          <button @click="confirmVictoryModal">{{ gt.placeStar }}</button>
        </template>
        <template v-else-if="winner?.isAi">
          <h2 class="elf-win-msg">
            {{ gt.elfWinMsg }}
          </h2>
          <button @click="confirmVictoryModal">{{ gt.placeStar }}</button>
        </template>
        <template v-else>
          <h2>{{ gt.congratulations }} {{ winner?.name }} {{ gt.winSuffix }}</h2>
          <p>{{ gt.victoryModalMultiDesc }}</p>
          <button @click="confirmVictoryModal">{{ gt.placeStar }}</button>
        </template>
      </div>
    </div>

    <div v-if="showToast" class="toast-overlay">
      <div class="toast">{{ gt.toastMessage }}</div>
    </div>

    <div v-if="startToast.show" class="start-toast-overlay">
      <div class="start-toast">{{ startToast.message }}</div>
    </div>

    <!-- Paid Mulligan Modal -->
    <div v-if="showPaidMulliganModal" class="modal-overlay">
      <div class="modal paid-mulligan-modal">
        <h3>{{ gt.selectTokensToConsume }} {{ requiredMulliganTokens }} {{ gt.tokens }}</h3>
        <p>{{ gt.paidMulliganDesc }}</p>
        
        <div class="token-selection-grid">
          <div 
            v-for="color in ['R', 'G', 'B']" 
            :key="color"
            class="token-item"
            :class="{ 
              'selected': selectedTokensForPaidMulligan.filter(c => c === color).length > 0,
              'disabled': players[currentPlayerIndex].decorationUses[color] === 0
            }"
            @click="players[currentPlayerIndex].decorationUses[color] > 0 && toggleTokenSelection(color)"
          >
            <div class="token-circle" :style="{ backgroundColor: 'var(--' + color.toLowerCase() + '-color)' }"></div>
            <span>{{ gt[color.toLowerCase() + 'Color'] }} ({{ selectedTokensForPaidMulligan.filter(c => c === color).length }}/{{ players[currentPlayerIndex].decorationUses[color] }})</span>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="showPaidMulliganModal = false" class="cancel-btn">{{ gt.cancel }}</button>
          <button 
            @click="handlePaidMulligan" 
            :disabled="selectedTokensForPaidMulligan.length !== requiredMulliganTokens"
            class="confirm-btn"
          >
            {{ gt.confirmRedraw }} ({{ selectedTokensForPaidMulligan.length }}/{{ requiredMulliganTokens }})
          </button>
        </div>
      </div>
    </div>

    <!-- Surrender Confirmation Modal -->
    <div v-if="showSurrenderModal" class="modal-overlay" @click.self="showSurrenderModal = false">
      <div class="modal surrender-modal">
        <div class="surrender-icon">{{ props.mode === 'solo' ? '🏁' : '🏳️' }}</div>
        <h3>{{ props.mode === 'solo' ? gt.confirmSoloSurrender : gt.confirmSurrender }}</h3>
        <p>{{ props.mode === 'solo' ? gt.soloSurrenderDesc : gt.surrenderDesc }}</p>
        <div class="modal-actions">
          <button @click="showSurrenderModal = false" class="cancel-btn">{{ gt.cancel }}</button>
          <button @click="confirmSurrender" class="confirm-btn">{{ props.mode === 'solo' ? gt.placeStar : gt.confirmSurrenderBtn }}</button>
        </div>
      </div>
    </div>
    <!-- High Score Name Entry Modal -->
    <div v-if="showHighScoreModal" class="modal-overlay">
      <div class="modal high-score-modal">
        <div class="decor-top">🎄🔔✨</div>
        <h3>{{ gt.highScoreTitle }}</h3>
        <p>{{ gt.enterName }}</p>
        <div class="score-display">{{ soloScore }}</div>
        <input 
          v-model="playerNameInput" 
          maxlength="10" 
          :placeholder="gt.player"
          @keyup.enter="saveHighScore"
        />
        <div class="modal-actions">
          <button @click="saveHighScore" :disabled="!playerNameInput.trim()" class="confirm-btn">{{ gt.submit }}</button>
        </div>
      </div>
    </div>

    <!-- Leaderboard Modal -->
    <div v-if="showLeaderboardModal" class="modal-overlay" @click.self="showLeaderboardModal = false">
      <div class="modal leaderboard-modal">
        <div class="decor-top">🎅🎁🍪</div>
        <button class="close-x" @click="showLeaderboardModal = false">×</button>
        <h3>{{ gt.leaderboardTitle }}</h3>
        <div class="leaderboard-list">
          <div v-for="(record, idx) in topScores" :key="idx" class="ranking-item">
            <div class="rank">{{ idx + 1 }}</div>
            <div class="player-info">
              <div class="name">{{ record.name }}</div>
              <div class="date">{{ record.date }}</div>
            </div>
            <div class="score">{{ record.score }}</div>
          </div>
          <div v-if="topScores.length === 0" class="empty-msg">{{ gt.noRecords }}</div>
        </div>
        <button @click="showLeaderboardModal = false" class="confirm-btn">{{ gt.iSee }}</button>
      </div>
    </div>

    <!-- Solo Rules Modal -->
    <div v-if="showSoloRulesModal" class="modal-overlay" @click.self="showSoloRulesModal = false">
      <div class="modal rules-modal">
        <button class="close-x" @click="showSoloRulesModal = false">×</button>
        <div class="rules-content" v-html="soloRulesHtml"></div>
        <button @click="showSoloRulesModal = false" class="confirm-btn">{{ gt.iSee }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.face-to-face-layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  padding: 6px;
  width: 100%;
  max-width: 800px; /* Increased to accommodate sidebar HUD on desktop */
  position: relative;
  margin: 0 auto; /* Center the layout */
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 6px 10px;
  width: 100%;
  min-height: 60px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.help-btn {
  background: white;
  border: 2px solid #3498db;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.9rem;
  cursor: pointer;
  color: #2980b9;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.help-btn:hover {
  transform: scale(1.05);
  background: #f0f7ff;
}

.back-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #e74c3c;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.9rem;
  cursor: pointer;
  color: #c0392b;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.back-btn:hover {
  transform: scale(1.05);
  background: white;
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
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
  padding: 40px;
  border-radius: 30px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  max-width: 90%;
  border: 4px solid #f1c40f;
}

.elf-win-msg {
  color: #1a472a;
  line-height: 1.6;
  font-size: 1.3rem;
  margin-bottom: 25px;
}

.modal button, .game-over-overlay button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.modal button:hover, .game-over-overlay button:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 10px 25px rgba(231, 76, 60, 0.5);
  background: #ff5e4d;
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

/* Paid Mulligan Modal Styles */
.paid-mulligan-modal {
  width: 90%;
  max-width: 400px;
}

.token-selection-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 25px 0;
}

.token-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.token-item.selected {
  border-color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
}

.token-item.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  filter: grayscale(1);
}

.token-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.cancel-btn {
  flex: 1;
  background: #fdfdfd;
  color: #7f8c8d;
  border: 2px solid #eee;
  padding: 12px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
}

.confirm-btn {
  flex: 2;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.confirm-btn:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.confirm-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.surrender-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.surrender-modal p {
  margin: 15px 0;
  color: #666;
  line-height: 1.5;
}

/* Solo Mode Styles */
.solo-score-hud {
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 15px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 2px solid #27ae60;
  text-align: center;
  min-width: 80px;
}

.score-label {
  font-size: 0.65rem;
  color: #666;
  font-weight: 800;
  letter-spacing: 1px;
}

.score-num {
  font-size: 2.2rem;
  font-weight: 900;
  color: #27ae60;
  line-height: 1;
}

/* Solo Top Stats Area */
.solo-top-stats {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: -10px;
  margin-bottom: 5px;
  z-index: 10;
}

:deep(.solo-embedded-hud) {
  position: relative !important;
  left: 0 !important;
  top: 0 !important;
  transform: none !important;
  flex-direction: row !important;
  gap: 10px !important;
  pointer-events: auto !important;
}

:deep(.solo-embedded-hud .hud-box) {
  padding: 6px 12px !important;
  min-width: 60px !important;
  border-width: 1px !important;
}

:deep(.solo-embedded-hud .value) {
  font-size: 1.5rem !important;
}

:deep(.solo-embedded-hud .label) {
  font-size: 0.6rem !important;
}

.companion {
  position: absolute;
  bottom: 0px;
  width: 120px;
  z-index: 5;
  filter: drop-shadow(0 5px 10px rgba(0,0,0,0.2));
  pointer-events: none;
}

.companion.dog {
  left: -40px;
  bottom: -20px;
  transform: rotate(-5deg);
}

.companion.cat {
  right: -40px;
  bottom: -20px;
  transform: rotate(5deg);
}

@media (max-width: 600px) {
  .companion {
    width: 100px;
  }
  .companion.dog {
    left: -20px;
    bottom: -30px;
  }
  .companion.cat {
    right: -20px;
    bottom: -30px;
  }
}

.score-float {
  position: absolute;
  color: #f1c40f;
  font-size: 2rem;
  font-weight: 900;
  text-shadow: 0 0 10px rgba(0,0,0,0.5);
  pointer-events: none;
  animation: score-up 1s ease-out forwards;
  z-index: 500;
}

@keyframes score-up {
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
  20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
  100% { transform: translate(-50%, -150%) scale(1); opacity: 0; }
}

.solo-ending-overlay {
  text-align: center;
  max-width: 400px;
}

.final-score-row {
  display: flex;
  justify-content: center;
  gap: 80px;
  margin: 20px 0;
}

.final-score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.final-score-item .label {
  font-size: 0.9rem;
  color: #bdc3c7;
  font-weight: 600;
  margin-bottom: 5px;
}

.final-score-item .value {
  font-size: 3.5rem;
  font-weight: 900;
  color: #f1c40f;
  line-height: 1;
}

.final-desc {
  font-size: 1rem;
  color: #ddd;
  margin-bottom: 30px;
  line-height: 1.6;
}

/* Solo Rules Modal Styles */
.rules-modal {
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 30px;
  position: relative;
  text-align: left;
}

.rules-content {
  color: #2c3e50;
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: 25px;
  overflow-y: auto;
  flex: 1;
}

:deep(.rules-content) h3 {
  color: #1a472a;
  border-bottom: 2px solid #27ae60;
  padding-bottom: 8px;
  margin-top: 0;
}

:deep(.rules-content) p, :deep(.rules-content) li {
  color: #34495e;
}

/* Helper Overlay */
.helper-overlay {
  position: absolute;
  top: 105%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255,255,255,0.9);
  padding: 8px 15px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid #ddd;
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 50;
  width: max-content;
}

.helper-line {
  display: flex;
  gap: 8px;
  align-items: center;
}

.c-r { color: #e74c3c; font-weight: 800; }
.c-g { color: #2ecc71; font-weight: 800; }
.c-b { color: #795548; font-weight: 800; }

.close-x {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 2rem;
  color: #95a5a6;
  cursor: pointer;
  line-height: 1;
}

.close-x:hover { color: #e74c3c; }

/* Leaderboard & High Score Styles */
.high-score-modal, .leaderboard-modal {
  border: 6px solid #c0392b;
  background: #fffafa; /* Snow white */
}

.decor-top {
  font-size: 2rem;
  margin-bottom: 10px;
}

.score-display {
  font-size: 4rem;
  font-weight: 900;
  color: #f1c40f;
  margin: 15px 0;
  text-shadow: 2px 2px 0 #c0392b;
}

.high-score-modal input {
  padding: 12px 20px;
  border-radius: 50px;
  border: 2px solid #2ecc71;
  font-size: 1.1rem;
  outline: none;
  text-align: center;
  margin-bottom: 20px;
}

.leaderboard-list {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

.ranking-item .rank {
  font-size: 1.5rem;
  font-weight: 900;
  color: #e74c3c;
  width: 30px;
}

.ranking-item .player-info {
  flex: 1;
  text-align: left;
}

.ranking-item .name {
  font-weight: 800;
  color: #2c3e50;
  font-size: 1.1rem;
}

.ranking-item .date {
  font-size: 0.75rem;
  color: #95a5a6;
}

.ranking-item .score {
  font-size: 1.8rem;
  font-weight: 900;
  color: #2ecc71;
}

.empty-msg {
  color: #7f8c8d;
  padding: 20px;
  font-style: italic;
}

.ending-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.leaderboard-btn {
  background: #3498db !important;
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4) !important;
}

.leaderboard-btn:hover {
  background: #2980b9 !important;
  box-shadow: 0 10px 25px rgba(52, 152, 219, 0.5) !important;
}
</style>
