/**
 * PBO Aylık Rapor - Rapor Oluşturma ve Takvim Motoru
 */

const ReportGenerator = {
  /**
   * Tarihi DD.MM.YYYY veya D/M/YYYY formatına çevirir
   */
  formatDate(dateObj, format = "DD.MM.YYYY") {
    const d = dateObj.getDate();
    const m = dateObj.getMonth() + 1;
    const y = dateObj.getFullYear();

    const dd = String(d).padStart(2, "0");
    const mm = String(m).padStart(2, "0");

    if (format === "D/M/YYYY") {
      return `${d}/${m}/${y}`;
    } else if (format === "DD/MM/YYYY") {
      return `${dd}/${mm}/${y}`;
    } else if (format === "D.MM.YYYY") {
      return `${d}.${mm}.${y}`;
    }
    return `${dd}.${mm}.${y}`;
  },

  /**
   * Ayın son iş gününü veya son gününü bulur (İmza tarihi için)
   */
  getLastWorkingDayOfMonth(year, month) {
    // month: 1..12
    const lastDay = new Date(year, month, 0); // O ayın son günü
    let d = lastDay.getDate();
    let cur = new Date(year, month - 1, d);

    // Hafta sonuna geliyorsa Cuma'ya çek
    while (cur.getDay() === 0 || cur.getDay() === 6) {
      d--;
      cur = new Date(year, month - 1, d);
    }

    const dd = String(cur.getDate()).padStart(2, "0");
    const mm = String(cur.getMonth() + 1).padStart(2, "0");
    const yyyy = cur.getFullYear();

    return `${dd} / ${mm} / ${yyyy}`;
  },

  /**
   * Seçilen ay için resmi PBO rapor satırlarını üretir
   * @param {string} monthName - "EYLÜL", "EKİM", vb.
   * @param {object} settings - Kullanıcı ayarları
   * @param {Array} annualPlan - Yıllık plan maddeleri
   * @param {object} calendar - Akademik takvim & tatiller
   */
  generate(monthName, settings, annualPlan, calendar) {
    const monthConfig = calendar.months.find(m => m.name.toUpperCase() === monthName.toUpperCase());
    if (!monthConfig) {
      throw new Error(`Ay bulunamadı: ${monthName}`);
    }

    const year = monthConfig.year;
    const monthIndex = monthConfig.month - 1; // 0-based for Date

    const parseLocalDate = (dateStr) => {
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d, 0, 0, 0, 0);
    };

    const startDate = parseLocalDate(calendar.startDate);
    const endDate = parseLocalDate(calendar.endDate);

    // Tatil tarihlerini Set olarak topla (YYYY-MM-DD)
    const holidaySet = new Set((calendar.holidays || []).map(h => h.date));

    // PBO programındaki günleri al (JS getDay(): 0=Paz, 1=Pzt, 2=Sal, 3=Çar, 4=Per, 5=Cum, 6=Cmt)
    const schedule = settings.pboSchedule || [];
    const scheduleMap = new Map();
    schedule.forEach(item => {
      scheduleMap.set(Number(item.day), Number(item.hours));
    });

    // O ayın yıllık planındaki işleri filtrele (Tatil olmayanlar)
    const monthPlanItems = (annualPlan || []).filter(item => 
      item.month && item.month.toUpperCase() === monthName.toUpperCase() && !item.isHoliday && item.task
    );

    // Ayın tüm günlerini tara
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const matchedDays = [];

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const curDate = new Date(year, monthIndex, dayNum);
      const curDateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;

      // Okul sınırları içinde mi?
      if (curDate < startDate || curDate > endDate) {
        continue;
      }

      // Tatil mi? (Resmi tatil veya ara tatil)
      if (holidaySet.has(curDateStr)) {
        continue;
      }

      const dayOfWeek = curDate.getDay();
      if (scheduleMap.has(dayOfWeek)) {
        const hours = scheduleMap.get(dayOfWeek);
        matchedDays.push({
          date: curDate,
          dateStr: curDateStr,
          dayOfWeek: dayOfWeek,
          hours: hours
        });
      }
    }

    // Eşleşen günleri takvim haftalarına göre grupla
    // Her hafta Pazartesi ile başlar
    const weekGroups = [];
    let currentWeekId = null;
    let currentGroup = [];

    matchedDays.forEach(dayItem => {
      // O günün ait olduğu Pazartesi tarihini bul
      const d = new Date(dayItem.date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Pazartesi
      const monday = new Date(d.setDate(diff));
      const mondayStr = monday.toISOString().split("T")[0];

      if (mondayStr !== currentWeekId) {
        if (currentGroup.length > 0) {
          weekGroups.push(currentGroup);
        }
        currentGroup = [];
        currentWeekId = mondayStr;
      }
      currentGroup.push(dayItem);
    });
    if (currentGroup.length > 0) {
      weekGroups.push(currentGroup);
    }

    // Her haftaya yıllık plandaki sıradaki görevi ata
    const reportRows = [];
    let totalHours = 0;

    weekGroups.forEach((group, index) => {
      // Plandaki ilgili hafta görevini bul
      const planItem = monthPlanItems[index] || monthPlanItems[monthPlanItems.length - 1] || {
        task: "Atölye bakım ve onarım çalışmalarının yürütülmesi"
      };

      const taskPlanned = planItem.task;
      const explanation = TaskConverter.toCompleted(taskPlanned);

      group.forEach(dayItem => {
        totalHours += dayItem.hours;
        reportRows.push({
          dateFormatted: this.formatDate(dayItem.date, settings.dateFormat || "D/M/YYYY"),
          hoursText: `${dayItem.hours} Saat`,
          hours: dayItem.hours,
          task: taskPlanned,
          explanation: explanation,
          rawDate: dayItem.dateStr
        });
      });
    });

    // Rapor imza tarihi: Ayın son iş günü
    const reportDate = this.getLastWorkingDayOfMonth(year, monthIndex + 1);

    // Tabloyu resmi form gibi doldurmak için boş satırlar ekle (en az 10 satır)
    const targetRowCount = Math.max(10, reportRows.length);
    const paddedRows = [...reportRows];
    while (paddedRows.length < targetRowCount) {
      paddedRows.push({
        dateFormatted: "",
        hoursText: "",
        hours: 0,
        task: "",
        explanation: "",
        isEmpty: true
      });
    }

    return {
      monthName: monthName.toUpperCase(),
      academicYear: settings.academicYear || `${year}-${year + 1}`,
      reportDate: reportDate,
      totalHours: totalHours,
      activeRowCount: reportRows.length,
      rows: paddedRows,
      activeRows: reportRows,
      settings: settings
    };
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = ReportGenerator;
}
