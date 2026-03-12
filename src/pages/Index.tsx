import { useState } from "react";
import TopBar from "@/components/studio/TopBar";
import LeftSidebar from "@/components/studio/LeftSidebar";
import VideoCanvas from "@/components/studio/VideoCanvas";
import Timeline from "@/components/studio/Timeline";
import ExportModal from "@/components/studio/ExportModal";
import { useProject } from "@/hooks/useProject";

const Index = () => {
  const [exportOpen, setExportOpen] = useState(false);
  const projectHook = useProject();

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
