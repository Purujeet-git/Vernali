'use client'
import { useEffect,useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Caraousel from "./components/Caraousel";
import Caraousel2 from "./components/Caraousel2";
import CaraouselProducts from "./components/CaraouselProducts";
import { Pacifico as PacificoFont } from 'next/font/google';
import { Dancing_Script } from "next/font/google";
import { useRouter } from "next/navigation";


const pacifico = PacificoFont({
  subsets: ['latin'],
  variable: '--font-pacifico',
  weight: '400',
});

const dancing = Dancing_Script({
  subsets:['latin'],
  variable:'--font-Dancing',
  weight:'400',
})
export default function Home() {

  const [bestSellers, setbestSellers] = useState([]);3
  const [groupedSlides, setGroupedSlides] = useState({});


  useEffect(()=> {
    const fetchSlides = async () => {
      const res = await fetch('/api/carousel');
      const data = await res.json();

      const grouped = data.reduce((acc,slide) => {
        const section = slide.carouselSection || 'unlabelled';
        if(!acc[section]) acc[section] = [];
        acc[section].push(slide);
        return acc;
      }, {});
      setGroupedSlides(grouped);
    };
    fetchSlides();
  },[])

  useEffect(()=> {
    const fetchBestSellers = async () => {
      const res = await fetch('/api/products/best-sellers');
      const data = await res.json();
      setbestSellers(data);
    };

    fetchBestSellers();
  },[]);
  
  const router = useRouter();

  const handleCategoryClick = (category) => {
    router.push(`/search?query=${encodeURIComponent(category)}`);
    // console.log("Button was clicked");
  };


  return (
    <>
    <div className="bg-black">
      <div className="flex justify-center relative">
      <Image className="object-fill  h-[85vh] w-full" src={"/Cover.jpg"} height={2000} width={2000} alt="Banner Image"/>
      <p className={`absolute z-10 top-10 left-52 text-amber-950 ${pacifico.className} font-sans text-5xl`}>Vernali</p>
      <p className={`absolute z-10 text-amber-300 text-8xl p-4 bottom-50 ${dancing.className}`} >Modern<br></br> Collection</p>
      <button onClick={()=> document.getElementById("Car").scrollIntoView({behavior:'smooth'})} className="absolute border-2 cursor-pointer p-4 px-8 text-2xl bottom-10 transition delay-100 duration-400 ease-in-out hover:bg-purple-700 ">Shop Now</button>
      </div>  
      <div className="">
        <div className="flex justify-around  h-[80vh] w-full ">
          
          <div id="Car" className="h-[85vh] w-[95vw]"><Caraousel /></div>
        </div>
        
        
      </div>
      <div className="h-[50vh]  m-20">
          <div>
            <div className="flex mx-16">
              <div className="h2 w-[2vw] bg-amber-200 rounded-sm"></div><p className="font-bold mx-5  text-amber-200">{`Today's`}</p></div>
              <div className="text-2xl my-8 mx-16 flex  gap-8 font-bold text-amber-200"><p>Flash Sales</p>
              </div>
              <div ><Caraousel2 /></div>
              
            
          </div>
          
        </div>
        <div className="h-0.5 w-full my-32 bg-gray-600"></div>
        <div className="text-black mx-16">
          <div className="flex flex-col mx-16">
        <div className="flex"><div className="h-[4vh] flex w-[2vw] bg-purple-600 rounded-sm"></div><div className="font-bold mx-5  text-purple-700">Categories</div>
        </div><p className="text-3xl font-mono my-10">Browse By Category</p>
        </div>
          
          <div className="flex  justify-between mx-16">
            <div className="h-[22vh] bg-amber-200 transition-all duration-400 hover:bg-violet-500 flex flex-col items-center justify-center w-[12vw] border-1 border-black" onClick={()=> handleCategoryClick("Phones")}><Image src={"/SmartPhones.png"} className="h-[12vh] w-[6vw]" height={500} width={500} alt="Phones" /><p>Phones</p></div>
            <div className="h-[22vh] bg-amber-200 transition-all duration-400 hover:bg-violet-500 flex flex-col items-center justify-center w-[12vw] border-1 border-black" onClick={()=> handleCategoryClick("Computer")}><Image src={"/computer.png"} className="h-[12vh]  w-[6vw]" height={500} width={500} alt="Computer" /><p>Computer</p></div>
            <div className="h-[22vh] bg-amber-200 transition-all duration-400 hover:bg-violet-500 flex flex-col items-center justify-center w-[12vw] border-1 border-black" onClick={()=> handleCategoryClick("SmartWatches")}><Image src={"/Smartwatches.png"} className="h-[12vh] w-[6vw]" height={500} width={500} alt="Smartwatches" /><p>Smartwatches</p></div>
            <div className="h-[22vh] bg-amber-200 transition-all duration-400 hover:bg-violet-500 flex flex-col items-center justify-center w-[12vw] border-1 border-black" onClick={()=> handleCategoryClick("Camera")}><Image src={"/Camera.png"} className="h-[12vh] w-[6vw]" height={500} width={500} alt="Camera" /><p>Camera</p></div>
            <div className="h-[22vh] bg-amber-200 transition-all duration-400 hover:bg-violet-500 flex flex-col items-center justify-center w-[12vw] border-1 border-black" onClick={()=> handleCategoryClick("HeadPhones")}><Image src={"/HeadPhones.png"} className="h-[12vh] w-[6vw]" height={500} width={500} alt="HeadPhones" /><p>HeadPhones</p></div>
            <div className="h-[22vh] bg-amber-200 transition-all duration-400 hover:bg-violet-500 flex flex-col items-center justify-center w-[12vw] border-1 border-black" onClick={()=> handleCategoryClick("Gaming")}><Image src={"/Gaming.png"} className="h-[12vh] w-[6vw]" height={500} width={500} alt="Gaming" /><p>Gaming</p></div>
            
          </div>
        </div>
        
        
        <div className="mx-16 m-7 h-[60vh] w-[90vw] border-2">
          <Image src={"/Banner.png"} height={800} width={1500} alt="banner" className="object-cover h-[60vh]"/>
        </div>
        <div className="mx-16 w-[90vw] my-32 ">
        
        <div className="text-2xl my-2 mx-16 flex items-center justify-between gap-8 font-bold text-amber-200"><p className="text-3xl font-mono my-10">Best Selling Products</p></div>
        <div className="h-[25vh]"><CaraouselProducts />
</div>
        
        </div>


        <div className="flex flex-col mx-16 ">
          
        <div className="text-2xl my-2 mx-16 flex items-center justify-between gap-8 font-bold text-black"><p className="text-3xl font-mono my-10">New Arrival</p></div>
         <div className="flex gap-4 p-4 bg-gray-200 min-h-[85vh]">
      {/* Left side - static2 (Prussian Blue) */}
      <div className="flex-1 aspect-[2/3]">
        {groupedSlides.static2?.[0] && (
          <Image
          height={1000}
          width={1000}
            src={groupedSlides.static2[0].imageUrl}
            alt="Static 2"
            className="h-full w-full object-cover rounded-md"
          />
        )}
      </div>

      {/* Right side - 3 grid blocks */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Top block - static3 (Orange) */}
        <div className="flex-1">
          {groupedSlides.static3?.[0] && (
            <Image 
            height={5000}
            width={5000}
              src={groupedSlides.static3[0].imageUrl}
              alt="Static 3"
              className="h-full w-full object-cover rounded-md"
            />
          )}
        </div>

        {/* Bottom 2 blocks - static4 (Cyan) and static5 (Yellow) */}
        <div className="flex gap-4 flex-1">
          <div className="flex-1">
            {groupedSlides.static4?.[0] && (
              <Image
              height={1000}
              width={1000}
                src={groupedSlides.static4[0].imageUrl}
                alt="Static 4"
                className="h-full w-full object-cover rounded-md"
              />
            )}
          </div>
          <div className="flex-1">
            {groupedSlides.static5?.[0] && (
              <Image 
              height={1000}
              width={1000}
                src={groupedSlides.static5[0].imageUrl}
                alt="Static 5"
                className="h-full w-full object-cover rounded-md"
              />
            )}
          </div>
        </div>
      </div>
    </div>

        </div>
        
        </div>
    </>
  );
}
