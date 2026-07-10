import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, Clock, CheckCircle, Flame, ShieldAlert, Zap, 
  Play, Trash2, ArrowRight, User, FolderOpen, Hammer, Search, 
  Plus, X, BellRing, Sparkles, Filter, RefreshCcw, Info
} from 'lucide-react';
import { PropertyDraft, TaskItem } from '../types';

interface TaskOverviewProps {
  propertyDrafts: PropertyDraft[];
  todoList: TaskItem[];
  onLaunchDraft: (draftId: string) => void;
  onDiscardDraft: (draftId: string) => void;
  onUrgeTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onAddTodo: (todo: TaskItem) => void;
}

export default function TaskOverview({
  propertyDrafts,
  todoList,
  onLaunchDraft,
  onDiscardDraft,
  onUrgeTask,
  onCompleteTask,
  onAddTodo
}: TaskOverviewProps) {
  const [filterType, setFilterType] = useState<'all' | 'drafts' | 'todos' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickTodoModal, setShowQuickTodoModal] = useState(false);

  // Form states for creating custom todos inline
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoModule, setNewTodoModule] = useState('财务部');
  const [newTodoPriority, setNewTodoPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTodoDesc, setNewTodoDesc] = useState('');

  const handleQuickTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newTodo: TaskItem = {
      id: `task_${Date.now()}`,
      title: newTodoTitle,
      module: newTodoModule,
      priority: newTodoPriority,
      status: 'pending',
      statusLabel: '待处理',
      updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      assignee: '自选对接专员',
      description: newTodoDesc || '从首页任务概览区手动录入的待办事项'
    };

    onAddTodo(newTodo);
    setNewTodoTitle('');
    setNewTodoDesc('');
    setShowQuickTodoModal(false);
  };

  // Filter lists
  const filteredDrafts = propertyDrafts.filter(draft => 
    draft.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTodos = todoList.filter(todo => 
    (todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     todo.module.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterType === 'all' || 
     (filterType === 'todos' && todo.status !== 'completed') || 
     (filterType === 'completed' && todo.status === 'completed'))
  );

  const totalOngoingDrafts = propertyDrafts.length;
  const totalPendingTickets = todoList.filter(t => t.status !== 'completed').length;
  const totalUrgingTickets = todoList.filter(t => t.status === 'urging').length;
  const totalFinishedCount = todoList.filter(t => t.status === 'completed').length;

  return (
    <div id="task-overview-container" className="space-y-6">
      {/* Top statistical dashboard counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Counter 1 */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">暂存进行中向导</span>
            <span className="text-2xl font-bold font-display text-indigo-600 block mt-1">{totalOngoingDrafts} <span className="text-xs font-normal text-gray-400">个流程</span></span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Counter 2 */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">积压待办工单</span>
            <span className="text-2xl font-bold font-display text-amber-600 block mt-1">{totalPendingTickets} <span className="text-xs font-normal text-gray-400">单未结</span></span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Hammer className="w-5 h-5" />
          </div>
        </div>

        {/* Counter 3 */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">已发起催办数</span>
            <span className="text-2xl font-bold font-display text-rose-600 block mt-1">{totalUrgingTickets} <span className="text-xs font-normal text-gray-400">单催办中</span></span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 animate-pulse-subtle">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Counter 4 */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">已办结归档事项</span>
            <span className="text-2xl font-bold font-display text-emerald-600 block mt-1">{totalFinishedCount} <span className="text-xs font-normal text-gray-400">项完结</span></span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main filter & search toolbar */}
      <div className="bg-white px-5 py-3.5 rounded-xl border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-2xs">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              filterType === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>全量看板 (All)</span>
          </button>
          <button
            onClick={() => setFilterType('drafts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              filterType === 'drafts' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>进行中建档向导 ({totalOngoingDrafts})</span>
          </button>
          <button
            onClick={() => setFilterType('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              filterType === 'todos' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>未结待办与工单 ({totalPendingTickets})</span>
          </button>
          <button
            onClick={() => setFilterType('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              filterType === 'completed' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>已办结工单 ({totalFinishedCount})</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="在任务与流程中搜索..."
              className="pl-8 pr-4 py-1.5 text-xs border border-gray-200 rounded-lg w-full md:w-48 bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all placeholder:text-gray-400"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>

          <button
            id="workspace-add-todo-btn"
            onClick={() => setShowQuickTodoModal(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>登记待办/工单</span>
          </button>
        </div>
      </div>

      {/* Task core listing area */}
      <div className="grid grid-cols-1 gap-6">
        {/* Section A: Multi-step Creation Drafts (Visible if 'all' or 'drafts' is active) */}
        {(filterType === 'all' || filterType === 'drafts') && (
          <div className="space-y-3" id="ongoing-drafts-section">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-display flex items-center space-x-2">
                <span>进行中/暂停的房源建档流程 ({filteredDrafts.length})</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-mono normal-case">支持断点恢复</span>
              </h3>
            </div>

            {filteredDrafts.length === 0 ? (
              <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-8 text-center flex flex-col items-center justify-center text-gray-400">
                <FolderOpen className="w-8 h-8 text-gray-300 mb-1.5" />
                <p className="text-xs font-bold text-gray-700">暂无待续办的草稿流程</p>
                <p className="text-[10px] text-gray-400 mt-1">您可以点击左侧“统一新建业务”，发起房源建档并试填后，点击暂存草稿。</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDrafts.map((draft) => {
                  const progressPct = Math.round((draft.currentStep / 6) * 100);
                  const STEP_LABELS = ['准备', '骨架', '确权', '房型', '生成', '费用'];
                  
                  // Semantic missing items generator based on current step
                  const getMissingItemHint = (step: number) => {
                    switch(step) {
                      case 1: return '待补充房源类型与管理分流定位';
                      case 2: return '待补充项目基础骨架与详细物理地址';
                      case 3: return '待补充产权大房东主体确权信息';
                      case 4: return '待建立核心房型及套内面积参数模板';
                      case 5: return '待一键批量生成各楼层门牌号资产';
                      case 6: return '待补充商务底报价及证明测绘图纸';
                      default: return '';
                    }
                  };

                  const missingList: string[] = [];
                  if (!draft.ownerName) missingList.push('产权主体');
                  if (draft.entryScope !== 'skeleton' && !draft.layoutName) missingList.push('房型模板');
                  if ((draft.entryScope === 'full' || !draft.entryScope) && !draft.roomsPerFloor) missingList.push('房间实体');

                  return (
                    <div 
                      key={draft.id} 
                      className="bg-white rounded-xl border border-gray-100 p-5 shadow-2xs hover:border-indigo-200 hover:shadow-xs transition-all relative flex flex-col justify-between"
                    >
                      <div>
                        {/* Title & Metadata */}
                        <div className="flex items-start justify-between">
                          <div className="max-w-[70%]">
                            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest font-mono">
                              {draft.propertyType === 'residential' ? '🏠 普通住宅' : 
                               draft.propertyType === 'commercial' ? '🏢 商业写字楼' : 
                               draft.propertyType === 'industrial' ? '🏭 工业厂房' :
                               draft.propertyType === 'apartment' ? '🏢 集中式公寓' : '📦 其他物权'}
                            </span>
                            
                            {/* Entry Mode & Scope Badges */}
                            <div className="flex flex-wrap gap-1 mt-1 mb-1">
                              <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                                draft.entryMode === 'existing' 
                                  ? 'bg-amber-150 text-amber-800 border border-amber-250' 
                                  : 'bg-indigo-50 text-indigo-800 border border-indigo-150'
                              }`}>
                                {draft.entryMode === 'existing' ? '定向补录模式' : '新项目主链'}
                              </span>
                              <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                                draft.entryScope === 'skeleton' ? 'bg-orange-50 text-orange-800 border border-orange-150' :
                                draft.entryScope === 'layout' ? 'bg-blue-50 text-blue-800 border border-blue-150' :
                                'bg-emerald-50 text-emerald-800 border border-emerald-150'
                              }`}>
                                {draft.entryScope === 'skeleton' ? '仅骨架归档' :
                                 draft.entryScope === 'layout' ? '项目+房型' : '全量穿透'}
                              </span>
                              {draft.entryMode === 'existing' && draft.supplementTargetStep && (
                                <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-pink-50 text-pink-800 border border-pink-150">
                                  直达步骤 {draft.supplementTargetStep}
                                </span>
                              )}
                            </div>

                            <h4 className="text-xs font-bold text-gray-950 mt-1 truncate">
                              {draft.propertyName || '新发起房源主链草稿'}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                              {draft.id.slice(0, 14)}... • 阶段: <span className="text-indigo-600 font-bold">{draft.currentStageName || '录入前准备'}</span>
                            </p>
                          </div>
                          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shrink-0">
                            步骤 {draft.currentStep}/6 ({progressPct}%)
                          </span>
                        </div>

                        {/* Interactive roadmap visualization (PRD Feature 5 - Updated to 6 Steps) */}
                        <div className="my-4 space-y-1">
                          <div className="grid grid-cols-6 gap-1">
                            {[1, 2, 3, 4, 5, 6].map((step) => {
                              const isCompleted = draft.currentStep > step;
                              const isActive = draft.currentStep === step;
                              const label = STEP_LABELS[step - 1];
                              
                              // Check if this step is bypassed due to skeleton / layout scope
                              const isSkippedByScope = 
                                (draft.entryScope === 'skeleton' && (step === 4 || step === 5)) ||
                                (draft.entryScope === 'layout' && step === 5);

                              return (
                                <div key={step} className="flex flex-col space-y-1">
                                  <div className={`h-1.5 rounded-full transition-all duration-300 ${
                                    isSkippedByScope ? 'bg-slate-200 border-dashed border' :
                                    isCompleted ? 'bg-emerald-500' :
                                    isActive ? 'bg-indigo-600 animate-pulse-subtle' :
                                    'bg-gray-100'
                                  }`} />
                                  <span className={`text-[8px] font-medium text-center truncate ${
                                    isSkippedByScope ? 'text-gray-400 line-through' :
                                    isCompleted ? 'text-emerald-600 font-bold' :
                                    isActive ? 'text-indigo-600 font-bold animate-pulse-subtle' :
                                    'text-gray-300'
                                  }`}>
                                    {label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Basic parameters review */}
                        <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100 text-[10px] text-gray-500 grid grid-cols-2 gap-2 mb-3 font-mono">
                          <div>
                            <span className="text-gray-400">门牌骨架:</span> <span className="text-gray-800 font-bold truncate inline-block max-w-[80px] align-bottom">{draft.buildingNo || '未录入'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">期望底价:</span> <span className="text-gray-800 font-bold">{draft.price ? `¥${draft.price}/${draft.priceUnit || '月'}` : '待计算'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">管理模式:</span> <span className="text-gray-800 font-bold">
                              {draft.managementMode === 'central' ? '集中管理' : 
                               draft.managementMode === 'entire' ? '整租大套' : '合租工位'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">权属主体:</span> <span className="text-gray-800 font-bold truncate inline-block max-w-[80px] align-bottom">{draft.ownerName || '未指定'}</span>
                          </div>
                          
                          <div className="col-span-2 border-t border-gray-100 pt-1.5 mt-1 space-y-1 font-sans">
                            <div className="flex items-center text-[9px] text-amber-700">
                              <Info className="w-3.5 h-3.5 text-amber-500 mr-1 shrink-0" />
                              <span className="font-semibold">{getMissingItemHint(draft.currentStep)}</span>
                            </div>
                            {missingList.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 mt-1 text-[8px]">
                                <span className="text-gray-400">核心待补录:</span>
                                {missingList.map((m, mIdx) => (
                                  <span key={mIdx} className="bg-rose-50 text-rose-700 border border-rose-100 px-1 py-0.2 rounded font-bold">
                                    ⚠️ 缺{m}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons (Draft Recovery Interface) */}
                      <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 mt-auto">
                        <button
                          onClick={() => onLaunchDraft(draft.id)}
                          className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>恢复至: {draft.currentStageName || '录入前准备'}</span>
                        </button>
                        <button
                          onClick={() => onDiscardDraft(draft.id)}
                          className="p-1.5 border border-gray-200 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          title="丢弃该草稿"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Section B: General Actionable Todos & Work Orders */}
        {(filterType === 'all' || filterType === 'todos' || filterType === 'completed') && (
          <div className="space-y-3" id="todo-work-orders-section">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-display">
              全业务板块工单与待办承接区 ({filteredTodos.length})
            </h3>

            {filteredTodos.length === 0 ? (
              <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-8 text-center flex flex-col items-center justify-center text-gray-400">
                <ClipboardCheck className="w-8 h-8 text-gray-300 mb-1.5" />
                <p className="text-xs font-bold text-gray-700">暂无匹配条件待办工单</p>
                <p className="text-[10px] text-gray-400 mt-1">您可以点击右上角“登记待办/工单”录入新的运维保修任务。</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTodos.map((todo) => {
                  const isUrging = todo.status === 'urging';
                  const isCompleted = todo.status === 'completed';
                  return (
                    <div 
                      key={todo.id}
                      className={`bg-white rounded-xl border p-4 shadow-3xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isUrging 
                          ? 'border-rose-300 ring-1 ring-rose-300 bg-rose-50/10' 
                          : isCompleted 
                          ? 'border-gray-100 bg-gray-50/30' 
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      {/* Left: Info Grid */}
                      <div className="space-y-1 md:max-w-[70%]">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          {/* Priority Badge */}
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm font-mono uppercase ${
                            todo.priority === 'high' 
                              ? 'bg-rose-100 text-rose-700' 
                              : todo.priority === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {todo.priority === 'high' ? '紧急' : todo.priority === 'medium' ? '一般' : '低'}
                          </span>

                          {/* Status Badge */}
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isUrging 
                              ? 'bg-rose-600 text-white animate-pulse-subtle' 
                              : isCompleted 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : todo.status === 'draft_pending'
                              ? 'bg-violet-100 text-violet-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isUrging ? '🔥 催办处理中' : isCompleted ? '✓ 已办结' : todo.statusLabel}
                          </span>

                          <span className="text-[10px] text-gray-400 font-semibold">• {todo.module}</span>
                          <span className="text-[10px] text-gray-400 font-mono">ID: {todo.id.slice(0, 11)}</span>
                        </div>

                        <h4 className={`text-xs font-bold text-gray-900 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                          {todo.title}
                        </h4>

                        <p className={`text-[10px] ${isCompleted ? 'text-gray-400' : 'text-gray-500'} leading-normal`}>
                          {todo.description}
                        </p>

                        <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-mono pt-1">
                          <span className="flex items-center">
                            <User className="w-3 h-3 text-gray-300 mr-1" />
                            承办人: {todo.assignee}
                          </span>
                          <span>• 最后修改: {todo.updatedAt}</span>
                        </div>
                      </div>

                      {/* Right: Actions Button (Urge and Resolve Interfaces) */}
                      <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto border-t md:border-t-0 pt-2.5 md:pt-0">
                        {!isCompleted && (
                          <>
                            <button
                              id={`urge-btn-${todo.id}`}
                              disabled={isUrging}
                              onClick={() => onUrgeTask(todo.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 border cursor-pointer ${
                                isUrging 
                                  ? 'bg-rose-50 text-rose-500 border-rose-200 cursor-not-allowed' 
                                  : 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50 active:bg-rose-100'
                              }`}
                              title={isUrging ? "该待办已经进入红线加速催办序列" : "点击发送高优先级呼叫指令，催促承办部门办理"}
                            >
                              <Flame className={`w-3.5 h-3.5 ${isUrging ? 'text-rose-500 fill-rose-500' : 'text-rose-400'}`} />
                              <span>{isUrging ? '催办指令中...' : '催办 (Urge)'}</span>
                            </button>

                            <button
                              id={`resolve-btn-${todo.id}`}
                              onClick={() => onCompleteTask(todo.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center space-x-1 shadow-sm transition-colors cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>办结 (Done)</span>
                            </button>
                          </>
                        )}

                        {isCompleted && (
                          <div className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>事项已全部办结</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Todo Manual creation modal overlay */}
      <AnimatePresence>
        {showQuickTodoModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center">
                  <ClipboardCheck className="w-4 h-4 text-indigo-600 mr-2" />
                  登记待办 / 运维保障工单
                </h3>
                <button 
                  onClick={() => setShowQuickTodoModal(false)}
                  className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleQuickTodoSubmit} className="space-y-4 text-xs text-left">
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">工单/待办名称 *</label>
                  <input
                    type="text"
                    required
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    placeholder="如: 租客提报阳台水管生锈报修"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">承办部门</label>
                    <select
                      value={newTodoModule}
                      onChange={(e) => setNewTodoModule(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                    >
                      <option value="招商运维部">招商运维部</option>
                      <option value="财务部">财务部</option>
                      <option value="安全事务中心">安全事务中心</option>
                      <option value="客服行政部">客服行政部</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">紧急度</label>
                    <div className="flex space-x-1 mt-0.5">
                      {(['high', 'medium', 'low'] as const).map((pri) => (
                        <button
                          key={pri}
                          type="button"
                          onClick={() => setNewTodoPriority(pri)}
                          className={`flex-1 py-1 rounded text-[10px] font-bold border transition-colors ${
                            newTodoPriority === pri 
                              ? pri === 'high' ? 'bg-rose-100 border-rose-300 text-rose-700' :
                                pri === 'medium' ? 'bg-amber-100 border-amber-300 text-amber-700' :
                                'bg-blue-100 border-blue-300 text-blue-700'
                              : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {pri === 'high' ? '高' : pri === 'medium' ? '中' : '低'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">具体事项补充说明</label>
                  <textarea
                    value={newTodoDesc}
                    onChange={(e) => setNewTodoDesc(e.target.value)}
                    placeholder="请输入工单跟进细节，便于承办人极速跟进..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs transition-colors"
                >
                  登记并同步至待办流
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
