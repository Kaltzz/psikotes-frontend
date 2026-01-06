'use client'

import Link from "next/link"

export default function AdminPesertaDetail() {
    return(
        <div className="">
            <div className="mb-8 border-b pb-5 border-gray-300 flex justify-between items-center">
                <p className="font-bold text-3xl">Info Peserta</p>
                <Link 
                    href='/admin/peserta'
                    className="bg-gray-300 px-5 py-1 rounded-lg hover:bg-gray-400"
                >
                    Kembali
                </Link>
            </div>
            <div className="flex gap-x-20">
                <ul className="flex flex-col gap-y-6">
                    <li>    
                        <p className="text-gray-600">Nama</p>
                        <p className="font-semibold text-lg">Andi Muhammad Rezky M</p>
                    </li>
                    <li>    
                        <p className="text-gray-600">Umur</p>
                        <p className="font-semibold text-lg">20 Tahun</p>
                    </li>
                    <li>    
                        <p className="text-gray-600">Jenis Kelamin</p>
                        <p className="font-semibold text-lg">Laki-Laki</p>
                    </li>
                </ul>                        
                        
                <ul className="flex flex-col gap-y-6">
                    <li>    
                        <p className="text-gray-600">Pendidikan Terakhir</p>
                        <p className="font-semibold text-lg">Strata 1 (S1)</p>
                    </li>
                    <li>    
                        <p className="text-gray-600">Jurusan</p>
                        <p className="font-semibold text-lg">Teknik Informatika</p>
                    </li>
                    <li>    
                        <p className="text-gray-600">Status Tes</p>
                        <p className="bg-yellow-300 px-2 py-1 rounded-xl mt-2 text-white text-sm text-center">sedang mengerjakan</p>
                    </li>
                </ul>    
            </div>
            
        </div>
    )
}