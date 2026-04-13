import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, ArrowLeft } from 'lucide-react';

const sections = [
  {
    title: 'Aceptación de los Términos',
    content: 'Al acceder y utilizar la plataforma MediFlow, usted acepta estos Términos de Servicio. Si no está de acuerdo con alguno de estos términos, le solicitamos que no utilice nuestros servicios.',
  },
  {
    title: 'Descripción del Servicio',
    content: 'MediFlow es una plataforma digital que conecta pacientes con profesionales médicos para la gestión de citas, consultas presenciales y de telemedicina, recetas digitales y expedientes médicos electrónicos.',
  },
  {
    title: 'Cuenta de Usuario',
    content: 'Para utilizar nuestros servicios, debe crear una cuenta proporcionando información veraz y completa. Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades realizadas bajo su cuenta.',
  },
  {
    title: 'Uso Adecuado',
    content: 'Se compromete a utilizar la plataforma únicamente para fines legítimos relacionados con servicios de salud. Queda prohibido el uso fraudulento, la distribución de información falsa o cualquier actividad que viole leyes aplicables.',
  },
  {
    title: 'Servicios Médicos',
    content: 'MediFlow facilita la conexión entre pacientes y médicos, pero no es responsable de los diagnósticos, tratamientos o recomendaciones proporcionadas por los profesionales de salud. Cada médico es responsable de su práctica profesional.',
  },
  {
    title: 'Pagos y Tarifas',
    content: 'Los precios de las consultas son establecidos por cada profesional médico. MediFlow puede cobrar una tarifa por el uso de la plataforma. Todos los pagos son procesados de forma segura a través de proveedores autorizados.',
  },
  {
    title: 'Cancelación de Citas',
    content: 'Las citas pueden ser canceladas hasta 2 horas antes de la hora programada sin costo adicional. Cancelaciones tardías pueden estar sujetas a un cargo según las políticas de cada médico.',
  },
  {
    title: 'Limitación de Responsabilidad',
    content: 'MediFlow no será responsable por daños indirectos, incidentales o consecuentes que surjan del uso de la plataforma. Nuestra responsabilidad máxima se limita al monto pagado por los servicios utilizados.',
  },
];

export default function Terms() {
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
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <FileCheck size={22} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-heading">Términos de Servicio</h1>
            <p className="text-sm text-faint">Última actualización: Febrero 2025</p>
          </div>
        </div>
        <p className="text-body leading-relaxed mt-4">
          Estos términos regulan el uso de la plataforma MediFlow. Por favor léalos detenidamente antes de utilizar nuestros servicios.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((s, i) => (
          <div
            key={s.title}
            className={`card-elevated rounded-2xl p-6 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: `${200 + i * 80}ms` }}
          >
            <h2 className="text-lg font-bold text-heading mb-3">{i + 1}. {s.title}</h2>
            <p className="text-sm text-muted leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-faint text-center pt-4">
        Para dudas sobre estos términos, contáctanos en{' '}
        <Link to="/contact" className="text-blue-400 hover:underline">nuestra página de contacto</Link>.
      </p>
    </div>
  );
}
