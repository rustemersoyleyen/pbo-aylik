/**
 * PBO Aylık Rapor - Word (.docx) Dışa Aktarma Modülü
 */

const ExportDocx = {
  /**
   * Rapor verilerinden A4 formatında Word belgesi oluşturur ve indirir
   * @param {object} report 
   */
  async export(report) {
    if (!window.docx) {
      alert("Word kütüphanesi yüklenemedi!");
      return;
    }

    const {
      Document,
      Paragraph,
      TextRun,
      Table,
      TableRow,
      TableCell,
      WidthType,
      AlignmentType,
      BorderStyle,
      VerticalAlign,
      Packer
    } = window.docx;

    const s = report.settings;
    const borderStyle = {
      style: BorderStyle.SINGLE,
      size: 1,
      color: "222222"
    };
    const cellBorders = {
      top: borderStyle,
      bottom: borderStyle,
      left: borderStyle,
      right: borderStyle
    };

    // 1. Üst Bilgi Tablosu (Alan Adı, Atölye Şefi / Yıl, Ay)
    const metaTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 55, type: WidthType.PERCENTAGE },
              borders: cellBorders,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Alan Adı : ", bold: true, size: 20 }),
                    new TextRun({ text: s.fieldName || "", size: 20 })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "Atölye Şefi : ", bold: true, size: 20 }),
                    new TextRun({ text: s.teacherName || "", size: 20 })
                  ]
                })
              ]
            }),
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              borders: cellBorders,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Ait Olduğu", bold: true, size: 19 })]
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "Yıl : ", bold: true, size: 20 }),
                    new TextRun({ text: report.academicYear || "", size: 20 })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "Ay : ", bold: true, size: 20 }),
                    new TextRun({ text: report.monthName || "", bold: true, size: 20 })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });

    // 2. Ana Çalışma Tablosu
    const tableHeaderRow = new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 16, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "TARİH", bold: true, size: 20 })] })]
        }),
        new TableCell({
          width: { size: 12, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Saat", bold: true, size: 20 })] })]
        }),
        new TableCell({
          width: { size: 36, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "YAPILAN İŞ", bold: true, size: 20 })] })]
        }),
        new TableCell({
          width: { size: 36, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "AÇIKLAMALAR", bold: true, size: 20 })] })]
        })
      ]
    });

    const dataRows = (report.rows || []).map(row => {
      return new TableRow({
        children: [
          new TableCell({
            width: { size: 16, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row.dateFormatted || "", size: 18 })] })]
          }),
          new TableCell({
            width: { size: 12, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row.hoursText || "", size: 18 })] })]
          }),
          new TableCell({
            width: { size: 36, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ children: [new TextRun({ text: row.task || "", size: 18 })] })]
          }),
          new TableCell({
            width: { size: 36, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ children: [new TextRun({ text: row.explanation || "", size: 18 })] })]
          })
        ]
      });
    });

    const mainTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [tableHeaderRow, ...dataRows]
    });

    // 3. İmzalar ve Açıklama Paragrafı
    const closingParagraph = new Paragraph({
      spacing: { before: 200, after: 300 },
      children: [
        new TextRun({
          text: `${report.monthName} ayı içinde yapmış olduğum çalışmalar yukarıda gösterilmiştir. Bilgilerinize arz ederim.`,
          size: 19
        })
      ]
    });

    // İmza tablosu (Sağ tarafta Atölye Şefi ve Okul Müdürü)
    const signatureTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE }
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "" })]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: report.reportDate || "", size: 19 })]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: s.teacherName || "", bold: true, size: 20 })]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `${s.labName || ""} Atölye Şefi`, size: 19 })]
                })
              ]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "" })]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ spacing: { before: 400 }, text: "" }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `.... / .... / ${report.reportDate ? report.reportDate.split("/").pop().trim() : "2026"}`, size: 19 })]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: s.principalName || "", bold: true, size: 20 })]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: s.principalTitle || "Okul Müdürü", size: 19 })]
                })
              ]
            })
          ]
        })
      ]
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: { width: 11906, height: 16838 }, // A4 Portrait
              margin: { top: 900, right: 900, bottom: 900, left: 900 }
            }
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: (s.schoolName || "OKUL ADI").toUpperCase(),
                  bold: true,
                  size: 24
                })
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: "PLANLAMA BAKIM ONARIM ÇALIŞMA RAPORU",
                  bold: true,
                  size: 22
                })
              ]
            }),
            metaTable,
            new Paragraph({ spacing: { before: 120, after: 120 }, text: "" }),
            mainTable,
            closingParagraph,
            signatureTable
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `PBO_Aylik_Rapor_${report.monthName}_${report.academicYear}.docx`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = ExportDocx;
}
