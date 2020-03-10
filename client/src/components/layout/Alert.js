import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { v4 as uuid } from "uuid";

import { CSSTransition, TransitionGroup } from "react-transition-group";

const Alert = ({ alerts }) => {
    return (
        alerts !== null &&
        alerts.length > 0 && (
            <TransitionGroup component={null}>
                {alerts.map(alert => (
                    <CSSTransition key={uuid()} timeout={300} classNames="item">
                        <div
                            key={alert.id}
                            className={`alert alert-${alert.alertType}`}
                        >
                            {alert.msg}
                        </div>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        )
    );
};

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
