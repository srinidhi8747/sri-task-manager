
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Layout } from 'lucide-react';

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
    <div className="w-full bg-gradient-to-r from-[#9b87f5] to-[#8a74e8] px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden bg-white/20 hover:bg-white/30 text-white rounded-md p-1.5 transition-colors" />
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-md">
              <Layout className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Mini Task Hub</h1>
          </div>
        </div>
        {profile && (
          <div className="text-white/90 text-sm md:text-base">
            Welcome, <span className="font-medium">{profile.username}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TitleBar;
