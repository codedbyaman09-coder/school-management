import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/prisma';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import studentRoutes from './modules/students/student.routes';
import teacherRoutes from './modules/teachers/teacher.routes';
import classRoutes from './modules/classes/class.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import examRoutes from './modules/exams/exam.routes';
import feeRoutes from './modules/fees/fee.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow all for development
app.use(express.json());

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'School Management System API is running', version: '1.0.0' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api', classRoutes);          // /api/schools, /api/classes, /api/sections, /api/subjects, /api/enrollments
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Endpoints:`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/register`);
  console.log(`   GET  /api/students`);
  console.log(`   GET  /api/teachers`);
  console.log(`   GET  /api/classes`);
  console.log(`   GET  /api/attendance`);
  console.log(`   GET  /api/exams`);
  console.log(`   GET  /api/fees/invoices\n`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
