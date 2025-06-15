
import React from "react";
import { Card } from "@/components/ui/card";
import { PRDTabs } from "@/components/PRDTabs";
import { PRDExportButton } from "@/components/PRDExportButton";
import { SectionContent } from "@/types";

interface PRDEditorProps {
  sectionContent: SectionContent;
  setSectionContent: (c: SectionContent) => void;
}

export const PRDEditor: React.FC<PRDEditorProps> = ({
  sectionContent,
  setSectionContent,
}) => {
  const handleChange = (id: string, value: string) => {
    setSectionContent({ ...sectionContent, [id]: value });
  };

  return (
    <Card className="mb-6 shadow p-8">
      <h2 className="text-2xl font-bold mb-4">Step 2: Edit Product Requirements Document</h2>
      <PRDTabs sectionContent={sectionContent} onContentChange={handleChange} />
      <PRDExportButton sectionContent={sectionContent} />
    </Card>
  );
};
