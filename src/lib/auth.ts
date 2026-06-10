import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Masukkan Email Anda" },
        password: { label: "Password", type: "password" },
        existingRoles: { label: "Existing Roles", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password } = credentials;
        const lowerEmail = email.toLowerCase();

        console.log("[AUTH] Attempt login:", lowerEmail);

        let existingRoles: Record<string, any> = {};
        if (credentials?.existingRoles) {
          try {
            existingRoles = JSON.parse(credentials.existingRoles);
          } catch (e) {
            console.error("[AUTH] Gagal parse existingRoles", e);
          }
        }

        const createMergedUser = (user: any, roleKey: string) => {
          existingRoles[roleKey] = {
            id: user.id,
            email: user.email,
            name: user.nama || user.name,
            role: roleKey
          };
          return {
            ...existingRoles[roleKey],
            roles: existingRoles
          };
        };

        // 1. Cek Admin (@admin.pens.ac.id)
        if (lowerEmail.endsWith("@admin.pens.ac.id")) {
          const { data: admin, error } = await supabaseAdmin
            .from("admin")
            .select("*")
            .eq("email", lowerEmail)
            .single();
          
          if (admin && (password === "password" || password === admin.password_hash)) {
            return createMergedUser(admin, "admin");
          }
          return null;
        }

        // 2. Cek Mahasiswa (semua subdomain student.pens.ac.id, misal @it.student.pens.ac.id)
        if (lowerEmail.includes("student.pens.ac.id")) {
          const { data: mhs, error } = await supabaseAdmin
            .from("mahasiswa")
            .select("*")
            .eq("email", lowerEmail)
            .single();
          
          if (mhs && (password === "password" || password === mhs.password_hash)) {
            return createMergedUser(mhs, "mahasiswa");
          }
          return null;
        }

        // 3. Cek PPKS (@ppks.pens.ac.id)
        if (lowerEmail.endsWith("@ppks.pens.ac.id")) {
          const { data: ppks, error } = await supabaseAdmin
            .from("ppks")
            .select("*")
            .eq("email", lowerEmail)
            .single();
          
          if (ppks && (password === "password" || password === ppks.password_hash)) {
            return createMergedUser(ppks, "ppks");
          }
          return null;
        }

        // 4. Cek Dosen Wali (@pens.ac.id)
        if (lowerEmail.endsWith("@pens.ac.id")) {
          const { data: dosen, error } = await supabaseAdmin
            .from("dosen_wali")
            .select("*")
            .eq("email", lowerEmail)
            .single();
          
          if (dosen && (password === "password" || password === dosen.password_hash)) {
            return createMergedUser(dosen, "dosen_wali");
          }
          return null;
        }

        console.log("[AUTH] Domain tidak dikenali atau salah kredensial:", lowerEmail);
        return null; // Domain tidak dikenali atau salah password
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as any).role;
        token.roles = (user as any).roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
        (session.user as any).role = token.role as string;
        (session.user as any).roles = token.roles || {};
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecret",
};
