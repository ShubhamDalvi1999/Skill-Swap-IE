"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
var AppError_1 = require("./errors/AppError");
// Function to get PrismaClient dynamically
function getPrismaClient() {
    return __awaiter(this, void 0, void 0, function () {
        var PrismaClient, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@prisma/client')); })];
                case 1:
                    PrismaClient = (_a.sent()).PrismaClient;
                    return [2 /*return*/, new PrismaClient()];
                case 2:
                    error_1 = _a.sent();
                    console.error('Failed to import PrismaClient:', error_1);
                    throw new Error('Could not initialize Prisma client for seeding');
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Seeds the database with initial data for development and testing
 */
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var prisma, existingCourses, tags, instructor, student, course_1, tagIds, module1, module2, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 17, 18, 21]);
                    console.log('Starting database seeding...');
                    return [4 /*yield*/, getPrismaClient()];
                case 1:
                    // Get Prisma client
                    prisma = _a.sent();
                    return [4 /*yield*/, prisma.course.count()];
                case 2:
                    existingCourses = _a.sent();
                    if (existingCourses > 0) {
                        console.log('Database already contains data, skipping seed operation');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, prisma.courseTag.createMany({
                            data: [
                                { name: 'JavaScript', slug: 'javascript' },
                                { name: 'React', slug: 'react' },
                                { name: 'Node.js', slug: 'nodejs' },
                                { name: 'TypeScript', slug: 'typescript' },
                                { name: 'CSS', slug: 'css' },
                                { name: 'HTML', slug: 'html' },
                            ],
                            skipDuplicates: true,
                        })];
                case 3:
                    tags = _a.sent();
                    console.log("Created ".concat(tags.count, " course tags"));
                    return [4 /*yield*/, prisma.profile.create({
                            data: {
                                id: 'instructor-1',
                                fullName: 'John Instructor',
                                email: 'instructor@example.com',
                                avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
                                bio: 'Experienced web developer with 10+ years in the industry',
                                joinedDate: new Date(),
                                lastSeen: new Date(),
                            },
                        })];
                case 4:
                    instructor = _a.sent();
                    return [4 /*yield*/, prisma.profile.create({
                            data: {
                                id: 'student-1',
                                fullName: 'Sarah Student',
                                email: 'student@example.com',
                                avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
                                bio: 'Aspiring web developer',
                                joinedDate: new Date(),
                                lastSeen: new Date(),
                            },
                        })];
                case 5:
                    student = _a.sent();
                    console.log('Created sample profiles');
                    return [4 /*yield*/, prisma.course.create({
                            data: {
                                title: 'Modern Web Development with React',
                                slug: 'modern-web-development-react',
                                description: 'Learn how to build modern web applications using React and related technologies',
                                price: 49.99,
                                level: 'INTERMEDIATE',
                                thumbnailUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
                                durationHours: 12,
                                studentsCount: 0,
                                publishedDate: new Date(),
                                isPublished: true,
                                isFeatured: true,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                createdBy: instructor.id,
                            },
                        })];
                case 6:
                    course_1 = _a.sent();
                    console.log('Created sample course');
                    // Create course metadata
                    return [4 /*yield*/, prisma.courseMetadata.create({
                            data: {
                                courseId: course_1.id,
                                learningObjectives: JSON.stringify([
                                    'Build React applications from scratch',
                                    'Understand React hooks and state management',
                                    'Create responsive UIs with modern CSS',
                                ]),
                                targetAudience: JSON.stringify([
                                    'Web developers looking to learn React',
                                    'JavaScript developers wanting to expand their skills',
                                    'Beginners with basic HTML, CSS, and JavaScript knowledge',
                                ]),
                                prerequisites: 'Basic knowledge of HTML, CSS, and JavaScript',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 7:
                    // Create course metadata
                    _a.sent();
                    console.log('Created course metadata');
                    return [4 /*yield*/, prisma.courseTag.findMany({
                            where: {
                                slug: {
                                    in: ['react', 'javascript', 'css'],
                                },
                            },
                            select: {
                                id: true,
                            },
                        })];
                case 8:
                    tagIds = _a.sent();
                    return [4 /*yield*/, Promise.all(tagIds.map(function (tag) {
                            return prisma.courseTagMapping.create({
                                data: {
                                    courseId: course_1.id,
                                    tagId: tag.id,
                                },
                            });
                        }))];
                case 9:
                    _a.sent();
                    console.log('Connected tags to course');
                    return [4 /*yield*/, prisma.courseModule.create({
                            data: {
                                title: 'Getting Started with React',
                                description: 'Learn the basics of React and set up your development environment',
                                courseId: course_1.id,
                                orderIndex: 1,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 10:
                    module1 = _a.sent();
                    return [4 /*yield*/, prisma.courseModule.create({
                            data: {
                                title: 'React Components and Props',
                                description: 'Learn how to create and use React components',
                                courseId: course_1.id,
                                orderIndex: 2,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 11:
                    module2 = _a.sent();
                    console.log('Created course modules');
                    // Create lessons for module 1
                    return [4 /*yield*/, prisma.courseLesson.createMany({
                            data: [
                                {
                                    title: 'Introduction to React',
                                    description: 'Overview of React and its core concepts',
                                    content: 'React is a JavaScript library for building user interfaces...',
                                    moduleId: module1.id,
                                    courseId: course_1.id,
                                    durationMinutes: 15,
                                    videoUrl: 'https://example.com/videos/intro-to-react',
                                    isFree: true,
                                    orderIndex: 1,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                },
                                {
                                    title: 'Setting Up Your Development Environment',
                                    description: 'Install and configure the tools needed for React development',
                                    content: 'In this lesson, we will set up Node.js, npm, and create a new React app...',
                                    moduleId: module1.id,
                                    courseId: course_1.id,
                                    durationMinutes: 20,
                                    videoUrl: 'https://example.com/videos/react-setup',
                                    isFree: false,
                                    orderIndex: 2,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                },
                            ],
                        })];
                case 12:
                    // Create lessons for module 1
                    _a.sent();
                    // Create lessons for module 2
                    return [4 /*yield*/, prisma.courseLesson.createMany({
                            data: [
                                {
                                    title: 'Creating Your First Component',
                                    description: 'Learn how to create and use React components',
                                    content: 'Components are the building blocks of React applications...',
                                    moduleId: module2.id,
                                    courseId: course_1.id,
                                    durationMinutes: 25,
                                    videoUrl: 'https://example.com/videos/first-component',
                                    isFree: false,
                                    orderIndex: 1,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                },
                                {
                                    title: 'Working with Props',
                                    description: 'Learn how to pass data between components using props',
                                    content: 'Props are used to pass data from parent to child components...',
                                    moduleId: module2.id,
                                    courseId: course_1.id,
                                    durationMinutes: 30,
                                    videoUrl: 'https://example.com/videos/react-props',
                                    isFree: false,
                                    orderIndex: 2,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                },
                            ],
                        })];
                case 13:
                    // Create lessons for module 2
                    _a.sent();
                    console.log('Created course lessons');
                    // Create course resources
                    return [4 /*yield*/, prisma.courseResource.createMany({
                            data: [
                                {
                                    title: 'React Cheat Sheet',
                                    description: 'A quick reference guide for React concepts',
                                    type: 'PDF',
                                    url: 'https://example.com/resources/react-cheatsheet.pdf',
                                    courseId: course_1.id,
                                    createdAt: new Date(),
                                },
                                {
                                    title: 'Component Examples',
                                    description: 'Example code for various React components',
                                    type: 'CODE',
                                    url: 'https://github.com/example/react-components',
                                    courseId: course_1.id,
                                    createdAt: new Date(),
                                },
                            ],
                        })];
                case 14:
                    // Create course resources
                    _a.sent();
                    console.log('Created course resources');
                    // Create a course enrollment
                    return [4 /*yield*/, prisma.courseEnrollment.create({
                            data: {
                                userId: student.id,
                                courseId: course_1.id,
                                enrollmentDate: new Date(),
                                lastAccessedAt: new Date(),
                                paymentMethod: 'CREDIT_CARD',
                                status: 'ACTIVE',
                            },
                        })];
                case 15:
                    // Create a course enrollment
                    _a.sent();
                    console.log('Created course enrollment');
                    // Create a course review
                    return [4 /*yield*/, prisma.courseReview.create({
                            data: {
                                userId: student.id,
                                courseId: course_1.id,
                                rating: 5,
                                comment: 'Excellent course! I learned a lot about React and modern web development.',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 16:
                    // Create a course review
                    _a.sent();
                    console.log('Created course review');
                    console.log('Database seeding completed successfully!');
                    return [3 /*break*/, 21];
                case 17:
                    error_2 = _a.sent();
                    console.error('Error seeding database:', error_2);
                    throw new AppError_1.AppError('Failed to seed database', {
                        code: 'DATABASE_SEED_ERROR',
                        cause: error_2,
                        context: { operation: 'database_seeding' }
                    });
                case 18:
                    if (!prisma) return [3 /*break*/, 20];
                    return [4 /*yield*/, prisma.$disconnect()];
                case 19:
                    _a.sent();
                    _a.label = 20;
                case 20: return [7 /*endfinally*/];
                case 21: return [2 /*return*/];
            }
        });
    });
}
