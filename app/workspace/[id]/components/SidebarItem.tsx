import React from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  text?: string;
  active?: boolean;
  collapsed?: boolean;
}

export function SidebarItem({ icon, label, text, active, collapsed }: SidebarItemProps) {
  return (
    <div
      title={collapsed ? label : undefined}
      className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition-colors ${
        active
          ? "bg-[#e4e4e7] text-[#09090b]"
          : "text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#09090b]"
      }`}
    >
      <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
        <span className="shrink-0">{icon}</span>
        <span
          className="text-sm whitespace-nowrap overflow-hidden transition-[opacity,max-width] duration-300 ease-in-out"
          style={{ opacity: collapsed ? 0 : 1, maxWidth: collapsed ? 0 : 160 }}
        >
          {label}
        </span>
      </div>
      {!collapsed && text && (
        <span className="text-[10px] text-[#a1a1aa] shrink-0 ml-2">{text}</span>
      )}
    </div>
  );
}
