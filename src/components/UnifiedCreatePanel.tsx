import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Search, Home, Users, FileText, ClipboardCopy, Star, Plus,
  ShieldCheck, Briefcase, Zap, KeyRound, Hammer, HelpCircle, ArrowUpRight
} from 'lucide-react';
import { TaskItem } from '../types';

interface UnifiedCreatePanelProps {
  onClose: () => void;
  onLaunchPropertyWizard: () => void;
  onAddQuickTodo: (todo: TaskItem) => void;
}

const CATEGORIES = [
  {
    id: 'assets',
    title: '房产物权与资产管理 (Property & Assets)',
    items: [
      { id: 'prop_main', name: '房源建档主流程', desc: '快速录入住宅、商用、写字楼，支持暂存草稿和断点恢复。', icon: Home, isPrimary: true, actionType: 'wizard' },
      { id: 'office', name: '写字楼/联合办公建档', desc: '登记多工位、整层、整栋等灵活商业写字楼，关联楼宇指数。', icon: Star, isPrimary: false, actionType: 'demo' },
      { id: 'parking', name: '车库车位录入', desc: '批量或单个登记配套地下、路侧、地上产权车位及月租策略。', icon: Zap, isPrimary: false, actionType: 'demo' },
    ]
  },
  {
    id: 'crm',
    title: '客户关系与租赁服务 (CRM & Contracts)',
    items: [
      { id: 'client', name: '登记意向客源', desc: '录入新租客、买家需求，关联购租偏好、预算范围、预算周期。', icon: Users, isPrimary: false, actionType: 'clientForm' },
      { id: 'lease', name: '起草租赁合同', desc: '选择签约主体、商务条款，自动核算租金首期及保证金。', icon: FileText, isPrimary: false, actionType: 'demo' },
      { id: 'finance', name: '生成财务收款账单', desc: '针对已有合约发起首期付款、续租交费、押金催收通知单。', icon: ClipboardCopy, isPrimary: false, actionType: 'demo' },
    ]
  },
  {
    id: 'ops',
    title: '运维保障与组织协同 (Operations & Collab)',
    items: [
      { id: 'ticket', name: '申报保障运维工单', desc: '实时登记故障保修、突发跳闸、紧急保洁、安全隐患申报。', icon: Hammer, isPrimary: true, actionType: 'ticketForm' },
      { id: 'onboarding', name: '新员工入职协同办理', desc: '录入新伙伴信息、自动分配OA权限，生成物资预领单。', icon: Briefcase, isPrimary: false, actionType: 'demo' },
      { id: 'approval', name: '发起跨部门通用审批', desc: '支持用印、借款、特批折扣、特殊付款期等流转审批流程。', icon: ShieldCheck, isPrimary: false, actionType: 'demo' },
    ]
  }
];

export default function UnifiedCreatePanel({ 
  onClose, 
  onLaunchPropertyWizard,
  onAddQuickTodo
}: UnifiedCreatePanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFastTicketForm, setShowFastTicketForm] = useState(false);
  const [showFastClientForm, setShowFastClientForm] = useState(false);
  
  // Ticket fast form state
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketModule, setTicketModule] = useState('招商运维部');
  const [ticketPriority, setTicketPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [ticketDesc, setTicketDesc] = useState('');

  // Client fast form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientBudget, setClientBudget] = useState('');
  const [clientType, setClientType] = useState('住宅需求');

  const [notification, setNotification] = useState('');

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleItemClick = (item: any) => {
    if (item.actionType === 'wizard') {
      onLaunchPropertyWizard();
      onClose();
    } else if (item.actionType === 'ticketForm') {
      setShowFastTicketForm(true);
    } else if (item.actionType === 'clientForm') {
      setShowFastClientForm(true);
    } else {
      triggerToast(`【${item.name}】已成功初始化并缓存草稿底表！您可随时在进度器中点击恢复。`);
    }
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim()) return;

    const newTicket: TaskItem = {
      id: `ticket_${Date.now()}`,
      title: ticketTitle,
      module: ticketModule,
      priority: ticketPriority,
      status: 'pending',
      statusLabel: '待处理',
      updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      assignee: '客服系统智能分配',
      description: ticketDesc || '通过快速新建面板自主申报的业务运维工单'
    };

    onAddQuickTodo(newTicket);
    triggerToast(`工单 “${ticketTitle}” 申报成功！已接入任务待办流。`);
    
    // Reset
    setTicketTitle('');
    setTicketDesc('');
    setShowFastTicketForm(false);
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const newClientTodo: TaskItem = {
      id: `client_${Date.now()}`,
      title: `客户登记: ${clientName} (${clientType}) - 预算 ¥${clientBudget || '待面议'}/月`,
      module: '客户关系CRM部',
      priority: 'high',
      status: 'draft_pending',
      statusLabel: '待补资料',
      updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      assignee: '租赁置业顾问联络',
      description: `客户电话: ${clientPhone || '未预留'}. 需尽快跟进购租意向并推荐匹配房源`
    };

    onAddQuickTodo(newClientTodo);
    triggerToast(`客源 “${clientName}” 登记完毕！已为您创建“待补资料”追踪工单。`);

    // Reset
    setClientName('');
    setClientPhone('');
    setClientBudget('');
    setShowFastClientForm(false);
  };

  // Filter categories based on search
  const filteredCategories = CATEGORIES.map(category => {
    const items = category.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...category, items };
  }).filter(cat => cat.items.length > 0);

  return (
    <div id="unified-create-overlay" className="fixed inset-0 z-45 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-16 px-4 overflow-y-auto pb-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 z-50 bg-slate-950 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 border border-slate-800"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
      >
        {/* Panel Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono">WORKSPACE ACTIONS</span>
            <h2 className="text-xl font-display font-bold text-gray-950">统一新建覆盖舱 (Create Workspace Panel)</h2>
            <p className="text-xs text-gray-500 mt-1">
              高频业务一键直达，保留草稿，智能沉淀工作痕迹。
            </p>
          </div>
          <div className="flex items-center space-x-3 self-end md:self-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索高频新建业务..."
                className="w-56 pl-8 pr-4 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 transition-all placeholder:text-gray-400"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
            <button 
              id="close-create-panel-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panel Core Content Grid */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh]">
          {filteredCategories.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <HelpCircle className="w-12 h-12 text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-800">没有找到相关的新建指令</p>
              <p className="text-xs text-gray-400 mt-1">请尝试更换关键字搜索，例如：房源、工单、客源</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCategories.map((category) => (
                <div key={category.id} className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-display flex items-center space-x-1.5">
                    <span className="w-1.5 h-3 bg-indigo-600 rounded-xs inline-block" />
                    <span>{category.title}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className={`relative p-5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between group ${
                            item.isPrimary 
                              ? 'bg-gradient-to-br from-indigo-50/50 to-white border-indigo-200 hover:border-indigo-500 hover:shadow-md' 
                              : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-xs'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                item.isPrimary ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                            <h4 className="text-xs font-bold text-gray-900 flex items-center">
                              {item.name}
                              {item.isPrimary && (
                                <span className="ml-2 bg-indigo-100 text-indigo-700 text-[9px] font-medium px-1.5 py-0.5 rounded-full font-mono">高频核心</span>
                              )}
                            </h4>
                            <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                              {item.desc}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-50 text-[9px] font-mono font-medium text-gray-400 group-hover:text-indigo-600 transition-colors">
                            {item.actionType === 'wizard' ? '→ 点击启动多步向导流程' : 
                             item.actionType === 'ticketForm' ? '→ 填表自主申报工单' : 
                             item.actionType === 'clientForm' ? '→ 极速补录客源信息' : '→ 初始化轻量草稿'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Fast Ticket creation modal (Feature 6 & interconnectivity) */}
        <AnimatePresence>
          {showFastTicketForm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-950 flex items-center">
                      <Hammer className="w-4 h-4 text-amber-500 mr-2" />
                      申报保障运维工单
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">申报完成后，工单会进入任务进度器并直接呈现在主待办看板上。</p>
                  </div>
                  <button 
                    onClick={() => setShowFastTicketForm(false)}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">工单标题 / 突发故障简述 *</label>
                    <input
                      type="text"
                      required
                      value={ticketTitle}
                      onChange={(e) => setTicketTitle(e.target.value)}
                      placeholder="如: 3号楼2层漏水排查、大厅闸机故障"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">对接部门</label>
                      <select 
                        value={ticketModule}
                        onChange={(e) => setTicketModule(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                      >
                        <option value="招商运维部">招商运维部</option>
                        <option value="财务/审批部">财务/审批部</option>
                        <option value="安全事务中心">安全事务中心</option>
                        <option value="客服行政部">客服行政部</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">优先级</label>
                      <div className="flex space-x-1.5 mt-1">
                        {(['high', 'medium', 'low'] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setTicketPriority(p)}
                            className={`flex-1 py-1 rounded text-[10px] font-medium transition-colors border ${
                              ticketPriority === p 
                                ? p === 'high' ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold' :
                                  p === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold' :
                                  'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {p === 'high' ? '紧急' : p === 'medium' ? '一般' : '低'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">补充说明 (Description)</label>
                    <textarea
                      value={ticketDesc}
                      onChange={(e) => setTicketDesc(e.target.value)}
                      placeholder="请详细描述问题，客服团队会立即跟进处理..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
                  >
                    立即申报并同步工作流
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Fast Client creation modal (Feature 6 & CRM) */}
        <AnimatePresence>
          {showFastClientForm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-950 flex items-center">
                      <Users className="w-4 h-4 text-emerald-500 mr-2" />
                      登记意向客源
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">补录客户后，将在首页进度器和工单中创建“待补资料”卡片。</p>
                  </div>
                  <button 
                    onClick={() => setShowFastClientForm(false)}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleClientSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">客户姓名 *</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="例如: 陆先生、张女士"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">意向类型</label>
                      <select 
                        value={clientType}
                        onChange={(e) => setClientType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                      >
                        <option value="住宅租房需求">住宅租房需求</option>
                        <option value="住宅买房需求">住宅买房需求</option>
                        <option value="商业办公租赁">商业办公租赁</option>
                        <option value="厂房仓储配套">厂房仓储配套</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">每月/总价预算 (元)</label>
                      <input
                        type="number"
                        value={clientBudget}
                        onChange={(e) => setClientBudget(e.target.value)}
                        placeholder="例如: 8000"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">联络电话</label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="留空则作为后续进度待补事项"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
                  >
                    立即录入CRM并生成跟进工单
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
