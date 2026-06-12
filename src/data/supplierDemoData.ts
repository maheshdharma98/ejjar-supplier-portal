// ============================================
// TYPES
// ============================================

export type RFQStatus =
  'new' | 'responded' | 'negotiating' | 'accepted' | 'rejected' | 'expired';

export type JobStatus =
  'pending_start' | 'in_progress' | 'completed' | 'cancelled';

export interface DemoRFQ {
  id: string;
  contractorId: string;
  contractorName: string;
  contractorNameAr: string;
  contractorCompany: string;
  contractorCompanyAr: string;
  contractorRating: number;
  category: string;
  categoryAr: string;
  subcategory: string;
  subcategoryAr: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  city: string;
  cityAr: string;
  country: string;
  budgetMin: number;
  budgetMax: number;
  startDate: string;
  duration: string;
  durationAr: string;
  status: RFQStatus;
  receivedAt: string;
  quotes: DemoQuote[];
}

export interface DemoQuote {
  id: string;
  rfqId: string;
  fromRole: 'supplier' | 'contractor';
  amount: number;
  message: string;
  messageAr: string;
  timestamp: string;
  status: 'pending' | 'countered' | 'accepted' | 'rejected';
}

export interface DemoJob {
  id: string;
  rfqId: string;
  contractorName: string;
  contractorNameAr: string;
  category: string;
  categoryAr: string;
  title: string;
  titleAr: string;
  amount: number;
  city: string;
  cityAr: string;
  status: JobStatus;
  startDate: string;
  progress: number;
  milestones: { name: string; nameAr: string; completed: boolean }[];
}

// ============================================
// DEMO RFQ DATA — 3 Oman storylines
// ============================================

export const DEMO_RFQS: DemoRFQ[] = [
  {
    id: 'RFQ_DEMO_001',
    contractorId: 'C001',
    contractorName: 'Ahmed Al-Balushi',
    contractorNameAr: 'أحمد البلوشي',
    contractorCompany: 'Muscat Construction Co.',
    contractorCompanyAr: 'شركة مسقط للإنشاءات',
    contractorRating: 4.7,
    category: 'Manpower',
    categoryAr: 'العمالة',
    subcategory: 'Plumber',
    subcategoryAr: 'سباك',
    title: 'Plumber needed for 3-day villa project',
    titleAr: 'مطلوب سباك لمشروع فيلا لمدة 3 أيام',
    description:
      'Need experienced plumber for new villa in Al Khuwair Muscat. Work includes PEX piping for hot/cold water, drainage system, and fixture installation for 4 bathrooms and 1 kitchen.',
    descriptionAr:
      'نحتاج سباك ذو خبرة لبناء فيلا جديدة في الخوير مسقط. يشمل العمل تركيب أنابيب PEX للمياه الساخنة والباردة ونظام الصرف الصحي وتركيب التركيبات لـ 4 حمامات ومطبخ.',
    city: 'Muscat',
    cityAr: 'مسقط',
    country: 'Oman',
    budgetMin: 150,
    budgetMax: 250,
    startDate: '2026-06-15',
    duration: '3 days',
    durationAr: '3 أيام',
    status: 'negotiating',
    receivedAt: '2026-06-09T08:00:00Z',
    quotes: [
      {
        id: 'Q001',
        rfqId: 'RFQ_DEMO_001',
        fromRole: 'supplier',
        amount: 220,
        message:
          'We can complete this in 3 days. Price includes all labor and consumables. PEX certified team available from June 15.',
        messageAr:
          'يمكننا إنجاز ذلك في 3 أيام. السعر يشمل جميع العمالة والمواد الاستهلاكية. فريق PEX معتمد متاح من 15 يونيو.',
        timestamp: '2026-06-09T09:15:00Z',
        status: 'countered',
      },
      {
        id: 'Q002',
        rfqId: 'RFQ_DEMO_001',
        fromRole: 'contractor',
        amount: 180,
        message:
          'Thanks for the quick response. Can you do it for OMR 180? We have more projects coming.',
        messageAr:
          'شكراً للرد السريع. هل يمكنك القيام بذلك مقابل 180 ريال عماني؟ لدينا مزيد من المشاريع قادمة.',
        timestamp: '2026-06-09T10:00:00Z',
        status: 'countered',
      },
      {
        id: 'Q003',
        rfqId: 'RFQ_DEMO_001',
        fromRole: 'supplier',
        amount: 200,
        message:
          'OMR 200 is our best price. Includes all materials and 6-month warranty on workmanship.',
        messageAr:
          '200 ريال عماني هو أفضل سعر لدينا. يشمل جميع المواد وضمان 6 أشهر على جودة العمل.',
        timestamp: '2026-06-09T11:30:00Z',
        status: 'pending',
      },
    ],
  },
  {
    id: 'RFQ_DEMO_002',
    contractorId: 'C001',
    contractorName: 'Ahmed Al-Balushi',
    contractorNameAr: 'أحمد البلوشي',
    contractorCompany: 'Muscat Construction Co.',
    contractorCompanyAr: 'شركة مسقط للإنشاءات',
    contractorRating: 4.7,
    category: 'Machinery',
    categoryAr: 'الآليات والمركبات',
    subcategory: 'Excavator',
    subcategoryAr: 'حفارة',
    title: 'Excavator needed for 5-day foundation work',
    titleAr: 'مطلوب حفارة لأعمال الأساسات لمدة 5 أيام',
    description:
      'Need CAT 320 or similar excavator with operator for foundation work. Site is 800sqm warehouse in Sohar Industrial Estate.',
    descriptionAr:
      'نحتاج حفارة كاتربيلر 320 أو ما يماثلها مع مشغل لأعمال الأساسات. الموقع مستودع 800 متر مربع في المنطقة الصناعية بصحار.',
    city: 'Sohar',
    cityAr: 'صحار',
    country: 'Oman',
    budgetMin: 1200,
    budgetMax: 1500,
    startDate: '2026-06-20',
    duration: '5 days',
    durationAr: '5 أيام',
    status: 'new',
    receivedAt: '2026-06-09T07:00:00Z',
    quotes: [],
  },
  {
    id: 'RFQ_DEMO_003',
    contractorId: 'C001',
    contractorName: 'Ahmed Al-Balushi',
    contractorNameAr: 'أحمد البلوشي',
    contractorCompany: 'Muscat Construction Co.',
    contractorCompanyAr: 'شركة مسقط للإنشاءات',
    contractorRating: 4.7,
    category: 'Shipping',
    categoryAr: 'الشحن',
    subcategory: 'Pallet',
    subcategoryAr: 'بالتات',
    title: 'Ship 20 pallets from Muscat to Salalah',
    titleAr: 'شحن 20 بالتة من مسقط إلى صلالة',
    description:
      'Need to ship 20 standard pallets of construction materials from Muscat to Salalah. Pickup ready June 18, delivery by June 21.',
    descriptionAr:
      'نحتاج شحن 20 بالتة قياسية من مواد البناء من مسقط إلى صلالة. الاستلام جاهز 18 يونيو، التسليم بحلول 21 يونيو.',
    city: 'Muscat',
    cityAr: 'مسقط',
    country: 'Oman',
    budgetMin: 400,
    budgetMax: 600,
    startDate: '2026-06-18',
    duration: '3 days transit',
    durationAr: '3 أيام نقل',
    status: 'new',
    receivedAt: '2026-06-09T11:00:00Z',
    quotes: [],
  },
];

export const DEMO_JOBS: DemoJob[] = [
  {
    id: 'JOB_001',
    rfqId: 'RFQ_HIST_001',
    contractorName: 'Ahmed Al-Balushi',
    contractorNameAr: 'أحمد البلوشي',
    category: 'Manpower',
    categoryAr: 'العمالة',
    title: 'Office wiring - CBD Muscat',
    titleAr: 'تمديدات المكتب - الحي التجاري مسقط',
    amount: 380,
    city: 'Muscat',
    cityAr: 'مسقط',
    status: 'in_progress',
    startDate: '2026-06-05',
    progress: 60,
    milestones: [
      { name: 'Site survey', nameAr: 'مسح الموقع', completed: true },
      { name: 'Wiring installation', nameAr: 'تركيب الأسلاك', completed: true },
      { name: 'Outlet installation', nameAr: 'تركيب المنافذ', completed: false },
      { name: 'Testing & handover', nameAr: 'الاختبار والتسليم', completed: false },
    ],
  },
];

// ============================================
// SUPPLIER DEMO PROFILE
// ============================================

export const SUPPLIER_PROFILE = {
  id: 'S001',
  name: 'Rashid Al-Saadi',
  nameAr: 'راشد السعدي',
  company: 'Al-Saadi Plumbing Services',
  companyAr: 'خدمات السعدي للسباكة',
  city: 'Muscat',
  cityAr: 'مسقط',
  country: 'Oman',
  rating: 4.9,
  totalJobs: 142,
  activeRFQs: 3,
  activeJobs: 1,
  totalResources: 4,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: '#3B82F6',
    responded: '#F59E0B',
    negotiating: '#8B5CF6',
    accepted: '#10B981',
    rejected: '#EF4444',
    expired: '#9CA3AF',
    in_progress: '#F59E0B',
    pending_start: '#3B82F6',
    completed: '#10B981',
    cancelled: '#EF4444',
  };
  return colors[status] || '#9CA3AF';
}

export function getStatusLabel(status: string, lang: string): string {
  const labels: Record<string, { ar: string; en: string }> = {
    new:          { ar: 'جديد',            en: 'New' },
    responded:    { ar: 'تم الرد',          en: 'Responded' },
    negotiating:  { ar: 'قيد التفاوض',     en: 'In Negotiation' },
    accepted:     { ar: 'مقبول',            en: 'Accepted' },
    rejected:     { ar: 'مرفوض',            en: 'Rejected' },
    expired:      { ar: 'منتهي',            en: 'Expired' },
    in_progress:  { ar: 'قيد التنفيذ',     en: 'In Progress' },
    pending_start:{ ar: 'في انتظار البدء', en: 'Pending Start' },
    completed:    { ar: 'مكتمل',            en: 'Completed' },
    cancelled:    { ar: 'ملغي',             en: 'Cancelled' },
  };
  const label = labels[status];
  if (!label) return status;
  return lang === 'ar' ? label.ar : label.en;
}

export function formatOMR(amount: number, lang: string): string {
  const formatted = amount.toLocaleString('en-US');
  return lang === 'ar' ? `${formatted} ر.ع.` : `OMR ${formatted}`;
}

export function getLocalField(
  obj: Record<string, unknown>,
  field: string,
  lang: string
): string {
  if (lang === 'ar') {
    const arField = `${field}Ar`;
    if (obj[arField]) return obj[arField] as string;
  }
  return (obj[field] as string) || '';
}
