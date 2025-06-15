import { Suspense } from 'react';

import DeposithistoryList from '../uiControl/DeposithistoryList';

import { InteprateDeposithistoryEvent } from '../dataControl/DeposithistoryRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Deposit history"//searchParams?.mosyTitle || "Deposit history";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Deposit history`,
    description: 'octaneorbit Deposit history',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function DeposithistoryMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <DeposithistoryList  
                    
                     dataIn={{ parentUseEffectKey: "loadDeposithistoryList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateDeposithistoryEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }