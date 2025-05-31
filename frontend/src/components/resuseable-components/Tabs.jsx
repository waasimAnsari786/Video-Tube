import React, { useState } from "react";

export default function Tabs({ tabs = [], children }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <>
      <div
        role="tablist"
        className="tabs bg-(--my-border-light) tabs-lift text-(--my-blue) font-semibold gap-x-2 mb-6"
      >
        {tabs.map((tab) => (
          <a
            key={tab}
            role="tab"
            className={`tab ${
              activeTab === tab ? "tab-active text-(--my-blue)" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </a>
        ))}
      </div>

      {/* Render matching children by tab key */}

      {React.Children.map(children, (child) =>
        child.props.label === activeTab ? child : null
      )}
    </>
  );
}
