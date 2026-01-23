'use client'

import { div } from "framer-motion/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from 'framer-motion';
import DashboardChart from "@/app/components/DashboardChart";
import DashboardBarChart from "@/app/components/DashboardBarChart";
import { useEffect } from "react";
import { getAllPeserta } from "@/services/peserta.service";

export default function AdminDashboard() {

    const router = useRouter()

    const handleLogOut = () => {
        router.push('login')
    }

    useEffect(()=> {
        const dashboard = async () => {
            try{
            const res = await getAllPeserta()
            } catch (err:any) {
                router.push('/login')
            }
        }
        dashboard()
    }, [])

    return(
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-gray-300 p-4 rounded-xl flex flex-col gap-y-6">
                    <div className="text-lg font-semibold">Total Token Aktif</div>
                    <div className="text-6xl font-semibold">4</div>
                </div>
                <div className="bg-gray-300 p-4 rounded-xl flex flex-col gap-y-6">
                    <div className="text-lg font-semibold">Total Peserta</div>
                    <div className="text-6xl font-semibold">6</div>
                </div>
                <div className="bg-gray-300 p-4 rounded-xl flex flex-col gap-y-6">
                    <div className="text-lg font-semibold">Hasil Tes</div>
                    <div className="text-6xl font-semibold">8</div>
                </div>
            </div>

            {/* <div className="flex flex-col"> */}
                <div className="my-10 flex flex-col gap-y-3">
                    <div className="text-center text-lg font-semibold">
                        Jumlah Tes yang dilakukan tiap bulan
                    </div>
                    <DashboardChart />
                </div>

                <div className="my-10 flex flex-col gap-y-3">
                    <div className="text-center text-lg font-semibold">
                        Jumlah Peserta (tiap bulan)
                    </div>
                    <DashboardBarChart />
                </div>
            {/* </div> */}
            
        </div>
    )
}