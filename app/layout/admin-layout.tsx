import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#f1f5f9] bg-white shadow-sm h-17">
        Header
      </header>
      <div className="flex h-[calc(100vh-4.25rem)]">
        <div className="w-64 border-r shrink-0">Side Bar</div>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}
