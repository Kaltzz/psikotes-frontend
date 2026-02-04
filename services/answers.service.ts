import api from "@/lib/axiosBackend"

export const storeAnswersCfit = (
    sessionId: number,
    data: {
        questionId: number,
        answers: number[],
        subtest: number
    }[]
) => api.post(`/api/user/answers/cfit/${sessionId}`, data)

export const storeAnswersDisc = (
    sessionId: number,
    data: {
        most: { groupId: number; type: string}[]
        least: {groupId: number; type: string}[]
    }
) => api.post(`/api/user/answers/disc/${sessionId}`, data)

export const postStatusTest = (
    sessionId: number
) =>api.put(`/api/user/peserta/status/${sessionId}`)