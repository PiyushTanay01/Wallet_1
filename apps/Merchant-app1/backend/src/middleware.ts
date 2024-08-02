import { NextFunction, Request } from "express";
import { JWT_MERCHANT_PASSWORD, JWT_USER_PASSWORD } from "./config";
import jwt from "jsonwebtoken";

export const userAuthMiddleware=(req:Request, res:Response, next:NextFunction)=>{
    
    const token=req.headers["authorization"] as unknown as string;
    
    const verified=jwt.verify(token,JWT_USER_PASSWORD);
    
    if(verified){
        //@ts-ignore
        req.id=verified.id;
        next();
    }
    else{
        //@ts-ignore
        return res.status(403).json({
            message:"Not authorized"
        })
    }
}

export const merchantAuthMiddleware=(req:Request, res:Response, next:NextFunction)=>{
    
    const token=req.headers["authorization"] as unknown as string;
    
    const verified=jwt.verify(token,JWT_MERCHANT_PASSWORD);
    
    if(verified){
        //@ts-ignore
        req.id=verified.id;
        next();
    }
    else{
        //@ts-ignore
        return res.status(403).json({
            message:"Not authorized"
        })
    }
}