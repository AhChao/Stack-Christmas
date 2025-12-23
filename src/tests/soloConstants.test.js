
import { describe, it, expect } from 'vitest';
import { getSoloLevel, SOLO_BOARDS, SOLO_LEVELS_ZH } from '../logic/soloConstants';

describe('Solo Constants & Logic', () => {

    it('SOLO_BOARDS 應該是 3x3 的矩陣', () => {
        SOLO_BOARDS.forEach(board => {
            expect(board.length).toBe(3);
            board.forEach(row => {
                expect(row.length).toBe(3);
                // Should be strings
                row.forEach(cell => expect(typeof cell).toBe('string'));
            });
        });
    });

    it('getSoloLevel 應根據分數返回正確評價', () => {
        // Thresholds: 31, 21, 13, 6, 0 (descending)

        expect(getSoloLevel(35).threshold).toBe(31);
        expect(getSoloLevel(31).threshold).toBe(31);

        expect(getSoloLevel(25).threshold).toBe(21);

        expect(getSoloLevel(15).threshold).toBe(13);

        expect(getSoloLevel(10).threshold).toBe(6);

        expect(getSoloLevel(5).threshold).toBe(0);
        expect(getSoloLevel(0).threshold).toBe(0);
    });

    it('SOLO_LEVELS_ZH 應包含所有等級', () => {
        expect(SOLO_LEVELS_ZH.length).toBeGreaterThan(0);
        SOLO_LEVELS_ZH.forEach(level => {
            expect(level).toHaveProperty('name');
            expect(level).toHaveProperty('desc');
            expect(level).toHaveProperty('threshold');
        });
    });
});
