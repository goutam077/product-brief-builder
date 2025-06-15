
import React, { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadRequirementFileProps {
  onUpload: (fileText: string) => void;
  loading: boolean;
  error: string | null;
}

export const UploadRequirementFile: React.FC<UploadRequirementFileProps> = ({
  onUpload,
  loading,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Parsers to be added in the next version for .docx/.xlsx.
  // Here we'll just read text content for demo purpsoes.
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      let text = (event.target?.result as string) || "";
      // In a real app, we'd parse docx/xlsx here.
      onUpload(text);
    };
    reader.readAsText(file);
  };

  return (
    <Card className="p-6 mb-6 shadow space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 1: Upload Requirements</h2>
        <p className="text-muted-foreground mb-2">
          Upload your requirements file (<span className="font-mono">.docx</span> or <span className="font-mono">.xlsx</span>).
        </p>
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            accept=".doc,.docx,.xls,.xlsx,.txt"
            ref={inputRef}
            onChange={handleFile}
            className="max-w-xs"
            disabled={loading}
          />
          <Button
            variant="secondary"
            type="button"
            disabled={loading}
            onClick={() => inputRef.current?.click()}
          >
            Choose File
          </Button>
        </div>
        {loading && <div className="text-blue-500 mt-2">Processing...</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </Card>
  );
};
