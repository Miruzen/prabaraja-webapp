
// pages/Reports.tsx
import { Sidebar } from "@/components/Sidebar";
import { ReportBox } from "@/components/reports/Reportbox";

import {
  FileText,
  BarChart,
  CreditCard,
  BookOpen,
  Book,
  Scale,
  TrendingUp,
  ClipboardList,
  PieChart,
  Settings,
} from "lucide-react";

const Reports = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header with Gradient Background */}
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Reports</h1>
          <p className="text-white/80">View your company reports</p>
        </div>

        {/* Grid Layout for Reports - Now Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportBox
              icon={Scale}
              title="Neraca"
              description="Menampilkan apa yang dimiliki (aset), apa saja utangnya (liabilitas), dan apa yang sudah dilinvestasikan ke perusahaan ini (ekuitas) pada tanggal tertentu."
              buttonText="Lihat Laporan"
              iconColor="text-blue-500"
              buttonColor="bg-blue-500"
              link="/neraca" // Link to the Neraca page
            />

            <ReportBox
              icon={BarChart}
              title="Laba Rugi"
              description="Menampilkan semua pendapatan yang diperoleh dan biaya yang dikeluarkan dalam periode tertentu."
              buttonText="Lihat Laporan"
              iconColor="text-green-500"
              buttonColor="bg-green-500"
              link="/laba-rugi" // Link to the Laba Rugi page
            />

            <ReportBox
              icon={CreditCard}
              title="Arus Kas"
              description="Menampilkan pergerakan uang masuk dan keluar dari transaksi dalam periode tertentu."
              buttonText="Lihat Laporan"
              iconColor="text-purple-500"
              buttonColor="bg-purple-500"
              link="/arus-kas" // Link to the Arus Kas page
            />

            <ReportBox
              icon={BookOpen}
              title="Buku Besar"
              description="Menampilkan semua transaksi berdasarkan akun dalam periode tertentu."
              buttonText="Lihat Laporan"
              iconColor="text-orange-500"
              buttonColor="bg-orange-500"
              link="/buku-besar" // Link to the Buku Besar page
            />

            <ReportBox
              icon={Book}
              title="Jurnal"
              description="Menampilkan semua journal entry per transaksi dalam periode tertentu."
              buttonText="Lihat Laporan"
              iconColor="text-pink-500"
              buttonColor="bg-pink-500"
              link="/jurnal" // Link to the Jurnal page
            />

            <ReportBox
              icon={FileText}
              title="Neraca Saldo"
              description="Menampilkan saldo dari setiap akun, termasuk saldo awal, pergerakan, dan saldo akhir dalam periode tertentu."
              buttonText="Lihat Laporan"
              iconColor="text-teal-500"
              buttonColor="bg-teal-500"
              link="/neraca-saldo" // Link to the Neraca Saldo page
            />

            <ReportBox
              icon={TrendingUp}
              title="Perubahan Modal"
              description="Menampilkan perubahan atau pergerakan ekuitas pemilik dalam periode tertentu."
              buttonText="Lihat Laporan"
              iconColor="text-indigo-500"
              buttonColor="bg-indigo-500"
              link="/perubahan-modal" // Link to the Perubahan Modal page
            />

            <ReportBox
              icon={ClipboardList}
              title="Anggaran Laba Rugi"
              description="Menampilkan perbandingan antara jumlah transaksi sebenarnya dan anggaran yang telah disusun per akun."
              buttonText="Lihat Laporan"
              iconColor="text-yellow-500"
              buttonColor="bg-yellow-500"
              link="/anggaran-laba-rugi" // Link to the Anggaran Laba Rugi page
            />

            <ReportBox
              icon={PieChart}
              title="Ringkasan Bisnis"
              description="Menampilkan ringkasan laporan keuangan utama dan wawasannya dalam periode tertentu."
              buttonText="Lihat Laporan"
              iconColor="text-red-500"
              buttonColor="bg-red-500"
              link="/ringkasan-bisnis" // Link to the Ringkasan Bisnis page
            />

            <ReportBox
              icon={Settings}
              title="Manajemen Anggaran"
              description="Memungkinkan Anda mengatur dan mengelola anggaran untuk pengeluaran dan pendapatan perusahaan ini."
              buttonText="Lihat Laporan"
              iconColor="text-gray-500"
              buttonColor="bg-gray-500"
              link="/manajemen-anggaran" // Link to the Manajemen Anggaran page
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
