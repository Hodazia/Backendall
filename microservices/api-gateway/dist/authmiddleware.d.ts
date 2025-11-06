import { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
            };
        }
    }
}
export declare const AuthMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authmiddleware.d.ts.map