/**
 * 聖誕板塊遊戲配置
 */
export const gameConfig = {
    // 基礎設定
    playerCount: 2,        // 玩家人數：2 或 3
    largeHand: false,       // 4張手牌模式 (若為 false 則為 3張)

    // 進階規則
    flexibleDraw: false,    // 補牌規則：不論出幾張，成功匹配時預設補 1 張 (維持手牌上限)
    mulliganEnabled: false, // 手牌重整：板塊規則檔未提到此機制，預設關閉以符合規則

    // 幸運色設定
    luckyColorEnabled: false, // 是否開啟幸運色額外抽牌機制
    luckyColors: {
        0: 'R', // 玩家 1: 紅
        1: 'G', // 玩家 2: 綠
        2: 'B'  // 玩家 3: 藍
    },

    // 精心裝飾 (規則提到有三色指示物可用一次)
    exquisiteDecoration: true,

    // AI 對手設定
    aiOpponentEnabled: true
};
