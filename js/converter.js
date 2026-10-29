/**
 * PBO Aylık Rapor - Türkçe Cümle Dönüştürücü
 * Planlama metnini (mastar/hedef) geçmiş zamanlı tamamlanmış eyleme dönüştürür.
 */

const TaskConverter = {
  // Birebir eşleşen standart MEB PBO plan cümleleri
  directDictionary: {
    "Atölyenin temizlenmesi ve düzenlenmesi; arızalı/çalışmayan bilgisayarların ve eksik yazılımların tespit edilmesi":
      "Atölye temizlendi ve düzenlendi; arızalı/çalışmayan bilgisayarlar ve eksik yazılımlar tespit edildi.",
    
    "Atölyenin temizlenmesi ve düzenlenmesi; bilgisayarlardan problemli olan veya çalışmayan bilgisayarların ve eksik yazılımların tespiti":
      "Atölye temizlendi ve düzenlendi; bilgisayarlardan problemli olan veya çalışmayan bilgisayarlar ve eksik yazılımlar tespit edildi.",

    "Atölyedeki bilgisayarların donanım arızalarının giderilmesi":
      "Atölyedeki bilgisayarların donanım arızaları giderildi.",

    "Bilgisayarların güncel güvenlik yazılımlarıyla taranması":
      "Bilgisayarlar güncel güvenlik yazılımlarıyla tarandı.",

    "Atölyedeki bilgisayarların eksiklerinin giderilmesi":
      "Atölyedeki bilgisayarların eksikleri giderildi.",

    "Atölyedeki bilgisayarların yazılımlarının güncellenmesi":
      "Atölyedeki bilgisayarların yazılımları güncellendi.",

    "Sistem bakım-onarım atölyesindeki bilgisayarların eksiklerinin giderilmesi":
      "Atölyedeki bilgisayarların eksikleri giderildi.",

    "Sistem bakım onarım atölyesindeki bilgisayarların yazılımlarının güncellenmesi":
      "Atölyedeki bilgisayarların yazılımları güncellendi.",

    "Atölyenin temizlenmesi ve düzenlenmesi":
      "Atölye temizlendi ve düzenlendi.",

    "Laboratuvar eksikliklerinin giderilmesi":
      "Laboratuvar eksiklikleri giderildi.",

    "Laboratuvar temizliği ve düzenlenmesi":
      "Laboratuvar temizlendi ve düzenlendi.",

    "Ağ bağlantılarının kontrol edilmesi ve internet ayarlarının yapılması":
      "Ağ bağlantıları kontrol edildi ve internet ayarları yapıldı.",

    "Atölye şef odasının düzenlenmesi ve kayıtların güncellenmesi":
      "Atölye şef odası düzenlendi ve kayıtlar güncellendi."
  },

  /**
   * Bir plan cümlesini tamamlanmış iş açıklamasına dönüştürür.
   * @param {string} task 
   * @returns {string}
   */
  toCompleted(task) {
    if (!task || typeof task !== "string") return "";
    const trimmed = task.trim();

    // 1. Önce doğrudan sözlük kontrolü
    if (this.directDictionary[trimmed]) {
      return this.directDictionary[trimmed];
    }

    // 2. Kural tabanlı akıllı dönüştürücü
    let text = trimmed;

    // Yaygın mastar / amaç kalıpları
    const replacements = [
      [/temizlenmesi ve düzenlenmesi/gi, "temizlendi ve düzenlendi"],
      [/temizliği ve düzenlenmesi/gi, "temizlendi ve düzenlendi"],
      [/kontrol edilmesi ve test edilmesi/gi, "kontrol edildi ve test edildi"],
      [/kontrol edilmesi ve ayarlarının yapılması/gi, "kontrol edildi ve ayarları yapıldı"],
      [/tespit edilmesi/gi, "tespit edildi"],
      [/tespiti/gi, "tespit edildi"],
      [/giderilmesi/gi, "giderildi"],
      [/taranması/gi, "tarandı"],
      [/güncellenmesi/gi, "güncellendi"],
      [/yapılması/gi, "yapıldı"],
      [/kontrol edilmesi/gi, "kontrol edildi"],
      [/düzenlenmesi/gi, "düzenlendi"],
      [/temizlenmesi/gi, "temizlendi"],
      [/kurulması/gi, "kuruldu"],
      [/yüklenmesi/gi, "yüklendi"],
      [/onarılması/gi, "onarıldı"],
      [/bakımının yapılması/gi, "bakımı yapıldı"],
      [/onarımının yapılması/gi, "onarımı yapıldı"]
    ];

    replacements.forEach(([regex, replacement]) => {
      text = text.replace(regex, replacement);
    });

    // Cümlenin başındaki ilgi eklerini (tamlayan eklerini) özneye çevirme
    text = text.replace(/^Atölyenin\s+/i, "Atölye ");
    text = text.replace(/^Bilgisayarların\s+/i, "Bilgisayarlar ");
    text = text.replace(/^Laboratuvarın\s+/i, "Laboratuvar ");
    text = text.replace(/^Cihazların\s+/i, "Cihazlar ");

    // Noktalama düzeltmesi
    text = text.trim();
    if (text && !text.endsWith(".")) {
      text += ".";
    }

    return text;
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = TaskConverter;
}
