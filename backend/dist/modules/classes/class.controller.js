"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnrollment = exports.deleteSubject = exports.createSubject = exports.getSubjects = exports.deleteSection = exports.createSection = exports.getSections = exports.deleteClass = exports.updateClass = exports.createClass = exports.getClasses = exports.getSchools = exports.createSchool = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
// ===== SCHOOLS =====
const createSchool = async (req, res) => {
    const { name, code, address, phone, email } = req.body;
    try {
        const school = await prisma_1.default.school.create({
            data: { name, code, address, phone, email },
        });
        res.status(201).json(school);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create school' });
    }
};
exports.createSchool = createSchool;
const getSchools = async (req, res) => {
    try {
        const schools = await prisma_1.default.school.findMany({ orderBy: { name: 'asc' } });
        res.json(schools);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch schools' });
    }
};
exports.getSchools = getSchools;
// ===== CLASSES =====
const getClasses = async (req, res) => {
    try {
        const schoolId = req.schoolId;
        const classes = await prisma_1.default.class.findMany({
            where: { schoolId },
            include: {
                sections: true,
                subjects: { include: { subject: true, teacher: { include: { user: { select: { fullName: true } } } } } },
                _count: { select: { enrollments: true } },
            },
            orderBy: { orderNo: 'asc' },
        });
        res.json(classes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
};
exports.getClasses = getClasses;
const createClass = async (req, res) => {
    const { name, orderNo } = req.body;
    const schoolId = req.schoolId;
    try {
        const cls = await prisma_1.default.class.create({
            data: { name, orderNo: orderNo || 0, schoolId },
        });
        res.status(201).json(cls);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create class' });
    }
};
exports.createClass = createClass;
const updateClass = async (req, res) => {
    const { name, orderNo } = req.body;
    try {
        const cls = await prisma_1.default.class.update({
            where: { id: req.params.id },
            data: { ...(name && { name }), ...(orderNo !== undefined && { orderNo }) },
        });
        res.json(cls);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update class' });
    }
};
exports.updateClass = updateClass;
const deleteClass = async (req, res) => {
    try {
        await prisma_1.default.class.delete({ where: { id: req.params.id } });
        res.json({ message: 'Class deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete class. Make sure no students are enrolled.' });
    }
};
exports.deleteClass = deleteClass;
// ===== SECTIONS =====
const getSections = async (req, res) => {
    try {
        const { classId } = req.query;
        const where = {};
        if (classId)
            where.classId = classId;
        const sections = await prisma_1.default.section.findMany({
            where,
            include: { class: { select: { name: true } }, _count: { select: { enrollments: true } } },
        });
        res.json(sections);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch sections' });
    }
};
exports.getSections = getSections;
const createSection = async (req, res) => {
    const { name, classId } = req.body;
    try {
        const section = await prisma_1.default.section.create({
            data: { name, classId },
        });
        res.status(201).json(section);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create section' });
    }
};
exports.createSection = createSection;
const deleteSection = async (req, res) => {
    try {
        await prisma_1.default.section.delete({ where: { id: req.params.id } });
        res.json({ message: 'Section deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete section' });
    }
};
exports.deleteSection = deleteSection;
// ===== SUBJECTS =====
const getSubjects = async (req, res) => {
    try {
        const schoolId = req.schoolId;
        const subjects = await prisma_1.default.subject.findMany({
            where: { schoolId },
            orderBy: { name: 'asc' },
        });
        res.json(subjects);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
};
exports.getSubjects = getSubjects;
const createSubject = async (req, res) => {
    const { name, code } = req.body;
    const schoolId = req.schoolId;
    try {
        const subject = await prisma_1.default.subject.create({
            data: { name, code, schoolId },
        });
        res.status(201).json(subject);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create subject' });
    }
};
exports.createSubject = createSubject;
const deleteSubject = async (req, res) => {
    try {
        await prisma_1.default.subject.delete({ where: { id: req.params.id } });
        res.json({ message: 'Subject deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete subject' });
    }
};
exports.deleteSubject = deleteSubject;
// ===== ENROLLMENTS =====
const createEnrollment = async (req, res) => {
    const { studentId, classId, sectionId, academicYearId, rollNo } = req.body;
    try {
        const enrollment = await prisma_1.default.enrollment.create({
            data: { studentId, classId, sectionId, academicYearId, rollNo },
        });
        res.status(201).json(enrollment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create enrollment' });
    }
};
exports.createEnrollment = createEnrollment;
//# sourceMappingURL=class.controller.js.map