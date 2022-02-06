import {get, post} from "./api_helper"
import * as url from "./url_helper"

export const loginUser = ({username, password}) => post(url.LOGIN, { username, password });
export const submitTwoFA = ({ username, code, authIdentifier, isSMS }) => post(url.SUBMIT_2FA, { username, code, authIdentifier, isSMS });
export const getFeed = (username, password) => post(url.GET_POSTS, { username, password });
export const postHashtags = (postId, bodyObject) => post(url.POST_HASHTAGS.replace(':postId', postId), bodyObject);
