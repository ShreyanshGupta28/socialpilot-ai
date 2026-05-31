import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuContextProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextProps | undefined>(undefined);

export interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left" ref={containerRef}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export interface DropdownMenuTriggerProps {
  children: React.ReactElement;
  asChild?: boolean;
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

  const triggerElement = React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      if (children.props.onClick) children.props.onClick(e);
      context.setIsOpen(!context.isOpen);
    },
    className: cn(children.props.className, "cursor-pointer select-none"),
  });

  return triggerElement;
}

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right";
}

export function DropdownMenuContent({ className, align = "right", children, ...props }: DropdownMenuContentProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu");

  if (!context.isOpen) return null;

  return (
    <div
      onClick={() => context.setIsOpen(false)}
      className={cn(
        "absolute mt-2 w-56 rounded-xl border border-white/10 bg-[#0E1528] p-1.5 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fade-in",
        align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLButtonElement> {}

export function DropdownMenuItem({ className, children, ...props }: DropdownMenuItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-2.5 text-sm text-[#F0F4FF] transition-colors hover:bg-white/5 hover:text-white outline-none cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
