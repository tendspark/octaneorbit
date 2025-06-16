'use client';

import { useEffect, useState } from 'react';

import DashboardCards from './DashboardCards';
import DashboardCharts from './DashboardCharts';
import { MosySpace, MosyTitleTag } from '../../UiControl/componentControl';

import { mosyGetData,  } from '../../../MosyUtils/hiveUtils';

import { MosyNotify , closeMosyModal } from '../../../MosyUtils/ActionModals';

import FuelstockList from '../../inventory/uiControl/FuelstockList';

import { InteprateFuelstockEvent } from '../../inventory/dataControl/FuelstockRequestHandler';

export default function DashboardHolder() {
  const [chartData, setChartData] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
     MosyNotify({message : "Loading chart data" , icon:"line-chart", addTimer:false})
      const response = await mosyGetData({
        endpoint: '/api/octaneorbit/dashboard/realtime-metrics',
        params: {}
      });

      if (response) {

        setChartData(response?.chart_data);
        setCardData(response?.cards_data);
        closeMosyModal()
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  return (
	<>
    <DashboardCards cards={cardData} />
    <div className="col-md-12 p-0 m-0  rounded-xl ">
      <div className="row justify-content-center m-0 p-0  col-md-12">
        <DashboardCharts chartData={chartData} />

      </div>
      <MosySpace spaceClass="p-2" />
      <MosyTitleTag title="Fuel in stock" />
                     
       <FuelstockList                                  
      dataIn={{ parentUseEffectKey: "loadFuelstockList", showDataControlSections: false }}
                             
      dataOut={{
        setChildDataOut: InteprateFuelstockEvent
      }}

    />
    </div>
    </>

  );
}