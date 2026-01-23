'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { getDetailPeserta } from "@/services/peserta.service"
import { useRouter } from "next/navigation"

export default function AdminPesertaDetail({ params }: { params: Promise<{ id: string }> }) {
    const [data, setData] = useState<any>(null)
    const router = useRouter()

    useEffect(()=> {
        const detailPeserta = async () => {
            try{
            const {id} = await params
            const peserta = await getDetailPeserta(Number(id))
            setData(peserta.data.data)
            } catch(err:any) {
                router.push('/login')
            }
        }
        detailPeserta()
    }, [])

    useEffect(()=>{
        console.log('ini data', data)
    }, [data])
    
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
                {data 
                ? <div className="flex gap-x-20">
                    <ul className="flex flex-col gap-y-6">
                    <li>    
                        <p className="text-gray-600">Nama</p>
                        <p className="font-semibold text-lg">{data.nama}</p>
                    </li>
                    <li>    
                        <p className="text-gray-600">Usia</p>
                        <p className="font-semibold text-lg">{data.usia}</p>
                    </li>
                    <li>    
                        <p className="text-gray-600">Jenis Kelamin</p>
                        <p className="font-semibold text-lg">{data.jenisKelamin}</p>
                    </li>
                </ul>                        
                        
                <ul className="flex flex-col gap-y-6">
                    <li>    
                        <p className="text-gray-600">Pendidikan Terakhir</p>
                        <p className="font-semibold text-lg">{data.pendidikanTerakhir}</p>
                    </li>
                    <li>    
                        <p className="text-gray-600">Jurusan</p>
                        <p className="font-semibold text-lg">{data.jurusan}</p>
                    </li>
                    <li>    
                        <p className="text-gray-600">Status Tes</p>
                        <p className={` px-2 py-1 rounded-xl mt-2 text-white text-sm text-center ${
                        data.testSession[0].statusTest === 2 
                        ? 'bg-green-600'
                        : data.testSession[0].statusTest === 1
                        ? 'bg-yellow-400'
                        : 'bg-red-600'
                        }`}>{
                        data.testSession[0].statusTest === 2 
                        ? 'Selesai mengerjakan'
                        : data.testSession[0].statusTest === 1
                        ? 'Sedang mengerjakan'
                        : 'Belum mengerjakan'
                        }
                        </p>
                    </li>
                </ul>
                </div>

                : <div>
                    Data tidak ada
                </div>
            }
                    
            </div>
            
        </div>
    )
}