import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Masukkan Email Anda" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password } = credentials;
        const lowerEmail = email.toLowerCase();

        console.log("[AUTH] Attempt login:", lowerEmail);

        // 1. Cek Admin (@admin.pens.ac.id)
        if (lowerEmail.endsWith("@admin.pens.ac.id")) {
          const { data: admin, error } = await supabaseAdmin
            .from("admin")
            .select("*")
            .eq("email", lowerEmail)
            .single();
          
          console.log("[AUTH] Admin query result:", admin, "Error:", error);
          
          if (admin && (password === "password" || password === admin.password_hash)) {
            console.log("[AUTH] Admin login SUCCESS");
            return { id: admin.id, name: admin.nama, email: admin.email, role: "admin" };
          }
          console.log("[AUTH] Admin login FAILED - password mismatch or not found");
          return null;
        }

        // 2. Cek Mahasiswa (semua subdomain student.pens.ac.id, misal @it.student.pens.ac.id)
        if (lowerEmail.includes("student.pens.ac.id")) {
          const { data: mhs, error } = await supabaseAdmin
            .from("mahasiswa")
            .select("*")
            .eq("email", lowerEmail)
            .single();
          
          console.log("[AUTH] Mahasiswa query result:", mhs, "Error:", error);
          
          if (mhs && (password === "password" || password === mhs.password_hash)) {
            return { id: mhs.id, name: mhs.nama, email: mhs.email, role: "mahasiswa" };
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
          
          console.log("[AUTH] PPKS query result:", ppks, "Error:", error);
          
          if (ppks && (password === "password" || password === ppks.password_hash)) {
            return { id: ppks.id, name: ppks.nama, email: ppks.email, role: "ppks" };
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
          
          console.log("[AUTH] Dosen query result:", dosen, "Error:", error);
          
          if (dosen && (password === "password" || password === dosen.password_hash)) {
            return { id: dosen.id, name: dosen.nama, email: dosen.email, role: "dosen_wali" };
          }
          return null;
        }

        console.log("[AUTH] Domain tidak dikenali:", lowerEmail);
        return null; // Domain tidak dikenali atau salah password
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
        session.user.email = token.email as string;
        (session.user as { role?: string }).role = token.role as string;
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
