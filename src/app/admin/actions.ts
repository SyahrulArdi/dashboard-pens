"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// ================= MAHASISWA =================
export async function getMahasiswa() {
  const { data, error } = await supabaseAdmin.from("mahasiswa").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addMahasiswa(data: any) {
  const { error } = await supabaseAdmin.from("mahasiswa").insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateMahasiswa(id: string, data: any) {
  const { error } = await supabaseAdmin.from("mahasiswa").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteMahasiswa(id: string) {
  const { error } = await supabaseAdmin.from("mahasiswa").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

// ================= DOSEN WALI =================
export async function getDosenWali() {
  const { data, error } = await supabaseAdmin.from("dosen_wali").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addDosenWali(data: any) {
  const { error } = await supabaseAdmin.from("dosen_wali").insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateDosenWali(id: string, data: any) {
  const { error } = await supabaseAdmin.from("dosen_wali").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteDosenWali(id: string) {
  const { error } = await supabaseAdmin.from("dosen_wali").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

// ================= PPKS =================
export async function getPPKS() {
  const { data, error } = await supabaseAdmin.from("ppks").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addPPKS(data: any) {
  const { error } = await supabaseAdmin.from("ppks").insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updatePPKS(id: string, data: any) {
  const { error } = await supabaseAdmin.from("ppks").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deletePPKS(id: string) {
  const { error } = await supabaseAdmin.from("ppks").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

// ================= MATA KULIAH =================
export async function getMataKuliah() {
  const { data, error } = await supabaseAdmin.from("mata_kuliah").select("*").order("kode_mk", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function addMataKuliah(data: any) {
  const { error } = await supabaseAdmin.from("mata_kuliah").insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateMataKuliah(kode_mk: string, data: any) {
  const { error } = await supabaseAdmin.from("mata_kuliah").update(data).eq("kode_mk", kode_mk);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteMataKuliah(kode_mk: string) {
  const { error } = await supabaseAdmin.from("mata_kuliah").delete().eq("kode_mk", kode_mk);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

// ================= JADWAL KULIAH =================
export async function getJadwalKuliah() {
  const { data, error } = await supabaseAdmin
    .from("jadwal_kuliah")
    .select("*, mata_kuliah(nama_mk), dosen_wali(nama)");
  if (error) throw new Error(error.message);
  return data;
}

export async function addJadwalKuliah(data: any) {
  const { error } = await supabaseAdmin.from("jadwal_kuliah").insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateJadwalKuliah(id: string, data: any) {
  const { error } = await supabaseAdmin.from("jadwal_kuliah").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteJadwalKuliah(id: string) {
  const { error } = await supabaseAdmin.from("jadwal_kuliah").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
