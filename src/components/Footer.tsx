import { personalInfo } from '../data/portfolio';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-secondary)]">
            &copy; {year} {personalInfo.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {personalInfo.social.github && (
              <a
                href={personalInfo.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-300"
              >
                GitHub
              </a>
            )}
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-300"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
