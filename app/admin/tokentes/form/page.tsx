'use client'

import { div } from "framer-motion/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminForm() {

    const router = useRouter()
    const [formData, setFormData] = useState<{
        tes: string[],
        kuota: string
    }>({
        tes: [],
        kuota: ''

    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;

  if (type === 'checkbox') {
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => {
      const tes = prev.tes;

      return {
        ...prev,
        tes: checked
          ? [...tes, value]                // tambah
          : tes.filter(item => item !== value), // hapus
      };
    });

    return;
  }

  // selain checkbox (input biasa)
  setFormData(prev => ({
    ...prev,
    [name]: value,
  }));
};

    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const {tes, kuota} = formData
        if(tes.length === 0 || !kuota) {
            alert('Mohon Lengkapi semua data')
            return
        }
        setIsSubmitting(true)
        localStorage.setItem('userdata', JSON.stringify(formData))
    }


    useEffect(()=> {
        console.log('Ini isi form data: ', formData)
    }, [formData])

    return (
        <div>
            <p className="mb-12 text-3xl font-bold border-b pb-5 border-gray-200">Buat Token</p>
            <form action="" onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 text-lg">
                    <p className="">Jenis tes: </p>
                    <div className="">
                        <div className="space-x-3">
                            <input type="checkbox" id="cfit" value="cfit" name="tes" onChange={handleChange}/>
                            <label htmlFor="tes">CFIT</label>
                        </div>
                        <div className="space-x-3">
                            <input type="checkbox" id="disc" value="disc" name="tes" onChange={handleChange}/>
                            <label htmlFor="tes">DISC</label>
                        </div>
                        <div className="space-x-3">
                            <input type="checkbox" id="kraepelin" value="kraepelin" name="tes" onChange={handleChange}/>
                            <label htmlFor="tes">Kraepelin</label>
                        </div>
                        <div className="space-x-3">
                            <input type="checkbox" id="mbti" value="mbti" name="tes" onChange={handleChange}/>
                            <label htmlFor="tes">MBTI</label>
                        </div>
                        <div className="space-x-3">
                            <input type="checkbox" id="msdt" value="msdt" name="tes" onChange={handleChange}/>
                            <label htmlFor="tes">MSDT</label>
                        </div>
                        <div className="space-x-3">
                            <input type="checkbox" id="papi" value="papi" name="tes" onChange={handleChange}/>
                            <label htmlFor="tes">PapiKostick</label>
                        </div>
                    </div>
                </div>

                <div className="space-x-2 text-lg">
                    <label htmlFor="kuota">Kuota: </label>
                    <input type="number" name="kuota" id="kuota" min="1" max="1000" className="border border-gray-400 rounded-lg px-3 py-2" onChange={handleChange}/>
                </div>

                <div className="flex gap-x-5 mt-16">
                    <Link
                        href='/admin/tokentes'
                        className="px-3 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                    >
                        Kembali
                    </Link>
                    <button 
                        type="submit"
                        className="px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Buat Token
                    </button>
                </div>
            </form>
        </div>
    )
}