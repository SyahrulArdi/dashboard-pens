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
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        // 1. Cek Admin (@admin.pens.ac.id)
        if (email.endsWith("@admin.pens.ac.id")) {
          const { data: admin } = await supabaseAdmin
            .from("admin")
            .select("id, email, nama, password_hash")
            .eq("email", email)
            .single();

          if (admin && password === admin.password_hash) {
            return { id: admin.id, name: admin.nama, email: admin.email, role: "admin" };
          }
          return null;
        }

        // 2. Cek Mahasiswa (@*.student.pens.ac.id)
        if (email.includes("student.pens.ac.id")) {
          const { data: mhs } = await supabaseAdmin
            .from("mahasiswa")
            .select("id, email, nama, password_hash")
            .eq("email", email)
            .single();

          if (mhs && password === mhs.password_hash) {
            return { id: mhs.id, name: mhs.nama, email: mhs.email, role: "mahasiswa" };
          }
          return null;
        }

        // 3. Cek PPKS (@ppks.pens.ac.id)
        if (email.endsWith("@ppks.pens.ac.id")) {
          const { data: ppks } = await supabaseAdmin
            .from("ppks")
            .select("id, email, nama, password_hash")
            .eq("email", email)
            .single();

          if (ppks && password === ppks.password_hash) {
            return { id: ppks.id, name: ppks.nama, email: ppks.email, role: "ppks" };
          }
          return null;
        }

        // 4. Cek Dosen Wali (@pens.ac.id) â€” harus paling akhir karena lebih umum
        if (email.endsWith("@pens.ac.id")) {
          const { data: dosen } = await supabaseAdmin
            .from("dosen_wali")
            .select("id, email, nama, password_hash")
            .eq("email", email)
            .single();

          if (dosen && password === dosen.password_hash) {
            return { id: dosen.id, name: dosen.nama, email: dosen.email, role: "dosen_wali" };
          }
          return null;
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Saat pertama login, user tersedia â€” simpan id dan role ke token
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // Sesi login dijamin aktif selama 24 jam
  },
  secret: process.env.NEXTAUTH_SECRET,
};
