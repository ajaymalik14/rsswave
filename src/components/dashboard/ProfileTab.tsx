
import React from 'react';
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from "./types/profile-types";
import { AvatarUpload } from "./profile/AvatarUpload";
import { UsernameForm } from "./profile/UsernameForm";
import { PasswordForm } from "./profile/PasswordForm";

export function ProfileTab() {
  const { user } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  if (profileLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
        <div className="space-y-4">
          <AvatarUpload profile={profile} />
          <UsernameForm profile={profile} />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Security</h3>
        <div className="space-y-4">
          <PasswordForm />
        </div>
      </Card>
    </div>
  );
}
