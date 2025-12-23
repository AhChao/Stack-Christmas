// 繁體中文評價
export const SOLO_LEVELS_ZH = [
  { threshold: 31, name: '莊週夢疊', desc: '村莊周圍的人都來圍觀這夢幻疊層！這顆聖誕樹想必會為大家帶來一個美好的聖誕吧!' },
  { threshold: 21, name: '疊羅漢', desc: '好工夫，想必閣下就是疊疊的羅漢吧。聖誕節快樂喜悅的氣氛也被疊起來了。' },
  { threshold: 13, name: '疊疊不休', desc: '看得出來你在堆疊上面的努力！聖誕樹越發壯觀了。' },
  { threshold: 6, name: '胡疊胡疊疊得真美麗', desc: '層次感開始出來，頭戴著金冠呢，在幫聖誕樹多穿點花花衣吧。' },
  { threshold: 0, name: '在哪跌倒在哪爬起', desc: '剛開始嘗試，聖誕樹才剛有一點點起色，再試一次吧。' }
];

// English Evaluations (with Puns)
export const SOLO_LEVELS_EN = [
  { threshold: 31, name: 'Christack-mas Spirit', desc: 'Your soul has merged with the stack! This tree will radiate joy for generations to come.' },
  { threshold: 21, name: 'Stack-ta Claus', desc: 'You are the legend of the tree! Every placement is a gift to the village.' },
  { threshold: 13, name: 'X-mas-ter of Stacks', desc: 'A true master of the ornament! The tree looks magnificent under your guidance.' },
  { threshold: 6, name: 'Stack the Halls', desc: 'The halls are ringing with your talent! The tree is starting to look quite festive.' },
  { threshold: 0, name: 'Noel-vice Stacker', desc: 'A humble beginning under the mistletoe. Keep practicing, the star is within reach!' }
];

// Fallback for compatibility (defaults to ZH)
export const SOLO_LEVELS = SOLO_LEVELS_ZH;

export const SOLO_BOARDS = [
  // A. Balanced Melody
  [['R', 'G', 'B'], ['B', 'R', 'G'], ['G', 'B', 'R']],
  // B. Snowy Cross
  [['R', 'G', 'R'], ['G', 'B', 'G'], ['R', 'G', 'R']],
  // C. Forest Path
  [['R', 'G', 'B'], ['R', 'G', 'B'], ['R', 'G', 'B']]
];

export const getSoloLevel = (score, lang = 'zh') => {
  const levels = lang === 'en' ? SOLO_LEVELS_EN : SOLO_LEVELS_ZH;
  return levels.find(l => score >= l.threshold);
};

export const SOLO_RULES_ZH = `
<div class="solo-rules-html">
  <h3>獨自裝飾模式規則</h3>
  <ol>
    <li><strong>手牌上限</strong>：固定為 <strong>4 張</strong>。</li>
    <li><strong>初始資源</strong>：開始時擁有 <strong>6 枚</strong> 精心裝飾指示物（紅、綠、棕各兩枚）。</li>
    <li><strong>配對計分</strong>：
      <ul>
        <li>每完成一個 2x2 配對 <strong>+1 分</strong>。</li>
        <li>若單次放置同時達成<strong>多個配對</strong>（即板塊同時與周圍格子組合出複數個 2x2 圖樣），則該次動作獲得 <strong>3 分</strong>。
          <div class="match-example" style="margin-top: 10px; padding: 12px; background: rgba(39, 174, 96, 0.05); border-radius: 12px; border: 1px dashed #27ae60;">
            <p style="margin: 0 0 8px 0; font-size: 0.85rem; color: #2c3e50; font-weight: 600;">示意圖：單次放置達成多重配對（高亮處）</p>
            <div style="display: flex; justify-content: center; gap: 15px; align-items: center;">
              <table class="rule-table" style="border-collapse: collapse; background: white; border: 2px solid #27ae60;">
                <tr><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;background:#d4edda;font-size:0.75rem;">G</td><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;background:#d4edda;font-size:0.75rem;">G</td><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;background:#d4edda;font-size:0.75rem;">G</td></tr>
                <tr><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;background:#d4edda;font-size:0.75rem;">G</td><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;background:#f8d7da;color:#721c24;border:2px solid #e74c3c;font-weight:900;font-size:0.8rem;">R</td><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;background:#d4edda;font-size:0.75rem;">G</td></tr>
                <tr><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;font-size:0.75rem;">B</td><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;font-size:0.75rem;">B</td><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;font-size:0.75rem;">B</td></tr>
              </table>
            </div>
            <p style="margin: 8px 0 0 0; font-size: 0.75rem; color: #7f8c8d;">※ 一個板塊可能與其相鄰的格子同時達成多組 2x2 配對，此時得分將會獲得加成。</p>
          </div>
        </li>
      </ul>
    </li>
    <li><strong>補牌規則</strong>：
      <ul>
        <li>每次成功配對後補一張牌。</li>
        <li>消耗一枚對應顏色的指示物可額外補一張（需低於上限）。</li>
      </ul>
    </li>
    <li><strong>重整機制 (Mulligan)</strong>：
      <ul>
        <li>可在任何時候消耗 <strong>3 枚</strong> 任意指示物，將目前手牌洗入牌庫並重新<strong>補回相同張數</strong>。</li>
      </ul>
    </li>
    <li><strong>遊戲結束</strong>：當你<strong>手牌耗盡</strong>且<strong>無法在盤面上完成任何配對</strong>，或是<strong>所有板塊都已放完</strong>時，遊戲即告結束。</li>
  </ol>
</div>
`;

export const SOLO_RULES_EN = `
<div class="solo-rules-html">
  <h3>Solo Decoration Mode Rules</h3>
  <ol>
    <li><strong>Hand Limit</strong>: Fixed at <strong>4 cards</strong>.</li>
    <li><strong>Initial Resources</strong>: Start with <strong>6 Exquisite Decoration tokens</strong> (2 each of Red, Green, Brown).</li>
    <li><strong>Scoring</strong>:
      <ul>
        <li>Each 2x2 pattern match <strong>+1 point</strong>.</li>
        <li>If a single placement achieves <strong>multiple matches</strong> simultaneously (combining with different sets of tiles), you earn <strong>3 points</strong>.
          <div class="match-example" style="margin-top: 10px; padding: 12px; background: rgba(39, 174, 96, 0.05); border-radius: 12px; border: 1px dashed #27ae60;">
            <p style="margin: 0 0 8px 0; font-size: 0.85rem; color: #2c3e50; font-weight: 600;">Schematic: Multi-match across different regions</p>
            <div style="display: flex; justify-content: center; gap: 15px; align-items: center;">
              <table class="rule-table" style="border-collapse: collapse; background: white; border: 2px solid #27ae60;">
                <tr><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;background:#d4edda;font-size:0.75rem;">G</td><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;background:#d4edda;font-size:0.75rem;">G</td><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;background:#d4edda;font-size:0.75rem;">G</td></tr>
                <tr><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;background:#d4edda;font-size:0.75rem;">G</td><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;background:#f8d7da;color:#721c24;border:2px solid #e74c3c;font-weight:900;font-size:0.8rem;">R</td><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;background:#d4edda;font-size:0.75rem;">G</td></tr>
                <tr><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;font-size:0.75rem;">B</td><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;font-size:0.75rem;">B</td><td style="width:24px;height:24px;border:1px solid #ddd;text-align:center;font-size:0.75rem;">B</td></tr>
              </table>
            </div>
            <p style="margin: 8px 0 0 0; font-size: 0.75rem; color: #7f8c8d;">* Scoring is boosted if a placement completes multiple 2x2 patterns with its surrounding cells.</p>
          </div>
        </li>
      </ul>
    </li>
    <li><strong>Drawing Rules</strong>:
      <ul>
        <li>Draw one card after each successful match.</li>
        <li>Spend a matching color token to draw an extra card (cannot exceed hand limit).</li>
      </ul>
    </li>
    <li><strong>Mulligan Mechanic</strong>:
      <ul>
        <li>At any time, spend <strong>3 tokens</strong> of any color to reshuffle your hand into the deck and <strong>draw back the same number</strong> of cards.</li>
      </ul>
    </li>
    <li><strong>Game Over</strong>: The game ends when your <strong>hand is empty</strong> and <strong>no more matches can be made</strong>, or when <strong>all tiles have been played</strong>.</li>
  </ol>
</div>
`;

// Fallback for compatibility
export const SOLO_RULES = SOLO_RULES_ZH;
