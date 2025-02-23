
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Profile } from "../types/profile-types";

export function AvatarUpload({ profile }: { profile: Profile | null }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (avatarFile) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [avatarFile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (values: { avatar_url: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', user?.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Profile updated",
        description: "Your avatar has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update avatar: " + error.message,
      });
    },
  });

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) return;

    try {
      setIsUploading(true);
      
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      updateProfileMutation.mutate({ avatar_url: publicUrl });
      setAvatarFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload avatar: " + error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Profile Picture</Label>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-100">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="h-full w-full object-cover"
            />
          ) : profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          />
          <Button 
            onClick={handleAvatarUpload}
            disabled={!avatarFile || isUploading}
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
