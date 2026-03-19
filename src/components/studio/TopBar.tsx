import { useState, useRef, useEffect } from "react";
import { Download, Save, Undo2, Redo2, Settings, LogOut, ArrowLeft, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  onExport: () => void;
  onSave?: () => void;
  projectTitle?: string;
  onTitleChange?: (title: string) => void;
}

const TopBar = ({ onExport, onSave, projectTitle = "Untitled Project", onTitleChange }: TopBarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(projectTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(projectTitle);
  }, [projectTitle]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commitTitle = () => {
    setEditing(false);
    const trimmed = title.trim() || "Untitled Project";
    setTitle(trimmed);
    onTitleChange?.(trimmed);
  };

  return (
    <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="studio-btn-ghost flex items-center gap-1"
          title="Back to Dashboard"
        >
          <ArrowLeft size={15} />
        </button>
        <span className="text-border">|</span>
        <h1 className="font-display text-sm font-bold tracking-tight">
          <span className="text-primary">VibeForge Studio</span>
        </h1>
        <span className="text-border">|</span>
        {editing ? (
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTitle();
              if (e.key === "Escape") { setTitle(projectTitle); setEditing(false); }
            }}
            className="bg-muted border border-border rounded px-2 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-40"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
            title="Click to rename"
          >
            {projectTitle}
            <Pencil size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button className="studio-btn-ghost" title="Undo">
          <Undo2 size={15} />
        </button>
        <button className="studio-btn-ghost" title="Redo">
          <Redo2 size={15} />
        </button>
        <span className="text-border mx-1">|</span>
        <button onClick={onSave} className="studio-btn-ghost flex items-center gap-1.5">
          <Save size={14} />
          <span className="text-xs">Save</span>
        </button>
        <button className="studio-btn-ghost">
          <Settings size={15} />
        </button>
        <button onClick={onExport} className="studio-btn-secondary flex items-center gap-1.5 ml-2">
          <Download size={14} />
          <span className="text-xs">Export</span>
        </button>
        <button onClick={signOut} className="studio-btn-ghost flex items-center gap-1.5 ml-1" title="Sign out">
          <LogOut size={14} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
