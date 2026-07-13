import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Users, DollarSign, Key, ShieldAlert, 
  Flame, CheckCircle2, ChevronDown, ChevronUp,
  Sparkles, Info, Building2, LayoutGrid, BarChart3, PieChart,
  Calendar, CheckCircle, Clock, CheckSquare, Plus, ArrowRight,
  Percent, ShieldCheck, AlertCircle, TrendingDown, Target, Activity,
  Briefcase
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

  // Collapsible alert and todo states
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);
  const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null);
  
  // Analytics and filter interactive states
  const [analyticsTab, setAnalyticsTab] = useState<'conversion' | 'assets' | 'revenue'>('conversion');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(4); // Default to Friday (today)
  const [selectedAssetCategory, setSelectedAssetCategory] = useState<'residential' | 'commercial' | 'industrial'>('commercial');
  const [financialProjectionYears, setFinancialProjectionYears] = useState<number>(3); // Slider simulation
  const [revenueTargetSlider, setRevenueTargetSlider] = useState<number>(85); // 85% occupancy rate target

  // Stats calculation
  const pendingTodos = todoList.filter(t => t.status !== 'completed');
  const urgentTodos = pendingTodos.filter(t => t.priority === 'high' || t.status === 'urging');
  const normalTodos = pendingTodos.filter(t => t.priority !== 'high' && t.status !== 'urging');
  const totalAssetsCount = committedAssets.length;
  
  const residentialCount = committedAssets.filter(a => a.type === 'residential').length;
  const commercialCount = committedAssets.filter(a => a.type === 'commercial').length;
  const industrialCount = committedAssets.filter(a => a.type === 'industrial').length;

  const hasIncompleteOwnership = propertyDrafts.some(d => !d.ownerName);
  const incompleteDraftsCount = propertyDrafts.filter(d => !d.ownerName).length;

  // Chart Data 1: Weekly Detailed Rental Conversion Breakdown
  const weeklyConversionData = [
    { day: '周一 (Mon)', leads: 42, signings: 25, rate: 59.5, desc: '周初接待活跃，新开商户意向高' },
    { day: '周二 (Tue)', leads: 38, signings: 22, rate: 57.8, desc: '老项目流转加快，追加签约集中' },
    { day: '周三 (Wed)', leads: 55, signings: 39, rate: 70.9, desc: '集团签约日，集中完成线上核验' },
    { day: '周四 (Thu)', leads: 48, signings: 31, rate: 64.5, desc: '产权资料集中过审，转化平稳' },
    { day: '周五 (Fri)', leads: 62, signings: 46, rate: 74.2, desc: '今日极速协作，线下带看与认签双高' },
    { day: '周六 (Sat)', leads: 29, signings: 18, rate: 62.0, desc: '周末非工作日，主要承接散客带看' },
    { day: '周日 (Sun)', leads: 25, signings: 15, rate: 60.0, desc: '周尾盘点，待办单据整理归档' },
  ];

  // Chart Data 2: Asset projects detail list by selected category
  const assetProjectDetails = {
    residential: [
      { name: '绿城江南里·江景公寓', rooms: '320 间', occupancy: '94.2%', revenue: '¥310,000/月', status: '优质托管' },
      { name: '万科翡翠华章·华府', rooms: '180 间', occupancy: '89.5%', revenue: '¥185,000/月', status: '平稳运营' },
      { name: '金地自在城·云锦园', rooms: '240 间', occupancy: '82.0%', revenue: '¥210,000/月', status: '租约调整中' },
    ],
    commercial: [
      { name: '东方智谷总部大厦 A座', rooms: '1,2000 ㎡', occupancy: '91.8%', revenue: '¥1,450,000/月', status: '重点核心' },
      { name: '张江科技港创客大厦 B栋', rooms: '8,500 ㎡', occupancy: '86.4%', revenue: '¥980,000/月', status: '签约活跃' },
      { name: '虹桥瑞创广场 C座写字楼', rooms: '6,200 ㎡', occupancy: '85.0%', revenue: '¥720,000/月', status: '资料待补录' },
    ],
    industrial: [
      { name: '临港智慧物流云仓 A区', rooms: '15,000 ㎡', occupancy: '100%', revenue: '¥640,000/月', status: '满租运行' },
      { name: '漕河泾高新智造车间一期', rooms: '22,000 ㎡', occupancy: '92.5%', revenue: '¥1,120,000/月', status: '高粘度托管' },
      { name: '松江高科技加工基地 C座', rooms: '10,000 ㎡', occupancy: '78.0%', revenue: '¥410,000/月', status: '部分腾退' },
    ]
  };

  // Chart Data 3: Financial Multi-Series comparisons
  const quarterlyFinancials = [
    { quarter: '第一季度 (Q1)', projected: 180, realized: 172, expenses: 31, variance: -8 },
    { quarter: '第二季度 (Q2)', projected: 220, realized: 228, expenses: 35, variance: 8 },
    { quarter: '第三季度 (Q3)', projected: 250, realized: 245, expenses: 38, variance: -5 },
    { quarter: '第四季度 (Q4)', projected: 300, realized: 312, expenses: 42, variance: 12 },
  ];

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
              <span>本月提升 2.4% (跑赢目标)</span>
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
            <span className="text-[9px] text-slate-500 block">3大类目物理房间托管</span>
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
            <span className="text-[9px] text-indigo-600 font-bold cursor-pointer hover:underline animate-pulse-subtle" onClick={() => setActiveTab('contracts')}>
              点此极速审阅合同 →
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

      {/* SECTION 2: Split Columns (Fully aligned and visual balanced) */}
      <div id="split-dashboard-content" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COLUMN: Charts & Operational Analysis (Span 8) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
          <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-3xs flex-1 flex flex-col justify-between space-y-4">
            
            {/* Analysis Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-3">
              <div className="flex items-center space-x-1.5 text-gray-900">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider font-display">核心经营分析与决策大盘</span>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 text-[10px] font-bold shrink-0">
                <button 
                  onClick={() => setAnalyticsTab('conversion')}
                  className={`px-3 py-1 rounded transition-all ${analyticsTab === 'conversion' ? 'bg-indigo-600 text-white shadow-3xs' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  出租转换趋势 (互动)
                </button>
                <button 
                  onClick={() => setAnalyticsTab('assets')}
                  className={`px-3 py-1 rounded transition-all ${analyticsTab === 'assets' ? 'bg-indigo-600 text-white shadow-3xs' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  资产分布组合 (联动)
                </button>
                <button 
                  onClick={() => setAnalyticsTab('revenue')}
                  className={`px-3 py-1 rounded transition-all ${analyticsTab === 'revenue' ? 'bg-indigo-600 text-white shadow-3xs' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  财务收益预测 (预算)
                </button>
              </div>
            </div>

            {/* Render Tab Contents with high fidelity */}
            <div className="flex-1 py-1">
              
              {/* TAB 1: Conversion Trend (High fidelity interactive SVG charts) */}
              {analyticsTab === 'conversion' && (
                <div className="space-y-4 animate-fade-in flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="text-[11px] text-slate-500 font-semibold">周度客户询盘转认租签约转换效能</span>
                        <span className="bg-indigo-50 text-indigo-700 text-[8px] font-bold px-1.5 py-0.2 rounded font-mono">
                          LIVE FEEDS
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-normal">
                        点击下方柱状图或趋势节点，可即时显示当日的详细商机转化细节。当前选中：
                        <span className="font-bold text-indigo-700 underline bg-indigo-50 px-1 ml-0.5">
                          {weeklyConversionData[selectedDayIndex].day}
                        </span>
                      </p>
                    </div>
                    <div className="text-right shrink-0 font-mono">
                      <span className="text-[10px] text-gray-400 block">今日转化峰值</span>
                      <span className="text-sm font-bold text-emerald-600">74.2% (高水准)</span>
                    </div>
                  </div>

                  {/* Sophisticated SVG Combo Chart */}
                  <div className="relative bg-slate-50/70 rounded-xl border border-slate-150 p-4 h-48 overflow-hidden flex flex-col justify-between">
                    
                    {/* Grid Lines */}
                    <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between px-4 py-2 pointer-events-none">
                      <div className="border-b border-gray-200/50 w-full text-[8px] text-gray-400 font-mono flex justify-between">
                        <span>75% 优秀阈值</span>
                      </div>
                      <div className="border-b border-gray-200/50 w-full text-[8px] text-gray-400 font-mono flex justify-between">
                        <span>50% 安全水位</span>
                      </div>
                      <div className="border-b border-gray-200/50 w-full text-[8px] text-gray-400 font-mono flex justify-between">
                        <span>25% 预警底线</span>
                      </div>
                    </div>

                    {/* Bars and lines mixed SVG */}
                    <div className="relative w-full h-32 mt-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                        
                        {/* Define gradients */}
                        <defs>
                          <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.2" />
                          </linearGradient>
                          <linearGradient id="selected-bar-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="1" />
                            <stop offset="100%" stopColor="#312e81" stopOpacity="0.4" />
                          </linearGradient>
                          <linearGradient id="curve-fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* 1. Bar Chart (Leads counts as background) */}
                        {weeklyConversionData.map((d, index) => {
                          const barWidth = 24;
                          const spacing = 500 / 7;
                          const barX = index * spacing + spacing / 2 - barWidth / 2;
                          // Scale leads (max 62) to height 80
                          const barHeight = (d.leads / 65) * 80;
                          const barY = 100 - barHeight;

                          return (
                            <g key={`bar-${index}`} className="cursor-pointer" onClick={() => setSelectedDayIndex(index)}>
                              {/* Hover tooltip boundary */}
                              <rect
                                x={index * spacing}
                                y="0"
                                width={spacing}
                                height="110"
                                fill="transparent"
                                className="hover:fill-slate-900/5 transition-colors"
                              />
                              {/* Actual visual bar */}
                              <rect
                                x={barX}
                                y={barY}
                                rx="3"
                                width={barWidth}
                                height={barHeight}
                                fill={index === selectedDayIndex ? "url(#selected-bar-gradient)" : "url(#bar-gradient)"}
                                className="transition-all duration-300"
                              />
                              {/* Mini text label for values */}
                              <text
                                x={barX + barWidth / 2}
                                y={barY - 4}
                                textAnchor="middle"
                                className="text-[8px] font-mono font-bold fill-slate-500"
                              >
                                {d.leads}
                              </text>
                            </g>
                          );
                        })}

                        {/* 2. Line Chart (Conversion Rate % as foreground) */}
                        <path
                          d={weeklyConversionData.map((d, index) => {
                            const spacing = 500 / 7;
                            const x = index * spacing + spacing / 2;
                            // Scale rate (max 100) to height 90
                            const y = 100 - (d.rate / 100) * 90;
                            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* 3. Shadow area below line */}
                        <path
                          d={weeklyConversionData.map((d, index) => {
                            const spacing = 500 / 7;
                            const x = index * spacing + spacing / 2;
                            const y = 100 - (d.rate / 100) * 90;
                            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                          }).join(' ') + ` L ${6 * (500/7) + (500/7)/2} 100 L ${(500/7)/2} 100 Z`}
                          fill="url(#curve-fill)"
                        />

                        {/* Dots on line with pulse animation for selection */}
                        {weeklyConversionData.map((d, index) => {
                          const spacing = 500 / 7;
                          const x = index * spacing + spacing / 2;
                          const y = 100 - (d.rate / 100) * 90;

                          return (
                            <g key={`dot-${index}`} className="cursor-pointer" onClick={() => setSelectedDayIndex(index)}>
                              <circle
                                cx={x}
                                cy={y}
                                r={index === selectedDayIndex ? "6" : "4"}
                                fill={index === selectedDayIndex ? "#10b981" : "#ffffff"}
                                stroke="#10b981"
                                strokeWidth="2.5"
                                className="transition-all duration-300"
                              />
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Horizontal axis labels */}
                    <div className="flex justify-between text-[9px] font-bold text-gray-400 font-mono px-2">
                      {weeklyConversionData.map((d, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedDayIndex(index)}
                          className={`hover:text-indigo-600 transition-colors ${index === selectedDayIndex ? 'text-indigo-700 font-extrabold underline' : ''}`}
                        >
                          {d.day.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Day Interactive Micro-Details Card (Adds rich feel) */}
                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-150 flex items-center justify-between text-xs animate-fade-in">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        <span>{weeklyConversionData[selectedDayIndex].day} 运营详情:</span>
                      </div>
                      <p className="text-gray-500 text-[11px] leading-relaxed">
                        {weeklyConversionData[selectedDayIndex].desc}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4 border-l border-indigo-100 pl-4 shrink-0">
                      <div className="text-center">
                        <span className="text-[9px] text-gray-400 block font-semibold">询盘客流</span>
                        <span className="font-bold font-mono text-indigo-950 text-sm">{weeklyConversionData[selectedDayIndex].leads} 组</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[9px] text-gray-400 block font-semibold">实体认签</span>
                        <span className="font-bold font-mono text-emerald-600 text-sm">{weeklyConversionData[selectedDayIndex].signings} 单</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[9px] text-gray-400 block font-semibold">签约转换率</span>
                        <span className="font-bold font-mono text-white bg-indigo-600 px-1.5 py-0.5 rounded text-[11px]">
                          {weeklyConversionData[selectedDayIndex].rate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Detailed Conversion Analytics Table */}
                  <div className="border border-gray-150 rounded-xl overflow-hidden bg-white shadow-3xs mt-2">
                    <div className="bg-slate-50 px-3 py-2.5 border-b border-gray-200 grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <span className="col-span-3">分析 Timeline (天阶段)</span>
                      <span className="col-span-2 text-right">商机询盘量</span>
                      <span className="col-span-2 text-right">带看认签数</span>
                      <span className="col-span-2 text-right">签约转化率</span>
                      <span className="col-span-2 text-right">主力推广渠道</span>
                      <span className="col-span-1 text-right">转化评定</span>
                    </div>
                    <div className="divide-y divide-gray-100 text-xs">
                      {weeklyConversionData.map((d, index) => {
                        const isSelected = index === selectedDayIndex;
                        let statusColor = "text-emerald-600 bg-emerald-50";
                        let statusText = "超额 S+";
                        if (d.rate < 60) {
                          statusColor = "text-amber-600 bg-amber-50";
                          statusText = "平稳 B";
                        } else if (d.rate >= 70) {
                          statusColor = "text-indigo-600 bg-indigo-50 font-bold";
                          statusText = "优秀 A";
                        }
                        
                        const channels = ["线上精准推荐", "自媒体抖音矩阵", "老客口碑转介绍", "商协会联合推荐", "线下极速协作", "门店自然自引流", "批量大盘导流"];
                        const topChannel = channels[index % channels.length];

                        return (
                          <div 
                            key={index} 
                            onClick={() => setSelectedDayIndex(index)}
                            className={`px-3 py-3 grid grid-cols-12 items-center cursor-pointer transition-colors ${
                              isSelected 
                                ? 'bg-indigo-50/70 border-l-2 border-indigo-600 font-semibold' 
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="col-span-3 flex items-center space-x-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-indigo-600 animate-pulse-subtle' : 'bg-gray-300'}`} />
                              <span className={isSelected ? 'text-indigo-950 font-bold' : 'text-gray-700'}>{d.day}</span>
                            </div>
                            <div className="col-span-2 text-right font-mono text-gray-600 font-medium">
                              {d.leads} 组
                            </div>
                            <div className="col-span-2 text-right font-mono text-emerald-600 font-semibold">
                              {d.signings} 单
                            </div>
                            <div className="col-span-2 text-right font-mono font-bold text-slate-800">
                              {d.rate}%
                            </div>
                            <div className="col-span-2 text-right text-gray-500 font-sans truncate pl-2">
                              {topChannel}
                            </div>
                            <div className="col-span-1 text-right">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-sans ${statusColor}`}>
                                {statusText}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Asset Portfolio (Interactive selection with table list) */}
              {analyticsTab === 'assets' && (
                <div className="space-y-4 animate-fade-in flex flex-col h-full justify-between">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">多维物产权属细分分布与租约状态</span>
                      <p className="text-xs text-gray-600 mt-1">
                        点击下方分类卡片，可直接联动查看该类别下托管资产项目的具体入住率、租金收入及合规状态。
                      </p>
                    </div>
                  </div>

                  {/* Donut Chart representation */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Category Block 1: Residential */}
                    <div 
                      onClick={() => setSelectedAssetCategory('residential')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedAssetCategory === 'residential' 
                          ? 'bg-amber-500/10 border-amber-400 shadow-xs' 
                          : 'bg-white border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400">住宅物业</span>
                        <span className="text-[8px] bg-amber-500 text-white font-mono font-bold px-1 py-0.2 rounded">
                          45% 占比
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-lg font-extrabold font-mono text-gray-800">{residentialCount}</span>
                        <span className="text-[10px] text-emerald-600 font-bold">空置天数短</span>
                      </div>
                      {/* Interactive Visual Gauge */}
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '45%' }} />
                      </div>
                    </div>

                    {/* Category Block 2: Commercial */}
                    <div 
                      onClick={() => setSelectedAssetCategory('commercial')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedAssetCategory === 'commercial' 
                          ? 'bg-indigo-500/10 border-indigo-400 shadow-xs' 
                          : 'bg-white border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400">商业写字楼</span>
                        <span className="text-[8px] bg-indigo-600 text-white font-mono font-bold px-1 py-0.2 rounded">
                          35% 占比
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-lg font-extrabold font-mono text-gray-800">{commercialCount}</span>
                        <span className="text-[10px] text-indigo-600 font-bold">高收益主体</span>
                      </div>
                      {/* Interactive Visual Gauge */}
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: '35%' }} />
                      </div>
                    </div>

                    {/* Category Block 3: Industrial */}
                    <div 
                      onClick={() => setSelectedAssetCategory('industrial')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedAssetCategory === 'industrial' 
                          ? 'bg-purple-500/10 border-purple-400 shadow-xs' 
                          : 'bg-white border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400">厂房仓储</span>
                        <span className="text-[8px] bg-purple-600 text-white font-mono font-bold px-1 py-0.2 rounded">
                          20% 占比
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-lg font-extrabold font-mono text-gray-800">{industrialCount}</span>
                        <span className="text-[10px] text-indigo-600 font-bold">长期稳定性</span>
                      </div>
                      {/* Interactive Visual Gauge */}
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-purple-600 h-full rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>

                  </div>

                  {/* Linked Project Detailed List */}
                  <div className="border border-gray-150 rounded-xl overflow-hidden bg-white shadow-3xs mt-2">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-gray-200 grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <span className="col-span-4">托管资产子项目名称</span>
                      <span className="col-span-2 text-right">总容量/租赁面积</span>
                      <span className="col-span-2 text-right">出租率/入住水位</span>
                      <span className="col-span-2 text-right">月度租金流水</span>
                      <span className="col-span-1 text-right">健康评级</span>
                      <span className="col-span-1 text-right">托管状态</span>
                    </div>
                    <div className="divide-y divide-gray-150 text-xs">
                      {assetProjectDetails[selectedAssetCategory].map((project, idx) => {
                        const mockOwners = ["张江科创发展有限公司", "上海绿城置业发展部", "临港物流一期开发商", "东方智谷物业发展", "创客大厦联合会", "虹桥瑞创地产"];
                        const mockDurations = ["2024-2029 (5年)", "2023-2028 (5年)", "2025-2030 (5年)", "2022-2027 (5年)", "2024-2027 (3年)", "2025-2028 (3年)"];
                        const mockScores = [98, 92, 85, 99, 94, 91];
                        
                        const owner = mockOwners[(idx + (selectedAssetCategory === 'commercial' ? 1 : selectedAssetCategory === 'industrial' ? 2 : 0)) % mockOwners.length];
                        const duration = mockDurations[(idx + (selectedAssetCategory === 'commercial' ? 1 : 0)) % mockDurations.length];
                        const score = mockScores[(idx + (selectedAssetCategory === 'commercial' ? 1 : 0)) % mockScores.length];
                        
                        let scoreColor = "text-emerald-600 bg-emerald-50";
                        if (score < 90) scoreColor = "text-amber-600 bg-amber-50";

                        return (
                          <div key={idx} className="px-4 py-3 grid grid-cols-12 items-center hover:bg-slate-50 transition-colors bg-white">
                            {/* Name & Owner */}
                            <div className="col-span-4 space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className={`w-2 h-2 rounded-full ${
                                  selectedAssetCategory === 'residential' ? 'bg-amber-500' :
                                  selectedAssetCategory === 'commercial' ? 'bg-indigo-600' : 'bg-purple-600'
                                }`} />
                                <span className="font-bold text-slate-900 text-sm">{project.name}</span>
                              </div>
                              <div className="text-[10px] text-gray-500 flex items-center space-x-2 pl-4">
                                <span>产权主体: {owner}</span>
                                <span>•</span>
                                <span>租期: {duration}</span>
                              </div>
                            </div>
                            
                            {/* Capacity */}
                            <div className="col-span-2 text-right font-mono font-bold text-gray-700 text-[11px]">
                              {project.rooms}
                            </div>
                            
                            {/* Occupancy Rate with custom visual gauge */}
                            <div className="col-span-2 text-right space-y-1 pl-4">
                              <div className="text-indigo-600 font-mono font-bold text-[11px]">
                                {project.occupancy}
                              </div>
                              <div className="flex justify-end">
                                <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      parseFloat(project.occupancy) >= 90 ? 'bg-emerald-500' : 'bg-indigo-600'
                                    }`} 
                                    style={{ width: project.occupancy }} 
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Monthly Revenue */}
                            <div className="col-span-2 text-right font-mono font-bold text-gray-900 text-sm">
                              {project.revenue}
                            </div>

                            {/* Health score */}
                            <div className="col-span-1 text-right">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${scoreColor}`}>
                                {score} A
                              </span>
                            </div>

                            {/* Status Badge */}
                            <div className="col-span-1 text-right">
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold border border-slate-200">
                                {project.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Revenue projection (Budgets, forecasts, simulator) */}
              {analyticsTab === 'revenue' && (
                <div className="space-y-4 animate-fade-in flex flex-col h-full justify-between">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">财务收支季度流向与指标差值分析</span>
                      <p className="text-xs text-gray-600 mt-1">
                        实时跟踪应收、实收与开支流向。使用下方滑块可以调整入住率，模拟季度租金预期变化。
                      </p>
                    </div>
                  </div>

                  {/* Financial Bar Charts with variances */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {quarterlyFinancials.map((q, idx) => {
                      const scaledRealized = (q.realized / 330) * 100;
                      const scaledProjected = (q.projected / 330) * 100;
                      const isPositive = q.variance >= 0;

                      return (
                        <div key={idx} className="bg-slate-50/50 p-3 rounded-xl border border-slate-150 flex flex-col justify-between space-y-3">
                          <div className="flex items-center justify-between text-[10px] font-bold text-gray-600">
                            <span>{q.quarter.split(' ')[0]}</span>
                            <span className={`px-1 rounded text-[8px] font-mono ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                              {isPositive ? `+${q.variance}k 盈余` : `${q.variance}k 差额`}
                            </span>
                          </div>

                          {/* Interactive Vertical progress bar bar representation */}
                          <div className="h-20 flex items-end justify-center space-x-3.5 bg-white rounded-lg border border-gray-150 p-2">
                            {/* Budgeted column */}
                            <div className="flex flex-col items-center flex-1 h-full justify-end">
                              <span className="text-[8px] font-mono text-gray-400 mb-1">¥{q.projected}k</span>
                              <div className="bg-slate-300 w-3 rounded-t-sm" style={{ height: `${scaledProjected}%` }} title="预算应收" />
                            </div>
                            {/* Realized column */}
                            <div className="flex flex-col items-center flex-1 h-full justify-end">
                              <span className="text-[8px] font-mono text-indigo-700 mb-1">¥{q.realized}k</span>
                              <div className="bg-indigo-600 w-3 rounded-t-sm" style={{ height: `${scaledRealized}%` }} title="实收到账" />
                            </div>
                          </div>

                          <div className="text-[9px] text-gray-400 font-semibold space-y-0.5">
                            <div className="flex justify-between">
                              <span>物业开支损耗:</span>
                              <span className="text-rose-600">¥{q.expenses}k</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-700 pt-0.5 border-t border-gray-200">
                              <span>净额利润:</span>
                              <span className="text-emerald-600">¥{q.realized - q.expenses}k</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Simulator slide section (Premium decision-making helper) */}
                  <div className="p-3 bg-indigo-950 text-slate-100 rounded-xl space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-200">
                        <Target className="w-3.5 h-3.5" />
                        <span>资产入住率目标盈亏预测器 (Simulator)</span>
                      </div>
                      <span className="text-[10px] text-indigo-300 font-mono">
                        预测年限: {financialProjectionYears}年 | 当前测算基准: {revenueTargetSlider}%
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                      {/* Slider 1: Target Occupancy */}
                      <div className="flex-1 w-full space-y-1">
                        <div className="flex justify-between text-[9px] font-semibold text-slate-300">
                          <span>设定目标出租率</span>
                          <span className="text-white font-bold font-mono">{revenueTargetSlider}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="50" 
                          max="100" 
                          value={revenueTargetSlider} 
                          onChange={(e) => setRevenueTargetSlider(Number(e.target.value))}
                          className="w-full accent-indigo-400 h-1 rounded-lg cursor-pointer bg-indigo-900"
                        />
                      </div>

                      {/* Slider 2: Forecast Years */}
                      <div className="flex-1 w-full space-y-1">
                        <div className="flex justify-between text-[9px] font-semibold text-slate-300">
                          <span>模拟预测跨度</span>
                          <span className="text-white font-bold font-mono">{financialProjectionYears} 年</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="5" 
                          value={financialProjectionYears} 
                          onChange={(e) => setFinancialProjectionYears(Number(e.target.value))}
                          className="w-full accent-indigo-400 h-1 rounded-lg cursor-pointer bg-indigo-900"
                        />
                      </div>

                      {/* Simulator result */}
                      <div className="bg-indigo-900/50 border border-indigo-800 rounded-lg p-2 text-right shrink-0 min-w-[120px]">
                        <span className="text-[8px] text-indigo-300 block font-semibold">预计累积净收益额</span>
                        <span className="text-sm font-mono font-bold text-emerald-400">
                          ¥{(revenueTargetSlider * 3500 * financialProjectionYears).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Simulator Dynamic Details Table */}
                  <div className="border border-gray-150 rounded-xl overflow-hidden bg-white shadow-3xs mt-3 animate-fade-in">
                    <div className="bg-slate-50 px-3 py-2.5 border-b border-gray-200 flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <span>模拟预测年度 (Year Grid)</span>
                      <div className="flex space-x-6 text-right">
                        <span className="w-20">入住基准率</span>
                        <span className="w-24">测算年化总流水</span>
                        <span className="w-20">公摊维护开支</span>
                        <span className="w-24">预计净利润</span>
                        <span className="w-24">投资回报倍数 (ROI)</span>
                        <span className="w-20">置信度评级</span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100 text-xs bg-white">
                      {Array.from({ length: financialProjectionYears }).map((_, yearIdx) => {
                        const yearNum = yearIdx + 1;
                        // Annual calculations
                        const grossRevenue = Math.round(revenueTargetSlider * 3500 * (1 + (yearIdx * 0.05))); // 5% annual rent growth
                        const maintenanceCost = Math.round(grossRevenue * 0.12); // 12% OPEX
                        const netProfit = grossRevenue - maintenanceCost;
                        const roiMultiplier = (1.2 + (yearIdx * 0.15)).toFixed(2);
                        const confidence = yearNum === 1 ? "高 (95%)" : yearNum === 2 ? "中高 (88%)" : yearNum === 3 ? "中等 (75%)" : "预期 (60%)";

                        return (
                          <div key={yearIdx} className="px-3 py-2.5 flex justify-between items-center hover:bg-indigo-50/20 transition-colors bg-white">
                            <div className="flex items-center space-x-2">
                              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold font-mono px-2 py-0.5 rounded">
                                第 {yearNum} 年度
                              </span>
                              <span className="text-gray-500 text-[11px] font-sans">
                                (2026 + {yearIdx}年)
                              </span>
                            </div>
                            <div className="flex items-center space-x-6 text-[11px] font-mono font-bold text-gray-600 text-right">
                              <span className="w-20">{revenueTargetSlider}%</span>
                              <span className="w-24 text-gray-900">¥{grossRevenue.toLocaleString()}</span>
                              <span className="w-20 text-rose-600">-¥{maintenanceCost.toLocaleString()}</span>
                              <span className="w-24 text-emerald-600">¥{netProfit.toLocaleString()}</span>
                              <span className="w-24 text-indigo-600">{roiMultiplier} x</span>
                              <span className="w-20 text-gray-500 font-sans text-xs">{confidence}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Business Analysis Bottom metrics block */}
          <div className="bg-slate-50 border border-gray-150 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs shrink-0">
            <div className="space-y-1">
              <span className="text-gray-400 text-[10px] block font-semibold">招商周转均效</span>
              <span className="font-bold text-gray-800 font-mono block text-sm">3.2 天内签约</span>
              <p className="text-[9px] text-emerald-600 font-semibold">✓ 跑赢去年同期 (集团优胜)</p>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-200 sm:pl-4">
              <span className="text-gray-400 text-[10px] block font-semibold">物产权属真实合规率</span>
              <span className="font-bold text-gray-800 font-mono block text-sm">99.1% 已验证</span>
              <p className="text-[9px] text-indigo-600 font-semibold">✓ 产权真实，0法务风险</p>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-200 sm:pl-4">
              <span className="text-gray-400 text-[10px] block font-semibold">极速协同响应时效</span>
              <span className="font-bold text-gray-800 font-mono block text-sm">15.4 分钟响应</span>
              <p className="text-[9px] text-emerald-600 font-semibold">✓ 跨部门协作效率S级</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive alerts, collapsible todos, and new Turnaround Dashboard (Span 4) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
          
          {/* CARD A: 紧急事项催办 (Urgent alerts, collapsed by default, click to expand) */}
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-xl p-4 space-y-3 shadow-3xs flex-1 flex flex-col justify-between">
            <div className="space-y-3">
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
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 animate-pulse-subtle" />
                        <span className="font-bold text-gray-900 truncate max-w-[220px]">⚠️ 缺失产权主体关键证件 ({incompleteDraftsCount}个房源)</span>
                      </div>
                      {expandedAlertId === 'ownership-incomplete' ? <ChevronUp className="w-3.5 h-3.5 text-gray-400 animate-rotate-180" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                    </div>

                    <AnimatePresence>
                      {expandedAlertId === 'ownership-incomplete' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
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
                        <span className="font-bold text-gray-900 truncate max-w-[220px]">🔥 突发催办: {task.title}</span>
                      </div>
                      {expandedAlertId === task.id ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                    </div>

                    <AnimatePresence>
                      {expandedAlertId === task.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
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
            
            <div className="mt-3 text-[10px] text-rose-700/80 bg-rose-100/30 p-2.5 rounded-lg border border-rose-200/40">
              <span className="font-bold">催办规范:</span> 高亮异常会影响资产月度收益交割。请及时催办相应协同人，或予以结办。
            </div>
          </div>

          {/* CARD B: 今日协同待办摘要 (Todo tasks, below alerts, also collapsed by default, click to expand) */}
          <div className="bg-white border border-gray-150 rounded-xl p-4 space-y-3 shadow-3xs flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center space-x-1.5 text-gray-900">
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold font-display uppercase tracking-wider">今日普通待办摘要 ({normalTodos.length})</span>
                </div>
                <button 
                  onClick={() => setActiveTab('task-hub')}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-0.5"
                >
                  <span>进入任务舱</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                {normalTodos.length === 0 ? (
                  <div className="py-6 text-center text-[11px] text-gray-400">
                    <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1 animate-pulse-subtle" />
                    <p className="font-bold text-gray-700">🎉 今日已无普通协同积压工单</p>
                    <p className="opacity-60 mt-0.5 font-sans">普通协同队列状态全部绿灯。</p>
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
                          <span className="font-bold text-gray-800 truncate max-w-[190px]">{task.title}</span>
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
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
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

            <div className="text-[9px] text-gray-400 flex items-center space-x-1 border-t border-gray-100 pt-2 shrink-0">
              <Clock className="w-3 h-3 text-indigo-500" />
              <span>今日普通待办每两小时与系统主干做一次状态握手同步。</span>
            </div>
          </div>

          {/* NEW CARD C: 协同处理时效看板 & 运营雷达 (Balances height and adds premium depth to right column) */}
          <div className="bg-slate-950 text-slate-100 border border-slate-900 rounded-xl p-4 space-y-3.5 shadow-md shrink-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-1.5 text-indigo-300">
                <Activity className="w-4 h-4 text-indigo-400 animate-pulse-subtle" />
                <span className="text-xs font-bold font-display uppercase tracking-wider">系统级运营指标与时效监控</span>
              </div>
              <span className="text-[9px] bg-indigo-900/50 text-indigo-200 border border-indigo-700/50 font-bold px-1.5 py-0.2 rounded font-mono">
                SLA ONLINE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              
              {/* Metric 1: Response SLA */}
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-slate-500 text-[9px] block font-semibold uppercase">工单响应SLA达成率</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-lg font-bold font-mono text-indigo-400">98.4%</span>
                  <span className="text-[8px] text-emerald-500 font-bold">✓ 优于标准</span>
                </div>
                <p className="text-[8px] text-slate-400">平均认领耗时 12.5 分钟</p>
              </div>

              {/* Metric 2: Completion Speed */}
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-slate-500 text-[9px] block font-semibold uppercase">本月催办案卷结案率</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-lg font-bold font-mono text-emerald-400">96.5%</span>
                  <span className="text-[8px] text-emerald-500 font-bold">✓ 环比+1.2%</span>
                </div>
                <p className="text-[8px] text-slate-400">催收办结周期平均 1.4 天</p>
              </div>

            </div>

            {/* Active Network Stream */}
            <div className="space-y-1.5">
              <span className="text-slate-500 text-[9px] font-semibold block uppercase">今日其他经理协作动态</span>
              <div className="bg-slate-900/60 p-2 rounded-lg text-[10px] text-slate-300 space-y-1 divide-y divide-slate-800/60">
                <div className="pb-1.5 flex justify-between items-center">
                  <span className="truncate max-w-[130px]">🔹 经理李强办结 “虹桥广场租赁” 催办</span>
                  <span className="text-slate-500 font-mono">10分钟前</span>
                </div>
                <div className="pt-1.5 flex justify-between items-center">
                  <span className="truncate max-w-[130px]">🔹 财务王雪标记 “Q2租金认领” 就绪</span>
                  <span className="text-slate-500 font-mono">45分钟前</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-900 p-2 rounded-lg">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-semibold text-slate-300">系统环境健康状态: 优秀</span>
              </div>
              <span className="text-[9px] bg-slate-800 text-indigo-300 font-bold px-1.5 py-0.2 rounded font-mono">
                98 / 100
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
