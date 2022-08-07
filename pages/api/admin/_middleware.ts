// import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// import { jwt } from "../../utils";


// export async function middleware( req: NextRequest, ev: NextFetchEvent ){
	
// 	const { token = "" } = req.cookies;

// 	try {
		
// 		await jwt.isValidToken( token );
// 		return NextResponse.next();

// 	} catch (error) {
// 		const requestedPage = req.page.name
// 		return NextResponse.redirect(`/auth/login?p=${ requestedPage }`);	
// 	}

	//// return new Response( 'No autorizado', {
	//// 	status: 401
	//// });
// }

import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt'
// import { jwtVerify } from "jose";
 
 
export const middleware= async( req:NextRequest | any, ev:NextFetchEvent )=>{
 
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if( !session ){
       return new Response( JSON.stringify({ message: 'No autorizado'}), {
        status: 401,
        headers:{
            'Content-type': 'application/json'
        }
       })
    }
    
    const validRoles = ['admin', 'super-user', 'SEO'];
    
    if( !validRoles.includes( session.user.role ) ){
      return new Response( JSON.stringify({ message: 'No autorizado'}), {
        status: 401,
        headers:{
            'Content-type': 'application/json'
        }
       })          
    }

    return NextResponse.next();
    
 
}