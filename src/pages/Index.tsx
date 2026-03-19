import { useState, useCallback, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "@/components/studio/TopBar";
import LeftSidebar from "@/components/studio/LeftSidebar";
import VideoCanvas from "@/components/studio/VideoCanvas";
import Timeline from "@/components/studio/Timeline";
import ExportModal from "@/components/studio/ExportModal";
import { useProject } from "@/hooks/useProject";
import { Loader2 } from "lucide-react";

const TOTAL_TIME = 195; // 3:15

const Index = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const [exportOpen, setExportOpen] = useState(false);
  const projectHook = useProject(projectId);

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animRef = useRef<number>();
  const lastFrameRef = useRef<number>(0);

  // Simulated playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }
    lastFrameRef.current = performance.now();
    const tick = (now: number) => {
      const delta = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;
      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= TOTAL_TIME) {
          setIsPlaying(false);
          return TOTAL_TIME;
        }
        return next;
      });
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        setCurrentTime((prev) => Math.max(0, prev - 5));
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        setCurrentTime((prev) => Math.min(TOTAL_TIME, prev + 5));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(Math.max(0, Math.min(TOTAL_TIME, time)));
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  if (projectHook.loadingProject) {
    return (
      <div className="h-screen bg-background flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading project…
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar
        onExport={() => setExportOpen(true)}
        onSave={projectHook.saveProject}
        projectTitle={projectHook.project.title}
        onTitleChange={(title) => projectHook.updateProject({ title })}
      />
      <div className="flex flex-1 min-h-0">
        <LeftSidebar
          project={projectHook.project}
          onUpdate={projectHook.updateProject}
          onGenerate={projectHook.generateAI}
          isGenerating={projectHook.isGenerating}
          generatedContent={projectHook.generatedContent}
          generationType={projectHook.generationType}
        />
        <VideoCanvas
          currentTime={currentTime}
          totalTime={TOTAL_TIME}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
        />
      </div>
      <Timeline currentTime={currentTime} totalTime={TOTAL_TIME} onSeek={handleSeek} />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
};

export default Index;
