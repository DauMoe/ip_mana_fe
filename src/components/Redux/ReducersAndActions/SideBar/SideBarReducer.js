import { CLOSE_SIDEBAR, OPEN_SIDEBAR } from './ActionsDefinition';


const CLOSED = false;
const OPEN = true;
const initState = {
    is_open: CLOSED,
    current_index: -1 //Index of current selected item
};

const SideBarReducer = (state = initState, payload) => {
    let { type } =  payload;
    switch(type) {
        case OPEN_SIDEBAR:
            return {
                ...state,
                is_open: OPEN
            }

        case CLOSE_SIDEBAR:
            return {
                ...state,
                is_open: CLOSED
            }

        default:
            return state;
    }
}

export default SideBarReducer;