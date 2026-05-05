import { useLocation, useNavigate } from "react-router";
import { Icon } from "./Icon";

type NavItem = {
  path: string;
  label: string;
  NavIcon: (p: {
    width?: string | number;
    height?: string | number;
    className?: string;
  }) => React.ReactElement;
};

const NAV_ITEMS: NavItem[] = [
  { path: "/production", label: "Production Status", NavIcon: Icon.Production },
  { path: "/orders", label: "Purchase Orders", NavIcon: Icon.Orders },
  { path: "/supplies", label: "Supplies", NavIcon: Icon.Supplies },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="bg-sidebar text-slate-200 flex flex-col w-60 shrink-0 px-3.5 pt-[18px] pb-4 h-screen sticky top-0">
      <div className="flex items-center gap-3 px-2 pb-4 border-b border-white/[0.06]">
        <div className="w-[38px] h-[38px] bg-primary rounded-md grid place-items-center text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.4)]">
          <Icon.Logo width="22" height="22" />
        </div>
        <div>
          <div className="text-[14px] font-semibold text-slate-50 tracking-[-0.01em]">
            ACME Bottles
          </div>
          <div className="text-[11.5px] text-slate-400 mt-px">
            Production Manager
          </div>
        </div>
      </div>

      <div className="text-[10.5px] tracking-[0.12em] font-semibold text-slate-500 px-2.5 pt-[18px] pb-2.5">
        DASHBOARD
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ path, label, NavIcon }) => {
          const isActive = pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={[
                "flex items-center gap-[11px] px-3 py-[9px] rounded-md text-[13.5px] font-medium text-left transition-colors w-full",
                isActive
                  ? "bg-primary text-white shadow-[0_4px_14px_-4px_rgba(37,99,235,0.55)]"
                  : "text-slate-300 hover:bg-white/[0.04] hover:text-slate-100",
              ].join(" ")}
            >
              <NavIcon width="18" height="18" />
              <span className="flex-1">{label}</span>
              {isActive && (
                <Icon.Chevron width="16" height="16" className="opacity-90" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-3.5 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5 px-1.5 py-2">
          <div className="w-8 h-8 rounded-full flex-center text-white text-xs font-semibold bg-gradient-to-br from-blue-500 to-blue-700 shrink-0">
            JM
          </div>
          <div>
            <div className="text-[12.5px] font-semibold text-slate-200">
              Jordan Miles
            </div>
            <div className="text-[11px] text-slate-500">Plant Supervisor</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
