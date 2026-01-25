import React, { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';

const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="mb-4 sm:mb-6 border-b border-gray-200 pb-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'account'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Conta
          </button>
        </div>
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
