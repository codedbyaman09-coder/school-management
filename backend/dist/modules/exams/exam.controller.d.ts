import { Request, Response } from 'express';
export declare const getExams: (req: Request, res: Response) => Promise<void>;
export declare const createExam: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteExam: (req: Request, res: Response) => Promise<void>;
export declare const createExamSubject: (req: Request, res: Response) => Promise<void>;
export declare const submitMarks: (req: Request, res: Response) => Promise<void>;
export declare const getMarks: (req: Request, res: Response) => Promise<void>;
export declare const getStudentResults: (req: Request, res: Response) => Promise<void>;
