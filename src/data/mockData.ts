// ─── TypeScript Interfaces ───────────────────────────────────────────

export interface Advisor {
  id: string;
  name: string;
  title: string;
  certifications: string[];
  company: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface FamilyMember {
  name: string;
  relationship: string;
  age: number;
  occupation?: string;
}

export interface BankAccount {
  id: string;
  bank: string;
  type: '活存' | '定存' | '外幣帳戶';
  currency: string;
  balance: number;
}

export interface Investment {
  id: string;
  name: string;
  type: '股票' | '基金' | 'ETF' | '債券';
  cost: number;
  marketValue: number;
  units?: number;
}

export interface InsurancePolicy {
  id: string;
  company: string;
  policyName: string;
  type: '壽險' | '醫療險' | '意外險' | '儲蓄險' | '投資型保單' | '年金險';
  coverage: number;
  annualPremium: number;
  cashValue: number;
  startDate: string;
  endDate?: string;
}

export interface Loan {
  id: string;
  type: '房貸' | '信貸' | '車貸' | '學貸';
  lender: string;
  originalAmount: number;
  balance: number;
  rate: number;
  monthlyPayment: number;
  startDate: string;
  endDate: string;
}

export interface Income {
  id: string;
  source: string;
  type: '薪資' | '獎金' | '投資收益' | '租金' | '兼職' | '營業收入';
  frequency: '月' | '季' | '年' | '不定期';
  monthlyAmount: number;
}

export interface Expense {
  id: string;
  category: string;
  frequency: '月' | '季' | '年';
  monthlyAmount: number;
  essential: boolean;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: '高' | '中' | '低';
  category: '退休' | '子女教育' | '購屋' | '旅遊' | '緊急備用' | '創業' | '其他';
}

export interface Client {
  id: string;
  name: string;
  gender: '男' | '女';
  birthday: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  maritalStatus: '已婚' | '未婚' | '離婚';
  familyMembers: FamilyMember[];
  bankAccounts: BankAccount[];
  investments: Investment[];
  insurancePolicies: InsurancePolicy[];
  loans: Loan[];
  incomes: Income[];
  expenses: Expense[];
  goals: Goal[];
  lastUpdated: string;
  createdAt: string;
}

// ─── Advisor Data ────────────────────────────────────────────────────

export const advisor: Advisor = {
  id: 'adv-001',
  name: '王志明',
  title: 'CFP® 認證理財規劃顧問',
  certifications: ['CFP', 'RFC', 'RFA'],
  company: '明智財務顧問事務所',
  email: 'cmwang@wisefp.com.tw',
  phone: '02-2712-8899',
  avatar: '',
};

// ─── Clients Data ────────────────────────────────────────────────────

export const clients: Client[] = [
  // ── 1. 陳怡君 ──────────────────────────────────────────────────────
  {
    id: 'cli-001',
    name: '陳怡君',
    gender: '女',
    birthday: '1991-03-15',
    age: 35,
    phone: '0912-345-678',
    email: 'yijun.chen@email.com',
    address: '台北市信義區松仁路100號12樓',
    occupation: '科技業產品經理',
    maritalStatus: '已婚',
    familyMembers: [
      { name: '陳怡君', relationship: '本人', age: 35, occupation: '產品經理' },
      { name: '王大明', relationship: '配偶', age: 37, occupation: '軟體工程師' },
      { name: '王小安', relationship: '子女', age: 3 },
    ],
    bankAccounts: [
      { id: 'ba-001', bank: '中國信託', type: '活存', currency: 'TWD', balance: 350000 },
      { id: 'ba-002', bank: '台新銀行', type: '定存', currency: 'TWD', balance: 800000 },
      { id: 'ba-003', bank: '中國信託', type: '外幣帳戶', currency: 'USD', balance: 185000 },
    ],
    investments: [
      { id: 'inv-001', name: '台積電 (2330)', type: '股票', cost: 520000, marketValue: 680000, units: 1000 },
      { id: 'inv-002', name: '元大台灣50 (0050)', type: 'ETF', cost: 300000, marketValue: 365000, units: 2500 },
      { id: 'inv-003', name: '聯博全球高收益債基金', type: '基金', cost: 200000, marketValue: 215000 },
    ],
    insurancePolicies: [
      { id: 'ins-001', company: '國泰人壽', policyName: '好安心終身壽險', type: '壽險', coverage: 5000000, annualPremium: 42000, cashValue: 180000, startDate: '2018-06-01' },
      { id: 'ins-002', company: '富邦人壽', policyName: '醫療健康險', type: '醫療險', coverage: 3000000, annualPremium: 18000, cashValue: 0, startDate: '2019-01-15' },
      { id: 'ins-003', company: '南山人壽', policyName: '意外傷害險', type: '意外險', coverage: 2000000, annualPremium: 8500, cashValue: 0, startDate: '2020-03-01' },
    ],
    loans: [
      { id: 'loan-001', type: '房貸', lender: '中國信託', originalAmount: 12000000, balance: 9800000, rate: 2.06, monthlyPayment: 52000, startDate: '2021-09-01', endDate: '2051-09-01' },
    ],
    incomes: [
      { id: 'inc-001', source: '本人薪資', type: '薪資', frequency: '月', monthlyAmount: 85000 },
      { id: 'inc-002', source: '年終獎金', type: '獎金', frequency: '年', monthlyAmount: 14167 },
    ],
    expenses: [
      { id: 'exp-001', category: '房貸還款', frequency: '月', monthlyAmount: 52000, essential: true },
      { id: 'exp-002', category: '生活開銷', frequency: '月', monthlyAmount: 15000, essential: true },
      { id: 'exp-003', category: '餐飲', frequency: '月', monthlyAmount: 8000, essential: true },
      { id: 'exp-004', category: '交通', frequency: '月', monthlyAmount: 3000, essential: true },
      { id: 'exp-005', category: '保險費', frequency: '月', monthlyAmount: 5708, essential: true },
      { id: 'exp-006', category: '子女照顧', frequency: '月', monthlyAmount: 12000, essential: true },
      { id: 'exp-007', category: '娛樂休閒', frequency: '月', monthlyAmount: 5000, essential: false },
      { id: 'exp-008', category: '治裝購物', frequency: '月', monthlyAmount: 3000, essential: false },
    ],
    goals: [
      { id: 'goal-001', name: '子女教育基金', targetAmount: 3000000, currentAmount: 450000, targetDate: '2040-09-01', priority: '高', category: '子女教育' },
      { id: 'goal-002', name: '退休規劃', targetAmount: 20000000, currentAmount: 2595000, targetDate: '2051-03-15', priority: '高', category: '退休' },
      { id: 'goal-003', name: '家庭旅遊基金', targetAmount: 200000, currentAmount: 80000, targetDate: '2027-07-01', priority: '低', category: '旅遊' },
    ],
    lastUpdated: '2026-03-10',
    createdAt: '2024-08-15',
  },

  // ── 2. 林建宏 ──────────────────────────────────────────────────────
  {
    id: 'cli-002',
    name: '林建宏',
    gender: '男',
    birthday: '1984-07-22',
    age: 42,
    phone: '0923-456-789',
    email: 'jianhong.lin@email.com',
    address: '新北市板橋區文化路二段88號5樓',
    occupation: '餐飲業負責人',
    maritalStatus: '已婚',
    familyMembers: [
      { name: '林建宏', relationship: '本人', age: 42, occupation: '餐飲業負責人' },
      { name: '陳雅琪', relationship: '配偶', age: 39, occupation: '會計師' },
      { name: '林小翔', relationship: '子女', age: 12, occupation: '學生' },
      { name: '林小涵', relationship: '子女', age: 8, occupation: '學生' },
    ],
    bankAccounts: [
      { id: 'ba-004', bank: '台北富邦', type: '活存', currency: 'TWD', balance: 580000 },
      { id: 'ba-005', bank: '兆豐銀行', type: '定存', currency: 'TWD', balance: 2000000 },
      { id: 'ba-006', bank: '台北富邦', type: '外幣帳戶', currency: 'USD', balance: 320000 },
    ],
    investments: [
      { id: 'inv-004', name: '鴻海 (2317)', type: '股票', cost: 400000, marketValue: 520000, units: 3000 },
      { id: 'inv-005', name: '元大高股息 (0056)', type: 'ETF', cost: 600000, marketValue: 710000, units: 18000 },
      { id: 'inv-006', name: '貝萊德世界科技基金', type: '基金', cost: 500000, marketValue: 620000 },
      { id: 'inv-007', name: '國泰永續高股息 (00878)', type: 'ETF', cost: 350000, marketValue: 395000, units: 20000 },
    ],
    insurancePolicies: [
      { id: 'ins-004', company: '台灣人壽', policyName: '增額終身壽險', type: '壽險', coverage: 10000000, annualPremium: 85000, cashValue: 520000, startDate: '2015-03-01' },
      { id: 'ins-005', company: '國泰人壽', policyName: '新全意住院醫療', type: '醫療險', coverage: 5000000, annualPremium: 28000, cashValue: 0, startDate: '2016-06-01' },
      { id: 'ins-006', company: '富邦人壽', policyName: '鑫富利儲蓄險', type: '儲蓄險', coverage: 3000000, annualPremium: 120000, cashValue: 850000, startDate: '2018-01-01' },
      { id: 'ins-007', company: '南山人壽', policyName: '安心意外險', type: '意外險', coverage: 5000000, annualPremium: 12000, cashValue: 0, startDate: '2019-04-01' },
    ],
    loans: [
      { id: 'loan-002', type: '房貸', lender: '台北富邦', originalAmount: 18000000, balance: 12500000, rate: 2.12, monthlyPayment: 72000, startDate: '2018-03-01', endDate: '2048-03-01' },
      { id: 'loan-003', type: '信貸', lender: '兆豐銀行', originalAmount: 2000000, balance: 1200000, rate: 3.5, monthlyPayment: 35000, startDate: '2024-06-01', endDate: '2029-06-01' },
    ],
    incomes: [
      { id: 'inc-003', source: '餐廳營業收入', type: '營業收入', frequency: '月', monthlyAmount: 120000 },
      { id: 'inc-004', source: '配偶薪資', type: '薪資', frequency: '月', monthlyAmount: 75000 },
      { id: 'inc-005', source: '股利收入', type: '投資收益', frequency: '年', monthlyAmount: 6000 },
    ],
    expenses: [
      { id: 'exp-009', category: '房貸還款', frequency: '月', monthlyAmount: 72000, essential: true },
      { id: 'exp-010', category: '信貸還款', frequency: '月', monthlyAmount: 35000, essential: true },
      { id: 'exp-011', category: '生活開銷', frequency: '月', monthlyAmount: 20000, essential: true },
      { id: 'exp-012', category: '餐飲', frequency: '月', monthlyAmount: 12000, essential: true },
      { id: 'exp-013', category: '子女教育', frequency: '月', monthlyAmount: 18000, essential: true },
      { id: 'exp-014', category: '交通 / 車輛', frequency: '月', monthlyAmount: 8000, essential: true },
      { id: 'exp-015', category: '保險費', frequency: '月', monthlyAmount: 20417, essential: true },
      { id: 'exp-016', category: '娛樂旅遊', frequency: '月', monthlyAmount: 10000, essential: false },
    ],
    goals: [
      { id: 'goal-004', name: '長子大學教育基金', targetAmount: 2000000, currentAmount: 650000, targetDate: '2032-09-01', priority: '高', category: '子女教育' },
      { id: 'goal-005', name: '次女大學教育基金', targetAmount: 2000000, currentAmount: 280000, targetDate: '2036-09-01', priority: '高', category: '子女教育' },
      { id: 'goal-006', name: '退休規劃', targetAmount: 30000000, currentAmount: 6515000, targetDate: '2049-07-22', priority: '高', category: '退休' },
      { id: 'goal-007', name: '展店資金', targetAmount: 5000000, currentAmount: 1500000, targetDate: '2028-12-31', priority: '中', category: '創業' },
    ],
    lastUpdated: '2026-03-05',
    createdAt: '2023-11-20',
  },

  // ── 3. 張淑芬 ──────────────────────────────────────────────────────
  {
    id: 'cli-003',
    name: '張淑芬',
    gender: '女',
    birthday: '1971-11-08',
    age: 55,
    phone: '0934-567-890',
    email: 'shufen.zhang@email.com',
    address: '台中市西屯區台灣大道三段168號9樓',
    occupation: '公立學校教師',
    maritalStatus: '未婚',
    familyMembers: [
      { name: '張淑芬', relationship: '本人', age: 55, occupation: '教師' },
    ],
    bankAccounts: [
      { id: 'ba-007', bank: '第一銀行', type: '活存', currency: 'TWD', balance: 420000 },
      { id: 'ba-008', bank: '郵局', type: '定存', currency: 'TWD', balance: 3500000 },
      { id: 'ba-009', bank: '第一銀行', type: '外幣帳戶', currency: 'USD', balance: 250000 },
    ],
    investments: [
      { id: 'inv-008', name: '中華電信 (2412)', type: '股票', cost: 380000, marketValue: 420000, units: 3000 },
      { id: 'inv-009', name: '元大美債20年 (00679B)', type: 'ETF', cost: 800000, marketValue: 780000, units: 25000 },
      { id: 'inv-010', name: '安聯收益成長基金', type: '基金', cost: 600000, marketValue: 685000 },
      { id: 'inv-011', name: '美國公債', type: '債券', cost: 500000, marketValue: 515000 },
    ],
    insurancePolicies: [
      { id: 'ins-008', company: '國泰人壽', policyName: '終身壽險', type: '壽險', coverage: 3000000, annualPremium: 35000, cashValue: 950000, startDate: '2005-01-01' },
      { id: 'ins-009', company: '新光人壽', policyName: '長照安心險', type: '醫療險', coverage: 2000000, annualPremium: 32000, cashValue: 280000, startDate: '2018-07-01' },
      { id: 'ins-010', company: '台灣人壽', policyName: '利率變動年金', type: '年金險', coverage: 5000000, annualPremium: 100000, cashValue: 1200000, startDate: '2016-01-01' },
    ],
    loans: [],
    incomes: [
      { id: 'inc-006', source: '教師薪資', type: '薪資', frequency: '月', monthlyAmount: 95000 },
      { id: 'inc-007', source: '兼課鐘點費', type: '兼職', frequency: '月', monthlyAmount: 8000 },
      { id: 'inc-008', source: '股利與利息', type: '投資收益', frequency: '年', monthlyAmount: 5500 },
    ],
    expenses: [
      { id: 'exp-017', category: '房租', frequency: '月', monthlyAmount: 18000, essential: true },
      { id: 'exp-018', category: '生活開銷', frequency: '月', monthlyAmount: 12000, essential: true },
      { id: 'exp-019', category: '餐飲', frequency: '月', monthlyAmount: 8000, essential: true },
      { id: 'exp-020', category: '交通', frequency: '月', monthlyAmount: 3000, essential: true },
      { id: 'exp-021', category: '保險費', frequency: '月', monthlyAmount: 13917, essential: true },
      { id: 'exp-022', category: '進修學習', frequency: '月', monthlyAmount: 3000, essential: false },
      { id: 'exp-023', category: '休閒旅遊', frequency: '月', monthlyAmount: 5000, essential: false },
      { id: 'exp-024', category: '孝親費', frequency: '月', monthlyAmount: 10000, essential: true },
    ],
    goals: [
      { id: 'goal-008', name: '退休規劃（60歲）', targetAmount: 15000000, currentAmount: 9620000, targetDate: '2031-11-08', priority: '高', category: '退休' },
      { id: 'goal-009', name: '退休後旅遊基金', targetAmount: 2000000, currentAmount: 350000, targetDate: '2031-11-08', priority: '中', category: '旅遊' },
      { id: 'goal-010', name: '緊急備用金（6個月）', targetAmount: 500000, currentAmount: 420000, targetDate: '2026-12-31', priority: '高', category: '緊急備用' },
    ],
    lastUpdated: '2026-02-18',
    createdAt: '2024-01-10',
  },

  // ── 4. 黃家豪 ──────────────────────────────────────────────────────
  {
    id: 'cli-004',
    name: '黃家豪',
    gender: '男',
    birthday: '1998-05-20',
    age: 28,
    phone: '0945-678-901',
    email: 'jiahao.huang@email.com',
    address: '台北市大安區復興南路一段200號3樓',
    occupation: '軟體工程師',
    maritalStatus: '未婚',
    familyMembers: [
      { name: '黃家豪', relationship: '本人', age: 28, occupation: '軟體工程師' },
    ],
    bankAccounts: [
      { id: 'ba-010', bank: '台新銀行', type: '活存', currency: 'TWD', balance: 180000 },
      { id: 'ba-011', bank: '國泰世華', type: '定存', currency: 'TWD', balance: 300000 },
    ],
    investments: [
      { id: 'inv-012', name: '元大台灣50 (0050)', type: 'ETF', cost: 150000, marketValue: 178000, units: 1200 },
      { id: 'inv-013', name: '富邦NASDAQ (00662)', type: 'ETF', cost: 100000, marketValue: 135000, units: 2000 },
    ],
    insurancePolicies: [
      { id: 'ins-011', company: '富邦人壽', policyName: '青年定期壽險', type: '壽險', coverage: 2000000, annualPremium: 8000, cashValue: 0, startDate: '2023-06-01', endDate: '2043-06-01' },
      { id: 'ins-012', company: '國泰人壽', policyName: '實支實付醫療險', type: '醫療險', coverage: 1500000, annualPremium: 12000, cashValue: 0, startDate: '2023-06-01' },
    ],
    loans: [
      { id: 'loan-004', type: '學貸', lender: '台灣銀行', originalAmount: 600000, balance: 380000, rate: 1.15, monthlyPayment: 5500, startDate: '2022-08-01', endDate: '2030-08-01' },
    ],
    incomes: [
      { id: 'inc-009', source: '軟體工程師薪資', type: '薪資', frequency: '月', monthlyAmount: 55000 },
      { id: 'inc-010', source: '接案收入', type: '兼職', frequency: '不定期', monthlyAmount: 8000 },
    ],
    expenses: [
      { id: 'exp-025', category: '房租', frequency: '月', monthlyAmount: 12000, essential: true },
      { id: 'exp-026', category: '生活開銷', frequency: '月', monthlyAmount: 8000, essential: true },
      { id: 'exp-027', category: '餐飲', frequency: '月', monthlyAmount: 8000, essential: true },
      { id: 'exp-028', category: '交通', frequency: '月', monthlyAmount: 2000, essential: true },
      { id: 'exp-029', category: '學貸還款', frequency: '月', monthlyAmount: 5500, essential: true },
      { id: 'exp-030', category: '保險費', frequency: '月', monthlyAmount: 1667, essential: true },
      { id: 'exp-031', category: '娛樂社交', frequency: '月', monthlyAmount: 5000, essential: false },
      { id: 'exp-032', category: '線上課程', frequency: '月', monthlyAmount: 2000, essential: false },
    ],
    goals: [
      { id: 'goal-011', name: '緊急備用金（6個月）', targetAmount: 330000, currentAmount: 180000, targetDate: '2027-06-01', priority: '高', category: '緊急備用' },
      { id: 'goal-012', name: '買房頭期款', targetAmount: 3000000, currentAmount: 480000, targetDate: '2033-12-31', priority: '中', category: '購屋' },
      { id: 'goal-013', name: '退休規劃', targetAmount: 25000000, currentAmount: 793000, targetDate: '2063-05-20', priority: '低', category: '退休' },
    ],
    lastUpdated: '2026-03-15',
    createdAt: '2025-09-01',
  },

  // ── 5. 李美玲 ──────────────────────────────────────────────────────
  {
    id: 'cli-005',
    name: '李美玲',
    gender: '女',
    birthday: '1981-01-12',
    age: 45,
    phone: '0956-789-012',
    email: 'meiling.li@email.com',
    address: '高雄市前鎮區中華五路789號15樓',
    occupation: '護理師',
    maritalStatus: '離婚',
    familyMembers: [
      { name: '李美玲', relationship: '本人', age: 45, occupation: '護理師' },
      { name: '李小晴', relationship: '子女', age: 14, occupation: '學生' },
    ],
    bankAccounts: [
      { id: 'ba-012', bank: '高雄銀行', type: '活存', currency: 'TWD', balance: 210000 },
      { id: 'ba-013', bank: '合作金庫', type: '定存', currency: 'TWD', balance: 1200000 },
    ],
    investments: [
      { id: 'inv-014', name: '元大高股息 (0056)', type: 'ETF', cost: 250000, marketValue: 298000, units: 8000 },
      { id: 'inv-015', name: '國泰永續高股息 (00878)', type: 'ETF', cost: 180000, marketValue: 205000, units: 10000 },
      { id: 'inv-016', name: '復華台灣科技優息 (00929)', type: 'ETF', cost: 120000, marketValue: 138000, units: 8000 },
    ],
    insurancePolicies: [
      { id: 'ins-013', company: '新光人壽', policyName: '終身壽險', type: '壽險', coverage: 3000000, annualPremium: 28000, cashValue: 380000, startDate: '2010-04-01' },
      { id: 'ins-014', company: '台灣人壽', policyName: '手術醫療險', type: '醫療險', coverage: 2000000, annualPremium: 22000, cashValue: 0, startDate: '2015-01-01' },
      { id: 'ins-015', company: '國泰人壽', policyName: '子女教育儲蓄險', type: '儲蓄險', coverage: 1000000, annualPremium: 48000, cashValue: 420000, startDate: '2016-09-01' },
    ],
    loans: [
      { id: 'loan-005', type: '房貸', lender: '合作金庫', originalAmount: 8000000, balance: 5200000, rate: 2.18, monthlyPayment: 38000, startDate: '2019-11-01', endDate: '2049-11-01' },
    ],
    incomes: [
      { id: 'inc-011', source: '護理師薪資', type: '薪資', frequency: '月', monthlyAmount: 58000 },
      { id: 'inc-012', source: '值班加給', type: '薪資', frequency: '月', monthlyAmount: 12000 },
      { id: 'inc-013', source: '贍養費', type: '兼職', frequency: '月', monthlyAmount: 8000 },
    ],
    expenses: [
      { id: 'exp-033', category: '房貸還款', frequency: '月', monthlyAmount: 38000, essential: true },
      { id: 'exp-034', category: '生活開銷', frequency: '月', monthlyAmount: 10000, essential: true },
      { id: 'exp-035', category: '餐飲', frequency: '月', monthlyAmount: 8000, essential: true },
      { id: 'exp-036', category: '交通', frequency: '月', monthlyAmount: 3000, essential: true },
      { id: 'exp-037', category: '子女教育', frequency: '月', monthlyAmount: 8000, essential: true },
      { id: 'exp-038', category: '保險費', frequency: '月', monthlyAmount: 8167, essential: true },
      { id: 'exp-039', category: '娛樂休閒', frequency: '月', monthlyAmount: 3000, essential: false },
    ],
    goals: [
      { id: 'goal-014', name: '女兒大學教育基金', targetAmount: 1500000, currentAmount: 620000, targetDate: '2030-09-01', priority: '高', category: '子女教育' },
      { id: 'goal-015', name: '退休規劃', targetAmount: 12000000, currentAmount: 3471000, targetDate: '2046-01-12', priority: '高', category: '退休' },
      { id: 'goal-016', name: '緊急備用金', targetAmount: 480000, currentAmount: 210000, targetDate: '2027-12-31', priority: '中', category: '緊急備用' },
    ],
    lastUpdated: '2026-01-22',
    createdAt: '2024-05-08',
  },
];

// ─── Helper functions ────────────────────────────────────────────────

export function getClientById(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

export function formatCurrency(amount: number): string {
  return `NT$ ${amount.toLocaleString('zh-TW')}`;
}

export function getTotalAssets(client: Client): number {
  const bankTotal = client.bankAccounts.reduce((s, a) => s + a.balance, 0);
  const investTotal = client.investments.reduce((s, i) => s + i.marketValue, 0);
  const insuranceCash = client.insurancePolicies.reduce((s, p) => s + p.cashValue, 0);
  return bankTotal + investTotal + insuranceCash;
}

export function getTotalLiabilities(client: Client): number {
  return client.loans.reduce((s, l) => s + l.balance, 0);
}

export function getNetWorth(client: Client): number {
  return getTotalAssets(client) - getTotalLiabilities(client);
}

export function getTotalMonthlyIncome(client: Client): number {
  return client.incomes.reduce((s, i) => s + i.monthlyAmount, 0);
}

export function getTotalMonthlyExpense(client: Client): number {
  return client.expenses.reduce((s, e) => s + e.monthlyAmount, 0);
}
