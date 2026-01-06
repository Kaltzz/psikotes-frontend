'use client'
import { div, tr } from "framer-motion/client";
import Link from "next/link";

const peserta = [
    {id: 1, nama: 'Rezky', progres: 'belum mulai'},
    {id: 2, nama: 'Steve', progres: 'sedang mengerjakan'},
    {id: 2, nama: 'Roger', progres: 'Selesai'},
]

export default function AdminPeserta() {
    return (
        <div>
            <p className="mb-12 text-3xl font-bold border-b pb-5 border-gray-200">List Peserta</p>
            <div className="rounded-lg overflow-hidden">
                <table className="border-collapse w-full">
                    <thead className="border-b border-gray-300 bg-gray-300 p-4 text-left text-base">
                        <tr>
                            <th className="py-2 px-4">Nama</th>
                            <th className="py-2 px-4">Progres</th>
                            <th className="py-2 px-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {peserta.map(item => (
                            <tr
                                key={item.nama}
                                className="border-b border-gray-300 text-base"
                            >
                                <td className="py-2 px-4">{item.nama}</td>
                                <td className={`py-2 px-4 flex`}>
                                        <p className={` py-1 px-3 rounded-lg font-semibold text-white ${
                                    item.progres === 'belum mulai'
                                    ? 'bg-gray-400'
                                    : item.progres === 'sedang mengerjakan'
                                    ? 'bg-yellow-300'
                                    : item.progres === 'Selesai'
                                    ? 'bg-green-600'
                                    : ''
                                    }`}>{item.progres}</p>
                                    </td>
                                <td className="py-2 px-4">
                                    <Link
                                    href={`/admin/peserta/detail`}
                                    className="px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                    >Detail</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}