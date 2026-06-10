import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Simulasi endpoint dari sistem proyek akhir lain (REST API eksternal)
  const { searchParams } = new URL(request.url);
  const mahasiswaId = searchParams.get('mahasiswaId');

  // Delay simulasi fetch
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!mahasiswaId) {
    return NextResponse.json({ error: 'mahasiswaId is required' }, { status: 400 });
  }

  // Generate random data for simulation
  const hasilPsikologi = {
    mahasiswaId,
    tanggal_tes: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    status_mental: "Stabil",
    rekomendasi: "Mahasiswa ini memiliki kemampuan adaptasi yang baik. Disarankan untuk melibatkan diri dalam kegiatan kepemimpinan.",
    skor_kategori: [
      { kategori: "Stabilitas Emosi", nilai: 85 },
      { kategori: "Motivasi Belajar", nilai: 78 },
      { kategori: "Ketahanan Stres", nilai: 92 },
      { kategori: "Kemampuan Sosial", nilai: 80 }
    ],
    risiko_dropout: "Rendah"
  };

  return NextResponse.json(hasilPsikologi);
}
