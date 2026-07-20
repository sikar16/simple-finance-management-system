import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
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



        return NextResponse.json({

            message:"Account created successfully",

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

            message:"Registration failed"

        },{
            status:500
        })


    }

}