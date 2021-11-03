import { CLOSE_SIDEBAR, OPEN_SIDEBAR, SELECT_ITEM } from './SideBarActionsDefinition';


const CLOSED = false;
const OPEN = true;
const initState = {
    is_open: OPEN,
    index: -1 //Index of current selected item
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

        case SELECT_ITEM:
            return {
                ...state,
                is_open: CLOSED,
                index: payload.index
            }
        default:
            return state;
    }
}

export default SideBarReducer;