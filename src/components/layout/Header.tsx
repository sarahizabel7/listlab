import { FlaskConical, Github } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pagination flex items-center justify-center">
            <FlaskConical className="w-4.5 h-4.5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-text-primary leading-tight">
              List Lab
            </h1>
            <p className="text-[10px] text-text-muted leading-tight">
              React List Rendering Strategies
            </p>
          </div>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          className="text-text-muted hover:text-text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pagination focus-visible:ring-offset-2 rounded-md p-1"
        >
          <Github className="w-5 h-5" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
