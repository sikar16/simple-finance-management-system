import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/src/lib/prisma";


export async function POST(req:Request){

    try{


        const body = await req.json();


        const {
            name,
            phone,
            email,
            password,
            role
        } = body;



        // check existing user

        const existingUser = await prisma.user.findFirst({

            where:{
                OR:[
                    {
                        email
                    },
                    {
                        phone
                    }
                ]
            }

        });



        if(existingUser){

            return NextResponse.json(
                {
                    message:"User already exists"
                },
                {
                    status:400
                }
            )

        }



        // encrypt password

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );



        const user = await prisma.user.create({

            data:{

                name,
                phone,
                email,

                password:hashedPassword,

                role:role ?? "CLIENT"

            }

        });



        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "7d"
            }
        );



        return NextResponse.json({

            message:"Account created successfully",
            token,

            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role
            }

        },{
            status:201
        });


    }catch(error){

        return NextResponse.json({

            message:"Registration failed",
            error:error

        },{
            status:500
        })


    }

}