
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {FuelstockRowMutations} from './FuelstockRowMutations';

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
      tbl: 'fuel_inventory',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    let requestValid =validateSelect('fuel_inventory', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }

    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, FuelstockRowMutations);

      return Response.json({
        status: 'success',
        message: 'Fuelstock data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Fuelstock failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(FuelstockRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = FuelstockRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await FuelstockRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await FuelstockRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(FuelstockRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const FuelstockFormAction = body.fuel_inventory_mosy_action;
    const fuel_inventory_uptoken_value = base64Decode(body.fuel_inventory_uptoken);

		//--- Begin  fuel_inventory inputs array ---// 

const FuelstockInputsArr = {
  "item_name" : "?", 
  "item_code" : "?", 
  "fuel_type" : "?", 
  "Selling_price" : "?", 
  "current_stock_litres" : "?", 
  "buying_price" : "?", 
  "fuel_grade" : "?", 
  "density_kg_per_m3" : "?", 
  "volume_correction_factor" : "?", 
  "manual_dip_reading_litres" : "?", 
  "atg_reading_litres" : "?", 
  "percentage_variance" : "?", 
  "variance_reason_code" : "?", 
  "tank_reference" : "?", 
  "last_updated_on" : "?", 
  "created_on" : "?", 

};

//--- End fuel_inventory inputs array --//

    
    if (FuelstockFormAction === "add_fuel_inventory") 
    {
      
      const newId = magicRandomStr(7);
      FuelstockInputsArr.record_id = newId;
      
      // Insert into table Fuelstock
      const result = await mosySqlInsert("fuel_inventory", FuelstockInputsArr, body);

       

      return Response.json({
        status: 'success',
        message: result.message,
        fuel_inventory_uptoken: result.record_id
      });
      
    }
    
    if (FuelstockFormAction === "update_fuel_inventory") {
      
      // update table Fuelstock
      const result = await mosySqlUpdate("fuel_inventory", FuelstockInputsArr, body, `primkey='${fuel_inventory_uptoken_value}'`);


      

      return Response.json({
        status: 'success',
        message: result.message,
        fuel_inventory_uptoken: fuel_inventory_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${FuelstockFormAction}`
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