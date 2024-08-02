import { Router } from "express"
import {Prisma, PrismaClient} from "@prisma/client";
import jwt from "jsonwebtoken"
import { JWT_USER_PASSWORD } from "../config";
import { userAuthMiddleware } from "../middleware";

const prismaClient=new PrismaClient();

export const userRouter=Router();

userRouter.post("/signup", async(req,res)=>{
    const {username,password,name}=req.body;
    try{
        await prismaClient.$transaction(async tx=>{
            const user=await tx.user.create({
              data:{
                username,
                password,
                name
            }
        })
        await tx.userAccount.create({
          data:{
            userId:user.id,
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

userRouter.post("/signin", async(req,res)=>{
  const {username, password}=req.body;
  const user=await prismaClient.merchant.findFirst({
    where:{
        username,
        password
    }
  })
  if(!user){
    return res.status(403).json({
        message:"Unable to log you in"
    })
  }
  const token=jwt.sign({
    id:user.id,
  },JWT_USER_PASSWORD)
  return res.json({
    token
  })  
})

userRouter.post("/onramp", async(req,res)=>{
  const {userId, amount}=req.body;
  await prismaClient.userAccount.update({
    where:{
        userId:userId
    },
    data:{
      balance:{
        increment:amount
      }
    }
  })
  
  return res.json({
    message:"on ramp done"
  })  
})

userRouter.post("/transfer", userAuthMiddleware, async(req,res)=>{
  const {merchantId,amount}=req.body;
  //@ts-ignore
  const userId=req.id;

  const paymentDone=await prismaClient.$transaction(async tx=>{
    await tx.$queryRaw`SELECT * FROM "UserAccount" WHERE "userId" = ${userId} FOR UPDATE`
    const userAccount=await tx.userAccount.findFirst({
      where:{
        userId
      }
    })

    if((userAccount?.balance||0)<amount){
      return false
    }
    console.log("user balance check passed");
    await new Promise((r)=>setTimeout(r,10000));
    await tx.userAccount.update({
      where:{
        userId,
      },
      data:{
        balance:{
          decrement:amount
        }
      }
    })

    await tx.merchantAccount.update({
      where:{
        merchantId,
      },
      data:{
        balance:{
          increment:amount
        }
      }
    });
    console.log("transaction done");
    return true;
  },{
    maxWait:50000,
    timeout:100000,
    isolationLevel:Prisma.TransactionIsolationLevel.Serializable,
  })
  if(paymentDone){
    return res.json({
      message:"Payment done"
    })
  }else{
    return res.status(411).json({
      message:"Payment failed"
    })
  }
})