import React from 'react';
import { 
  Plus, Home, Key, Users2, FileSpreadsheet, Hammer, LineChart, 
  HelpCircle, Settings, ClipboardList, CheckCircle2, ChevronRight, Activity
} from 'lucide-react';
import { PropertyDraft, TaskItem } from '../types';

interface SidebarProps {
  onOpenCreatePanel: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  propertyDrafts: PropertyDraft[];
  todoList: TaskItem[];
  onFocusOverview: () => void;
}

export default function Sidebar({
  onOpenCreatePanel,
  activeTab,
  setActiveTab,
  propertyDrafts,
  todoList,
  onFocusOverview
}: SidebarProps) {
  // Navigation Menu list
  const navItems = [
    { id: 'dashboard', name: '工作台首页', icon: Home, desc: '工作台核心概览区' },
    { id: 'properties', name: '房源管理', icon: Key, desc: '底层资产及楼宇索引' },
    { id: 'crm', name: '客源关系 (CRM)', icon: Users2, desc: '租客与买方资料库' },
    { id: 'contracts', name: '合同租约', icon: FileSpreadsheet, desc: '合约与付款条件' },
    { id: 'workorders', name: '工单保障', icon: Hammer, desc: '突发保修与运维催办' },
    { id: 'analytics', name: '效能分析', icon: LineChart, desc: '转化率与流失度盘点' }
  ];

  // Calculate active draft workflows
  const activeDraftsCount = propertyDrafts.length;
  const pendingTodosCount = todoList.filter(t => t.status !== 'completed').length;
  const totalIncompleteCount = activeDraftsCount + pendingTodosCount;

  // Average progress of active drafts (6-step business onboarding)
  const avgProgress = activeDraftsCount > 0
    ? Math.round((propertyDrafts.reduce((acc, d) => acc + Math.round((d.currentStep / 6) * 100), 0) / activeDraftsCount))
    : 0;

  return (
    <aside id="workspace-sidebar" className="w-64 bg-slate-950 text-slate-300 border-r border-slate-900 flex flex-col h-screen shrink-0 font-sans relative">
      {/* Brand area */}
      <div className="p-6 border-b border-slate-900 flex items-center space-x-3">
        <div className="w-8.5 h-8.5 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/30 font-display font-black text-sm tracking-tighter">
          PM
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-100 tracking-tight font-display">PM++ 智慧协同工作台</h1>
          <p className="text-[10px] text-indigo-400 font-mono">WORKSPACE V1.1.0</p>
        </div>
      </div>

      {/* Primary Actions Area */}
      <div className="p-4 border-b border-slate-900">
        <button
          id="unified-sidebar-create-btn"
          onClick={onOpenCreatePanel}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-md shadow-indigo-650/25 border border-indigo-500 hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="bg-indigo-500 p-0.5 rounded-md text-white group-hover:scale-110 transition-transform">
            <Plus className="w-3.5 h-3.5 stroke-[3px]" />
          </div>
          <span className="font-sans">统一新建业务 (Create)</span>
        </button>
      </div>

      {/* Navigation menu list */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-500 px-3 pb-2 uppercase tracking-wider font-display">
          业务板块导航
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer group ${
                isActive 
                  ? 'bg-slate-900 text-indigo-400 font-bold border-l-2 border-indigo-500' 
                  : 'hover:bg-slate-900/50 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{item.name}</span>
              </div>
              <span className="text-[9px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                SELECT
              </span>
            </button>
          );
        })}
      </nav>

      {/* Task Progress Tracker (Redesigned Rocket Replacement) */}
      <div 
        id="task-progress-tracker-box" 
        onClick={onFocusOverview}
        className={`m-4 p-4 rounded-xl cursor-pointer transition-all flex flex-col space-y-3 shadow-inner ${
          activeTab === 'task-hub'
            ? 'bg-indigo-950/90 border-2 border-indigo-500 shadow-md shadow-indigo-900/20 text-slate-100'
            : 'bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
        }`}
        title="点击直接定位和恢复进行中的流程及待办事项"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-indigo-950 flex items-center justify-center text-indigo-400 border border-indigo-900">
              <Activity className="w-3.5 h-3.5 animate-pulse-subtle" />
            </div>
            <span className="text-xs font-bold text-slate-200">任务进度器</span>
          </div>
          {totalIncompleteCount > 0 ? (
            <span className="bg-indigo-900 text-indigo-200 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full animate-bounce">
              {totalIncompleteCount} 项进行中
            </span>
          ) : (
            <span className="bg-slate-800 text-slate-400 text-[9px] font-mono px-1.5 py-0.5 rounded-full">
              无积压
            </span>
          )}
        </div>

        {activeDraftsCount > 0 ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400 truncate max-w-[70%]">
                正在建档: {propertyDrafts[propertyDrafts.length - 1].propertyName || '新房源'}
              </span>
              <span className="font-mono text-indigo-400 font-bold">{avgProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${avgProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-[10px] text-slate-400 leading-snug">
            没有暂停的步骤流程。点击上方<span className="text-indigo-400 font-bold">新建</span>发起房源建档、员工入职或工单。
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-500 hover:text-indigo-400 transition-colors">
          <span>查看待办与中断点恢复</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-slate-900 flex items-center justify-between bg-slate-950">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
            W
          </div>
          <div className="truncate max-w-[120px]">
            <p className="text-xs font-bold text-slate-200 truncate">吴经理</p>
            <p className="text-[10px] text-slate-500 truncate">项目总管 (Admin)</p>
          </div>
        </div>
        <button className="text-slate-600 hover:text-slate-400 p-1 rounded-lg hover:bg-slate-900 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
