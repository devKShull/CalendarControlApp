import { WEEK, WEEK_ACTION, CLEAR_WEEk } from "./ActionTypeConst";

const weekReducer = (state = [], action: { type: WEEK_ACTION, data: WEEK }) => {
    switch (action.type) {
        case "add":
            return add(state, action.data);
        case "sub":
            return sub(state, action.data);
        case CLEAR_WEEk:
            return [];
        default:
            return state;
    }
}

const add = (state: string[], data: WEEK) => {
    return [...state, data]
}
const sub = (state: string[], data: WEEK) => {
    const res = state.filter((v) => { return v !== data })
    return res
}

export default weekReducer