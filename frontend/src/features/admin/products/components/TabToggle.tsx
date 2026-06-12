'use client';

interface TabToggleProps {
  activeTab: 'products' | 'categories';
  onTabChange: (tab: 'products' | 'categories') => void;
}

export function TabToggle({ activeTab, onTabChange }: TabToggleProps) {
  return (
    <div
      className="flex border border-gray-200 rounded-lg overflow-hidden"
      style={{ width: 'fit-content' }}
    >
      {[
        { id: 'products' as const, label: 'Products' },
        { id: 'categories' as const, label: 'Categories' },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="px-4 py-2.5 text-sm font-medium transition-all"
          style={{
            backgroundColor: activeTab === tab.id ? '#bf262f' : 'white',
            color: activeTab === tab.id ? 'white' : '#64748b',
            borderRight: tab.id === 'products' ? '1px solid #e2e8f0' : 'none',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
