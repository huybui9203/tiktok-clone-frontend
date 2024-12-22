import React from 'react';
import PropTypes from 'prop-types';
import './GlobalStyles.scss';

function GlobalStyles({ children }) {
    return (
        // React.Children.only(children); //chi nhan mot children
        children
    )
}

GlobalStyles.propTypes = {
    children: PropTypes.node.isRequired,
};
export default GlobalStyles;
