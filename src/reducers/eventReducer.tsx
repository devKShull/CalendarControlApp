
import { CalendarEventWritable } from "../CalendarModule";
import * as ActionTypeConst from "./ActionTypeConst"


const init: CalendarEventWritable = {
    allDay: false,
    skipAndroidTimezone: true,
    description: "null",
}

const eventReducer = (state = init, action: { type: string, data: any }) => {

    //eventData 지정을 위한 리듀서
    switch (action.type) {
        case ActionTypeConst.CALENDAR_ID: //일정을 저장할 캘린더 ID
            return { ...state, calendarId: action.data };
        case ActionTypeConst.START_DATE: //일정 시작시간
            return { ...state, startDate: action.data };
        case ActionTypeConst.END_DATE: //일정 종료시간
            return { ...state, endDate: action.data };
        case ActionTypeConst.IS_ALL_DAY: //일정이 하루종일인가?
            return { ...state, allDay: action.data };
        case ActionTypeConst.DESCRIPTION: //일정 설명
            return { ...state, description: action.data };
        case ActionTypeConst.RECURRENCE: //일정 반복 == recurrenceRule 의 frequency와 같음
            return { ...state, recurrence: action.data };
        case ActionTypeConst.ALARMS: //일정 알림
            return { ...state, alarms: action.data };
        case ActionTypeConst.ALL_EVENT_DATA: //일정 전체 데이터 설정
            return action.data;
        case ActionTypeConst.DATE: //일정 시작,종료시간 동시설정
            return { ...state, startDate: action.data, endDate: action.data };
        //아래는 recurrenceRule
        case ActionTypeConst.RECURRENCE_RULE_DURATION: //안드로이드의 endDate를 대신함 일정지속시간
            return { ...state, recurrenceRule: { ...state.recurrenceRule, duration: action.data } };
        case ActionTypeConst.RECURRENCE_RULE_FREQUENCY: //반복 종류 weekly daily monthly등
            return { ...state, recurrenceRule: { ...state.recurrenceRule, frequency: action.data } };
        case ActionTypeConst.RECURRENCE_RULE_INTERVAL: //반복 간격
            return { ...state, recurrenceRule: { ...state.recurrenceRule, interval: action.data } };
        case ActionTypeConst.RECURRENCE_RULE_OCCURRENCE: //반복 횟수
            return { ...state, recurrenceRule: { ...state.recurrenceRule, occurrence: action.data } };
        case ActionTypeConst.RECURRENCE_RULE_END_DATE: //반복 종료 날짜
            return { ...state, recurrenceRule: { ...state.recurrenceRule, endDate: action.data } };
        case ActionTypeConst.RECURRENCE_RULE_DAYS_OF_WEEK:
            return { ...state, recurrenceRule: { ...state.recurrenceRule, daysOfWeek: action.data } };
        //frequency 가 weekly 일때 월간반복중 요일 선택 ["MO","TU"] => 매주 월요일 화요일
        //frequency 가 monthly 일때 weekPositionInMonth와 함께 사용가능 ["3TU"] => 매달 3번째 화요일
        case ActionTypeConst.RECURRENCE_RULE_WEEK_POSITION_IN_MONTH: //frequency가 monthly 일경우 월간 반복 중 몇번째 주?
            return { ...state, recurrenceRule: { ...state.recurrenceRule, weekPositionInMonth: action.data } };
        case ActionTypeConst.RECURRENCE_RULE_MONTH_POSITION_IN_MONTH: //frequency가 yearly 일경우 년간 반복 중 몇번째 달?
            return { ...state, recurrenceRule: { ...state.recurrenceRule, monthPositionInMonth: action.data } };
        case ActionTypeConst.CLEAR_EVENT:
            return init;
        default:
            return { ...state };
    }
};

export default eventReducer;