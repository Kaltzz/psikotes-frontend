'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

const menu = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '/assets/dashboardsvg.svg'},
    { label: 'Token Tes', href: '/admin/tokentes', icon: '/assets/tokensvg.svg'},
    { label: 'Peserta', href: '/admin/peserta', icon: '/assets/teamsvg.svg'},
    { label: 'Hasil Tes', href: '/admin/hasiltes', icon: '/assets/assignmentsvg.svg'},
    
]

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function Sidebar({isOpen, toggle}: SidebarProps) {
    const pathname = usePathname()

    return(
        <>

        {/* Overlay for mobile view when menu is open */}

        <div 
            className={
                
                `bg-white font-sans min-h-screen ${
                isOpen === true
                ?`block`
                :`hidden md:block`
                }`
                
            }
        >

            <div className="border-b-2 border-gray-200 mb-10 py-5 mx-4">
                <p className=" px-8 text-2xl font-bold ">TES PSIKOTES</p>
            </div>
            <ul className="flex flex-col px-6">
                {menu.map(item => (
                        <Link 
                        key={item.href}
                        href={item.href}
                        className="mb-4 py-4 px-4 text-lg hover:bg-gray-200 rounded-lg font-semibold flex flex-row gap-x-3"
                        >
                            <div>
                                <Image 
                                    src={item.icon}
                                    width={30}
                                    height={30}
                                    alt="dashboard"
                                />
                            </div>
                            <div>
                                {item.label}
                            </div>
                        </Link>
                    
                ))}
                <button className="text-left px-4 flex gap-x-3 text-lg font-semibold hover:bg-gray-200 mb-4 py-4 rounded-lg">
                    <Image 
                        src="/assets/logoutsvg.svg"
                        width={25}
                        height={25}
                        alt=""
                    />
                    Logout
                </button>
            </ul>
        </div>
        </>
    )
}