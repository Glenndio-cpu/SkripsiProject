import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { trackArticleRead } from '../lib/userActivityTracking';
import { Bug, HeartPulse, AlertTriangle, Search } from 'lucide-react';

type DiseaseType = 'menular' | 'tidak-menular';
type SeverityLevel = 'ringan' | 'sedang' | 'berat';

interface Disease {
  name: string;
  symptoms: string;
  prevention: string;
  type: DiseaseType;
  severity: SeverityLevel;
  transmission?: string;
}

const Penyakit = () => {
  const [currentPandemicIndex, setCurrentPandemicIndex] = useState(0);
  const [hoveredPandemic, setHoveredPandemic] = useState(null);
  const [selectedType, setSelectedType] = useState<DiseaseType | 'semua'>('semua');
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | 'semua'>('semua');

  // Handler untuk tracking artikel yang dibaca
  const handleDiseaseClick = (diseaseName: string) => {
    trackArticleRead(diseaseName);
  };

  const diseases: Disease[] = [
    // Penyakit Menular
    {
      name: "COVID-19",

      symptoms: "Demam, batuk kering, kelelahan, kehilangan indra penciuman dan perasa",
      prevention: "Vaksinasi, menjaga jarak, memakai masker, sering mencuci tangan",
      type: "menular",
      severity: "sedang",
      transmission: "Droplet pernapasan saat batuk/bersin, kontak dengan permukaan terkontaminasi"
    },
    {
      name: "Influenza",

      symptoms: "Demam tinggi, sakit tenggorokan, nyeri otot, batuk, kelelahan",
      prevention: "Vaksinasi tahunan, mencuci tangan, menghindari kontak dengan orang sakit",
      type: "menular",
      severity: "sedang",
      transmission: "Droplet udara dari batuk/bersin, kontak langsung dengan penderita"
    },
    {
      name: "Demam Berdarah",

      symptoms: "Demam tinggi, nyeri otot dan sendi, ruam, pendarahan ringan",
      prevention: "Menghilangkan genangan air, menggunakan kelambu, memakai repellent",
      type: "menular",
      severity: "berat",
      transmission: "Gigitan nyamuk Aedes aegypti yang terinfeksi virus dengue"
    },
    {
      name: "Tuberculosis",

      symptoms: "Batuk berkepanjangan, batuk darah, nyeri dada, penurunan berat badan",
      prevention: "Vaksinasi BCG, ventilasi baik, deteksi dini dan pengobatan tepat",
      type: "menular",
      severity: "berat",
      transmission: "Udara saat penderita batuk/bersin, kontak lama dengan penderita aktif"
    },
    {
      name: "Cacar Air",

      symptoms: "Ruam merah gatal, lecet kecil berisi cairan, demam, kelelahan",
      prevention: "Vaksinasi varicella, menghindari kontak dengan orang terinfeksi",
      type: "menular",
      severity: "ringan",
      transmission: "Udara (airborne), kontak langsung dengan cairan lepuh penderita"
    },
    {
      name: "Diare",

      symptoms: "Tinja encer, kram perut, mual, muntah, demam ringan",
      prevention: "Cuci tangan, konsumsi air bersih, makanan yang dimasak dengan benar",
      type: "menular",
      severity: "ringan",
      transmission: "Fecal-oral (makanan/air terkontaminasi), kontak dengan tangan kotor"
    },
    {
      name: "Malaria",

      symptoms: "Demam tinggi, menggigil, sakit kepala, mual, nyeri otot",
      prevention: "Kelambu berinsektisida, repellent, profilaksis untuk traveler",
      type: "menular",
      severity: "berat",
      transmission: "Gigitan nyamuk Anopheles betina yang terinfeksi parasit Plasmodium"
    },
    {
      name: "Hepatitis B",

      symptoms: "Kelelahan, mual, sakit perut, kulit kuning, urin gelap",
      prevention: "Vaksinasi, hindari berbagi jarum, hubungan seks aman",
      type: "menular",
      severity: "sedang",
      transmission: "Darah/cairan tubuh, jarum suntik terkontaminasi, hubungan seksual, ibu ke bayi"
    },
    {
      name: "Campak",

      symptoms: "Demam tinggi, batuk, pilek, mata merah, ruam kulit",
      prevention: "Vaksinasi MMR, isolasi penderita, kebersihan tangan",
      type: "menular",
      severity: "sedang",
      transmission: "Udara (sangat menular), droplet dari batuk/bersin penderita"
    },
    {
      name: "Kolera",

      symptoms: "Diare berat, dehidrasi, muntah, kram otot",
      prevention: "Air bersih, sanitasi baik, vaksin oral, masak makanan matang",
      type: "menular",
      severity: "berat",
      transmission: "Air/makanan terkontaminasi bakteri Vibrio cholerae dari feses penderita"
    },
    {
      name: "Polio",

      symptoms: "Demam, kelelahan, muntah, nyeri otot, kelumpuhan",
      prevention: "Vaksinasi IPV/OPV, kebersihan tangan, sanitasi baik",
      type: "menular",
      severity: "berat",
      transmission: "Fecal-oral, air/makanan terkontaminasi virus polio dari feses"
    },
    {
      name: "HIV/AIDS",

      symptoms: "Demam berkepanjangan, penurunan berat badan, infeksi oportunistik",
      prevention: "Penggunaan kondom, tidak berbagi jarum, PrEP untuk risiko tinggi",
      type: "menular",
      severity: "berat",
      transmission: "Darah, cairan seksual, ASI, jarum suntik bersama, ibu ke bayi"
    },
    {
      name: "Ebola",

      symptoms: "Demam mendadak, lemah, nyeri otot, sakit kepala, perdarahan",
      prevention: "Hindari kontak dengan pasien/benda terkontaminasi, karantina ketat",
      type: "menular",
      severity: "berat",
      transmission: "Kontak langsung dengan darah/cairan tubuh penderita atau hewan terinfeksi"
    },
    {
      name: "Zika",

      symptoms: "Demam ringan, ruam, nyeri sendi, konjungtivitis",
      prevention: "Kontrol nyamuk, repellent, hindari daerah endemik saat hamil",
      type: "menular",
      severity: "ringan",
      transmission: "Gigitan nyamuk Aedes, hubungan seksual, ibu ke janin saat hamil"
    },
    {
      name: "SARS",

      symptoms: "Demam tinggi, batuk kering, sesak napas, sakit kepala",
      prevention: "Kebersihan tangan, masker, isolasi penderita, ventilasi baik",
      type: "menular",
      severity: "berat",
      transmission: "Droplet pernapasan, kontak dekat dengan penderita, permukaan terkontaminasi"
    },
    {
      name: "ISPA",

      symptoms: "Batuk, pilek, sakit tenggorokan, demam ringan, hidung tersumbat",
      prevention: "Cuci tangan, hindari asap rokok, jaga daya tahan tubuh, ventilasi baik",
      type: "menular",
      severity: "ringan",
      transmission: "Droplet dari batuk/bersin, kontak dengan penderita, permukaan terkontaminasi"
    },
    {
      name: "Common Cold",

      symptoms: "Pilek, bersin, hidung tersumbat, sakit tenggorokan ringan, kelelahan",
      prevention: "Cuci tangan sering, hindari kontak dengan penderita, jaga kebersihan",
      type: "menular",
      severity: "ringan",
      transmission: "Droplet pernapasan, kontak tangan dengan hidung/mulut setelah menyentuh benda terkontaminasi"
    },
    {
      name: "Diare - GEA",

      symptoms: "Diare cair, mual, muntah, kram perut, demam ringan, dehidrasi",
      prevention: "Cuci tangan dengan sabun, konsumsi air matang, makanan bersih dan higienis",
      type: "menular",
      severity: "sedang",
      transmission: "Fecal-oral melalui makanan/minuman terkontaminasi, tangan kotor"
    },
    {
      name: "Varicella",

      symptoms: "Ruam merah berisi cairan, gatal, demam, kelelahan, sakit kepala",
      prevention: "Vaksinasi varicella, hindari kontak dengan penderita, isolasi saat sakit",
      type: "menular",
      severity: "ringan",
      transmission: "Udara (airborne) dan kontak langsung dengan cairan vesikel"
    },
    {
      name: "Pneumonia",

      symptoms: "Batuk berdahak, demam tinggi, sesak napas, nyeri dada, menggigil",
      prevention: "Vaksinasi pneumonia, hindari rokok, cuci tangan, jaga daya tahan tubuh",
      type: "menular",
      severity: "berat",
      transmission: "Droplet pernapasan, aspirasi bakteri dari mulut/tenggorokan"
    },
    {
      name: "Dermatitis",

      symptoms: "Kulit merah, gatal, ruam, kulit kering dan mengelupas, bengkak",
      prevention: "Hindari alergen, jaga kelembaban kulit, gunakan sabun lembut, hindari garukan",
      type: "menular",
      severity: "ringan",
      transmission: "Kontak langsung kulit ke kulit atau dengan benda yang terkontaminasi (tergantung jenis)"
    },
    {
      name: "Skabies",

      symptoms: "Gatal parah (terutama malam), ruam merah, luka bekas garuk, benjolan kecil",
      prevention: "Jaga kebersihan pribadi, hindari berbagi pakaian/handuk, cuci sprei rutin dengan air panas",
      type: "menular",
      severity: "ringan",
      transmission: "Kontak kulit langsung yang lama, berbagi pakaian/tempat tidur dengan penderita"
    },
    // Penyakit Tidak Menular
    {
      name: "Diabetes",

      symptoms: "Sering haus, sering buang air kecil, kelelahan, luka sulit sembuh",
      prevention: "Pola makan sehat, olahraga teratur, jaga berat badan ideal, hindari gula berlebih",
      type: "tidak-menular",
      severity: "sedang"
    },
    {
      name: "Hipertensi",

      symptoms: "Sakit kepala, pusing, sesak napas, nyeri dada, penglihatan kabur",
      prevention: "Kurangi garam, olahraga rutin, kelola stres, hindari rokok dan alkohol",
      type: "tidak-menular",
      severity: "sedang"
    },
    {
      name: "Stroke",

      symptoms: "Kelemahan wajah/tangan, bicara tidak jelas, sakit kepala parah mendadak",
      prevention: "Kontrol tekanan darah, pola hidup sehat, hindari rokok, olahraga teratur",
      type: "tidak-menular",
      severity: "berat"
    },
    {
      name: "Jantung Koroner",

      symptoms: "Nyeri dada, sesak napas, kelelahan, jantung berdebar",
      prevention: "Diet rendah lemak, olahraga rutin, tidak merokok, kelola stres",
      type: "tidak-menular",
      severity: "berat"
    },
    {
      name: "Asma",

      symptoms: "Sesak napas, mengi, batuk (terutama malam), dada sesak",
      prevention: "Hindari pemicu (debu, asap), gunakan inhaler sesuai resep, jaga kebersihan",
      type: "tidak-menular",
      severity: "sedang"
    },
    {
      name: "Kanker",

      symptoms: "Bervariasi tergantung jenis (benjolan, penurunan berat badan, kelelahan)",
      prevention: "Pola hidup sehat, hindari rokok, deteksi dini, vaksinasi (HPV, Hepatitis B)",
      type: "tidak-menular",
      severity: "berat"
    },
    {
      name: "Osteoporosis",

      symptoms: "Tulang mudah patah, postur membungkuk, nyeri punggung",
      prevention: "Konsumsi kalsium & vitamin D, olahraga beban, hindari rokok & alkohol",
      type: "tidak-menular",
      severity: "sedang"
    },
    {
      name: "Obesitas",

      symptoms: "Kelebihan berat badan, kesulitan bernapas, nyeri sendi, kelelahan",
      prevention: "Pola makan seimbang, olahraga teratur, batasi kalori, hindari makanan olahan",
      type: "tidak-menular",
      severity: "sedang"
    },
    {
      name: "Gagal Ginjal",

      symptoms: "Kelelahan, bengkak kaki/tangan, urin berbusa, mual, sesak napas",
      prevention: "Kontrol diabetes & hipertensi, minum air cukup, hindari obat berlebihan",
      type: "tidak-menular",
      severity: "berat"
    },
    {
      name: "PPOK",

      symptoms: "Batuk kronis, sesak napas, mengi, produksi dahak berlebih",
      prevention: "Berhenti merokok, hindari polusi udara, vaksinasi flu & pneumonia",
      type: "tidak-menular",
      severity: "berat"
    },
    {
      name: "DM Tipe 2",

      symptoms: "Sering haus dan lapar, sering buang air kecil, penurunan berat badan, luka lambat sembuh",
      prevention: "Pola makan rendah gula, olahraga teratur, jaga berat badan, cek gula darah rutin",
      type: "tidak-menular",
      severity: "sedang"
    },
    {
      name: "Hiperuricemia",

      symptoms: "Nyeri sendi (terutama jempol kaki), bengkak, kemerahan, kaku sendi",
      prevention: "Batasi makanan tinggi purin (jeroan, seafood), minum air cukup, hindari alkohol",
      type: "tidak-menular",
      severity: "sedang"
    },
    {
      name: "Dislipidemia",

      symptoms: "Umumnya tanpa gejala, terdeteksi melalui tes darah (kolesterol tinggi)",
      prevention: "Diet rendah lemak jenuh, olahraga rutin, hindari makanan gorengan, cek kolesterol berkala",
      type: "tidak-menular",
      severity: "sedang"
    },
    {
      name: "CKD",

      symptoms: "Kelelahan, bengkak kaki/mata, urin berbusa, mual, tekanan darah tinggi",
      prevention: "Kontrol diabetes & hipertensi, minum air cukup, hindari obat nefrotoksik, diet rendah protein",
      type: "tidak-menular",
      severity: "berat"
    },
    {
      name: "Anemia",

      symptoms: "Kelelahan, pucat, pusing, sesak napas ringan, jantung berdebar",
      prevention: "Konsumsi makanan kaya zat besi, vitamin B12 dan asam folat, suplementasi jika perlu",
      type: "tidak-menular",
      severity: "ringan"
    },
    {
      name: "Gastritis",

      symptoms: "Nyeri ulu hati, mual, kembung, cepat kenyang, muntah",
      prevention: "Hindari makanan pedas/asam, makan teratur, kurangi stres, hindari alkohol dan NSAID",
      type: "tidak-menular",
      severity: "ringan"
    },
    {
      name: "Migrain",

      symptoms: "Sakit kepala berdenyut (satu sisi), mual, sensitif cahaya/suara, gangguan penglihatan",
      prevention: "Hindari pemicu (stress, kurang tidur, makanan tertentu), olahraga teratur, tidur cukup",
      type: "tidak-menular",
      severity: "ringan"
    },
    {
      name: "Alergi",

      symptoms: "Bersin, hidung gatal/tersumbat, mata berair, ruam kulit, gatal",
      prevention: "Hindari alergen (debu, serbuk sari, bulu hewan), jaga kebersihan rumah, gunakan antihistamin",
      type: "tidak-menular",
      severity: "ringan"
    },
    {
      name: "Insomnia",

      symptoms: "Sulit tidur, sering terbangun malam, bangun terlalu pagi, kelelahan siang hari",
      prevention: "Atur jadwal tidur teratur, hindari kafein/gadget sebelum tidur, relaksasi, olahraga teratur",
      type: "tidak-menular",
      severity: "ringan"
    },
    {
      name: "Dispepsia",

      symptoms: "Perut kembung, nyeri ulu hati, cepat kenyang, sendawa, mual",
      prevention: "Makan porsi kecil tapi sering, hindari makanan berlemak/pedas, kurangi stres, jangan berbaring setelah makan",
      type: "tidak-menular",
      severity: "ringan"
    }
  ];

  // Filter logic
  const filteredDiseases = diseases.filter(disease => {
    const typeMatch = selectedType === 'semua' || disease.type === selectedType;
    const severityMatch = selectedSeverity === 'semua' || disease.severity === selectedSeverity;
    return typeMatch && severityMatch;
  });

  // Helper function for severity badge
  const getSeverityBadge = (severity: SeverityLevel) => {
    const badges = {
      ringan: { color: 'bg-green-100 text-green-800', text: 'Ringan' },
      sedang: { color: 'bg-yellow-100 text-yellow-800', text: 'Sedang' },
      berat: { color: 'bg-red-100 text-red-800', text: 'Berat' }
    };
    return badges[severity];
  };

  const pandemics = [
    {
      year: "1347-1351",
      name: "Black Death",
      deaths: "75-200 juta",
      description: "Wabah pes yang menyebar melalui kutu tikus, menghancurkan 30-60% populasi Eropa",
      link: "https://www.who.int/news-room/fact-sheets/detail/plague"
    },
    {
      year: "1918-1920",
      name: "Flu Spanyol",
      deaths: "50-100 juta",
      description: "Pandemi influenza H1N1 yang menyebar secara global setelah Perang Dunia I",
      link: "https://www.cdc.gov/flu/pandemic-resources/1918-commemoration/1918-pandemic-history.htm"
    },
    {
      year: "1957-1958",
      name: "Flu Asia",
      deaths: "1-4 juta",
      description: "Pandemi influenza H2N2 yang berasal dari Singapura",
      link: "https://www.cdc.gov/flu/pandemic-resources/1957-1958-pandemic.html"
    },
    {
      year: "1968-1969",
      name: "Flu Hong Kong",
      deaths: "1-4 juta",
      description: "Pandemi influenza H3N2 yang menjadi strain flu musiman dominan",
      link: "https://www.cdc.gov/flu/pandemic-resources/1968-pandemic.html"
    },
    {
      year: "2002-2004",
      name: "SARS",
      deaths: "774",
      description: "Wabah coronavirus pertama abad 21 dengan tingkat kematian ~10%",
      link: "https://www.who.int/health-topics/severe-acute-respiratory-syndrome"
    },
    {
      year: "2009-2010",
      name: "Flu Babi",
      deaths: "150-575 ribu",
      description: "Pandemi influenza H1N1 yang berasal dari Meksiko",
      link: "https://www.cdc.gov/flu/pandemic-resources/2009-h1n1-pandemic.html"
    },
    {
      year: "2014-2016",
      name: "Ebola",
      deaths: "11,325",
      description: "Wabah Ebola terbesar di Afrika Barat dengan tingkat kematian ~40%",
      link: "https://www.who.int/emergencies/situations/ebola-outbreak-2014-2016"
    },
    {
      year: "2019-Sekarang",
      name: "COVID-19",
      deaths: "6.9 juta+",
      description: "Pandemi coronavirus global dengan dampak kesehatan dan ekonomi besar",
      link: "https://www.who.int/emergencies/diseases/novel-coronavirus-2019"
    }
  ];

  const handleNext = () => {
    if (currentPandemicIndex < pandemics.length - 4) {
      setCurrentPandemicIndex(currentPandemicIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentPandemicIndex > 0) {
      setCurrentPandemicIndex(currentPandemicIndex - 1);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-800 border-b-2 border-blue-500 pb-3 mb-4">
           Informasi Penyakit
        </h1>
        <p className="text-center italic text-gray-600 mb-8 text-lg">
          Berikut adalah informasi tentang berbagai penyakit menular dan tidak menular, gejalanya, dan cara pencegahannya.
        </p>
        
        {/* Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-600">Filter Penyakit</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Penyakit</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType('semua')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedType === 'semua'
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedType('menular')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedType === 'menular'
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                   Menular
                </button>
                <button
                  onClick={() => setSelectedType('tidak-menular')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedType === 'tidak-menular'
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                   Tidak Menular
                </button>
              </div>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Keparahan</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSeverity('semua')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSeverity === 'semua'
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedSeverity('ringan')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSeverity === 'ringan'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  Ringan
                </button>
                <button
                  onClick={() => setSelectedSeverity('sedang')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSeverity === 'sedang'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  Sedang
                </button>
                <button
                  onClick={() => setSelectedSeverity('berat')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSeverity === 'berat'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  Berat
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold text-slate-600">{filteredDiseases.length}</span> dari {diseases.length} penyakit
            </p>
          </div>
        </div>
        
        {/* Diseases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredDiseases.map((disease, index) => {
            const severityBadge = getSeverityBadge(disease.severity);
            return (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleDiseaseClick(disease.name)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {disease.type === 'menular' 
                      ? <Bug className="w-7 h-7 mr-3 text-blue-600" />
                      : <HeartPulse className="w-7 h-7 mr-3 text-purple-600" />
                    }
                    <h2 className="text-xl font-semibold text-slate-600">{disease.name}</h2>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex gap-2 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${severityBadge.color}`}>
                    {severityBadge.text}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    disease.type === 'menular' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {disease.type === 'menular' ? 'Menular' : 'Tidak Menular'}
                  </span>
                </div>
              
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Gejala</h3>
                  <p className="mt-1 text-gray-700">{disease.symptoms}</p>
                </div>

                {/* Transmission info for communicable diseases */}
                {disease.transmission && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Cara Penularan</h3>
                    <p className="mt-1 text-gray-700 flex items-start">
                      <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
                      <span>{disease.transmission}</span>
                    </p>
                  </div>
                )}
              
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pencegahan</h3>
                  <p className="mt-1 text-gray-700">{disease.prevention}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredDiseases.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak ada penyakit yang sesuai</h3>
            <p className="text-gray-600">Coba ubah filter untuk melihat hasil lainnya</p>
          </div>
        )}

        {/* Horizontal Pandemic Roadmap */}
        <div>
          <h2 className="text-2xl font-bold text-slate-600 border-b-2 border-sky-500 pb-4 text-center">
            Sejarah Pandemi Mematikan
          </h2>
          
          <div className="relative">
            {/* Navigation Arrows */}
            <button 
              onClick={handlePrev}
              disabled={currentPandemicIndex === 0}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center ${currentPandemicIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-600'}`}
            >
              &lt;
            </button>
            
            <button 
              onClick={handleNext}
              disabled={currentPandemicIndex >= pandemics.length - 4}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center ${currentPandemicIndex >= pandemics.length - 4 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-600'}`}
            >
              &gt;
            </button>

            {/* Timeline Container */}
            <div className="flex overflow-hidden py-12 ml-20"> {/* Added vertical padding */}
              <div 
                className="flex -space-x-20 transition-transform duration-500 ease-in-out" /* Increased horizontal spacing */
                style={{ 
                  transform: `translateX(-${currentPandemicIndex * 320}px)`, /* Adjusted for wider spacing */
                  minHeight: '300px' /* Added minimum height */
                }}
              >
                {pandemics.map((pandemic, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 w-80 relative" /* Increased width */
                    onMouseEnter={() => setHoveredPandemic(index)}
                    onMouseLeave={() => setHoveredPandemic(null)}
                  >
                    <div className="relative h-[300px]">
					  {/* Vertical line */}
					  <div className="absolute h-10 w-1 bg-sky-500 left-1/2 transform -translate-x-1/2 -bottom-16" />

					  {/* Timeline Dot + Text */}
					  <div
						className="absolute left-1/2 transform -translate-x-1/2"
						style={{ bottom: `calc(-10px)` }}
					  >
						<div className="w-14 h-14 rounded-full bg-sky-500 border-4 border-white flex items-center justify-center mx-auto">
						  <span className="text-white font-bold text-lg">{index + 1}</span>
						</div>
						<div className="text-center mt-4">
						  <h3 className="font-semibold text-lg text-slate-700">
							{pandemic.name}
						  </h3>
						  <p className="text-md text-gray-600 mt-1">{pandemic.year}</p>
						</div>
					  </div>
					</div>


                    {/* Detailed Info on Hover */}
					{hoveredPandemic === index && (
					  <div className="absolute z-20 -top-10 transform -translate-x-1/2 w-80 bg-white p-6 rounded-lg shadow-xl border border-gray-200 animate-popup">
						<p className="text-md text-gray-700">{pandemic.description}</p>
						<p className="text-md font-medium text-red-600 mt-3">
						  Kematian: {pandemic.deaths}
						</p>
						<a 
						  href={pandemic.link} 
						  target="_blank" 
						  rel="noopener noreferrer"
						  className="inline-block mt-4 px-4 py-2 bg-sky-50 text-slate-600 rounded-md text-md hover:bg-sky-200 transition-colors"
						>
						  Pelajari Lebih Lanjut
						</a>
					  </div>
					)}

                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Base Line */}
            <div className="h-1 bg-sky-500 mx-14 rounded-full"></div> {/* Thicker line */}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-sky-50 rounded-lg border border-slate-600">
          <h2 className="text-2xl font-semibold mb-4 text-slate-600">Memerlukan Informasi Lebih Lanjut?</h2>
          <p className="text-gray-700 mb-4">
            Jika Anda mencari informasi tentang penyakit menular lainnya atau ingin mengetahui lebih detail, 
            jangan ragu untuk bertanya kepada asisten virtual kami dengan mengklik ikon dokter di pojok kanan bawah layar.
          </p>
          <p className="text-gray-700">
            Kami siap membantu Anda dengan informasi terkait penyakit menular, gejala, pengobatan, dan pencegahannya.
          </p>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style>{`
        @keyframes popup {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-popup {
          animation: popup 0.3s ease-out forwards;
        }
      `}</style>
    </Layout>
  );
};

export default Penyakit;