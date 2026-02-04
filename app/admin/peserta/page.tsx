'use client'
import { div, tr } from "framer-motion/client";
import Link from "next/link";
import { getAllPeserta } from "@/services/peserta.service";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface TestSession {
    statusTest: number
}

interface Data {
    id: number
    nama: string
    testSession: TestSession[]
}

export default function AdminPeserta() {
    const [data, setData] = useState<Data[]>([])
    const router = useRouter()

    useEffect(()=> {
        const getPeserta = async () => {
            try {
                const peserta = await getAllPeserta()
                setData(peserta.data.data)
            } catch (err:any){
                router.push('/login')
            }   
        }
        getPeserta()
    }, [])

    useEffect(()=> {
        console.log(data)
    }, [data])

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
                        {data.map(item => { 

                            const status = item.testSession[0].statusTest
                            return (
                            <tr
                                key={item.nama}
                                className="border-b border-gray-300 text-base"
                            >
                                <td className="py-2 px-4">{item.nama}</td>
                                <td className={`py-2 px-4 flex`}>
                                        <p className={` py-1 px-3 rounded-lg font-semibold text-white ${
                                    status === 0
                                    ? 'bg-gray-400'
                                    : status === 1
                                    ? 'bg-yellow-300'
                                    : 'bg-green-600'
                                    }`}>{
                                        status === 0 
                                        ? 'Belum mengerjakan'
                                        : status === 1 
                                        ? 'Sedang mengerjakan' 
                                        : 'Selesai mengerjakan'}</p>
                                    </td>
                                <td className="py-2 px-4">
                                    <Link
                                    href={`/admin/peserta/detail/${item.id}`}
                                    className="px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                    >Detail</Link>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </div>
    )
}