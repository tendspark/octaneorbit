<?php 
//============================================= 
//custom columns to display / additional column not in the table 
$custom_tbl_cols=[
  
  "fuel_stations"=>["date_added"],
  
];


//additional columns values 
$custom_query_line_cols=[];
  

$custom_next_js_query_line_cols=[
  "date_added"=>[
    "function" => 'row?.created_on',
    "args"=>[],
    "return"=>"data_res"],
  
  ];

//sample 
/*
  'stock_in'=>'sum_inventory_history(\"quantity\", \"item_id=\'\".\$data_res[\'item_id\'].\"\'  and transfer_type=\'Stock In\' \")',  
  'date_activated'=>'ftime(\$data_res[\'activated_on\'],\'date\')',  
  "activation_date"=>'date_time_input(\$data_res[\'activated_on\'],\"date\")',   
  'activated'=>'\count_acc_renewals(\"(DATE_FORMAT(activated_on, \'%Y-%m-%d\'))=\'\".date_time_input(\$data_res[\'activated_on\'],\"date\"). \"\' \")',  
  'pending'=>'\$ajax_function_data[\'expiring\']-\$ajax_function_data[\'activated\']',
  'unrealized_revenue'=>'\$ajax_function_data[\'expected_revenue\']-\$ajax_function_data[\'realized_revenue\']',

  'accounts_renewed'=>'\count_acc_renewals(\"(DATE_FORMAT(activated_on, \'%Y-%m-%d\'))=\'\".\$data_res[\'filter_date\']. \"\' \")',  
  
  'total_amount_paid'=>'\sum_transactions(\"amount\",\"filter_date=\'\". \$data_res[\'filter_date\']. \"\' \")',  
  'accounts_paid'=>'\get_transactions(\"count(distinct BillRefNumber) as tot_accs\",\"where filter_date=\'\". \$data_res[\'filter_date\']. \"\'\",\"r\")[\"tot_accs\"]',  
*/ 

//display multigrid 
$custom_multi_grid_rows=[]; 


/*
//sample 

  "payment_history"=>[
         "table"=>"transactions",
         "link"=>"transactions_list",
         "query"=>"BillRefNumber='{{user_no}}'",
         "title"=>"Client payment history",
         "columns"=>["trx_date","trx_id","amount"],
          ],
  
  "renewal_history"=>[
         "table"=>"transactions",
         "link"=>"transactions_list",
         "query"=>"BillRefNumber='{{user_no}}'",
         "title"=>"Client subscription history",
         "columns"=>["amount","trx_id","trx_date"],
          ],  
          
*/

//custom list columns
$custom_list_col_data_=[
  
  "messages_sent"=>"date('d-m-Y H:i')",
  'requesting_member'=>"?",
  //19355
];


///incase there are no values in the column use the following defaul values 
$custom_profile_default_data_=[
  
  "date_added"=>"?",
  'posted_by'=>'checkblank(getarr_val_($pety_cash_post_node,"posted_by"), $session_sauth_logged_user_id)',
  'approval_status'=>'checkblank(getarr_val_($petty_cash_node,"approval_status"), "Pending Approval")',

];

//fuel_inventory //"primkey" , "record_id" , "station_id" , "fuel_type" , "quantity_litres" , "supplier_id" , "delivery_date" , "status" , "created_on" ,


/// basic settings 
$file_prefix="";
$overwrite_existing_file ='yes'; // yes || no
$default_icon='minus';
$use_pop_tray="yes";
$andquote="&";
$trim_text_size=70;
$textarea_name='textarea';
///

//fuel_stations //"primkey" , "record_id" , "station_name" , "station_code" , "location" , "county" , "contact_number" , "email" , "manager_name" , "status" , "latitude" , "longitude" , "google_maps_link" , "opening_hours" , "station_type" , "ownership_entity" , "is_operational" , "has_atg_system" , "licence_number" , "licence_expiry_date" , "erp_integration_code" , "till_number" , "paybill_number" , "bank_account_name" , "bank_account_number" , "default_payment_mode" , "storage_capacity_litres" , "additional_details" , "created_on"

//////============================================= module digital nexis architecture (mdna) settings array 
$novanest_module_ui_blueprint_=[
  
  "page_layout"=>[
    
   
    //============================================
    //how do you want the inputs to be arranged in the ui list & profile 
    "desired_column_order"=>[

        'fuel_stations' => ['primkey','record_id', "station_name",'station_code','manager_name','contact_number','email','county'],

    ],
    
//fuel_stations //"primkey" , "record_id" , "station_name" , "station_code" , "location" , "county" , "contact_number" , "email" , "manager_name" , "status" , "latitude" , "longitude" , "google_maps_link" , "opening_hours" , "station_type" , "ownership_entity" , "is_operational" , "has_atg_system" , "licence_number" , "licence_expiry_date" , "erp_integration_code" , "till_number" , "paybill_number" , "bank_account_name" , "bank_account_number" , "default_payment_mode" , "storage_capacity_litres" , "additional_details" , "created_on" ,    
    
    //segment inputs into groups eg user details , user payments , user subscriptions etc  
    "form_input_segmentation_arr"=>[
          //sample 
          "fuel_stations"=>[ 
                    "Station info"=>["station_name","station_code","storage_capacity_litres","manager_name","contact_number","email","is_operational","county","location","opening_hours"],
                    "Account details"=>["bank_account_name","bank_account_number","paybill_number","till_number","default_payment_mode"],
                    "Compliance info"=>["has_atg_system","erp_integration_code","licence_number","licence_expiry_date"],
             ]

    ],
    
    //=============================================    image_columns
    "image_columns"=>["photo"],    
    
    //==============================================   default_col_class bootstrap col-md-12 / col-md-4 ....    
    "default_col_class"=>"col-md-6",
    
    //==============================================   hidden_inputs on profile arr    
    "hidden_inputs"=>["reg_date"],
    
    //==============================================   print_tables tables with print buttons
    "print_tables"=>["fuel_stations"],
    
    //==============================================   ///skip  these columns on the profile page 
    "skip_cols_profile"=>[],
        
    ///=============================================   skip  these columns on the list page 
    "skip_cols_list"=>["email" , "status" , "latitude" , "longitude" , "google_maps_link" , "opening_hours" , "station_type" , "ownership_entity" , "has_atg_system" , "licence_number" , "licence_expiry_date" , "erp_integration_code" , "till_number" , "paybill_number" , "bank_account_name" , "bank_account_number" , "default_payment_mode" , "storage_capacity_litres" , "additional_details","created_on"],
        
    ///=============================================   these columns diplays running balance amount 
    "running_bal_col_tbl"=>[],    
    //sample 
    //$running_bal_col_tbl=["table_name"=>'column_name:{{column_name1}}- {{column_name2}}'];
    //=============================================
    
    ///============================================    the data on these tables are managed by js Grid
    "grid_tbl"=>['clients'],
    
    //============================================    //these tables dont need to have the profile page 
    "skip_file_edits_array"=>[],

    ///===========================================    The following ui are read only
    "view_tbl_only"=>[],
    
    //============================================    these columns have values to be summed 
    "sum_cols_list"=>['columns'],
    
    //============================================    on the profile page for these columns use textarea component
    "textarea_array"=>['additional_details',"column_name2..."],
    
    //============================================    on the profile page for these columns use textarea component
    "content_editable"=>['column_name',"column_name2..."],
    
    //============================================    on the profile page for these columns use drop down with these values component
    "static_drop_down_array"=>['user_gender'=>"Male,Female,Other","status"=>"Active,Inactive,Under maintainance","is_operational"=>"Yes,No","has_atg_system"=>"Yes,No"],
    //sample 
    //$static_drop_down_array=['column_name1'=>'Male,Female','column_name2'=>'Complete,Pending,Onprogress'];

    //==========================================          | on the profile page for these columns use dynamic drop down values
    "dynamic_drop_down_array"=>["fuel_type","location","county","default_payment_mode"],
    
    //=============================================       | on the profile page, these columns are password values
    "password_columns"=>['login_password',"column_name2..."],

    //==============================================      | on the profile page, these columns are titles they have a input with class col-md-12
    "title_columns"=>['client_name','column_name2...'],

    //==============================================      | on the profile page, these columns are dates Y-m-d
    "date_columns"=>["created_on", "licence_expiry_date"],

    //=============================================       on the profile page, these columns are datetime Y-m-d H:i:s
    "datetime_columns"=>['creKated_on'],
    
    //============================================        on the ui , rename these column lables to the new names indicated ...
    "rename_cols_array"=>['station_id'=>'Station name', "manager_name"=>"Manager","contact_number"=>"Mobile","additional_details"=>"Notes and remarks","is_operatiossnal"=>"Operational status"],

    //rename the following tables with the indicated alises on the ui 
    "rename_tables_array"=>['allowancees'=>'Staff Allowances:plus'],
    
    //sample table => 
    //$rename_tables_array=['table'=>'New name:fafa icon eg plus, plus-circle, copy etc'];

    //on these tables let the add new button lable have the following icons and label 
    "new_label_buttons_arr"=>['fuel_stations'=>'plus-circle:Add Station:Station profile /  {{station_code}} / {{station_name}}'],
    //sample 
    //$new_label_buttons_arr=['table_name'=>'plus-circle:New Project:Project profile - {{project_name}}'];    
    
    "profile_pic_style"=>"width:200px; height:200px; border-radius:50%;",

  ],
  
  "data_behaviour"=>[
    
    "custom_query_line_cols"=>[
      "total_amount_paid"=>"00"  
    ],        
    
    "custom_multi_grid_rows"=>[],
        
    //additional column values on the profile ui
    "custom_profile_col_data"=>["date_added"=>"`\${(fuel_stationsNode?.created_on)}`"],
    
    "custom_profile_default_data"=>[],
    
    //=============================================        on the ui , these columns connect values from other tables
    "connection_cols"=>['station_id'=>'fuel_stations:record_id:station_name:/api/octaneorbit/stations/fuelstations'],
    
    //sample
    //$connection_cols=['child_column_name'=>'parent_table:parent_column_id:parent_column_value_to_show'];
    // eg paid_by in transactions table connect to client_id in clients table : child_column_name = paid_by , parent_table clients , parent_column_id : client_id parent_column_value_to_show : client_name etc

    //advanced with custom function for js search 
    //$connection_cols=['child_column_name'=>'parent_table:parent_column_id:parent_column_value_to_show:js_function_you_want('{{column_name1}}','{{column_name2...}}')'];
    
  ]
  
  
];
  

$desired_column_order = $novanest_module_ui_blueprint_["page_layout"]["desired_column_order"];
$page_layout__ = $novanest_module_ui_blueprint_["page_layout"];
$data_behaviour = $novanest_module_ui_blueprint_["data_behaviour"];     
$image_cols_array = $page_layout__["image_columns"];
$rename_cols_array = $page_layout__["rename_tables_array"];
$grid_tbl_ = $page_layout__["grid_tbl"];
$view_tbl_only = $page_layout__["view_tbl_only"];
$print_tables = $page_layout__["print_tables"];
$skip_file_edits_array = $page_layout__["skip_file_edits_array"];
$connection_cols = $data_behaviour["connection_cols"];
$skip_cols_list = $page_layout__["skip_cols_list"];
$skip_cols_profile = $page_layout__["skip_cols_profile"];
$form_input_segmentation_arr = $page_layout__["form_input_segmentation_arr"];
$new_label_buttons_arr=$page_layout__["new_label_buttons_arr"];
$rename_tables_array=$page_layout__["rename_tables_array"];
              
/////========= lit ui handlers

if(function_exists('create_list_cards'))
{
  $memmber_cards=create_list_cards(['user_list_card'=>['photo_node:profile_pic','node1:name','node2:phone','node3:phone','node4:email']]);
  $send_list=create_list_cards(['user_long_card'=>['photo_node:photo','node1:project_name','node2:tag_name','node3:status']]);
  $lesson_materials_template=create_list_cards(['user_long_card'=>['photo_node:tr_matlink','node1:tr_matname','node2:tr_matfomart','node3:tr_mattype']]);
  $blog_card=create_list_cards(['blog_card__'=>['photo_node:imageurl','node1:title','node2:description','node3:catgry']]);
  $ebooks=create_list_cards(['blog_card__no_blur'=>['photo_node:cover_image','node1:title','node2:ebook_name','node3:author']]);
  $lessoncard=create_list_cards(['blog_card__'=>['photo_node:profile_pic','node1:name','node2:email','node3:tel']]);
  $send_list_card_=create_list_cards(['long_content_card'=>['{{{node1}}}:Group - {{{send_list_name}}}','node2:comment','node3:user_email','col-md-6:col-md-7']]);
  $comments=create_list_cards(['long_content_card'=>['node1:username','node2:comment','node3:user_email','col-md-6:col-md-7']]);
  $jobs_board=create_list_cards(['long_content_card'=>['node1:title','node2:instructions','node3:deadline','col-md-6:col-md-8']]);

  $custom_list_ui=['send_lkist'=>$send_list_card_,'ebooks'=>$ebooks,'jobs_board'=>$jobs_board,'memlbers'=>$memmber_cards,'news'=>$blog_card, 'tr_lessonks'=>$lessoncard,'blog_comments'=>$comments,'workprofile_tbl'=>$jobs_board,'reviews'=>$jobs_board];

  $blog_profile_ui_template=create_list_cards(['user_profile_ui'=>['{{profile_pic}}:{{{profile_pic}}}','{{profile_title}}:Student Profile / {{{name}}}']],'988');
  $news_profile_ui_template=create_list_cards(['blog_profile_ui'=>['{{profile_pic}}:{{imageurl}}','{{profile_title}}:Post Profile / {{{title}}}']],'988');
  $lesson_profile_ui_template=create_list_cards(['blog_profile_ui'=>['{{profile_pic}}:{{tr_lessonimg}}','{{profile_title}}:{{{tr_lesson_topic}}}']],'988');
  $user_profile_ui_template=create_list_cards(['user_profile_ui'=>['{{profile_pic}}:{{{photo}}}','{{profile_title}}:{{{project_name}}}']], '988');
  $plain_profile_ui_template=create_list_cards(['plain_profile_ui'=>['{{profile_title}}:Transaction Profile - {{{trx_remark}}}']], '988');
  $account_profile_ui_template=create_list_cards(['plain_profile_ui'=>['{{profile_title}}:Account - {{{name}}}']], '988');
  $client_profile_ui_template=create_list_cards(['user_profile_ui'=>['{{profile_pic}}:{{{photo}}}','{{{profile_title}}}:Voter Profile - {{{full_name}}}']], '988');

  $custom_profile_ui=['growth_manifest'=>$user_profile_ui_template,'transactions'=>$plain_profile_ui_template,'accounts'=>$account_profile_ui_template, 'blog_authors'=>$user_profile_ui_template, 'voters'=>$client_profile_ui_template];

}
?>