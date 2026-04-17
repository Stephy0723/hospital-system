import { useAuth } from '../context/AuthContext';
import PatientHome from './dashboard/PatientHome';
import DoctorHome from './dashboard/DoctorHome';

export default function Dashboard() {
  const { user } = useAuth();
  return user?.role === 'doctor' ? <DoctorHome /> : <PatientHome />;
}
