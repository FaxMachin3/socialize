import axios from "axios";
import { setAlert } from "./alert";
import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POSTS,
    ADD_POSTS,
    GET_POST,
    ADD_COMMENT,
    REMOVE_COMMENT
} from "./types";

// get posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get("/api/posts");

        dispatch({
            type: GET_POSTS,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
};

// get post
export const getPost = id => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`);

        dispatch({
            type: GET_POST,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
};

// add like
export const addLike = id => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data }
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
};

// remove like
export const removeLike = id => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data }
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
};

// delete post
export const deletePost = id => async dispatch => {
    try {
        await axios.delete(`/api/posts/${id}`);

        dispatch({
            type: DELETE_POSTS,
            payload: id
        });

        dispatch(setAlert("Post removed.", "success"));
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
};

// add post
export const addPost = formData => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        const res = await axios.post(`/api/posts/`, formData, config);

        dispatch({
            type: ADD_POSTS,
            payload: res.data
        });

        dispatch(setAlert("Post created.", "success"));
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
};

// add comment
export const addComment = (postID, formData) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        const res = await axios.post(
            `/api/posts/comment/${postID}`,
            formData,
            config
        );

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        });

        dispatch(setAlert("Comment added.", "success"));
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
};

// delete comment
export const deleteComment = (postID, commentID) => async dispatch => {
    try {
        await axios.delete(`/api/posts/comment/${postID}/${commentID}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentID
        });

        dispatch(setAlert("Comment removed.", "success"));
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
};
