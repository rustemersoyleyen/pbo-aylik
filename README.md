# 📋 PBO Aylık Rapor Sistemi (Planlama Bakım Onarım)

Mesleki ve Teknik Anadolu Liselerinde görev yapan Atölye Şefleri için **Planlama Bakım Onarım (PBO)** aylık çalışma raporlarını MEB resmi standartlarına uygun olarak otomatik oluşturan, düzenlenebilir, yazdırılabilir ve dışa aktarılabilir (A4 PDF, Word, Excel) modern web uygulaması.

---

## 🌟 Öne Çıkan Özellikler

1. **2026-2027 MEB Yıllık Planı Entegre:**
   - `PBO_YILLIK_2026-2027.xlsx` dosyasındaki tüm haftalık işler, saatler ve MEB tatil takvimi sisteme doğrudan gömülüdür.
   - Dilerseniz arayüz üzerinden başka bir Excel yıllık planını sürükleyip bırakarak yükleyebilirsiniz.

2. **Akıllı Türkçe Cümle Dönüştürücü:**
   - Plandaki mastar/hedef cümleleri (Örn: *"Atölyenin temizlenmesi ve donanım arızalarının giderilmesi"*), raporda yer alması gereken tamamlanmış geçmiş zamanlı resmi çalışma açıklamalarına (Örn: *"Atölye temizlendi ve donanım arızaları giderildi."*) otomatik olarak dönüştürür.

3. **Otomatik Takvim ve Tatil Filtresi:**
   - Ayarlar sayfasından belirlediğiniz gün ve saatlere göre (Örn: *Perşembe 4 Saat, Cuma 2 Saat*) seçilen ayın günlerini otomatik çıkarır.
   - Cumhuriyet Bayramı, 23 Nisan, 19 Mayıs gibi **resmi tatiller** ve MEB 1./2. dönem **ara tatilleri ile sömestr tatili** rapordan otomatik olarak hariç tutulur.

4. **Birebir Resmi Şablon (A4 Uyumlu):**
   - Milli Eğitim Bakanlığı atölye şefliği çalışma raporu şablonu ile piksel piksel aynı görsel düzen.
   - Boş satır tamamlaması (standart form yüksekliğini koruyan dolgu satırları).
   - Yetkili ve okul müdürü imza blokları.

5. **Çoklu Dışa Aktarma Seçenekleri:**
   - 🖨️ **A4 Yazdır / PDF:** `@media print` optimizasyonuyla tek sayfa A4 baskıya kusursuz oturur.
   - 📄 **Word (.docx):** Resmi tablo ve hücre kenarlıklarıyla birebir Word formatında indirilir.
   - 📊 **Excel (.xlsx):** Birleştirilmiş başlıklar ve kolon genişlikleriyle formatlı Excel indirilir.

6. **Kolay Kurulumsuz Çalışma & Yerel Kayıt:**
   - Sunucu veya veri tabanı gerektirmez.
   - Tüm ayarlarınız ve planınız tarayıcınızın yerel belleğinde (`localStorage`) saklanır; bir kez girdiğinizde silinmez.

---

## 🚀 Hızlı Başlangıç

### 1. Yerel Olarak Çalıştırma
Projeyi doğrudan tarayıcınızda açmak için `index.html` dosyasına çift tıklamanız yeterlidir!

Alternatif olarak yerel bir web sunucusu ile çalıştırmak isterseniz:
```bash
# Python ile
python -m http.server 8080

# veya Node.js / npx ile
npx serve .
```
Tarayıcınızda `http://localhost:8080` adresine gidin.

---

## 🐙 GitHub'a Aktarma ve GitHub Pages Canlı Yayın

Bu projeyi doğrudan GitHub hesabınıza (`rustemersoyleyen`) aktarmak için terminalden aşağıdaki adımları uygulayabilirsiniz:

```bash
# 1. Git deposunu başlatın
git init
git add .
git commit -m "feat: PBO Aylık Rapor Sistemi ilk sürüm"

# 2. GitHub CLI (gh) ile doğrudan yeni repo oluşturup gönderin:
gh repo create rustemersoyleyen/pbo-aylik --public --source=. --push

# veya standart git remote ile:
# git remote add origin https://github.com/rustemersoyleyen/pbo-aylik.git
# git branch -M main
# git push -u origin main
```

### GitHub Pages'i Aktifleştirme (Ücretsiz Canlı Yayın)
1. GitHub reponuzda **Settings (Ayarlar)** > **Pages** menüsüne gidin.
2. **Branch** kısmından `main` ve `/ (root)` seçin, **Save** butonuna tıklayın.
3. Birkaç dakika sonra uygulamanız canlı adreste yayında olacaktır:
   👉 **`https://rustemersoyleyen.github.io/pbo-aylik/`**

---

## 🛠️ Proje Yapısı

```
PBO_Aylik/
├── index.html                 # Ana web uygulaması arayüzü
├── PBO_YILLIK_2026-2027.xlsx  # Orijinal MEB yıllık plan Excel dosyası
├── plan_data.json             # Excel'den çıkarılan JSON plan verisi
├── css/
│   └── style.css              # Modern UI ve A4 baskı (@media print) stilleri
├── js/
│   ├── planData.js            # 2026-2027 planı, tatil takvimi ve varsayılan ayarlar
│   ├── converter.js           # Türkçe geçmiş zaman dönüştürücü motoru
│   ├── generator.js           # Takvim, hafta eşleme ve rapor üretici
│   ├── exportDocx.js          # Word (.docx) dosya oluşturucu
│   ├── exportXlsx.js          # Excel (.xlsx) dosya oluşturucu
│   └── app.js                 # UI etkileşimleri ve localStorage senkronizasyonu
└── lib/
    ├── docx.umd.js            # İstemci taraflı Word (.docx) motoru
    └── xlsx.full.min.js       # İstemci taraflı Excel (.xlsx) motoru
```

---

## 👤 Geliştirici & Lisans
- **Geliştirici:** Rustem ERSÖYLEYEN
- **Lisans:** MIT Lisansı
