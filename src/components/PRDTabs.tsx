
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SECTION_LABELS } from "@/config/prdConstants";
import { SectionContent } from "@/types";

interface PRDTabsProps {
  sectionContent: SectionContent;
  onContentChange: (id: string, value: string) => void;
}

export const PRDTabs: React.FC<PRDTabsProps> = ({ sectionContent, onContentChange }) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        {SECTION_LABELS.map((section) => (
          <TabsTrigger key={section.id} value={section.id}>
            {section.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {SECTION_LABELS.map((section) => (
        <TabsContent key={section.id} value={section.id}>
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">{section.title}</label>
            <Textarea
              value={sectionContent[section.id] || ""}
              onChange={(e) => onContentChange(section.id, e.target.value)}
              rows={8}
              className="font-mono"
              placeholder={`Enter details for ${section.title.toLowerCase()}...`}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
