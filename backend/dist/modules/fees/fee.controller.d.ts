import { Request, Response } from 'express';
export declare const getFeeStructures: (req: Request, res: Response) => Promise<void>;
export declare const createFeeStructure: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getInvoices: (req: Request, res: Response) => Promise<void>;
export declare const createInvoice: (req: Request, res: Response) => Promise<void>;
export declare const collectPayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPayments: (req: Request, res: Response) => Promise<void>;
export declare const getFeeDues: (req: Request, res: Response) => Promise<void>;
