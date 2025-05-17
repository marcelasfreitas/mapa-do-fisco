import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  import type { User } from '@supabase/supabase-js';
const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push('/login');
      } else {
        setUser(data.user);
      }
    };
    getSession();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (!user) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {user.email}</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}


