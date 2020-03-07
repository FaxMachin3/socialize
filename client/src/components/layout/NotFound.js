import React from "react";

const NotFound = () => {
    return (
        <>
            <div className="not-found">
                <h1 className="x-large text-primary ">
                    <i className="fas fa-exclamation-triangle"></i> Page Not
                    Found!
                </h1>
                <p className="large my-3">Sorry, This page doesn't exists.</p>
            </div>
        </>
    );
};

export default NotFound;
