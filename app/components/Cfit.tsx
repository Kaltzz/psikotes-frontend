'use client'

export default function Cfit() {
    return(
        <div className=" pb-5 border-gray-300">
            <div className="mb-4">
                <p className="font-bold text-2xl">Hasil Tes CFIT</p>
            </div>
            <div>
                <table className="border-collapse w-full">
                    <thead className="border-b border-gray-300 bg-gray-300 p-4 text-left text-base">
                        <tr>
                            <th className="py-2 px-4">Subtes 1</th>
                            <th className="py-2 px-4">Subtes 2</th>
                            <th className="py-2 px-4">Subtes 3</th>
                            <th className="py-2 px-4">Subtes 4</th>
                            <th className="py-2 px-4">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-2 px-4">8/13</td>
                            <td className="py-2 px-4">9/10</td>
                            <td className="py-2 px-4">12/13</td>
                            <td className="py-2 px-4">8/10</td>
                            <td className="py-2 px-4">37/46</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    )
}