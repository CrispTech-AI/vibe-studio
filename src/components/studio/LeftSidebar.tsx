import { Music, Image, Type, Sparkles, Upload, ChevronDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { ProjectState } from "@/hooks/useProject";

type Tab = "audio" | "background" | "lyrics";

interface LeftSidebarProps {
  project: ProjectState;
  onUpdate: (updates: Partial<ProjectState>) => void;
  onGenerate: (type: "lyrics" | "music_description" | "background") => void;
  isGenerating: boolean;
  generatedContent: string;
  generationType: string;
}

const LeftSidebar = ({ project, onUpdate, onGenerate, isGenerating, generatedContent, generationType }: LeftSidebarProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("audio");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "audio", label: "Audio", icon: <Music size={16} /> },
    { id: "background", label: "Visuals", icon: <Image size={16} /> },
    { id: "lyrics", label: "Lyrics", icon: <Type size={16} /> },
  ];

  return (
    <div className="w-80 flex flex-col border-r border-border bg-card h-full">
      {/* Tab bar */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors duration-100 ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "audio" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Genre</label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["pop", "hip-hop", "rock", "electronic", "r&b", "jazz", "lo-fi"].map((g) => (
                  <button
                    key={g}
                    onClick={() => onUpdate({ genre: g })}
                    className={project.genre === g ? "aspect-chip-active" : "aspect-chip-inactive"}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Describe your track</label>
              <textarea
                value={project.audioPrompt}
                onChange={(e) => onUpdate({ audioPrompt: e.target.value })}
                placeholder="A dreamy synthwave track with heavy bass and ethereal vocals..."
                className="mt-2 w-full h-28 bg-muted border border-border rounded-md p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              onClick={() => onGenerate("music_description")}
              disabled={isGenerating}
              className="studio-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating && generationType === "music_description" ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {isGenerating && generationType === "music_description" ? "Generating..." : "Generate Track"}
            </button>

            {generatedContent && generationType === "music_description" && (
              <div className="studio-panel p-3 text-xs text-muted-foreground max-h-40 overflow-y-auto whitespace-pre-wrap">
                {generatedContent}
              </div>
            )}

            <div className="border-t border-border pt-4">
              <button className="studio-btn-ghost w-full flex items-center justify-center gap-2">
                <Upload size={14} />
                Upload Audio File
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === "background" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Animation Style</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {["Particle Flow", "Waveform", "Gradient Mesh", "3D Tunnel", "Glitch Art", "Liquid"].map((style) => (
                  <button
                    key={style}
                    onClick={() => onUpdate({ bgStyle: style })}
                    className={`studio-panel p-3 text-xs transition-colors text-center ${
                      project.bgStyle === style
                        ? "text-foreground border-primary/50"
                        : "text-muted-foreground hover:text-foreground hover:border-primary/50"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Custom Prompt</label>
              <textarea
                value={project.bgPrompt}
                onChange={(e) => onUpdate({ bgPrompt: e.target.value })}
                placeholder="Neon city skyline with rain and reflections..."
                className="mt-2 w-full h-24 bg-muted border border-border rounded-md p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              onClick={() => onGenerate("background")}
              disabled={isGenerating}
              className="studio-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating && generationType === "background" ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {isGenerating && generationType === "background" ? "Generating..." : "Generate Background"}
            </button>

            {generatedContent && generationType === "background" && (
              <div className="studio-panel p-3 text-xs text-muted-foreground max-h-40 overflow-y-auto whitespace-pre-wrap">
                {generatedContent}
              </div>
            )}

            <button className="studio-btn-ghost w-full flex items-center justify-center gap-2">
              <Upload size={14} />
              Upload Image/Video
            </button>
          </motion.div>
        )}

        {activeTab === "lyrics" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lyrics</label>
              <textarea
                value={project.lyrics}
                onChange={(e) => onUpdate({ lyrics: e.target.value })}
                placeholder={"[Verse 1]\nWrite your lyrics here...\nEach line will be timed to the beat\n\n[Chorus]\nYour chorus goes here..."}
                className="mt-2 w-full h-64 bg-muted border border-border rounded-md p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary font-mono leading-relaxed"
              />
            </div>

            <button
              onClick={() => onGenerate("lyrics")}
              disabled={isGenerating}
              className="studio-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating && generationType === "lyrics" ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {isGenerating && generationType === "lyrics" ? "Generating..." : "Auto-Generate Lyrics"}
            </button>

            <div className="border-t border-border pt-4 space-y-3">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lip Sync</label>
              <div className="studio-panel p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Enable Lip Sync</span>
                  <button
                    onClick={() => onUpdate({ lipSyncEnabled: !project.lipSyncEnabled })}
                    className={`w-9 h-5 rounded-full relative transition-colors ${
                      project.lipSyncEnabled ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-primary-foreground transition-transform ${
                      project.lipSyncEnabled ? "right-0.5" : "left-0.5"
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Avatar Style</span>
                  <button className="flex items-center gap-1 text-xs text-foreground">
                    {project.avatarStyle} <ChevronDown size={12} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
