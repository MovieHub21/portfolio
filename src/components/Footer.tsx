import { personalInfo } from '../data/portfolio';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12 bg-bg relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-base text-text">
              {personalInfo.name}
            </span>
            <span className="text-accent">&bull;</span>
            <span className="text-xs text-text-muted font-mono">
              &copy; {year} All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-8">
            {personalInfo.social.github && (
              <a
                href={personalInfo.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-accent transition-colors duration-300"
              >
                GitHub
              </a>
            )}
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-accent transition-colors duration-300"
            >
              Email
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-mono uppercase tracking-wider text-accent hover:underline flex items-center gap-1"
            >
              <span>Back to Top</span>
              <span>&uarr;</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
