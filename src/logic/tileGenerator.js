/**
 * 板塊生成器
 * 用於生成所有 24 種在旋轉下唯一的 2x2 圖樣，並根據裝飾顏色進行過濾。
 */

export class TileGenerator {
    static colors = ['R', 'G', 'B'];

    /**
     * 生成所有唯一的圖樣與板塊組合
     * @returns {Array} 包含 { ornamentColor, pattern, patternId } 的陣列
     */
    static generateAllValidTiles() {
        const allPatterns = this.getAllUniquePatterns();
        const finalTiles = [];

        allPatterns.forEach((pattern, index) => {
            // 獲取該圖樣中包含的所有顏色
            const colorsInPattern = new Set();
            pattern.forEach(row => row.forEach(c => colorsInPattern.add(c)));

            // 對於圖樣中的每一種顏色，如果該顏色存在，則可以作為該圖樣的裝飾顏色
            this.colors.forEach(ornamentColor => {
                if(colorsInPattern.has(ornamentColor)) {
                    finalTiles.push({
                        id: `tile-${index}-${ornamentColor}`,
                        ornamentColor,
                        pattern,
                        patternId: index,
                        rotation: 0
                    });
                }
            });
        });

        return finalTiles;
    }

    /**
     * 獲取所有旋轉下唯一的 2x2 圖樣 (應該是 24 種)
     */
    static getAllUniquePatterns() {
        const patterns = [];
        const seenSymmetries = new Set();

        // 遍歷所有 3^4 = 81 種可能的 2x2 組合
        for(let c1 of this.colors) {
            for(let c2 of this.colors) {
                for(let c3 of this.colors) {
                    for(let c4 of this.colors) {
                        const pattern = [
                            [c1, c2],
                            [c3, c4]
                        ];

                        const key = this.getCanonicalKey(pattern);
                        if(!seenSymmetries.has(key)) {
                            seenSymmetries.add(key);
                            patterns.push(pattern);
                        }
                    }
                }
            }
        }

        return patterns;
    }

    /**
     * 獲取圖樣的標準化 Key (旋轉四個角度中最小的字串表示)
     */
    static getCanonicalKey(pattern) {
        let p = pattern;
        let keys = [];

        for(let i = 0; i < 4; i++) {
            keys.push(p.flat().join(''));
            p = this.rotate90(p);
        }

        keys.sort();
        return keys[0];
    }

    static rotate90(pattern) {
        return [
            [pattern[1][0], pattern[0][0]],
            [pattern[1][1], pattern[0][1]]
        ];
    }
}
