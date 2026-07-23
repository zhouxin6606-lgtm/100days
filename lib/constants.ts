export const UI_TEXT = {
  nav: {
    dashboard: "仪表盘",
    checkin: "打卡",
    groups: "学习小组",
    profile: "个人中心",
    logout: "退出登录",
  },
  checkin: {
    title: "今日打卡",
    button: "打卡",
    duration: "学习时长（分钟）",
    notes: "学习笔记",
    group: "打卡到小组",
    noGroup: "仅个人打卡",
    success: "打卡成功！",
    alreadyCheckedIn: "今天已打卡",
  },
  streak: {
    current: "连续打卡",
    longest: "最长连续",
    total: "累计天数",
    days: "天",
  },
  group: {
    title: "学习小组",
    create: "创建小组",
    join: "加入小组",
    inviteCode: "邀请码",
    members: "成员",
    feed: "动态",
    leaderboard: "排行榜",
    groupName: "小组名称",
    description: "小组描述",
    createSuccess: "小组创建成功！",
    joinSuccess: "加入成功！",
    copyInviteCode: "复制邀请码",
    copied: "已复制",
  },
  profile: {
    title: "个人中心",
    level: "等级",
    xp: "经验值",
    achievements: "成就",
    editProfile: "编辑资料",
    save: "保存",
  },
  auth: {
    login: "登录",
    signup: "注册",
    email: "邮箱",
    password: "密码",
    displayName: "昵称",
    loginTitle: "欢迎回来",
    signupTitle: "开始你的学习之旅",
    noAccount: "还没有账号？",
    hasAccount: "已有账号？",
  },
  common: {
    loading: "加载中...",
    error: "出错了",
    retry: "重试",
    cancel: "取消",
    confirm: "确认",
    today: "今天",
  },
} as const;

export const ACHIEVEMENT_TYPES = {
  FIRST_CHECKIN: "first_checkin",
  STREAK_7: "streak_7",
  STREAK_30: "streak_30",
  STREAK_100: "streak_100",
} as const;

export const ACHIEVEMENT_LABELS: Record<string, string> = {
  first_checkin: "初次打卡",
  streak_7: "坚持一周",
  streak_30: "月度达人",
  streak_100: "百日征途",
};

export const ACHIEVEMENT_ICONS: Record<string, string> = {
  first_checkin: "🎯",
  streak_7: "🔥",
  streak_30: "⭐",
  streak_100: "👑",
};
