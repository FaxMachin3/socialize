import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PostItem from "../posts/PostItem";
import Spinner from "../layout/Spinner";
import CommentFrom from "./CommentFrom";
import CommentItem from "./CommentItem";
import { getPost } from "../../actions/post";

const Post = ({ getPost, post: { post, loading }, match }) => {
    useEffect(() => {
        getPost(match.params.id);
    }, []); // eslint-disable-line

    return loading || post === null ? (
        <Spinner />
    ) : (
        <>
            <Link to="/posts" className="btn my-1">
                Back To Posts
            </Link>
            <PostItem post={post} showActions={false} />
            <CommentFrom postID={post._id} />
            <div className="comments">
                {post.comments.map(comment => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        postID={post._id}
                    />
                ))}
            </div>
        </>
    );
};

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, { getPost })(Post);
