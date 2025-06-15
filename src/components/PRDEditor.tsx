
import React from "react";
import { Card } from "@/components/ui/card";
import { PRDTabs } from "@/components/PRDTabs";
import { PRDExportButton } from "@/components/PRDExportButton";
import { SectionContent } from "@/types";
import { Button } from "@/components/ui/button";

interface PRDEditorProps {
  sectionContent: SectionContent;
  setSectionContent: (c: SectionContent) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  isLoggedIn: boolean;
}

export const PRDEditor: React.FC<PRDEditorProps> = ({
  sectionContent,
  setSectionContent,
  onSave,
  isSaving,
  isLoggedIn,
}) => {
  const handleChange = (id: string, value: string) => {
    setSectionContent({ ...sectionContent, [id]: value });
  };

  return (
    <Card className="mb-6 shadow p-8">
      <h2 className="text-2xl font-bold mb-4">Step 2: Edit Product Requirements Document</h2>
      <PRDTabs sectionContent={sectionContent} onContentChange={handleChange} />
      <div className="flex justify-end items-center mt-4 space-x-4">
        {isLoggedIn && (
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save PRD'}
          </Button>
        )}
        <PRDExportButton sectionContent={sectionContent} />
      </div>
    </Card>
  );
};
