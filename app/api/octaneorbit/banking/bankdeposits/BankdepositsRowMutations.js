
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Bankdeposits 
export const BankdepositsRowMutations = {

  //dope  _fuel_stations_station_name_station_id column to the response
  _fuel_stations_station_name_station_id : async (row)=>{

    const data_res = await mosyQddata("fuel_stations", "record_id", row.station_id);
    return data_res?.station_name ?? row.station_id;

  },

  
  //dope deposit_list column to the response              
  deposit_list: async (row) => {

    const data_res = await mosyFlexQuickSel("deposits_by_mode", "amount_deposited,ref_number,payment_mode", `where deposit_file_id ='${row?.record_id}'`);

    return data_res;

  }
}
