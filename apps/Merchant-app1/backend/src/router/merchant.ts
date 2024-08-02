import { Router } from "express"
import {PrismaClient} from "@prisma/client";
import jwt from "jsonwebtoken"
import { JWT_MERCHANT_PASSWORD } from "../config";

const prismaClient=new PrismaClient();

export const merchantRouter=Router();

merchantRouter.post("/signup", async(req,res)=>{
  const {username,password,name}=req.body;
  try{
      await prismaClient.$transaction(async tx=>{
          const merchant=await tx.merchant.create({
            data:{
              username,
              password,
              name
          }
      })
      await tx.merchantAccount.create({
        data:{
          merchantId:merchant.id,
        }
      })
    })
      res.json({
          message:"Signed up"
      })
  }
  catch(e){
      return res.status(403).json({
          message:"Error while signing up"
      })
  }
})

merchantRouter.post("/signin", async(req,res)=>{
  const {username, password}=req.body;
  const merchant=await prismaClient.merchant.findFirst({
    where:{
        username,
        password
    }
  })
  if(!merchant){
    return res.status(403).json({
        message:"Unable to log you in"
    })
  }
  const token=jwt.sign({
    id:merchant.id,
  },JWT_MERCHANT_PASSWORD)
  return res.json({
    token
  })  
})