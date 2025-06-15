
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Fuelpumps 
export const FuelpumpsRowMutations = {

  //dope  _fuel_stations_station_name_fuel_station_id column to the response
  _fuel_stations_station_name_fuel_station_id : async (row)=>{

    const data_res = await mosyQddata("fuel_stations", "record_id", row.fuel_station_id);
    return data_res?.station_name ?? row.fuel_station_id;

  },

  
  //dope nozzles column to the response              
  nozzles: async (row) => {

    const data_res = await mosyCountRows("fuel_pump_nozzles", `where pump_id ='${row?.record_id}'`);

    return data_res;

  }
}
