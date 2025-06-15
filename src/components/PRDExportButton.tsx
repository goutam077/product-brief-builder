
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { File } from "lucide-react";
import { exportPRD } from "@/utils/prdExporter";
import { SectionContent } from "@/types";

interface PRDExportButtonProps {
    sectionContent: SectionContent;
}

export const PRDExportButton: React.FC<PRDExportButtonProps> = ({ sectionContent }) => {
  const handleExport = (format: "word" | "pdf") => {
    exportPRD(format, sectionContent);
  };

  return (
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
            <File className="mr-2 h-4 w-4 text-blue-600" />
            Export as Word
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleExport("pdf")}
            className="cursor-pointer"
          >
            <File className="mr-2 h-4 w-4 text-red-600" />
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
