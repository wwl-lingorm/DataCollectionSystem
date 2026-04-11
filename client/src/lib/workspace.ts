export type UserRole = "enterprise" | "city" | "province";

export interface WorkspaceMenuItem {
  label: string;
  description: string;
  path: string;
}

export const roleMeta: Record<UserRole, { label: string; home: string; menus: WorkspaceMenuItem[] }> = {
  enterprise: {
    label: "企业端",
    home: "/app/enterprise/home",
    menus: [
      { label: "首页", description: "概览与待办", path: "/app/enterprise/home" },
      { label: "备案填报", description: "企业基础信息", path: "/app/enterprise/filing" },
      { label: "月报上报", description: "就业失业数据", path: "/app/enterprise/reports" },
      { label: "通知中心", description: "公告与提醒", path: "/app/enterprise/notices" },
      { label: "数据交换", description: "对接与回执", path: "/app/enterprise/exchange" }
    ]
  },
  city: {
    label: "市级端",
    home: "/app/city/home",
    menus: [
      { label: "首页", description: "审核概览", path: "/app/city/home" },
      { label: "备案审核", description: "企业申报审批", path: "/app/city/review" },
      { label: "通知中心", description: "下发与回看", path: "/app/city/notices" },
      { label: "数据交换", description: "回传国家系统", path: "/app/city/exchange" }
    ]
  },
  province: {
    label: "省级端",
    home: "/app/province/home",
    menus: [
      { label: "首页", description: "全局概览", path: "/app/province/home" },
      { label: "汇总报表", description: "统计与导出", path: "/app/province/summary" },
      { label: "图表分析", description: "趋势洞察", path: "/app/province/analysis" },
      { label: "通知中心", description: "全省公告", path: "/app/province/notices" },
      { label: "数据交换", description: "国家接口", path: "/app/province/exchange" },
      { label: "系统管理", description: "权限与配置", path: "/app/province/settings" }
    ]
  }
};
