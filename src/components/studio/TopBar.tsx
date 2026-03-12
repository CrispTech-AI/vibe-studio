import { Download, Save, Undo2, Redo2, Settings } from "lucide-react";

interface TopBarProps {
  onExport: () => void;
}

const TopBar = ({ onExport }: TopBarProps) => {
  return (
    <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-sm font-bold tracking-tight">
          <span className="text-primary">VOXSTUDIO</span>
        </h1>
        <span className="text-border">|</span>
        <span className="text-xs text-muted-foreground">Untitled Project</span>
      </div>

      <div className="flex items-center gap-1">
        <button className="studio-btn-ghost" title="Undo">
          <Undo2 size={15} />
        </button>
        <button className="studio-btn-ghost" title="Redo">
          <Redo2 size={15} />
        </button>
        <span className="text-border mx-1">|</span>
        <button className="studio-btn-ghost flex items-center gap-1.5">
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
      </div>
    </div>
  );
};

export default TopBar;
