
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {DeposithistoryRowMutations} from './DeposithistoryRowMutations';

//be gate keeper and auth 
import { validateSelect } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const encodedMutations = searchParams.get('mutations');

    let mutationsObj = {};
    if (encodedMutations) {
      try {
        const decodedMutations = Buffer.from(encodedMutations, 'base64').toString('utf-8');
        mutationsObj = JSON.parse(decodedMutations);
      } catch (err) {
        console.error('Mutation decode failed:', err);
      }
    }

    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    

    // ✅ Provide default fallbacks
    const enhancedParams = {
      tbl: 'deposits_by_mode',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    let requestValid =validateSelect('deposits_by_mode', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }

    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, DeposithistoryRowMutations);

      return Response.json({
        status: 'success',
        message: 'Deposithistory data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Deposithistory failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(DeposithistoryRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = DeposithistoryRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await DeposithistoryRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await DeposithistoryRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(DeposithistoryRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const DeposithistoryFormAction = body.deposits_by_mode_mosy_action;
    const deposits_by_mode_uptoken_value = base64Decode(body.deposits_by_mode_uptoken);

		//--- Begin  deposits_by_mode inputs array ---// 

const DeposithistoryInputsArr = {
  "station_id" : "?", 
  "date_deposited" : "?", 
  "amount_deposited" : "?", 
  "payment_mode" : "?", 
  "ref_number" : "?", 
  "shift_id" : "?", 
  "deposit_file_id" : "?", 
  "remark" : "?", 

};

//--- End deposits_by_mode inputs array --//

    
    if (DeposithistoryFormAction === "add_deposits_by_mode") 
    {
      
      const newId = magicRandomStr(7);
      DeposithistoryInputsArr.record_id = newId;
      
      // Insert into table Deposithistory
      const result = await mosySqlInsert("deposits_by_mode", DeposithistoryInputsArr, body);

       

      return Response.json({
        status: 'success',
        message: result.message,
        deposits_by_mode_uptoken: result.record_id
      });
      
    }
    
    if (DeposithistoryFormAction === "update_deposits_by_mode") {
      
      // update table Deposithistory
      const result = await mosySqlUpdate("deposits_by_mode", DeposithistoryInputsArr, body, `primkey='${deposits_by_mode_uptoken_value}'`);


      

      return Response.json({
        status: 'success',
        message: result.message,
        deposits_by_mode_uptoken: deposits_by_mode_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${DeposithistoryFormAction}`
    }, { status: 400 });

  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}