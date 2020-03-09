import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getCurrentProfile, deleteAccount } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import DashboarActions from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";

const Dashboard = ({
    getCurrentProfile,
    deleteAccount,
    auth: { user },
    profile: { profile, loading }
}) => {
    useEffect(() => {
        // adding timeout because of react-transition-group's bugs
        setTimeout(() => {
            getCurrentProfile();
        }, 100);
    }, []); // eslint-disable-line

    return loading && profile === null ? (
        <Spinner />
    ) : (
        <>
            <h1 className="large text-primary my-1">Dashboard</h1>
            <p className="lead my-1">
                <i className="fas fa-user"></i> Welcome, {user && user.name}.
            </p>
            {profile !== null ? (
                <>
                    <DashboarActions />
                    <Experience experience={profile.experience} />
                    <Education education={profile.education} />

                    <div className="my-2">
                        <button
                            className="btn btn-danger"
                            onClick={e => deleteAccount()}
                        >
                            <i className="fas fa-user-minus"></i> Delete My
                            Account
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p>
                        You have not yet setup a profile, please add some info.
                    </p>
                    <Link to="/create-profile" className="btn btn-primary my-1">
                        Create Profile
                    </Link>
                </>
            )}
        </>
    );
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
    Dashboard
);
