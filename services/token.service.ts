import api from "@/lib/axiosBackend";

export const getAllToken = () => api.get('/api/admin/token')

export const postToken = ( data: {
    tests: string[],
    kuota: number
}) => api.post('/api/admin/token', data)

export const statusToken = (id:number, status:any) => api.put(`/api/admin/token/${id}`, status)

export const getFormToken = () => api.get('/api/admin/token/form')
