import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const sections = [
  {
    title: 'Recopilación de Información',
    content: 'Recopilamos información que usted nos proporciona directamente, como nombre, correo electrónico, teléfono y datos de salud necesarios para brindar nuestros servicios médicos. También recopilamos datos de uso como dirección IP, navegador y páginas visitadas para mejorar la experiencia.',
  },
  {
    title: 'Uso de la Información',
    content: 'Utilizamos su información para facilitar consultas médicas, gestionar citas, procesar pagos, enviar notificaciones relevantes y mejorar nuestros servicios. Los datos médicos son tratados con la más alta confidencialidad conforme a la normativa vigente.',
  },
  {
    title: 'Protección de Datos',
    content: 'Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal. Esto incluye encriptación SSL, acceso restringido a datos sensibles, auditorías regulares de seguridad y cumplimiento con estándares internacionales.',
  },
  {
    title: 'Compartir Información',
    content: 'No vendemos ni compartimos su información personal con terceros para fines comerciales. Solo compartimos datos con los médicos tratantes, procesadores de pago autorizados y cuando sea requerido por ley.',
  },
  {
    title: 'Derechos del Usuario',
    content: 'Usted tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales (derechos ARCO). Para ejercer estos derechos, puede contactarnos a través de privacidad@mediflow.mx.',
  },
  {
    title: 'Retención de Datos',
    content: 'Conservamos su información personal durante el tiempo necesario para cumplir con los fines para los que fue recopilada, incluyendo obligaciones legales y médicas, o hasta que usted solicite su eliminación.',
  },
];

export default function Privacy() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Link to="/" className="text-muted hover:text-heading text-sm font-medium transition-colors flex items-center gap-2 group mb-8 inline-flex">
          <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Volver al inicio
        </Link>
      </div>

      <div className={`transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Shield size={22} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-heading">Política de Privacidad</h1>
            <p className="text-sm text-faint">Última actualización: Febrero 2025</p>
          </div>
        </div>
        <p className="text-body leading-relaxed mt-4">
          En MediFlow nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política describe cómo
          recopilamos, usamos y protegemos su información personal.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((s, i) => (
          <div
            key={s.title}
            className={`card-elevated rounded-2xl p-6 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: `${200 + i * 80}ms` }}
          >
            <h2 className="text-lg font-bold text-heading mb-3">{s.title}</h2>
            <p className="text-sm text-muted leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-faint text-center pt-4">
        Si tienes preguntas sobre esta política, contáctanos en{' '}
        <Link to="/contact" className="text-blue-400 hover:underline">nuestra página de contacto</Link>.
      </p>
    </div>
  );
}
