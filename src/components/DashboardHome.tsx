import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Users, DollarSign, Key, ShieldAlert, 
  Flame, CheckCircle2, ChevronDown, ChevronUp,
  Sparkles, Info, Building2, LayoutGrid, BarChart3, PieChart,
  Calendar, CheckCircle, Clock, CheckSquare, Plus, ArrowRight
} from 'lucide-react';
import { PropertyDraft, TaskItem } from '../types';

interface DashboardHomeProps {
  propertyDrafts: PropertyDraft[];
  todoList: TaskItem[];
  committedAssets: any[];
  onLaunchDraft: (draftId: string) => void;
  onUrgeTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onAddTodo: (todo: TaskItem) => void;
  setActiveTab: (tab: string) => void;
}

export default function DashboardHome({
  propertyDrafts,
  todoList,
  committedAssets,
  onLaunchDraft,
  onUrgeTask,
  onCompleteTask,
  onAddTodo,
  setActiveTab
}: DashboardHomeProps) {

  // Expanded states for Alerts and Todos (collapsed by default)
  const [expandedAlertId, setExpandedAlertId] = React.useState<string | null>(null);
  const [expandedTodoId, setExpandedTodoId] = React.useState<string | null>(null);
  
  // Interactive tab for Left Column Chart Analytics
  const [analyticsTab, setAnalyticsTab] = React.useState<'conversion' | 'assets' | 'revenue'>('conversion');

  // Stats calculation
  const pendingTodos = todoList.filter(t => t.status !== 'completed');
  const urgentTodos = pendingTodos.filter(t => t.priority === 'high' || t.status === 'urging');
  const normalTodos = pendingTodos.filter(t => t.priority !== 'high' && t.status !== 'urging');
  const totalAssetsCount = committedAssets.length;
  
  const residentialCount = committedAssets.filter(a => a.type === 'residential').length;
  const commercialCount = committedAssets.filter(a => a.type === 'commercial').length;
  const industrialCount = committedAssets.filter(a => a.type === 'industrial').length;

  // Render mock alerts based on draft data
  const hasIncompleteOwnership = propertyDrafts.some(d => !d.ownerName);
  const incompleteDraftsCount = propertyDrafts.filter(d => !d.ownerName).length;

  return (
    <div id="dashboard-home-rebuilt" className="space-y-6 font-sans">
      
      {/* SECTION 1: Top Indicators (Condensed & Elegant) */}
      <div id="condensed-stats-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Occupancy */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">综合出租率</span>
            <span className="text-xl font-bold font-mono text-indigo-950 block">88.5%</span>
            <div className="flex items-center text-[9px] text-emerald-600 font-bold">
              <TrendingUp className="w-2.5 h-2.5 mr-0.5 shrink-0" />
              <span>本月提升 2.4%</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Key className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 2: Asset Inventory */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">在册项目资产</span>
            <span className="text-xl font-bold font-mono text-gray-900 block">{totalAssetsCount} <span className="text-[10px] text-gray-400 font-normal">个登记</span></span>
            <span className="text-[9px] text-slate-500 block">多物理维度归档就绪</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 3: Approvals */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">待签批租约</span>
            <span className="text-xl font-bold font-mono text-gray-900 block">12 <span className="text-[10px] text-gray-400 font-normal">宗待阅</span></span>
            <span className="text-[9px] text-indigo-600 font-bold cursor-pointer hover:underline" onClick={() => setActiveTab('contracts')}>
              起草新合同 →
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 4: Operations Flow */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">今日认租流水</span>
            <span className="text-xl font-bold font-mono text-rose-600 block">¥245,800</span>
            <span className="text-[9px] text-slate-400 block">当月指标达成 94.2%</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* SECTION 2: Split Columns */}
      <div id="split-dashboard-content" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: Charts & Operational Analysis (Span 7) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-3xs space-y-4">
            
            {/* Analysis Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
              <div className="flex items-center space-x-1.5 text-gray-900">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider font-display">经营概览与多维分析大盘</span>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 text-[10px] font-bold">
                <button 
                  onClick={() => setAnalyticsTab('conversion')}
                  className={`px-2.5 py-1 rounded transition-all ${analyticsTab === 'conversion' ? 'bg-indigo-600 text-white shadow-3xs' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  出租转换趋势
                </button>
                <button 
                  onClick={() => setAnalyticsTab('assets')}
                  className={`px-2.5 py-1 rounded transition-all ${analyticsTab === 'assets' ? 'bg-indigo-600 text-white shadow-3xs' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  资产分布大盘
                </button>
                <button 
                  onClick={() => setAnalyticsTab('revenue')}
                  className={`px-2.5 py-1 rounded transition-all ${analyticsTab === 'revenue' ? 'bg-indigo-600 text-white shadow-3xs' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  财务收支分析
                </button>
              </div>
            </div>

            {/* Render Tab Contents */}
            <div className="min-h-[180px] flex flex-col justify-between">
              {analyticsTab === 'conversion' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold block">本周日租转换效能曲线</span>
                      <p className="text-xs text-gray-600 mt-0.5">从客户询盘到实体签约落地转化率为 <span className="font-bold text-indigo-600">68.2%</span>，高于行业平均水平。</p>
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono font-bold px-1.5 py-0.5 rounded">
                      ✓ EXQUISITE PERFORMANCE
                    </span>
                  </div>

                  {/* SVG Chart */}
                  <div className="relative h-28 bg-slate-50/50 rounded-lg border border-slate-100 p-2 overflow-hidden flex items-end">
                    {/* Simplified Elegant Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
                      <div className="border-b border-gray-100 w-full h-0" />
                      <div className="border-b border-gray-100 w-full h-0" />
                      <div className="border-b border-gray-100 w-full h-0" />
                    </div>

                    <svg className="w-full h-24 overflow-visible" viewBox="0 0 450 100" preserveAspectRatio="none">
                      <path
                        d="M 10,85 C 50,75 100,90 150,45 C 200,35 250,15 300,28 C 350,10 400,35 440,8"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      {/* Gradient fill */}
                      <path
                        d="M 10,85 C 50,75 100,90 150,45 C 200,35 250,15 300,28 C 350,10 400,35 440,8 L 440,100 L 10,100 Z"
                        fill="url(#indigo-gradient-fill)"
                        opacity="0.12"
                      />
                      {/* Data Dots */}
                      <circle cx="150" cy="45" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="300" cy="28" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="440" cy="8" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                      
                      <defs>
                        <linearGradient id="indigo-gradient-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4f46e5" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Horizontal Chart Labeling */}
                  <div className="flex justify-between text-[9px] font-semibold text-gray-400 font-mono px-1">
                    <span>周一 (Mon)</span>
                    <span>周二 (Tue)</span>
                    <span>周三 (Wed)</span>
                    <span>周四 (Thu)</span>
                    <span>周五 (Fri)</span>
                    <span>周六 (Sat)</span>
                    <span>周日 (Sun)</span>
                  </div>
                </div>
              )}

              {analyticsTab === 'assets' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold block">资产细分分布占比 (按物权形态)</span>
                      <p className="text-xs text-gray-600 mt-0.5">本级大盘当前以 <span className="font-semibold text-indigo-700">住宅和商业写字楼</span> 托管为核心，物理房间总量为 3,500 间。</p>
                    </div>
                  </div>

                  {/* Horizontal multi-color bar represention */}
                  <div className="space-y-3">
                    <div className="w-full bg-slate-100 h-6 rounded-lg overflow-hidden flex font-mono text-[9px] font-bold text-white">
                      <div className="bg-amber-500 h-full flex items-center justify-center transition-all" style={{ width: '45%' }}>
                        住宅 (45%)
                      </div>
                      <div className="bg-indigo-600 h-full flex items-center justify-center transition-all" style={{ width: '35%' }}>
                        写字楼 (35%)
                      </div>
                      <div className="bg-purple-600 h-full flex items-center justify-center transition-all" style={{ width: '20%' }}>
                        厂房 (20%)
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-1">
                      <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <div>
                          <span className="text-[9px] text-gray-400 block font-semibold">住宅物业</span>
                          <span className="text-xs font-bold font-mono text-gray-800">{residentialCount} 个项目</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                        <div>
                          <span className="text-[9px] text-gray-400 block font-semibold">商业写字楼</span>
                          <span className="text-xs font-bold font-mono text-gray-800">{commercialCount} 个项目</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-100 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                        <div>
                          <span className="text-[9px] text-gray-400 block font-semibold">厂房仓储</span>
                          <span className="text-xs font-bold font-mono text-gray-800">{industrialCount} 个项目</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {analyticsTab === 'revenue' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold block">今日财务流向比例</span>
                      <p className="text-xs text-gray-600 mt-0.5">今日录得入账 ¥245.8k，主要得益于季度集中招商的批量回笼结清。</p>
                    </div>
                  </div>

                  {/* Elegant vertical progress bars for comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
                      <div className="flex items-center justify-between text-emerald-800">
                        <span className="text-[10px] font-bold">实收应收收回账款</span>
                        <span className="text-xs font-bold font-mono">¥210,000</span>
                      </div>
                      <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: '85%' }} />
                      </div>
                      <p className="text-[9px] text-emerald-600">已达成本月收租预期任务的 85.0%</p>
                    </div>

                    <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 space-y-2">
                      <div className="flex items-center justify-between text-rose-800">
                        <span className="text-[10px] font-bold">应缴物业折损支出</span>
                        <span className="text-xs font-bold font-mono">¥35,800</span>
                      </div>
                      <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: '30%' }} />
                      </div>
                      <p className="text-[9px] text-rose-600">支出控制在合规计划配额的 30% 以内</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Business Analysis Bottom metrics block */}
          <div className="bg-slate-50 border border-gray-150 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 text-[10px] block font-semibold">招商周转均效</span>
              <span className="font-bold text-gray-800 font-mono block text-sm">3.2 天内签约</span>
              <p className="text-[9px] text-emerald-600 font-semibold">✓ 跑赢去年同期</p>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-200 sm:pl-4">
              <span className="text-gray-400 text-[10px] block font-semibold">物产权属真实合规率</span>
              <span className="font-bold text-gray-800 font-mono block text-sm">99.1% 已验证</span>
              <p className="text-[9px] text-indigo-600 font-semibold">✓ 集团内A级水准</p>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-200 sm:pl-4">
              <span className="text-gray-400 text-[10px] block font-semibold">极速协同响应时效</span>
              <span className="font-bold text-gray-800 font-mono block text-sm">15.4 分钟响应</span>
              <p className="text-[9px] text-emerald-600 font-semibold">✓ 指标在优秀区间</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive alerts and collapsible todos (Span 5) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* CARD A: 紧急提醒与异常 (Urgent alerts, collapsed by default, click to expand) */}
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-xl p-4 space-y-3 shadow-3xs">
            <div className="flex items-center justify-between border-b border-rose-150 pb-2">
              <div className="flex items-center space-x-1.5 text-rose-800">
                <ShieldAlert className="w-4 h-4 shrink-0 animate-bounce-subtle" />
                <span className="text-xs font-bold font-display uppercase tracking-wider">紧急事项催办 ({urgentTodos.length + (hasIncompleteOwnership ? 1 : 0)})</span>
              </div>
              <span className="text-[9px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded font-mono">
                CRITICAL
              </span>
            </div>

            <div className="space-y-2">
              
              {/* Alert item 1: Incomplete property documents */}
              {hasIncompleteOwnership && (
                <div className="bg-white rounded-lg border border-rose-100 shadow-3xs overflow-hidden">
                  <div 
                    onClick={() => setExpandedAlertId(expandedAlertId === 'ownership-incomplete' ? null : 'ownership-incomplete')}
                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span className="font-bold text-gray-900 truncate max-w-[190px]">⚠️ 缺失产权主体关键证件 ({incompleteDraftsCount}个房源)</span>
                    </div>
                    {expandedAlertId === 'ownership-incomplete' ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                  </div>

                  <AnimatePresence>
                    {expandedAlertId === 'ownership-incomplete' && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pt-1 border-t border-gray-100 text-[11px] text-gray-600 bg-slate-50/50 space-y-2 leading-relaxed">
                          <p>
                            有进行中的房源建档流程处于暂存状态，大房东身份证或权属核验扫描原件缺失。该隐患将阻止该房源通过法务初审。
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-rose-600 font-bold">建议立即前往任务进度器补录</span>
                            <button 
                              onClick={() => setActiveTab('task-hub')}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-3xs flex items-center space-x-0.5"
                            >
                              <span>去补录</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Alert items: High Priority Tasks */}
              {todoList.filter(t => t.priority === 'high' && t.status !== 'completed').map(task => (
                <div key={task.id} className="bg-white rounded-lg border border-rose-100 shadow-3xs overflow-hidden">
                  <div 
                    onClick={() => setExpandedAlertId(expandedAlertId === task.id ? null : task.id)}
                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 animate-pulse-subtle" />
                      <span className="font-bold text-gray-900 truncate max-w-[190px]">🔥 突发催办: {task.title}</span>
                    </div>
                    {expandedAlertId === task.id ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                  </div>

                  <AnimatePresence>
                    {expandedAlertId === task.id && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pt-1 border-t border-gray-100 text-[11px] text-gray-600 bg-slate-50/50 space-y-2 leading-relaxed">
                          <p>{task.description}</p>
                          <div className="flex flex-wrap items-center justify-between text-[10px] text-gray-400 pt-1">
                            <span>指派责任人: <span className="text-gray-600 font-semibold">{task.assignee}</span></span>
                            <div className="flex items-center space-x-1.5">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUrgeTask(task.id);
                                }}
                                className="text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded font-bold"
                              >
                                再次催办
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCompleteTask(task.id);
                                }}
                                className="text-white bg-slate-900 hover:bg-slate-800 px-2 py-0.5 rounded font-bold"
                              >
                                标为办结
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Empty state for alerts */}
              {(!hasIncompleteOwnership && todoList.filter(t => t.priority === 'high' && t.status !== 'completed').length === 0) && (
                <div className="bg-white/80 p-4 rounded-lg border border-dashed border-rose-200 text-center text-[11px] text-gray-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                  <p className="font-bold text-gray-700">暂无需要紧急催办的异常事项</p>
                  <p className="opacity-60">运营环境优良，所有高风险待办均已正常处置。</p>
                </div>
              )}
            </div>
          </div>

          {/* CARD B: 今日协同待办摘要 (Todo tasks, below alerts, also collapsed by default, click to expand) */}
          <div className="bg-white border border-gray-150 rounded-xl p-4 space-y-3 shadow-3xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center space-x-1.5 text-gray-900">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold font-display uppercase tracking-wider">今日普通待办摘要 ({normalTodos.length})</span>
              </div>
              <button 
                onClick={() => setActiveTab('task-hub')}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
              >
                进入完整任务舱 →
              </button>
            </div>

            <div className="space-y-2">
              {normalTodos.length === 0 ? (
                <div className="py-6 text-center text-[11px] text-gray-400">
                  <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                  <p className="font-bold text-gray-700">🎉 今日已无普通协同积压工单</p>
                  <p className="opacity-60 mt-0.5">普通协同队列状态全部绿灯。</p>
                </div>
              ) : (
                normalTodos.map(task => (
                  <div key={task.id} className="bg-slate-50/50 rounded-lg border border-gray-150 overflow-hidden">
                    <div 
                      onClick={() => setExpandedTodoId(expandedTodoId === task.id ? null : task.id)}
                      className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition-colors"
                    >
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span className="font-bold text-gray-800 truncate max-w-[200px]">{task.title}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-mono uppercase font-bold">
                          {task.module}
                        </span>
                        {expandedTodoId === task.id ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedTodoId === task.id && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 pt-1 border-t border-gray-150 text-[11px] text-gray-600 bg-white space-y-2 leading-relaxed">
                            <p>{task.description}</p>
                            <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                              <span>协同人: <span className="text-gray-600 font-semibold">{task.assignee}</span></span>
                              <div className="flex items-center space-x-1.5">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUrgeTask(task.id);
                                  }}
                                  className="text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded font-bold"
                                >
                                  催办
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onCompleteTask(task.id);
                                  }}
                                  className="text-white bg-slate-900 hover:bg-slate-800 px-2 py-0.5 rounded font-bold"
                                >
                                  结办
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats Panel for conversion rate */}
          <div id="quick-cooperation-helper-condensed" className="bg-slate-50 border border-gray-150 rounded-xl p-4 space-y-2">
            <h4 className="text-[11px] font-bold text-gray-800 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>智能协作助手建议</span>
            </h4>
            <p className="text-[10px] text-gray-500 leading-normal">
              集团已开启多渠道自动催收和房东原件交叉认证机制。请在需要暂存断点、补录房源信息时，点击左下角的【任务进度器】进行统一管控恢复。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
