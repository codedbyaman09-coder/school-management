"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentResults = exports.getMarks = exports.submitMarks = exports.createExamSubject = exports.deleteExam = exports.createExam = exports.getExams = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
// ===== EXAMS =====
const getExams = async (req, res) => {
    try {
        const schoolId = req.schoolId;
        const exams = await prisma_1.default.exam.findMany({
            where: { schoolId },
            include: {
                examSubjects: {
                    include: {
                        class: { select: { name: true } },
                        subject: { select: { name: true } },
                    },
                },
            },
            orderBy: { startDate: 'desc' },
        });
        res.json(exams);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch exams' });
    }
};
exports.getExams = getExams;
const createExam = async (req, res) => {
    const { name, academicYearId, startDate, endDate } = req.body;
    const schoolId = req.schoolId;
    try {
        let ayId = academicYearId;
        if (!ayId) {
            const currentAY = await prisma_1.default.academicYear.findFirst({
                where: { schoolId, isCurrent: true }
            });
            ayId = currentAY?.id;
        }
        if (!ayId)
            return res.status(400).json({ error: 'Current academic year not found' });
        const exam = await prisma_1.default.exam.create({
            data: {
                name,
                schoolId,
                academicYearId: ayId,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
            },
        });
        res.status(201).json(exam);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create exam' });
    }
};
exports.createExam = createExam;
const deleteExam = async (req, res) => {
    try {
        await prisma_1.default.exam.delete({ where: { id: req.params.id } });
        res.json({ message: 'Exam deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete exam' });
    }
};
exports.deleteExam = deleteExam;
// ===== EXAM SUBJECTS =====
const createExamSubject = async (req, res) => {
    const { examId, classId, subjectId, maxMarks, passMarks, examDate } = req.body;
    try {
        const examSubject = await prisma_1.default.examSubject.create({
            data: {
                examId,
                classId,
                subjectId,
                maxMarks: parseFloat(maxMarks),
                passMarks: parseFloat(passMarks),
                examDate: examDate ? new Date(examDate) : null,
            },
        });
        res.status(201).json(examSubject);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create exam subject' });
    }
};
exports.createExamSubject = createExamSubject;
// ===== MARKS =====
const submitMarks = async (req, res) => {
    const { examSubjectId, marks } = req.body; // marks: [{ enrollmentId, obtainedMarks, grade, remarks }]
    try {
        const results = await prisma_1.default.$transaction(marks.map((m) => prisma_1.default.marks.upsert({
            where: { id: m.id || 'new' },
            create: {
                examSubjectId,
                enrollmentId: m.enrollmentId,
                obtainedMarks: parseFloat(m.obtainedMarks),
                grade: m.grade,
                remarks: m.remarks,
            },
            update: {
                obtainedMarks: parseFloat(m.obtainedMarks),
                grade: m.grade,
                remarks: m.remarks,
            },
        })));
        res.json({ message: `Marks submitted for ${results.length} students`, count: results.length });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit marks' });
    }
};
exports.submitMarks = submitMarks;
const getMarks = async (req, res) => {
    try {
        const { examId, classId, subjectId } = req.query;
        let where = {};
        if (examId || classId || subjectId) {
            where.examSubject = {};
            if (examId)
                where.examSubject.examId = examId;
            if (classId)
                where.examSubject.classId = classId;
            if (subjectId)
                where.examSubject.subjectId = subjectId;
        }
        const marks = await prisma_1.default.marks.findMany({
            where,
            include: {
                examSubject: {
                    include: {
                        exam: { select: { name: true } },
                        subject: { select: { name: true } },
                    },
                },
                enrollment: {
                    include: {
                        student: { include: { user: { select: { fullName: true } } } },
                    },
                },
            },
        });
        res.json(marks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch marks' });
    }
};
exports.getMarks = getMarks;
const getStudentResults = async (req, res) => {
    try {
        const { studentId } = req.params;
        const enrollments = await prisma_1.default.enrollment.findMany({
            where: { studentId: studentId },
            include: {
                marks: {
                    include: {
                        examSubject: {
                            include: {
                                exam: true,
                                subject: true,
                            },
                        },
                    },
                },
                class: true,
                section: true,
            },
        });
        res.json(enrollments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch student results' });
    }
};
exports.getStudentResults = getStudentResults;
//# sourceMappingURL=exam.controller.js.map