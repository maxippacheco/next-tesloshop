
// ... => cualquier peticion a este endpoint se realiza aqui
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { dbUsers } from "../../../database";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@correo.com'},
        password: { label: 'Contraseña', type: 'password', placeholder: 'Contraseña'},
      },
      async authorize(credentials) {

        console.log({credentials});
        

        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password )
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
   

  ],

  jwt: {},

  // Custom pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  session: {
    maxAge: 2592000,
    strategy: 'jwt',
    updateAge: 86400

  },

  // Callbacks

  callbacks: {
    async jwt({ token, account, user }){
      console.log({token, account, user});
      

      if( account ){ 
        token.accessToken = account.access_token;

        switch (account.type) {
          case 'oauth':
            console.log({ account, token, user });
            
            // crear o verificar si existe en mi DB
            token.user = await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '' );
          break;
          
          case 'credentials':
            token.user = user;

          break;
        }
      }      

      return token;
    },
    async session({ session, token, user }){

      

      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    }
  }
})
