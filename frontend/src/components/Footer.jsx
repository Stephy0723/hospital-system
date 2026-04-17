import { Link } from 'react-router-dom';
import { Stethoscope, Twitter, Linkedin, Instagram, Github, ArrowUpRight, Pill, FileText } from 'lucide-react';

const footerLinks = {
  Plataforma: [
    { label: 'Buscar Médicos', to: '/doctors' },
    { label: 'Agendar Cita', to: '/appointments' },
    { label: 'Farmacias', to: '/pharmacy' },
    { label: 'Medicamentos', to: '/medicines' },
  ],
  Servicios: [
    { label: 'Recetas Digitales', to: '/prescriptions' },
    { label: 'Telemedicina', to: '/services' },
    { label: 'Servicios', to: '/services' },
    { label: 'Blog', to: '/blog' },
  ],
  Legal: [
    { label: 'Privacidad', to: '/privacy' },
    { label: 'Términos', to: '/terms' },
    { label: 'Cookies', to: '/cookies' },
    { label: 'Contacto', to: '/contact' },
  ],
};

const socialIcons = [
  { icon: Twitter, href: 'https://twitter.com/medagenda', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/medagenda', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/medagenda', label: 'Instagram' },
  { icon: Github, href: 'https://github.com/steliant', label: 'GitHub' },
];

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-themed overflow-hidden">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-blue-500/5 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-heading">
                Med<span className="text-gradient-premium">Agenda</span>
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-xs mb-6">
              Plataforma integral de salud. Consultas médicas, recetas digitales, farmacias conectadas y medicamentos a tu alcance.
            </p>
            <div className="flex gap-2">
              {socialIcons.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border border-themed flex items-center justify-center text-faint hover:text-heading hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-xs text-muted mb-5 uppercase tracking-[0.15em]">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group text-sm text-muted hover:text-heading transition-all duration-300 flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowUpRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-themed">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-faint text-sm">
              &copy; {new Date().getFullYear()} MedAgenda. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
