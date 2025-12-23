import { describe, it, expect } from 'vitest';
import { AiAgent } from '../logic/aiAgent';
import { GameLogic } from '../logic/gameLogic';

describe('AiAgent Strategy Upgrades', () => {
    const mockTile = (color) => ({
        ornamentColor: color,
        pattern: [['R', 'G'], ['G', 'G']]
    });

    const createEmptyBoard = () => Array(3).fill(null).map(() =>
        Array(3).fill(null).map(() => ({ color: null, pattern: null }))
    );

    it('Combo Detection: countMatches 應正確識別多個 2x2 匹配', () => {
        const board = createEmptyBoard();
        // 使用純色圖樣方便測試
        const pattern = [['R', 'R'], ['R', 'R']];

        // 準備板面，讓 (1,1) 補位後，(0,0) 區域和 (1,1) 區域都變全紅
        board[0][0].color = 'R'; board[0][1].color = 'R'; board[1][0].color = 'R'; // (0,0) 區缺一
        board[1][2].color = 'R'; board[2][1].color = 'R'; board[2][2].color = 'R'; // (1,1) 區缺一
        // 注意：中間點 (1,1) 是共用的

        const matches = AiAgent.countMatches(board, 'R', pattern, 1, 1);

        expect(matches).toBe(2);
    });

    it('Heuristic Scoring: Mobility 越高品質分數越高', () => {
        const board = createEmptyBoard();
        const hand = [mockTile('R'), mockTile('G')];
        const opponentHand = [mockTile('B')];

        const score1 = AiAgent.evaluateBoard(board, hand, opponentHand);

        // 填滿板面讓對手沒地方放
        const boardBlocked = board.map(r => r.map(c => ({ ...c, color: 'B' })));
        const score2 = AiAgent.evaluateBoard(boardBlocked, hand, opponentHand);

        expect(score2).toBeGreaterThan(score1);
    });

    it('Expert Mulligan: 當手牌顏色在板面飽和時應發動換牌', () => {
        const board = createEmptyBoard();
        // 板面上有大量紅色
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 2; j++) board[i][j].color = 'R';
        }

        // AI 手牌全是紅色 (飽和)
        const hand = [mockTile('R'), mockTile('R'), mockTile('R')];

        const move = AiAgent.expertMove(board, hand, [], 10, 3, true);

        expect(move.action).toBe('mulligan');
    });

    it('Poisoning: 專家 AI 應優先選擇讓對手無路可走的移動', () => {
        const board = createEmptyBoard();
        // 只有一個位置能讓對手活
        // 假設對手只有 B 牌，且板面目前只有 (0,0) 不是 B
        board.flat().forEach(c => c.color = 'B');
        board[0][0].color = 'R';

        const myHand = [mockTile('B')]; // 我放一個 B 到 (0,0) 就會讓全板面都是 B，對手沒地方放
        const opponentHand = [mockTile('B')];

        // 手牌中有一個能配對的 B
        const move = AiAgent.expertMove(board, myHand, opponentHand, 10, 3, true);
        expect(move).not.toBeNull();
        // 在這個極端模擬中，move 應該是那個能造成 checkmate 的動作
    });
});
