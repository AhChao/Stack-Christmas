import { describe, it, expect } from 'vitest';
import { GameLogic } from '../logic/gameLogic';

describe('GameLogic', () => {
    const initialBoard = [
        ['R', 'G', 'B'],
        ['B', 'R', 'G'],
        ['G', 'B', 'R']
    ];

    it('應能正確判定 2x2 匹配 (isMatch)', () => {
        const pattern = [
            ['R', 'G'],
            ['B', 'R']
        ];
        // 從 (0,0) 開始的 2x2 剛好符合上述 pattern
        expect(GameLogic.isMatch(initialBoard, pattern, 0, 0)).toBe(true);

        // 從 (0,1) 開始的 2x2 是 ['G', 'B'], ['R', 'G']，不符合
        expect(GameLogic.isMatch(initialBoard, pattern, 0, 1)).toBe(false);
    });

    it('應能正確判定旋轉 (rotatePattern)', () => {
        const pattern = [
            ['R', 'G'],
            ['B', 'B']
        ];
        const rotated = GameLogic.rotatePattern(pattern);
        // 順時針 90:
        // [B, R]
        // [B, G]
        expect(rotated).toEqual([
            ['B', 'R'],
            ['B', 'G']
        ]);
    });

    it('應在放置板塊後達成匹配時生存 (checkSurvival)', () => {
        // 假設板面 (1,1) 是 'R'。我們放一個 'B' 板塊到 (1,1)。
        // 現在 (1,1) 變成 'B'。
        // 板面會變成：
        // [R, G, B]
        // [B, B, G]
        // [G, B, R]
        // 我們給一個匹配 (1,1) 為 'B' 的 2x2 圖樣，例如：
        // [G, B] (來自 0,1 和 0,2) -> 不對，座標不對。

        // 考慮 (0,0) 開始的 2x2: [R, G], [B, B]
        const pattern = [
            ['R', 'G'],
            ['B', 'B']
        ];
        // 我們把 (1,1) 從 'R' 改成 'B'，應該讓 (0,0) 開始的 2x2 符合
        expect(GameLogic.checkSurvival(initialBoard, 'B', pattern, 1, 1)).toBe(true);
    });

    it('應在放置板塊後無法達成匹配時淘汰', () => {
        const pattern = [
            ['X', 'X'],
            ['X', 'X']
        ];
        expect(GameLogic.checkSurvival(initialBoard, 'R', pattern, 0, 0)).toBe(false);
    });

    it('應能正確尋找所有匹配區域 (findAllMatchingRegions)', () => {
        // 設定一個板面，使得在 (1,1) 放置 'R' 可以同時達成兩個匹配
        // 圖樣定為 [[R, R], [R, R]]
        const board = [
            ['R', 'R', 'R'],
            ['R', 'G', 'R'],
            ['B', 'B', 'B']
        ];
        const pattern = [
            ['R', 'R'],
            ['R', 'R']
        ];
        // 放置後 (1,1) 變 R，左上(0,0) 與 右上(0,1) 的 2x2 都會變成全 R
        const matches = GameLogic.findAllMatchingRegions(board, 'R', pattern, 1, 1);
        expect(matches.length).toBe(2);
        expect(matches).toContainEqual({ r: 0, c: 0 });
        expect(matches).toContainEqual({ r: 0, c: 1 });
    });
});
