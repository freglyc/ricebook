// REDUX SET ACTIONS
import {
    RESET, SET_ARTICLES, SET_AVATAR,
    SET_BIRTH,
    SET_DISPLAY,
    SET_EMAIL,
    SET_FOLLOWING, SET_PHONE,
    SET_STATUS,
    SET_USERNAME, SET_ZIP,
    ADD_ARTICLES
} from "../constants/action-types";

export function localReset() {
    return { type: RESET }
}
export function setUsername(payload) {
    return { type: SET_USERNAME, payload }
}
export function setDisplay(payload) {
    return { type: SET_DISPLAY, payload }
}
export function setStatus(payload) {
    return { type: SET_STATUS, payload }
}
export function setFollowing(payload) {
    return { type: SET_FOLLOWING, payload }
}
export function setBirth(payload) {
    return { type: SET_BIRTH, payload }
}
export function setEmail(payload) {
    return { type: SET_EMAIL, payload }
}
export function setPhone(payload) {
    return { type: SET_PHONE, payload }
}
export function setZip(payload) {
    return { type: SET_ZIP, payload }
}
export function setAvatar(payload) {
    return { type: SET_AVATAR, payload }
}
export function setArticles(payload) {
    return {type: SET_ARTICLES, payload}
}
export function addArticles(payload) {
    return {type: ADD_ARTICLES, payload}
}