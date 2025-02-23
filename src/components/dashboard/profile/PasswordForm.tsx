
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function PasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();

  const handlePasswordChange = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      setNewPassword('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password: " + error.message,
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="new-password">New Password</Label>
      <Input
        id="new-password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
      />
      <Button onClick={handlePasswordChange}>Change Password</Button>
    </div>
  );
}
