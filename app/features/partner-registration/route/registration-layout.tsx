import { Outlet } from "react-router";

// Full-screen shell for the public registration flow (no app navbar/footer),
// mirroring the immersive layout of the old registration pages.
export default function RegistrationLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
