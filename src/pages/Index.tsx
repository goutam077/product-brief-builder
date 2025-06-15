import React, { useState } from "react";
import { UploadRequirementFile } from "@/components/UploadRequirementFile";
import { PRDEditor } from "@/components/PRDEditor";
import { toast } from "@/hooks/use-toast";

const DEFAULT_SECTION_CONTENT = {
  overview: "This product will solve the most pressing problems identified in the uploaded requirements.",
  objectives: "1. Improve process efficiency\n2. Enhance user satisfaction\n3. Reduce operational costs",
  assumptions: "- Users are familiar with basic product workflows\n- Integration APIs are available and operational",
  functional: "- Users can upload and edit documents\n- The system parses requirements and fills in the PRD template\n- Export functionality available",
  nonfunctional: "- Must be responsive\n- Support all major browsers\n- Ensure security and confidentiality",
  constraints: "- Integrate with existing IT systems\n- Must use approved technologies only",
  success: "1. 95% reduction in manual PRD writing time\n2. 80% positive feedback from product stakeholders",
};

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [sectionContent, setSectionContent] = useState<{ [key: string]: string }>(DEFAULT_SECTION_CONTENT);

  // For now, just fill with sample data for demo purposes.
  function parsePRDSectionsFromDoc(raw: string) {
    // Define the regex patterns for each section. They should match headings at the start of a line.
    // The keys must match SECTION_LABELS in PRDEditor.
    const SECTION_PATTERNS = [
      { id: "overview", pattern: /^(overview)\s*:?/i },
      { id: "objectives", pattern: /^(objectives|goals)\s*:?/i },
      { id: "assumptions", pattern: /^(assumptions)\s*:?/i },
      { id: "functional", pattern: /^(functional requirements?)\s*:?/i },
      { id: "nonfunctional", pattern: /^(non[-\s]?functional requirements?)\s*:?/i },
      { id: "constraints", pattern: /^(constraints|limitations)\s*:?/i },
      { id: "success", pattern: /^(success metrics?|acceptance criteria)\s*:?/i },
    ];

    const lines = raw.split(/\r?\n/).map(l => l.trim());
    const sections: { [key: string]: string[] } = {};
    let currentId: string | null = null;

    for (let line of lines) {
      // Check if line matches any section heading
      let foundSection = false;
      for (const sec of SECTION_PATTERNS) {
        if (sec.pattern.test(line)) {
          currentId = sec.id;
          foundSection = true;
          // Initialize new section if not present
          if (!sections[currentId]) sections[currentId] = [];
          break;
        }
      }
      // If this is not a section heading, add to current section
      if (!foundSection && currentId) {
        sections[currentId].push(line);
      }
    }

    // Build final section objects with fallback defaults
    const parsed: { [key: string]: string } = {};
    SECTION_PATTERNS.forEach(sec => {
      parsed[sec.id] = (sections[sec.id] || []).join("\n").trim();
    });

    return parsed;
  }

  function handleFileUpload(content: string) {
    setUploadError(null);
    setLoading(true);
    setTimeout(() => {
      // Attempt to parse PRD sections from file and use defaults as fallback
      const parsed = parsePRDSectionsFromDoc(content);
      setSectionContent({
        ...DEFAULT_SECTION_CONTENT,
        ...Object.fromEntries(
          Object.entries(parsed).map(([key, val]) => [
            key,
            val && val.length > 0 ? val : DEFAULT_SECTION_CONTENT[key]
          ])
        ),
      });
      setLoading(false);
      toast({
        title: "File uploaded!",
        description: "Requirements file processed and PRD sections pre-filled.",
      });
    }, 1400);
  }

  const handleExport = () => {
    // Just simulate "export"—full logic (save as .docx/.pdf) next!
    toast({
      title: "Export Coming Soon!",
      description: "Exporting as Word or PDF will be available in the next version.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-12 items-center">
      <div className="max-w-4xl w-full">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Product Requirements Document Builder</h1>
          <p className="text-lg text-muted-foreground mb-1">
            Instantly generate, auto-fill, and export PRDs from your own requirements.
          </p>
          <p className="text-base text-muted-foreground">
            Upload your high-level requirements (Word, Excel). AI will pre-draft your PRD for editing and export.
          </p>
        </header>
        <UploadRequirementFile onUpload={handleFileUpload} loading={loading} error={uploadError} />
        <PRDEditor
          sectionContent={sectionContent}
          setSectionContent={setSectionContent}
          onExport={handleExport}
        />
      </div>
      <footer className="mt-12 text-muted-foreground text-sm tracking-wide">
        &copy; {new Date().getFullYear()} Product Brief Builder – Made for Product Managers.
      </footer>
    </div>
  );
};

export default Index;
