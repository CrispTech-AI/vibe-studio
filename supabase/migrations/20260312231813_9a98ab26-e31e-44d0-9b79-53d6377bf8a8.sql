-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Project',
  genre TEXT,
  audio_prompt TEXT,
  bg_prompt TEXT,
  bg_style TEXT,
  lyrics TEXT,
  aspect_ratio TEXT DEFAULT '9:16',
  lip_sync_enabled BOOLEAN DEFAULT false,
  avatar_style TEXT DEFAULT 'realistic',
  ai_generated_audio_url TEXT,
  ai_generated_bg_url TEXT,
  uploaded_audio_url TEXT,
  uploaded_bg_url TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generated tracks table
CREATE TABLE public.generated_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  prompt TEXT NOT NULL,
  genre TEXT,
  ai_response TEXT,
  lyrics_suggestion TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tracks" ON public.generated_tracks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tracks" ON public.generated_tracks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tracks" ON public.generated_tracks FOR DELETE USING (auth.uid() = user_id);