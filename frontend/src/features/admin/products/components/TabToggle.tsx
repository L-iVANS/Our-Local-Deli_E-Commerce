'use client';

interface TabToggleProps {
  activeTab: 'products' | 'categories';
  onTabChange: (tab: 'products' | 'categories') => void;
}

export function TabToggle({ activeTab, onTabChange }: TabToggleProps) {
  const tabs = [
    { id: 'products' as const,   label: 'Products'   },
    { id: 'categories' as const, label: 'Categories' },
  ];

  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-border bg-card">
      {tabs.map((tab, idx) => {
        const active = activeTab === tab.id;
        const isLast = idx === tabs.length - 1;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={[
              "px-4 py-2.5 text-sm font-medium transition-all",
              !isLast && "border-r border-border",
              active
                ? "bg-primary text-[#F4F4F0]"
                : "bg-card text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}