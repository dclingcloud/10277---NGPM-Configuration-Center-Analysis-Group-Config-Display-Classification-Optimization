/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Compass,
  Cloud,
  Share2,
  Bell,
  Gauge,
  Tv,
  FileCode2,
  SlidersHorizontal,
  Waves,
  Video,
  Shield,
  Layers,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  Upload,
  Download,
  Filter,
  Pencil,
  Maximize2,
  User,
  Settings,
  X,
  Check,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export type LinkType = '接口' | 'VLAN' | '站点' | 'VXLAN' | 'MAC';

interface AnalysisGroupItem {
  index: number;
  name: string;
  id: number;
  type: LinkType; // 接口 | VLAN | 站点 | VXLAN | MAC
  groupCategory: '链路组' | '应用组';
  description: string;
  targetValue?: string;
  inBandwidth?: number;
  outBandwidth?: number;
  totalBandwidth?: number;
  subObjectEnabled?: boolean;
}

// Top level tabs: 链路组 · 应用组
const TABS = ['链路组', '应用组'] as const;
type MainTab = typeof TABS[number];

// Link types available in Step 2 of modal and table column
const LINK_TYPES: LinkType[] = ['接口', 'VLAN', '站点', 'VXLAN', 'MAC'];

// Dynamic options for each link type
const LINK_TYPE_OPTIONS: Record<LinkType, string[]> = {
  接口: [
    'ge-0/0/1 (核心交换机上联)',
    'ge-0/0/2 (汇聚接口-1)',
    'ge-0/0/3 (汇聚接口-2)',
    'XGigabitEthernet0/0/1 (万兆主干)',
    'eth0 (探针采集口)',
    'bond0 (聚合链路接口)',
  ],
  VLAN: [
    'VLAN 10 (业务生产专网)',
    'VLAN 20 (核心管理网)',
    'VLAN 30 (同城容灾专线)',
    'VLAN 50 (互联网出入口网)',
    'VLAN 100 (DMZ隔离区)',
    'VLAN 200 (财务与清算网)',
    'VLAN 800 (数据库集群内网)',
  ],
  站点: [
    '北京总行生产中心 (Site-BJ-01)',
    '上海同城灾备中心 (Site-SH-02)',
    '深圳湾创新基地 (Site-SZ-03)',
    '广州异地灾备中心 (Site-GZ-04)',
    '武汉研发运营中心 (Site-WH-05)',
    '成都区域节点 (Site-CD-06)',
  ],
  VXLAN: [
    'VNI 5001 (Overlay-Tenant-A)',
    'VNI 5002 (Overlay-Tenant-B)',
    'VNI 6001 (Spine-Leaf-Fabric)',
    'VNI 7001 (DCI跨数据中心隧道)',
    'VNI 8000 (容器云网络隧道)',
  ],
  MAC: [
    '00:50:56:C0:00:01 (核心网关Gateway)',
    '00:0C:29:8B:12:34 (旁路分析探针网卡)',
    '52:54:00:12:34:56 (核心负载均衡F5)',
    '70:69:79:AA:BB:CC (核心三层交换机)',
    'E4:43:4B:11:22:33 (关键服务器网卡)',
  ],
};

const initialMockData: AnalysisGroupItem[] = [
  // 链路组 items with specific link types
  { index: 1, name: '单向回放分析组', id: 62, type: '接口', groupCategory: '链路组', description: '-', targetValue: 'ge-0/0/1 (核心交换机上联)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 2, name: '接口分析组-vlan子对象', id: 61, type: '接口', groupCategory: '链路组', description: '-', targetValue: 'ge-0/0/2 (汇聚接口-1)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 3, name: '单接口1', id: 60, type: '接口', groupCategory: '链路组', description: '-', targetValue: 'eth0 (探针采集口)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 4, name: '测试123', id: 59, type: '接口', groupCategory: '链路组', description: '-', targetValue: 'ge-0/0/1 (核心交换机上联)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 5, name: '测试大屏', id: 58, type: '接口', groupCategory: '链路组', description: '1111', targetValue: 'XGigabitEthernet0/0/1 (万兆主干)', inBandwidth: 2000, outBandwidth: 2000, totalBandwidth: 4000 },
  { index: 6, name: '站点子链路', id: 57, type: '站点', groupCategory: '链路组', description: '-', targetValue: '北京总行生产中心 (Site-BJ-01)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 7, name: 'DSCP1', id: 56, type: '接口', groupCategory: '链路组', description: '-', targetValue: 'ge-0/0/1 (核心交换机上联)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 8, name: '测试vlan', id: 54, type: 'VLAN', groupCategory: '链路组', description: '-', targetValue: 'VLAN 10 (业务生产专网)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 9, name: '华三复现2', id: 53, type: '接口', groupCategory: '链路组', description: '-', targetValue: 'ge-0/0/2 (汇聚接口-1)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 10, name: '华三复现接口分析组', id: 52, type: '接口', groupCategory: '链路组', description: '-', targetValue: 'ge-0/0/1 (核心交换机上联)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 11, name: '华三复现', id: 51, type: '接口', groupCategory: '链路组', description: '-', targetValue: 'ge-0/0/1 (核心交换机上联)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 12, name: 'dscp', id: 50, type: '接口', groupCategory: '链路组', description: '-', targetValue: 'ge-0/0/2 (汇聚接口-1)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 13, name: '多接口分析组', id: 49, type: '接口', groupCategory: '链路组', description: '-', targetValue: 'bond0 (聚合链路接口)', inBandwidth: 2000, outBandwidth: 2000, totalBandwidth: 4000 },
  { index: 14, name: 'VLAN分析组子对象测试2', id: 48, type: 'VLAN', groupCategory: '链路组', description: '-', targetValue: 'VLAN 20 (核心管理网)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 15, name: 'VLAN分析组子对象测试', id: 47, type: 'VLAN', groupCategory: '链路组', description: '-', targetValue: 'VLAN 30 (同城容灾专线)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 16, name: 'test2', id: 46, type: '接口', groupCategory: '链路组', description: '-', targetValue: 'eth0 (探针采集口)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 17, name: 'test', id: 45, type: '接口', groupCategory: '链路组', description: '-', targetValue: 'eth0 (探针采集口)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 18, name: 'dashboard-接口分析组', id: 42, type: '接口', groupCategory: '链路组', description: '-', targetValue: 'ge-0/0/1 (核心交换机上联)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 19, name: 'vlan分析组测试', id: 41, type: 'VLAN', groupCategory: '链路组', description: '-', targetValue: 'VLAN 100 (DMZ隔离区)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 20, name: '全部接口', id: 40, type: '接口', groupCategory: '链路组', description: '-', targetValue: 'ge-0/0/1 (核心交换机上联)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 21, name: 'vlan-站点', id: 39, type: '站点', groupCategory: '链路组', description: '-', targetValue: '上海同城灾备中心 (Site-SH-02)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 22, name: '接口-站点子链路', id: 38, type: '站点', groupCategory: '链路组', description: '-', targetValue: '广州异地灾备中心 (Site-GZ-04)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 23, name: 'vlan分析组', id: 37, type: 'VLAN', groupCategory: '链路组', description: '-', targetValue: 'VLAN 200 (财务与清算网)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 24, name: 'vlan-jack', id: 35, type: 'VLAN', groupCategory: '链路组', description: '-', targetValue: 'VLAN 800 (数据库集群内网)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 25, name: '租户大二层隧道组', id: 34, type: 'VXLAN', groupCategory: '链路组', description: '数据中心跨主机Overlay', targetValue: 'VNI 5001 (Overlay-Tenant-A)', inBandwidth: 3000, outBandwidth: 3000, totalBandwidth: 6000 },
  { index: 26, name: 'Fabric大二层组', id: 33, type: 'VXLAN', groupCategory: '链路组', description: 'Spine-Leaf网络组', targetValue: 'VNI 6001 (Spine-Leaf-Fabric)', inBandwidth: 4000, outBandwidth: 4000, totalBandwidth: 8000 },
  { index: 27, name: '核心网关网卡组', id: 32, type: 'MAC', groupCategory: '链路组', description: '核心交换机网关MAC', targetValue: '00:50:56:C0:00:01 (核心网关Gateway)', inBandwidth: 1000, outBandwidth: 1000, totalBandwidth: 2000 },
  { index: 28, name: 'F5负载均衡主备组', id: 31, type: 'MAC', groupCategory: '链路组', description: 'F5设备MAC分析', targetValue: '52:54:00:12:34:56 (核心负载均衡F5)', inBandwidth: 2000, outBandwidth: 2000, totalBandwidth: 4000 },

  // 应用组 sample items
  { index: 1, name: '核心交易账务应用组', id: 70, type: '接口', groupCategory: '应用组', description: '核心记账主流程', targetValue: 'ge-0/0/1', inBandwidth: 4000, outBandwidth: 4000, totalBandwidth: 8000 },
  { index: 2, name: '手机银行APP网关组', id: 69, type: '接口', groupCategory: '应用组', description: '对外服务接入网关', targetValue: 'ge-0/0/2', inBandwidth: 3000, outBandwidth: 3000, totalBandwidth: 6000 },
  { index: 3, name: '大数据实时风控链路', id: 68, type: '接口', groupCategory: '应用组', description: '实时规则校验集群', targetValue: 'bond0', inBandwidth: 2000, outBandwidth: 2000, totalBandwidth: 4000 },
];

export default function App() {
  const [data, setData] = useState<AnalysisGroupItem[]>(initialMockData);
  const [activeTab, setActiveTab] = useState<MainTab>('链路组');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Toggle state for table inline filter row (Image 3 & Image 4)
  const [isFilterRowOpen, setIsFilterRowOpen] = useState(false);

  // Filter input states for the 4 filterable columns: 名称, ID, 类型, 描述
  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState('');
  const [filterType, setFilterType] = useState<string>(''); // '' means all
  const [filterDesc, setFilterDesc] = useState('');

  // Modal State for New/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form State (includes 链路类型 matching Image 2)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    linkType: '接口' as LinkType, // 链路类型
    targetValue: '',
    inBandwidth: 1000,
    inUnit: 'Mbps',
    outBandwidth: 1000,
    outUnit: 'Mbps',
    totalBandwidth: 2000,
    totalUnit: 'Mbps',
    subObjectEnabled: false,
  });

  const [formError, setFormError] = useState('');

  // Delete confirmation modal state
  const [deleteItem, setDeleteItem] = useState<AnalysisGroupItem | null>(null);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Open "新建" Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setCurrentStep(1);
    setFormError('');
    setFormData({
      name: '',
      description: '',
      linkType: '接口',
      targetValue: '',
      inBandwidth: 1000,
      inUnit: 'Mbps',
      outBandwidth: 1000,
      outUnit: 'Mbps',
      totalBandwidth: 2000,
      totalUnit: 'Mbps',
      subObjectEnabled: false,
    });
    setIsModalOpen(true);
  };

  // Open "编辑" Modal
  const handleOpenEdit = (item: AnalysisGroupItem) => {
    setModalMode('edit');
    setEditingId(item.id);
    setCurrentStep(1);
    setFormError('');
    setFormData({
      name: item.name,
      description: item.description === '-' ? '' : item.description,
      linkType: item.type || '接口',
      targetValue: item.targetValue || '',
      inBandwidth: item.inBandwidth || 1000,
      inUnit: 'Mbps',
      outBandwidth: item.outBandwidth || 1000,
      outUnit: 'Mbps',
      totalBandwidth: item.totalBandwidth || 2000,
      totalUnit: 'Mbps',
      subObjectEnabled: item.subObjectEnabled || false,
    });
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Step 1 -> Step 2
  const handleNextStep = () => {
    if (!formData.name.trim()) {
      setFormError('请输入分析组名称');
      return;
    }
    setFormError('');
    setCurrentStep(2);
  };

  // Step 2 -> Step 1
  const handlePrevStep = () => {
    setFormError('');
    setCurrentStep(1);
  };

  // Auto calculate total bandwidth
  const handleInBandwidthChange = (val: number) => {
    const nextIn = isNaN(val) ? 0 : val;
    setFormData((prev) => ({
      ...prev,
      inBandwidth: nextIn,
      totalBandwidth: nextIn + prev.outBandwidth,
    }));
  };

  const handleOutBandwidthChange = (val: number) => {
    const nextOut = isNaN(val) ? 0 : val;
    setFormData((prev) => ({
      ...prev,
      outBandwidth: nextOut,
      totalBandwidth: prev.inBandwidth + nextOut,
    }));
  };

  // Submit / Confirm
  const handleSubmit = () => {
    if (modalMode === 'create') {
      const maxId = data.reduce((acc, cur) => Math.max(acc, cur.id), 0);
      const newItem: AnalysisGroupItem = {
        index: 1,
        id: maxId + 1,
        name: formData.name.trim(),
        description: formData.description.trim() || '-',
        type: formData.linkType,
        groupCategory: activeTab,
        targetValue: formData.targetValue || LINK_TYPE_OPTIONS[formData.linkType][0],
        inBandwidth: formData.inBandwidth,
        outBandwidth: formData.outBandwidth,
        totalBandwidth: formData.totalBandwidth,
        subObjectEnabled: formData.subObjectEnabled,
      };

      // Add to front of current category
      const otherCatItems = data.filter((item) => item.groupCategory !== activeTab);
      const sameCatItems = data
        .filter((item) => item.groupCategory === activeTab)
        .map((item, idx) => ({ ...item, index: idx + 2 }));

      setData([newItem, ...sameCatItems, ...otherCatItems]);
      showToast(`新建【${formData.linkType}】分析组成功`);
    } else if (modalMode === 'edit' && editingId !== null) {
      setData((prev) =>
        prev.map((item) => {
          if (item.id === editingId) {
            return {
              ...item,
              name: formData.name.trim(),
              description: formData.description.trim() || '-',
              type: formData.linkType,
              targetValue: formData.targetValue || item.targetValue,
              inBandwidth: formData.inBandwidth,
              outBandwidth: formData.outBandwidth,
              totalBandwidth: formData.totalBandwidth,
              subObjectEnabled: formData.subObjectEnabled,
            };
          }
          return item;
        })
      );
      showToast('编辑分析组成功');
    }
    setIsModalOpen(false);
  };

  // Delete handling
  const handleConfirmDelete = () => {
    if (deleteItem) {
      const targetCat = deleteItem.groupCategory;
      setData((prev) => {
        const remainingInCat = prev
          .filter((item) => item.groupCategory === targetCat && item.id !== deleteItem.id)
          .map((item, idx) => ({ ...item, index: idx + 1 }));
        const otherCats = prev.filter((item) => item.groupCategory !== targetCat);
        return [...remainingInCat, ...otherCats];
      });
      setSelectedIds((prev) => prev.filter((id) => id !== deleteItem.id));
      showToast(`已删除分析组【${deleteItem.name}】`);
      setDeleteItem(null);
    }
  };

  // Batch delete
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      showToast('请先选择要删除的分析组');
      return;
    }
    setIsBatchDeleting(true);
  };

  const handleConfirmBatchDelete = () => {
    setData((prev) => {
      const remainingInCat = prev
        .filter((item) => item.groupCategory === activeTab && !selectedIds.includes(item.id))
        .map((item, idx) => ({ ...item, index: idx + 1 }));
      const otherCats = prev.filter((item) => item.groupCategory !== activeTab);
      return [...remainingInCat, ...otherCats];
    });
    showToast(`成功批量删除 ${selectedIds.length} 个分析组`);
    setSelectedIds([]);
    setIsBatchDeleting(false);
  };

  // Checkbox toggle
  const toggleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterName('');
    setFilterId('');
    setFilterType('');
    setFilterDesc('');
    showToast('已重置所有过滤条件');
  };

  // Tab filtered items
  const tabData = data.filter((item) => item.groupCategory === activeTab);

  // Search filtered items within the active tab using the inline filter criteria
  const filteredData = tabData.filter((item) => {
    // Name filter
    if (filterName.trim() && !item.name.toLowerCase().includes(filterName.trim().toLowerCase())) {
      return false;
    }
    // ID filter
    if (filterId.trim() && !item.id.toString().includes(filterId.trim())) {
      return false;
    }
    // Type filter (dropdown)
    if (filterType && item.type !== filterType) {
      return false;
    }
    // Description filter
    if (filterDesc.trim() && !item.description.toLowerCase().includes(filterDesc.trim().toLowerCase())) {
      return false;
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length && filteredData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((d) => d.id));
    }
  };

  // Primary left navigation items
  const primaryNavItems = [
    { label: '智搜', icon: Search, id: 'search' },
    { label: '智溯', icon: Compass, id: 'trace' },
    { label: '逸云', icon: Cloud, id: 'cloud' },
    { label: '拓扑', icon: Share2, id: 'topo' },
    { label: '告警', icon: Bell, id: 'alarm' },
    { label: '监控', icon: Gauge, id: 'monitor' },
    { label: '大屏', icon: Tv, id: 'screen' },
    { label: '解码', icon: FileCode2, id: 'decode' },
    { label: '配置', icon: SlidersHorizontal, id: 'config', active: true },
    { label: 'NetFlow', icon: Waves, id: 'netflow' },
    { label: '音视频', icon: Video, id: 'media' },
    { label: '防火墙', icon: Shield, id: 'firewall' },
    { label: '负载', icon: Layers, id: 'load' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f0f2f5] font-sans text-[13px] text-[#333333]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-md bg-[#1f2937] px-4 py-2 text-xs text-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="h-4 w-4 text-[#52c41a]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Leftmost Dark Primary Navigation Bar */}
      <aside className="flex w-[56px] flex-col items-center justify-between bg-[#121623] py-2 text-white shrink-0 z-20 select-none">
        {/* Top Logo */}
        <div className="flex flex-col items-center w-full">
          <div className="mb-2 text-center text-[15px] font-bold tracking-tight text-white">
            NGPM
          </div>

          {/* Nav Items */}
          <div className="flex flex-col items-center w-full space-y-0.5">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              if (item.active) {
                return (
                  <div
                    key={item.id}
                    className="flex h-[52px] w-full flex-col items-center justify-center bg-[#0091ff] text-white cursor-pointer transition-colors"
                  >
                    <Icon className="h-[18px] w-[18px] mb-0.5 stroke-[2]" />
                    <span className="text-[11px] leading-tight font-medium">
                      {item.label}
                    </span>
                  </div>
                );
              }
              return (
                <div
                  key={item.id}
                  className="flex h-[50px] w-full flex-col items-center justify-center text-[#8e9aaf] hover:text-white hover:bg-[#1a2032] cursor-pointer transition-colors"
                >
                  <Icon className="h-[17px] w-[17px] mb-0.5 stroke-[1.75]" />
                  <span className="text-[11px] leading-tight">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Collapse Toggle */}
        <div className="flex items-center justify-center w-full py-2 text-[#8e9aaf] hover:text-white cursor-pointer">
          <div className="flex items-center justify-center">
            <span className="text-xs">|</span>
            <ChevronLeft className="h-4 w-4 -ml-1" />
          </div>
        </div>
      </aside>

      {/* 2. Secondary Sidebar: Menu Tree */}
      <aside className="flex w-[190px] flex-col bg-white border-r border-[#e5e7eb] shrink-0 overflow-y-auto select-none text-[12px] text-[#4b5563]">
        <div className="py-2">
          {/* 管理 */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-4 py-1.5 font-bold text-[#1f2937]">
              <span>管理</span>
              <ChevronUp className="h-3.5 w-3.5 text-[#9ca3af]" />
            </div>
            <div className="flex flex-col">
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">探针管理</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">接口管理</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">探针健康</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">探针巡检</span>
            </div>
          </div>

          {/* 配置 */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-4 py-1.5 font-bold text-[#1f2937]">
              <span>配置</span>
              <ChevronUp className="h-3.5 w-3.5 text-[#9ca3af]" />
            </div>
            <div className="flex flex-col">
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">应用配置</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">虚链路配置</span>
              <div className="flex items-center justify-between bg-[#e6f4ff] px-5 py-1.5 font-medium text-[#1677ff] border-r-[3px] border-[#1677ff] cursor-pointer">
                <span>分析组配置</span>
              </div>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">裁包配置</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">本地网络配置</span>
            </div>
          </div>

          {/* 数据 */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-4 py-1.5 font-bold text-[#1f2937]">
              <span>数据</span>
              <ChevronUp className="h-3.5 w-3.5 text-[#9ca3af]" />
            </div>
            <div className="flex flex-col">
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">回放分析</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">实时基线</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">智能基线</span>
            </div>
          </div>

          {/* 用户 */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-4 py-1.5 font-bold text-[#1f2937]">
              <span>用户</span>
              <ChevronUp className="h-3.5 w-3.5 text-[#9ca3af]" />
            </div>
            <div className="flex flex-col">
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">权限组配置</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">用户配置</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">安全策略</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">登录用户管理</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">第三方验证配置</span>
            </div>
          </div>

          {/* 系统 */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-4 py-1.5 font-bold text-[#1f2937]">
              <span>系统</span>
              <ChevronUp className="h-3.5 w-3.5 text-[#9ca3af]" />
            </div>
            <div className="flex flex-col">
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">集成</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">系统配置</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">定时任务</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">日志管理</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">License管理</span>
            </div>
          </div>

          {/* 第三方接口配置 */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-4 py-1.5 font-bold text-[#1f2937]">
              <span>第三方接口配置</span>
              <ChevronUp className="h-3.5 w-3.5 text-[#9ca3af]" />
            </div>
            <div className="flex flex-col">
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">CMDB接口</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">日志对接</span>
            </div>
          </div>

          {/* 智能体 */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-4 py-1.5 font-bold text-[#1f2937]">
              <span>智能体</span>
              <ChevronUp className="h-3.5 w-3.5 text-[#9ca3af]" />
            </div>
            <div className="flex flex-col">
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">智能体配置</span>
              <span className="px-5 py-1.5 hover:bg-[#f9fafb] cursor-pointer">工作流配置</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 3. Main Workspace Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-[42px] items-center justify-between bg-white px-4 border-b border-[#e5e7eb] shrink-0 select-none">
          {/* Breadcrumbs on Left */}
          <div className="flex items-center gap-1.5 text-[13px]">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-[#2b3b55] text-white">
              <Settings className="h-3 w-3 stroke-[2.2]" />
            </div>
            <span className="font-bold text-[#111827]">配置</span>
            <span className="text-[#9ca3af] mx-0.5">/</span>
            <span className="text-[#1677ff] cursor-pointer">配置</span>
            <span className="text-[#9ca3af] mx-0.5">/</span>
            <span className="text-[#1677ff] font-medium cursor-pointer">分析组配置</span>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-4 text-[#4b5563]">
            <button className="text-[#6b7280] hover:text-[#111827] transition-colors" title="搜索">
              <Search className="h-4 w-4" />
            </button>
            <button className="text-[#6b7280] hover:text-[#111827] transition-colors" title="全屏">
              <Maximize2 className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5 text-xs text-[#374151] cursor-pointer hover:text-[#111827]">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e5e7eb] text-[#4b5563]">
                <User className="h-3 w-3" />
              </div>
              <span>admin</span>
              <ChevronDown className="h-3 w-3 text-[#9ca3af]" />
            </div>
          </div>
        </header>

        {/* Content Body Area */}
        <main className="flex-1 overflow-auto p-3">
          <div className="flex min-h-full flex-col justify-between rounded bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e5e7eb]">
            <div>
              {/* Card Header: Tabs (链路组 · 应用组, 如图1) & Action Toolbar */}
              <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-transparent pb-1">
                {/* Requirement 1: 链路组 · 应用组 (如图1) */}
                <div className="flex items-center text-[13px] select-none font-sans">
                  {TABS.map((tab, idx) => {
                    const isActive = activeTab === tab;
                    return (
                      <React.Fragment key={tab}>
                        {idx > 0 && (
                          <span className="mx-2 text-[#9ca3af] font-light">·</span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab(tab);
                            setSelectedIds([]);
                          }}
                          className={`cursor-pointer transition-colors ${
                            isActive
                              ? 'font-medium text-[#1677ff]'
                              : 'text-[#374151] hover:text-[#1677ff]'
                          }`}
                        >
                          {tab}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Right Action Toolbar */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="flex items-center gap-1 rounded border border-[#d9d9d9] bg-white px-2.5 py-1 text-xs text-[#595959] hover:border-[#1677ff] hover:text-[#1677ff] transition-colors cursor-pointer shadow-sm active:bg-gray-50"
                  >
                    <Plus className="h-3 w-3" />
                    <span>新建</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleBatchDelete}
                    className="flex items-center gap-1 rounded border border-[#d9d9d9] bg-white px-2.5 py-1 text-xs text-[#595959] hover:border-[#ff4d4f] hover:text-[#ff4d4f] transition-colors cursor-pointer shadow-sm"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>批量删除</span>
                    {selectedIds.length > 0 && (
                      <span className="ml-0.5 rounded-full bg-[#ff4d4f] px-1.5 py-0.2 text-[10px] text-white">
                        {selectedIds.length}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('已触发配置导入')}
                    className="flex items-center gap-1 rounded border border-[#d9d9d9] bg-white px-2.5 py-1 text-xs text-[#595959] hover:border-[#1677ff] hover:text-[#1677ff] transition-colors cursor-pointer shadow-sm"
                  >
                    <Upload className="h-3 w-3" />
                    <span>导入</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('分析组模板下载就绪')}
                    className="flex items-center gap-1 rounded border border-[#d9d9d9] bg-white px-2.5 py-1 text-xs text-[#595959] hover:border-[#1677ff] hover:text-[#1677ff] transition-colors cursor-pointer shadow-sm"
                  >
                    <Download className="h-3 w-3" />
                    <span>模板下载</span>
                  </button>

                  {/* Requirement 4: 右上角过滤去掉，换成图3按钮 (点击触发列表行内过滤) */}
                  <button
                    type="button"
                    onClick={() => setIsFilterRowOpen(!isFilterRowOpen)}
                    title={isFilterRowOpen ? '收起过滤' : '展开过滤'}
                    className={`flex h-[28px] w-[28px] items-center justify-center rounded border transition-colors cursor-pointer shadow-sm ${
                      isFilterRowOpen
                        ? 'border-[#0091ff] bg-[#e6f4ff] text-[#0091ff]'
                        : 'border-[#d9d9d9] bg-white text-[#595959] hover:border-[#0091ff] hover:text-[#0091ff]'
                    }`}
                  >
                    <Filter className="h-3.5 w-3.5 stroke-[2]" />
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    {/* Header Row */}
                    <tr className="border-b border-[#f0f0f0] text-[#666666] font-normal">
                      <th className="py-2.5 px-3 font-normal w-[40px]">
                        <input
                          type="checkbox"
                          checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
                          onChange={toggleSelectAll}
                          className="rounded border-[#d9d9d9] text-[#1677ff] focus:ring-0 cursor-pointer"
                        />
                      </th>
                      <th className="py-2.5 px-3 font-normal w-[60px]">序号</th>
                      <th className="py-2.5 px-3 font-normal w-[240px]">名称</th>
                      <th className="py-2.5 px-3 font-normal w-[90px]">ID</th>
                      {/* Requirement 2: 列表中在ID列后加类型、类型分类为接口、VLAN、站点、VXLAN、MAC */}
                      <th className="py-2.5 px-3 font-normal w-[110px]">类型</th>
                      <th className="py-2.5 px-3 font-normal">描述</th>
                      <th className="py-2.5 px-4 font-normal text-right w-[110px]">操作</th>
                    </tr>

                    {/* Requirement 4: 类似于图4样式展示的行内过滤器 (名称、ID、类型[下拉]、描述) */}
                    {isFilterRowOpen && (
                      <tr className="bg-[#fafafa] border-b border-[#e8e8e8] animate-in fade-in duration-150">
                        {/* Checkbox col placeholder */}
                        <td className="py-1.5 px-3 text-center text-[#bfbfbf]">-</td>
                        {/* 序号 col placeholder */}
                        <td className="py-1.5 px-3 text-center text-[#bfbfbf]">-</td>
                        {/* 名称 Filter Input */}
                        <td className="py-1.5 px-3">
                          <input
                            type="text"
                            placeholder="名称"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            className="h-6 w-full rounded border border-[#d9d9d9] bg-white px-2 text-xs text-[#262626] placeholder-[#bfbfbf] focus:border-[#0091ff] focus:outline-none"
                          />
                        </td>
                        {/* ID Filter Input */}
                        <td className="py-1.5 px-3">
                          <input
                            type="text"
                            placeholder="ID"
                            value={filterId}
                            onChange={(e) => setFilterId(e.target.value)}
                            className="h-6 w-full rounded border border-[#d9d9d9] bg-white px-2 text-xs text-[#262626] placeholder-[#bfbfbf] focus:border-[#0091ff] focus:outline-none"
                          />
                        </td>
                        {/* 类型 Dropdown Filter */}
                        <td className="py-1.5 px-3">
                          <div className="relative w-full">
                            <select
                              value={filterType}
                              onChange={(e) => setFilterType(e.target.value)}
                              className="h-6 w-full appearance-none rounded border border-[#d9d9d9] bg-white pl-2 pr-6 text-xs text-[#262626] focus:border-[#0091ff] focus:outline-none cursor-pointer"
                            >
                              <option value="">全部类型</option>
                              {LINK_TYPES.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-1.5 top-1.5 h-3 w-3 text-[#8c8c8c]" />
                          </div>
                        </td>
                        {/* 描述 Filter Input */}
                        <td className="py-1.5 px-3">
                          <input
                            type="text"
                            placeholder="描述"
                            value={filterDesc}
                            onChange={(e) => setFilterDesc(e.target.value)}
                            className="h-6 w-full rounded border border-[#d9d9d9] bg-white px-2 text-xs text-[#262626] placeholder-[#bfbfbf] focus:border-[#0091ff] focus:outline-none"
                          />
                        </td>
                        {/* Filter Actions in 操作 col (Image 4 search & reset buttons) */}
                        <td className="py-1.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => showToast(`已过滤出 ${filteredData.length} 条记录`)}
                              className="flex h-6 w-6 items-center justify-center rounded bg-[#0091ff] hover:bg-[#0080e6] text-white transition-colors cursor-pointer shadow-xs"
                              title="执行过滤"
                            >
                              <Search className="h-3 w-3 stroke-[2.5]" />
                            </button>
                            <button
                              type="button"
                              onClick={handleResetFilters}
                              className="flex h-6 w-6 items-center justify-center rounded bg-[#0091ff] hover:bg-[#0080e6] text-white transition-colors cursor-pointer shadow-xs"
                              title="重置过滤条件"
                            >
                              <RotateCcw className="h-3 w-3 stroke-[2.5]" />
                            </button>
                            <span title="支持按名称、ID、类型下拉及描述组合过滤" className="cursor-help inline-flex items-center ml-0.5">
                              <HelpCircle className="h-3.5 w-3.5 text-[#8c8c8c]" />
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#8c8c8c]">
                          暂无匹配的【{activeTab}】分析组数据
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors group"
                        >
                          <td className="py-2 px-3">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(row.id)}
                              onChange={() => toggleSelectRow(row.id)}
                              className="rounded border-[#d9d9d9] text-[#1677ff] focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="py-2 px-3 text-[#555555] font-mono tabular-nums">
                            {row.index}
                          </td>
                          <td className="py-2 px-3 text-[#262626] font-medium">
                            {row.name}
                          </td>
                          <td className="py-2 px-3 text-[#555555] font-mono tabular-nums">
                            {row.id}
                          </td>
                          {/* Requirement 2: 类型列展示 */}
                          <td className="py-2 px-3">
                            <span className="text-[#333333]">
                              {row.type}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-[#666666]">
                            {row.description}
                          </td>
                          <td className="py-2 px-4 text-right">
                            <div className="flex items-center justify-end gap-2.5 text-[#8c8c8c]">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(row)}
                                className="hover:text-[#1677ff] transition-colors cursor-pointer p-0.5"
                                title="编辑"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteItem(row)}
                                className="hover:text-[#ff4d4f] transition-colors cursor-pointer p-0.5"
                                title="删除"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination & Status Footer */}
            <div className="mt-4 flex flex-wrap items-center justify-between border-t border-[#f0f0f0] pt-3 text-xs text-[#666666] select-none">
              <div>
                本页记录从 1 到 {filteredData.length}, 总数{' '}
                <span className="font-semibold text-[#262626]">
                  {filteredData.length}
                </span>{' '}
                条
              </div>

              <div className="flex items-center gap-2">
                {/* Per page selector */}
                <div className="flex items-center rounded border border-[#d9d9d9] bg-white px-2 py-0.5 text-xs text-[#595959] cursor-pointer hover:border-[#1677ff]">
                  <span>100条/页</span>
                  <ChevronDown className="ml-1 h-3 w-3 text-[#8c8c8c]" />
                </div>

                {/* Page Prev Button */}
                <button
                  type="button"
                  disabled
                  className="flex h-6 w-6 items-center justify-center rounded border border-[#d9d9d9] bg-white text-[#bfbfbf] cursor-not-allowed"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>

                {/* Active Page Number */}
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded bg-[#1677ff] text-white font-medium shadow-sm"
                >
                  1
                </button>

                {/* Page Next Button */}
                <button
                  type="button"
                  disabled
                  className="flex h-6 w-6 items-center justify-center rounded border border-[#d9d9d9] bg-white text-[#bfbfbf] cursor-not-allowed"
                >
                  <ChevronLeft className="h-3 w-3 rotate-180" />
                </button>

                {/* Goto page */}
                <div className="flex items-center gap-1 ml-2 text-[#595959]">
                  <span>前往</span>
                  <input
                    type="text"
                    defaultValue=""
                    className="h-6 w-8 rounded border border-[#d9d9d9] text-center text-xs focus:border-[#1677ff] focus:outline-none"
                  />
                  <span>页</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 4. Bottom Right Floating Mascot Assistant Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => showToast('智能巡检助手已准备就绪')}
          className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-tr from-[#0091ff] via-[#40a9ff] to-[#91d5ff] p-0.5 shadow-[0_4px_16px_rgba(22,119,255,0.4)] hover:scale-105 transition-all duration-200 cursor-pointer"
          title="智能助手"
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white overflow-hidden shadow-inner">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#1e293b]">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse"></span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* 5. Create / Edit Stepper Modal (Requirement 3: 增加链路类型, 如图2) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-150">
          <div className="relative w-[700px] rounded-lg bg-white shadow-2xl overflow-hidden border border-[#e5e7eb] animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h3 className="text-[15px] font-medium text-[#1f2937]">
                {modalMode === 'create' ? '新建' : '编辑'}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-[#9ca3af] hover:text-[#4b5563] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stepper Header (3 steps matching images) */}
            <div className="px-10 pt-4 pb-8">
              <div className="flex items-center justify-center">
                {/* Step 1: 分析组名称 */}
                <div className="flex flex-col items-center">
                  {currentStep === 1 ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0091ff] text-white text-sm font-semibold shadow-sm">
                      1
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0091ff] text-[#0091ff] bg-white text-sm font-semibold">
                      <Check className="h-4 w-4 stroke-[2.5]" />
                    </div>
                  )}
                  <span
                    className={`mt-2 text-xs font-normal ${
                      currentStep === 1 ? 'text-[#1f2937]' : 'text-[#595959]'
                    }`}
                  >
                    分析组名称
                  </span>
                </div>

                {/* Connecting Line 1-2 */}
                <div className="h-[1.5px] w-28 bg-[#d9d9d9] -mt-5 mx-2" />

                {/* Step 2: 聚合链路设置 */}
                <div className="flex flex-col items-center">
                  {currentStep === 2 ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0091ff] text-white text-sm font-semibold shadow-sm">
                      2
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f0f0] text-[#8c8c8c] text-sm font-medium">
                      2
                    </div>
                  )}
                  <span
                    className={`mt-2 text-xs font-normal ${
                      currentStep === 2 ? 'text-[#1f2937]' : 'text-[#8c8c8c]'
                    }`}
                  >
                    聚合链路设置
                  </span>
                </div>

                {/* Connecting Line 2-3 */}
                <div className="h-[1.5px] w-28 bg-[#d9d9d9] -mt-5 mx-2" />

                {/* Step 3: 完成 */}
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f0f0] text-[#8c8c8c] text-sm font-medium">
                    3
                  </div>
                  <span className="mt-2 text-xs font-normal text-[#8c8c8c]">
                    完成
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body: Step 1 vs Step 2 */}
            <div className="px-12 py-2 min-h-[220px]">
              {formError && (
                <div className="mb-4 flex items-center justify-center gap-1.5 text-xs text-[#ff4d4f]">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{formError}</span>
                </div>
              )}

              {currentStep === 1 ? (
                /* Step 1 Form */
                <div className="space-y-5 flex flex-col items-center justify-center pt-2">
                  <div className="flex items-center gap-4 w-[520px]">
                    <label className="w-16 text-right text-xs text-[#262626] font-normal">
                      名称
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formError) setFormError('');
                      }}
                      placeholder=""
                      autoFocus
                      className="h-8 flex-1 rounded border border-[#d9d9d9] px-3 text-xs text-[#262626] focus:border-[#0091ff] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-4 w-[520px]">
                    <label className="w-16 text-right text-xs text-[#262626] font-normal">
                      描述
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder=""
                      className="h-8 flex-1 rounded border border-[#d9d9d9] px-3 text-xs text-[#262626] focus:border-[#0091ff] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              ) : (
                /* Step 2 Form (Requirement 3: 增加链路类型, 如图2) */
                <div className="space-y-4 flex flex-col items-center justify-center pt-1">
                  {/* Field: 链路类型 (Image 2) */}
                  <div className="flex items-center gap-4 w-[520px]">
                    <label className="w-20 text-right text-xs text-[#262626] font-normal">
                      链路类型
                    </label>
                    <div className="relative flex-1">
                      <select
                        value={formData.linkType}
                        onChange={(e) => {
                          const newType = e.target.value as LinkType;
                          setFormData({
                            ...formData,
                            linkType: newType,
                            targetValue: '', // reset selected target for the new type
                          });
                        }}
                        className="h-8 w-full appearance-none rounded border border-[#0091ff] bg-white px-3 pr-8 text-xs text-[#262626] focus:border-[#0091ff] focus:outline-none transition-colors cursor-pointer font-medium"
                      >
                        {LINK_TYPES.map((lt) => (
                          <option key={lt} value={lt}>
                            {lt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[#0091ff]" />
                    </div>
                  </div>

                  {/* Field: 对应所选链路类型的具体项 (接口 / VLAN / 站点 / VXLAN / MAC) */}
                  <div className="flex items-center gap-4 w-[520px]">
                    <label className="w-20 text-right text-xs text-[#262626] font-normal">
                      {formData.linkType}
                    </label>
                    <div className="relative flex-1">
                      <select
                        value={formData.targetValue}
                        onChange={(e) =>
                          setFormData({ ...formData, targetValue: e.target.value })
                        }
                        className="h-8 w-full appearance-none rounded border border-[#d9d9d9] bg-white px-3 pr-8 text-xs text-[#262626] focus:border-[#0091ff] focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="">请选择</option>
                        {LINK_TYPE_OPTIONS[formData.linkType]?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[#8c8c8c]" />
                    </div>
                  </div>

                  {/* Field: 进网带宽 */}
                  <div className="flex items-center gap-4 w-[520px]">
                    <label className="w-20 text-right text-xs text-[#262626] font-normal">
                      进网带宽
                    </label>
                    <div className="flex flex-1 gap-2">
                      <input
                        type="number"
                        value={formData.inBandwidth}
                        onChange={(e) =>
                          handleInBandwidthChange(parseInt(e.target.value, 10))
                        }
                        className="h-8 flex-1 rounded border border-[#d9d9d9] px-3 text-xs text-[#262626] focus:border-[#0091ff] focus:outline-none transition-colors"
                      />
                      <div className="relative w-28">
                        <select
                          value={formData.inUnit}
                          onChange={(e) =>
                            setFormData({ ...formData, inUnit: e.target.value })
                          }
                          className="h-8 w-full appearance-none rounded border border-[#d9d9d9] bg-white px-3 pr-7 text-xs text-[#262626] focus:border-[#0091ff] focus:outline-none transition-colors cursor-pointer"
                        >
                          <option value="Mbps">Mbps</option>
                          <option value="Gbps">Gbps</option>
                          <option value="Kbps">Kbps</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-3.5 w-3.5 text-[#8c8c8c]" />
                      </div>
                    </div>
                  </div>

                  {/* Field: 出网带宽 */}
                  <div className="flex items-center gap-4 w-[520px]">
                    <label className="w-20 text-right text-xs text-[#262626] font-normal">
                      出网带宽
                    </label>
                    <div className="flex flex-1 gap-2">
                      <input
                        type="number"
                        value={formData.outBandwidth}
                        onChange={(e) =>
                          handleOutBandwidthChange(parseInt(e.target.value, 10))
                        }
                        className="h-8 flex-1 rounded border border-[#d9d9d9] px-3 text-xs text-[#262626] focus:border-[#0091ff] focus:outline-none transition-colors"
                      />
                      <div className="relative w-28">
                        <select
                          value={formData.outUnit}
                          onChange={(e) =>
                            setFormData({ ...formData, outUnit: e.target.value })
                          }
                          className="h-8 w-full appearance-none rounded border border-[#d9d9d9] bg-white px-3 pr-7 text-xs text-[#262626] focus:border-[#0091ff] focus:outline-none transition-colors cursor-pointer"
                        >
                          <option value="Mbps">Mbps</option>
                          <option value="Gbps">Gbps</option>
                          <option value="Kbps">Kbps</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-3.5 w-3.5 text-[#8c8c8c]" />
                      </div>
                    </div>
                  </div>

                  {/* Field: 总带宽 */}
                  <div className="flex items-center gap-4 w-[520px]">
                    <label className="w-20 text-right text-xs text-[#262626] font-normal">
                      总带宽
                    </label>
                    <div className="flex flex-1 gap-2">
                      <input
                        type="number"
                        value={formData.totalBandwidth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            totalBandwidth: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="h-8 flex-1 rounded border border-[#d9d9d9] px-3 text-xs text-[#262626] focus:border-[#0091ff] focus:outline-none transition-colors"
                      />
                      <div className="relative w-28">
                        <select
                          value={formData.totalUnit}
                          onChange={(e) =>
                            setFormData({ ...formData, totalUnit: e.target.value })
                          }
                          className="h-8 w-full appearance-none rounded border border-[#d9d9d9] bg-white px-3 pr-7 text-xs text-[#262626] focus:border-[#0091ff] focus:outline-none transition-colors cursor-pointer"
                        >
                          <option value="Mbps">Mbps</option>
                          <option value="Gbps">Gbps</option>
                          <option value="Kbps">Kbps</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-3.5 w-3.5 text-[#8c8c8c]" />
                      </div>
                    </div>
                  </div>

                  {/* Field: 子对象启用 */}
                  <div className="flex items-center gap-4 w-[520px]">
                    <label className="w-20 text-right text-xs text-[#262626] font-normal">
                      子对象启用
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            subObjectEnabled: !formData.subObjectEnabled,
                          })
                        }
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          formData.subObjectEnabled
                            ? 'bg-[#0091ff]'
                            : 'bg-[#d9d9d9]'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            formData.subObjectEnabled
                              ? 'translate-x-4'
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span
                        title="启用后将支持细分子对象与关联流量链路解析"
                        className="cursor-help inline-flex items-center"
                      >
                        <HelpCircle className="h-4 w-4 text-[#8c8c8c]" />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Buttons */}
            <div className="flex items-center justify-center gap-3 py-6">
              {currentStep === 1 ? (
                <>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="h-8 rounded bg-[#f5f5f5] px-6 text-xs text-[#595959] hover:bg-[#e8e8e8] transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="h-8 rounded bg-[#40a9ff] hover:bg-[#1890ff] px-6 text-xs text-white transition-colors cursor-pointer shadow-sm"
                  >
                    下一步
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="h-8 rounded bg-[#f5f5f5] px-6 text-xs text-[#595959] hover:bg-[#e8e8e8] transition-colors cursor-pointer"
                  >
                    上一步
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="h-8 rounded bg-[#0091ff] hover:bg-[#0080e6] px-6 text-xs text-white transition-colors cursor-pointer shadow-sm"
                  >
                    确定
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Item Confirmation Modal */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-150">
          <div className="relative w-[380px] rounded-lg bg-white p-6 shadow-xl border border-[#e5e7eb] animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff2f0] text-[#ff4d4f] shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-[#262626]">确认删除</h4>
                <p className="mt-1.5 text-xs text-[#595959] leading-relaxed">
                  确定要删除分析组【{deleteItem.name}】吗？删除后该配置将不可恢复。
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteItem(null)}
                className="h-7 rounded border border-[#d9d9d9] bg-white px-3 text-xs text-[#595959] hover:border-gray-400 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="h-7 rounded bg-[#ff4d4f] hover:bg-[#d9363e] px-3.5 text-xs text-white transition-colors cursor-pointer shadow-sm"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Delete Confirmation Modal */}
      {isBatchDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-150">
          <div className="relative w-[380px] rounded-lg bg-white p-6 shadow-xl border border-[#e5e7eb] animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff2f0] text-[#ff4d4f] shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-[#262626]">批量删除确认</h4>
                <p className="mt-1.5 text-xs text-[#595959] leading-relaxed">
                  确定要批量删除选中的 {selectedIds.length} 个分析组吗？此操作无法撤销。
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsBatchDeleting(false)}
                className="h-7 rounded border border-[#d9d9d9] bg-white px-3 text-xs text-[#595959] hover:border-gray-400 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchDelete}
                className="h-7 rounded bg-[#ff4d4f] hover:bg-[#d9363e] px-3.5 text-xs text-white transition-colors cursor-pointer shadow-sm"
              >
                确定批量删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
