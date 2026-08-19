import React, { useState } from 'react';

// ============================================================================
// --- ТЕСТОВЫЕ ДАННЫЕ (БАЗА ДАННЫХ) ---
// ============================================================================
const initialFacilities = [
  { id: 1, name: "ТЦ «Галерея»", address: "Лиговский пр., 30", risk_level: "Высокий" },
  { id: 2, name: "Школа №15", address: "ул. Ленина, 45", risk_level: "Средний" },
  { id: 3, name: "Складской комплекс «Альфа»", address: "Промзона 3", risk_level: "Высокий" },
  { id: 4, name: "Бизнес-центр «Северная Башня»", address: "ул. Гагарина, 12", risk_level: "Значительный" }
];

const initialInspectors = [
  { id: 1, full_name: "Иванов П.С.", rank: "Капитан внутренней службы", phone: "+7 (999) 123-45-67", email: "ivanov@mchs.gov.ru", role: "Администратор" },
  { id: 2, full_name: "Смирнова А.В.", rank: "Старший лейтенант", phone: "+7 (900) 765-43-21", email: "smirnova@mchs.gov.ru", role: "Старший инспектор" },
  { id: 3, full_name: "Петров В.В.", rank: "Лейтенант", phone: "+7 (900) 111-22-33", email: "petrov@mchs.gov.ru", role: "Инспектор" }
];

const initialEquipment = [
  { id: 1, facility_id: 1, type: "Огнетушитель порошковый ОП-5", status: "Исправен", last_check_date: "2023-10-15" },
  { id: 2, facility_id: 1, type: "Пожарная сигнализация «Болид»", status: "Требует ремонта", last_check_date: "2023-09-10" },
  { id: 3, facility_id: 2, type: "Огнетушитель углекислотный ОУ-3", status: "Исправен", last_check_date: "2023-11-20" },
  { id: 4, facility_id: 3, type: "Дренчерная система пожаротушения", status: "Исправен", last_check_date: "2023-12-01" }
];

const initialInspections = [
  { id: 1, facility_id: 1, inspector_id: 1, date: "2023-12-01", result: "Не пройдена", violations: "Заблокирован эвакуационный выход" },
  { id: 2, facility_id: 2, inspector_id: 2, date: "2023-12-05", result: "Пройдена", violations: "Нарушений не выявлено" },
  { id: 3, facility_id: 3, inspector_id: 1, date: "2023-12-10", result: "Не пройдена", violations: "Неисправен пожарный гидрант" }
];

// ============================================================================
// --- ИКОНКИ И ИНТЕРФЕЙСНЫЕ ЭЛЕМЕНТЫ ---
// ============================================================================
const Icons = {
  Building: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
  Clipboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  UserCheck: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
};

// ============================================================================
// --- ФОРМА АВТОРИЗАЦИИ И РЕГИСТРАЦИИ ---
// ============================================================================
const AuthScreen = ({ onLogin, onRegister }) => {
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', full_name: '', rank: 'Лейтенант внутренней службы', phone: '', role: 'Инспектор' });
  const [authError, setAuthError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    if (authMode === 'register') {
      const error = onRegister(authForm);
      if (error) setAuthError(error);
    } else {
      const error = onLogin(authForm.email, authForm.password);
      if (error) setAuthError(error);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-900 items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-slate-800">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg mb-3">
            <Icons.Shield />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ПожНадзор<span className="text-red-600">.pro</span></h1>
          <p className="text-xs text-gray-500 mt-1">Информационная система государственного надзора</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            type="button" 
            onClick={() => { setAuthMode('login'); setAuthError(''); }} 
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${authMode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Вход
          </button>
          <button 
            type="button" 
            onClick={() => { setAuthMode('register'); setAuthError(''); }} 
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${authMode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Регистрация
          </button>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center font-medium">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">ФИО инспектора</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Иванов И.И." 
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-gray-50" 
                  value={authForm.full_name} 
                  onChange={(e) => setAuthForm({...authForm, full_name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Звание</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-gray-50" 
                  value={authForm.rank} 
                  onChange={(e) => setAuthForm({...authForm, rank: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Телефон</label>
                <input 
                  type="text" 
                  placeholder="+7 (999) 000-00-00" 
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-gray-50" 
                  value={authForm.phone} 
                  onChange={(e) => setAuthForm({...authForm, phone: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Роль в системе</label>
            <select 
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-gray-50" 
              value={authForm.role} 
              onChange={(e) => setAuthForm({...authForm, role: e.target.value})}
            >
              <option value="Администратор">Администратор</option>
              <option value="Старший инспектор">Старший инспектор</option>
              <option value="Инспектор">Инспектор</option>
            </select>
          </div>
        </>
      )}
      <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Электронная почта</label>
            <input 
              type="email" 
              required 
              placeholder="ivanov@mchs.gov.ru" 
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-gray-50" 
              value={authForm.email} 
              onChange={(e) => setAuthForm({...authForm, email: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Пароль</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-gray-50" 
              value={authForm.password} 
              onChange={(e) => setAuthForm({...authForm, password: e.target.value})} 
            />
          </div>
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-md cursor-pointer mt-2">
            {authMode === 'register' ? 'Зарегистрироваться' : 'Войти в систему'}
          </button>
        </form>

        {authMode === 'login' && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">Тестовый логин: <span className="text-gray-600 font-medium">ivanov@mchs.gov.ru</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// --- БОКОВОЕ МЕНЮ (SIDEBAR) ---
// ============================================================================
const Sidebar = ({ activeTab, setActiveTab, currentUser, onLogout }) => (
  <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
    <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
      <div className="p-2.5 bg-red-600 rounded-xl shadow-md">
        <Icons.Shield />
      </div>
      <div>
        <h1 className="text-lg font-bold tracking-tight">ПожНадзор<span className="text-red-500">.pro</span></h1>
        <p className="text-[10px] text-slate-400">ГПН МЧС России</p>
      </div>
    </div>

    <nav className="flex-1 px-4 py-4 space-y-1">
      {[
        { id: 'dashboard', icon: Icons.Building, label: 'Главная панель' },
        { id: 'facilities', icon: Icons.Building, label: 'Объекты' },
        { id: 'inspections', icon: Icons.Clipboard, label: 'Журнал проверок' },
        { id: 'inspectors', icon: Icons.Users, label: 'Инспекторы' },
        { id: 'equipment', icon: Icons.AlertTriangle, label: 'Оборудование' },
      ].map((item) => (
        <button 
          key={item.id}
          onClick={() => setActiveTab(item.id)} 
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${activeTab === item.id ? 'bg-red-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
        >
          <item.icon /> <span>{item.label}</span>
        </button>
      ))}
    </nav>

    <div className="p-4 border-t border-slate-800 flex items-center justify-between">
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="w-9 h-9 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-red-400">
          <Icons.UserCheck />
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold truncate text-white">{currentUser.full_name}</p>
          <p className="text-[10px] text-slate-400 truncate">{currentUser.rank} • {currentUser.role}</p>
        </div>
      </div>
      <button onClick={onLogout} title="Выйти" className="p-2 text-slate-400 hover:text-red-400 transition-colors cursor-pointer">
        <Icons.LogOut />
      </button>
    </div>
  </aside>
);

// ============================================================================
// --- ГЛАВНАЯ ПАНЕЛЬ (DASHBOARD) ---
// ============================================================================
const Dashboard = ({ facilities, inspectors, inspections, equipment, getFacilityName, getInspectorName, setActiveTab }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center mb-2">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Главная панель</h2>
        <p className="text-sm text-gray-500">Сводные показатели пожарной безопасности и проверок</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div onClick={() => setActiveTab('facilities')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Icons.Building /></div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Объектов на учете</p>
          <p className="text-2xl font-bold text-gray-800">{facilities.length}</p>
        </div>
      </div>
      <div onClick={() => setActiveTab('inspectors')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-md hover:border-green-200 transition-all">
        <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Icons.Users /></div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Инспекторский состав</p>
          <p className="text-2xl font-bold text-gray-800">{inspectors.length}</p>
        </div>
      </div>
      <div onClick={() => setActiveTab('inspections')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-md hover:border-red-200 transition-all">
        <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Icons.AlertTriangle /></div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Выявлено нарушений</p>
          <p className="text-2xl font-bold text-gray-800">{inspections.filter(i => i.result === 'Не пройдена').length}</p>
        </div>
      </div>
      <div onClick={() => setActiveTab('equipment')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-md hover:border-purple-200 transition-all">
        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Icons.Shield /></div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Средств защиты</p>
          <p className="text-2xl font-bold text-gray-800">{equipment.length}</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Последние проведенные проверки</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 rounded-tl-xl">Дата</th>
              <th className="px-4 py-3">Объект</th>
              <th className="px-4 py-3">Инспектор</th>
              <th className="px-4 py-3 rounded-tr-xl">Статус</th>
            </tr>
          </thead>
          <tbody>
            {inspections.slice(-3).reverse().map(insp => (
              <tr key={insp.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3 font-medium">{insp.date}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">{getFacilityName(insp.facility_id)}</td>
                <td className="px-4 py-3">{getInspectorName(insp.inspector_id)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${insp.result === 'Пройдена' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {insp.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ============================================================================
// --- УНИВЕРСАЛЬНОЕ МОДАЛЬНОЕ ОКНО (CRUD) ---
// ============================================================================
const GenericFormModal = ({ title, fields, initialData, onSave, onClose }) => {
  const [formData, setFormData] = useState(initialData || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-2xl font-semibold">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(field => (
            <div key={field.name}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{field.label}</label>
              {field.type === 'select' ? (
                <select 
                  required={field.required !== false}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-gray-50" 
                  value={formData[field.name] || ''} 
                  onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                >
                  <option value="" disabled>Выберите...</option>
                  {field.options.map(opt => <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>)}
                </select>
              ) : (
                <input 
                  type={field.type || 'text'} 
                  required={field.required !== false}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-gray-50" 
                  value={formData[field.name] || ''} 
                  onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} 
                />
              )}
            </div>
          ))}
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium cursor-pointer transition-colors text-sm">Отмена</button>
            <button type="submit" className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl font-medium cursor-pointer transition-colors shadow-sm text-sm">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// --- ТАБЛИЦА ОБЪЕКТОВ ---
// ============================================================================
const FacilitiesList = ({ facilities, canManage, onAdd, onEdit, onDelete }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Учет объектов</h2>
        <p className="text-sm text-gray-500">Реестр поднадзорных зданий, сооружений и категорий риска</p>
      </div>
      {canManage && (
        <button onClick={onAdd} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl flex items-center text-sm font-medium transition-colors shadow-sm cursor-pointer">
          <Icons.Plus /> <span className="ml-2">Добавить объект</span>
        </button>
      )}
    </div>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Наименование объекта</th>
            <th className="px-6 py-4">Адрес</th>
            <th className="px-6 py-4">Категория риска</th>
            {canManage && <th className="px-6 py-4 text-right">Действия</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {facilities.map(fac => (
            <tr key={fac.id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4 font-medium">{fac.id}</td>
              <td className="px-6 py-4 text-gray-900 font-semibold">{fac.name}</td>
              <td className="px-6 py-4">{fac.address}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${fac.risk_level === 'Высокий' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {fac.risk_level}
                </span>
              </td>
              {canManage && (
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => onEdit(fac)} title="Редактировать" className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"><Icons.Edit /></button>
                  <button onClick={() => onDelete(fac.id)} title="Удалить" className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"><Icons.Trash /></button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ============================================================================
// --- ЖУРНАЛ ПРОВЕРОК ---
// ============================================================================
const InspectionsList = ({ inspections, getFacilityName, getInspectorName, onAddClick }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Журнал проверок</h2>
        <p className="text-sm text-gray-500">Регистрация результатов инспекций и фиксация нарушений</p>
      </div>
      <button 
        onClick={onAddClick} 
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl flex items-center text-sm font-medium transition-colors shadow-sm cursor-pointer"
      >
        <Icons.Plus /> <span className="ml-2">Добавить проверку</span>
      </button>
    </div>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Дата</th>
            <th className="px-6 py-4">Объект</th>
            <th className="px-6 py-4">Инспектор</th>
            <th className="px-6 py-4">Результат</th>
            <th className="px-6 py-4">Зафиксированные нарушения</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {inspections.map(insp => (
            <tr key={insp.id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4 font-medium">{insp.id}</td>
              <td className="px-6 py-4">{insp.date}</td>
              <td className="px-6 py-4 text-gray-900 font-semibold">{getFacilityName(insp.facility_id)}</td>
              <td className="px-6 py-4">{getInspectorName(insp.inspector_id)}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${insp.result === 'Пройдена' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {insp.result}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-700">{insp.violations || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ============================================================================
// --- РЕЕСТР ИНСПЕКТОРОВ ---
// ============================================================================
const InspectorsList = ({ inspectors, canManage, onAdd, onEdit, onDelete }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Личный состав</h2>
        <p className="text-sm text-gray-500">Сотрудники государственного пожарного надзора</p>
      </div>
      {canManage && (
        <button onClick={onAdd} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl flex items-center text-sm font-medium transition-colors shadow-sm cursor-pointer">
          <Icons.Plus /> <span className="ml-2">Добавить сотрудника</span>
        </button>
      )}
    </div>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">ФИО</th>
            <th className="px-6 py-4">Звание / Роль</th>
            <th className="px-6 py-4">Контактный телефон</th>
            <th className="px-6 py-4">Email</th>
            {canManage && <th className="px-6 py-4 text-right">Действия</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {inspectors.map(insp => (
            <tr key={insp.id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4 font-medium">{insp.id}</td>
              <td className="px-6 py-4 text-gray-900 font-semibold">{insp.full_name}</td>
              <td className="px-6 py-4">
                <div>{insp.rank}</div>
                <div className="text-xs text-gray-400 mt-0.5">{insp.role || 'Инспектор'}</div>
              </td>
              <td className="px-6 py-4">{insp.phone}</td>
              <td className="px-6 py-4 text-gray-600">{insp.email}</td>
              {canManage && (
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => onEdit(insp)} title="Редактировать" className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"><Icons.Edit /></button>
                  <button onClick={() => onDelete(insp.id)} title="Удалить" className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"><Icons.Trash /></button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ============================================================================
// --- ОБОРУДОВАНИЕ И СРЕДСТВА ЗАЩИТЫ ---
// ============================================================================
const EquipmentList = ({ equipment, facilities, getFacilityName, canManage, onAdd, onEdit, onDelete }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Противопожарное оборудование</h2>
        <p className="text-sm text-gray-500">Учет систем и первичных средств пожаротушения на объектах</p>
      </div>
      {canManage && facilities.length > 0 && (
        <button onClick={onAdd} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl flex items-center text-sm font-medium transition-colors shadow-sm cursor-pointer">
          <Icons.Plus /> <span className="ml-2">Добавить оборудование</span>
        </button>
      )}
    </div>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Объект</th>
            <th className="px-6 py-4">Тип оборудования</th>
            <th className="px-6 py-4">Текущий статус</th>
            <th className="px-6 py-4">Дата последней поверки</th>
            {canManage && <th className="px-6 py-4 text-right">Действия</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {equipment.map(eq => (
            <tr key={eq.id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4 font-medium">{eq.id}</td>
              <td className="px-6 py-4 text-gray-900 font-semibold">{getFacilityName(eq.facility_id)}</td>
              <td className="px-6 py-4">{eq.type}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${eq.status === 'Исправен' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {eq.status}
                </span>
              </td>
              <td className="px-6 py-4">{eq.last_check_date}</td>
              {canManage && (
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => onEdit(eq)} title="Редактировать" className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"><Icons.Edit /></button>
                  <button onClick={() => onDelete(eq.id)} title="Удалить" className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"><Icons.Trash /></button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ============================================================================
// --- МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ПРОВЕРКИ ---
// ============================================================================
const AddInspectionModal = ({ facilities, currentUser, onClose, onSave }) => {
  const [newInspection, setNewInspection] = useState({ 
    facility_id: facilities[0]?.id || 1, 
    inspector_id: currentUser ? currentUser.id : 1, 
    date: new Date().toISOString().split('T')[0], 
    result: 'Пройдена', 
    violations: '' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newInspection);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-xl font-bold text-gray-800">Внести акт проверки</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-2xl font-semibold">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Проверяемый объект</label>
            <select 
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-gray-50" 
              value={newInspection.facility_id} 
              onChange={(e) => setNewInspection({...newInspection, facility_id: e.target.value})}
            >
              {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Ответственный инспектор</label>
            <input 
              type="text" 
              disabled 
              className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-100 text-gray-600 cursor-not-allowed font-medium" 
              value={currentUser ? currentUser.full_name : 'Инспектор'} 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Дата проверки</label>
            <input 
              type="date" 
              required 
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-gray-50" 
              value={newInspection.date} 
              onChange={(e) => setNewInspection({...newInspection, date: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Результат инспекции</label>
            <select 
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-gray-50" 
              value={newInspection.result} 
              onChange={(e) => setNewInspection({...newInspection, result: e.target.value})}
            >
              <option value="Пройдена">Пройдена</option>
              <option value="Не пройдена">Не пройдена</option>
            </select>
          </div>
          {newInspection.result === 'Не пройдена' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Выявленные нарушения</label>
              <textarea 
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-gray-50" 
                rows="3" 
                value={newInspection.violations} 
                onChange={(e) => setNewInspection({...newInspection, violations: e.target.value})} 
                placeholder="Опишите зафиксированные нарушения..."
              ></textarea>
            </div>
          )}
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium cursor-pointer transition-colors text-sm">
              Отмена
            </button>
            <button type="submit" className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl font-medium cursor-pointer transition-colors shadow-sm text-sm">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// --- ГЛАВНЫЙ КОМПОНЕНТ ПРИЛОЖЕНИЯ ---
// ============================================================================
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Состояние для универсального CRUD-модального окна
  const [genericModal, setGenericModal] = useState({ isOpen: false, type: null, data: null });

  // Стейты реляционной структуры базы данных
  const [facilities, setFacilities] = useState(initialFacilities);
  const [inspectors, setInspectors] = useState(initialInspectors);
  const [equipment, setEquipment] = useState(initialEquipment);
  const [inspections, setInspections] = useState(initialInspections);

  // Хелперы разрешений внешних ключей (JOIN на стороне клиента)
  const getFacilityName = (id) => facilities.find(f => f.id === parseInt(id))?.name || 'Неизвестно';
  const getInspectorName = (id) => inspectors.find(i => i.id === parseInt(id))?.full_name || 'Неизвестно';

  // Права доступа (Роли: Администратор, Старший инспектор, Инспектор)
  const canManageInspectors = currentUser?.role === 'Администратор';
  const canManageFacilities = currentUser?.role === 'Администратор' || currentUser?.role === 'Старший инспектор';
  const canManageEquipment = currentUser?.role === 'Администратор' || currentUser?.role === 'Старший инспектор';

  // Вход и регистрация
  const handleLogin = (email, password) => {
    const inspector = inspectors.find(i => i.email === email);
    if (!inspector) return 'Пользователь с такой почтой не найден';
    setCurrentUser(inspector);
    return null;
  };

  const handleRegister = (formData) => {
    if (!formData.email || !formData.password || !formData.full_name) return 'Заполните обязательные поля';
    if (inspectors.some(i => i.email === formData.email)) return 'Пользователь с таким email уже зарегистрирован';
    
    const newInspector = { id: inspectors.length > 0 ? Math.max(...inspectors.map(i => i.id)) + 1 : 1, ...formData };
    setInspectors([...inspectors, newInspector]);
    setCurrentUser(newInspector);
    return null;
  };

  const handleAddInspection = (data) => {
    const newId = inspections.length > 0 ? Math.max(...inspections.map(i => i.id)) + 1 : 1;
    setInspections([...inspections, { ...data, id: newId, facility_id: parseInt(data.facility_id) }]);
    setIsModalOpen(false);
  };

  // Универсальные CRUD-операции
  const handleSaveGeneric = (formData) => {
    const { type, data } = genericModal;
    const isEdit = !!data?.id;
    
    if (type === 'facility') {
      if (isEdit) setFacilities(facilities.map(f => f.id === data.id ? { ...formData, id: data.id } : f));
      else setFacilities([...facilities, { ...formData, id: facilities.length > 0 ? Math.max(...facilities.map(i => i.id)) + 1 : 1 }]);
    } else if (type === 'inspector') {
      if (isEdit) setInspectors(inspectors.map(i => i.id === data.id ? { ...formData, id: data.id } : i));
      else setInspectors([...inspectors, { ...formData, id: inspectors.length > 0 ? Math.max(...inspectors.map(i => i.id)) + 1 : 1 }]);
    } else if (type === 'equipment') {
      const equipData = { ...formData, facility_id: parseInt(formData.facility_id) };
      if (isEdit) setEquipment(equipment.map(e => e.id === data.id ? { ...equipData, id: data.id } : e));
      else setEquipment([...equipment, { ...equipData, id: equipment.length > 0 ? Math.max(...equipment.map(i => i.id)) + 1 : 1 }]);
    }
    setGenericModal({ isOpen: false, type: null, data: null });
  };

  const handleDelete = (type, id) => {
    if (type === 'facility') setFacilities(facilities.filter(f => f.id !== id));
    else if (type === 'inspector') setInspectors(inspectors.filter(i => i.id !== id));
    else if (type === 'equipment') setEquipment(equipment.filter(e => e.id !== id));
  };

  // Конфигурации полей для модалок
  const modalConfigs = {
    facility: {
      title: genericModal.data?.id ? 'Редактировать объект' : 'Добавить объект',
      fields: [
        { name: 'name', label: 'Наименование', type: 'text' },
        { name: 'address', label: 'Адрес', type: 'text' },
        { name: 'risk_level', label: 'Категория риска', type: 'select', options: ['Высокий', 'Значительный', 'Средний', 'Умеренный', 'Низкий'] }
      ]
    },
    inspector: {
      title: genericModal.data?.id ? 'Редактировать сотрудника' : 'Добавить сотрудника',
      fields: [
        { name: 'full_name', label: 'ФИО', type: 'text' },
        { name: 'rank', label: 'Звание', type: 'text' },
        { name: 'phone', label: 'Телефон', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'role', label: 'Роль в системе', type: 'select', options: ['Администратор', 'Старший инспектор', 'Инспектор'] }
      ]
    },
    equipment: {
      title: genericModal.data?.id ? 'Редактировать оборудование' : 'Добавить оборудование',
      fields: [
        { name: 'facility_id', label: 'Объект (Здание)', type: 'select', options: facilities.map(f => ({ value: f.id, label: f.name })) },
        { name: 'type', label: 'Тип оборудования', type: 'text' },
        { name: 'status', label: 'Статус', type: 'select', options: ['Исправен', 'Требует ремонта', 'Списан'] },
        { name: 'last_check_date', label: 'Дата последней поверки', type: 'date' }
      ]
    }
  };

  // Экраны авторизации
  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
      
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            facilities={facilities} 
            inspectors={inspectors} 
            inspections={inspections} 
            equipment={equipment} 
            getFacilityName={getFacilityName} 
            getInspectorName={getInspectorName} 
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'facilities' && (
          <FacilitiesList 
            facilities={facilities} 
            canManage={canManageFacilities}
            onAdd={() => setGenericModal({ isOpen: true, type: 'facility', data: { name: '', address: '', risk_level: 'Средний' } })}
            onEdit={(data) => setGenericModal({ isOpen: true, type: 'facility', data })}
            onDelete={(id) => handleDelete('facility', id)}
          />
        )}
        {activeTab === 'inspections' && (
          <InspectionsList 
            inspections={inspections} 
            getFacilityName={getFacilityName} 
            getInspectorName={getInspectorName} 
            onAddClick={() => setIsModalOpen(true)} 
          />
        )}
        {activeTab === 'inspectors' && (
          <InspectorsList 
            inspectors={inspectors} 
            canManage={canManageInspectors}
            onAdd={() => setGenericModal({ isOpen: true, type: 'inspector', data: { full_name: '', rank: '', phone: '', email: '', role: 'Инспектор' } })}
            onEdit={(data) => setGenericModal({ isOpen: true, type: 'inspector', data })}
            onDelete={(id) => handleDelete('inspector', id)}
          />
        )}
        {activeTab === 'equipment' && (
          <EquipmentList 
            equipment={equipment} 
            facilities={facilities}
            getFacilityName={getFacilityName} 
            canManage={canManageEquipment}
            onAdd={() => setGenericModal({ isOpen: true, type: 'equipment', data: { facility_id: facilities[0]?.id || '', type: '', status: 'Исправен', last_check_date: new Date().toISOString().split('T')[0] } })}
            onEdit={(data) => setGenericModal({ isOpen: true, type: 'equipment', data })}
            onDelete={(id) => handleDelete('equipment', id)}
          />
        )}
      </main>

      {isModalOpen && (
        <AddInspectionModal 
          facilities={facilities} 
          currentUser={currentUser} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleAddInspection} 
        />
      )}

      {genericModal.isOpen && (
        <GenericFormModal
          title={modalConfigs[genericModal.type].title}
          fields={modalConfigs[genericModal.type].fields}
          initialData={genericModal.data}
          onSave={handleSaveGeneric}
          onClose={() => setGenericModal({ isOpen: false, type: null, data: null })}
        />
      )}
    </div>
  );
}