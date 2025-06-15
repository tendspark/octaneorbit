import { Suspense } from 'react';

import SupplierlistProfile from '../uiControl/SupplierlistProfile';

import { InteprateSupplierlistEvent } from '../dataControl/SupplierlistRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Supplier list"//searchParams?.mosyTitle || "Supplier list";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Supplier list profile`,
    description: 'octaneorbit Supplier list',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function SupplierlistMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <SupplierlistProfile 
                    dataIn={{ parentUseEffectKey: "initSupplierlistProfile" }} 
                                           
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