
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Deposithistory 
export const DeposithistoryRowMutations = {

  //dope  _fuel_stations_station_name_station_id column to the response
  _fuel_stations_station_name_station_id : async (row)=>{

    const data_res = await mosyQddata("fuel_stations", "record_id", row.station_id);
    return data_res?.station_name ?? row.station_id;

  },

  //dope  _banking_record_id_deposit_file_id column to the response
  _banking_record_id_deposit_file_id : async (row)=>{

    const data_res = await mosyQddata("banking", "record_id", row.deposit_file_id);
    return data_res?.record_id ?? row.deposit_file_id;

  }
}
