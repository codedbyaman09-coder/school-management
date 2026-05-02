import { Request, Response } from 'express';
export declare const markAttendance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const markBulkAttendance: (req: Request, res: Response) => Promise<void>;
export declare const getAttendance: (req: Request, res: Response) => Promise<void>;
export declare const getAttendanceStats: (req: Request, res: Response) => Promise<void>;
