import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// TODO: Import and use module routes here
// app.use('/api/auth', authRouter);
// app.use('/api/users', usersRouter);
// app.use('/api/doctors', doctorsRouter);
// app.use('/api/patients', patientsRouter);
// app.use('/api/appointments', appointmentsRouter);

app.listen(PORT, () => {
  console.log(`🏥 Hospital System API running on http://localhost:${PORT}`);
});

export default app;
