
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const SECTION_LABELS = [
  { id: "overview", title: "Overview" },
  { id: "objectives", title: "Objectives" },
  { id: "assumptions", title: "Assumptions" },
  { id: "functional", title: "Functional Requirements" },
  { id: "nonfunctional", title: "Non-functional Requirements" },
  { id: "constraints", title: "Constraints" },
  { id: "success", title: "Success Metrics" },
];

type SectionContent = {
  [key: string]: string;
};

interface PRDEditorProps {
  sectionContent: SectionContent;
  setSectionContent: (c: SectionContent) => void;
  onExport: () => void;
}

export const PRDEditor: React.FC<PRDEditorProps> = ({
  sectionContent,
  setSectionContent,
  onExport,
}) => {
  const handleChange = (id: string, value: string) => {
    setSectionContent({ ...sectionContent, [id]: value });
  };

  return (
    <Card className="mb-6 shadow p-8">
      <h2 className="text-2xl font-bold mb-4">Step 2: Edit Product Requirements Document</h2>
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
                onChange={e => handleChange(section.id, e.target.value)}
                rows={8}
                className="font-mono"
                placeholder={`Enter details for ${section.title.toLowerCase()}...`}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="flex justify-end mt-4">
        <Button onClick={onExport}>Export PRD</Button>
      </div>
    </Card>
  )
}
