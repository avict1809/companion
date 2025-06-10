// hooks/useCompanions.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useCompanions = () => {
  const [companions, setCompanions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('companions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCompanions(data || []);
      } catch (error) {
        console.error('Error fetching companions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanions();
  }, []);

  return { companions, loading };
};