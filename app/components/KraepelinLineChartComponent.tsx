'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartDataLabels
)

type Answer = -1 | 0 | 1

interface KraepelinLineChartProps {
  answers: Answer[][]
}

export default function KraepelinLineChart({ answers }: KraepelinLineChartProps) {
  // hitung frekuensi benar & salah per kolom
  const correctPerColumn = answers.map(col =>
    col.filter(v => v === 1).length
  )

  const wrongPerColumn = answers.map(col =>
    col.filter(v => v === -1).length
  )

  const notAnswerPerColumn = answers.map(col =>
    col.filter(v => v === 0).length
  )

  const labels = answers.map((_, i) => `Kolom ${i + 1}`)

  const data: ChartData<'line', number[], string> = {
  labels,
  datasets: [
    {
      label: 'Benar',
      data: correctPerColumn,
      borderColor: 'rgba(59,130,246,1)',
      backgroundColor: 'rgba(59,130,246,0.2)',
      tension: 0.1,
      pointRadius: 4,
    },
    {
      label: 'Salah',
      data: wrongPerColumn,
      borderColor: 'rgba(239,68,68,1)',
      backgroundColor: 'rgba(239,68,68,0.2)',
      tension: 0.1,
      pointRadius: 4,
    },
    {
      label: 'Tidak diisi',
      data: notAnswerPerColumn,
      borderColor: 'rgb(87, 89, 91)',
      backgroundColor: 'rgb(87, 89, 91)',
      tension: 0.1,
      pointRadius: 4,
    },
  ],
}

  const options: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
    datalabels: {
      display: true,
      clamp: true,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Kolom',
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Frekuensi',
      },
      ticks: {
        precision: 0,
      },
    },
  },
}


  return (
    <div className="w-full max-w-3xl mx-auto">
      <Line data={data} options={options} />
    </div>
  )
}