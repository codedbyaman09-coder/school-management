"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeacher = exports.updateTeacher = exports.createTeacher = exports.getTeacherById = exports.getTeachers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const getTeachers = async (req, res) => {
    try {
        const schoolId = req.schoolId;
        const teachers = await prisma_1.default.teacher.findMany({
            where: { schoolId },
            include: {
                user: { select: { fullName: true, email: true, phone: true, isActive: true } },
                classSubjects: {
                    include: {
                        class: { select: { name: true } },
                        subject: { select: { name: true } },
                    },
                },
            },
            orderBy: { hireDate: 'desc' },
        });
        res.json(teachers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch teachers' });
    }
};
exports.getTeachers = getTeachers;
const getTeacherById = async (req, res) => {
    try {
        const teacher = await prisma_1.default.teacher.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { fullName: true, email: true, phone: true, isActive: true } },
                classSubjects: { include: { class: true, subject: true } },
                timetables: { include: { section: { include: { class: true } }, subject: true } },
            },
        });
        if (!teacher)
            return res.status(404).json({ error: 'Teacher not found' });
        res.json(teacher);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch teacher' });
    }
};
exports.getTeacherById = getTeacherById;
const createTeacher = async (req, res) => {
    const { fullName, email, password, phone, employeeCode, qualification, hireDate, salary } = req.body;
    const schoolId = req.schoolId;
    try {
        const result = await prisma_1.default.$transaction(async (tx) => {
            const passwordHash = await bcrypt_1.default.hash(password || 'teacher123', 10);
            const teacherHireDate = hireDate ? new Date(hireDate) : new Date();
            if (isNaN(teacherHireDate.getTime())) {
                throw new Error("Invalid Hire Date format");
            }
            const user = await tx.user.create({
                data: { fullName, email, passwordHash, phone, role: 'TEACHER', schoolId },
            });
            const teacher = await tx.teacher.create({
                data: {
                    userId: user.id,
                    schoolId,
                    employeeCode,
                    qualification,
                    hireDate: teacherHireDate,
                    salary: salary ? parseFloat(salary) : null,
                },
            });
            return teacher;
        });
        res.status(201).json(result);
    }
    catch (error) {
        console.error("Teacher Creation Error:", error);
        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0] || 'Email or Employee Code';
            return res.status(400).json({ error: `A teacher with this ${field} already exists.` });
        }
        res.status(500).json({ error: 'Failed to create teacher: ' + (error.message || 'Unknown error') });
    }
};
exports.createTeacher = createTeacher;
const updateTeacher = async (req, res) => {
    const { fullName, email, phone, qualification, salary } = req.body;
    try {
        const teacher = await prisma_1.default.teacher.findUnique({ where: { id: req.params.id } });
        if (!teacher)
            return res.status(404).json({ error: 'Teacher not found' });
        await prisma_1.default.$transaction(async (tx) => {
            if (fullName || email || phone) {
                await tx.user.update({
                    where: { id: teacher.userId },
                    data: { ...(fullName && { fullName }), ...(email && { email }), ...(phone && { phone }) },
                });
            }
            await tx.teacher.update({
                where: { id: req.params.id },
                data: {
                    ...(qualification && { qualification }),
                    ...(salary && { salary: parseFloat(salary) }),
                },
            });
        });
        res.json({ message: 'Teacher updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update teacher' });
    }
};
exports.updateTeacher = updateTeacher;
const deleteTeacher = async (req, res) => {
    try {
        const teacher = await prisma_1.default.teacher.findUnique({ where: { id: req.params.id } });
        if (!teacher)
            return res.status(404).json({ error: 'Teacher not found' });
        await prisma_1.default.user.update({
            where: { id: teacher.userId },
            data: { isActive: false },
        });
        res.json({ message: 'Teacher deactivated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete teacher' });
    }
};
exports.deleteTeacher = deleteTeacher;
//# sourceMappingURL=teacher.controller.js.map