"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.getStudentById = exports.getStudents = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const getStudents = async (req, res) => {
    try {
        const schoolId = req.schoolId;
        const { search, status, classId, sectionId } = req.query;
        const where = { schoolId };
        if (status)
            where.status = status;
        if (classId || sectionId) {
            where.enrollments = {
                some: {
                    ...(classId && { classId: classId }),
                    ...(sectionId && { sectionId: sectionId }),
                    status: 'ACTIVE'
                }
            };
        }
        const students = await prisma_1.default.student.findMany({
            where,
            include: {
                user: { select: { fullName: true, email: true, phone: true, role: true } },
                enrollments: {
                    include: {
                        class: { select: { name: true } },
                        section: { select: { name: true } },
                    },
                    orderBy: { academicYearId: 'desc' },
                    take: 1,
                },
                guardians: {
                    include: { guardian: { include: { user: { select: { fullName: true, phone: true } } } } },
                    where: { isPrimary: true },
                    take: 1,
                },
            },
            orderBy: { joinDate: 'desc' },
        });
        res.json(students);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
};
exports.getStudents = getStudents;
const getStudentById = async (req, res) => {
    try {
        const student = await prisma_1.default.student.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { fullName: true, email: true, phone: true, role: true } },
                enrollments: {
                    include: {
                        class: true,
                        section: true,
                        attendance: { orderBy: { attendanceDate: 'desc' }, take: 30 },
                        marks: { include: { examSubject: { include: { exam: true, subject: true } } } },
                    },
                },
                guardians: { include: { guardian: { include: { user: true } } } },
                invoices: { include: { payments: true }, orderBy: { issueDate: 'desc' }, take: 10 },
            },
        });
        if (!student)
            return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch student' });
    }
};
exports.getStudentById = getStudentById;
const createStudent = async (req, res) => {
    const { fullName, email, password, phone, admissionNo, dob, gender, bloodGroup, address, classId, sectionId, academicYearId, parentName, parentEmail, parentPhone } = req.body;
    const schoolId = req.schoolId;
    try {
        const result = await prisma_1.default.$transaction(async (tx) => {
            // Create student user
            const passwordHash = await bcrypt_1.default.hash(password || 'student123', 10);
            const studentUser = await tx.user.create({
                data: { fullName, email, passwordHash, phone, role: 'STUDENT', schoolId },
            });
            // Create student record
            const studentDob = dob ? new Date(dob) : null;
            if (studentDob && isNaN(studentDob.getTime())) {
                throw new Error("Invalid Date of Birth format");
            }
            const student = await tx.student.create({
                data: {
                    userId: studentUser.id,
                    schoolId,
                    admissionNo,
                    dob: studentDob,
                    gender,
                    bloodGroup,
                    address,
                },
            });
            // Create enrollment if class provided
            if (classId && sectionId) {
                let ayId = academicYearId;
                if (!ayId) {
                    const currentAY = await tx.academicYear.findFirst({
                        where: { schoolId, isCurrent: true }
                    });
                    ayId = currentAY?.id;
                }
                if (ayId) {
                    await tx.enrollment.create({
                        data: {
                            studentId: student.id,
                            classId,
                            sectionId,
                            academicYearId: ayId,
                        },
                    });
                }
            }
            // Create guardian if parent info provided
            if (parentName && parentEmail) {
                const parentHash = await bcrypt_1.default.hash('parent123', 10);
                const parentUser = await tx.user.create({
                    data: { fullName: parentName, email: parentEmail, passwordHash: parentHash, phone: parentPhone, role: 'PARENT', schoolId },
                });
                const guardian = await tx.guardian.create({
                    data: { userId: parentUser.id },
                });
                await tx.studentGuardian.create({
                    data: { studentId: student.id, guardianId: guardian.id, relationType: 'FATHER', isPrimary: true },
                });
            }
            return student;
        });
        res.status(201).json(result);
    }
    catch (error) {
        console.error("Student Creation Error:", error);
        if (error.code === 'ECONNREFUSED' || error.message?.includes('connect')) {
            return res.status(503).json({ error: 'Database is not running. Please start your PostgreSQL server.' });
        }
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A user with this email already exists.' });
        }
        res.status(500).json({ error: 'Failed to create student: ' + (error.message || 'Unknown error') });
    }
};
exports.createStudent = createStudent;
const updateStudent = async (req, res) => {
    const { fullName, email, phone, dob, gender, bloodGroup, address, status } = req.body;
    try {
        const student = await prisma_1.default.student.findUnique({ where: { id: req.params.id } });
        if (!student)
            return res.status(404).json({ error: 'Student not found' });
        await prisma_1.default.$transaction(async (tx) => {
            if (fullName || email || phone) {
                await tx.user.update({
                    where: { id: student.userId },
                    data: { ...(fullName && { fullName }), ...(email && { email }), ...(phone && { phone }) },
                });
            }
            await tx.student.update({
                where: { id: req.params.id },
                data: {
                    ...(dob && { dob: new Date(dob) }),
                    ...(gender && { gender }),
                    ...(bloodGroup && { bloodGroup }),
                    ...(address && { address }),
                    ...(status && { status }),
                },
            });
        });
        res.json({ message: 'Student updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update student' });
    }
};
exports.updateStudent = updateStudent;
const deleteStudent = async (req, res) => {
    try {
        const student = await prisma_1.default.student.findUnique({ where: { id: req.params.id } });
        if (!student)
            return res.status(404).json({ error: 'Student not found' });
        await prisma_1.default.student.update({
            where: { id: req.params.id },
            data: { status: 'INACTIVE' },
        });
        res.json({ message: 'Student deactivated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete student' });
    }
};
exports.deleteStudent = deleteStudent;
//# sourceMappingURL=student.controller.js.map