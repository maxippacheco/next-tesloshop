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
 
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
 
    console.log({session});

    if( !session ){
        
        const { origin } = req.nextUrl.clone()
        const requestedPage = req.page.name
        
        console.log({requestedPage});
    
        return NextResponse.redirect(`${ origin }/auth/login?p=${ requestedPage }`)
    }

    return NextResponse.next();
    

    // let url= req.nextUrl.clone();
    // url.basePath = '/auth/login?p=';
    // url.pathname = req.page.name!;
 
    // const {token=''}= req.cookies;
 
    // try {
    
    //     await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED));
    //     return NextResponse.next();
        
    // } catch (error) {
    //     return NextResponse.redirect(url);
    // }
 

 
}