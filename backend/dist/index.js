"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = __importDefault(require("./config/prisma"));
// Route imports
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const student_routes_1 = __importDefault(require("./modules/students/student.routes"));
const teacher_routes_1 = __importDefault(require("./modules/teachers/teacher.routes"));
const class_routes_1 = __importDefault(require("./modules/classes/class.routes"));
const attendance_routes_1 = __importDefault(require("./modules/attendance/attendance.routes"));
const exam_routes_1 = __importDefault(require("./modules/exams/exam.routes"));
const fee_routes_1 = __importDefault(require("./modules/fees/fee.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)()); // Allow all for development
app.use(express_1.default.json());
// Health check
app.get('/', (req, res) => {
    res.json({ message: 'School Management System API is running', version: '1.0.0' });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/students', student_routes_1.default);
app.use('/api/teachers', teacher_routes_1.default);
app.use('/api', class_routes_1.default); // /api/schools, /api/classes, /api/sections, /api/subjects, /api/enrollments
app.use('/api/attendance', attendance_routes_1.default);
app.use('/api/exams', exam_routes_1.default);
app.use('/api/fees', fee_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Error handler
app.use((err, req, res, next) => {
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
    await prisma_1.default.$disconnect();
    process.exit();
});
//# sourceMappingURL=index.js.map