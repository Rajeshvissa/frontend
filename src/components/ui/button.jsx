import { cn } from "../../lib/utils";

export default function Button({ as: Tag = "button", className, variant="default", size="md", ...props }) {
  const base = "inline-flex items-center justify-center font-medium transition-all rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30";
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6",
    lg: "h-12 px-7 text-lg",
  };
  const variants = {
    default: "bg-primary text-white hover:brightness-110 shadow-soft",
    ghost: "bg-transparent hover:bg-secondary",
    outline: "border border-border bg-white hover:bg-secondary",
    secondary: "bg-secondary text-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-white hover:brightness-110",
  };
  return <Tag className={cn(base, sizes[size], variants[variant], className)} {...props} />;
}
