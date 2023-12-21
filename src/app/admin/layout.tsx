import { SidebarDropdown } from "./mobile-dropdown";
import { sidebarLinks } from "./sidebar-links";
import { SidebarLink } from "./sidebar-link";

export default function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full grow flex-col gap-8 px-3 md:px-5 lg:flex-row lg:px-12 xl:px-24">
      <SidebarDropdown />
      <div className="hidden w-[15vw] flex-col gap-1 lg:inline-flex">
        {Object.keys(sidebarLinks).map((link) => {
          return (
            <SidebarLink link={link as keyof typeof sidebarLinks} key={link} />
          );
        })}
      </div>
      <div className="grow rounded-md animate-in fade-in-10 slide-in-from-top-3">
        {children}
      </div>
    </div>
  );
}
