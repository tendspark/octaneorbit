
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {FuelstationsRowMutations} from './FuelstationsRowMutations';

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
      tbl: 'fuel_stations',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    let requestValid =validateSelect('fuel_stations', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }

    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, FuelstationsRowMutations);

      return Response.json({
        status: 'success',
        message: 'Fuelstations data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Fuelstations failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(FuelstationsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = FuelstationsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await FuelstationsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await FuelstationsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(FuelstationsRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const FuelstationsFormAction = body.fuel_stations_mosy_action;
    const fuel_stations_uptoken_value = base64Decode(body.fuel_stations_uptoken);

		//--- Begin  fuel_stations inputs array ---// 

const FuelstationsInputsArr = {
  "station_name" : "?", 
  "station_code" : "?", 
  "manager_name" : "?", 
  "contact_number" : "?", 
  "email" : "?", 
  "county" : "?", 
  "location" : "?", 
  "status" : "?", 
  "latitude" : "?", 
  "longitude" : "?", 
  "google_maps_link" : "?", 
  "opening_hours" : "?", 
  "is_operational" : "?", 
  "has_atg_system" : "?", 
  "licence_number" : "?", 
  "licence_expiry_date" : "?", 
  "erp_integration_code" : "?", 
  "till_number" : "?", 
  "paybill_number" : "?", 
  "bank_account_name" : "?", 
  "bank_account_number" : "?", 
  "default_payment_mode" : "?", 
  "storage_capacity_litres" : "?", 
  "additional_details" : "?", 
  "created_on" : "?", 

};

//--- End fuel_stations inputs array --//

    
    if (FuelstationsFormAction === "add_fuel_stations") 
    {
      
      const newId = magicRandomStr(7);
      FuelstationsInputsArr.record_id = newId;
      
      // Insert into table Fuelstations
      const result = await mosySqlInsert("fuel_stations", FuelstationsInputsArr, body);

       

      return Response.json({
        status: 'success',
        message: result.message,
        fuel_stations_uptoken: result.record_id
      });
      
    }
    
    if (FuelstationsFormAction === "update_fuel_stations") {
      
      // update table Fuelstations
      const result = await mosySqlUpdate("fuel_stations", FuelstationsInputsArr, body, `primkey='${fuel_stations_uptoken_value}'`);


      

      return Response.json({
        status: 'success',
        message: result.message,
        fuel_stations_uptoken: fuel_stations_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${FuelstationsFormAction}`
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