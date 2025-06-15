import { Suspense } from 'react';

import FuelstockProfile from '../uiControl/FuelstockProfile';

import { InteprateFuelstockEvent } from '../dataControl/FuelstockRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Fuel stock"//searchParams?.mosyTitle || "Fuel stock";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Fuel stock profile`,
    description: 'octaneorbit Fuel stock',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function FuelstockMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <FuelstockProfile 
                    dataIn={{ parentUseEffectKey: "initFuelstockProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateFuelstockEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}