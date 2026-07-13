export interface PropertyDraft {
  id: string;
  propertyName: string;
  propertyType: 'residential' | 'commercial' | 'industrial' | 'apartment' | 'other';
  buildingNo: string;
  area: string;
  price: string;
  address: string;
  floorNo?: string;
  features: string[];
  uploadedFiles: string[];
  currentStep: number; // 1 to 6
  updatedAt: string;

  // Added vertical business flow fields
  currentStageKey?: 'prep' | 'project' | 'ownership' | 'layout' | 'rooms' | 'closing' | 'bill_gate' | 'contract';
  currentStageName?: string;
  managementMode?: 'central' | 'entire' | 'shared'; // 集中管理 / 整租管理 / 合租管理
  entryMode?: 'new' | 'existing'; // 新项目建档 / 已有项目补录
  entryScope?: 'skeleton' | 'layout' | 'full'; // 仅项目骨架 / 项目+房型 / 项目+房型+房间全量
  supplementTargetStep?: number; // 已有项目补录的目标步骤 (2 到 6)
  
  // Step 2 details
  propertyAlias?: string;
  propertySource?: string; // 物业来源
  description?: string; // 基础说明

  // Step 3 details
  holdingType?: 'self' | 'lease' | 'other'; // 持有类型
  ownerName?: string;
  ownerContact?: string;
  ownerPhone?: string;
  ownerRelation?: string;
  ownerDocUploaded?: boolean;

  // Step 4 details
  hasLayoutTemplate?: boolean;
  layoutName?: string;
  layoutRoomsCount?: string;
  layoutArea?: string;
  layoutDirection?: string;
  layoutBathroomCount?: string;
  layoutBedType?: string;

  // Step 5 details
  floorStart?: string;
  floorEnd?: string;
  roomsPerFloor?: string;
  roomNoRule?: string;
  matchingMode?: 'auto' | 'manual';
  exceptionsList?: string[];

  // Step 6 details
  priceUnit?: string;
  feeDescription?: string;
  remark?: string;

  // Refactored Multi-line properties fields
  entryDepth?: 'skeleton' | 'to_contract' | 'full';
  submitType?: 'draft' | 'skeleton_only' | 'to_contract' | 'full_chain';
  doorNo?: string;        // 门牌号
  houseType?: string;     // 房屋类型
  city?: string;
  district?: string;
  streetAddress?: string;
  hasSignedContract?: boolean;
  contractDuration?: string;
  markupRatio?: string;

  // Lease parameters (folded on self)
  leaseStart?: string;
  leaseEnd?: string;
  rentPrice?: string;     // 收房价格
  deposit?: string;       // 房屋押金
  paymentMethod?: string; // 缴费方式
  freeRentRule?: string;  // 累计免租期规则

  // Contract state
  contractStatus?: 'none' | 'pending' | 'signed_mock';

  // Assignment fields
  pendingAssignee?: 'app_sales' | null;
  pendingTaskLabel?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  module: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'draft_pending' | 'urging' | 'completed';
  statusLabel: string;
  updatedAt: string;
  assignee: string;
  description: string;
  taskKind?: 'todo' | 'assign';  // assign = 老板提交后派给业务员
  linkedDraftId?: string;
  linkedAssetId?: string;
  managementMode?: 'central' | 'entire' | 'shared';
}

export interface OnboardingDraft {
  id: string;
  employeeName: string;
  role: string;
  department: string;
  currentStep: number;
  updatedAt: string;
}

export type ManagementMode = 'central' | 'entire' | 'shared';
export type EntryDepth = 'skeleton' | 'to_contract' | 'full';

export interface StepDef {
  id: number;
  key: string;
  label: string;
  roleTag?: '老板' | 'App/业务员';
}

export const STEP_CONFIG: Record<ManagementMode, StepDef[]> = {
  central: [
    { id: 1, key: 'prep', label: '录入前准备' },
    { id: 2, key: 'skeleton', label: '项目骨架' },
    { id: 3, key: 'ownership', label: '主体与条款' },
    { id: 4, key: 'layout', label: '房型模板', roleTag: 'App/业务员' },
    { id: 5, key: 'rooms_gen', label: '房间骨架', roleTag: 'App/业务员' },
    { id: 6, key: 'rooms_detail', label: '房间精修', roleTag: 'App/业务员' },
  ],
  entire: [
    { id: 1, key: 'prep', label: '录入前准备' },
    { id: 2, key: 'skeleton', label: '房源骨架' },
    { id: 3, key: 'ownership', label: '房东主体与条款' },
    { id: 4, key: 'bill_gate', label: '账单确认门槛' },  // mock 占位
    { id: 5, key: 'contract', label: '签署合同' },
  ],
  shared: [
    { id: 1, key: 'prep', label: '录入前准备' },
    { id: 2, key: 'skeleton', label: '房源骨架' },
    { id: 3, key: 'ownership', label: '房东主体与条款' },
    { id: 4, key: 'contract', label: '签署合同' },
    { id: 5, key: 'rooms_gen', label: '分配房间·骨架', roleTag: 'App/业务员' },
    { id: 6, key: 'rooms_detail', label: '分配房间·精修', roleTag: 'App/业务员' },
  ],
};

export function getActiveSteps(mode: ManagementMode, depth: EntryDepth): StepDef[] {
  const all = STEP_CONFIG[mode];
  if (mode === 'entire') {
    if (depth === 'skeleton') return all.filter(s => s.id <= 3);
    if (depth === 'to_contract') return all.filter(s => s.id !== 4); // Skip bill_gate (id=4)
    return all; // full = 含 bill_gate (id=4) and contract (id=5)
  }
  if (mode === 'shared') {
    if (depth === 'skeleton') return all.filter(s => s.id <= 3);
    if (depth === 'to_contract') return all.filter(s => s.id <= 4);
    return all; // full
  }
  // central
  if (depth === 'skeleton') return all.filter(s => s.id <= 3);
  if (depth === 'to_contract') return all.filter(s => s.id <= 3); // 老板到合同前停
  return all; // full
}

export function getBossStopStepId(mode: ManagementMode, depth: EntryDepth): number | null {
  if (depth === 'skeleton') return 3;
  if (depth === 'to_contract' && mode === 'shared') return 4;
  if (depth === 'to_contract' && mode === 'entire') return 5;
  return null;
}
