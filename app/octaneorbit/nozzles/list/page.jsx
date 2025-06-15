import { Suspense } from 'react';

import FuelnozzlesList from '../uiControl/FuelnozzlesList';

import { InteprateFuelnozzlesEvent } from '../dataControl/FuelnozzlesRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Fuel nozzles"//searchParams?.mosyTitle || "Fuel nozzles";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Fuel nozzles`,
    description: 'octaneorbit Fuel nozzles',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function FuelnozzlesMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <FuelnozzlesList  
                    
                     dataIn={{ parentUseEffectKey: "loadFuelnozzlesList" }}
                       
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