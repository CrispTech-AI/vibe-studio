import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProjectState {
  id?: string;
  title: string;
  genre: string;
  audioPrompt: string;
  bgPrompt: string;
  bgStyle: string;
  lyrics: string;
  aspectRatio: string;
  lipSyncEnabled: boolean;
  avatarStyle: string;
}

const defaultProject: ProjectState = {
  title: "Untitled Project",
  genre: "pop",
  audioPrompt: "",
  bgPrompt: "",
  bgStyle: "",
  lyrics: "",
  aspectRatio: "9:16",
  lipSyncEnabled: false,
  avatarStyle: "realistic",
};

export function useProject(projectId?: string) {
  const [project, setProject] = useState<ProjectState>(defaultProject);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [generationType, setGenerationType] = useState<string>("");
  const [loadingProject, setLoadingProject] = useState(!!projectId);

  useEffect(() => {
    if (!projectId) return;
    setLoadingProject(true);
    supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error("Project not found");
        } else {
          setProject({
            id: data.id,
            title: data.title,
            genre: data.genre ?? "pop",
            audioPrompt: data.audio_prompt ?? "",
            bgPrompt: data.bg_prompt ?? "",
            bgStyle: data.bg_style ?? "",
            lyrics: data.lyrics ?? "",
            aspectRatio: data.aspect_ratio ?? "9:16",
            lipSyncEnabled: data.lip_sync_enabled ?? false,
            avatarStyle: data.avatar_style ?? "realistic",
          });
        }
        setLoadingProject(false);
      });
  }, [projectId]);

  const updateProject = useCallback((updates: Partial<ProjectState>) => {
    setProject((prev) => ({ ...prev, ...updates }));
  }, []);

  const saveProject = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Sign in to save projects");
      return;
    }

    const projectData = {
      user_id: user.id,
      title: project.title,
      genre: project.genre,
      audio_prompt: project.audioPrompt,
      bg_prompt: project.bgPrompt,
      bg_style: project.bgStyle,
      lyrics: project.lyrics,
      aspect_ratio: project.aspectRatio,
      lip_sync_enabled: project.lipSyncEnabled,
      avatar_style: project.avatarStyle,
    };

    if (project.id) {
      const { error } = await supabase.from("projects").update(projectData).eq("id", project.id);
      if (error) { toast.error("Failed to save"); return; }
    } else {
      const { data, error } = await supabase.from("projects").insert(projectData).select().single();
      if (error) { toast.error("Failed to create project"); return; }
      setProject((prev) => ({ ...prev, id: data.id }));
    }
    toast.success("Project saved");
  }, [project]);

  const generateAI = useCallback(async (type: "lyrics" | "music_description" | "background") => {
    setIsGenerating(true);
    setGenerationType(type);

    const prompt = type === "lyrics"
      ? project.audioPrompt || "Write creative song lyrics"
      : type === "background"
        ? project.bgPrompt || "Create a cinematic background"
        : project.audioPrompt || "Describe a music track";

    try {
      const { data, error } = await supabase.functions.invoke("generate-music", {
        body: { prompt, genre: project.genre, type, projectId: project.id },
      });

      if (error) throw error;

      setGeneratedContent(data.content);

      if (type === "lyrics") {
        updateProject({ lyrics: data.content });
        toast.success("Lyrics generated!");
      } else if (type === "background") {
        toast.success("Visual concept generated!");
      } else {
        toast.success("Track description generated!");
      }
    } catch (err: any) {
      const msg = err?.message || "Generation failed";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  }, [project, updateProject]);

  return { project, updateProject, saveProject, generateAI, isGenerating, generatedContent, generationType, loadingProject };
}
