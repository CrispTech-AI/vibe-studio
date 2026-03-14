import { useState } from "react";
import { useParams } from "react-router-dom";
import TopBar from "@/components/studio/TopBar";
import LeftSidebar from "@/components/studio/LeftSidebar";
import VideoCanvas from "@/components/studio/VideoCanvas";
import Timeline from "@/components/studio/Timeline";
import ExportModal from "@/components/studio/ExportModal";
import { useProject } from "@/hooks/useProject";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const [exportOpen, setExportOpen] = useState(false);
  const projectHook = useProject(projectId);

  if (projectHook.loadingProject) {
    return (
      <div className="h-screen bg-background flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading project…
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar onExport={() => setExportOpen(true)} onSave={projectHook.saveProject} />
      <div className="flex flex-1 min-h-0">
        <LeftSidebar
          project={projectHook.project}
          onUpdate={projectHook.updateProject}
          onGenerate={projectHook.generateAI}
          isGenerating={projectHook.isGenerating}
          generatedContent={projectHook.generatedContent}
          generationType={projectHook.generationType}
        />
        <VideoCanvas />
      </div>
      <Timeline />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
};

export default Index;
