
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Fuelstations 
export const FuelstationsRowMutations = {

  
  //dope date_added column to the response              
  date_added: async (row) => {

    const data_res = row?.created_on;

    return data_res;

  }
}
