// ============================================================
// 球员数据库 — 五大联赛现役 + 退役传奇
// 每个球员: { name, pos, rating, league, nation, club, legend }
// pos: GK(门将) / DF(后卫) / MF(中场) / FW(前锋)
// league: 英超 / 西甲 / 意甲 / 德甲 / 法甲
// legend: true 表示退役传奇（league/club 为其巅峰时期所属）
// ============================================================

const PLAYER_POOL = [
  // ========== 门将 GK ==========
  // 现役
  { name: "库尔图瓦",   pos: "GK", rating: 90, league: "西甲", nation: "比利时",   club: "皇家马德里",   legend: false },
  { name: "阿利松",     pos: "GK", rating: 89, league: "英超", nation: "巴西",     club: "利物浦",       legend: false },
  { name: "埃德森",     pos: "GK", rating: 86, league: "英超", nation: "巴西",     club: "曼城",         legend: false },
  { name: "特尔施特根", pos: "GK", rating: 87, league: "西甲", nation: "德国",     club: "巴塞罗那",     legend: false },
  { name: "多纳鲁马",   pos: "GK", rating: 85, league: "法甲", nation: "意大利",   club: "巴黎圣日耳曼", legend: false },
  { name: "迈尼昂",     pos: "GK", rating: 86, league: "法甲", nation: "法国",     club: "AC米兰",       legend: false },
  { name: "诺伊尔",     pos: "GK", rating: 84, league: "德甲", nation: "德国",     club: "拜仁慕尼黑",   legend: false },
  { name: "奥纳纳",     pos: "GK", rating: 82, league: "英超", nation: "喀麦隆",   club: "曼联",         legend: false },
  { name: "拉亚",       pos: "GK", rating: 83, league: "英超", nation: "西班牙",   club: "阿森纳",       legend: false },
  { name: "索默",       pos: "GK", rating: 82, league: "德甲", nation: "瑞士",     club: "国际米兰",     legend: false },
  // 退役传奇
  { name: "布冯",       pos: "GK", rating: 92, league: "意甲", nation: "意大利",   club: "尤文图斯",     legend: true },
  { name: "卡西利亚斯", pos: "GK", rating: 91, league: "西甲", nation: "西班牙",   club: "皇家马德里",   legend: true },
  { name: "卡恩",       pos: "GK", rating: 89, league: "德甲", nation: "德国",     club: "拜仁慕尼黑",   legend: true },
  { name: "切赫",       pos: "GK", rating: 88, league: "英超", nation: "捷克",     club: "切尔西",       legend: true },
  { name: "范德萨",     pos: "GK", rating: 87, league: "英超", nation: "荷兰",     club: "曼联",         legend: true },

  // ========== 后卫 DF ==========
  // 现役
  { name: "范戴克",     pos: "DF", rating: 89, league: "英超", nation: "荷兰",     club: "利物浦",       legend: false },
  { name: "迪亚斯",     pos: "DF", rating: 87, league: "英超", nation: "葡萄牙",   club: "曼城",         legend: false },
  { name: "萨利巴",     pos: "DF", rating: 86, league: "英超", nation: "法国",     club: "阿森纳",       legend: false },
  { name: "沃克",       pos: "DF", rating: 84, league: "英超", nation: "英格兰",   club: "曼城",         legend: false },
  { name: "罗伯逊",     pos: "DF", rating: 85, league: "英超", nation: "苏格兰",   club: "利物浦",       legend: false },
  { name: "阿什拉夫",   pos: "DF", rating: 86, league: "法甲", nation: "摩洛哥",   club: "巴黎圣日耳曼", legend: false },
  { name: "马尔基尼奥斯", pos: "DF", rating: 87, league: "法甲", nation: "巴西",   club: "巴黎圣日耳曼", legend: false },
  { name: "孔德",       pos: "DF", rating: 85, league: "西甲", nation: "法国",     club: "巴塞罗那",     legend: false },
  { name: "吕迪格",     pos: "DF", rating: 86, league: "西甲", nation: "德国",     club: "皇家马德里",   legend: false },
  { name: "米利唐",     pos: "DF", rating: 84, league: "西甲", nation: "巴西",     club: "皇家马德里",   legend: false },
  { name: "巴斯托尼",   pos: "DF", rating: 86, league: "意甲", nation: "意大利",   club: "国际米兰",     legend: false },
  { name: "特奥",       pos: "DF", rating: 85, league: "法甲", nation: "法国",     club: "AC米兰",       legend: false },
  { name: "戴维斯",     pos: "DF", rating: 84, league: "德甲", nation: "加拿大",   club: "拜仁慕尼黑",   legend: false },
  { name: "基米希",     pos: "DF", rating: 87, league: "德甲", nation: "德国",     club: "拜仁慕尼黑",   legend: false },
  { name: "格瓦迪奥尔", pos: "DF", rating: 84, league: "英超", nation: "克罗地亚", club: "曼城",         legend: false },
  { name: "加布里埃尔", pos: "DF", rating: 85, league: "英超", nation: "巴西",     club: "阿森纳",       legend: false },
  // 退役传奇
  { name: "马尔蒂尼",   pos: "DF", rating: 94, league: "意甲", nation: "意大利",   club: "AC米兰",       legend: true },
  { name: "卡纳瓦罗",   pos: "DF", rating: 90, league: "意甲", nation: "意大利",   club: "尤文图斯",     legend: true },
  { name: "普约尔",     pos: "DF", rating: 89, league: "西甲", nation: "西班牙",   club: "巴塞罗那",     legend: true },
  { name: "内斯塔",     pos: "DF", rating: 91, league: "意甲", nation: "意大利",   club: "AC米兰",       legend: true },
  { name: "卡福",       pos: "DF", rating: 90, league: "意甲", nation: "巴西",     club: "AC米兰",       legend: true },
  { name: "罗伯特·卡洛斯", pos: "DF", rating: 89, league: "西甲", nation: "巴西",  club: "皇家马德里",   legend: true },
  { name: "贝肯鲍尔",   pos: "DF", rating: 93, league: "德甲", nation: "德国",     club: "拜仁慕尼黑",   legend: true },
  { name: "拉莫斯",     pos: "DF", rating: 89, league: "西甲", nation: "西班牙",   club: "皇家马德里",   legend: true },
  { name: "特里",       pos: "DF", rating: 88, league: "英超", nation: "英格兰",   club: "切尔西",       legend: true },
  { name: "维迪奇",     pos: "DF", rating: 87, league: "英超", nation: "塞尔维亚", club: "曼联",         legend: true },

  // ========== 中场 MF ==========
  // 现役
  { name: "德布劳内",   pos: "MF", rating: 90, league: "英超", nation: "比利时",   club: "曼城",         legend: false },
  { name: "罗德里",     pos: "MF", rating: 89, league: "英超", nation: "西班牙",   club: "曼城",         legend: false },
  { name: "贝林厄姆",   pos: "MF", rating: 88, league: "西甲", nation: "英格兰",   club: "皇家马德里",   legend: false },
  { name: "佩德里",     pos: "MF", rating: 86, league: "西甲", nation: "西班牙",   club: "巴塞罗那",     legend: false },
  { name: "维尔茨",     pos: "MF", rating: 87, league: "德甲", nation: "德国",     club: "勒沃库森",     legend: false },
  { name: "穆西亚拉",   pos: "MF", rating: 87, league: "德甲", nation: "德国",     club: "拜仁慕尼黑",   legend: false },
  { name: "赖斯",       pos: "MF", rating: 86, league: "英超", nation: "英格兰",   club: "阿森纳",       legend: false },
  { name: "福登",       pos: "MF", rating: 87, league: "英超", nation: "英格兰",   club: "曼城",         legend: false },
  { name: "巴尔韦德",   pos: "MF", rating: 87, league: "西甲", nation: "乌拉圭",   club: "皇家马德里",   legend: false },
  { name: "卡马文加",   pos: "MF", rating: 84, league: "西甲", nation: "法国",     club: "皇家马德里",   legend: false },
  { name: "琼阿梅尼",   pos: "MF", rating: 84, league: "西甲", nation: "法国",     club: "皇家马德里",   legend: false },
  { name: "麦卡利斯特", pos: "MF", rating: 85, league: "英超", nation: "阿根廷",   club: "利物浦",       legend: false },
  { name: "凯塞多",     pos: "MF", rating: 84, league: "英超", nation: "厄瓜多尔", club: "切尔西",       legend: false },
  { name: "巴雷拉",     pos: "MF", rating: 85, league: "意甲", nation: "意大利",   club: "国际米兰",     legend: false },
  { name: "扎伊尔-埃梅里", pos: "MF", rating: 82, league: "法甲", nation: "法国",  club: "巴黎圣日耳曼", legend: false },
  { name: "厄德高",     pos: "MF", rating: 86, league: "英超", nation: "挪威",     club: "阿森纳",       legend: false },
  { name: "萨维尼奥",   pos: "MF", rating: 82, league: "英超", nation: "巴西",     club: "曼城",         legend: false },
  // 退役传奇
  { name: "齐达内",     pos: "MF", rating: 94, league: "西甲", nation: "法国",     club: "皇家马德里",   legend: true },
  { name: "伊涅斯塔",   pos: "MF", rating: 92, league: "西甲", nation: "西班牙",   club: "巴塞罗那",     legend: true },
  { name: "哈维",       pos: "MF", rating: 91, league: "西甲", nation: "西班牙",   club: "巴塞罗那",     legend: true },
  { name: "皮尔洛",     pos: "MF", rating: 90, league: "意甲", nation: "意大利",   club: "尤文图斯",     legend: true },
  { name: "卡卡",       pos: "MF", rating: 91, league: "意甲", nation: "巴西",     club: "AC米兰",       legend: true },
  { name: "罗纳尔迪尼奥", pos: "MF", rating: 93, league: "西甲", nation: "巴西",   club: "巴塞罗那",     legend: true },
  { name: "贝克汉姆",   pos: "MF", rating: 88, league: "英超", nation: "英格兰",   club: "曼联",         legend: true },
  { name: "杰拉德",     pos: "MF", rating: 89, league: "英超", nation: "英格兰",   club: "利物浦",       legend: true },
  { name: "兰帕德",     pos: "MF", rating: 88, league: "英超", nation: "英格兰",   club: "切尔西",       legend: true },
  { name: "内德维德",   pos: "MF", rating: 89, league: "意甲", nation: "捷克",     club: "尤文图斯",     legend: true },
  { name: "菲戈",       pos: "MF", rating: 90, league: "西甲", nation: "葡萄牙",   club: "皇家马德里",   legend: true },
  { name: "普拉蒂尼",   pos: "MF", rating: 91, league: "意甲", nation: "法国",     club: "尤文图斯",     legend: true },
  { name: "马特乌斯",   pos: "MF", rating: 90, league: "德甲", nation: "德国",     club: "拜仁慕尼黑",   legend: true },

  // ========== 前锋 FW ==========
  // 现役
  { name: "哈兰德",     pos: "FW", rating: 91, league: "英超", nation: "挪威",     club: "曼城",         legend: false },
  { name: "姆巴佩",     pos: "FW", rating: 91, league: "西甲", nation: "法国",     club: "皇家马德里",   legend: false },
  { name: "维尼修斯",   pos: "FW", rating: 89, league: "西甲", nation: "巴西",     club: "皇家马德里",   legend: false },
  { name: "萨拉赫",     pos: "FW", rating: 89, league: "英超", nation: "埃及",     club: "利物浦",       legend: false },
  { name: "凯恩",       pos: "FW", rating: 89, league: "德甲", nation: "英格兰",   club: "拜仁慕尼黑",   legend: false },
  { name: "莱万",       pos: "FW", rating: 88, league: "西甲", nation: "波兰",     club: "巴塞罗那",     legend: false },
  { name: "萨卡",       pos: "FW", rating: 87, league: "英超", nation: "英格兰",   club: "阿森纳",       legend: false },
  { name: "劳塔罗",     pos: "FW", rating: 87, league: "意甲", nation: "阿根廷",   club: "国际米兰",     legend: false },
  { name: "莱奥",       pos: "FW", rating: 86, league: "意甲", nation: "葡萄牙",   club: "AC米兰",       legend: false },
  { name: "登贝莱",     pos: "FW", rating: 86, league: "法甲", nation: "法国",     club: "巴黎圣日耳曼", legend: false },
  { name: "格列兹曼",   pos: "FW", rating: 86, league: "西甲", nation: "法国",     club: "马德里竞技",   legend: false },
  { name: "孙兴慜",     pos: "FW", rating: 87, league: "英超", nation: "韩国",     club: "热刺",         legend: false },
  { name: "奥斯梅恩",   pos: "FW", rating: 86, league: "法甲", nation: "尼日利亚", club: "那不勒斯",     legend: false },
  { name: "伊萨克",     pos: "FW", rating: 85, league: "英超", nation: "瑞典",     club: "纽卡斯尔",     legend: false },
  { name: "亚马尔",     pos: "FW", rating: 85, league: "西甲", nation: "西班牙",   club: "巴塞罗那",     legend: false },
  { name: "吉拉西",     pos: "FW", rating: 84, league: "德甲", nation: "几内亚",   club: "多特蒙德",     legend: false },
  { name: "克瓦拉茨赫利亚", pos: "FW", rating: 85, league: "法甲", nation: "格鲁吉亚", club: "巴黎圣日耳曼", legend: false },
  // 退役传奇
  { name: "梅西",       pos: "FW", rating: 98, league: "西甲", nation: "阿根廷",   club: "巴塞罗那",     legend: true },
  { name: "C罗",        pos: "FW", rating: 96, league: "西甲", nation: "葡萄牙",   club: "皇家马德里",   legend: true },
  { name: "贝利",       pos: "FW", rating: 97, league: "法甲", nation: "巴西",     club: "桑托斯",       legend: true },
  { name: "罗纳尔多",   pos: "FW", rating: 96, league: "西甲", nation: "巴西",     club: "皇家马德里",   legend: true },
  { name: "马拉多纳",   pos: "FW", rating: 97, league: "意甲", nation: "阿根廷",   club: "那不勒斯",     legend: true },
  { name: "亨利",       pos: "FW", rating: 92, league: "英超", nation: "法国",     club: "阿森纳",       legend: true },
  { name: "埃托奥",     pos: "FW", rating: 89, league: "西甲", nation: "喀麦隆",   club: "巴塞罗那",     legend: true },
  { name: "巴蒂斯图塔", pos: "FW", rating: 90, league: "意甲", nation: "阿根廷",   club: "佛罗伦萨",     legend: true },
  { name: "舍甫琴科",   pos: "FW", rating: 91, league: "意甲", nation: "乌克兰",   club: "AC米兰",       legend: true },
  { name: "劳尔",       pos: "FW", rating: 90, league: "西甲", nation: "西班牙",   club: "皇家马德里",   legend: true },
  { name: "因扎吉",     pos: "FW", rating: 88, league: "意甲", nation: "意大利",   club: "AC米兰",       legend: true },
  { name: "德尔·皮耶罗", pos: "FW", rating: 90, league: "意甲", nation: "意大利",  club: "尤文图斯",     legend: true },
  { name: "托蒂",       pos: "FW", rating: 90, league: "意甲", nation: "意大利",   club: "罗马",         legend: true },
  { name: "罗马里奥",   pos: "FW", rating: 92, league: "西甲", nation: "巴西",     club: "巴塞罗那",     legend: true },
  { name: "德罗巴",     pos: "FW", rating: 89, league: "英超", nation: "科特迪瓦", club: "切尔西",       legend: true },
];

// ============================================================
// 对手队名 — 足球梗（足球人看了会心一笑，无攻击性）
// ============================================================
const OPPONENT_NAMES = [
  "VAR受害者联",
  "越位线舞者",
  "补时绝杀专业户",
  "点球不进FC",
  "转会窗最后一天",
  "伤停补时十分钟",
  "更衣室气氛组",
  "友谊赛球王联",
  "合同年爆种队",
  "手球没看见FC",
  "金球陪跑者",
  "三天两头伤病连",
  "赛前训练缺席",
  "乌龙球艺术团",
  "裁判的好朋友",
  "夏天新签的",
  "替补席采暖队",
  "集锦球王联",
  "客场虫FC",
  "横梁亲吻者",
  "球衣号码争夺战",
  "赛前热身球王",
  "集锦从来不传",
  "更衣室DJ",
  "口水战冠军",
  "季前赛无敌",
  "夏天胖十斤",
  "经纪人最爱",
  "球衣收集者",
  "角旗杆舞王",
];

// 联赛颜色映射
const LEAGUE_COLORS = {
  "英超": "#8B0000",
  "西甲": "#FF6600",
  "意甲": "#0066CC",
  "德甲": "#CC0000",
  "法甲": "#1A237E",
};

// 位置中文名
const POS_NAMES = {
  "GK": "门将",
  "DF": "后卫",
  "MF": "中场",
  "FW": "前锋",
};

// 位置顺序
const POS_ORDER = ["GK", "DF", "MF", "FW"];

// 每个位置抽卡数量
const POOL_SIZES = { GK: 2, DF: 5, MF: 6, FW: 5 };

// 阵型定义
const FORMATIONS = {
  "4-4-2": { GK: 1, DF: 4, MF: 4, FW: 2, label: "4-4-2 均衡" },
  "4-3-3": { GK: 1, DF: 4, MF: 3, FW: 3, label: "4-3-3 进攻" },
  "3-5-2": { GK: 1, DF: 3, MF: 5, FW: 2, label: "3-5-2 中场" },
  "4-5-1": { GK: 1, DF: 4, MF: 5, FW: 1, label: "4-5-1 控球" },
  "3-4-3": { GK: 1, DF: 3, MF: 4, FW: 3, label: "3-4-3 全攻" },
  "5-3-2": { GK: 1, DF: 5, MF: 3, FW: 2, label: "5-3-2 防守" },
  "5-4-1": { GK: 1, DF: 5, MF: 4, FW: 1, label: "5-4-1 铁桶" },
};

// 随机评语池
const MATCH_COMMENTS = [
  "一场酣畅淋漓的对攻大战！",
  "铁血防守让对手毫无脾气。",
  "绝杀进球让全场沸腾！",
  "门将的神级扑救挽救了球队。",
  "中场大师级表演掌控全局。",
  "前锋的帽子戏法载入史册。",
  "红牌改变了比赛的走向。",
  "替补奇兵登场即建功。",
  "点球大战般的紧张氛围。",
  "反击如闪电般撕裂防线。",
  "这场胜利实至名归。",
  "冷门！弱队掀翻了强队！",
  "乌龙球让场面一度尴尬。",
  "横梁救了对手一命。",
  "全场压制却得势不得分。",
];
