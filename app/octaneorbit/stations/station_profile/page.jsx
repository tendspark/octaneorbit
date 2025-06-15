import { Suspense } from 'react';

import FuelstationsProfile from '../uiControl/FuelstationsProfile';

import { InteprateFuelstationsEvent } from '../dataControl/FuelstationsRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Fuel Stations"//searchParams?.mosyTitle || "Fuel Stations";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Fuel Stations profile`,
    description: 'octaneorbit Fuel Stations',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function FuelstationsMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <FuelstationsProfile 
                    dataIn={{ parentUseEffectKey: "initFuelstationsProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateFuelstationsEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}