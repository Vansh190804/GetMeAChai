import connectDB from '@/lib/mongodb'
import User from '@/Models/User'
import Session from '@/Models/Session'
import AppleProvider from 'next-auth/providers/apple'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from 'next-auth/providers/credentials'



export const authoptions = {
  providers: [
    // OAuth authentication providers...
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const returnUser = {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
        };

        return returnUser
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB()

      const existingUser = await User.findOne({ email: user.email });
      
      
      if (account.provider != "credentials") {
        if (!existingUser) {
          
          const generatedUsername =
            user.email.split("@")[0];

            const newuser = new User({
              username: generatedUsername,
              email: user.email,
              password: "",
              provider: account.provider,
              picture: user.image,
              isProfile: false
            });
            await newuser.save()
            return true;
        }
        else {
          if (existingUser.provider != account.provider) {
            throw new Error(`${existingUser.provider}`);
          }
          else{
            return true;
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        await connectDB()
        const existuser = await User.findOne({email: user.email})
        if(existuser){
        const toggle = existuser.isProfile
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.isProfile = toggle}
        else{
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.isProfile = false;
        }
        const dbsession = await Session.findOne({userId: user.id})
        if (!dbsession) {
          const newsession = new Session({
            sessionToken: token.jti,
            userId: user.id,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          })
          await newsession.save()
        }
      }
      return token;
    },
    async session({ session, token }) {
    if (token) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;
      session.user.isProfile = token.isProfile;
    }
    return session;
    },
    async redirect({ baseUrl }) {
    return `${baseUrl}/auth-redirect`;
    }
},
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: true
}

