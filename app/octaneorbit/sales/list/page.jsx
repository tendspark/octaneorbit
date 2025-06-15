import { Suspense } from 'react';

import DailysalesList from '../uiControl/DailysalesList';

import { InteprateDailysalesEvent } from '../dataControl/DailysalesRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Daily sales"//searchParams?.mosyTitle || "Daily sales";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Daily sales`,
    description: 'octaneorbit Daily sales',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function DailysalesMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <DailysalesList  
                    
                     dataIn={{ parentUseEffectKey: "loadDailysalesList" }}
                       
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