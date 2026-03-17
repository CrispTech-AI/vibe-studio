import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Music, Trash2, LogOut, Loader2, Pencil, Download } from "lucide-react";

import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const Dashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      toast.error("Failed to load projects");
    } else {
      setProjects(data ?? []);
    }
    setLoading(false);
  };

  const deleteProject = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete project");
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
    }
    setDeleting(null);
  };

  const startRenaming = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingId(project.id);
    setEditTitle(project.title);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitRename = async () => {
    if (!editingId) return;
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    const { error } = await supabase
      .from("projects")
      .update({ title: trimmed })
      .eq("id", editingId);
    if (error) {
      toast.error("Failed to rename project");
    } else {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, title: trimmed } : p))
      );
    }
    setEditingId(null);
  };

  const openProject = (id: string) => {
    navigate(`/studio/${id}`);
  };

  const createNew = () => {
    navigate("/studio");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground tracking-tight">
          VOXSTUDIO
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/install")} className="gap-1.5">
            <Download className="w-4 h-4" /> Install App
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-1" /> Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            My Projects
          </h2>
          <Button onClick={createNew} className="gap-2">
            <Plus className="w-4 h-4" /> New Project
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
          </div>
        ) : projects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Music className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">No projects yet</p>
              <Button onClick={createNew} size="sm">
                <Plus className="w-4 h-4 mr-1" /> Create your first project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {projects.map((p) => (
              <Card
                key={p.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => openProject(p.id)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    {editingId === p.id ? (
                      <Input
                        ref={inputRef}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRename();
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="h-7 text-sm font-medium"
                      />
                    ) : (
                      <p
                        className="font-medium text-foreground truncate cursor-text hover:text-primary transition-colors inline-flex items-center gap-1.5 group/title"
                        onClick={(e) => startRenaming(e, p)}
                        title="Click to rename"
                      >
                        {p.title}
                        <Pencil size={12} className="text-muted-foreground opacity-0 group-hover/title:opacity-100 transition-opacity shrink-0" />
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      {p.genre && (
                        <span className="bg-muted px-2 py-0.5 rounded">
                          {p.genre}
                        </span>
                      )}
                      <span>
                        {new Date(p.updated_at).toLocaleDateString()}
                      </span>
                      <span className="capitalize">{p.status}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(p.id);
                    }}
                    disabled={deleting === p.id}
                  >
                    {deleting === p.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
