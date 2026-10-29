/**
 * PBO Aylık Rapor - Ana Uygulama Mantığı (app.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==================== STATE YÖNETİMİ ====================
  const STORAGE_KEYS = {
    SETTINGS: "pbo_app_settings",
    PLAN: "pbo_app_annual_plan"
  };

  const DAYS_OF_WEEK = [
    { id: 1, name: "Pazartesi" },
    { id: 2, name: "Salı" },
    { id: 3, name: "Çarşamba" },
    { id: 4, name: "Perşembe" },
    { id: 5, name: "Cuma" }
  ];

  let settings = loadSettings();
  let annualPlan = loadAnnualPlan();
  let currentMonth = "EYLÜL";
  let currentReport = null;
  let isEditMode = false;

  // ==================== ELEMENT REFERANSLARI ====================
  const navTabs = document.querySelectorAll(".nav-tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  const monthChipsContainer = document.getElementById("monthChips");
  const reportTableBody = document.getElementById("reportTableBody");
  const editHint = document.getElementById("editHint");

  const btnPrint = document.getElementById("btnPrint");
  const btnWord = document.getElementById("btnWord");
  const btnExcel = document.getElementById("btnExcel");
  const btnToggleEdit = document.getElementById("btnToggleEdit");

  // Ayarlar Formu
  const inputSchoolName = document.getElementById("inputSchoolName");
  const inputFieldName = document.getElementById("inputFieldName");
  const inputLabName = document.getElementById("inputLabName");
  const inputTeacherName = document.getElementById("inputTeacherName");
  const inputPrincipalName = document.getElementById("inputPrincipalName");
  const inputAcademicYear = document.getElementById("inputAcademicYear");
  const selectDateFormat = document.getElementById("selectDateFormat");
  const scheduleListContainer = document.getElementById("scheduleListContainer");
  const btnAddScheduleDay = document.getElementById("btnAddScheduleDay");
  const btnSaveSettings = document.getElementById("btnSaveSettings");
  const btnResetSettings = document.getElementById("btnResetSettings");
  const lblWeeklyTotalHours = document.getElementById("lblWeeklyTotalHours");

  // Yıllık Plan
  const planTableBody = document.getElementById("planTableBody");
  const excelFileInput = document.getElementById("excelFileInput");
  const btnResetPlan = document.getElementById("btnResetPlan");

  // Toast
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  const toastIcon = document.getElementById("toastIcon");

  // ==================== BAŞLATMA ====================
  initMonthChips();
  initSettingsForm();
  renderReport();
  renderPlanTable();
  setupEventListeners();

  // ==================== FONKSİYONLAR ====================

  /**
   * Ayarları localStorage'dan yükler veya varsayılanı döner
   */
  function loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn("Ayarlar yüklenemedi:", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }

  /**
   * Yıllık planı localStorage'dan yükler veya varsayılanı döner
   */
  function loadAnnualPlan() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PLAN);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Yıllık plan yüklenemedi:", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_ANNUAL_PLAN));
  }

  /**
   * Ay seçim butonlarını (chips) oluşturur
   */
  function initMonthChips() {
    monthChipsContainer.innerHTML = "";
    ACADEMIC_CALENDAR.months.forEach(m => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `month-chip ${m.name === currentMonth ? "active" : ""}`;
      chip.textContent = m.name;
      chip.dataset.month = m.name;

      chip.addEventListener("click", () => {
        currentMonth = m.name;
        document.querySelectorAll(".month-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        renderReport();
      });

      monthChipsContainer.appendChild(chip);
    });
  }

  /**
   * Raporu üretir ve A4 kağıt üzerine çizer
   */
  function renderReport() {
    try {
      currentReport = ReportGenerator.generate(
        currentMonth,
        settings,
        annualPlan,
        ACADEMIC_CALENDAR
      );
    } catch (err) {
      console.error("Rapor oluşturma hatası:", err);
      showToast("Rapor oluşturulurken hata: " + err.message, "❌");
      return;
    }

    // Üst Bilgiler
    document.getElementById("lblSchoolName").textContent = (settings.schoolName || "OKUL ADI").toUpperCase();
    document.getElementById("lblFieldName").textContent = settings.fieldName || "";
    document.getElementById("lblTeacherName").textContent = settings.teacherName || "";
    document.getElementById("lblAcademicYear").textContent = settings.academicYear || "2026-2027";
    document.getElementById("lblMonthName").textContent = currentReport.monthName;
    document.getElementById("lblMonthStatement").textContent = currentReport.monthName;

    // İmzalar
    document.getElementById("lblReportDate").textContent = currentReport.reportDate;
    document.getElementById("lblTeacherSign").textContent = settings.teacherName || "";
    document.getElementById("lblLabSign").textContent = `${settings.labName || ""} ${settings.teacherTitle || "Atölye Şefi"}`;

    const principalYear = currentReport.reportDate ? currentReport.reportDate.split("/").pop().trim() : "2026";
    document.getElementById("lblPrincipalDate").textContent = `.... / .... / ${principalYear}`;
    document.getElementById("lblPrincipalSign").textContent = settings.principalName || "";
    document.getElementById("lblPrincipalTitle").textContent = settings.principalTitle || "Okul Müdürü";

    // Tablo Satırları
    renderTableRows();
  }

  /**
   * Tablo satırlarını render eder (Normal veya Düzenlenebilir)
   */
  function renderTableRows() {
    reportTableBody.innerHTML = "";

    currentReport.rows.forEach((row, index) => {
      const tr = document.createElement("tr");
      if (row.isEmpty) {
        tr.className = "empty-row";
      }

      if (isEditMode && !row.isEmpty) {
        // Düzenlenebilir Satır
        tr.innerHTML = `
          <td class="col-date">
            <input type="text" class="form-control" style="padding: 2px 4px; font-size: 8.5pt; text-align: center;" value="${escapeHtml(row.dateFormatted)}" data-field="dateFormatted" data-index="${index}">
          </td>
          <td class="col-hours">
            <input type="text" class="form-control" style="padding: 2px 4px; font-size: 8.5pt; text-align: center;" value="${escapeHtml(row.hoursText)}" data-field="hoursText" data-index="${index}">
          </td>
          <td class="col-task">
            <textarea class="form-control" style="padding: 3px 4px; font-size: 8.5pt; resize: vertical; min-height: 48px;" data-field="task" data-index="${index}">${escapeHtml(row.task)}</textarea>
          </td>
          <td class="col-explanation">
            <textarea class="form-control" style="padding: 3px 4px; font-size: 8.5pt; resize: vertical; min-height: 48px;" data-field="explanation" data-index="${index}">${escapeHtml(row.explanation)}</textarea>
          </td>
        `;
      } else {
        // Normal Önizleme / Baskı Satırı
        tr.innerHTML = `
          <td class="col-date">${escapeHtml(row.dateFormatted)}</td>
          <td class="col-hours">${escapeHtml(row.hoursText)}</td>
          <td class="col-task">${escapeHtml(row.task)}</td>
          <td class="col-explanation">${escapeHtml(row.explanation)}</td>
        `;
      }

      reportTableBody.appendChild(tr);
    });

    if (isEditMode) {
      // Satır içi input dinleyicileri
      reportTableBody.querySelectorAll("input, textarea").forEach(input => {
        input.addEventListener("input", (e) => {
          const idx = Number(e.target.dataset.index);
          const field = e.target.dataset.field;
          if (currentReport.rows[idx]) {
            currentReport.rows[idx][field] = e.target.value;
          }
        });
      });
    }
  }

  /**
   * Ayarlar formunu doldurur
   */
  function initSettingsForm() {
    inputSchoolName.value = settings.schoolName || "";
    inputFieldName.value = settings.fieldName || "";
    inputLabName.value = settings.labName || "";
    inputTeacherName.value = settings.teacherName || "";
    inputPrincipalName.value = settings.principalName || "";
    inputAcademicYear.value = settings.academicYear || "2026-2027";
    selectDateFormat.value = settings.dateFormat || "D/M/YYYY";

    renderScheduleList();
  }

  /**
   * PBO gün ve saat listesini çizer
   */
  function renderScheduleList() {
    scheduleListContainer.innerHTML = "";
    let total = 0;

    (settings.pboSchedule || []).forEach((item, index) => {
      total += Number(item.hours) || 0;

      const div = document.createElement("div");
      div.className = "schedule-item";

      const daySelect = document.createElement("select");
      DAYS_OF_WEEK.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = d.name;
        if (d.id === Number(item.day)) {
          opt.selected = true;
        }
        daySelect.appendChild(opt);
      });

      const hoursInput = document.createElement("input");
      hoursInput.type = "number";
      hoursInput.min = "1";
      hoursInput.max = "10";
      hoursInput.value = item.hours;
      hoursInput.style.width = "80px";
      hoursInput.title = "Kaç Saat";

      const hoursLabel = document.createElement("span");
      hoursLabel.textContent = "Saat";
      hoursLabel.style.fontSize = "0.85rem";
      hoursLabel.style.color = "var(--gray-600)";

      const btnRemove = document.createElement("button");
      btnRemove.type = "button";
      btnRemove.className = "btn-remove";
      btnRemove.innerHTML = "🗑️ Sil";
      btnRemove.title = "Günü Kaldır";

      daySelect.addEventListener("change", () => {
        item.day = Number(daySelect.value);
        item.name = daySelect.options[daySelect.selectedIndex].text;
        updateWeeklyTotal();
      });

      hoursInput.addEventListener("input", () => {
        item.hours = Number(hoursInput.value) || 0;
        updateWeeklyTotal();
      });

      btnRemove.addEventListener("click", () => {
        settings.pboSchedule.splice(index, 1);
        renderScheduleList();
      });

      div.appendChild(daySelect);
      div.appendChild(hoursInput);
      div.appendChild(hoursLabel);
      div.appendChild(btnRemove);
      scheduleListContainer.appendChild(div);
    });

    lblWeeklyTotalHours.textContent = `Haftalık: ${total} Saat`;
  }

  function updateWeeklyTotal() {
    let total = 0;
    (settings.pboSchedule || []).forEach(item => {
      total += Number(item.hours) || 0;
    });
    lblWeeklyTotalHours.textContent = `Haftalık: ${total} Saat`;
  }

  /**
   * Yıllık Plan Tablosunu doldurur
   */
  function renderPlanTable() {
    planTableBody.innerHTML = "";
    (annualPlan || []).forEach(item => {
      const tr = document.createElement("tr");
      if (item.isHoliday) {
        tr.style.backgroundColor = "#fef3c7";
      }

      const explanation = item.isHoliday ? "-" : TaskConverter.toCompleted(item.task);

      tr.innerHTML = `
        <td style="font-weight: 600;">${escapeHtml(item.month || "")}</td>
        <td>${escapeHtml(String(item.week || ""))}</td>
        <td>${item.hours ? item.hours + " Saat" : "-"}</td>
        <td>${escapeHtml(item.task || "")}</td>
        <td style="color: var(--gray-700);">${escapeHtml(explanation)}</td>
      `;
      planTableBody.appendChild(tr);
    });
  }

  /**
   * Bildirim (Toast) gösterir
   */
  function showToast(message, icon = "✅") {
    toastMsg.textContent = message;
    toastIcon.textContent = icon;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  function escapeHtml(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ==================== EVENT LISTENERS ====================
  function setupEventListeners() {
    // Sekme Değişimi
    navTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        navTabs.forEach(t => t.classList.remove("active"));
        tabPanes.forEach(p => p.classList.remove("active"));

        tab.classList.add("active");
        const targetId = tab.dataset.tab;
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add("active");
        }
      });
    });

    // Yazdır / PDF
    btnPrint.addEventListener("click", () => {
      if (isEditMode) {
        isEditMode = false;
        btnToggleEdit.innerHTML = "<span>✏️</span> Düzenle";
        btnToggleEdit.classList.remove("btn-primary");
        btnToggleEdit.classList.add("btn-secondary");
        editHint.style.display = "none";
        renderTableRows();
      }
      window.print();
    });

    // Word İndir
    btnWord.addEventListener("click", async () => {
      try {
        await ExportDocx.export(currentReport);
        showToast("Word (.docx) belgesi hazırlandı ve indirildi.");
      } catch (err) {
        console.error("Word dışa aktarma hatası:", err);
        showToast("Word dışa aktarılamadı: " + err.message, "❌");
      }
    });

    // Excel İndir
    btnExcel.addEventListener("click", () => {
      try {
        ExportXlsx.export(currentReport);
        showToast("Excel (.xlsx) tablosu hazırlandı ve indirildi.");
      } catch (err) {
        console.error("Excel dışa aktarma hatası:", err);
        showToast("Excel dışa aktarılamadı: " + err.message, "❌");
      }
    });

    // Düzenleme Modu Aç/Kapat
    btnToggleEdit.addEventListener("click", () => {
      isEditMode = !isEditMode;
      if (isEditMode) {
        btnToggleEdit.innerHTML = "<span>💾</span> Önizlemeye Dön";
        btnToggleEdit.classList.remove("btn-secondary");
        btnToggleEdit.classList.add("btn-primary");
        editHint.style.display = "inline";
      } else {
        btnToggleEdit.innerHTML = "<span>✏️</span> Düzenle";
        btnToggleEdit.classList.remove("btn-primary");
        btnToggleEdit.classList.add("btn-secondary");
        editHint.style.display = "none";
      }
      renderTableRows();
    });

    // Yeni Gün Ekle
    btnAddScheduleDay.addEventListener("click", () => {
      if (!settings.pboSchedule) settings.pboSchedule = [];
      settings.pboSchedule.push({
        day: 4,
        name: "Perşembe",
        hours: 4
      });
      renderScheduleList();
    });

    // Ayarları Kaydet
    btnSaveSettings.addEventListener("click", () => {
      settings.schoolName = inputSchoolName.value.trim();
      settings.fieldName = inputFieldName.value.trim();
      settings.labName = inputLabName.value.trim();
      settings.teacherName = inputTeacherName.value.trim();
      settings.principalName = inputPrincipalName.value.trim();
      settings.academicYear = inputAcademicYear.value.trim();
      settings.dateFormat = selectDateFormat.value;

      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      showToast("Ayarlar başarıyla kaydedildi!");
      renderReport();
    });

    // Ayarları Sıfırla
    btnResetSettings.addEventListener("click", () => {
      if (confirm("Tüm ayarları varsayılan değerlere sıfırlamak istediğinize emin misiniz?")) {
        settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        initSettingsForm();
        renderReport();
        showToast("Ayarlar varsayılana sıfırlandı.");
      }
    });

    // Yıllık Planı Sıfırla
    btnResetPlan.addEventListener("click", () => {
      if (confirm("Yıllık planı orijinal 2026-2027 planına sıfırlamak istiyor musunuz?")) {
        annualPlan = JSON.parse(JSON.stringify(DEFAULT_ANNUAL_PLAN));
        localStorage.removeItem(STORAGE_KEYS.PLAN);
        renderPlanTable();
        renderReport();
        showToast("Yıllık plan orijinal haline döndürüldü.");
      }
    });

    // Başka Excel Dosyası Yükleme
    excelFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = window.XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          const rawRows = window.XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Satırları tara ve plan maddelerini çıkar
          const newPlan = [];
          let currentM = null;

          for (let r = 0; r < rawRows.length; r++) {
            const row = rawRows[r] || [];
            const colA = row[0];
            const colB = row[1];
            const colC = row[2];
            const colD = row[3];

            if (colA && typeof colA === "string" && ["EYLÜL", "EKİM", "KASIM", "ARALIK", "OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN"].includes(colA.trim().toUpperCase())) {
              currentM = colA.trim().toUpperCase();
            }

            if (colD && typeof colD === "string" && !colD.includes("YAPILACAK")) {
              const isHol = colD.includes("Tatil") || (colB && String(colB).includes("Tatil"));
              newPlan.push({
                month: currentM,
                week: isHol ? "Tatil" : (colB || ""),
                hours: isHol ? 0 : (Number(colC) || 6),
                task: colD.trim(),
                isHoliday: isHol
              });
            }
          }

          if (newPlan.length > 0) {
            annualPlan = newPlan;
            localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(annualPlan));
            renderPlanTable();
            renderReport();
            showToast(`${newPlan.length} satırlık yeni yıllık plan başarıyla yüklendi!`);
          } else {
            showToast("Excel dosyasında uygun sütun düzeni bulunamadı.", "❌");
          }
        } catch (err) {
          console.error("Excel yükleme hatası:", err);
          showToast("Excel dosyası okunamadı: " + err.message, "❌");
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }
});
