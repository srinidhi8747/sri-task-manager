
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface Profile {
  id: string;
  username: string;
}

const TitleBar = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setProfile(data);
        } else if (user.user_metadata && user.user_metadata.username) {
          // Fallback to user metadata if profile doesn't exist
          setProfile({
            id: user.id,
            username: user.user_metadata.username
          });
        } else {
          // Last resort: extract name from email
          const username = user.email ? user.email.split('@')[0] : 'User';
          setProfile({
            id: user.id,
            username: username
          });
        }
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="w-full bg-gradient-to-r from-[#9b87f5] to-[#8a74e8] p-4 shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center">
          <SidebarTrigger className="mr-2 md:hidden" />
          <h1 className="text-2xl font-bold text-white">Mini Task Hub</h1>
        </div>
        {profile && (
          <div className="text-white mt-2 md:mt-0">
            Welcome, <span className="font-semibold">{profile.username}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleBar;
