
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {BankdepositsRowMutations} from './BankdepositsRowMutations';

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
      tbl: 'banking',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    let requestValid =validateSelect('banking', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }

    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, BankdepositsRowMutations);

      return Response.json({
        status: 'success',
        message: 'Bankdeposits data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Bankdeposits failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(BankdepositsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = BankdepositsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await BankdepositsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await BankdepositsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(BankdepositsRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const BankdepositsFormAction = body.banking_mosy_action;
    const banking_uptoken_value = base64Decode(body.banking_uptoken);

		//--- Begin  banking inputs array ---// 

const BankdepositsInputsArr = {
  "station_id" : "?", 
  "shift_code" : "?", 
  "record_date" : "?", 
  "expected_sales_amount" : "?", 
  "actual_banked_amount" : "?", 
  "variance_amount" : "?", 
  "variance_reason" : "?", 
  "banked_by" : "?", 
  "banked_on" : "?", 
  "bank_reference_code" : "?", 
  "banking_status" : "?", 
  "payment_notes" : "?", 
  "verified_by" : "?", 
  "verified_on" : "?", 

};

//--- End banking inputs array --//

    
    if (BankdepositsFormAction === "add_banking") 
    {
      
      const newId = magicRandomStr(7);
      BankdepositsInputsArr.record_id = newId;
      
      // Insert into table Bankdeposits
      const result = await mosySqlInsert("banking", BankdepositsInputsArr, body);

       

      return Response.json({
        status: 'success',
        message: result.message,
        banking_uptoken: result.record_id
      });
      
    }
    
    if (BankdepositsFormAction === "update_banking") {
      
      // update table Bankdeposits
      const result = await mosySqlUpdate("banking", BankdepositsInputsArr, body, `primkey='${banking_uptoken_value}'`);


      

      return Response.json({
        status: 'success',
        message: result.message,
        banking_uptoken: banking_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${BankdepositsFormAction}`
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