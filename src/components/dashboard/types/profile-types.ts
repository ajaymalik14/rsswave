
export interface Profile {
  username: string | null;
  avatar_url: string | null;
}

export interface ProfileFormProps {
  profile: Profile | null;
  isLoading: boolean;
}
