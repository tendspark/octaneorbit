
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {DailysalesRowMutations} from './DailysalesRowMutations';

import listDailysalesRowMutationsKeys from './DailysalesMutationKeys';

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
      tbl: 'fuel_sales',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    let requestValid =validateSelect('fuel_sales', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listDailysalesRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, DailysalesRowMutations);

      return Response.json({
        status: 'success',
        message: 'Dailysales data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Dailysales failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(DailysalesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = DailysalesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await DailysalesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await DailysalesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(DailysalesRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const DailysalesFormAction = body.fuel_sales_mosy_action;
    const fuel_sales_uptoken_value = base64Decode(body.fuel_sales_uptoken);

		//--- Begin  fuel_sales inputs array ---// 

const DailysalesInputsArr = {
  "fuel_station_id" : "?", 
  "pump_nozzle_id" : "?", 
  "vehicle_plate" : "?", 
  "fuel_type" : "?", 
  "quantity_sold_litres" : "?", 
  "sale_price_per_litre" : "?", 
  "total_amount" : "?", 
  "sold_by_staff_id" : "?", 
  "sale_method" : "?", 
  "sale_date" : "?", 

};

//--- End fuel_sales inputs array --//

    
    if (DailysalesFormAction === "add_fuel_sales") 
    {
      
      const newId = magicRandomStr(7);
      DailysalesInputsArr.record_id = newId;
      
      // Insert into table Dailysales
      const result = await mosySqlInsert("fuel_sales", DailysalesInputsArr, body);

       

      return Response.json({
        status: 'success',
        message: result.message,
        fuel_sales_uptoken: result.record_id
      });
      
    }
    
    if (DailysalesFormAction === "update_fuel_sales") {
      
      // update table Dailysales
      const result = await mosySqlUpdate("fuel_sales", DailysalesInputsArr, body, `primkey='${fuel_sales_uptoken_value}'`);


      

      return Response.json({
        status: 'success',
        message: result.message,
        fuel_sales_uptoken: fuel_sales_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${DailysalesFormAction}`
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