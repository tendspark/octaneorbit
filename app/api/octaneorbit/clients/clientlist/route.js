
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {ClientlistRowMutations} from './ClientlistRowMutations';

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
      tbl: 'clients',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    let requestValid =validateSelect('clients', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }

    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, ClientlistRowMutations);

      return Response.json({
        status: 'success',
        message: 'Clientlist data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Clientlist failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(ClientlistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = ClientlistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await ClientlistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await ClientlistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(ClientlistRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const ClientlistFormAction = body.clients_mosy_action;
    const clients_uptoken_value = base64Decode(body.clients_uptoken);

		//--- Begin  clients inputs array ---// 

const ClientlistInputsArr = {
  "client_name" : "?", 
  "client_type" : "?", 
  "phone_number" : "?", 
  "alt_phone" : "?", 
  "email" : "?", 
  "national_id" : "?", 
  "kra_pin" : "?", 
  "vehicle_plate" : "?", 
  "contact_person" : "?", 
  "payment_mode_preference" : "?", 
  "credit_limit" : "?", 
  "balance_due" : "?", 
  "client_status" : "?", 
  "loyalty_points" : "?", 
  "physical_address" : "?", 
  "county" : "?", 
  "location_description" : "?", 
  "registered_by" : "?", 
  "registered_on" : "?", 
  "last_transaction_on" : "?", 
  "remarks" : "?", 
  "created_on" : "?", 

};

//--- End clients inputs array --//

    
    if (ClientlistFormAction === "add_clients") 
    {
      
      const newId = magicRandomStr(7);
      ClientlistInputsArr.record_id = newId;
      
      // Insert into table Clientlist
      const result = await mosySqlInsert("clients", ClientlistInputsArr, body);

       

      return Response.json({
        status: 'success',
        message: result.message,
        clients_uptoken: result.record_id
      });
      
    }
    
    if (ClientlistFormAction === "update_clients") {
      
      // update table Clientlist
      const result = await mosySqlUpdate("clients", ClientlistInputsArr, body, `primkey='${clients_uptoken_value}'`);


      

      return Response.json({
        status: 'success',
        message: result.message,
        clients_uptoken: clients_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${ClientlistFormAction}`
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