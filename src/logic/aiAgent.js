import { GameLogic } from './gameLogic';

export class AiAgent {
    static difficulties = {
        BEGINNER: 'beginner',
        NORMAL: 'normal',
        HARD: 'hard',
        EXPERT: 'expert'
    };

    /**
     * Compute the best move based on difficulty
     */
    static computeMove(gameState, difficulty) {
        const { board, hand, opponentHand, deckSize, decorationUses, isExquisiteMode } = gameState;

        switch(difficulty) {
            case this.difficulties.EXPERT:
                return this.expertMove(board, hand, opponentHand, deckSize, decorationUses, isExquisiteMode);
            case this.difficulties.HARD:
                return this.hardMove(board, hand, opponentHand, decorationUses, isExquisiteMode);
            case this.difficulties.NORMAL:
                return this.normalMove(board, hand, opponentHand, decorationUses, isExquisiteMode);
            case this.difficulties.BEGINNER:
            default:
                return this.beginnerMove(board, hand);
        }
    }

    /**
     * DIFFICULTY 1 — BEGINNER AI
     * Highly reactive, random selection.
     */
    static beginnerMove(board, hand) {
        const legalMoves = this.getAllLegalMoves(board, hand);
        const matchingMoves = legalMoves.filter(m => m.hasMatch);

        if(matchingMoves.length > 0) {
            // Select random matching move
            return matchingMoves[Math.floor(Math.random() * matchingMoves.length)];
        }

        // If no matching moves, return null to signify it can't match now
        // The GameView will handle whether it tries another card or concedes.
        return null;
    }

    /**
     * DIFFICULTY 2 — NORMAL AI
     * Stable, plays defensively, prioritizes combos and center.
     */
    static normalMove(board, hand, opponentHand, decorationUses, isExquisiteMode) {
        const legalMoves = this.getAllLegalMoves(board, hand);
        const successfulMoves = legalMoves.filter(m => m.hasMatch);

        if(successfulMoves.length === 0) return null;

        const scoredMoves = successfulMoves.map(move => {
            let score = 10;

            // Combo detection (Normal & Above)
            const matches = this.countMatches(board, move.tile.ornamentColor, GameLogic.rotatePatternTimes(move.tile.pattern, move.rotation), move.row, move.col);
            if(matches >= 2) score += 20;

            // Center priority
            if(move.row === 1 && move.col === 1) score += 5;

            // Basic safety check: don't leave opponent with too many options
            const simulatedBoard = this.simulatePlacement(board, move);
            const opMoves = this.countViableMoves(simulatedBoard, opponentHand);
            score -= opMoves * 2;

            return { ...move, score };
        });

        scoredMoves.sort((a, b) => b.score - a.score);
        return scoredMoves[0];
    }

    /**
     * DIFFICULTY 3 — HARD AI
     * Actively blocks and constrains opponent using evaluation.
     */
    static hardMove(board, hand, opponentHand, decorationUses, isExquisiteMode) {
        const legalMoves = this.getAllLegalMoves(board, hand);
        const successfulMoves = legalMoves.filter(m => m.hasMatch);

        if(successfulMoves.length === 0) {
            return this.findSetupMove(board, hand);
        }

        const scoredMoves = successfulMoves.map(move => {
            const simulatedBoard = this.simulatePlacement(board, move);
            // 1-PLY evaluate for self
            let score = this.evaluateBoard(simulatedBoard, hand, opponentHand);

            // Bonus for survival
            score += 100;

            return { ...move, score };
        });

        scoredMoves.sort((a, b) => b.score - a.score);
        return scoredMoves[0];
    }

    /**
     * DIFFICULTY 4 — EXPERT AI
     * Ruthless, perfect-information, with aggressive mulligan.
     */
    static expertMove(board, hand, opponentHand, deckSize, decorationUses, isExquisiteMode) {
        const legalMoves = this.getAllLegalMoves(board, hand);
        const successfulMoves = legalMoves.filter(m => m.hasMatch);

        // 1. Aggressive Mulligan (Expert Only)
        // If we have tokens and few matching moves, OR hand colors are saturated on board
        if(decorationUses > 0 && deckSize > 0) {
            const boardColors = GameLogic.getColorDistribution(board);
            const saturatedHand = hand.filter(t => (boardColors[t.ornamentColor] || 0) >= 4);

            if(successfulMoves.length <= 1 || saturatedHand.length >= 2) {
                return { action: 'mulligan' };
            }
        }

        if(successfulMoves.length === 0) {
            const setup = this.findSetupMove(board, hand);
            if(setup) return setup;
            // If even setup is impossible, try a desperation mulligan if we didn't already
            if(decorationUses > 0 && deckSize > 0) return { action: 'mulligan' };
            return null;
        }

        // 2. Search & Poisoning
        const scoredMoves = successfulMoves.map(move => {
            const simulatedBoard = this.simulatePlacement(board, move);
            const opMoves = this.getAllLegalMoves(simulatedBoard, opponentHand).filter(m => m.hasMatch);

            let score = this.evaluateBoard(simulatedBoard, hand, opponentHand);

            // Checkmate detection (Poisoning / Win)
            if(opMoves.length === 0) score += 1000;

            // Combo bonus
            const matches = this.countMatches(board, move.tile.ornamentColor, GameLogic.rotatePatternTimes(move.tile.pattern, move.rotation), move.row, move.col);
            if(matches >= 2) score += 50;

            return { ...move, score };
        });

        scoredMoves.sort((a, b) => b.score - a.score);
        return scoredMoves[0];
    }

    // --- Helper Methods ---

    /**
     * Heuristic evaluation of the board state
     * Higher score = better for current player
     */
    static evaluateBoard(board, hand, opponentHand) {
        let score = 0;

        // 1. Mobility (40%)
        const myMoves = this.getAllLegalMoves(board, hand).filter(m => m.hasMatch).length;
        const opMoves = this.getAllLegalMoves(board, opponentHand).filter(m => m.hasMatch).length;
        score += (myMoves - opMoves) * 10;

        // 2. Potential Matches (30%)
        hand.forEach(tile => {
            for(let rot = 0; rot < 4; rot++) {
                const rotatedPattern = GameLogic.rotatePatternTimes(tile.pattern, rot);
                score += GameLogic.countPotentialMatches(board, rotatedPattern) * 5;
            }
        });

        // 3. Color Entropy (20%)
        const dist = GameLogic.getColorDistribution(board);
        const colors = Object.values(dist);
        const entropy = colors.length > 0 ? colors.reduce((acc, count) => acc + (count / 9) * Math.log2(count / 9), 0) : 0;
        score -= entropy * 20; // Lower entropy means more clusters, which is usually bad

        // 4. Center Control (10%)
        if(board[1][1].color) score += 5;

        return score;
    }

    /**
     * Check how many 2x2 regions are matched by a move
     */
    static countMatches(board, ornamentColor, pattern, row, col) {
        let count = 0;
        const newBoard = board.map(r => r.map(c => typeof c === 'string' ? c : c.color));
        newBoard[row][col] = ornamentColor;

        const potentialRegions = [
            { r: row - 1, c: col - 1 },
            { r: row - 1, c: col },
            { r: row, c: col - 1 },
            { r: row, c: col }
        ];

        for(const region of potentialRegions) {
            if(GameLogic.isMatch(newBoard, pattern, region.r, region.c)) {
                count++;
            }
        }
        return count;
    }

    /**
     * Find a "Setup" move when no immediate match is possible.
     * Looks for a tile that completes a "near-match" for another tile in hand.
     */
    /**
     * Find a "Setup" move when no immediate match is possible.
     * Looks for a tile that completes a "near-match" for another tile in hand.
     */
    static findSetupMove(board, hand) {
        if(hand.length < 2) return null;

        for(let targetIdx = 0; targetIdx < hand.length; targetIdx++) {
            const target = hand[targetIdx];
            const othersIndices = hand.map((_, i) => i).filter(i => i !== targetIdx);

            // Scan all possible 2x2 regions
            for(let r = 0; r <= 1; r++) {
                for(let c = 0; c <= 1; c++) {
                    // Scan all 4 rotations for the target
                    for(let rot = 0; rot < 4; rot++) {
                        const pattern = GameLogic.rotatePatternTimes(target.pattern, rot);

                        // A target tile can be placed in any of the 4 cells of the 2x2 region
                        for(let tr = 0; tr < 2; tr++) {
                            for(let tc = 0; tc < 2; tc++) {
                                // 1. Target tile MUST be able to complete its part of the pattern
                                if(target.ornamentColor !== pattern[tr][tc]) continue;

                                // 2. Placement must be legal (different color than current board)
                                const targetRow = r + tr;
                                const targetCol = c + tc;
                                const currentTColor = typeof board[targetRow][targetCol] === 'string' ? board[targetRow][targetCol] : board[targetRow][targetCol].color;
                                if(target.ornamentColor === currentTColor) continue;

                                // 3. Find other mismatches in this 2x2 region
                                const otherMismatches = [];
                                for(let i = 0; i < 2; i++) {
                                    for(let j = 0; j < 2; j++) {
                                        if(i === tr && j === tc) continue; // Skip the target's cell
                                        const bColor = typeof board[r + i][c + j] === 'string' ? board[r + i][c + j] : board[r + i][c + j].color;
                                        if(bColor !== pattern[i][j]) {
                                            otherMismatches.push({ row: r + i, col: c + j, neededColor: pattern[i][j] });
                                        }
                                    }
                                }

                                // 4. Check if we have enough tiles to fix the other mismatches
                                if(otherMismatches.length > 0 && otherMismatches.length < hand.length) {
                                    let availableIndices = [...othersIndices];
                                    const setupSequence = [];
                                    let pathPossible = true;

                                    for(const m of otherMismatches) {
                                        const foundIdx = availableIndices.find(idx => {
                                            const tile = hand[idx];
                                            const boardColor = typeof board[m.row][m.col] === 'string' ? board[m.row][m.col] : board[m.row][m.col].color;
                                            return tile.ornamentColor === m.neededColor && boardColor !== tile.ornamentColor;
                                        });

                                        if(foundIdx !== undefined) {
                                            setupSequence.push({
                                                tileIndex: foundIdx,
                                                row: m.row,
                                                col: m.col,
                                                rotation: 0,
                                                tile: hand[foundIdx],
                                                isSetup: true
                                            });
                                            availableIndices = availableIndices.filter(i => i !== foundIdx);
                                        } else {
                                            pathPossible = false;
                                            break;
                                        }
                                    }

                                    if(pathPossible && setupSequence.length > 0) {
                                        return setupSequence[0];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return null;
    }

    static getAllLegalMoves(board, hand) {
        const moves = [];
        hand.forEach((tile, tileIndex) => {
            for(let r = 0; r < 3; r++) {
                for(let c = 0; c < 3; c++) {
                    const boardColor = typeof board[r][c] === 'string' ? board[r][c] : board[r][c].color;
                    // Restriction: current color != tile ornament color
                    if(boardColor !== tile.ornamentColor) {
                        // Check all 4 rotations
                        for(let rot = 0; rot < 4; rot++) {
                            const rotatedPattern = GameLogic.rotatePatternTimes(tile.pattern, rot);
                            const hasMatch = GameLogic.checkSurvival(board, tile.ornamentColor, rotatedPattern, r, c);
                            moves.push({
                                tileIndex,
                                row: r,
                                col: c,
                                rotation: rot,
                                tile,
                                hasMatch
                            });
                        }
                    }
                }
            }
        });
        return moves;
    }

    static countViableMoves(board, hand) {
        return hand.filter(tile => {
            for(let r = 0; r < 3; r++) {
                for(let c = 0; c < 3; c++) {
                    const boardColor = typeof board[r][c] === 'string' ? board[r][c] : board[r][c].color;
                    if(boardColor !== tile.ornamentColor) {
                        for(let rot = 0; rot < 4; rot++) {
                            const rotatedPattern = GameLogic.rotatePatternTimes(tile.pattern, rot);
                            if(GameLogic.checkSurvival(board, tile.ornamentColor, rotatedPattern, r, c)) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }).length;
    }

    static countOpponentViablePlacements(board, move, opponentColors) {
        const newBoard = this.simulatePlacement(board, move);
        let count = 0;
        for(let r = 0; r < 3; r++) {
            for(let c = 0; c < 3; c++) {
                if(opponentColors.has(newBoard[r][c].color)) count++;
            }
        }
        return count;
    }

    static calculateObstruction(board, opponentHand) {
        // How many placements did this move just kill for the opponent?
        return 0; // Simplified for now
    }

    static simulatePlacement(board, move) {
        const newBoard = board.map(r => r.map(c => ({ ...c })));
        const cell = newBoard[move.row][move.col];
        cell.color = move.tile.ornamentColor;
        cell.pattern = move.tile.pattern;
        cell.rotation = move.rotation;
        return newBoard;
    }

    static isCenter(move) {
        return move.row === 1 && move.col === 1 ? 1 : 0;
    }

    static fallback(legalMoves) {
        return legalMoves.length > 0 ? legalMoves[Math.floor(Math.random() * legalMoves.length)] : null;
    }
}
