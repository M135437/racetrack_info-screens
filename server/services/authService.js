import ENV from "../config/env.js"
import EVENTS from "../../client/src/shared/events.js"

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export default function authProcess (io,socket) {
    socket.on(EVENTS.AUTH_ATTEMPT, async ({role, passcode}) => {
    if (role==="Receptionist" && passcode === ENV.ENV_VARIABLES.FRONTDESK_KEY) {
        socket.emit(EVENTS.AUTH_RESPONDED, {success: true})
        return;
    };
    if (role==="Safety Official" && passcode === ENV.ENV_VARIABLES.RACECONTROL_KEY) {
        socket.emit(EVENTS.AUTH_RESPONDED, {success: true})
        return;
    };
        if (role==="Lap Observer" && passcode === ENV.ENV_VARIABLES.LAPTRACKER_KEY) {
        socket.emit(EVENTS.AUTH_RESPONDED, {success: true})
        return;
    };
    await delay(500);
    socket.emit(EVENTS.AUTH_RESPONDED, {success: false})

    });
};