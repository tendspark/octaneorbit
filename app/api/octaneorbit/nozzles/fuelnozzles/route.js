
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {FuelnozzlesRowMutations} from './FuelnozzlesRowMutations';

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
      tbl: 'fuel_pump_nozzles',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    let requestValid =validateSelect('fuel_pump_nozzles', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }

    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, FuelnozzlesRowMutations);

      return Response.json({
        status: 'success',
        message: 'Fuelnozzles data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Fuelnozzles failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(FuelnozzlesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = FuelnozzlesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await FuelnozzlesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await FuelnozzlesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(FuelnozzlesRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const FuelnozzlesFormAction = body.fuel_pump_nozzles_mosy_action;
    const fuel_pump_nozzles_uptoken_value = base64Decode(body.fuel_pump_nozzles_uptoken);

		//--- Begin  fuel_pump_nozzles inputs array ---// 

const FuelnozzlesInputsArr = {
  "pump_id" : "?", 
  "nozzle_label" : "?", 
  "fuel_type" : "?", 
  "calibration_factor" : "?", 
  "status" : "?", 
  "installed_on" : "?", 
  "last_maintenance_date" : "?", 
  "created_on" : "?", 

};

//--- End fuel_pump_nozzles inputs array --//

    
    if (FuelnozzlesFormAction === "add_fuel_pump_nozzles") 
    {
      
      const newId = magicRandomStr(7);
      FuelnozzlesInputsArr.record_id = newId;
      
      // Insert into table Fuelnozzles
      const result = await mosySqlInsert("fuel_pump_nozzles", FuelnozzlesInputsArr, body);

       

      return Response.json({
        status: 'success',
        message: result.message,
        fuel_pump_nozzles_uptoken: result.record_id
      });
      
    }
    
    if (FuelnozzlesFormAction === "update_fuel_pump_nozzles") {
      
      // update table Fuelnozzles
      const result = await mosySqlUpdate("fuel_pump_nozzles", FuelnozzlesInputsArr, body, `primkey='${fuel_pump_nozzles_uptoken_value}'`);


      

      return Response.json({
        status: 'success',
        message: result.message,
        fuel_pump_nozzles_uptoken: fuel_pump_nozzles_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${FuelnozzlesFormAction}`
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