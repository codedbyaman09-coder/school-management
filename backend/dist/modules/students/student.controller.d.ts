import { Request, Response } from 'express';
export declare const getStudents: (req: Request, res: Response) => Promise<void>;
export declare const getStudentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createStudent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateStudent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteStudent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
