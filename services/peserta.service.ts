import api from "@/lib/axiosBackend";

export const getAllPeserta = () => api.get('/api/admin/peserta')

export const registerPeserta = (data: {
    nama: string,
    jenisKelamin: string,
    unit: String,
    usia: number,
    pendidikanTerakhir: string,
    jurusan: string,
    tokenPeserta: string
}) => api.post('/api/user/peserta', data)

export const getDetailPeserta = (id:number) => api.get(`/api/admin/peserta/detail/${id}`)

export const getFormPeserta = () => api.get('/api/admin/peserta/form')