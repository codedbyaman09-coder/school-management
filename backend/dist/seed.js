"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = __importDefault(require("pg"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/school_db';
const pool = new pg_1.default.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const passwordHash = await bcrypt_1.default.hash('password123', 10);
    // 1. Create School
    const school = await prisma.school.upsert({
        where: { code: 'GIS001' },
        update: {},
        create: {
            id: 'default-school',
            code: 'GIS001',
            name: 'Global International School',
            address: '123 Education Lane, Delhi',
            phone: '011-2345678',
            email: 'info@gis.edu',
        },
    });
    // 2. Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@school.com' },
        update: {},
        create: {
            email: 'admin@school.com',
            passwordHash,
            fullName: 'School Admin',
            role: 'ADMIN',
            schoolId: school.id,
        },
    });
    // 3. Create Academic Year
    const ay = await prisma.academicYear.upsert({
        where: { name: '2026-27' },
        update: {},
        create: {
            name: '2026-27',
            startDate: new Date('2026-04-01'),
            endDate: new Date('2027-03-31'),
            isCurrent: true,
            schoolId: school.id,
        },
    });
    // 4. Create Classes and Sections
    const classes = ['Grade 1', 'Grade 2', 'Grade 9', 'Grade 10'];
    for (const className of classes) {
        const cls = await prisma.class.create({
            data: {
                name: className,
                schoolId: school.id,
                sections: {
                    create: [{ name: 'A' }, { name: 'B' }],
                },
            },
        });
        // 5. Create some students for each class
        const section = await prisma.section.findFirst({ where: { classId: cls.id } });
        if (section) {
            for (let i = 1; i <= 3; i++) {
                const name = `${className} Student ${i}`;
                const email = `${className.replace(' ', '').toLowerCase()}s${i}@test.com`;
                await prisma.user.create({
                    data: {
                        fullName: name,
                        email,
                        passwordHash,
                        role: 'STUDENT',
                        schoolId: school.id,
                        student: {
                            create: {
                                admissionNo: `ADM-${className.replace(' ', '')}-${i}`,
                                gender: 'MALE',
                                dob: new Date('2010-01-01'),
                                joinDate: new Date(),
                                schoolId: school.id,
                                enrollments: {
                                    create: {
                                        classId: cls.id,
                                        sectionId: section.id,
                                        academicYearId: ay.id,
                                    },
                                },
                            },
                        },
                    },
                });
            }
        }
    }
    // 6. Create Teachers
    const subjects = ['Mathematics', 'Science', 'English', 'History'];
    for (let i = 0; i < subjects.length; i++) {
        const name = `Teacher ${i + 1}`;
        const email = `teacher${i + 1}@school.com`;
        await prisma.user.create({
            data: {
                fullName: name,
                email,
                passwordHash,
                role: 'TEACHER',
                schoolId: school.id,
                teacher: {
                    create: {
                        employeeCode: `TCH-00${i + 1}`,
                        qualification: 'Masters',
                        hireDate: new Date(),
                        schoolId: school.id,
                    },
                },
            },
        });
    }
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=seed.js.map