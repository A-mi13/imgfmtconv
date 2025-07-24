import React, { useState, useEffect } from 'react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    autoConvert: true,
    qualityWebp: 80,
    qualityAvif: 50,
    formatsToConvert: ['jpeg', 'png'],
    convertTo: ['webp', 'avif'],
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');
  const formatOptions = ['jpeg', 'png', 'jpg', 'gif'];
  const convertToOptions = ['webp', 'avif'];

  useEffect(() => {
    fetchSettings();
    fetchStatus();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/imgfmtconv/settings');
      const result = await response.json();
      setSettings(result.data);
    } catch (error) {
      setMessage('Ошибка загрузки настроек');
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await fetch('/imgfmtconv/status');
      const result = await response.json();
      setStatus(result.data);
    } catch (error) {
      // не критично
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/imgfmtconv/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      await response.json();
      setMessage('Настройки сохранены успешно!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Ошибка сохранения настроек');
    }
    setLoading(false);
  };

  const handleBulkConvert = async () => {
    setBulkStatus('Запуск...');
    try {
      const res = await fetch('/imgfmtconv/bulk-convert', { method: 'POST' });
      const data = await res.json();
      setBulkStatus(data.message || 'Готово');
    } catch (e) {
      setBulkStatus('Ошибка bulk-конвертации');
    }
  };

  const handleResetSettings = async () => {
    if (!confirm('Сбросить все настройки к значениям по умолчанию?')) return;
    
    setLoading(true);
    try {
      const response = await fetch('/imgfmtconv/settings/reset', { method: 'POST' });
      const result = await response.json();
      setSettings(result.data);
      setMessage(result.message || 'Настройки сброшены');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Ошибка сброса настроек');
    }
    setLoading(false);
  };

  const handleReloadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/imgfmtconv/settings/reload', { method: 'POST' });
      const result = await response.json();
      setSettings(result.data);
      setMessage(result.message || 'Настройки перезагружены');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Ошибка перезагрузки настроек');
    }
    setLoading(false);
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMultiSelect = (key, value) => {
    setSettings(prev => {
      const arr = prev[key] || [];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value],
      };
    });
  };

  // Стили для текста и элементов
  const colors = {
    bg: '#f8fafc',
    card: '#fff',
    border: '#e2e8f0',
    accent: '#3b82f6',
    accentDark: '#2563eb',
    accentLight: '#60a5fa',
    text: '#22223b',
    textSecondary: '#4b5563',
    textMuted: '#6b7280',
    success: '#059669',
    error: '#dc2626',
    switchOn: '#10b981',
    switchOff: '#d1d5db',
  };

  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'Inter, system-ui, sans-serif',
      maxWidth: 900,
      margin: '0 auto',
      background: colors.bg,
      minHeight: '100vh',
    }}>
      <div style={{
        marginBottom: 24,
        textAlign: 'center',
        background: colors.card,
        padding: '2rem 1rem 1.5rem 1rem',
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: `1px solid ${colors.border}`,
      }}>
        <h1 style={{
          color: colors.accentDark,
          marginBottom: 8,
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: 0.5,
        }}>🖼️ Image Format Converter</h1>
        <div style={{
          color: colors.textMuted,
          fontSize: 16,
          marginBottom: 0,
        }}>Конвертация изображений в WebP/AVIF</div>
      </div>

      {message && (
        <div style={{
          background: message.includes('Ошибка') ? '#fef2f2' : '#f0fdf4',
          border: `1.5px solid ${message.includes('Ошибка') ? colors.error : colors.success}`,
          color: message.includes('Ошибка') ? colors.error : colors.success,
          borderRadius: 10,
          padding: '0.75rem 1.5rem',
          marginBottom: 20,
          fontWeight: 600,
          fontSize: 16,
          textAlign: 'center',
        }}>{message}</div>
      )}

      {/* Настройки */}
      <div style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: '1.5rem 1rem',
        marginBottom: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontSize: 22, marginRight: 10 }}>⚙️</span>
          <span style={{ color: colors.text, fontWeight: 700, fontSize: 20 }}>Настройки</span>
        </div>
        {[{ key: 'enabled', label: 'Включить плагин', desc: 'Глобальное включение/выключение' },
          { key: 'autoConvert', label: 'Автоматическая конвертация при загрузке', desc: 'Конвертировать изображения при загрузке' }].map(item => (
          <div key={item.key} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 10, padding: '8px 0',
          }}>
            <div>
              <div style={{ color: colors.text, fontWeight: 600, fontSize: 16 }}>{item.label}</div>
              <div style={{ color: colors.textMuted, fontSize: 13 }}>{item.desc}</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 28 }}>
              <input type="checkbox" checked={settings[item.key]} onChange={() => handleToggle(item.key)} style={{ display: 'none' }} />
              <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                background: settings[item.key] ? colors.switchOn : colors.switchOff,
                borderRadius: 28, transition: '0.3s',
              }} />
              <span style={{
                position: 'absolute', content: '', height: 20, width: 20,
                left: settings[item.key] ? 24 : 4, bottom: 4,
                background: '#fff', borderRadius: '50%', transition: '0.3s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
              }} />
            </label>
          </div>
        ))}
      </div>

      {/* Форматы */}
      <div style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: '1.5rem 1rem',
        marginBottom: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontSize: 22, marginRight: 10 }}>📄</span>
          <span style={{ color: colors.text, fontWeight: 700, fontSize: 20 }}>Форматы</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 10 }}>
          <span style={{ color: colors.textSecondary, fontWeight: 500, fontSize: 15, minWidth: 180 }}>Форматы для конвертации:</span>
          {formatOptions.map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', marginRight: 12, fontSize: 15, color: colors.text }}>
              <input type="checkbox" checked={settings.formatsToConvert.includes(opt)} onChange={() => handleMultiSelect('formatsToConvert', opt)} style={{ marginRight: 6 }} />
              {opt.toUpperCase()}
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <span style={{ color: colors.textSecondary, fontWeight: 500, fontSize: 15, minWidth: 180 }}>Конвертировать в:</span>
          {convertToOptions.map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', marginRight: 12, fontSize: 15, color: colors.text }}>
              <input type="checkbox" checked={settings.convertTo.includes(opt)} onChange={() => handleMultiSelect('convertTo', opt)} style={{ marginRight: 6 }} />
              {opt.toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      {/* Качество */}
      <div style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: '1.5rem 1rem',
        marginBottom: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontSize: 22, marginRight: 10 }}>🔧</span>
          <span style={{ color: colors.text, fontWeight: 700, fontSize: 20 }}>Качество</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', marginBottom: 10 }}>
          <label style={{ color: colors.textSecondary, fontWeight: 500, fontSize: 15, minWidth: 180 }}>Качество WebP (0-100):</label>
          <input type="number" min={0} max={100} value={settings.qualityWebp} onChange={e => setSettings(prev => ({ ...prev, qualityWebp: Number(e.target.value) }))} style={{
            width: 100, padding: '0.5rem', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 15, color: colors.text, background: colors.card, fontWeight: 500 }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <label style={{ color: colors.textSecondary, fontWeight: 500, fontSize: 15, minWidth: 180 }}>Качество AVIF (0-100):</label>
          <input type="number" min={0} max={100} value={settings.qualityAvif} onChange={e => setSettings(prev => ({ ...prev, qualityAvif: Number(e.target.value) }))} style={{
            width: 100, padding: '0.5rem', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 15, color: colors.text, background: colors.card, fontWeight: 500 }} />
        </div>
      </div>

      <div style={{ textAlign: 'center', paddingBottom: 16 }}>
        {/* Кнопка bulk-конвертации сверху */}
        <button
          onClick={handleBulkConvert}
          disabled={loading}
          style={{
            background: loading ? colors.success : colors.accentLight,
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '1rem 2.5rem',
            fontSize: 16,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px rgba(16, 185, 129, 0.10)',
            outline: 'none',
            marginBottom: 50,
          }}
          onMouseEnter={e => { if (!loading) e.target.style.background = colors.switchOn; }}
          onMouseLeave={e => { if (!loading) e.target.style.background = colors.accentLight; }}
        >Bulk-конвертация</button>
        
        {/* Три кнопки управления настройками в ряд */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              background: loading ? colors.accentLight : colors.accent,
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '1rem 2rem',
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(59, 130, 246, 0.10)',
              outline: 'none',
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background = colors.accentDark; }}
            onMouseLeave={e => { if (!loading) e.target.style.background = colors.accent; }}
          >{loading ? 'Сохранение...' : 'Сохранить настройки'}</button>
          
          <button
            onClick={handleReloadSettings}
            disabled={loading}
            style={{
              background: colors.accentLight,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              padding: '1rem 2rem',
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(16, 185, 129, 0.10)',
              outline: 'none',
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background = colors.accentLight; }}
            onMouseLeave={e => { if (!loading) e.target.style.background = colors.accentLight; }}
          >Перезагрузить настройки</button>
          
          <button
            onClick={handleResetSettings}
            disabled={loading}
            style={{
              background: colors.error,
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '1rem 2rem',
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(220, 38, 38, 0.10)',
              outline: 'none',
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background = colors.error; }}
            onMouseLeave={e => { if (!loading) e.target.style.background = colors.error; }}
          >Сбросить настройки</button>
        </div>
      </div>
      {bulkStatus && (
        <div style={{ textAlign: 'center', color: colors.success, fontWeight: 600, marginBottom: 16 }}>{bulkStatus}</div>
      )}
    </div>
  );
};

export default SettingsPage; 