import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <section
      role="status"
      className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-sm"
    >
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="h-7 w-7" />
      </span>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {actionHref ? (
        <Button
          render={<Link href={actionHref} />}
          className="mt-5 h-10 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:opacity-90"
        >
          {actionLabel}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onAction}
          className="mt-5 h-10 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:opacity-90"
        >
          {actionLabel}
        </Button>
      )}
    </section>
  );
}
