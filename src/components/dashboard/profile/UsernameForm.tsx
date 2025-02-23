
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Profile } from "../types/profile-types";

export function UsernameForm({ profile }: { profile: Profile | null }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (values: { username: string }) => {
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
        description: "Your username has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update username: " + error.message,
      });
    },
  });

  const handleUpdateProfile = async () => {
    if (!username || !user?.id) return;
    updateProfileMutation.mutate({ username });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button onClick={handleUpdateProfile}>Update Username</Button>
    </div>
  );
}
