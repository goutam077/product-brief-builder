
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UploadRequirementFile } from "@/components/UploadRequirementFile";
import { PRDEditor } from "@/components/PRDEditor";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { parsePRDSectionsFromDoc } from "@/utils/parsePRDSections";

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
  const [session, setSession] = useState<Session | null>(null);
  const [prdId, setPrdId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      setLoading(true);
      supabase
        .from('prds')
        .select('id, content')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            toast({ title: 'Error fetching data', description: error.message, variant: 'destructive' });
          } else if (data) {
            setSectionContent(data.content);
            setPrdId(data.id);
          } else {
            setSectionContent(DEFAULT_SECTION_CONTENT);
            setPrdId(null);
          }
          setLoading(false);
        });
    } else {
      setSectionContent(DEFAULT_SECTION_CONTENT);
      setPrdId(null);
    }
  }, [session]);

  function handleFileUpload(content: string) {
    setUploadError(null);
    setLoading(true);
    setTimeout(() => {
      // Use improved utility parser on incoming content
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

  const handleSave = async () => {
    if (!session) {
      toast({ title: 'Not logged in', description: 'You must be logged in to save.', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    const prdData = {
      user_id: session.user.id,
      content: sectionContent,
    };

    if (prdId) {
      const { error } = await supabase.from('prds').update(prdData).eq('id', prdId);
      if (error) {
        toast({ title: 'Save Failed', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success!', description: 'Your PRD has been saved.' });
      }
    } else {
      const { data, error } = await supabase.from('prds').insert(prdData).select('id').single();
      if (error) {
        toast({ title: 'Save Failed', description: error.message, variant: 'destructive' });
      } else {
        setPrdId(data.id);
        toast({ title: 'Success!', description: 'Your PRD has been saved.' });
      }
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-12 items-center">
      <div className="max-w-4xl w-full">
        <header className="mb-10">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-4xl font-bold">Product Requirements Document Builder</h1>
            <div>
              {session ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{session.user.email}</span>
                  <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </div>
              ) : (
                <Button asChild>
                  <Link to="/auth">Login</Link>
                </Button>
              )}
            </div>
          </div>
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
          onSave={handleSave}
          isSaving={isSaving}
          isLoggedIn={!!session}
        />
      </div>
      <footer className="mt-12 text-muted-foreground text-sm tracking-wide">
        &copy; {new Date().getFullYear()} Product Brief Builder – Made for Product Managers.
      </footer>
    </div>
  );
};

export default Index;
