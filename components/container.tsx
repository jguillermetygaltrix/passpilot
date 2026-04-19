import { cn } from "@/lib/utils";

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("container pt-6 pb-24 md:pt-10 md:pb-12 max-w-5xl", className)}>
      {children}
    </div>
  );
}
