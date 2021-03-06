import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { push } from 'react-router-redux'

import { loadCalculationNotebooks } from '../redux/ducks/calculations'
import Notebooks from '../components/notebooks'
import selectors from '../redux/selectors'

class CalculationNotebooksContainer extends Component {

  componentDidMount() {
    this.props.dispatch(loadCalculationNotebooks(this.props.calculationId));
  }

  onCellClick = (row) => {
    const notebookId = this.props.notebooks[row]['_id'];
    this.props.dispatch(push(`/notebooks/${notebookId}`))
  }

  render() {
    return <Notebooks notebooks={this.props.notebooks} onCellClick={(row) => this.onCellClick(row)} />;
  }
}

CalculationNotebooksContainer.propTypes = {
  calculationId: PropTypes.string,
  notebooks: PropTypes.array,
}

CalculationNotebooksContainer.defaultProps = {
  calculationId: null,
  notebooks: [],
}

function mapStateToProps(state, ownProps) {
  const props = { };

  if (!_.isNil(ownProps.calculationId)) {
    const notebooks = selectors.calculations.getNotebooks(state, ownProps.calculationId);
    if (!_.isNil(notebooks)) {
      props.notebooks = notebooks;
    }
  }
  return props;
}

export default connect(mapStateToProps)(CalculationNotebooksContainer)
