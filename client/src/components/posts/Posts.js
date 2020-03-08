import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { CSSTransition, TransitionGroup } from "react-transition-group";

import { getPosts } from "../../actions/post";
import Spinner from "../layout/Spinner";
import PostItem from "./PostItem";
import PostForm from "./PostForm";

const Posts = ({ getPosts, post: { posts, loading } }) => {
    useEffect(() => {
        getPosts();
    }, []); // eslint-disable-line

    return loading ? (
        <Spinner />
    ) : (
        <>
            <h1 className="large text-primary my-1">Posts</h1>
            <p className="lead my-1">
                <i className="fas fa-user"></i> Welcome to the community
            </p>
            <PostForm />
            <TransitionGroup className="posts">
                {posts.map(post => (
                    <CSSTransition
                        key={post._id}
                        timeout={300}
                        classNames="item"
                    >
                        <PostItem key={post._id} post={post} />
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </>
    );
};

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, { getPosts })(Posts);
