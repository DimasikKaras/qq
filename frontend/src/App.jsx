import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import api, { setAccessToken } from './api/axios';

const isManagerRole = (role) => role === 'Администратор' || role === 'Старший инспектор';

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      setAccessToken(data.access_token);
      onLogin();
    } catch {
      setError('Неверный email или пароль');
    }
  };

  return (
    <form onSubmit={submit}>
      <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input type="password" placeholder="Пароль" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <button type="submit">Войти</button>
      {error && <p>{error}</p>}
    </form>
  );
}

function DashboardPage({ facilities, inspections, inspectors }) {
  return (
    <section>
      <h2>Главная панель</h2>
      <p>Объекты: {facilities.length}</p>
      <p>Инспекторы: {inspectors.length}</p>
      <p>Проверки: {inspections.length}</p>
    </section>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [inspectors, setInspectors] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [inspections, setInspections] = useState([]);

  const canManageInspectors = currentUser?.role === 'Администратор';
  const canManageFacilities = useMemo(() => isManagerRole(currentUser?.role), [currentUser?.role]);

  const loadAllData = async () => {
    const [facilitiesRes, inspectorsRes, equipmentRes, inspectionsRes, meRes] = await Promise.all([
      api.get('/facilities'),
      api.get('/inspectors'),
      api.get('/equipment'),
      api.get('/inspections'),
      api.get('/users/me'),
    ]);

    setFacilities(facilitiesRes.data);
    setInspectors(inspectorsRes.data);
    setEquipment(equipmentRes.data);
    setInspections(inspectionsRes.data);
    setCurrentUser(meRes.data);
  };

  useEffect(() => {
    const onForbidden = () => alert('Недостаточно прав для выполнения действия');
    window.addEventListener('api:forbidden', onForbidden);
    return () => window.removeEventListener('api:forbidden', onForbidden);
  }, []);

  useEffect(() => {
    if (!authorized) return;
    loadAllData().catch(() => {
      setAuthorized(false);
      setAccessToken(null);
      navigate('/login');
    });
  }, [authorized]);

  const createInspection = async (payload) => {
    const { data } = await api.post('/inspections', payload);
    setInspections((prev) => [data, ...prev]);
  };

  if (!authorized) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => setAuthorized(true)} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardPage facilities={facilities} inspectors={inspectors} inspections={inspections} />} />
      <Route
        path="/inspections"
        element={<button onClick={() => createInspection({ facility_id: facilities[0]?.id, date: new Date().toISOString().slice(0, 10), result: 'Пройдена', violations: '' })}>Добавить проверку</button>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
