import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FileWord, FilePdf } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

  // Export option dropdown: handle export format selection
  const handleExport = (format: "word" | "pdf") => {
    if (format === "word") {
      toast({
        title: "Export Coming Soon!",
        description: "Exporting to Word (.docx) will be available in the next version.",
      });
    } else if (format === "pdf") {
      toast({
        title: "Export Coming Soon!",
        description: "Exporting to PDF will be available in the next version.",
      });
    }
    // This stubs export with a toast; real logic goes here in future.
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              Export PRD
              <svg
                className="ml-2 h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M7 7l3-3 3 3M10 4v8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 15h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleExport("word")}
              className="cursor-pointer"
            >
              <FileWord className="mr-2 h-4 w-4 text-blue-600" />
              Export as Word
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExport("pdf")}
              className="cursor-pointer"
            >
              <FilePdf className="mr-2 h-4 w-4 text-red-600" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};
