import { MarcasList } from "./components/MarcasList";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">

      <header className="bg-white shadow-sm border-b-2 border-gray-200 sticky top-0 z-40">
        <div className="flex items-center h-20 pl-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden mr-4 ml-5">
            <Image 
              src="/LogoSigna.png" 
              alt="Logo Signa" 
              width={80} 
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-lg font-medium text-gray-700">Prueba Técnica</span>
        </div>
      </header>


      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <MarcasList />
      </main>


      <footer className="bg-black mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <Image 
                src="/MarcaPersonal.png" 
                alt="Emanuel Gómez Díaz" 
                width={64} 
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white">
                Prueba técnica desarrollada por{" "}
                <a 
                  href="https://689f8d330b54b40008d1d849--emanuel-gomez-diaz.netlify.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Emanuel Gómez Díaz
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
