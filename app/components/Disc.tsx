'use client'

import { useState } from "react"
import DiscChart from "./DiscChartComponent"


export default function Disc() {

    type DiscType = 'D' | 'I' | 'S' | 'C'

    type DiscAnswer = {
        groupId: number
        type: DiscType
    }

    type DiscAnswers = {
        most: DiscAnswer[]
        least: DiscAnswer[]
}


    const [answers] = useState<DiscAnswers>({
        most: [
            { groupId: 0, type: 'D'},
            { groupId: 1, type: 'C'},
            { groupId: 2, type: 'S'},
        ],
        least: [
            {groupId: 0, type: 'I'},
            {groupId: 1, type: 'D'},
            {groupId: 2, type: 'S'},
        ]
    })

    return(
        <div>
            ini Disc
            <DiscChart answers = {answers}/>
        </div>
    )
}