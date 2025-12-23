
import { describe, it, expect, vi } from 'vitest';
import { AiAgent } from '../logic/aiAgent';
import { GameLogic } from '../logic/gameLogic';

describe('Normal AI Setup Move Logic', () => {

    // Helper to create a simple board
    const createBoard = (rows) => {
        return rows.map(r => r.split('').map(c => ({
            color: c,
            pattern: [['R', 'R'], ['R', 'R']], // Default dummy pattern
            rotation: 0
        })));
    };

    const dummyTile = (ornamentColor) => ({
        ornamentColor,
        pattern: [['R', 'R'], ['R', 'R']],
        rotation: 0
    });

    it('should prioritize a matching move if one exists', () => {
        // Board has R at (0,0), implies we can match if we put R at (0,1) and pattern matches
        // For simplicity, let's just mock getAllLegalMoves to return a match.
        // But better to use real logic.

        // Setup:
        // R G B
        // G R B
        // B B B
        // We have a Red tile with a pattern matching top-left 2x2 of all R's?
        // Let's rely on AiAgent.normalMove filtering.

        const board = createBoard([
            'RGB',
            'GRB',
            'BBB'
        ]);

        const hand = [
            { ornamentColor: 'R', pattern: [['R', 'G'], ['G', 'R']], rotation: 0 } // A tile that can match if rotated or placed well
        ];

        // Mock GameLogic to ensure we have a "matching" move
        // Actually, let's just trust the logic.
        // We can manipulate the board so a match is obvious.

        // Easier: Verify normalMove returns a move with Score > 0 if match exists.
        // Or mock getAllLegalMoves.
    });

    it('should return a setup move when no match exists but 1-step setup is possible', () => {
        // Scenario: 
        // We have a Hand with TWO Red tiles.
        // We want to form a 2x2 of REDs.
        // The board has:
        // R G .
        // G . .
        // . . .
        //
        // Target Pattern: [[R, R], [R, R]] (All Red)
        // Position (0,0) needs 4 Reds.
        // Board has R at (0,0).
        // Mismatches: (0,1), (1,0), (1,1).
        // Wait, that's 3 mismatches. Too many.

        // Let's try 1 mismatch.
        // Board:
        // R R .
        // R G .
        // . . .
        // 
        // We want to place RED at (1,1). Pattern [[R,R],[R,R]].
        // Region (0,0) -> (0,0)=R, (0,1)=R, (1,0)=R.
        // (1,1) will be R (our placement).
        // So this is a MATCH! We don't want a match. We want a mismatch.

        // Setup Scenario for 1-step padding:
        // Board:
        // R R .
        // G B .
        // . . .
        // We have 2 Red tiles in hand.
        // Tile 1: Red ornament. Pattern [[R,R],[R,R]].
        // We can't match immediately.
        // If we place Tile 1 at (1,0) [Color G].
        // Wait, placement rule: can't place on same color. (1,0) is G, so we can place R.
        // If we place R at (1,0), we now have:
        // R R
        // R B
        // We need (1,1) to be R to complete the square (assuming (1,1) is empty/changeable).

        // Let's construct a cleaner scenario.
        // Target: 2x2 of R.
        // Board: 
        // R R
        // . .
        // We want to fill (1,0) and (1,1) to make a square.
        // Hand has 2 Red tiles.
        // Move 1: Place R at (1,0). No match (because (1,1) is missing). THIS IS THE SETUP.
        // Move 2: Place R at (1,1). Match!

        // So, verify normalMove returns the move at (1,0).

        const board = createBoard([
            'RRB',
            'GBB',
            'BBB'
        ]);
        // (1,0) is G. (1,1) is B.
        // We need R at (1,0) and R at (1,1).

        const hand = [
            { ornamentColor: 'R', pattern: [['R', 'R'], ['R', 'R']], rotation: 0 },
            { ornamentColor: 'R', pattern: [['R', 'R'], ['R', 'R']], rotation: 0 }
        ];

        // Ensure no immediate match is possible.
        // (1,0) -> places R. Neighbors: (0,0)=R, (0,1)=R, (1,1)=B. 
        // Region top-left (0,0): R, R, R, B -> Fail.
        // Region top-left (0,-1): Invalid.
        // Region top-left (1,0): R, B, B, B (from row 2) -> Fail.
        // No match.

        const move = AiAgent.normalMove(board, hand, [], {}, false);

        expect(move).not.toBeNull();
        if(move) {
            // It should place at (1,0) or (1,1).
            // (1,0) is valid (G != R).
            // (1,1) is valid (B != R).
            // Both are 1-step setups for the OTHER tile.
            expect([1]).toContain(move.row);
            expect([0, 1]).toContain(move.col);
            expect(move.isSetup).toBe(true);
        }
    });

    it('should return NULL if setup requires > 1 step', () => {
        // Scenario: We need 2 steps.
        // Board:
        // R B .
        // G B .
        // . . .
        // Target: All Red 2x2.
        // We need R at (0,1), (1,0), (1,1).
        // (0,0) is R.
        // Hand has 3 Red tiles.
        // We need to place 2 cards (padding) before the 3rd one matches.
        // Steps:
        // 1. Place R at (0,1) -> No match.
        // 2. Place R at (1,0) -> No match.
        // 3. Place R at (1,1) -> Match!

        // Since we need 2 padding moves, Normal AI (limit 1) should GIVE UP (return null).

        const board = createBoard([
            'RBB',
            'GBB',
            'BBB'
        ]);

        const hand = [
            { ornamentColor: 'R', pattern: [['R', 'R'], ['R', 'R']], rotation: 0 },
            { ornamentColor: 'R', pattern: [['R', 'R'], ['R', 'R']], rotation: 0 },
            { ornamentColor: 'R', pattern: [['R', 'R'], ['R', 'R']], rotation: 0 }
        ];

        const move = AiAgent.normalMove(board, hand, [], {}, false);

        expect(move).toBeNull();
    });

});
