// ============================================================
// 银河战舰 — 游戏核心逻辑
// 按位置选人 + 每局一次刷新
// ============================================================

// ---------- 游戏状态 ----------
let gameState = {
  teamName: '',
  drawnPlayers: { GK: [], DF: [], MF: [], FW: [] },  // 按位置分组的抽卡结果
  selectedFormation: null,
  selectedPlayers: { GK: [], DF: [], MF: [], FW: [] }, // 按位置分组的选中球员
  tactic: 'balanced',
  refreshUsed: false,      // 是否已使用刷新
  refreshedPos: null,      // 刷新了哪个位置
  currentTab: 'GK',        // 当前选中的位置标签页
  opponentName: '',
  opponentRating: 0,
};

// ---------- 工具函数 ----------
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------- 抽卡：按位置分别抽取 ----------
function drawPlayers() {
  const result = {};
  for (const pos of POS_ORDER) {
    const pool = PLAYER_POOL.filter(p => p.pos === pos);
    result[pos] = shuffle(pool).slice(0, POOL_SIZES[pos]);
  }
  return result;
}

// ---------- 刷新某个位置的球员池（每局仅一次） ----------
function refreshPosition(pos) {
  if (gameState.refreshUsed) return;
  if (!gameState.selectedFormation) return;

  // 重新抽取该位置的球员
  const pool = PLAYER_POOL.filter(p => p.pos === pos);
  gameState.drawnPlayers[pos] = shuffle(pool).slice(0, POOL_SIZES[pos]);

  // 清除该位置已选中的球员
  gameState.selectedPlayers[pos] = [];

  // 标记刷新已使用
  gameState.refreshUsed = true;
  gameState.refreshedPos = pos;

  renderGameScreen();
}

// ---------- 默契加成计算 ----------
function calculateChemistry(allSelected) {
  let bonus = 0;
  let details = [];

  if (allSelected.length === 0) return { bonus: 0, details };

  // 联赛默契：≥3名同联赛 → +3%
  const leagueCount = {};
  allSelected.forEach(p => { leagueCount[p.league] = (leagueCount[p.league] || 0) + 1; });
  const leagueEntries = Object.entries(leagueCount).sort((a, b) => b[1] - a[1]);
  if (leagueEntries.length > 0 && leagueEntries[0][1] >= 3) {
    bonus += 3;
    details.push(`同联赛(${leagueEntries[0][0]}) ${leagueEntries[0][1]}人 +3%`);
  }

  // 国籍默契：≥2名同国籍 → +2%
  const nationCount = {};
  allSelected.forEach(p => { nationCount[p.nation] = (nationCount[p.nation] || 0) + 1; });
  const nationEntries = Object.entries(nationCount).sort((a, b) => b[1] - a[1]);
  if (nationEntries.length > 0 && nationEntries[0][1] >= 2) {
    bonus += 2;
    details.push(`同国籍(${nationEntries[0][0]}) ${nationEntries[0][1]}人 +2%`);
  }

  bonus = Math.min(bonus, 5);
  return { bonus, details };
}

// ---------- 获取所有选中球员 ----------
function getAllSelected() {
  return [...gameState.selectedPlayers.GK, ...gameState.selectedPlayers.DF,
          ...gameState.selectedPlayers.MF, ...gameState.selectedPlayers.FW];
}

// ---------- 球队总评分 ----------
function calculateTeamRating() {
  const allSelected = getAllSelected();
  if (allSelected.length === 0) return { base: 0, final: 0, chemistry: { bonus: 0, details: [] } };

  const baseSum = allSelected.reduce((sum, p) => sum + p.rating, 0);
  const baseAvg = baseSum / 11;
  const chemistry = calculateChemistry(allSelected);
  const final = baseAvg * (1 + chemistry.bonus / 100);

  return {
    base: Math.round(baseAvg),
    final: Math.round(final),
    chemistry,
  };
}

// ---------- 检查阵容是否完整 ----------
function isSquadComplete() {
  if (!gameState.selectedFormation) return false;
  const f = FORMATIONS[gameState.selectedFormation];
  return gameState.selectedPlayers.GK.length === f.GK &&
         gameState.selectedPlayers.DF.length === f.DF &&
         gameState.selectedPlayers.MF.length === f.MF &&
         gameState.selectedPlayers.FW.length === f.FW;
}

// ---------- 比赛模拟 ----------
function simulateMatch(myRating, tactic) {
  const multiplier = 0.8 + Math.random() * 0.4;
  const oppRating = Math.round(myRating * multiplier);
  const oppFormations = Object.keys(FORMATIONS);
  const oppFormation = pickRandom(oppFormations);

  const diff = myRating - oppRating;
  let winProb;

  if (diff >= 10) winProb = 0.80;
  else if (diff >= 5) winProb = 0.65;
  else if (diff <= -10) winProb = 0.20;
  else if (diff <= -5) winProb = 0.35;
  else winProb = 0.50;

  const myWin = Math.random() < winProb;

  let goalBoost = 0;
  if (tactic === 'attack') goalBoost = 1;
  else if (tactic === 'defense') goalBoost = -1;

  let myGoals, oppGoals;
  if (myWin) {
    myGoals = Math.max(1, randInt(2, 4) + goalBoost);
    oppGoals = Math.max(0, randInt(0, 2) - (tactic === 'defense' ? 1 : 0));
  } else {
    oppGoals = Math.max(1, randInt(2, 4));
    myGoals = Math.max(0, randInt(0, 2) + (tactic === 'attack' ? 1 : 0));
  }

  if (myGoals === oppGoals) {
    if (Math.random() < 0.5) {
      if (myWin) myGoals++; else oppGoals++;
    }
  }

  return {
    myGoals, oppGoals,
    myWin: myGoals > oppGoals,
    isDraw: myGoals === oppGoals,
    diff, oppRating, oppFormation, winProb,
  };
}

// ---------- 生成比赛事件文本 ----------
function generateMatchEvents(result, allSelected) {
  const events = [];
  const fwPlayers = [...gameState.selectedPlayers.FW, ...gameState.selectedPlayers.MF];
  const scorer = pickRandom(fwPlayers.length > 0 ? fwPlayers : allSelected);

  if (result.myGoals > 0) {
    events.push(`⚽ ${randInt(10, 45)}' ${scorer.name} 为球队首开纪录！`);
  }
  if (result.oppGoals > 0) {
    events.push(`⚽ ${randInt(20, 70)}' 对手扳回一球`);
  }
  if (result.myGoals >= 2) {
    events.push(`⚽ ${randInt(50, 88)}' ${scorer.name} 梅开二度！`);
  }
  if (result.myGoals >= 3) {
    events.push(`⚽ ${randInt(70, 90)}' 帽子戏法！${scorer.name} 场上统治级表现！`);
  }
  if (Math.random() < 0.3) {
    events.push(`🟨 ${randInt(30, 80)}' 黄牌警告`);
  }
  return events;
}

// ---------- 最佳球员 ----------
function getBestPlayer(allSelected) {
  const fwAndMf = [...gameState.selectedPlayers.FW, ...gameState.selectedPlayers.MF];
  const candidates = fwAndMf.length > 0 ? fwAndMf : allSelected;
  candidates.sort((a, b) => b.rating - a.rating);
  return candidates[0];
}

// ============================================================
// UI 渲染
// ============================================================

function showStartScreen() {
  document.getElementById('startScreen').classList.remove('hidden');
  document.getElementById('gameScreen').classList.add('hidden');
  document.getElementById('matchOverlay').classList.add('hidden');
  document.getElementById('resultModal').classList.add('hidden');
}

function startGame() {
  const input = document.getElementById('teamNameInput');
  let name = input.value.trim();
  if (!name) {
    name = pickRandom(OPPONENT_NAMES);
  }
  gameState.teamName = name;
  gameState.drawnPlayers = drawPlayers();
  gameState.selectedFormation = null;
  gameState.selectedPlayers = { GK: [], DF: [], MF: [], FW: [] };
  gameState.tactic = 'balanced';
  gameState.refreshUsed = false;
  gameState.refreshedPos = null;
  gameState.currentTab = 'GK';

  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('hidden');

  renderGameScreen();
}

function renderGameScreen() {
  renderTopBar();
  renderFormationSelector();
  renderTacticSelector();
  renderPositionTabs();
  renderPlayerPool();
  renderFormationPanel();
  renderStartMatchButton();
}

// ---------- 顶部状态栏 ----------
function renderTopBar() {
  document.getElementById('teamBadge').textContent = gameState.teamName;
  document.getElementById('formationBadge').textContent = gameState.selectedFormation
    ? FORMATIONS[gameState.selectedFormation].label
    : '请选择阵型';

  const rating = calculateTeamRating();
  document.getElementById('ratingNumber').textContent = isSquadComplete() ? rating.final : '--';

  const chemistryBadge = document.getElementById('chemistryBadge');
  if (rating.chemistry.bonus > 0) {
    chemistryBadge.textContent = `默契 +${rating.chemistry.bonus}%`;
    chemistryBadge.title = rating.chemistry.details.join('\n');
    chemistryBadge.classList.remove('hidden');
  } else {
    chemistryBadge.classList.add('hidden');
  }
}

// ---------- 阵型选择 ----------
function renderFormationSelector() {
  const container = document.getElementById('formationSelector');
  container.innerHTML = '';

  for (const [key, formation] of Object.entries(FORMATIONS)) {
    const btn = document.createElement('button');
    btn.className = 'formation-btn' + (gameState.selectedFormation === key ? ' active' : '');
    btn.innerHTML = `<span>${key}</span><span class="formation-desc">${formation.label.split(' ')[1]}</span>`;
    btn.onclick = () => selectFormation(key);
    container.appendChild(btn);
  }
}

function selectFormation(key) {
  gameState.selectedFormation = key;
  // 阵型变化时，裁剪超出的选中球员
  const f = FORMATIONS[key];
  for (const pos of POS_ORDER) {
    if (gameState.selectedPlayers[pos].length > f[pos]) {
      gameState.selectedPlayers[pos] = gameState.selectedPlayers[pos].slice(0, f[pos]);
    }
  }
  renderGameScreen();
}

// ---------- 战术选择 ----------
function renderTacticSelector() {
  const container = document.getElementById('tacticSelector');
  container.innerHTML = '';

  const tactics = [
    { key: 'attack', label: '⚔️ 进攻' },
    { key: 'balanced', label: '⚖️ 均衡' },
    { key: 'defense', label: '🛡️ 防守' },
  ];

  for (const t of tactics) {
    const btn = document.createElement('button');
    btn.className = 'tactic-btn' + (gameState.tactic === t.key ? ' active' : '');
    btn.textContent = t.label;
    btn.onclick = () => { gameState.tactic = t.key; renderTacticSelector(); };
    container.appendChild(btn);
  }
}

// ---------- 位置标签页 ----------
function renderPositionTabs() {
  const container = document.getElementById('positionTabs');
  container.innerHTML = '';

  if (!gameState.selectedFormation) return;

  const f = FORMATIONS[gameState.selectedFormation];
  const posIcons = { GK: '🧤', DF: '🛡️', MF: '⚙️', FW: '⚔️' };

  for (const pos of POS_ORDER) {
    const tab = document.createElement('button');
    const selected = gameState.selectedPlayers[pos].length;
    const required = f[pos];
    const isCurrent = gameState.currentTab === pos;
    const isFull = selected === required;

    let className = 'pos-tab';
    if (isCurrent) className += ' active';
    if (isFull) className += ' full';
    if (gameState.refreshedPos === pos) className += ' refreshed';
    tab.className = className;

    tab.innerHTML = `
      <span class="pos-tab-icon">${posIcons[pos]}</span>
      <span class="pos-tab-name">${POS_NAMES[pos]}</span>
      <span class="pos-tab-count">${selected}/${required}</span>
    `;

    tab.onclick = () => { gameState.currentTab = pos; renderGameScreen(); };
    container.appendChild(tab);
  }

  // 刷新按钮区域
  const refreshArea = document.getElementById('refreshArea');
  refreshArea.innerHTML = '';

  if (gameState.refreshUsed) {
    refreshArea.innerHTML = `
      <div class="refresh-used">
        <span class="refresh-icon">🔒</span>
        <span>刷新已用</span>
      </div>
    `;
  } else {
    const btn = document.createElement('button');
    btn.className = 'btn-refresh';
    btn.innerHTML = `<span class="refresh-icon">🔄</span> 刷新`;
    btn.title = `刷新当前位置（${POS_NAMES[gameState.currentTab]}）的球员，每局限一次`;
    btn.onclick = () => refreshPosition(gameState.currentTab);
    refreshArea.appendChild(btn);
  }
}

// ---------- 球员卡池（按当前标签页显示） ----------
function renderPlayerPool() {
  const container = document.getElementById('cardsGrid');
  container.innerHTML = '';

  if (!gameState.selectedFormation) {
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-faint);padding:40px 0;">请先选择阵型</div>';
    return;
  }

  const pos = gameState.currentTab;
  const players = gameState.drawnPlayers[pos];
  const f = FORMATIONS[gameState.selectedFormation];
  const required = f[pos];
  const selectedInPos = gameState.selectedPlayers[pos];

  players.forEach((player, idx) => {
    const card = document.createElement('div');
    card.className = 'player-card card-draw';
    card.style.animationDelay = `${idx * 0.04}s`;
    card.style.setProperty('--league-color', LEAGUE_COLORS[player.league] || 'var(--border)');

    const isSelected = selectedInPos.some(p => p.name === player.name);
    if (isSelected) card.classList.add('selected');

    if (player.legend) {
      const tag = document.createElement('span');
      tag.className = 'legend-tag';
      tag.textContent = '传奇';
      card.appendChild(tag);
    }

    card.innerHTML += `
      <div class="card-pos">${player.pos}</div>
      <div class="card-name">${player.name}</div>
      <div class="card-rating">${player.rating}</div>
      <div class="card-club">${player.club}</div>
      <div class="card-meta">
        <span class="card-league-dot" style="background:${LEAGUE_COLORS[player.league]}"></span>
        <span>${player.league}</span>
        <span>·</span>
        <span>${player.nation}</span>
      </div>
    `;

    card.onclick = () => togglePlayer(player);
    container.appendChild(card);
  });

  // 更新计数
  const countEl = document.getElementById('poolCount');
  if (countEl) {
    const totalSelected = getAllSelected().length;
    countEl.textContent = `${totalSelected}/11`;
  }
}

function togglePlayer(player) {
  if (!gameState.selectedFormation) {
    flashFormationSelector();
    return;
  }

  const pos = player.pos;
  const selectedInPos = gameState.selectedPlayers[pos];
  const required = FORMATIONS[gameState.selectedFormation][pos];
  const idx = selectedInPos.findIndex(p => p.name === player.name);

  if (idx >= 0) {
    selectedInPos.splice(idx, 1);
  } else {
    if (selectedInPos.length >= required) return;
    selectedInPos.push(player);
  }

  renderGameScreen();
}

function flashFormationSelector() {
  const btns = document.querySelectorAll('.formation-btn');
  btns.forEach(btn => {
    btn.style.borderColor = 'var(--red)';
    setTimeout(() => { btn.style.borderColor = ''; }, 600);
  });
}

// ---------- 阵型面板 ----------
function renderFormationPanel() {
  const container = document.getElementById('formationPitch');
  container.innerHTML = '';

  if (!gameState.selectedFormation) {
    container.innerHTML = '<div style="text-align:center;color:var(--text-faint);padding:40px 0;">请先选择阵型</div>';
    return;
  }

  const formation = FORMATIONS[gameState.selectedFormation];
  const layers = [
    { pos: 'GK', count: formation.GK },
    { pos: 'DF', count: formation.DF },
    { pos: 'MF', count: formation.MF },
    { pos: 'FW', count: formation.FW },
  ];

  layers.forEach(layer => {
    const row = document.createElement('div');
    row.className = 'formation-row';

    for (let i = 0; i < layer.count; i++) {
      const slot = document.createElement('div');
      slot.className = 'formation-slot';

      const playersInPos = gameState.selectedPlayers[layer.pos];
      const player = playersInPos[i];

      if (player) {
        slot.classList.add('filled');
        slot.innerHTML = `
          <div class="slot-pos">${layer.pos}</div>
          <div class="slot-name">${player.name}</div>
          <div class="slot-rating">${player.rating}</div>
        `;
      } else {
        slot.innerHTML = `
          <div class="slot-pos">${layer.pos}</div>
          <div class="slot-empty">空缺</div>
        `;
      }

      row.appendChild(slot);
    }

    container.appendChild(row);
  });
}

// ---------- 开赛按钮 ----------
function renderStartMatchButton() {
  const btn = document.getElementById('btnStartMatch');
  const ready = isSquadComplete();

  btn.disabled = !ready;

  if (!ready) {
    if (!gameState.selectedFormation) {
      btn.textContent = '请先选择阵型';
    } else {
      const f = FORMATIONS[gameState.selectedFormation];
      const missing = [];
      for (const pos of POS_ORDER) {
        const need = f[pos] - gameState.selectedPlayers[pos].length;
        if (need > 0) missing.push(`${POS_NAMES[pos]}${need}人`);
      }
      btn.textContent = `还需：${missing.join(' · ')}`;
    }
  } else {
    btn.textContent = '⚽ 开赛！';
  }
}

// ---------- 开始比赛 ----------
function startMatch() {
  if (!isSquadComplete()) return;

  const rating = calculateTeamRating();
  const myRating = rating.final;
  const result = simulateMatch(myRating, gameState.tactic);
  gameState.opponentRating = result.oppRating;
  gameState.opponentName = pickRandom(OPPONENT_NAMES);

  showMatchAnimation(myRating, result);
}

// ---------- 比赛动画 ----------
function showMatchAnimation(myRating, result) {
  const overlay = document.getElementById('matchOverlay');
  overlay.classList.remove('hidden');

  document.getElementById('matchTeams').innerHTML = `
    <div class="match-team">
      <div class="team-name-label">${gameState.teamName}</div>
      <div class="team-rating-label">总评 ${myRating}</div>
    </div>
    <div class="match-vs">VS</div>
    <div class="match-team">
      <div class="team-name-label">${gameState.opponentName}</div>
      <div class="team-rating-label">总评 ${result.oppRating}</div>
    </div>
  `;

  const scoreEl = document.getElementById('matchScore');
  const timerEl = document.getElementById('matchTimer');
  const eventsEl = document.getElementById('matchEvents');

  scoreEl.textContent = '0 : 0';
  timerEl.textContent = "开球！";
  eventsEl.textContent = '';

  const allSelected = getAllSelected();
  const events = generateMatchEvents(result, allSelected);
  events.sort((a, b) => {
    const timeA = parseInt(a.match(/(\d+)'/)?.[1] || 0);
    const timeB = parseInt(b.match(/(\d+)'/)?.[1] || 0);
    return timeA - timeB;
  });

  let currentTime = 0;
  const totalTime = 90;
  const animDuration = 6000;
  const stepTime = animDuration / totalTime;

  let myRunningScore = 0;
  let oppRunningScore = 0;
  let eventIdx = 0;

  const interval = setInterval(() => {
    currentTime += 2;
    timerEl.textContent = `${currentTime}'`;

    while (eventIdx < events.length) {
      const eventTime = parseInt(events[eventIdx].match(/(\d+)'/)?.[1] || 0);
      if (eventTime <= currentTime) {
        const event = events[eventIdx];
        eventsEl.textContent = event;

        if (event.includes('对手')) {
          oppRunningScore++;
        } else if (event.includes('⚽')) {
          myRunningScore++;
        }
        scoreEl.textContent = `${myRunningScore} : ${oppRunningScore}`;
        eventIdx++;
      } else {
        break;
      }
    }

    if (currentTime >= totalTime) {
      clearInterval(interval);
      scoreEl.textContent = `${result.myGoals} : ${result.oppGoals}`;
      timerEl.textContent = '终场';
      eventsEl.textContent = '全场结束！';

      setTimeout(() => {
        overlay.classList.add('hidden');
        showResult(result, myRating, allSelected);
      }, 1500);
    }
  }, stepTime * 2);
}

// ---------- 结果弹窗 ----------
function showResult(result, myRating, allSelected) {
  const modal = document.getElementById('resultModal');
  modal.classList.remove('hidden');

  const outcomeEl = document.getElementById('resultOutcome');
  const scoreEl = document.getElementById('resultScore');
  const detailEl = document.getElementById('resultDetail');
  const commentEl = document.getElementById('resultComment');

  if (result.isDraw) {
    outcomeEl.textContent = '⚖️ 平局！';
    outcomeEl.className = 'result-outcome draw';
  } else if (result.myWin) {
    outcomeEl.textContent = '🎉 胜利！';
    outcomeEl.className = 'result-outcome win';
  } else {
    outcomeEl.textContent = '😔 失败...';
    outcomeEl.className = 'result-outcome lose';
  }

  const myScoreClass = result.myGoals > result.oppGoals ? 'winner-score' : 'loser-score';
  const oppScoreClass = result.oppGoals > result.myGoals ? 'winner-score' : 'loser-score';
  scoreEl.innerHTML = `
    <span class="${myScoreClass}">${result.myGoals}</span>
    <span style="color:var(--text-faint);margin:0 10px;">:</span>
    <span class="${oppScoreClass}">${result.oppGoals}</span>
  `;

  const bestPlayer = getBestPlayer(allSelected);

  detailEl.innerHTML = `
    <div class="detail-row">
      <span class="detail-label">你的球队</span>
      <span class="detail-value">${gameState.teamName}（总评 ${myRating}）</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">对手球队</span>
      <span class="detail-value">${gameState.opponentName}（总评 ${result.oppRating}）</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">阵型</span>
      <span class="detail-value">${gameState.selectedFormation} vs ${result.oppFormation}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">评分差</span>
      <span class="detail-value">${result.diff > 0 ? '+' : ''}${result.diff}（胜率 ${Math.round(result.winProb * 100)}%）</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">本场最佳</span>
      <span class="detail-value">${bestPlayer.name}（${POS_NAMES[bestPlayer.pos]} · ${bestPlayer.rating}）</span>
    </div>
  `;

  commentEl.textContent = pickRandom(MATCH_COMMENTS);
}

// ---------- 再来一局 ----------
function playAgain() {
  document.getElementById('resultModal').classList.add('hidden');
  gameState.drawnPlayers = drawPlayers();
  gameState.selectedFormation = null;
  gameState.selectedPlayers = { GK: [], DF: [], MF: [], FW: [] };
  gameState.tactic = 'balanced';
  gameState.refreshUsed = false;
  gameState.refreshedPos = null;
  gameState.currentTab = 'GK';
  renderGameScreen();
}

function backToMenu() {
  document.getElementById('resultModal').classList.add('hidden');
  showStartScreen();
}

// ---------- 初始化 ----------
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnStart').addEventListener('click', startGame);
  document.getElementById('btnStartMatch').addEventListener('click', startMatch);
  document.getElementById('btnPlayAgain').addEventListener('click', playAgain);
  document.getElementById('btnBackToMenu').addEventListener('click', backToMenu);

  document.getElementById('teamNameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startGame();
  });
});
