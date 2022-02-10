export const BASE_URL               = process.env.REACT_APP_BASEURL;
export const TEMPLATE_URL           = BASE_URL + "asset/template/";
export const REPORT_URL             = BASE_URL + "asset/report/";
export const WEB_BASE_NAME          = " | IP  Manager";

export const LOGIN                  = BASE_URL + 'login';

/*      OBJECT API URL       */
const OBJECT_URL                    = BASE_URL + 'obj/';
export const LIST_OBJECT            = OBJECT_URL + 'list';
export const GET_PRO_BY_OBJ_ID      = OBJECT_URL + 'get_object_info';
export const UPDATE_PRO_VALUE       = OBJECT_URL + 'update_property';


/*      OBJECT TYPE API URL    */
const OBJECT_TYPE_URL               = BASE_URL + 'obj_type/';
export const LIST_OBJ_TYPE          = OBJECT_TYPE_URL + 'list';


/*      Rules API URL   */
const RULES_URL                     = BASE_URL + 'rules/';
export const LIST_RULES             = RULES_URL + 'list';
export const ADD_RULE               = RULES_URL + 'add_new_rule';
export const RULE_INFO              = RULES_URL + 'get_rule_info';