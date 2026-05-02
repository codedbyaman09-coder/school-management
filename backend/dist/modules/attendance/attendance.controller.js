"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceStats = exports.getAttendance = exports.markBulkAttendance = exports.markAttendance = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const markAttendance = async (req, res) => {
    const { enrollmentId, date, status } = req.body;
    const markedById = req.userId;
    try {
        // Check if already marked
        const existing = await prisma_1.default.attendance.findFirst({
            where: { enrollmentId, attendanceDate: new Date(date) },
        });
        if (existing) {
            const updated = await prisma_1.default.attendance.update({
                where: { id: existing.id },
                data: { status, markedById },
            });
            return res.json(updated);
        }
        const attendance = await prisma_1.default.attendance.create({
            data: {
                enrollmentId,
                attendanceDate: new Date(date),
                status,
                markedById,
            },
        });
        res.status(201).json(attendance);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to mark attendance' });
    }
};
exports.markAttendance = markAttendance;
const markBulkAttendance = async (req, res) => {
    const { date, records } = req.body; // records: [{ enrollmentId, status }]
    const markedById = req.userId;
    try {
        const results = await prisma_1.default.$transaction(records.map((record) => prisma_1.default.attendance.upsert({
            where: {
                id: record.id || 'new',
            },
            create: {
                enrollmentId: record.enrollmentId,
                attendanceDate: new Date(date),
                status: record.status,
                markedById,
            },
            update: {
                status: record.status,
                markedById,
            },
        })));
        res.json({ message: `Attendance marked for ${results.length} students`, count: results.length });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to mark bulk attendance' });
    }
};
exports.markBulkAttendance = markBulkAttendance;
const getAttendance = async (req, res) => {
    try {
        const { classId, sectionId, date, month } = req.query;
        let where = {};
        if (date) {
            where.attendanceDate = new Date(date);
        }
        else if (month) {
            const [year, m] = month.split('-');
            const start = new Date(parseInt(year), parseInt(m) - 1, 1);
            const end = new Date(parseInt(year), parseInt(m), 0);
            where.attendanceDate = { gte: start, lte: end };
        }
        if (classId || sectionId) {
            where.enrollment = {};
            if (classId)
                where.enrollment.classId = classId;
            if (sectionId)
                where.enrollment.sectionId = sectionId;
        }
        const attendance = await prisma_1.default.attendance.findMany({
            where,
            include: {
                enrollment: {
                    include: {
                        student: { include: { user: { select: { fullName: true } } } },
                        class: { select: { name: true } },
                        section: { select: { name: true } },
                    },
                },
            },
            orderBy: { attendanceDate: 'desc' },
        });
        res.json(attendance);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
};
exports.getAttendance = getAttendance;
const getAttendanceStats = async (req, res) => {
    try {
        const { classId, sectionId, month } = req.query;
        const [year, m] = (month || '2026-01').split('-');
        const start = new Date(parseInt(year), parseInt(m) - 1, 1);
        const end = new Date(parseInt(year), parseInt(m), 0);
        let enrollmentWhere = {};
        if (classId)
            enrollmentWhere.classId = classId;
        if (sectionId)
            enrollmentWhere.sectionId = sectionId;
        const total = await prisma_1.default.attendance.count({
            where: {
                attendanceDate: { gte: start, lte: end },
                enrollment: enrollmentWhere,
            },
        });
        const present = await prisma_1.default.attendance.count({
            where: {
                attendanceDate: { gte: start, lte: end },
                status: 'PRESENT',
                enrollment: enrollmentWhere,
            },
        });
        const absent = await prisma_1.default.attendance.count({
            where: {
                attendanceDate: { gte: start, lte: end },
                status: 'ABSENT',
                enrollment: enrollmentWhere,
            },
        });
        res.json({
            total,
            present,
            absent,
            late: total - present - absent,
            rate: total > 0 ? ((present / total) * 100).toFixed(1) : '0',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get attendance stats' });
    }
};
exports.getAttendanceStats = getAttendanceStats;
//# sourceMappingURL=attendance.controller.js.map