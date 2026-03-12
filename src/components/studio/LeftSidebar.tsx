import { useState } from "react";
import { Music, Image, Type, Sparkles, Upload, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

type Tab = "audio" | "background" | "lyrics";

const LeftSidebar = () => {
  const [activeTab, setActiveTab] = useState<Tab>("audio");
  const [audioPrompt, setAudioPrompt] = useState("");
  const [bgPrompt, setBgPrompt] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [genre, setGenre] = useState("pop");

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
                    onClick={() => setGenre(g)}
                    className={genre === g ? "aspect-chip-active" : "aspect-chip-inactive"}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Describe your track</label>
              <textarea
                value={audioPrompt}
                onChange={(e) => setAudioPrompt(e.target.value)}
                placeholder="A dreamy synthwave track with heavy bass and ethereal vocals..."
                className="mt-2 w-full h-28 bg-muted border border-border rounded-md p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button className="studio-btn-primary w-full flex items-center justify-center gap-2">
              <Sparkles size={14} />
              Generate Track
            </button>

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
                    className="studio-panel p-3 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors text-center"
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Custom Prompt</label>
              <textarea
                value={bgPrompt}
                onChange={(e) => setBgPrompt(e.target.value)}
                placeholder="Neon city skyline with rain and reflections..."
                className="mt-2 w-full h-24 bg-muted border border-border rounded-md p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button className="studio-btn-primary w-full flex items-center justify-center gap-2">
              <Sparkles size={14} />
              Generate Background
            </button>

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
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder={"[Verse 1]\nWrite your lyrics here...\nEach line will be timed to the beat\n\n[Chorus]\nYour chorus goes here..."}
                className="mt-2 w-full h-64 bg-muted border border-border rounded-md p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary font-mono leading-relaxed"
              />
            </div>

            <button className="studio-btn-primary w-full flex items-center justify-center gap-2">
              <Sparkles size={14} />
              Auto-Generate Lyrics
            </button>

            <div className="border-t border-border pt-4 space-y-3">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lip Sync</label>
              <div className="studio-panel p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Enable Lip Sync</span>
                  <button className="w-9 h-5 rounded-full bg-primary relative transition-colors">
                    <span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-primary-foreground transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Avatar Style</span>
                  <button className="flex items-center gap-1 text-xs text-foreground">
                    Realistic <ChevronDown size={12} />
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
