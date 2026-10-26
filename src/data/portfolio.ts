export const personalInfo = {
  name: 'Marvellous',
  title: 'Web Developer',
  headline: 'I build digital experiences that work.',
  subheadline: 'Clean code, thoughtful design, and products that people actually enjoy using.',
  bio: `I'm Marvellous — a web developer who turns ideas into interactive, fast, and polished digital products. I care about writing code that makes sense, designing interfaces that feel right, and building things that solve real problems.`,
  approach: `I believe great software comes from understanding the problem deeply before writing a single line of code. I focus on clean architecture, intuitive user experiences, and shipping products that work reliably across every device.`,
  email: 'hello@marvellous.dev',
  social: {
    github: 'https://github.com/marvellous',
  },
};

export const skills = {
  frontend: {
    label: 'Frontend',
    items: ['React', 'TypeScript', 'Tailwind CSS', 'HTML5 / CSS3', 'JavaScript ES6+'],
  },
  backend: {
    label: 'Backend',
    items: ['Laravel', 'PHP', 'Node.js', 'REST APIs'],
  },
  database: {
    label: 'Data & Storage',
    items: ['MySQL', 'PostgreSQL', 'Redis'],
  },
  tools: {
    label: 'Tools & Workflow',
    items: ['Git', 'VS Code', 'Vite', 'Docker', 'Linux'],
  },
};

export const processSteps = [
  {
    number: '01',
    title: 'Understand',
    description: 'Define the problem, the users, and the goals before writing any code.',
  },
  {
    number: '02',
    title: 'Plan',
    description: 'Map the architecture, choose the right tools, and design the user experience.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Write clean, maintainable code with a focus on performance and reliability.',
  },
  {
    number: '04',
    title: 'Refine',
    description: 'Test thoroughly, gather feedback, and polish every detail before launch.',
  },
  {
    number: '05',
    title: 'Ship',
    description: 'Deploy with confidence and iterate based on real-world usage.',
  },
];

export interface Project {
  id: string;
  title: string;
  description: string;
  problem: string;
  contribution: string;
  tech: string[];
  liveUrl?: string;
  sourceUrl?: string;
  image?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'TaskFlow',
    description: 'A collaborative project management tool built for small teams who need simplicity without sacrificing power.',
    problem: 'Small teams often struggle with bloated project management tools that slow them down.',
    contribution: 'Full-stack development — designed the database schema, built the REST API with Laravel, and created an interactive React frontend.',
    tech: ['React', 'Laravel', 'MySQL', 'Tailwind CSS'],
    featured: true,
  },
  {
    id: 'project-2',
    title: 'QuickInvoice',
    description: 'A fast, minimal invoicing application for freelancers and small businesses.',
    problem: 'Freelancers need a simple way to create, send, and track invoices without enterprise-level complexity.',
    contribution: 'Built the full application from concept to deployment, including PDF generation, email delivery, and payment tracking.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    featured: true,
  },
  {
    id: 'project-3',
    title: 'DevDash',
    description: 'A developer dashboard that aggregates GitHub activity, deployment status, and project metrics into one view.',
    problem: 'Developers waste time switching between tools to check project health.',
    contribution: 'Designed and built the frontend with real-time data fetching, interactive charts, and a responsive layout.',
    tech: ['React', 'TypeScript', 'REST APIs', 'Tailwind CSS'],
    featured: true,
  },
];
