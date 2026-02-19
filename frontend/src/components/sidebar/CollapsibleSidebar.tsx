import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CollapsibleSidebarProps {
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
}

function CollapsibleSidebar({
  children,
  isCollapsed,
  onToggle,
}: CollapsibleSidebarProps) {
  return (
    <>
      <div
        className={`lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col transition-all duration-300 ${
          isCollapsed ? "lg:w-0 lg:overflow-hidden" : "lg:w-96"
        }`}
      >
        <div className="sidebar-scrollbar-stable flex grow flex-col gap-y-2 overflow-y-auto border-r border-gray-200 bg-white px-6 dark:bg-zinc-950 dark:text-white">
          {children}
        </div>
      </div>

      <button
        onClick={onToggle}
        className="fixed top-4 z-50 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-r-md p-2 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-300"
        style={{ left: isCollapsed ? 0 : "24rem" }}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <FaChevronRight className="text-gray-600 dark:text-gray-400" />
        ) : (
          <FaChevronLeft className="text-gray-600 dark:text-gray-400" />
        )}
      </button>
    </>
  );
}

export default CollapsibleSidebar;
