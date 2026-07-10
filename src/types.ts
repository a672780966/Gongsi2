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
  currentStageKey?: 'prep' | 'project' | 'ownership' | 'layout' | 'rooms' | 'closing';
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
}

export interface OnboardingDraft {
  id: string;
  employeeName: string;
  role: string;
  department: string;
  currentStep: number;
  updatedAt: string;
}
