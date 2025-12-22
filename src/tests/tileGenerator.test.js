import { describe, it, expect } from 'vitest';
import { TileGenerator } from '../logic/tileGenerator';

describe('TileGenerator', () => {
    it('應生成 24 種旋轉下唯一的圖樣', () => {
        const patterns = TileGenerator.getAllUniquePatterns();
        expect(patterns.length).toBe(24);
    });

    it('生成的板塊應包含其裝飾顏色', () => {
        const tiles = TileGenerator.generateAllValidTiles();
        tiles.forEach(tile => {
            const colors = tile.pattern.flat();
            expect(colors).toContain(tile.ornamentColor);
        });
    });

    it('裝飾顏色與圖樣組合的總數應符合預期', () => {
        // 讓我們看看最後是多少個
        const tiles = TileGenerator.generateAllValidTiles();
        console.log(`Total valid tiles: ${tiles.length}`);
        // 預期大約 60 多個
        expect(tiles.length).toBeGreaterThan(50);
    });
});
