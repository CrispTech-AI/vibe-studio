import { useState } from "react";
import TopBar from "@/components/studio/TopBar";
import LeftSidebar from "@/components/studio/LeftSidebar";
import VideoCanvas from "@/components/studio/VideoCanvas";
import Timeline from "@/components/studio/Timeline";
import ExportModal from "@/components/studio/ExportModal";

const Index = () => {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar onExport={() => setExportOpen(true)} />
      <div className="flex flex-1 min-h-0">
        <LeftSidebar />
        <VideoCanvas />
      </div>
      <Timeline />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
};

export default Index;
