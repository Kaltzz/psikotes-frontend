'use client'

import { div, ul } from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllToken, statusToken } from "@/services/token.service";
import { useRouter } from "next/navigation";

interface Data {
    id: number
    token: string
    tests: []
    kuota: number
    isActive: boolean
}

export default function AdminTokenTes() {

    const [isCopied, setIsCopied] = useState(false)
    const [data, setData] = useState<Data[]>([])

    const router = useRouter()

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => {
            setIsCopied(false);
            }, 1000);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const token = data.find(d => d.id === id)
            const status = token?.isActive ? {status: false} : {status: true}
            // const status = data[id].isActive ? {status: false} : {status: true}
            console.log('ini handledelte:', status)
            await statusToken(id, status)
            setData(currentItem => {
                return currentItem.map(item =>
                    item.id === id
                    ? {...item, isActive: status.status}
                    : item
                )
            }

            )
            return console.log('berhasil dihapus')
        } catch (err:any) {
            return console.log(err)
        }
    }

    useEffect(() => {
        const getTOken = async () => {
        try {
            const token = await getAllToken()
            setData(token.data.data)
        } catch( err:any) {
            router.push('/login')
        }
    }
    getTOken()
    }, [])
    

    useEffect(()=> {
        console.log(data)
    }, [data])


    return (
        <div>
            <div className="mb-6">
                <Link
                    href="/admin/tokentes/form"
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                >
                    Buat Token
                </Link>
            </div>
            <div className="rounded-lg overflow-hidden">
                <table className="border-collapse w-full">
                    <thead className="border-b border-gray-300 bg-gray-300 p-4 text-left text-base">
                        <tr>
                            <th className="py-2 px-4">Token</th>
                            <th className="py-2 px-4">Jenis Tes</th>
                            <th className="py-2 px-4">Kuota</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Aksi</th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        {data.map(item=> { 
                            
                            return(
                            <tr
                                key={item.token}
                                className="border-b border-gray-300 text-base"
                            >
                                <td className="py-2 px-2">
                                    <input type="text" className="" value={item.token} readOnly/>
                                </td>
                                
                                <td className="py-2 px-4">
                                    {item.tests.map(list=> (
                                    <ul
                                    key={list}
                                    className=""
                                    >
                                        <li className="list-disc my-0.5">{list}</li>
                                    </ul>
                                ))}
                                </td>
                                <td className="py-2 px-4">{item.kuota}</td>
                                <td className="py-2 px-4">
                                    <div className={`text-center text-white rounded-lg py-0.5 ${
                                        item.isActive
                                        ? 'bg-green-500'
                                        : 'bg-red-500'
                                        }`}>
                                        {item.isActive ? 'Aktif': 'Tidak Aktif'}
                                    </div>
                                </td>
                                <td className="py-2 px-4 h-full">
                                    <div className="flex gap-x-4 items-center">
                                        <button 
                                            className="flex hover:bg-gray-300 bg-gray-200 px-2 py-1 rounded-lg"
                                            onClick={()=> copyToClipboard(item.token)}
                                            >
                                            <Image
                                                src='/assets/copysvg.svg'
                                                width={20}
                                                height={20}
                                                alt="copy svg"
                                            />
                                            <p className=" ml-1">Salin</p>
                                        </button>
                                        <button className={`flex hover:bg-gray-300 bg-gray-200  px-2 py-1 rounded-lg 
                                            
                                            `}
                                            onClick={()=>{handleDelete(item.id)}}
                                            >
                                            {/* <Image 
                                                src='/assets/deletesvg.svg'
                                                width={15}
                                                height={15}
                                                alt="delete"
                                            /> */}
                                            <p className=" ml-1">
                                                {item.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                                            </p>
                                        </button>
                                    </div>
                                    
                                    
                                </td>
                            </tr>
                        )})}
                        
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}