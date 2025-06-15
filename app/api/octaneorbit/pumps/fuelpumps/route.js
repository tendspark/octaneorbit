
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {FuelpumpsRowMutations} from './FuelpumpsRowMutations';

import listFuelpumpsRowMutationsKeys from './FuelpumpsMutationKeys';

//be gate keeper and auth 
import { validateSelect } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const encodedMutations = searchParams.get('mutations');

    let requestedMutationsObj = {};
    if (encodedMutations) {
      try {
        const decodedMutations = Buffer.from(encodedMutations, 'base64').toString('utf-8');
        requestedMutationsObj = JSON.parse(decodedMutations);
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
      tbl: 'fuel_pumps',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    let requestValid =validateSelect('fuel_pumps', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listFuelpumpsRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, FuelpumpsRowMutations);

      return Response.json({
        status: 'success',
        message: 'Fuelpumps data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Fuelpumps failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(FuelpumpsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = FuelpumpsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await FuelpumpsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await FuelpumpsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(FuelpumpsRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const FuelpumpsFormAction = body.fuel_pumps_mosy_action;
    const fuel_pumps_uptoken_value = base64Decode(body.fuel_pumps_uptoken);

		//--- Begin  fuel_pumps inputs array ---// 

const FuelpumpsInputsArr = {
  "pump_name" : "?", 
  "fuel_station_id" : "?", 
  "manufacturer" : "?", 
  "model_number" : "?", 
  "installation_date" : "?", 
  "status" : "?", 
  "created_on" : "?", 

};

//--- End fuel_pumps inputs array --//

    
    if (FuelpumpsFormAction === "add_fuel_pumps") 
    {
      
      const newId = magicRandomStr(7);
      FuelpumpsInputsArr.record_id = newId;
      
      // Insert into table Fuelpumps
      const result = await mosySqlInsert("fuel_pumps", FuelpumpsInputsArr, body);

       

      return Response.json({
        status: 'success',
        message: result.message,
        fuel_pumps_uptoken: result.record_id
      });
      
    }
    
    if (FuelpumpsFormAction === "update_fuel_pumps") {
      
      // update table Fuelpumps
      const result = await mosySqlUpdate("fuel_pumps", FuelpumpsInputsArr, body, `primkey='${fuel_pumps_uptoken_value}'`);


      

      return Response.json({
        status: 'success',
        message: result.message,
        fuel_pumps_uptoken: fuel_pumps_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${FuelpumpsFormAction}`
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