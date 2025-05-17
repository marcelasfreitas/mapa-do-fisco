import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

const subjects = [
  "Português", "Matemática", "Legislação Tributária", "Contabilidade",
  "Direito Constitucional", "Direito Administrativo", "Informática", "Atualidades"
];

interface ProgressData {
  [key: string]: {
    studied: boolean;
    review: boolean;
    correct: number;
    total: number;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [progress, setProgress] = useState<ProgressData>({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.push('/login');
      } else {
        setUserEmail(data.user.email || '');
        const stored = localStorage.getItem('study-progress');
        setProgress(stored ? JSON.parse(stored) : {});
      }
    });
  }, [router]);

  const updateProgress = (subject: string, updates: Partial<ProgressData[string]>) => {
    const newData = {
      ...progress,
      [subject]: { ...progress[subject], ...updates }
    };
    setProgress(newData);
    localStorage.setItem('study-progress', JSON.stringify(newData));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Mapa do Fisco 📊</h1>
      <p>Bem-vindo, {userEmail}</p>

      <table border={1} cellPadding={10} style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Matéria</th>
            <th>Estudado</th>
            <th>Revisar</th>
            <th>Acertos</th>
            <th>Total</th>
            <th>%</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map(subject => {
            const data = progress[subject] || { studied: false, review: false, correct: 0, total: 0 };
            const percent = data.total > 0 ? Math.round((data.correct / data.total) * 100) : '-';
            return (
              <tr key={subject}>
                <td>{subject}</td>
                <td>{data.studied ? '✅' : '❌'}</td>
                <td>{data.review ? '🔁' : ''}</td>
                <td>{data.correct}</td>
                <td>{data.total}</td>
                <td>{percent}%</td>
                <td>
                  <button onClick={() => updateProgress(subject, { studied: !data.studied })}>Toggle Estudo</button>
                  <button onClick={() => updateProgress(subject, { review: !data.review })}>Revisar</button>
                  <button onClick={() => updateProgress(subject, { correct: data.correct + 1, total: data.total + 1 })}>✔️</button>
                  <button onClick={() => updateProgress(subject, { total: data.total + 1 })}>❌</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
