import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, HelpCircle, Check, Search, Filter, RefreshCw, Calendar, 
  MapPin, CheckCircle, Info, Sparkles, AlertCircle, Trash2, Key, Users, Building2,
  Plus, ArrowRight, ArrowUpRight, ChevronDown, ChevronUp, ShieldCheck, LayoutGrid, Layers, ClipboardList
} from 'lucide-react';
import { PropertyDraft, TaskItem } from './types';
import Sidebar from './components/Sidebar';
import UnifiedCreatePanel from './components/UnifiedCreatePanel';
import PropertyWizard from './components/PropertyWizard';
import TaskOverview from './components/TaskOverview';
import DashboardHome from './components/DashboardHome';

// Preseed Default Draft Workflows
const PRESEED_DRAFTS: PropertyDraft[] = [
  {
    id: 'prop_draft_pre_1',
    propertyName: '星河湾三期 15号物权项目',
    propertyType: 'residential',
    buildingNo: '15号楼2单元2401室',
    area: '245',
    price: '26000',
    address: '上海市浦东新区星河湾大道15号',
    floorNo: '24层 / 共36层',
    features: ['近地铁 (Near Metro)', '精装修 (Fully Furnished)', '带露台 (Balcony)', '视野开阔 (Scenic View)'],
    uploadedFiles: ['owner_id_card.pdf', 'property_ownership_cert_draft.png'],
    currentStep: 3,
    updatedAt: '10:45:12',
    
    // Upgraded stage details
    currentStageKey: 'ownership',
    currentStageName: '产权/房东主体',
    managementMode: 'entire',
    entryMode: 'new',
    entryScope: 'full',
    holdingType: 'lease',
    ownerName: '赵铁柱 (个人业主)',
    ownerContact: '张大林',
    ownerPhone: '13901234567',
    ownerRelation: '产权人本人直属授权',
    ownerDocUploaded: true,

    hasLayoutTemplate: true,
    layoutName: '标准四室两厅豪装',
    layoutRoomsCount: '4',
    layoutArea: '245',
    layoutDirection: '南北通透',
    layoutBathroomCount: '3',
    layoutBedType: '双人床',

    floorStart: '24',
    floorEnd: '24',
    roomsPerFloor: '2',
    roomNoRule: '{floor}0{index}',
    matchingMode: 'auto',
    exceptionsList: []
  },
  {
    id: 'prop_draft_pre_2',
    propertyName: '世茂高科技园 B座 联合商办',
    propertyType: 'commercial',
    buildingNo: 'B座5楼整层 501-512室',
    area: '1200',
    price: '185000',
    address: '上海市浦东新区科苑路888号',
    floorNo: '5层 / 共18层',
    features: ['近地铁 (Near Metro)', '独立电梯 (Private Elevator)', '车位保障 (Parking Space)'],
    uploadedFiles: [],
    currentStep: 1,
    updatedAt: '09:30:00',

    // Upgraded stage details
    currentStageKey: 'prep',
    currentStageName: '录入前准备',
    managementMode: 'central',
    entryMode: 'new',
    entryScope: 'full',
    holdingType: 'self',
    ownerName: '世茂高科技园发展有限公司',
    ownerContact: '吴经理',
    ownerPhone: '13888888888',
    ownerRelation: '公司产权自持物业',
    ownerDocUploaded: false,

    hasLayoutTemplate: true,
    layoutName: '标准联合办公区',
    layoutRoomsCount: '12',
    layoutArea: '1200',
    layoutDirection: '南北通透',
    layoutBathroomCount: '4',
    layoutBedType: '独立工位/电脑台',

    floorStart: '5',
    floorEnd: '5',
    roomsPerFloor: '12',
    roomNoRule: '{floor}0{index}',
    matchingMode: 'auto',
    exceptionsList: []
  }
];

// Preseed Default Tickets and Actionable Items
const PRESEED_TODOS: TaskItem[] = [
  {
    id: 'todo_pre_1',
    title: '星河湾2号楼电梯钢丝绳断股紧急保修维保',
    module: '招商运维部',
    priority: 'high',
    status: 'pending',
    statusLabel: '待处理',
    updatedAt: '08:22',
    assignee: '郭师傅 (工程维修一组)',
    description: '业主反馈电梯运行有轻微摩擦异响，现场排查发现钢丝绳存在部分磨损断股，需紧急停用并更换配重绳。'
  },
  {
    id: 'todo_pre_2',
    title: '新入职招商专员 [张建国] 身份证及特种设备操作技能从业证待补录',
    module: '客服行政部',
    priority: 'medium',
    status: 'draft_pending',
    statusLabel: '待补资料',
    updatedAt: '09:15',
    assignee: '李老师 (行政人事中心)',
    description: '新伙计已完成前置线上注册，当前身份证原件复印件及电梯管理员特种证待扫描补件上报，进度阻断中。'
  },
  {
    id: 'todo_pre_3',
    title: '世茂高科技园 2楼餐饮铺超负荷空开跳闸及强电配电箱异味排查',
    module: '安全事务中心',
    priority: 'high',
    status: 'pending',
    statusLabel: '待处理',
    updatedAt: '10:05',
    assignee: '王师傅 (配电及消控机房)',
    description: '餐饮商户在午间用电高峰发生集中断电，空气开关自动跳开。商户反馈配电箱有轻微塑料焦糊味，请立即派单检修。'
  }
];

// Seeded committed (finished) properties that the user can browse
const INITIAL_ASSETS = [
  { id: 'asset_1', name: '万达广场五期 C座 精装写字楼', type: 'commercial', area: '450㎡', price: '¥72,000/月', address: '浦东新区五角场路500号', status: '已租 (Leased)' },
  { id: 'asset_2', name: '汤臣一品 A栋 经典瞰江洋房', type: 'residential', area: '380㎡', price: '¥140,000/月', address: '陆家嘴花园石桥路28弄', status: '闲置 (Vacant)' },
  { id: 'asset_3', name: '临港保税物流园 D3高标冷库', type: 'industrial', area: '5800㎡', price: '¥290,000/月', address: '临港自贸区申江南路5500号', status: '已租 (Leased)' }
];

export default function App() {
  // State for layout & active draft forms
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [expandedAssetId, setExpandedAssetId] = useState<string | null>(null);

  // Core Data Lists
  const [propertyDrafts, setPropertyDrafts] = useState<PropertyDraft[]>([]);
  const [todoList, setTodoList] = useState<TaskItem[]>([]);
  const [committedAssets, setCommittedAssets] = useState<any[]>(INITIAL_ASSETS);

  // Toast feedback states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warn' | null }>({
    message: '',
    type: null
  });

  // Ref to scroll to drafts list
  const draftsSectionRef = useRef<HTMLDivElement>(null);

  // Initialize data on mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem('pm_property_drafts');
    const savedTodos = localStorage.getItem('pm_todo_list');
    const savedAssets = localStorage.getItem('pm_committed_assets');

    if (savedDrafts) {
      setPropertyDrafts(JSON.parse(savedDrafts));
    } else {
      setPropertyDrafts(PRESEED_DRAFTS);
      localStorage.setItem('pm_property_drafts', JSON.stringify(PRESEED_DRAFTS));
    }

    if (savedTodos) {
      setTodoList(JSON.parse(savedTodos));
    } else {
      setTodoList(PRESEED_TODOS);
      localStorage.setItem('pm_todo_list', JSON.stringify(PRESEED_TODOS));
    }

    if (savedAssets) {
      setCommittedAssets(JSON.parse(savedAssets));
    } else {
      setCommittedAssets(INITIAL_ASSETS);
      localStorage.setItem('pm_committed_assets', JSON.stringify(INITIAL_ASSETS));
    }
  }, []);

  const triggerToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: null });
    }, 4500);
  };

  // Draft handlings
  const handleSaveDraft = (draft: PropertyDraft) => {
    const updated = [...propertyDrafts];
    const index = updated.findIndex(d => d.id === draft.id);
    if (index > -1) {
      updated[index] = draft;
    } else {
      updated.push(draft);
    }
    setPropertyDrafts(updated);
    localStorage.setItem('pm_property_drafts', JSON.stringify(updated));
    triggerToast(`房源草稿 “${draft.propertyName || '未命名'}” 已经成功暂存，已计入左下角进度器！`, 'info');
  };

  const handleSubmitDraft = (draft: PropertyDraft) => {
    // 1. Remove from drafts list
    const filtered = propertyDrafts.filter(d => d.id !== draft.id);
    setPropertyDrafts(filtered);
    localStorage.setItem('pm_property_drafts', JSON.stringify(filtered));

    // 2. Insert into committed assets (turns draft into rich committed asset!)
    const priceNum = Number(draft.price) || 0;
    const priceStr = priceNum > 0 ? `¥${priceNum.toLocaleString()}/月` : '暂未定价';
    
    const newAsset = {
      id: `asset_${Date.now()}`,
      name: draft.propertyName || '未命名项目',
      type: draft.propertyType || 'residential',
      area: `${draft.layoutArea || draft.area || '0'}㎡`,
      price: priceStr,
      address: draft.address || '地址待确认',
      status: '审核中 (Pending Review)',
      
      // UPGRADED PROJECT ASSET METADATA
      isUpgradedAsset: true,
      entryMode: draft.entryMode || 'new',
      entryScope: draft.entryScope || 'full',
      managementMode: draft.managementMode || 'central',
      
      projectInfo: {
        propertyName: draft.propertyName || '未命名项目',
        propertyAlias: draft.propertyAlias || '暂无项目别名',
        propertySource: draft.propertySource || '主动开发',
        address: draft.address || '暂无详细地址',
        buildingNo: draft.buildingNo || '暂无单元楼栋',
        description: draft.description || '暂无项目说明说明'
      },
      
      ownershipInfo: {
        holdingType: draft.holdingType || 'self',
        ownerName: draft.ownerName || '未录入',
        ownerPhone: draft.ownerPhone || '未录入',
        ownerRelation: draft.ownerRelation || '确权人本人',
        ownerDocUploaded: draft.ownerDocUploaded || false
      },
      
      layoutInfo: draft.entryScope === 'skeleton' ? null : {
        layoutName: draft.layoutName || '默认房型模版',
        layoutArea: draft.layoutArea || '0',
        layoutRoomsCount: draft.layoutRoomsCount || '0',
        layoutBathroomCount: draft.layoutBathroomCount || '0',
        layoutDirection: draft.layoutDirection || '南北朝向',
        layoutBedType: draft.layoutBedType || '独立大床'
      },
      
      roomGenerationSummary: (draft.entryScope === 'skeleton' || draft.entryScope === 'layout') ? null : {
        floorStart: draft.floorStart || '1',
        floorEnd: draft.floorEnd || '1',
        roomsPerFloor: draft.roomsPerFloor || '0',
        roomNoRule: draft.roomNoRule || '{floor}0{index}',
        exceptionsList: draft.exceptionsList || [],
        totalRoomsCount: 0 // Will dynamically display simulated length
      },
      
      closingInfo: {
        price: draft.price,
        priceUnit: draft.priceUnit || '元/月',
        feeDescription: draft.feeDescription || '标准押一付三',
        remark: draft.remark || '无备注记录',
        attachmentsCount: draft.uploadedFiles?.length || 0,
        attachments: draft.uploadedFiles || []
      }
    };
    
    const updatedAssets = [newAsset, ...committedAssets];
    setCommittedAssets(updatedAssets);
    localStorage.setItem('pm_committed_assets', JSON.stringify(updatedAssets));

    // 3. Insert a log todo as completed
    const completionTodo: TaskItem = {
      id: `task_comp_${Date.now()}`,
      title: `房源建档完成审批: ${draft.propertyName}`,
      module: '资产资源部',
      priority: 'medium',
      status: 'completed',
      statusLabel: '已办结',
      updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      assignee: '客服系统智能分配',
      description: `从步骤向导审核提交的优质新房源。商务报价 ¥${draft.price}/月。一键极速上架。`
    };
    const updatedTodos = [completionTodo, ...todoList];
    setTodoList(updatedTodos);
    localStorage.setItem('pm_todo_list', JSON.stringify(updatedTodos));

    setActiveDraftId(null);
    triggerToast(`房源 “${draft.propertyName}” 完美建档！审批单已同步至资产部，可前往房源管理展开浏览。`, 'success');
  };

  const handleDiscardDraft = (draftId: string) => {
    if (window.confirm('您确定要丢弃该房源建档流程吗？此草稿信息将永久擦除。')) {
      const filtered = propertyDrafts.filter(d => d.id !== draftId);
      setPropertyDrafts(filtered);
      localStorage.setItem('pm_property_drafts', JSON.stringify(filtered));
      triggerToast('房源草稿已成功撤销，进度器数据已同步刷新。', 'warn');
    }
  };

  // Todo items handlings (Feature 6: Urging & Completing)
  const handleUrgeTask = (taskId: string) => {
    const updated = todoList.map(todo => {
      if (todo.id === taskId) {
        return {
          ...todo,
          status: 'urging' as const,
          updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return todo;
    });
    setTodoList(updated);
    localStorage.setItem('pm_todo_list', JSON.stringify(updated));

    const target = todoList.find(t => t.id === taskId);
    triggerToast(`🔥 已成功向“${target?.assignee || '经办负责人'}”发出最高等级催办预警！短信及企业微信服务已同步下发。`, 'success');
  };

  const handleCompleteTask = (taskId: string) => {
    const updated = todoList.map(todo => {
      if (todo.id === taskId) {
        return {
          ...todo,
          status: 'completed' as const,
          statusLabel: '已办结',
          updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return todo;
    });
    setTodoList(updated);
    localStorage.setItem('pm_todo_list', JSON.stringify(updated));

    triggerToast('✓ 待办事项已全部处理完毕，已归入已归档办结序列。', 'success');
  };

  const handleAddTodo = (newTodo: TaskItem) => {
    const updated = [newTodo, ...todoList];
    setTodoList(updated);
    localStorage.setItem('pm_todo_list', JSON.stringify(updated));
    triggerToast(`成功登记一单新的工作事项: “${newTodo.title}”！`, 'success');
  };

  // Interactive tab switcher triggered by bottom left click (PRD Focus trigger)
  const focusOnOverviewSection = () => {
    setActiveTab('task-hub');
    triggerToast('已进入独立任务承接区工作台，支持断点流程恢复与催办协同。', 'info');
  };

  return (
    <div id="workspace-app-root" className="flex bg-gray-50 text-gray-850 h-screen w-screen overflow-hidden font-sans">
      
      {/* Toast Popover Alerts */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-xl shadow-2xl border flex items-start space-x-3 text-xs ${
              toast.type === 'success' ? 'bg-emerald-900 border-emerald-800 text-emerald-50' :
              toast.type === 'warn' ? 'bg-rose-900 border-rose-800 text-rose-50' :
              'bg-slate-950 border-slate-800 text-slate-100'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'warn' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}
            
            <div className="space-y-1">
              <span className="font-bold block">
                {toast.type === 'success' ? '系统动作成功触发' : 
                 toast.type === 'warn' ? '系统警告' : '状态暂存提示'}
              </span>
              <p className="leading-relaxed text-gray-200">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Left Sidebar Navigation */}
      <Sidebar 
        onOpenCreatePanel={() => setIsCreatePanelOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        propertyDrafts={propertyDrafts}
        todoList={todoList}
        onFocusOverview={focusOnOverviewSection}
      />

      {/* 2. Main Workspace Viewport */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
        
        {/* Workspace Top Header Bar */}
        <header className="h-16 border-b border-gray-100 bg-white px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 font-medium text-xs font-mono uppercase">CURRENT CONTEXT</span>
            <span className="text-gray-300">/</span>
            <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 block animate-pulse-subtle" />
              <span>
                {activeTab === 'dashboard' ? '工作台大盘 & 状态追踪' : 
                 activeTab === 'properties' ? '房源大底表 (Committed)' : 
                 activeTab === 'crm' ? '意向客户登记池 (CRM)' : 
                 activeTab === 'contracts' ? '合同起草及租约库' : 
                 activeTab === 'workorders' ? '运维工单保修催办部' : '工作效能数据盘点'}
              </span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-xs text-gray-500 font-mono bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg space-x-1.5">
              <Calendar className="w-3..5 h-3.5 text-gray-400" />
              <span>2026年07月09日 星期四</span>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg relative transition-colors">
              <Bell className="w-4 h-4" />
              {todoList.filter(t => t.status === 'urging').length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>
            
            <div className="h-8 w-[1px] bg-gray-100" />
            
            <div className="text-xs text-right hidden sm:block">
              <p className="font-bold text-gray-900">吴经理 (Workspace Admin)</p>
              <p className="text-[10px] text-gray-400">招商与运维部主管</p>
            </div>
          </div>
        </header>

        {/* Viewport Core scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 max-w-5xl mx-auto"
              >
                {/* Hero Greeting Board */}
                <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-indigo-800">
                  <div className="space-y-2 relative z-10">
                    <div className="inline-flex items-center space-x-1.5 bg-indigo-800/60 px-2.5 py-1 rounded-full text-[10px] font-bold text-indigo-200 border border-indigo-700/50">
                      <Sparkles className="w-3 h-3 text-indigo-300" />
                      <span>PM++ 协同大盘首页 v1.1 已发布</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-display font-bold">下午好，吴经理！今天是您的极速协作日</h2>
                    <p className="text-indigo-200 text-xs max-w-xl leading-relaxed">
                      欢迎回到系统首页工作台。在此处您可以直观总览各模块核心经营仪表盘，查看今日紧急催办与待办摘要；需要恢复断点草稿时，可点击左下角【任务进度器】空降任务舱。
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreatePanelOpen(true)}
                    className="bg-white hover:bg-indigo-50 text-indigo-950 font-bold px-4.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-colors shrink-0 z-10 cursor-pointer self-start md:self-auto"
                  >
                    <span>统一发起业务</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {/* Decorative faint background graphics */}
                  <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none" />
                </div>

                {/* Core Dashboard Home Component */}
                <DashboardHome 
                  propertyDrafts={propertyDrafts}
                  todoList={todoList}
                  committedAssets={committedAssets}
                  onLaunchDraft={(draftId) => {
                    setActiveDraftId(draftId);
                  }}
                  onUrgeTask={handleUrgeTask}
                  onCompleteTask={handleCompleteTask}
                  onAddTodo={handleAddTodo}
                  setActiveTab={setActiveTab}
                />
              </motion.div>
            )}

            {/* View A.5: Dedicated Task Hub / Continuation Workspace */}
            {activeTab === 'task-hub' && (
              <motion.div 
                key="task-hub-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 max-w-5xl mx-auto"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-display font-bold text-gray-950">任务承接区与协同工作台 (Task Hub)</h2>
                    <p className="text-xs text-gray-500 mt-0.5">继续暂存中的建档向导、响应业务待办、跟踪催办指令办结进度。</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCreatePanelOpen(true);
                    }}
                    className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow-xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>发起全新建档</span>
                  </button>
                </div>

                {/* Live Task Overview area */}
                <TaskOverview 
                  propertyDrafts={propertyDrafts}
                  todoList={todoList}
                  onLaunchDraft={(draftId) => {
                    setActiveDraftId(draftId);
                  }}
                  onDiscardDraft={handleDiscardDraft}
                  onUrgeTask={handleUrgeTask}
                  onCompleteTask={handleCompleteTask}
                  onAddTodo={handleAddTodo}
                />
              </motion.div>
            )}

            {/* View B: Dedicated committed Properties table */}
            {activeTab === 'properties' && (
              <motion.div 
                key="properties-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-5xl mx-auto"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-display font-bold text-gray-950">资产库及房源底表 (Committed Properties)</h2>
                    <p className="text-xs text-gray-500 mt-0.5">已完成4步建档审批上报的录入资产清单。</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCreatePanelOpen(true);
                      triggerToast('请点击新建面板中的“房源建档主流程”开始添加！', 'info');
                    }}
                    className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>建档新房源</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">资产名称</th>
                        <th className="p-4">类型</th>
                        <th className="p-4">面积</th>
                        <th className="p-4">参考条件/价格</th>
                        <th className="p-4">详细地址</th>
                        <th className="p-4">业务状态</th>
                        <th className="p-4 text-right">结构透视</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-sans">
                      {committedAssets.map((asset, idx) => {
                        const isExpanded = expandedAssetId === asset.id;
                        return (
                          <React.Fragment key={asset.id || idx}>
                            <tr 
                              onClick={() => setExpandedAssetId(isExpanded ? null : asset.id)}
                              className="hover:bg-slate-50/70 transition-colors cursor-pointer border-b border-gray-150"
                            >
                              <td className="p-4 font-bold text-gray-900 flex items-center space-x-1.5">
                                {asset.isUpgradedAsset && <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 animate-pulse-subtle" />}
                                <span>{asset.name}</span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium font-mono uppercase ${
                                  asset.type === 'residential' ? 'bg-amber-50 text-amber-800' :
                                  asset.type === 'commercial' ? 'bg-indigo-50 text-indigo-800' :
                                  'bg-purple-50 text-purple-850'
                                }`}>
                                  {asset.type === 'residential' ? '住宅' : asset.type === 'commercial' ? '写字楼' : '厂房仓储'}
                                </span>
                              </td>
                              <td className="p-4 font-mono">{asset.area}</td>
                              <td className="p-4 font-mono font-semibold text-gray-700">{asset.price}</td>
                              <td className="p-4 text-gray-500 truncate max-w-xs">{asset.address}</td>
                              <td className="p-4">
                                <span className={`inline-flex items-center space-x-1 text-[10px] font-bold ${
                                  asset.status.includes('审核中') ? 'text-amber-600 animate-pulse-subtle' :
                                  asset.status.includes('已租') ? 'text-emerald-600' : 'text-gray-500'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    asset.status.includes('审核中') ? 'bg-amber-500' :
                                    asset.status.includes('已租') ? 'bg-emerald-500' : 'bg-gray-400'
                                  }`} />
                                  <span>{asset.status}</span>
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button className="text-indigo-600 hover:text-indigo-900 font-bold text-[11px] inline-flex items-center space-x-1">
                                  <span>{isExpanded ? '收起' : '透视'}</span>
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              </td>
                            </tr>

                            {isExpanded && (
                              <tr className="bg-slate-55/40">
                                <td colSpan={7} className="p-5 bg-slate-50/40">
                                  {!asset.isUpgradedAsset ? (
                                    <div className="bg-white rounded-xl border border-gray-150 p-6 text-center shadow-3xs text-gray-400">
                                      <Building2 className="w-8 h-8 mx-auto text-gray-200 mb-2 animate-bounce-subtle" />
                                      <p className="text-xs font-bold text-gray-700">【历史底表归档记录】</p>
                                      <p className="text-[10px] text-gray-400 mt-1 max-w-lg mx-auto leading-relaxed">
                                        此房源为系统内置的历史归档数据。多维项目资产结构（包含：1步分流隔离、2步项目骨架、3步确权主体、4步房型参数、5步房间生成、6步收口）
                                        仅能在通过顶部的 <span className="font-semibold text-indigo-600">【统一新建 -&gt; 房源建档主流程】</span> 进行完整的纵向业务匹配提交后完美呈现。
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-5 space-y-4 text-xs font-sans text-gray-600">
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                          <span className="font-bold text-gray-900 text-sm">【多维项目资产透视图】{asset.name}</span>
                                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                            asset.entryScope === 'skeleton' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                            asset.entryScope === 'layout' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                                            'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                          }`}>
                                            {asset.entryScope === 'skeleton' ? '仅项目骨架归档' :
                                             asset.entryScope === 'layout' ? '项目及房型归档' : '物理客房全量穿透'}
                                          </span>
                                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono uppercase font-semibold">
                                            {asset.managementMode === 'central' ? '集中式管理' : '整租式管理'}
                                          </span>
                                        </div>
                                        <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-55 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                                          ✓ MULTI-DIMENSIONAL INTEGRITY CONFIRMED
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {/* Step 2 Column */}
                                        <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 space-y-1.5">
                                          <div className="flex items-center space-x-1 border-b border-slate-200 pb-1 mb-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-indigo-600 animate-pulse-subtle" />
                                            <span className="font-bold text-gray-800">1. 项目骨架落点</span>
                                          </div>
                                          <p><span className="text-gray-400">别名:</span> <span className="font-semibold text-gray-700">{asset.projectInfo?.propertyAlias || '无'}</span></p>
                                          <p><span className="text-gray-400">来源:</span> <span className="font-semibold text-gray-700">{asset.projectInfo?.propertySource}</span></p>
                                          <p><span className="text-gray-400">单元栋号:</span> <span className="font-semibold text-gray-700">{asset.projectInfo?.buildingNo}</span></p>
                                          <p className="line-clamp-2 text-gray-500 italic"><span className="text-gray-400 not-italic">说明:</span> {asset.projectInfo?.description}</p>
                                        </div>

                                        {/* Step 3 Column */}
                                        <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 space-y-1.5">
                                          <div className="flex items-center space-x-1 border-b border-slate-200 pb-1 mb-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                                            <span className="font-bold text-gray-800">2. 确权及房东主体</span>
                                          </div>
                                          <p><span className="text-gray-400">房东姓名:</span> <span className="font-semibold text-gray-700">{asset.ownershipInfo?.ownerName}</span></p>
                                          <p><span className="text-gray-400">联络电话:</span> <span className="font-semibold text-gray-700 font-mono">{asset.ownershipInfo?.ownerPhone}</span></p>
                                          <p><span className="text-gray-400">权属类型:</span> <span className="font-semibold text-gray-700">{asset.ownershipInfo?.holdingType === 'self' ? '自有产权' : '转租/托管'}</span></p>
                                          <p className="flex items-center space-x-1">
                                            <span className="text-gray-400">原件核验:</span>
                                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                              asset.ownershipInfo?.ownerDocUploaded ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                            }`}>
                                              {asset.ownershipInfo?.ownerDocUploaded ? '✓ 已验证原件' : '✗ 待验原件'}
                                            </span>
                                          </p>
                                        </div>

                                        {/* Step 4 Column */}
                                        <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 space-y-1.5">
                                          <div className="flex items-center space-x-1 border-b border-slate-200 pb-1 mb-1.5">
                                            <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
                                            <span className="font-bold text-gray-800">3. 房型空间体系</span>
                                          </div>
                                          {asset.entryScope === 'skeleton' ? (
                                            <div className="text-amber-600 text-[10px] leading-relaxed bg-amber-50/50 p-2 rounded border border-amber-100/50">
                                              <p className="font-bold">【骨架分流跳过】</p>
                                              <p className="text-[9px] mt-0.5">建档范围选择为“仅骨架”，房型及后续物理房间匹配已安全绕过。</p>
                                            </div>
                                          ) : (
                                            <>
                                              <p><span className="text-gray-400">房型名称:</span> <span className="font-semibold text-gray-700">{asset.layoutInfo?.layoutName}</span></p>
                                              <p><span className="text-gray-400">朝向/床位:</span> <span className="font-semibold text-gray-700">{asset.layoutInfo?.layoutDirection}/{asset.layoutInfo?.layoutBedType}</span></p>
                                              <p><span className="text-gray-400">套内面积:</span> <span className="font-semibold text-gray-700 font-mono">{asset.layoutInfo?.layoutArea} ㎡</span></p>
                                              <p><span className="text-gray-400">空间结构:</span> <span className="font-semibold text-gray-700 font-mono">{asset.layoutInfo?.layoutRoomsCount}室 {asset.layoutInfo?.layoutBathroomCount}卫</span></p>
                                            </>
                                          )}
                                        </div>

                                        {/* Step 5 Column */}
                                        <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 space-y-1.5">
                                          <div className="flex items-center space-x-1 border-b border-slate-200 pb-1 mb-1.5">
                                            <Layers className="w-3.5 h-3.5 text-indigo-600" />
                                            <span className="font-bold text-gray-800">4. 物理客房生产</span>
                                          </div>
                                          {asset.entryScope === 'skeleton' ? (
                                            <div className="text-amber-600 text-[10px] leading-relaxed bg-amber-50/50 p-2 rounded border border-amber-100/50">
                                              <p className="font-bold">【骨架分流跳过】</p>
                                              <p className="text-[9px] mt-0.5">物理房间总量：0 间。</p>
                                            </div>
                                          ) : asset.entryScope === 'layout' ? (
                                            <div className="text-indigo-600 text-[10px] leading-relaxed bg-indigo-50/50 p-2 rounded border border-indigo-100/50">
                                              <p className="font-bold">【房型匹配分流】</p>
                                              <p className="text-[9px] mt-0.5">已根据房型模板落档，跳过物理单房排号批量生产，总量：0 间。</p>
                                            </div>
                                          ) : (
                                            <>
                                              <p><span className="text-gray-400">楼层区间:</span> <span className="font-semibold text-gray-700 font-mono">{asset.roomGenerationSummary?.floorStart} ~ {asset.roomGenerationSummary?.floorEnd} 层</span></p>
                                              <p><span className="text-gray-400">每层客房数:</span> <span className="font-semibold text-gray-700 font-mono">{asset.roomGenerationSummary?.roomsPerFloor} 间/层</span></p>
                                              <p className="truncate"><span className="text-gray-400">排除不建档房号:</span> <span className="font-mono text-[9px] text-rose-600">{asset.roomGenerationSummary?.exceptionsList?.length > 0 ? asset.roomGenerationSummary.exceptionsList.join(', ') : '无'}</span></p>
                                              <p className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-100 inline-block">
                                                已批量派号生成实体
                                              </p>
                                            </>
                                          )}
                                        </div>
                                      </div>

                                      {/* Bottom Pricing & Attachments review bar */}
                                      <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] gap-3">
                                        <div>
                                          <p className="font-bold text-gray-800 mb-0.5">5. 商务定价与证明材料核验</p>
                                          <p className="text-gray-500">
                                            租金基准价格: <span className="text-indigo-600 font-bold font-mono">{asset.price}</span> | 收退杂费约定: <span className="text-gray-700 font-semibold">{asset.closingInfo?.feeDescription}</span>
                                          </p>
                                          <p className="text-gray-400 mt-0.5">最终建档备注说明: <span className="italic text-gray-600">{asset.closingInfo?.remark || '无'}</span></p>
                                        </div>
                                        <div className="flex flex-col sm:items-end justify-center shrink-0">
                                          <span className="text-[10px] text-gray-400 font-mono font-bold uppercase mb-1">
                                            已存档证明材料及项目测绘图纸 ({asset.closingInfo?.attachments?.length || 0})
                                          </span>
                                          {asset.closingInfo?.attachments?.length > 0 ? (
                                            <div className="flex flex-wrap gap-1 justify-end">
                                              {asset.closingInfo.attachments.map((file: string, fIdx: number) => (
                                                <span key={fIdx} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[9px] font-mono border border-indigo-100">
                                                  📄 {file}
                                                </span>
                                              ))}
                                            </div>
                                          ) : (
                                            <span className="text-gray-400 italic text-[10px]">未归档测绘/确权扫描件附件</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* View C: CRM Clients Intention list */}
            {activeTab === 'crm' && (
              <motion.div 
                key="crm-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-5xl mx-auto"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-display font-bold text-gray-950">意向客户登记池 (CRM Database)</h2>
                    <p className="text-xs text-gray-500 mt-0.5">登记进来的寻租及寻购意向客户，关联跟进工单状态。</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCreatePanelOpen(true);
                      triggerToast('请在新建面板中选择“登记意向客源”开始填表！', 'info');
                    }}
                    className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>登记新客户</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-gray-100 space-y-3 shadow-3xs">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase font-mono">签约阶段意向客户</h4>
                    <div className="divide-y divide-gray-50 text-xs">
                      <div className="py-2.5 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">上海复旦微电子集团 (高新企业)</p>
                          <p className="text-[10px] text-gray-400">寻求商铺/写字楼: 2000㎡左右 • 预算 ¥350,000/月</p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">签约锁定中</span>
                      </div>
                      <div className="py-2.5 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">赵维维 先生 (海外创客)</p>
                          <p className="text-[10px] text-gray-400">寻求精装住宅: 150㎡ • 预算 ¥18,000/月</p>
                        </div>
                        <span className="bg-indigo-50 text-indigo-800 font-bold px-2 py-0.5 rounded text-[10px]">方案对比中</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-gray-100 space-y-3 shadow-3xs">
                    <h4 className="text-xs font-bold text-amber-600 uppercase font-mono">从快速面板登记客源 (Todo-Linked)</h4>
                    <div className="divide-y divide-gray-50 text-xs font-sans">
                      {todoList.filter(t => t.title.startsWith('客户登记')).length === 0 ? (
                        <p className="text-xs text-gray-400 py-6 text-center">暂无从统一新建面板快速登记的临时客源。点击“统一新建业务 -&gt; 登记意向客源”提交试一下吧！</p>
                      ) : (
                        todoList.filter(t => t.title.startsWith('客户登记')).map(item => (
                          <div key={item.id} className="py-2.5 flex items-center justify-between">
                            <div>
                              <p className="font-bold text-gray-950 truncate max-w-xs">{item.title}</p>
                              <p className="text-[10px] text-gray-400">{item.description}</p>
                            </div>
                            <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-[10px]">待补资料</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* View D: Contracts view */}
            {activeTab === 'contracts' && (
              <motion.div 
                key="contracts-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-5xl mx-auto"
              >
                <div>
                  <h2 className="text-lg font-display font-bold text-gray-950">合同租约起草 (Draft Lease Contracts)</h2>
                  <p className="text-xs text-gray-500 mt-0.5">签约主体、商务条款核对底表。</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center py-12 text-gray-400">
                  <Building2 className="w-12 h-12 text-gray-200 mb-2" />
                  <p className="text-xs font-bold text-gray-800">租赁合约模板库已自动载入</p>
                  <p className="text-[10px] text-gray-400 max-w-md mt-1">系统已关联房源起草和收款流。您一旦通过房源建档提交了新房，可在统一新建中快速触发起草合同，将自动调取租售价，计算保证金。</p>
                </div>
              </motion.div>
            )}

            {/* View E: Work orders focus panel */}
            {activeTab === 'workorders' && (
              <motion.div 
                key="workorders-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-5xl mx-auto"
              >
                <div>
                  <h2 className="text-lg font-display font-bold text-gray-950">运维保障工单部 (Maintenance Work Orders)</h2>
                  <p className="text-xs text-gray-500 mt-0.5">支持紧急抢修催办、突发故障状态监控。</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">紧急工单跟踪盘点</span>
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">实时运维通道</span>
                  </div>

                  <div className="divide-y divide-gray-100 space-y-1">
                    {todoList.map((todo) => (
                      <div key={todo.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center space-x-1.5 mb-1">
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                              todo.priority === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {todo.priority === 'high' ? '紧急' : '普通'}
                            </span>
                            <span className="font-bold text-gray-900">{todo.title}</span>
                          </div>
                          <p className="text-[10px] text-gray-500">{todo.description}</p>
                        </div>
                        <div className="text-right">
                          <span className={`font-mono text-[10px] font-bold ${
                            todo.status === 'urging' ? 'text-rose-600 animate-pulse-subtle' :
                            todo.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'
                          }`}>
                            {todo.status === 'urging' ? '催办指令派发中' : todo.status === 'completed' ? '已办结' : '排单跟进中'}
                          </span>
                          <p className="text-[10px] text-gray-400 mt-0.5">责任人: {todo.assignee}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* View F: Productivity Analytics */}
            {activeTab === 'analytics' && (
              <motion.div 
                key="analytics-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-5xl mx-auto"
              >
                <div>
                  <h2 className="text-lg font-display font-bold text-gray-950">项目效能数据盘点 (Workspace Conversion Hub)</h2>
                  <p className="text-xs text-gray-500 mt-0.5">房源录入草稿转化率、工单催办结办速度盘点。</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1 */}
                  <div className="bg-white p-5 rounded-xl border border-gray-100 space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">向导流程漏斗转化</h4>
                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[10px] text-gray-500">
                          <span>第1步: 基础录入</span>
                          <span className="font-bold">100%</span>
                        </div>
                        <div className="h-2 bg-indigo-50 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[10px] text-gray-500">
                          <span>第2步: 价格面积</span>
                          <span className="font-bold">85%</span>
                        </div>
                        <div className="h-2 bg-indigo-50 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[10px] text-gray-500">
                          <span>第3步: 核心优势(特色)</span>
                          <span className="font-bold">70%</span>
                        </div>
                        <div className="h-2 bg-indigo-50 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: '70%' }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[10px] text-gray-500">
                          <span>第4步: 证明文件(完结提交)</span>
                          <span className="font-bold">48%</span>
                        </div>
                        <div className="h-2 bg-indigo-50 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: '48%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white p-5 rounded-xl border border-gray-100 space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">催办应急指数 (Urgency Index)</h4>
                    <div className="pt-2 flex flex-col items-center">
                      <span className="text-4xl font-black text-rose-600 font-display">98.4%</span>
                      <p className="text-[10px] text-gray-400 mt-1">2小时内极速响应办结率</p>
                      <div className="w-full bg-rose-50 border border-rose-100 text-rose-800 text-[10px] rounded p-2.5 mt-4 leading-normal font-sans">
                        🔥 <strong>催办器优势：</strong>催办按钮成功联动短信微通道后，责任部门排单速率比传统纸质或口头传达提升 3.4 倍。
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white p-5 rounded-xl border border-gray-100 space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">房源草稿断点缓存</h4>
                    <div className="space-y-3 text-xs text-gray-500 leading-relaxed font-sans">
                      <p>工作台首页在本地数据库自动启用缓存安全策略，每隔 <strong>2秒</strong> 对正在进行的建档过程、新录入的附件、表单选项进行物理暂存，确保网络中断、误点、或换电脑登录时可以 <strong>100% 完整找回断点</strong>。</p>
                      <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 p-2 rounded border border-emerald-100 font-mono text-[10px]">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>自动缓存机制：正常运载中</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* 3. Global Unified Create Overlay (Feature 1 & 2) */}
      <AnimatePresence>
        {isCreatePanelOpen && (
          <UnifiedCreatePanel 
            onClose={() => setIsCreatePanelOpen(false)}
            onLaunchPropertyWizard={() => {
              setActiveDraftId(`prop_draft_${Date.now()}`); // Create a fresh draft id
            }}
            onAddQuickTodo={handleAddTodo}
          />
        )}
      </AnimatePresence>

      {/* 4. Global Interactive Property Listing Wizard Modal (Feature 5: Draft Resume System) */}
      {activeDraftId && (
        <PropertyWizard 
          draftId={activeDraftId === 'NEW' ? null : activeDraftId}
          onClose={() => {
            setActiveDraftId(null);
          }}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmitDraft}
          initialDrafts={propertyDrafts}
        />
      )}
    </div>
  );
}
