import { Suspense } from 'react';

import FuelstockList from '../uiControl/FuelstockList';

import { InteprateFuelstockEvent } from '../dataControl/FuelstockRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Fuel stock"//searchParams?.mosyTitle || "Fuel stock";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Fuel stock`,
    description: 'octaneorbit Fuel stock',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function FuelstockMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <FuelstockList  
                    
                     dataIn={{ parentUseEffectKey: "loadFuelstockList" }}
                       
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