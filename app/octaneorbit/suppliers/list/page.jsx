import { Suspense } from 'react';

import SupplierlistList from '../uiControl/SupplierlistList';

import { InteprateSupplierlistEvent } from '../dataControl/SupplierlistRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Supplier list"//searchParams?.mosyTitle || "Supplier list";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Supplier list`,
    description: 'octaneorbit Supplier list',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function SupplierlistMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <SupplierlistList  
                    
                     dataIn={{ parentUseEffectKey: "loadSupplierlistList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateSupplierlistEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }