import api from "@/lib/axiosBackend"

export const storeAnswersCfit = (
    sessionId: number,
    data: {
        questionId: number,
        answers: number[],
        subtest: number
    }[]
) => api.post(`/api/user/answers/cfit/${sessionId}`, data)

export const postStatusTest = (
    sessionId: number
) =>api.put(`/api/user/peserta/status/${sessionId}`)