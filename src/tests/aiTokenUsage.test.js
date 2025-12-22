import { describe, it, expect, vi } from 'vitest';

/**
 * 模擬 AI 使用指示物的邏輯 (抽取自 GameView.vue 的邏輯)
 * 規則：只要補牌後不會超過手牌上限，且有對應顏色的精心指示物，就自動使用。
 */
function simulateAiTokenUsage(player, tilePlaced, drawCount, handLimit) {
    const decoEnabled = true; // 簡化：假設已啟用精心裝飾模式

    if(decoEnabled) {
        // 檢查是否有對應顏色的指示物
        if(player.decorationUses[tilePlaced.ornamentColor]) {
            // 檢查補牌後是否超過上限
            if(player.hand.length + drawCount < handLimit) {
                player.decorationUses[tilePlaced.ornamentColor] = false; // 消耗
                drawCount++;
            }
        }
    }

    return { drawCount, decorationUses: player.decorationUses };
}

describe('AI Token Usage Logic', () => {
    it('當手牌補牌後不會超過上限時，應自動使用指示物', () => {
        const player = {
            hand: [{}, {}], // 手上剩 2 張 (出完 1 張後)
            decorationUses: { 'R': true, 'G': true, 'B': true }
        };
        const tilePlaced = { ornamentColor: 'R' };
        const initialDrawCount = 1;
        const handLimit = 4; // 大手牌模式

        const result = simulateAiTokenUsage(player, tilePlaced, initialDrawCount, handLimit);

        // 預期結果：消耗了 R 指示物，補牌數變 2
        expect(result.drawCount).toBe(2);
        expect(result.decorationUses['R']).toBe(false);
    });

    it('當補牌後會達到上限時，應能使用指示物 (補到滿為止)', () => {
        const player = {
            hand: [{}, {}], // 手上剩 2 張
            decorationUses: { 'G': true }
        };
        const tilePlaced = { ornamentColor: 'G' };
        const initialDrawCount = 1;
        const handLimit = 4;

        // 手手(2) + 預計抽(1) = 3。3 < 4，所以可以使用指示物變成抽 2 張，最後手牌變 4 張。
        const result = simulateAiTokenUsage(player, tilePlaced, initialDrawCount, handLimit);

        expect(result.drawCount).toBe(2);
        expect(result.decorationUses['G']).toBe(false);
    });

    it('當補完基本牌後已達上限，則不應使用指示物', () => {
        const player = {
            hand: [{}, {}, {}], // 手上剩 3 張
            decorationUses: { 'B': true }
        };
        const tilePlaced = { ornamentColor: 'B' };
        const initialDrawCount = 1;
        const handLimit = 4;

        // 手手(3) + 基本抽(1) = 4。4 不小於 4，不應再抽。
        const result = simulateAiTokenUsage(player, tilePlaced, initialDrawCount, handLimit);

        expect(result.drawCount).toBe(1);
        expect(result.decorationUses['B']).toBe(true);
    });

    it('若指示物已耗盡，則不應執行使用邏輯', () => {
        const player = {
            hand: [{}],
            decorationUses: { 'R': false }
        };
        const tilePlaced = { ornamentColor: 'R' };
        const initialDrawCount = 1;
        const handLimit = 4;

        const result = simulateAiTokenUsage(player, tilePlaced, initialDrawCount, handLimit);

        expect(result.drawCount).toBe(1);
        expect(result.decorationUses['R']).toBe(false); // 維持 false
    });
});
