"use client";
import * as React from "react";

interface TabsProps {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  const contextValue = React.useMemo(
    () => ({
      currentValue: value,
      setCurrentValue: onValueChange,
    }),
    [value, onValueChange]
  );

  return (
    <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
}
export function TabsList({ children }: TabsListProps) {
  return <div className="flex gap-2 mb-2">{children}</div>;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}
export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('TabsTrigger debe usarse dentro de Tabs');
  const { currentValue, setCurrentValue } = ctx;
  return (
    <button
      type="button"
      className={`px-3 py-1 rounded ${currentValue === value ? 'bg-primary text-white' : 'bg-gray-100'}`}
      onClick={() => setCurrentValue(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}
export function TabsContent({ value, children }: TabsContentProps) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('TabsContent debe usarse dentro de Tabs');
  return ctx.currentValue === value ? <div>{children}</div> : null;
}

interface TabsContextType {
  currentValue: string;
  setCurrentValue: (v: string) => void;
}
const TabsContext = React.createContext<TabsContextType | null>(null);

export function TabsProvider({ children, value, onValueChange }: TabsProps) {
  const [currentValue, setCurrentValue] = React.useState(value);

  React.useEffect(() => {
    if (value !== currentValue) {
      setCurrentValue(value);
    }
  }, [value]);

  const handleSetValue = (newValue: string) => {
    setCurrentValue(newValue);
    onValueChange(newValue);
  };

  const contextValue = React.useMemo(
    () => ({
      currentValue,
      setCurrentValue: handleSetValue,
    }),
    [currentValue]
  );

  return (
    <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>
  );
}
