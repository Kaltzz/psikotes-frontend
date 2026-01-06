import { div } from "framer-motion/client";
import BarChartComponent from "./BarChartComponent";



export default function Mbti() {

    const indikatorMbti = {
        e: 3,
        i: 2,
        s: 4,
        n: 1,
        t: 5,
        f: 4,
        j: 6,
        p: 2
        
    }

    const mbtiDesc: Record<string, any> = {
        intj: 'Pribadi INTJ umumnya adalah individu yang kreatif dan analitis. Oleh sebab itu, ia sangat pandai membuat strategi dan perencanaan. Selain itu, individu INTJ biasanya juga memiliki kemampuan untuk menciptakan berbagai solusi inovatif bagi setiap permasalahan. Maka dari itu, pribadi INTJ mendapat julukan ‘Si Ahli Strategi’.',

        intp: 'Orang dengan kepribadian INTP mendapat julukan ‘Si Logis’ atau ‘Si Pemikir’ tentu karena ia adalah seorang pemikir yang logis, analitis, dan berwawasan luas. Namun, pribadi INTP biasanya tidak menyukai aturan dan perencanaan. Sebaliknya, ia lebih suka memiliki banyak pilihan terhadap suatu hal.',
        
        entj: 'Orang yang memiliki kepribadian ENTJ biasanya adalah sosok extrovert yang tegas, percaya diri, dan blak-blakan. Umumnya, pribadi ini juga sangat visioner, yang artinya ia lebih fokus memikirkan masa depan daripada masa kini. Itulah mengapa pribadi ini kerap dijuluki sebagai ‘Sang Komandan’.',
        
        entp: 'Orang dengan kepribadian ENTP biasa dikenal sebagai pribadi yang logis, cerdas, kreatif, dan paling suka berargumen. Berkat sifat-sifatnya tersebut, pribadi ENTP mendapat julukan ‘Si Pendebat’.',
        
        infj: 'INFJ atau yang kerap dijuluki sebagai ‘Sang Penasihat’ adalah tipe kepribadian yang paling langka. Pribadi INFJ biasanya sangat suportif, peka terhadap perasaan orang lain, dan suka menolong. Tidak hanya itu, ia juga terkenal dengan idealismenya untuk mengubah dunia menjadi tempat yang lebih baik bagi semua orang.',
        
        infp: 'Orang dengan tipe kepribadian INFP biasanya idealis, perfeksionis, dan memiliki jiwa kemanusiaan yang tinggi. Ketika terdapat konflik, pribadi INFP biasanya sangat pandai menjadi mediator untuk menengahi konflik tersebut. Inilah mengapa pribadi INFP dijuluki sebagai ‘Si Mediator’.', 
        
        enfj: 'Pribadi ENFJ terkenal akan kemampuannya untuk menjalin persahabatan dengan hampir setiap kepribadian lainnya, bahkan dengan pribadi yang sangat tertutup. Biasanya, individu ENFJ juga memiliki empati yang tinggi, sehingga ia sangat senang membantu orang lain untuk mencapai tujuan mereka. Berkat karakteristiknya ini, pribadi ENFJ dijuluki sebagai ‘Si Protagonis’.',
        
        enfp: 'ENFP dijuluki sebagai ‘Si Motivator’ di antara tipe kepribadian lainnya. Ini karena orang dengan tipe kepribadian ENFP sangat senang menumpulkan berbagai ide positif untuk membantu orang lain dan mampu mengalirkan energi positif tersebut pada orang-orang di sekitarnya.',
        
        istj : 'Orang dengan tipe kepribadian ISTJ biasanya cenderung pendiam dan serius, namun sangat gigih, bertanggung jawab, dan dapat diandalkan. Pribadi ISTJ umumnya juga selalu menginginkan ketertiban dan keteraturan dalam setiap aspek hidupnya. Oleh sebab itu, ia dijuluki sebagai ‘Si Perencana yang terorganisir’.',
        
        isfj: 'ISFJ adalah salah satu tipe kepribadian yang paling umum. Orang dengan kepribadian ISFJ biasanya dikenal sebagai pribadi yang penuh perhatian, kehangatan, dan aura positifnya yang bisa membawa ketenangan pada orang-orang di sekitarnya. Ini sebabnya, pribadi ISFJ dijuluki sebagai ‘Si Pelindung’.', 
        
        estj: 'Kepribadian ESTJ dijuluki sebagai ‘Si Pengarah yang tegas’ karena ia paling terkenal dengan kemampuannya dalam berorganisasi dan memimpin. Kemampuan mengarahkannya ini didapatkan dari karakteristiknya yang tegas, teliti, disiplin, taat aturan, dan bertanggung jawab.', 
        
        esfj: 'Pribadi ESFJ biasanya cenderung berhati lembut, setia, ramah, dan terorganisir. Ia sangat suka membantu orang lain, terutama orang-orang di sekitarnya. Nah, inilah alasan mengapa pribadi ESFJ disebut sebagai ‘Sang Pengasuh’.',
        
        istp: 'Pribadi ISTP umumnya sangat realistis, logis, spontan, dan berfokus pada masa kini. Orang dengan kepribadian ISTP juga memiliki kemampuan memecahkan masalah dan menghadapi krisis yang baik. Tak heran, pribadi ISTP kerap dijuluki sebagai ‘Si Mekanik’ atau ‘Si Pengrajin’.',
        
        isfp: 'Pribadi ISFP biasanya adalah orang yang bisa membuat orang lain nyaman, memiliki kepedulian yang tinggi terhadap orang lain, penuh semangat, dan kreatif. Individu ISFP umumnya juga sangat berbakat dalam dunia seni. Oleh sebab itulah, ia dijuluki sebagai ‘Si Seniman’ di antara kepribadian lainnya.',
        
        estp: 'Individu ESTP biasanya sangat ramah, antusias, dan pandai berteman. Ia biasanya juga sangat pandai memengaruhi orang lain, serta memiliki kemampuan untuk berpikir dan bertindak cepat dalam situasi yang darurat. Oleh sebab itu, pribadi ESTP kerap dijuluk sebagai ‘Si Pembujuk’.',
        
        esfp: 'Orang dengan kepribadian ESFP mungkin bisa disebut sebagai kepribadian yang paling extrovert. Pasalnya, ia sangat senang menghabiskan waktunya dengan orang lain dan suka menjadi pusat perhatian. Tak heran, pribadi ESFP dijuluki sebagai ‘Si Penghibur’.'
    }

    // 'entp', E + N + T + P
    const scoringMbti = 
        (indikatorMbti.e >= indikatorMbti.i? 'e':'i') +
        (indikatorMbti.s >= indikatorMbti.n? 's':'n') +
        (indikatorMbti.t >= indikatorMbti.f? 't':'f') +
        (indikatorMbti.j >= indikatorMbti.p? 'j':'p') 
    
    const capsLockMbti = scoringMbti.toUpperCase()

    return(
        <div className="pb-5 border-gray-300">
            <div className="mb-4">
                <p className="font-bold text-2xl">Hasil Tes MBTI</p>
            </div>
            <div>
                <BarChartComponent />
            </div>
            <div className="flex flex-col gap-y-1 text-lg">
                <p className="font-semibold">Hasil akhir: </p>
                <div className="flex">
                    <p className="bg-blue-700 px-4 py-1 text-white rounded-lg">{capsLockMbti}</p>
                </div>
            </div>
            <div className="flex flex-col gap-y-1 my-6">
                <p className="font-semibold text-lg">Uraian Karakter: </p>
                <div className="flex">
                    <p className="rounded-lg border px-3 py-2">{mbtiDesc[scoringMbti]}</p>
                </div>
            </div>
        </div>
    )
}