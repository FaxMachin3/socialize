import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfileByID } from "../../actions/profile";

const Profile = ({ profile: { profile, loading }, auth, match }) => {
    useEffect(() => {
        console.log("ue")
        getProfileByID(match.params.id);
        // eslint-disable-next-line
    }, []);

    return <div>profile</div>;
};

Profile.propTypes = {
    getProfileByID: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, { getProfileByID })(Profile);
