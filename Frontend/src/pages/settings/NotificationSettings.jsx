import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState({
    emailEnabled: true,
    pushEnabled: true,
    inAppEnabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await axiosInstance.get('/notifications/preferences');
        if (res.data.data) {
          setPreferences({
            emailEnabled: res.data.data.emailEnabled,
            pushEnabled: res.data.data.pushEnabled,
            inAppEnabled: res.data.data.inAppEnabled
          });
        }
      } catch (e) {
        toast.error("Failed to load preferences");
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const handleToggle = async (key) => {
    const newVal = !preferences[key];
    setPreferences(prev => ({ ...prev, [key]: newVal }));
    
    setSaving(true);
    try {
      await axiosInstance.put('/notifications/preferences', { [key]: newVal });
      toast.success("Preferences saved");
    } catch (e) {
      toast.error("Failed to save preference");
      setPreferences(prev => ({ ...prev, [key]: !newVal })); // revert
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center font-bold">Loading Settings...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-black text-gray-900 mb-6">Notification Settings</h2>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <ul className="divide-y">
          {[
            { key: 'emailEnabled', title: 'Email Notifications', desc: 'Receive critical updates, offers, and interview links via email.' },
            { key: 'pushEnabled', title: 'Push Notifications', desc: 'Receive browser-level push alerts even when the app is closed.' },
            { key: 'inAppEnabled', title: 'In-App Notifications', desc: 'Show badges and dropdown alerts inside the Job Portal dashboard.' }
          ].map(setting => (
            <li key={setting.key} className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900">{setting.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{setting.desc}</p>
              </div>
              <button 
                onClick={() => handleToggle(setting.key)}
                disabled={saving}
                className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${preferences[setting.key] ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${preferences[setting.key] ? 'transform translate-x-6' : ''}`}></span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
