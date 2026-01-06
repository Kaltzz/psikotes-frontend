'use client'

import { div } from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


const daftarToken = [
    {token: '123asd', tes: 'CFIT', kuota: '2/4', expired: '12/01/2025 23:40'},
    {token: '456rfg', tes: 'DSIC', kuota: '1/1', expired: '12/01/2025 21:40'},
]

export default function AdminTokenTes() {

    const [isCopied, setIsCopied] = useState(false)

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
                            <th className="py-2 px-4">Aksi</th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        {daftarToken.map(item=> (
                            <tr
                                key={item.token}
                                className="border-b border-gray-300 text-base"
                            >
                                <td className="py-2 px-2">
                                    <input type="text" className="" value={item.token} readOnly/>
                                </td>
                                <td className="py-2 px-4">{item.tes}</td>
                                <td className="py-2 px-4">{item.kuota}</td>
                                <td className="py-2 px-4 flex gap-x-4">
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
                                    <button className="flex text-white hover:bg-red-600 bg-red-500 px-2 py-1 rounded-lg">
                                        <Image 
                                            src='/assets/deletesvg.svg'
                                            width={15}
                                            height={15}
                                            alt="delete"
                                        />
                                        <p className=" ml-1">Hapus</p>
                                    </button>
                                    
                                </td>
                            </tr>
                        ))}
                        
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}