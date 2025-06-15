import { Suspense } from 'react';

import FuelpumpsProfile from '../uiControl/FuelpumpsProfile';

import { InteprateFuelpumpsEvent } from '../dataControl/FuelpumpsRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Fuel pumps profile"//searchParams?.mosyTitle || "Fuel pumps";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Fuel pumps profile`,
    description: 'octaneorbit Fuel pumps',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function FuelpumpsMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <FuelpumpsProfile 
                    dataIn={{ parentUseEffectKey: "initFuelpumpsProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateFuelpumpsEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}