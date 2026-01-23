import { NextResponse } from "next/server";
import axiosBackend from "@/lib/axiosBackend";

export async function GET() {
    try{ 
        const res = await axiosBackend.get('/api/test/hello')

        return NextResponse.json(res.data)
    } catch(error:any) {
        return NextResponse.json(
            { message: 'gagal mendapatkan data' },
            { status: 500}
        )
    }
}