import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-black to-red-900">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between max-w-6xl mx-auto mb-20 w-full flex-grow p-5 gap-5">
        <div className="text-center lg:text-left lg:w-1/2">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-8 text-white">
            Where Art Meets Innovation, Step into NFTstore!
          </h1>
          <p className="text-xl lg:text-2xl leading-relaxed mb-12 text-white">
            Enter the nexus of creativity and innovation at NFTstore. Uncover a
            realm of digital marvels, and together, let&apos;s redefine the future of
            collectibles.
          </p>
          <div className="flex justify-center lg:justify-start items-center gap-8">
            <Link href="/marketplace" className="bg-red-400 text-white font-semibold text-lg py-4 px-8 rounded-md transition duration-300 hover:bg-red-500">
              Buy Now!
            </Link>
            <Link href="/sellNFT" className="bg-white text-black font-semibold text-lg py-4 px-8 rounded-md transition duration-300 hover:bg-gray-300">
              List Now!
            </Link>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center">
          <Image src="/download.jpeg" alt="NFTs" width={1075} height={650} className="w-full h-auto object-cover rounded-md" />
        </div>
      </div>
    </div>
  );
}
