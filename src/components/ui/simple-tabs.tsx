import React, { ReactNode, useState, Children, cloneElement, isValidElement } from "react";

console.log("SimpleTabs component loaded - PRODUCTION BUILD FIX - RADIX UI PRIMITIVE v1.0.1 + POLYFILL - ", new Date().toISOString());

interface SimpleTabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

interface SimpleTabsListProps {
  children: ReactNode;
  className?: string;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

interface SimpleTabsTriggerProps {
  value: string;
  children: ReactNode;
  onClick?: (value: string) => void;
  isActive?: boolean;
  className?: string;
}

interface SimpleTabsContentProps {
  value: string;
  children: ReactNode;
  activeTab?: string;
  className?: string;
}

export const SimpleTabs: React.FC<SimpleTabsProps> = ({ defaultValue, children, className = "" }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  // Process children to pass activeTab
  const processedChildren = Children.map(children, child => {
    if (isValidElement(child)) {
      if (child.type === SimpleTabsList) {
        return cloneElement(child, { 
          activeTab, 
          setActiveTab 
        });
      } else if (child.type === SimpleTabsContent) {
        return cloneElement(child, { 
          activeTab 
        });
      }
    }
    return child;
  });

  return <div className={className}>{processedChildren}</div>;
};

export const SimpleTabsList: React.FC<SimpleTabsListProps> = ({ activeTab, setActiveTab, children, className = "" }) => {
  // Process triggers to pass onClick and isActive
  const processedChildren = Children.map(children, child => {
    if (isValidElement(child) && child.type === SimpleTabsTrigger) {
      return cloneElement(child, {
        onClick: setActiveTab,
        isActive: activeTab === child.props.value
      });
    }
    return child;
  });

  return <div className={className}>{processedChildren}</div>;
};

export const SimpleTabsTrigger: React.FC<SimpleTabsTriggerProps> = ({ 
  value, 
  children, 
  onClick, 
  isActive = false,
  className = "" 
}) => {
  const handleClick = () => {
    if (onClick) onClick(value);
  };

  return (
    <button
      onClick={handleClick}
      className={`${className} ${isActive ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50' : 'text-slate-600 hover:text-orange-600'}`}
    >
      {children}
    </button>
  );
};

export const SimpleTabsContent: React.FC<SimpleTabsContentProps> = ({ 
  value, 
  children, 
  activeTab,
  className = "" 
}) => {
  if (activeTab !== value) return null;
  
  return <div className={className}>{children}</div>;
};