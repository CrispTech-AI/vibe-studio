import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Music, Trash2, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const Dashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

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
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="w-4 h-4 mr-1" /> Sign out
        </Button>
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
                    <p className="font-medium text-foreground truncate">
                      {p.title}
                    </p>
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
