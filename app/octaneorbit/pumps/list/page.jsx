import { Suspense } from 'react';

import FuelpumpsList from '../uiControl/FuelpumpsList';

import { InteprateFuelpumpsEvent } from '../dataControl/FuelpumpsRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Fuel pumps"//searchParams?.mosyTitle || "Fuel pumps";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Fuel pumps`,
    description: 'octaneorbit Fuel pumps',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function FuelpumpsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <FuelpumpsList  
                    
                     dataIn={{ parentUseEffectKey: "loadFuelpumpsList" }}
                       
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