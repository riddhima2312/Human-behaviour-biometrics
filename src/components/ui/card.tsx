import { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-black/10 bg-white/80 p-5 shadow-lg shadow-black/5 backdrop-blur dark:border-white/10 dark:bg-zinc-900/70 ${className}`}
    >
      {children}
    </section>
  );
}
