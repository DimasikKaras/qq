import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import api, { setAccessToken } from './api/axios';
import './App.css';

const RISK_LEVELS = ['Высокий', 'Значительный', 'Средний', 'Умеренный', 'Низкий'];
const INSPECTION_RESULTS = ['Пройдена', 'Не пройдена'];

const NAV_ITEMS = [
  { path: '/', label: 'Главная', icon: '📊' },
  { path: '/facilities', label: 'Объекты', icon: '🏢' },
  { path: '/inspections', label: 'Инспекции', icon: '📝' },
  { path: '/inspectors', label: 'Инспекторы', icon: '👥' },
  { path: '/equipment', label: 'Оборудование', icon: '🧯' },
  { path: '/profile', label: 'Профиль', icon: '👤' },
];

const isManagerRole = (role) => role === 'Администратор' || role === 'Старший инспектор';

const getErrorMessage = (error, fallback) => {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail.length) return detail[0]?.msg || fallback;
  return fallback;
};

function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    rank: 'Лейтенант внутренней службы',
    phone: '',
    role: 'Инспектор',
    email: '',
    password: '',
  });

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await api.post('/auth/register', form);
      }
      const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
      setAccessToken(data.access_token);
      onLogin();
    } catch (submitError) {
      setError(getErrorMessage(submitError, 'Не удалось выполнить запрос'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1>ПожНадзор.pro</h1>
        <p>Система контроля объектов и инспекций</p>

        <div className="auth-mode-switch">
          <button className={mode === 'login' ? 'active' : ''} type="button" onClick={() => setMode('login')}>
            Вход
          </button>
          <button className={mode === 'register' ? 'active' : ''} type="button" onClick={() => setMode('register')}>
            Регистрация
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={submit} className="auth-form">
          {mode === 'register' && (
            <>
              <input
                type="text"
                placeholder="ФИО"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Звание"
                value={form.rank}
                onChange={(e) => setForm({ ...form, rank: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Телефон"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="Администратор">Администратор</option>
                <option value="Старший инспектор">Старший инспектор</option>
                <option value="Инспектор">Инспектор</option>
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Пароль (минимум 8 символов)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength={8}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : mode === 'register' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}

function DashboardPage({ facilities, inspections, inspectors }) {
  return (
    <section className="page-grid">
      <div className="stat-card">
        <h3>Объекты</h3>
        <p>{facilities.length}</p>
      </div>
      <div className="stat-card">
        <h3>Инспекторы</h3>
        <p>{inspectors.length}</p>
      </div>
      <div className="stat-card">
        <h3>Проверки</h3>
        <p>{inspections.length}</p>
      </div>

      <div className="panel panel-wide">
        <h3>Последние проверки</h3>
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Объект</th>
              <th>Результат</th>
            </tr>
          </thead>
          <tbody>
            {inspections.slice(0, 5).map((inspection) => (
              <tr key={inspection.id}>
                <td>{inspection.date}</td>
                <td>{inspection.facility_name || `Объект #${inspection.facility_id}`}</td>
                <td>{inspection.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FacilitiesPage({ facilities, canManageFacilities, form, setForm, onSubmit, onEdit, onCancelEdit, loading }) {
  return (
    <section className="stacked-page">
      {canManageFacilities && (
        <form className="panel" onSubmit={onSubmit}>
          <h3>{form.id ? 'Редактировать объект' : 'Добавить объект'}</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Название"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Адрес"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
            <select value={form.risk_level} onChange={(e) => setForm({ ...form, risk_level: e.target.value })}>
              {RISK_LEVELS.map((risk) => (
                <option key={risk} value={risk}>{risk}</option>
              ))}
            </select>
            <button type="submit" disabled={loading}>{loading ? 'Сохранение...' : form.id ? 'Сохранить' : 'Добавить'}</button>
          </div>
          {form.id && (
            <button type="button" className="secondary-btn" onClick={onCancelEdit}>
              Отменить редактирование
            </button>
          )}
        </form>
      )}

      <div className="panel">
        <h3>Список объектов</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Адрес</th>
              <th>Риск</th>
              {canManageFacilities && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {facilities.map((facility) => (
              <tr key={facility.id}>
                <td>{facility.id}</td>
                <td>{facility.name}</td>
                <td>{facility.address}</td>
                <td>{facility.risk_level}</td>
                {canManageFacilities && (
                  <td>
                    <button type="button" className="secondary-btn" onClick={() => onEdit(facility)}>Редактировать</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InspectionsPage({ facilities, inspections, form, setForm, onSubmit, loading }) {
  return (
    <section className="stacked-page">
      <form className="panel" onSubmit={onSubmit}>
        <h3>Добавить проверку</h3>
        <div className="form-grid">
          <select value={form.facility_id} onChange={(e) => setForm({ ...form, facility_id: Number(e.target.value) })} required>
            <option value="">Выберите объект</option>
            {facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>{facility.name}</option>
            ))}
          </select>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <select value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })}>
            {INSPECTION_RESULTS.map((result) => (
              <option key={result} value={result}>{result}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Нарушения"
            value={form.violations}
            onChange={(e) => setForm({ ...form, violations: e.target.value })}
          />
          <button type="submit" disabled={loading}>{loading ? 'Сохранение...' : 'Добавить проверку'}</button>
        </div>
      </form>

      <div className="panel">
        <h3>Журнал проверок</h3>
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Объект</th>
              <th>Инспектор</th>
              <th>Результат</th>
              <th>Нарушения</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((inspection) => (
              <tr key={inspection.id}>
                <td>{inspection.date}</td>
                <td>{inspection.facility_name || `Объект #${inspection.facility_id}`}</td>
                <td>{inspection.inspector_name || `Инспектор #${inspection.inspector_id}`}</td>
                <td>{inspection.result}</td>
                <td>{inspection.violations || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InspectorsPage({ inspectors }) {
  return (
    <section className="panel">
      <h3>Инспекторы</h3>
      <div className="inspector-grid">
        {inspectors.map((inspector) => (
          <article key={inspector.id} className="inspector-card">
            <h4>{inspector.full_name}</h4>
            <p>{inspector.rank}</p>
            <p>{inspector.email}</p>
            <p>{inspector.phone || 'Телефон не указан'}</p>
            <span>{inspector.role}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function EquipmentPage({ equipment, facilitiesById }) {
  return (
    <section className="panel">
      <h3>Оборудование</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Объект</th>
            <th>Тип</th>
            <th>Статус</th>
            <th>Дата проверки</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{facilitiesById[item.facility_id]?.name || `Объект #${item.facility_id}`}</td>
              <td>{item.type}</td>
              <td>{item.status}</td>
              <td>{item.last_check_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authorized, setAuthorized] = useState(false);
  const [flash, setFlash] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [inspectors, setInspectors] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [facilityForm, setFacilityForm] = useState({ id: null, name: '', address: '', risk_level: RISK_LEVELS[0] });
  const [inspectionForm, setInspectionForm] = useState({
    facility_id: '',
    date: new Date().toISOString().slice(0, 10),
    result: INSPECTION_RESULTS[0],
    violations: '',
  });
  const [savingFacility, setSavingFacility] = useState(false);
  const [savingInspection, setSavingInspection] = useState(false);

  const canManageFacilities = useMemo(() => isManagerRole(currentUser?.role), [currentUser?.role]);

  const facilitiesById = useMemo(
    () => Object.fromEntries(facilities.map((facility) => [facility.id, facility])),
    [facilities]
  );

  const inspectorsById = useMemo(
    () => Object.fromEntries(inspectors.map((inspector) => [inspector.id, inspector])),
    [inspectors]
  );

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
    const onForbidden = () => setFlash('Недостаточно прав для выполнения действия');
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
  }, [authorized, navigate]);

  useEffect(() => {
    if (!flash) return;
    const timeout = setTimeout(() => setFlash(''), 3500);
    return () => clearTimeout(timeout);
  }, [flash]);

  const enrichInspections = useMemo(
    () => inspections.map((inspection) => ({
      ...inspection,
      facility_name: facilitiesById[inspection.facility_id]?.name,
      inspector_name: inspectorsById[inspection.inspector_id]?.full_name,
    })),
    [facilitiesById, inspections, inspectorsById]
  );

  const saveFacility = async (event) => {
    event.preventDefault();
    setSavingFacility(true);
    try {
      if (facilityForm.id) {
        const { data } = await api.put(`/facilities/${facilityForm.id}`, {
          name: facilityForm.name,
          address: facilityForm.address,
          risk_level: facilityForm.risk_level,
        });
        setFacilities((prev) => prev.map((item) => (item.id === data.id ? data : item)));
      } else {
        const { data } = await api.post('/facilities', {
          name: facilityForm.name,
          address: facilityForm.address,
          risk_level: facilityForm.risk_level,
        });
        setFacilities((prev) => [...prev, data]);
      }
      setFacilityForm({ id: null, name: '', address: '', risk_level: RISK_LEVELS[0] });
    } catch (error) {
      setFlash(getErrorMessage(error, 'Не удалось сохранить объект'));
    } finally {
      setSavingFacility(false);
    }
  };

  const saveInspection = async (event) => {
    event.preventDefault();
    setSavingInspection(true);
    try {
      const { data } = await api.post('/inspections', {
        facility_id: inspectionForm.facility_id,
        date: inspectionForm.date,
        result: inspectionForm.result,
        violations: inspectionForm.violations || null,
      });
      setInspections((prev) => [data, ...prev]);
      setInspectionForm((prev) => ({ ...prev, violations: '' }));
    } catch (error) {
      setFlash(getErrorMessage(error, 'Не удалось добавить проверку'));
    } finally {
      setSavingInspection(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
      setAuthorized(false);
      setCurrentUser(null);
      navigate('/login');
    }
  };

  if (!authorized) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => {
          setAuthorized(true);
          navigate('/');
        }} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>ПожНадзор.pro</h2>
        <p>ГПН МЧС России</p>
        <nav>
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                type="button"
                className={isActive ? 'active' : ''}
                onClick={() => navigate(item.path)}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
        <button type="button" className="logout-btn" onClick={logout}>Выход</button>
      </aside>

      <main className="content">
        <header>
          <div>
            <h1>{NAV_ITEMS.find((item) => item.path === (location.pathname === '/' ? '/' : `/${location.pathname.split('/')[1]}`))?.label || 'Панель'}</h1>
            <p>{currentUser?.full_name} · {currentUser?.role}</p>
          </div>
        </header>

        {flash && <div className="flash-message">{flash}</div>}

        <Routes>
          <Route path="/" element={<DashboardPage facilities={facilities} inspections={enrichInspections} inspectors={inspectors} />} />
          <Route
            path="/facilities"
            element={
              <FacilitiesPage
                facilities={facilities}
                canManageFacilities={canManageFacilities}
                form={facilityForm}
                setForm={setFacilityForm}
                onSubmit={saveFacility}
                onEdit={(facility) => setFacilityForm({ ...facility })}
                onCancelEdit={() => setFacilityForm({ id: null, name: '', address: '', risk_level: RISK_LEVELS[0] })}
                loading={savingFacility}
              />
            }
          />
          <Route
            path="/inspections"
            element={
              <InspectionsPage
                facilities={facilities}
                inspections={enrichInspections}
                form={inspectionForm}
                setForm={setInspectionForm}
                onSubmit={saveInspection}
                loading={savingInspection}
              />
            }
          />
          <Route path="/inspectors" element={<InspectorsPage inspectors={inspectors} />} />
          <Route path="/equipment" element={<EquipmentPage equipment={equipment} facilitiesById={facilitiesById} />} />
          <Route
            path="/profile"
            element={
              <section className="panel profile-card">
                <h3>Профиль</h3>
                <p><strong>ФИО:</strong> {currentUser?.full_name}</p>
                <p><strong>Email:</strong> {currentUser?.email}</p>
                <p><strong>Звание:</strong> {currentUser?.rank}</p>
                <p><strong>Роль:</strong> {currentUser?.role}</p>
                <p><strong>Телефон:</strong> {currentUser?.phone || 'Не указан'}</p>
              </section>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
