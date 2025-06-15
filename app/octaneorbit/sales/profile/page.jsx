import { Suspense } from 'react';

import DailysalesProfile from '../uiControl/DailysalesProfile';

import { InteprateDailysalesEvent } from '../dataControl/DailysalesRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Daily sales profile"//searchParams?.mosyTitle || "Daily sales";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Daily sales profile`,
    description: 'octaneorbit Daily sales',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function DailysalesMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <DailysalesProfile 
                    dataIn={{ parentUseEffectKey: "initDailysalesProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateDailysalesEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}