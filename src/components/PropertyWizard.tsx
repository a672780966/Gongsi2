import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ArrowLeft, ArrowRight, Save, ClipboardList, CheckCircle2, 
  MapPin, DollarSign, Layers, Check, UploadCloud, Info, Trash2,
  Building, Key, Home, Plus, AlertCircle, Sparkles
} from 'lucide-react';
import { PropertyDraft } from '../types';

interface PropertyWizardProps {
  draftId?: string | null;
  onClose: () => void;
  onSaveDraft: (draft: PropertyDraft) => void;
  onSubmit: (draft: PropertyDraft) => void;
  initialDrafts: PropertyDraft[];
}

const PROPERTY_TYPES = [
  { id: 'residential', label: '普通住宅 (Residential)', icon: '🏠', desc: '商品房、公寓、别墅等居住用房' },
  { id: 'commercial', label: '商业写字楼 (Commercial)', icon: '🏢', desc: '临街商铺、写字楼、酒店、产业园等' },
  { id: 'industrial', label: '工业厂房 (Industrial)', icon: '🏭', desc: '厂房、高标仓库、物流中心等工业地产' },
  { id: 'apartment', label: '集中式公寓 (Apartment)', icon: '🏢', desc: '整栋青年公寓、白领公寓、蓝领宿舍' },
  { id: 'other', label: '其他物权 (Other)', icon: '📦', desc: '车位、储藏室、特殊商业用房等' },
];

const MANAGEMENT_MODES = [
  { id: 'central', label: '集中管理', icon: '⚡', desc: '统一规划、统收统付，适合整栋公寓、产业园、整层商办' },
  { id: 'entire', label: '整租管理', icon: '🔑', desc: '一房一客、整套出租，适合住宅、独栋商办、单个商铺' },
  { id: 'shared', label: '合租管理', icon: '👥', desc: '按房间/工位分拆出租，适合多室合租、联合办公位' }
];

const ENTRY_MODES = [
  { id: 'new', label: '新项目建档', icon: '✨', desc: '全新资产首次录入，从最底层的物理空间骨架建立起' },
  { id: 'existing', label: '已有项目补录', icon: '📝', desc: '项目已存在，仅补齐缺失的主体关系、房型模板或房间' }
];

const ENTRY_SCOPES = [
  { id: 'skeleton', label: '仅项目骨架', icon: '🏗️', desc: '仅录入项目名、详细地址和权属主体，不生成具体房间' },
  { id: 'layout', label: '项目 + 房型体系', icon: '📐', desc: '录入项目的同时，预设核心房型参数模板，不生成房间' },
  { id: 'full', label: '项目 + 房型 + 房间全量', icon: '🌈', desc: '一站式打穿，完成项目、主体、房型到所有房间排号生成' }
];

const HOLDING_TYPES = [
  { id: 'self', label: '自有产权/自持物业', desc: '我方或关联公司直接持有产权，无额外拿房租金成本' },
  { id: 'lease', label: '租赁他人物业/托管', desc: '从第三方大房东或个人业主处租赁、受托，存在付租或托管协议' },
  { id: 'other', label: '合作联营/其他', desc: '通过利润分成、股权合作、代管等其他复杂商务模式获取' }
];

export default function PropertyWizard({ 
  draftId, 
  onClose, 
  onSaveDraft, 
  onSubmit, 
  initialDrafts 
}: PropertyWizardProps) {
  
  // Initialize with upgraded full draft schema
  const [formData, setFormData] = useState<PropertyDraft>({
    id: draftId || `prop_draft_${Date.now()}`,
    propertyName: '',
    propertyType: 'residential',
    buildingNo: '',
    area: '',
    price: '',
    address: '',
    floorNo: '1',
    features: [],
    uploadedFiles: [],
    currentStep: 1,
    updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    
    // Default business workflow parameters
    currentStageKey: 'prep',
    currentStageName: '录入前准备',
    managementMode: 'central',
    entryMode: 'new',
    entryScope: 'full',
    supplementTargetStep: 2,

    // Step 2 defaults
    propertyAlias: '',
    propertySource: '一手业主托管',
    description: '',

    // Step 3 defaults
    holdingType: 'self',
    ownerName: '',
    ownerContact: '',
    ownerPhone: '',
    ownerRelation: '权属主体本人',
    ownerDocUploaded: false,

    // Step 4 defaults
    hasLayoutTemplate: true,
    layoutName: '标准两室一厅',
    layoutRoomsCount: '2',
    layoutArea: '89',
    layoutDirection: '南北通透',
    layoutBathroomCount: '1',
    layoutBedType: '双人床',

    // Step 5 defaults
    floorStart: '1',
    floorEnd: '10',
    roomsPerFloor: '4',
    roomNoRule: '{floor}0{index}',
    matchingMode: 'auto',
    exceptionsList: [],

    // Step 6 defaults
    priceUnit: '元/月',
    feeDescription: '包含物业基础清扫、垃圾转运、公摊照明及基础设备安全巡检服务。',
    remark: ''
  });

  const [dragActive, setDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [exceptionsInput, setExceptionsInput] = useState('');

  useEffect(() => {
    if (draftId) {
      const existing = initialDrafts.find(d => d.id === draftId);
      if (existing) {
        setFormData({ ...existing });
      }
    }
  }, [draftId, initialDrafts]);

  const updateField = (field: keyof PropertyDraft, value: any) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value,
        updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      
      // Keep stage name synced with currentStep
      const STAGE_MAP: Record<number, { key: any, name: string }> = {
        1: { key: 'prep', name: '录入前准备' },
        2: { key: 'project', name: '项目基础信息' },
        3: { key: 'ownership', name: '产权/房东主体' },
        4: { key: 'layout', name: '房型体系建立' },
        5: { key: 'rooms', name: '房间结构生成' },
        6: { key: 'closing', name: '费用、备注与附件' }
      };
      const stage = STAGE_MAP[updated.currentStep];
      if (stage) {
        updated.currentStageKey = stage.key;
        updated.currentStageName = stage.name;
      }

      return updated;
    });
    setErrorMessage('');
  };

  const handleNext = () => {
    // Step 1 path division
    if (formData.currentStep === 1) {
      if (formData.entryMode === 'existing' && formData.supplementTargetStep) {
        const target = formData.supplementTargetStep;
        // Scope sanity check before jumping
        if (formData.entryScope === 'skeleton' && (target === 4 || target === 5)) {
          setErrorMessage('【范围冲突】当前“仅骨架”数据范围下，无法进行房型或房间补录，请调整范围。');
          return;
        }
        if (formData.entryScope === 'layout' && target === 5) {
          setErrorMessage('【范围冲突】当前“项目+房型”数据范围下，无法进行房间生成补录，请调整范围。');
          return;
        }
        updateField('currentStep', target);
        return;
      }
      updateField('currentStep', 2);
      return;
    }

    // Step-by-step rigorous logical validation
    if (formData.currentStep === 2) {
      if (!formData.propertyName.trim()) {
        setErrorMessage('【必填提示】请输入项目/楼宇基础名称（项目基础信息层骨架）');
        return;
      }
      if (!formData.address.trim()) {
        setErrorMessage('【必填提示】请输入详细物理地址，确保后续客源匹配与路线推算正常');
        return;
      }
      if (!formData.buildingNo.trim()) {
        setErrorMessage('【必填提示】请输入楼栋/单元等落点（例如: 1号楼2单元）');
        return;
      }
    }

    if (formData.currentStep === 3) {
      if (!formData.ownerName?.trim()) {
        setErrorMessage('【必填提示】请输入产权/房东主体名称（权属关系安全限制）');
        return;
      }
      if (!formData.ownerPhone?.trim()) {
        setErrorMessage('【必填提示】请输入主体联系电话，用作工单分发与租约催缴');
        return;
      }
    }

    if (formData.currentStep === 4) {
      if (formData.hasLayoutTemplate) {
        if (!formData.layoutName?.trim()) {
          setErrorMessage('【必填提示】请拟定房型模板名称（如: 舒适大床房、标准三居室）');
          return;
        }
        if (!formData.layoutArea || Number(formData.layoutArea) <= 0) {
          updateField('layoutArea', '50'); // default fallback instead of blocking if type error
        }
      }
    }

    if (formData.currentStep === 5) {
      const fStart = Number(formData.floorStart);
      const fEnd = Number(formData.floorEnd);
      const roomsCount = Number(formData.roomsPerFloor);

      if (isNaN(fStart) || isNaN(fEnd) || fStart > fEnd) {
        setErrorMessage('【输入错误】起始楼层必须小于或等于截止楼层');
        return;
      }
      if (isNaN(roomsCount) || roomsCount <= 0 || roomsCount > 30) {
        setErrorMessage('【限制提示】每层房间数推荐在 1 ~ 30 间之间');
        return;
      }
    }

    if (formData.currentStep < 6) {
      let nextStep = formData.currentStep + 1;
      
      // Dynamic Branching Path Based on Entry Scope
      if (formData.entryScope === 'skeleton' && formData.currentStep === 3) {
        nextStep = 6; // skip Step 4 and 5
      } else if (formData.entryScope === 'layout' && formData.currentStep === 4) {
        nextStep = 6; // skip Step 5
      }
      
      updateField('currentStep', nextStep);
    }
  };

  const handleBack = () => {
    if (formData.currentStep > 1) {
      // In existing mode, if they are back to their starting jump step, return to Step 1
      if (formData.entryMode === 'existing' && formData.currentStep === formData.supplementTargetStep) {
        updateField('currentStep', 1);
        return;
      }
      
      let prevStep = formData.currentStep - 1;
      
      // Reverse branching paths
      if (formData.entryScope === 'skeleton' && formData.currentStep === 6) {
        prevStep = 3; // return to ownership
      } else if (formData.entryScope === 'layout' && formData.currentStep === 6) {
        prevStep = 4; // return to layout
      }
      
      updateField('currentStep', prevStep);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).map((f: any) => f.name);
      updateField('uploadedFiles', [...formData.uploadedFiles, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files).map((f: any) => f.name);
      updateField('uploadedFiles', [...formData.uploadedFiles, ...files]);
    }
  };

  const removeFile = (index: number) => {
    const files = [...formData.uploadedFiles];
    files.splice(index, 1);
    updateField('uploadedFiles', files);
  };

  const handleSaveAsDraft = () => {
    onSaveDraft(formData);
    onClose();
  };

  const handleFinalSubmit = () => {
    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMessage('【报价提示】请输入有效的期望租售底价/基准价格');
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmit(formData);
    }, 1800);
  };

  const addException = () => {
    if (exceptionsInput.trim() && !formData.exceptionsList?.includes(exceptionsInput.trim())) {
      const newList = [...(formData.exceptionsList || []), exceptionsInput.trim()];
      updateField('exceptionsList', newList);
      setExceptionsInput('');
    }
  };

  const removeException = (item: string) => {
    const newList = (formData.exceptionsList || []).filter(x => x !== item);
    updateField('exceptionsList', newList);
  };

  // 6 steps semantic headers
  const steps = [
    { title: '录入前准备', desc: '类型模式分流' },
    { title: '项目基础信息', desc: '项目骨架落点' },
    { title: '产权/房东主体', desc: '持有类型权属' },
    { title: '房型体系建立', desc: '空间参数模板' },
    { title: '房间生成与匹配', desc: '批量排号匹配' },
    { title: '费用备注与附件', desc: '定价收口核验' }
  ];

  // Helper to generate simulated room number list
  const getSimulatedRooms = () => {
    if (formData.entryScope === 'skeleton' || formData.entryScope === 'layout') {
      return [];
    }
    const fStart = Number(formData.floorStart) || 1;
    const fEnd = Number(formData.floorEnd) || 10;
    const count = Number(formData.roomsPerFloor) || 4;
    const list: string[] = [];
    
    for (let f = fStart; f <= fEnd; f++) {
      // Allow excluding floors
      if (formData.exceptionsList?.includes(`${f}层`)) continue;
      
      for (let r = 1; r <= count; r++) {
        const rStr = r < 10 ? `0${r}` : `${r}`;
        const roomNo = `${f}${rStr}`;
        if (formData.exceptionsList?.includes(roomNo)) continue;
        list.push(roomNo);
      }
    }
    return list;
  };

  const simulatedRooms = getSimulatedRooms();

  return (
    <div id="property-wizard-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div 
            id="success-celebration-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center border border-emerald-100 flex flex-col items-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-100"
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">首条纵向业务建档成功！</h3>
            <p className="text-gray-500 text-xs mb-6 px-2 leading-relaxed">
              房源项目 <span className="font-semibold text-gray-800">“{formData.propertyName || '未命名'}”</span> 已打穿全部主步骤：录入前分流、骨架登记、房东确权、房型匹配、
              已生成 <span className="font-bold text-indigo-600 font-mono">{simulatedRooms.length}</span> 间客房资产！已从断点进度器回流到统一台账。
            </p>
            <div className="w-full bg-slate-50 rounded-lg p-4 text-left text-[11px] text-gray-700 border border-gray-200/60 space-y-1.5 font-mono">
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-400">管理模式:</span>
                <span className="font-bold text-gray-900">
                  {formData.managementMode === 'central' ? '集中式大盘' : 
                   formData.managementMode === 'entire' ? '整租大套' : '合租房间'}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-400">物权唯一码:</span>
                <span className="font-bold text-indigo-600">ASSET-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-400">房间总量:</span>
                <span className="font-bold text-emerald-600">{simulatedRooms.length} 间</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">权属关系:</span>
                <span className="font-bold text-gray-900 truncate max-w-[180px]">{formData.ownerName} ({formData.ownerRelation})</span>
              </div>
            </div>
            <div className="mt-6 text-[11px] text-gray-400 animate-pulse-subtle">
              正在同步刷新进行中面板，返回协同大盘...
            </div>
          </motion.div>
        ) : (
          <motion.div 
            id="property-wizard-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[90vh] border border-gray-200/80 overflow-hidden"
          >
            {/* Top Toolbar Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-display font-bold text-gray-950 flex items-center">
                    <span>房源建档业务链</span>
                    <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full ml-2 font-mono font-bold">
                      步骤 {formData.currentStep} / 6
                    </span>
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    首条纵向业务主流程重组 • 拒绝前端花哨外壳 • 实实在在替用户记住顺序
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  id="wizard-save-draft-btn"
                  onClick={handleSaveAsDraft}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-white active:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-2xs"
                  title="草稿带业务语义暂存，左下角随时零丢失恢复"
                >
                  <Save className="w-3.5 h-3.5 text-gray-400" />
                  <span>暂存草稿 (Save)</span>
                </button>
                <button 
                  id="wizard-close-btn"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                  title="关闭不保存"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stepper Wizard Horizontal Tracker */}
            <div className="px-6 py-3.5 border-b border-gray-100 bg-white grid grid-cols-2 md:grid-cols-6 gap-2 shrink-0">
              {steps.map((step, idx) => {
                const stepNum = idx + 1;
                
                // Determine if this step is bypassed based on selected entryScope
                const isBypassed = (formData.entryScope === 'skeleton' && (stepNum === 4 || stepNum === 5)) ||
                                   (formData.entryScope === 'layout' && stepNum === 5);

                const isActive = formData.currentStep === stepNum;
                const isCompleted = formData.currentStep > stepNum;

                if (isBypassed) {
                  return (
                    <div
                      key={idx}
                      className="flex items-start p-1.5 rounded-lg text-left bg-gray-50 border-l-2 border-dashed border-gray-300 opacity-40 cursor-not-allowed select-none"
                      title={`当前“${formData.entryScope === 'skeleton' ? '仅骨架' : '仅房型'}”范围已排除此步骤`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] font-mono font-bold flex items-center justify-center rounded-full w-4 h-4 bg-gray-200 text-gray-400">
                            —
                          </span>
                          <span className="text-[11px] font-bold text-gray-450 line-through">
                            {step.title}
                          </span>
                        </div>
                        <p className="text-[8px] text-gray-400 pl-5 truncate max-w-[125px] hidden md:block">
                          {formData.entryScope === 'skeleton' ? '骨架排除' : '房型排除'}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={idx}
                    disabled={stepNum > formData.currentStep && !formData.propertyName}
                    onClick={() => updateField('currentStep', stepNum)}
                    className={`flex items-start p-1.5 rounded-lg text-left transition-all relative overflow-hidden ${
                      isActive ? 'bg-indigo-50/50 border-l-2 border-indigo-600' : 
                      isCompleted ? 'hover:bg-slate-50 border-l-2 border-emerald-500' : 'opacity-60 cursor-not-allowed border-l-2 border-transparent'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[10px] font-mono font-black flex items-center justify-center rounded-full w-4 h-4 ${
                          isActive ? 'bg-indigo-600 text-white' : 
                          isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3.5px]" /> : stepNum}
                        </span>
                        <span className={`text-[11px] font-bold ${
                          isActive ? 'text-indigo-600' : 
                          isCompleted ? 'text-emerald-700' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                      <p className="text-[9px] text-gray-400 pl-5 truncate max-w-[120px] hidden md:block">
                        {step.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Interactive Warning Banner */}
            {errorMessage && (
              <div id="wizard-error-banner" className="bg-rose-50 text-rose-800 text-[11px] px-6 py-2 flex items-center space-x-2 border-b border-rose-100 animate-pulse font-medium">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 space-y-6">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: 录入前准备 (Preparation) */}
                {formData.currentStep === 1 && (
                  <motion.div 
                    key="step-prep"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-2xs space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="p-1 rounded bg-indigo-50 text-indigo-600"><Sparkles className="w-4 h-4" /></span>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">纵向业务路径分流判断（录入前准备）</h3>
                      </div>
                      <p className="text-gray-400 text-[11px] leading-relaxed">
                        这一层的目的是让系统根据房源业态、租售手段和补件层级自动调整表单参数，判断合规机制，而不是一上来就强行塞给您一个超大表单。
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Sub-Card A: Property Type Selection */}
                      <div className="space-y-2.5">
                        <label className="block text-xs font-bold text-gray-700">1. 资产与房源类别 (Property Type)</label>
                        <div className="grid grid-cols-1 gap-2">
                          {PROPERTY_TYPES.map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => updateField('propertyType', type.id)}
                              className={`p-3 rounded-xl border text-left flex items-start space-x-3 transition-all ${
                                formData.propertyType === type.id 
                                  ? 'bg-indigo-50/40 border-indigo-600 ring-1 ring-indigo-600' 
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <span className="text-xl bg-gray-50 p-1.5 rounded-lg border border-gray-100">{type.icon}</span>
                              <div>
                                <span className="text-xs font-bold text-gray-900 block">{type.label}</span>
                                <span className="text-[10px] text-gray-400 mt-0.5 block leading-normal">{type.desc}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sub-Card B: Management & Entry Mode */}
                      <div className="space-y-5">
                        
                        <div className="space-y-2.5">
                          <label className="block text-xs font-bold text-gray-700">2. 主力管理模式 (Management Mode)</label>
                          <div className="grid grid-cols-1 gap-2">
                            {MANAGEMENT_MODES.map((mode) => (
                              <button
                                key={mode.id}
                                type="button"
                                onClick={() => updateField('managementMode', mode.id)}
                                className={`p-3 rounded-xl border text-left flex items-start space-x-3 transition-all ${
                                  formData.managementMode === mode.id 
                                    ? 'bg-indigo-50/40 border-indigo-600 ring-1 ring-indigo-600' 
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <span className="text-lg bg-gray-50 p-1.5 rounded-lg border border-gray-100">{mode.icon}</span>
                                <div>
                                  <span className="text-xs font-bold text-gray-900 block">{mode.label}</span>
                                  <span className="text-[10px] text-gray-400 mt-0.5 block leading-normal">{mode.desc}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <label className="block text-xs font-bold text-gray-700">3. 录入模式与数据范围 (Entry Configuration)</label>
                          <div className="grid grid-cols-2 gap-2">
                            {ENTRY_MODES.map((em) => (
                              <button
                                key={em.id}
                                type="button"
                                onClick={() => updateField('entryMode', em.id)}
                                className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                                  formData.entryMode === em.id 
                                    ? 'bg-indigo-50/40 border-indigo-600 ring-1 ring-indigo-600' 
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <span className="text-xs font-bold text-gray-900 block flex items-center space-x-1">
                                  <span>{em.icon}</span>
                                  <span>{em.label}</span>
                                </span>
                                <span className="text-[9px] text-gray-400 block leading-tight">{em.desc}</span>
                              </button>
                            ))}
                          </div>

                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {ENTRY_SCOPES.map((sc) => (
                              <button
                                key={sc.id}
                                type="button"
                                onClick={() => updateField('entryScope', sc.id)}
                                className={`p-2.5 rounded-xl border text-left space-y-1 transition-all ${
                                  formData.entryScope === sc.id 
                                    ? 'bg-indigo-50/40 border-indigo-600 ring-1 ring-indigo-600' 
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <span className="text-[10px] font-bold text-gray-950 block">{sc.label}</span>
                                <span className="text-[8px] text-gray-400 block leading-tight">{sc.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Supplementary Target Selection Layer (Only visible when entryMode === 'existing') */}
                    {formData.entryMode === 'existing' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-indigo-50/40 rounded-2xl border border-indigo-100 p-5 space-y-3.5 mt-4"
                      >
                        <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                          <div className="flex items-center space-x-2">
                            <span className="bg-indigo-600 text-white font-black px-1.5 py-0.5 text-[9px] rounded-sm uppercase font-mono tracking-wider">補件補錄</span>
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                              补录目标步骤选择 (Direct Jump Step Target)
                            </h4>
                          </div>
                          <span className="text-[10px] text-indigo-600 font-mono font-bold">补录模式真实生效</span>
                        </div>
                        <p className="text-gray-500 text-[11px] leading-relaxed">
                          当前为已有项目补录模式。系统已免去强制100%线性表单，请在下方选择本次需要补齐、纠偏或上传证明的特定纵向业务模块。点击下一步时系统将直接跳转。
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
                          {[
                            { step: 2, label: '2. 项目基础信息', icon: '🏗️', desc: '补录落点物理单元' },
                            { step: 3, label: '3. 产权房东主体', icon: '🔑', desc: '补齐所有权和确权' },
                            { step: 4, label: '4. 房型体系模板', icon: '📐', desc: '预设套内户型参数', scopeConstraint: 'skeleton' },
                            { step: 5, label: '5. 房间排号生成', icon: '⚡', desc: '物理生成区间房型', scopeConstraint: 'layout' },
                            { step: 6, label: '6. 费用备注与附件', icon: '📁', desc: '定价收口及测绘图' }
                          ].map((opt) => {
                            // Calculate if this option is disabled based on current entryScope
                            const isRestricted = (formData.entryScope === 'skeleton' && (opt.step === 4 || opt.step === 5)) ||
                                                 (formData.entryScope === 'layout' && opt.step === 5);
                            const isSelected = formData.supplementTargetStep === opt.step;

                            return (
                              <button
                                key={opt.step}
                                type="button"
                                disabled={isRestricted}
                                onClick={() => updateField('supplementTargetStep', opt.step)}
                                className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all ${
                                  isRestricted 
                                    ? 'bg-gray-100/50 border-gray-100 opacity-45 cursor-not-allowed' 
                                    : isSelected 
                                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/30 shadow-2xs' 
                                      : 'bg-white border-gray-200 hover:border-gray-300 active:bg-slate-50'
                                }`}
                              >
                                <div className="space-y-1 w-full">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">{opt.icon}</span>
                                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                                  </div>
                                  <span className="text-[11px] font-bold text-gray-900 block leading-tight truncate">{opt.label}</span>
                                  <span className="text-[9px] text-gray-400 block leading-tight mt-0.5 line-clamp-2">{opt.desc}</span>
                                </div>

                                {isRestricted && (
                                  <span className="text-[8px] text-rose-500 font-bold block mt-1.5 border-t border-gray-100 pt-1 leading-none">
                                    因{formData.entryScope === 'skeleton' ? '骨架' : '房型'}范围排除
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                  </motion.div>
                )}

                {/* STEP 2: 项目基础信息 (Project Infrastructure Skeleton) */}
                {formData.currentStep === 2 && (
                  <motion.div 
                    key="step-project"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                        <span className="w-1.5 h-3 bg-indigo-600 rounded-xs" />
                        <span>建立项目物理骨架</span>
                      </h3>
                      <p className="text-gray-400 text-[11px] leading-relaxed">
                        项目基础层是未来所有合同契约和租客工单绑定的空间落点，不在本层填报冗长的费用明细或房东资料。
                      </p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200/80 p-6 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            项目/楼宇正式名称 <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="wizard-property-name-input"
                            type="text"
                            value={formData.propertyName}
                            onChange={(e) => updateField('propertyName', e.target.value)}
                            placeholder="如: 临港科技智慧大厦、星河湾三期"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all placeholder:text-gray-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            项目别名 / 内部代码代称
                          </label>
                          <input
                            type="text"
                            value={formData.propertyAlias || ''}
                            onChange={(e) => updateField('propertyAlias', e.target.value)}
                            placeholder="如: LINGGANG-T1, 星河湾大平层组团"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            物理绝对地址 / 城市定位 <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              id="wizard-address-input"
                              type="text"
                              value={formData.address}
                              onChange={(e) => updateField('address', e.target.value)}
                              placeholder="例如: 上海市浦东新区张江大道555号"
                              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all placeholder:text-gray-400"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                              <MapPin className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            楼栋 / 单元 / 幢范围描述 <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="wizard-building-input"
                            type="text"
                            value={formData.buildingNo}
                            onChange={(e) => updateField('buildingNo', e.target.value)}
                            placeholder="如: 3号楼2单元整幢、A座15层全层"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            物业来源获取类型
                          </label>
                          <select
                            value={formData.propertySource || '一手业主托管'}
                            onChange={(e) => updateField('propertySource', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all"
                          >
                            <option value="一手开发商自营">一手开发商自营 (Developer-Owned)</option>
                            <option value="一手业主托管">一手业主授权托管 (Managed Host)</option>
                            <option value="二手承租转让">二手包租公转售/承租转让 (Sublease)</option>
                            <option value="政府保障房/配购房">政府保障性公租房/人才公寓 (Gov Support)</option>
                            <option value="回迁安置房/村集体物权">村集体返还地/安置房 (Village Collective)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            拟投入使用的物理计租总面积
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={formData.area}
                              onChange={(e) => updateField('area', e.target.value)}
                              placeholder="如: 1850.5"
                              className="w-full pl-3 pr-12 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-gray-400 font-mono">
                              ㎡
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          项目及物理基础说明 (Project Memo)
                        </label>
                        <textarea
                          rows={2}
                          value={formData.description || ''}
                          onChange={(e) => updateField('description', e.target.value)}
                          placeholder="可备注项目的物理特征，周边配套如离地铁距离，是否通强电配电，适合的特定经营业态等..."
                          className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all placeholder:text-gray-400 resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: 产权 / 房东主体 (Ownership & Landlord Details) */}
                {formData.currentStep === 3 && (
                  <motion.div 
                    key="step-ownership"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                        <span className="w-1.5 h-3 bg-indigo-600 rounded-xs" />
                        <span>产权人及大房东主体关系确权</span>
                      </h3>
                      <p className="text-gray-400 text-[11px] leading-relaxed">
                        由于涉及收款账单分配与法务合同风险，系统要求必须在本层明确“物权究竟属于谁”以及“主体持有关系”。
                      </p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200/80 p-6 space-y-5">
                      
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          1. 获取与持有类型 (Holding Strategy)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {HOLDING_TYPES.map((ht) => (
                            <button
                              key={ht.id}
                              type="button"
                              onClick={() => updateField('holdingType', ht.id)}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                formData.holdingType === ht.id 
                                  ? 'bg-indigo-50/40 border-indigo-600 ring-1 ring-indigo-600' 
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <span className="text-xs font-bold text-gray-900 block">{ht.label}</span>
                              <span className="text-[9px] text-gray-400 mt-1 block leading-tight">{ht.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            主体名称 / 产权法团 / 房东姓名 <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.ownerName || ''}
                            onChange={(e) => updateField('ownerName', e.target.value)}
                            placeholder="产权证上的名字，或大业主法团全称 (如: 张铁柱、临港投资集团)"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all placeholder:text-gray-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            主体负责人 / 权属联系人姓名
                          </label>
                          <input
                            type="text"
                            value={formData.ownerContact || ''}
                            onChange={(e) => updateField('ownerContact', e.target.value)}
                            placeholder="对接授权签约、保修协调的专员姓名"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            主体联络电话 <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.ownerPhone || ''}
                            onChange={(e) => updateField('ownerPhone', e.target.value)}
                            placeholder="如: 13901234567 (用于代收账单及紧急故障告知)"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all placeholder:text-gray-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            权属主体与项目的法律关系
                          </label>
                          <input
                            type="text"
                            value={formData.ownerRelation || ''}
                            onChange={(e) => updateField('ownerRelation', e.target.value)}
                            placeholder="如: 业主本人授权、子公司自持托管、配股合伙代表"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-gray-200/60 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="checkbox"
                            id="doc-uploaded"
                            checked={formData.ownerDocUploaded || false}
                            onChange={(e) => updateField('ownerDocUploaded', e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                          <label htmlFor="doc-uploaded" className="text-xs font-medium text-gray-700 cursor-pointer select-none">
                            已经在线核对产权证原件、企业工商执照、及法定代表人身份证
                          </label>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono hidden md:block">LAW REVIEW VERIFICATION</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: 房型体系建立 (Unit Layout templates & parameters) */}
                {formData.currentStep === 4 && (
                  <motion.div 
                    key="step-layout"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                          <span className="w-1.5 h-3 bg-indigo-600 rounded-xs" />
                          <span>建立空间及房型体系参数模板</span>
                        </h3>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs text-gray-600 font-medium">是否先生成基础房型模板</span>
                          <input
                            type="checkbox"
                            checked={formData.hasLayoutTemplate || false}
                            onChange={(e) => updateField('hasLayoutTemplate', e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                        </div>
                      </div>
                      <p className="text-gray-400 text-[11px] leading-relaxed">
                        先建好几款典型的“空间房型模板”（如经典两居、白领单间、联合套位），能极速简化下一步各楼层多房间的匹配效率，避免为每一间房间重复填报面积和特色。
                      </p>
                    </div>

                    {formData.hasLayoutTemplate ? (
                      <div className="bg-white rounded-xl border border-gray-200/80 p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                              基础房型模板命名 <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.layoutName || ''}
                              onChange={(e) => updateField('layoutName', e.target.value)}
                              placeholder="例如: 极致单身公寓、尊享行政大楼、豪华套房B款"
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all placeholder:text-gray-400"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                              朝向及通风设计
                            </label>
                            <select
                              value={formData.layoutDirection || '南北通透'}
                              onChange={(e) => updateField('layoutDirection', e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all"
                            >
                              <option value="南北通透">南北通透 (North-South Ventilated)</option>
                              <option value="朝南/向阳">全朝南/向阳 (Full South Facing)</option>
                              <option value="朝东/旭日">朝东/晨光采光 (East Facing)</option>
                              <option value="朝西/有西晒">朝西 (West Facing)</option>
                              <option value="内采光/无明窗">内侧天井采光/无明窗 (No Direct Window)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                              居室/办公间数量
                            </label>
                            <input
                              type="number"
                              value={formData.layoutRoomsCount || '2'}
                              onChange={(e) => updateField('layoutRoomsCount', e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                              独立卫生间数量
                            </label>
                            <input
                              type="number"
                              value={formData.layoutBathroomCount || '1'}
                              onChange={(e) => updateField('layoutBathroomCount', e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                              主力床位/工型级别
                            </label>
                            <select
                              value={formData.layoutBedType || '双人床'}
                              onChange={(e) => updateField('layoutBedType', e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all"
                            >
                              <option value="双人床">标准双人床 (1.8m x 2.0m)</option>
                              <option value="单人床">标准单人床 (1.2m x 2.0m)</option>
                              <option value="上下铺">学生上下铺/高低铁艺床 (Bunk Bed)</option>
                              <option value="独立工位/电脑台">独立办公工位/开放式隔板 (Office Desk)</option>
                              <option value="空房/未配置家具">毛坯未配家具 (No furniture)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                              单间套内使用面积
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={formData.layoutArea || '89'}
                                onChange={(e) => updateField('layoutArea', e.target.value)}
                                className="w-full pl-3 pr-10 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all"
                              />
                              <span className="absolute inset-y-0 right-3 flex items-center text-[10px] text-gray-400">㎡</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-[10px] text-indigo-900 leading-normal font-sans">
                          💡 <strong>模板推荐优势：</strong>一旦存留该房型，在后续步骤 5 的房间排号生成时，这些层高、卫浴、采光及床位规格将以 100% 映射继承，帮您节约手动逐间录入的时间。
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-8 text-center">
                        <p className="text-xs text-amber-800 font-bold">已跳过统一房型模板层</p>
                        <p className="text-[10px] text-gray-400 mt-1">下一步骤中，您需要为生成的全部具体房间资产逐一配置空间与面积参数。</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 5: 房间结构生成与匹配 (Room generation & structural logic) */}
                {formData.currentStep === 5 && (
                  <motion.div 
                    key="step-rooms"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                        <span className="w-1.5 h-3 bg-indigo-600 rounded-xs" />
                        <span>房间结构智能生成与匹配</span>
                      </h3>
                      <p className="text-gray-400 text-[11px] leading-relaxed">
                        确定楼层范围与房间总量，系统会自动在后台根据编码规则拼装出每个物理门牌号。
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Configuration Column */}
                      <div className="md:col-span-1 bg-white border border-gray-200/80 rounded-xl p-5 space-y-4">
                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">排号排布规则</h4>
                        
                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">物理起始楼层</label>
                            <input
                              type="number"
                              value={formData.floorStart || '1'}
                              onChange={(e) => updateField('floorStart', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">物理截止楼层</label>
                            <input
                              type="number"
                              value={formData.floorEnd || '10'}
                              onChange={(e) => updateField('floorEnd', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">每层房间数</label>
                            <input
                              type="number"
                              value={formData.roomsPerFloor || '4'}
                              onChange={(e) => updateField('roomsPerFloor', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">房号组装格式规则</label>
                            <select
                              value={formData.roomNoRule || '{floor}0{index}'}
                              onChange={(e) => updateField('roomNoRule', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white"
                            >
                              <option value="{floor}0{index}">楼层 + 两位序列 (如: 101, 1001)</option>
                              <option value="{floor}F-{index}">楼层F + 序列 (如: 1F-1, 10F-4)</option>
                              <option value="{floor}00{index}">楼层 + 三位序列 (如: 1001, 10001)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Exceptions Column */}
                      <div className="md:col-span-1 bg-white border border-gray-200/80 rounded-xl p-5 space-y-4">
                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">例外与非租区规避</h4>
                        
                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-[11px] text-gray-400 leading-normal mb-1">
                              输入特定楼层（如 4层）或特定房号（如 203）并点击添加，在资产库生成时将自动规避、剔除：
                            </label>
                            <div className="flex space-x-1">
                              <input
                                type="text"
                                value={exceptionsInput}
                                onChange={(e) => setExceptionsInput(e.target.value)}
                                placeholder="例如: 4层、203"
                                className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addException();
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={addException}
                                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                              >
                                添加
                              </button>
                            </div>
                          </div>

                          {formData.exceptionsList && formData.exceptionsList.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-gray-500 uppercase">当前已规避例外区 ({formData.exceptionsList.length})</span>
                              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto bg-gray-50 p-2 rounded-lg border border-gray-100">
                                {formData.exceptionsList.map((item, index) => (
                                  <span key={index} className="inline-flex items-center bg-rose-50 text-rose-700 text-[10px] px-1.5 py-0.5 rounded border border-rose-100">
                                    <span>{item}</span>
                                    <button type="button" onClick={() => removeException(item)} className="ml-1 text-rose-500 hover:text-rose-900 font-bold">×</button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Live Preview Column */}
                      <div className="md:col-span-1 bg-slate-900 text-slate-300 rounded-xl p-5 flex flex-col justify-between shadow-md border border-slate-800">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                            <span className="text-[10px] font-bold font-mono tracking-widest text-slate-500 uppercase">资产预分配引擎 PREVIEW</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          </div>
                          
                          <div className="text-center py-2 bg-slate-950/60 rounded-xl border border-slate-800">
                            <span className="text-3xl font-black text-white font-mono">{simulatedRooms.length}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">拟一键生成房间资产总量</span>
                          </div>

                          <div className="space-y-1 text-xs">
                            <span className="text-[10px] text-slate-500 block">门牌映射段预览 (部分显示):</span>
                            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto bg-slate-950 p-2 rounded-lg text-[10px] font-mono">
                              {simulatedRooms.length === 0 ? (
                                <span className="text-rose-400 italic">所有物理区间已被例外排除，房间量为0</span>
                              ) : (
                                simulatedRooms.map((r, i) => (
                                  <span key={i} className="bg-slate-800 text-slate-200 px-1 rounded hover:bg-indigo-900 transition-colors">
                                    {r}室
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-[9px] text-slate-500 leading-normal pt-3 border-t border-slate-800 flex items-start space-x-1 font-mono">
                          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>
                            自动继承步骤 4 房型：{formData.layoutName || '标准房型'} ({formData.layoutArea}㎡, 朝{formData.layoutDirection})
                          </span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* STEP 6: 费用、备注、附件与收口 (Closing, Upload & Checklist) */}
                {formData.currentStep === 6 && (
                  <motion.div 
                    key="step-closing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Pricing Forms Column */}
                      <div className="bg-white border border-gray-200/80 rounded-xl p-6 space-y-4">
                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-gray-50 pb-2">
                          <span className="w-1.5 h-3.5 bg-indigo-600 rounded-xs" />
                          <span>商务底线底报价配置</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                              期望招商基准单价 <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                id="wizard-price-input"
                                type="number"
                                value={formData.price}
                                onChange={(e) => updateField('price', e.target.value)}
                                placeholder="例如: 4500"
                                className="w-full pl-8 pr-16 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all font-mono"
                              />
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-gray-400">
                                ¥
                              </div>
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[10px] text-gray-400 bg-gray-50 border-l border-gray-200 px-2 rounded-r-lg">
                                {formData.priceUnit || '元/月'}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                              租售计费周期单位
                            </label>
                            <select
                              value={formData.priceUnit || '元/月'}
                              onChange={(e) => updateField('priceUnit', e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all"
                            >
                              <option value="元/月">元 / 月 (Standard Monthly)</option>
                              <option value="元/㎡/天">元 / ㎡ / 天 (Commercial Daily)</option>
                              <option value="元/季">元 / 季 (Quarterly)</option>
                              <option value="元/年">元 / 年 (Yearly Lease)</option>
                              <option value="万元/套">万元 / 全套总售价 (Sale Pack)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            费用收口细则及补充说明
                          </label>
                          <textarea
                            rows={2}
                            value={formData.feeDescription || ''}
                            onChange={(e) => updateField('feeDescription', e.target.value)}
                            placeholder="如包含物业费、供暖费、能耗预收、车位折扣等信息，用作起草合同时自动解析拼装..."
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden resize-none placeholder:text-gray-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            备用字段 / 审批备注
                          </label>
                          <input
                            type="text"
                            value={formData.remark || ''}
                            onChange={(e) => updateField('remark', e.target.value)}
                            placeholder="如：急售特批折扣需走吴经理审核权限..."
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Documents Attachments Column */}
                      <div className="bg-white border border-gray-200/80 rounded-xl p-6 space-y-4 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-gray-50 pb-2">
                            <span className="w-1.5 h-3.5 bg-indigo-600 rounded-xs" />
                            <span>证明材料及项目测绘图纸上传</span>
                          </h4>
                          
                          <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-4 text-center transition-all flex flex-col items-center justify-center cursor-pointer mt-3 ${
                              dragActive 
                                ? 'border-indigo-600 bg-indigo-50/50' 
                                : 'border-gray-200 bg-white hover:border-indigo-400 hover:bg-slate-50/20'
                            }`}
                          >
                            <UploadCloud className="w-8 h-8 text-gray-400 mb-1.5" />
                            <span className="text-xs font-bold text-gray-700 mb-0.5">拖拽大图、扫描件或PDF到此</span>
                            <span className="text-[9px] text-gray-400 mb-2">支持 JPG、PNG、PDF 文件，最大 20MB</span>
                            <label className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-colors cursor-pointer">
                              测绘图纸浏览
                              <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileSelect}
                              />
                            </label>
                          </div>
                        </div>

                        {formData.uploadedFiles.length > 0 && (
                          <div className="space-y-1.5 mt-2">
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                              已就位测绘与主体文件 ({formData.uploadedFiles.length})
                            </label>
                            <div className="space-y-1 bg-gray-50 border border-gray-100 rounded-lg p-2 max-h-24 overflow-y-auto">
                              {formData.uploadedFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between py-0.5 px-1.5 hover:bg-white rounded text-[11px]">
                                  <span className="text-gray-600 truncate max-w-[85%] font-mono">{file}</span>
                                  <button 
                                    type="button" 
                                    onClick={() => removeFile(idx)}
                                    className="text-gray-400 hover:text-rose-500 transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Step 6 Bottom: Large Complete Review Panel (Checklist Summary) */}
                    <div className="bg-indigo-950 text-white rounded-xl p-5 shadow-lg space-y-4 border border-indigo-900">
                      <div className="flex items-center justify-between border-b border-indigo-900 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <ClipboardList className="w-4.5 h-4.5 text-indigo-400" />
                          <span className="text-xs font-bold font-display uppercase tracking-widest text-indigo-200">
                            纵向建档最终审批核验单 (Review Summary)
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-indigo-400">PM++ BUSINESS FLOW CONTROL</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-[11px] font-sans">
                        
                        <div className="bg-indigo-900/40 p-3 rounded-lg border border-indigo-900/60">
                          <div className="flex items-center justify-between text-indigo-300 border-b border-indigo-900 pb-1 mb-1.5">
                            <span className="font-bold">1. 录入准备</span>
                            <button onClick={() => updateField('currentStep', 1)} className="text-[10px] text-indigo-400 hover:text-white underline">修改</button>
                          </div>
                          <div className="space-y-1">
                            <p className="truncate"><span className="text-indigo-400">物权:</span> {formData.propertyType === 'residential' ? '普通住宅' : formData.propertyType === 'commercial' ? '商业商铺' : '工业厂房'}</p>
                            <p className="truncate"><span className="text-indigo-400">管理:</span> {formData.managementMode === 'central' ? '集中管理' : '整租管理'}</p>
                            <p className="truncate"><span className="text-indigo-400">范围:</span> {formData.entryScope === 'skeleton' ? '仅骨架' : formData.entryScope === 'layout' ? '项目+房型' : '全量打穿'}</p>
                          </div>
                        </div>

                        <div className="bg-indigo-900/40 p-3 rounded-lg border border-indigo-900/60">
                          <div className="flex items-center justify-between text-indigo-300 border-b border-indigo-900 pb-1 mb-1.5">
                            <span className="font-bold">2. 项目基础</span>
                            <button onClick={() => updateField('currentStep', 2)} className="text-[10px] text-indigo-400 hover:text-white underline">修改</button>
                          </div>
                          <div className="space-y-1">
                            <p className="truncate font-bold text-white">{formData.propertyName || '未填写'}</p>
                            <p className="truncate"><span className="text-indigo-400">单元:</span> {formData.buildingNo || '未填写'}</p>
                            <p className="truncate"><span className="text-indigo-400">来源:</span> {formData.propertySource || '托管'}</p>
                          </div>
                        </div>

                        <div className="bg-indigo-900/40 p-3 rounded-lg border border-indigo-900/60">
                          <div className="flex items-center justify-between text-indigo-300 border-b border-indigo-900 pb-1 mb-1.5">
                            <span className="font-bold">3. 房东确权</span>
                            <button onClick={() => updateField('currentStep', 3)} className="text-[10px] text-indigo-400 hover:text-white underline">修改</button>
                          </div>
                          <div className="space-y-1">
                            <p className="truncate font-bold text-white">{formData.ownerName || '未填写'}</p>
                            <p className="truncate"><span className="text-indigo-400">电话:</span> {formData.ownerPhone || '未填写'}</p>
                            <p className="truncate text-[10px]"><span className="text-indigo-400">审核:</span> {formData.ownerDocUploaded ? '✓ 已验证原件' : '✗ 待验原件'}</p>
                          </div>
                        </div>

                        {formData.entryScope === 'skeleton' ? (
                          <div className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-900/40 opacity-50">
                            <div className="flex items-center justify-between text-indigo-400 border-b border-indigo-950 pb-1 mb-1.5">
                              <span className="font-bold">4. 房型参数</span>
                              <span className="text-[8px] bg-indigo-950 px-1 py-0.2 rounded text-indigo-300">跳过</span>
                            </div>
                            <div className="space-y-1 text-[10px] text-indigo-300/60">
                              <p className="truncate italic">根据“仅骨架”范围</p>
                              <p className="truncate">已绕过房型模板建立</p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-indigo-900/40 p-3 rounded-lg border border-indigo-900/60">
                            <div className="flex items-center justify-between text-indigo-300 border-b border-indigo-900 pb-1 mb-1.5">
                              <span className="font-bold">4. 房型参数</span>
                              <button onClick={() => updateField('currentStep', 4)} className="text-[10px] text-indigo-400 hover:text-white underline">修改</button>
                            </div>
                            <div className="space-y-1">
                              <p className="truncate font-bold text-white">{formData.layoutName || '未填写'}</p>
                              <p className="truncate"><span className="text-indigo-400">面积:</span> {formData.layoutArea || formData.area || '0'}㎡</p>
                              <p className="truncate"><span className="text-indigo-400">床位/朝向:</span> {formData.layoutBedType}/{formData.layoutDirection}</p>
                            </div>
                          </div>
                        )}

                        {formData.entryScope === 'skeleton' || formData.entryScope === 'layout' ? (
                          <div className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-900/40 opacity-50">
                            <div className="flex items-center justify-between text-indigo-400 border-b border-indigo-950 pb-1 mb-1.5">
                              <span className="font-bold">5. 房间生成</span>
                              <span className="text-[8px] bg-indigo-950 px-1 py-0.2 rounded text-indigo-300">跳过</span>
                            </div>
                            <div className="space-y-1 text-[10px] text-indigo-300/60">
                              <p className="truncate italic">{formData.entryScope === 'skeleton' ? '骨架排除生成' : '房型模式跳过房间'}</p>
                              <p className="truncate text-emerald-400/80 font-bold">物理客房总量: 0 间</p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-indigo-900/40 p-3 rounded-lg border border-indigo-900/60">
                            <div className="flex items-center justify-between text-indigo-300 border-b border-indigo-900 pb-1 mb-1.5">
                              <span className="font-bold">5. 房间生成</span>
                              <button onClick={() => updateField('currentStep', 5)} className="text-[10px] text-indigo-400 hover:text-white underline">修改</button>
                            </div>
                            <div className="space-y-1">
                              <p className="truncate"><span className="text-indigo-400">区间:</span> {formData.floorStart} ~ {formData.floorEnd}层</p>
                              <p className="truncate"><span className="text-indigo-400">层均:</span> {formData.roomsPerFloor}间</p>
                              <p className="truncate text-emerald-300 font-bold">总量: {simulatedRooms.length} 间房</p>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Bottom Nav Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] text-gray-400 font-mono flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-ping" />
                  <span>PM++ DATABASE AUTO-SYNC AT {formData.updatedAt}</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {formData.currentStep > 1 && (
                  <button
                    id="wizard-back-btn"
                    type="button"
                    onClick={handleBack}
                    className="flex items-center space-x-1 px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 bg-white hover:bg-slate-100 hover:border-gray-300 active:bg-slate-200 transition-colors shadow-2xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>上一步</span>
                  </button>
                )}

                {formData.currentStep < 6 ? (
                  <button
                    id="wizard-next-btn"
                    type="button"
                    onClick={handleNext}
                    className="flex items-center space-x-1 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg text-xs font-bold text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <span>下一步</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    id="wizard-submit-btn"
                    type="button"
                    onClick={handleFinalSubmit}
                    className="flex items-center space-x-1.5 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg text-xs font-black text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>完结提交 房源纵向资产主链 (Submit)</span>
                  </button>
                )}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
