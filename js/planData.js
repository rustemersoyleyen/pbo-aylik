// PBO 2026-2027 Yıllık Planı ve Varsayılan Yapılandırma
const DEFAULT_SETTINGS = {
  schoolName: "KIRAÇ BİST MESLEKİ VE TEKNİK ANADOLU LİSESİ",
  fieldName: "Bilişim Teknolojileri",
  labName: "Donanım Laboratuarı",
  teacherName: "Rustem ERSÖYLEYEN",
  teacherTitle: "Atölye Şefi",
  principalName: "Serkan ERTEM",
  principalTitle: "Okul Müdürü",
  academicYear: "2026-2027",
  pboSchedule: [
    { day: 4, name: "Perşembe", hours: 4 },
    { day: 5, name: "Cuma", hours: 2 }
  ],
  dateFormat: "DD.MM.YYYY"
};

const ACADEMIC_CALENDAR = {
  startDate: "2026-09-14",
  endDate: "2027-06-25",
  months: [
    { name: "EYLÜL", year: 2026, month: 9 },
    { name: "EKİM", year: 2026, month: 10 },
    { name: "KASIM", year: 2026, month: 11 },
    { name: "ARALIK", year: 2026, month: 12 },
    { name: "OCAK", year: 2027, month: 1 },
    { name: "ŞUBAT", year: 2027, month: 2 },
    { name: "MART", year: 2027, month: 3 },
    { name: "NİSAN", year: 2027, month: 4 },
    { name: "MAYIS", year: 2027, month: 5 },
    { name: "HAZİRAN", year: 2027, month: 6 }
  ],
  holidays: [
    { date: "2026-10-29", name: "Cumhuriyet Bayramı" },
    { date: "2026-11-16", name: "1. Dönem Ara Tatil" },
    { date: "2026-11-17", name: "1. Dönem Ara Tatil" },
    { date: "2026-11-18", name: "1. Dönem Ara Tatil" },
    { date: "2026-11-19", name: "1. Dönem Ara Tatil" },
    { date: "2026-11-20", name: "1. Dönem Ara Tatil" },
    { date: "2027-01-01", name: "Yılbaşı Tatili" },
    { date: "2027-01-25", name: "Yarıyıl Tatili" },
    { date: "2027-01-26", name: "Yarıyıl Tatili" },
    { date: "2027-01-27", name: "Yarıyıl Tatili" },
    { date: "2027-01-28", name: "Yarıyıl Tatili" },
    { date: "2027-01-29", name: "Yarıyıl Tatili" },
    { date: "2027-02-01", name: "Yarıyıl Tatili" },
    { date: "2027-02-02", name: "Yarıyıl Tatili" },
    { date: "2027-02-03", name: "Yarıyıl Tatili" },
    { date: "2027-02-04", name: "Yarıyıl Tatili" },
    { date: "2027-02-05", name: "Yarıyıl Tatili" },
    { date: "2027-03-08", name: "2. Dönem Ara Tatil" },
    { date: "2027-03-09", name: "2. Dönem Ara Tatil" },
    { date: "2027-03-10", name: "2. Dönem Ara Tatil" },
    { date: "2027-03-11", name: "2. Dönem Ara Tatil" },
    { date: "2027-03-12", name: "2. Dönem Ara Tatil" },
    { date: "2027-04-23", name: "Ulusal Egemenlik ve Çocuk Bayramı" },
    { date: "2027-05-01", name: "Emek ve Dayanışma Günü" },
    { date: "2027-05-19", name: "Atatürk'ü Anma, Gençlik ve Spor Bayramı" }
  ]
};

const DEFAULT_ANNUAL_PLAN = [
  {
    "month": "EYLÜL",
    "week": 1,
    "hours": 6,
    "task": "Atölyenin temizlenmesi ve düzenlenmesi; arızalı/çalışmayan bilgisayarların ve eksik yazılımların tespit edilmesi",
    "isHoliday": false
  },
  {
    "month": "EYLÜL",
    "week": 2,
    "hours": 6,
    "task": "Atölyenin temizlenmesi ve düzenlenmesi; arızalı/çalışmayan bilgisayarların ve eksik yazılımların tespit edilmesi",
    "isHoliday": false
  },
  {
    "month": "EYLÜL",
    "week": 3,
    "hours": 6,
    "task": "Atölyedeki bilgisayarların donanım arızalarının giderilmesi",
    "isHoliday": false
  },
  {
    "month": "EKİM",
    "week": 1,
    "hours": 6,
    "task": "Bilgisayarların güncel güvenlik yazılımlarıyla taranması",
    "isHoliday": false
  },
  {
    "month": "EKİM",
    "week": 2,
    "hours": 6,
    "task": "Bilgisayarların güncel güvenlik yazılımlarıyla taranması",
    "isHoliday": false
  },
  {
    "month": "EKİM",
    "week": 3,
    "hours": 6,
    "task": "Atölyedeki bilgisayarların eksiklerinin giderilmesi",
    "isHoliday": false
  },
  {
    "month": "EKİM",
    "week": 4,
    "hours": 6,
    "task": "Atölyedeki bilgisayarların eksiklerinin giderilmesi",
    "isHoliday": false
  },
  {
    "month": "EKİM",
    "week": 5,
    "hours": 6,
    "task": "Atölyenin temizlenmesi ve düzenlenmesi",
    "isHoliday": false
  },
  {
    "month": "KASIM",
    "week": 1,
    "hours": 6,
    "task": "Laboratuvar eksikliklerinin giderilmesi",
    "isHoliday": false
  },
  {
    "month": "KASIM",
    "week": "Tatil",
    "hours": 0,
    "task": "16 - 20 Kasım 2026 Ara Tatil",
    "isHoliday": true
  },
  {
    "month": "KASIM",
    "week": 3,
    "hours": 6,
    "task": "Laboratuvar eksikliklerinin giderilmesi",
    "isHoliday": false
  },
  {
    "month": "KASIM",
    "week": 4,
    "hours": 6,
    "task": "Ağ bağlantılarının kontrol edilmesi ve internet ayarlarının yapılması",
    "isHoliday": false
  },
  {
    "month": "ARALIK",
    "week": 1,
    "hours": 6,
    "task": "Atölyenin temizlenmesi ve düzenlenmesi",
    "isHoliday": false
  },
  {
    "month": "ARALIK",
    "week": 2,
    "hours": 6,
    "task": "Atölye şef odasının düzenlenmesi ve kayıtların güncellenmesi",
    "isHoliday": false
  },
  {
    "month": "ARALIK",
    "week": 3,
    "hours": 6,
    "task": "Atölye şef odasının düzenlenmesi ve kayıtların güncellenmesi",
    "isHoliday": false
  },
  {
    "month": "ARALIK",
    "week": 4,
    "hours": 6,
    "task": "Atölyedeki bilgisayarların donanım arızalarının giderilmesi",
    "isHoliday": false
  },
  {
    "month": "ARALIK",
    "week": 5,
    "hours": 6,
    "task": "Atölyedeki bilgisayarların donanım arızalarının giderilmesi",
    "isHoliday": false
  },
  {
    "month": "OCAK",
    "week": 1,
    "hours": 6,
    "task": "Atölyedeki bilgisayarların donanım arızalarının giderilmesi",
    "isHoliday": false
  },
  {
    "month": "OCAK",
    "week": 2,
    "hours": 6,
    "task": "Atölyedeki bilgisayarların donanım arızalarının giderilmesi",
    "isHoliday": false
  },
  {
    "month": "ŞUBAT",
    "week": 1,
    "hours": 6,
    "task": "Atölyenin temizlenmesi ve düzenlenmesi",
    "isHoliday": false
  },
  {
    "month": "ŞUBAT",
    "week": 2,
    "hours": 6,
    "task": "Bilgisayarların güncel güvenlik yazılımlarıyla taranması",
    "isHoliday": false
  },
  {
    "month": "ŞUBAT",
    "week": 3,
    "hours": 6,
    "task": "Bilgisayarların güncel güvenlik yazılımlarıyla taranması",
    "isHoliday": false
  },
  {
    "month": "ŞUBAT",
    "week": 4,
    "hours": 6,
    "task": "Bilgisayarların güncel güvenlik yazılımlarıyla taranması",
    "isHoliday": false
  },
  {
    "month": "MART",
    "week": 1,
    "hours": 6,
    "task": "Bilgisayarların güncel güvenlik yazılımlarıyla taranması",
    "isHoliday": false
  },
  {
    "month": "MART",
    "week": 2,
    "hours": 6,
    "task": "Atölyedeki bilgisayarların yazılımlarının güncellenmesi",
    "isHoliday": false
  },
  {
    "month": "MART",
    "week": 3,
    "hours": 6,
    "task": "Atölyedeki bilgisayarların yazılımlarının güncellenmesi",
    "isHoliday": false
  },
  {
    "month": "MART",
    "week": 4,
    "hours": 6,
    "task": "Atölyedeki bilgisayarların yazılımlarının güncellenmesi",
    "isHoliday": false
  },
  {
    "month": "MART",
    "week": "Tatil",
    "hours": 0,
    "task": "08 - 12 Mart 2027 Ara Tatil",
    "isHoliday": true
  },
  {
    "month": "NİSAN",
    "week": 1,
    "hours": 6,
    "task": "Atölyenin temizlenmesi ve düzenlenmesi",
    "isHoliday": false
  },
  {
    "month": "NİSAN",
    "week": 2,
    "hours": 6,
    "task": "Atölyenin temizlenmesi ve düzenlenmesi; arızalı/çalışmayan bilgisayarların ve eksik yazılımların tespit edilmesi",
    "isHoliday": false
  },
  {
    "month": "NİSAN",
    "week": 3,
    "hours": null,
    "task": "Atölyenin temizlenmesi ve düzenlenmesi; arızalı/çalışmayan bilgisayarların ve eksik yazılımların tespit edilmesi",
    "isHoliday": false
  },
  {
    "month": "NİSAN",
    "week": 4,
    "hours": 6,
    "task": "Atölyenin temizlenmesi ve düzenlenmesi; arızalı/çalışmayan bilgisayarların ve eksik yazılımların tespit edilmesi",
    "isHoliday": false
  },
  {
    "month": "MAYIS",
    "week": 1,
    "hours": 6,
    "task": "Atölyenin temizlenmesi ve düzenlenmesi; arızalı/çalışmayan bilgisayarların ve eksik yazılımların tespit edilmesi",
    "isHoliday": false
  },
  {
    "month": "MAYIS",
    "week": 2,
    "hours": 6,
    "task": "Atölyedeki bilgisayarların yazılımlarının güncellenmesi",
    "isHoliday": false
  },
  {
    "month": "MAYIS",
    "week": 3,
    "hours": 6,
    "task": "Atölyedeki bilgisayarların yazılımlarının güncellenmesi",
    "isHoliday": false
  },
  {
    "month": "MAYIS",
    "week": 4,
    "hours": 6,
    "task": "Atölyedeki bilgisayarların yazılımlarının güncellenmesi",
    "isHoliday": false
  },
  {
    "month": "HAZİRAN",
    "week": 1,
    "hours": 6,
    "task": "Ağ bağlantılarının kontrol edilmesi ve internet ayarlarının yapılması",
    "isHoliday": false
  },
  {
    "month": "HAZİRAN",
    "week": 2,
    "hours": 6,
    "task": "Laboratuvar temizliği ve düzenlenmesi",
    "isHoliday": false
  },
  {
    "month": "HAZİRAN",
    "week": 3,
    "hours": 6,
    "task": "Laboratuvar temizliği ve düzenlenmesi",
    "isHoliday": false
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DEFAULT_SETTINGS, ACADEMIC_CALENDAR, DEFAULT_ANNUAL_PLAN };
}
