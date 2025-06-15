
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Fuelnozzles 
export const FuelnozzlesRowMutations = {

  //dope  _fuel_pumps_pump_name_pump_id column to the response
  _fuel_pumps_pump_name_pump_id : async (row)=>{

    const data_res = await mosyQddata("fuel_pumps", "record_id", row.pump_id);
    return data_res?.pump_name ?? row.pump_id;

  }
}
