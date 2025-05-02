
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
        }
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="w-full bg-gradient-to-r from-[#9b87f5] to-[#8a74e8] p-4 shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Mini Task Hub</h1>
        {profile && (
          <div className="text-white mt-2 md:mt-0">
            Welcome, <span className="font-semibold">{profile.username || user?.email?.split('@')[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleBar;
