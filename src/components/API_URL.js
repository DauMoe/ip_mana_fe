export const BASE_URL               = process.env.REACT_APP_BASEURL;
export const TEMPLATE_URL           = BASE_URL + "asset/template/";
export const REPORT_URL             = BASE_URL + "asset/report/";
export const WEB_BASE_NAME          = " | IP  Manager";;

/*      OBJECT API URL       */
const OBJECT_URL                    = BASE_URL + 'obj/';
export const LIST_OBJECT            = OBJECT_URL + 'list';
export const GET_PRO_BY_OBJ_ID      = OBJECT_URL + 'get_object_info';
export const UPDATE_PRO_VALUE       = OBJECT_URL + 'update_property';
export const DELETE_OBJECT          = OBJECT_URL + 'delete';
export const INSERT_OBJECT          = OBJECT_URL + 'insert';
export const GET_TEMPLATE           = OBJECT_URL + 'get_excel_template';
export const INSERT_OBJECT_EXCEL    = OBJECT_URL + 'insert_object_excel';
export const EXPORT_DATA            = OBJECT_URL + 'export_data';
export const SEARCH_OBJECT          = OBJECT_URL + 'search';

/*      OBJECT TYPE API URL    */
const OBJECT_TYPE_URL               = BASE_URL + 'obj_type/';
export const LIST_OBJ_TYPE          = OBJECT_TYPE_URL + 'list';

/*      PROPERTY API URL    */
const PROPERTY_URL                  = BASE_URL + 'pro/';
export const LIST_PROPERTY          = PROPERTY_URL + 'list';
export const GET_PRO_INFO           = PROPERTY_URL + 'get_pro_info';
export const UPDATE_PROPERTY        = PROPERTY_URL + 'update';
export const INSERT_PROPERTY        = PROPERTY_URL + 'insert';
export const DELETE_PROPERTY        = PROPERTY_URL + 'delete';
export const GET_LIST_PRO_BY_OBJ_ID = PROPERTY_URL + 'get_list_pro_by_obj_id';
export const ADD_PRO_TO_OBJECT      = PROPERTY_URL + 'add_property_to_object';

/*      Rules API URL   */
const RULES_URL                     = BASE_URL + 'rules/';
export const LIST_RULES             = RULES_URL + 'list';
export const INSERT_RULE            = RULES_URL + 'insert';
export const RULE_INFO              = RULES_URL + 'get_rule_info';
export const DELETE_RULE            = RULES_URL + 'delete';
export const UPDATE_RULE            = RULES_URL + 'update';
export const SEARCH_RULE            = RULES_URL + 'search';

/*      User API URL   */
const USER_URL                     = BASE_URL + 'user/';
export const LOGIN                 = USER_URL + 'login';
export const LOGOUT                = USER_URL + 'logout';
export const LIST_USERS            = USER_URL + 'list';
export const UPDATE_USERS          = USER_URL + 'update';
export const DELETE_USERS          = USER_URL + 'delete';
export const GET_USER_INFO         = USER_URL + 'get_user_info';
export const CREATE_USER           = USER_URL + 'create';