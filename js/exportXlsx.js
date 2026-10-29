/**
 * PBO Aylık Rapor - Excel (.xlsx) Dışa Aktarma Modülü
 */

const ExportXlsx = {
  /**
   * Rapor verilerini formatlı bir Excel tablosu olarak oluşturur ve indirir
   * @param {object} report 
   */
  export(report) {
    if (!window.XLSX) {
      alert("Excel kütüphanesi yüklenemedi!");
      return;
    }

    const s = report.settings;
    const yearStr = report.academicYear || "2026-2027";

    const wsData = [
      [(s.schoolName || "OKUL ADI").toUpperCase()],
      ["PLANLAMA BAKIM ONARIM ÇALIŞMA RAPORU"],
      [],
      [`Alan Adı : ${s.fieldName || ""}`, "", "Ait Olduğu", ""],
      [`Atölye Şefi : ${s.teacherName || ""}`, "", `Yıl : ${yearStr}`, `Ay : ${report.monthName}`],
      [],
      ["TARİH", "Saat", "YAPILAN İŞ", "AÇIKLAMALAR"]
    ];

    // Veri satırlarını ekle
    (report.rows || []).forEach(row => {
      wsData.push([
        row.dateFormatted || "",
        row.hoursText || "",
        row.task || "",
        row.explanation || ""
      ]);
    });

    // Alt metin ve imzalar
    wsData.push([]);
    wsData.push([`${report.monthName} ayı içinde yapmış olduğum çalışmalar yukarıda gösterilmiştir. Bilgilerinize arz ederim.`]);
    wsData.push([]);
    wsData.push(["", "", "", report.reportDate || ""]);
    wsData.push(["", "", "", s.teacherName || ""]);
    wsData.push(["", "", "", `${s.labName || ""} Atölye Şefi`]);
    wsData.push([]);
    wsData.push(["", "", "", `.... / .... / ${yearStr.split("-")[0] || "2026"}`]);
    wsData.push(["", "", "", s.principalName || ""]);
    wsData.push(["", "", "", s.principalTitle || "Okul Müdürü"]);

    const ws = window.XLSX.utils.aoa_to_sheet(wsData);

    // Hücre birleştirmeleri (Merge)
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Okul Adı
      { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // Başlık
      { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } }, // Alan Adı
      { s: { r: 3, c: 2 }, e: { r: 3, c: 3 } }, // Ait Olduğu
      { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } }, // Atölye Şefi
      { s: { r: wsData.length - 8, c: 0 }, e: { r: wsData.length - 8, c: 3 } } // Alt beyan
    ];

    // Sütun genişlikleri
    ws["!cols"] = [
      { wch: 16 }, // Tarih
      { wch: 12 }, // Saat
      { wch: 48 }, // Yapılan İş
      { wch: 48 }  // Açıklamalar
    ];

    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, `${report.monthName}_Raporu`);

    const fileName = `PBO_Aylik_Rapor_${report.monthName}_${yearStr}.xlsx`;

    try {
      window.XLSX.writeFile(wb, fileName);
    } catch (e) {
      // Alternatif blob indirme yöntemi
      const wbout = window.XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = ExportXlsx;
}
