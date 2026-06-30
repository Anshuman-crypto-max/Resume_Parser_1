export function PageShell({ title, description, action, children }: { title: string; description: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
