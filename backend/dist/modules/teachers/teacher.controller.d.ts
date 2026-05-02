import { Request, Response } from 'express';
export declare const getTeachers: (req: Request, res: Response) => Promise<void>;
export declare const getTeacherById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createTeacher: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateTeacher: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteTeacher: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
