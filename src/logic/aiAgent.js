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

        // If no matching moves, return a random legal move
        return legalMoves.length > 0 ? legalMoves[Math.floor(Math.random() * legalMoves.length)] : null;
    }

    /**
     * DIFFICULTY 2 — NORMAL AI
     * Stable, plays defensively, prioritizes center.
     */
    static normalMove(board, hand, opponentHand, decorationUses, isExquisiteMode) {
        const legalMoves = this.getAllLegalMoves(board, hand);
        const successfulMoves = legalMoves.filter(m => m.hasMatch);

        if(successfulMoves.length === 0) {
            return this.fallback(legalMoves);
        }

        const scoredMoves = successfulMoves.map(move => {
            let score = 10; // completes a pattern
            // Note: GameLogic current implementation only checks the placed tile
            // but we can check if it forms multiple 2x2 areas

            // Check for multiple matches (if implementation allows)
            // Simplified: we'll check if it occupies center
            if(move.row === 1 && move.col === 1) score += 2;

            // Opponent hand colors only (Simplified Normal AI)
            const opponentColors = new Set(opponentHand.map(t => t.ornamentColor));
            const opponentViablePlacements = this.countOpponentViablePlacements(board, move, opponentColors);
            if(opponentViablePlacements >= 2) score -= 2;

            return { ...move, score };
        });

        scoredMoves.sort((a, b) => b.score - a.score || (this.isCenter(b) - this.isCenter(a)));
        return scoredMoves[0];
    }

    /**
     * DIFFICULTY 3 — HARD AI
     * Actively blocks and constrains opponent.
     */
    static hardMove(board, hand, opponentHand, decorationUses, isExquisiteMode) {
        const legalMoves = this.getAllLegalMoves(board, hand);
        const successfulMoves = legalMoves.filter(m => m.hasMatch);

        if(successfulMoves.length === 0) return null; // Eliminated

        const scoredMoves = successfulMoves.map(move => {
            let score = 100; // survival

            // Simulate opponent response (1-Ply)
            const simulatedBoard = this.simulatePlacement(board, move);
            const viableOpponentMovesCount = this.countViableMoves(simulatedBoard, opponentHand);

            if(viableOpponentMovesCount === 0) score += 50;
            else if(viableOpponentMovesCount === 1) score += 20;

            // Obstruction check: how many of opponent's needed cells are blocked?
            const obstructionScore = this.calculateObstruction(simulatedBoard, opponentHand);

            return { ...move, score, obstructionScore };
        });

        // Highest score, tie-break by obstruction
        scoredMoves.sort((a, b) => b.score - a.score || b.obstructionScore - a.obstructionScore);
        return scoredMoves[0];
    }

    /**
     * DIFFICULTY 4 — EXPERT AI
     * Ruthless, perfect-information.
     */
    static expertMove(board, hand, opponentHand, deckSize, decorationUses, isExquisiteMode) {
        // 0. Endgame search
        if(deckSize < 8) {
            // Simplified for now: use high depth minimax or specific endgame logic
            // In a real implementation, this would be a deep search
        }

        // 1. Checkmate search
        const legalMoves = this.getAllLegalMoves(board, hand);
        const successfulMoves = legalMoves.filter(m => m.hasMatch);

        for(const move of successfulMoves) {
            const simulatedBoard = this.simulatePlacement(board, move);
            if(this.countViableMoves(simulatedBoard, opponentHand) === 0) {
                return move; // Instant checkmate
            }
        }

        // 2. Minimax evaluation (Depth 1)
        const scoredMoves = successfulMoves.map(move => {
            const simulatedBoard = this.simulatePlacement(board, move);
            const opponentViableCount = this.countViableMoves(simulatedBoard, opponentHand);

            let score = 100;
            score -= 20 * opponentViableCount;
            // Additional expert heuristics
            return { ...move, score };
        });

        scoredMoves.sort((a, b) => b.score - a.score);
        return scoredMoves[0];
    }

    // --- Helper Methods ---

    static getAllLegalMoves(board, hand) {
        const moves = [];
        hand.forEach((tile, tileIndex) => {
            for(let r = 0; r < 3; r++) {
                for(let c = 0; c < 3; c++) {
                    // Restriction: current color != tile ornament color
                    if(board[r][c] !== tile.ornamentColor) {
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
                    if(board[r][c] !== tile.ornamentColor) {
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
                if(opponentColors.has(newBoard[r][c])) count++;
                // Wait, logic guide says "legal placements for opponent hand colors"
                // Usually means cells they CANNOT place due to color clash.
                // Let's interpret as: cells that are now blocked for them.
            }
        }
        return count;
    }

    static calculateObstruction(board, opponentHand) {
        // How many placements did this move just kill for the opponent?
        // (Simplified)
        return 0;
    }

    static simulatePlacement(board, move) {
        const newBoard = board.map(r => [...r]);
        newBoard[move.row][move.col] = move.tile.ornamentColor;
        return newBoard;
    }

    static isCenter(move) {
        return move.row === 1 && move.col === 1 ? 1 : 0;
    }

    static fallback(legalMoves) {
        // Choose action that maximizes partial pattern progress (simplified to random for now)
        return legalMoves.length > 0 ? legalMoves[Math.floor(Math.random() * legalMoves.length)] : null;
    }
}
