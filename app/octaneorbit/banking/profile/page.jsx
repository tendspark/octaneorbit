import { Suspense } from 'react';

import BankdepositsProfile from '../uiControl/BankdepositsProfile';

import { InteprateBankdepositsEvent } from '../dataControl/BankdepositsRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Bank deposits"//searchParams?.mosyTitle || "Bank deposits";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Bank deposits profile`,
    description: 'octaneorbit Bank deposits',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function BankdepositsMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <BankdepositsProfile 
                    dataIn={{ parentUseEffectKey: "initBankdepositsProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateBankdepositsEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}