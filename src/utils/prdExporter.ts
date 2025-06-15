
import { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType } from "docx";
import { toast } from "@/hooks/use-toast";
import { SECTION_LABELS } from "@/config/prdConstants";
import { SectionContent } from "@/types";

export const exportPRD = (format: "word" | "pdf", sectionContent: SectionContent) => {
  if (format === "word") {
    const docChildren = SECTION_LABELS.flatMap((section) => {
      const content = sectionContent[section.id] || "";
      const contentLines = content.split('\n').filter(line => line.trim() !== '');

      const sectionElements = [
        new Paragraph({
          children: [new TextRun({ text: section.title, bold: true, size: 28 })], // 14pt font
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 480, after: 240 },
        }),
      ];
      
      if (contentLines.length > 0) {
        contentLines.forEach(line => {
          sectionElements.push(new Paragraph({ text: line, spacing: { after: 120 } }));
        });
      } else {
        sectionElements.push(new Paragraph({ 
          children: [new TextRun({ text: "Not specified.", italics: true })],
          style: "placeholder"
        }));
      }

      return sectionElements;
    });

    const doc = new Document({
      styles: {
        paragraphStyles: [{
            id: "placeholder",
            name: "Placeholder",
            basedOn: "Normal",
            next: "Normal",
            run: {
              color: "888888",
              italics: true,
            },
          }]
      },
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Product Requirements Document", size: 44, bold: true })],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 480 },
          }),
          ...docChildren
        ],
      }],
    });

    Packer.toBlob(doc).then(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "prd.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast({
        title: "Export Successful!",
        description: "Your PRD has been exported as a Word document.",
      });
    }).catch(err => {
      console.error("Error exporting to Word:", err);
      toast({
        title: "Export Failed",
        description: "There was an error generating the Word document.",
        variant: "destructive",
      });
    });
  } else if (format === "pdf") {
    toast({
      title: "Export Coming Soon!",
      description: "Exporting to PDF will be available in the next version.",
    });
  }
};
