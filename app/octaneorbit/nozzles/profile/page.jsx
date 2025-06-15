import { Suspense } from 'react';

import FuelnozzlesProfile from '../uiControl/FuelnozzlesProfile';

import { InteprateFuelnozzlesEvent } from '../dataControl/FuelnozzlesRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Fuel nozzles"//searchParams?.mosyTitle || "Fuel nozzles";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Fuel nozzles profile`,
    description: 'octaneorbit Fuel nozzles',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function FuelnozzlesMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <FuelnozzlesProfile 
                    dataIn={{ parentUseEffectKey: "initFuelnozzlesProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateFuelnozzlesEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}