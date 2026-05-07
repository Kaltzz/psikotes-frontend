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
    usedCount: number
    isActive: boolean
    activeDate: string
    expiredDate: string
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

    const convertDate = (date: string | Date) => {
    const newDate = new Date(date)
    
    const datePart = newDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Makassar'
    })
    
    const timePart = newDate.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Makassar'
    }).replace('.', ':')
    
    return `${datePart} ${timePart}`
}
    

    useEffect(()=> {
        console.log(data)
    }, [data])

    useEffect(() => {
    document.title = "Token Tes - Psychological Tests";
  }, [])

    return (
        <div>
            <div className="mb-15 text-4xl font-extrabold">
                <p>TOKEN TES</p>
            </div>
            <div className="mb-6 flex">
                <Link
                    href="/admin/tokentes/form"
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                >
                    Buat Token
                </Link>
            </div>
            <div className="rounded-lg overflow-hidden">
                <table className="border-collapse w-full">
                    <thead className="border-b border-gray-200 bg-gray-200 p-4 text-left text-base">
                        <tr>
                            <th className="py-3 px-3">Token</th>
                            <th className="py-4 px-4">Jenis Tes</th>
                            <th className="py-4 px-4">Kuota</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4">
                                Masa aktif
                                (dari)
                            </th>
                            <th className="py-4 px- ">
                                Masa aktif
                                (hingga)
                            </th>
                            <th className="py-4 px-4">Aksi</th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        {data.map(item=> { 
                            
                            return(
                            <tr
                                key={item.token}
                                className="border-b border-gray-300 text-base"
                            >
                                <td className="py-4 px-2">
                                    <input type="text" className="" value={item.token} readOnly/>
                                </td>
                                
                                <td className="py-4 px-4">
                                    {item.tests.map(list=> (
                                    <ul
                                    key={list}
                                    className=""
                                    >
                                        <li className="list-disc my-0.5">{list}</li>
                                    </ul>
                                ))}
                                </td>
                                <td className="py-4 px-4">{item.usedCount}/{item.kuota}</td>
                                <td className="py-4 px-4">
                                    <div className={`text-center text-white rounded-lg py-0.5 ${
                                        item.isActive
                                        ? 'bg-green-500'
                                        : 'bg-red-500'
                                        }`}>
                                        {item.isActive ? 'Aktif': 'Tidak Aktif'}
                                    </div>
                                </td>
                                <td className="py-4 px-4">{convertDate(item.activeDate)}</td>
                                <td className="py-4 px-4">{convertDate(item.expiredDate)}</td>
                                <td className="py-4 px-4 h-full">
                                    <div className="flex flex-col gap-y-3 gap-x-4 items-center">
                                        <button 
                                            className="flex w-full justify-center hover:bg-blue-800 bg-blue-600 text-white px-2 py-1 rounded-lg"
                                            onClick={()=> copyToClipboard(item.token)}
                                            >
                                            <svg 
                                                width="20" 
                                                height="20" 
                                                viewBox="0 0 64 64" 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                strokeWidth="3" 
                                                stroke="currentColor" 
                                                fill="none"
                                                className="text-white"
                                            >
                                                <rect x="11.13" y="17.72" width="33.92" height="36.85" rx="2.5"/>
                                                <path d="M19.35,14.23V13.09a3.51,3.51,0,0,1,3.33-3.66H49.54a3.51,3.51,0,0,1,3.33,3.66V42.62a3.51,3.51,0,0,1-3.33,3.66H48.39"/>
                                            </svg>
                                            <p className=" ml-1">Salin</p>
                                        </button>
                                        <button className={`flex w-full hover:bg-red-800 bg-red-600 text-white  px-2 py-1 rounded-lg 
                                            
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