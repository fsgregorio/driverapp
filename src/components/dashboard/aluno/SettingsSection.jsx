import React, { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';

const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-4 font-semibold transition-colors ${
            activeTab === 'profile'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Perfil
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`pb-4 px-4 font-semibold transition-colors ${
            activeTab === 'account'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Conta
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'account' && <AccountSettings />}
      </div>
    </div>
  );
};

export default SettingsSection;
