import { useAuth } from '../context/AuthContext';
import PatientDashboard from './dashboard/PatientDashboard';
import DoctorDashboard from './dashboard/DoctorDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'doctor') return <DoctorDashboard />;
  return <PatientDashboard />;
}
