/**
 * 聖誕板塊遊戲核心邏輯
 * 
 * 規則重點：
 * 1. 3x3 板面 (Board)
 * 2. 1x1 板塊 (Tile) 帶有 2x2 圖樣 (Pattern)
 * 3. 放置後必須至少達成一個 2x2 區域匹配，否則淘汰。
 */

export class GameLogic {
    /**
     * 檢查放置是否符合生存規則
     * @param {string[][]} board - 當前 3x3 板面顏色 [['R', 'G', 'B'], ...]
     * @param {string} ornamentColor - 剛放下去的板塊裝飾顏色
     * @param {string[][]} pattern - 板塊攜帶的 2x2 目標圖樣 [['R', 'G'], ['G', 'G']]
     * @param {number} row - 放置行 (0-2)
     * @param {number} col - 放置列 (0-2)
     * @returns {boolean} - 是否至少達成一個 2x2 匹配
     */
    static checkSurvival(board, ornamentColor, pattern, row, col) {
        return !!this.findMatchingRegion(board, ornamentColor, pattern, row, col);
    }

    /**
     * 尋找並返回匹配的 2x2 區域左上角座標
     * @returns {Object|null} { r, c } 或 null
     */
    static findMatchingRegion(board, ornamentColor, pattern, row, col) {
        const matches = this.findAllMatchingRegions(board, ornamentColor, pattern, row, col);
        return matches.length > 0 ? matches[0] : null;
    }

    /**
     * 尋找並返回「所有」匹配的 2x2 區域左上角座標
     * @returns {Array} [{ r, c }, ...]
     */
    static findAllMatchingRegions(board, ornamentColor, pattern, row, col) {
        // 預先模擬放置後的板面
        const newBoard = board.map(r => r.map(c => typeof c === 'string' ? c : c.color));
        newBoard[row][col] = ornamentColor;

        const potentialRegions = [
            { r: row - 1, c: col - 1 },
            { r: row - 1, c: col },
            { r: row, c: col - 1 },
            { r: row, c: col }
        ];

        const matches = [];
        for(const region of potentialRegions) {
            if(this.isMatch(newBoard, pattern, region.r, region.c)) {
                matches.push(region);
            }
        }

        return matches;
    }

    /**
     * 檢查特定 2x2 區域是否符合圖樣
     */
    static isMatch(board, pattern, startR, startC) {
        // 檢查邊界
        if(startR < 0 || startC < 0 || startR > 1 || startC > 1) return false;

        for(let i = 0; i < 2; i++) {
            for(let j = 0; j < 2; j++) {
                if(board[startR + i][startC + j] !== pattern[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 旋轉 2x2 圖樣 (順時針 90 度)
     */
    static rotatePattern(pattern) {
        return [
            [pattern[1][0], pattern[0][0]],
            [pattern[1][1], pattern[0][1]]
        ];
    }

    /**
     * 統計一個圖樣在板面上「差一格就匹配」的區域數量
     */
    static countPotentialMatches(board, pattern) {
        let count = 0;
        const newBoard = board.map(r => r.map(c => typeof c === 'string' ? c : c.color));

        for(let r = 0; r <= 1; r++) {
            for(let c = 0; c <= 1; c++) {
                let mismatches = 0;
                for(let i = 0; i < 2; i++) {
                    for(let j = 0; j < 2; j++) {
                        if(newBoard[r + i][c + j] !== pattern[i][j]) {
                            mismatches++;
                        }
                    }
                }
                if(mismatches === 1) count++;
            }
        }
        return count;
    }

    /**
     * 獲取目前板面的顏色分佈
     */
    static getColorDistribution(board) {
        const distribution = {};
        board.flat().forEach(cell => {
            const color = typeof cell === 'string' ? cell : cell.color;
            distribution[color] = (distribution[color] || 0) + 1;
        });
        return distribution;
    }

    static rotatePatternTimes(pattern, times) {
        let result = pattern;
        for(let i = 0; i < times % 4; i++) {
            result = this.rotatePattern(result);
        }
        return result;
    }
}
