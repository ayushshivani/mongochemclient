import React from 'react';
import IconButton from 'material-ui/IconButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import {List, ListItem} from 'material-ui/List';
import Slider from 'material-ui/Slider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
require('font-awesome/css/font-awesome.css');
import PropTypes from 'prop-types';
import './menu.css'


export default class MoleculeMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      amplitude: 1,
      isoScale: 42,
    };

    if (props.isoValue) {
      this.state.isoValue = props.isoValue;
      this.state.isoScale = (props.isoValue * 2000) -1;
    }

    if (props.orbital) {
      this.state.orbital = props.orbital;
    }
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  handleAmplitudeSliderOnChange = (event, value) => {
    this.setState({amplitude: value});
  };

  handleAmplitudeSliderOnDragStop = (event) => {
    if (this.props.onAmplitude) {
      this.props.onAmplitude(this.state.amplitude);
    }
  };

  handleIsoScaleSliderOnChange = (event, value) => {
    this.setState({
      isoScale: value,
      isoValue: (this.state.isoScale + 1) / 2000.0,
    });
  };

  handleIsoScaleSliderOnDragStop = (event) => {
    if (this.props.onIsoScale) {
      this.props.onIsoScale(this.state.isoScale);
    }
  };

  handleOrbitalChanged = (event, index, value) => {
    this.setState({
      orbital: value
    })
    if (this.props.onOrbital) {
      this.props.onOrbital(value);
    }
  };

  render() {
    const orbitalMenuItems = [];

    if (this.props.orbitals) {
      let homo = null, lumo = null;
      for (let orbital of this.props.orbitals) {
        orbitalMenuItems.push(<MenuItem value={orbital.id} primaryText={orbital.label} />);
        if (orbital.label.indexOf('HOMO') !== -1) {
          homo = orbital.id;
        }
        if (orbital.label.indexOf('LUMO') !== -1) {
          lumo = orbital.id;
        }
      }
      if (homo &&
          lumo &&
          this.state.orbital &&
          !Number.isInteger(this.state.orbital)) {
        if (this.state.orbital.toLowerCase() === 'homo') {
          this.setState({
            orbital: homo
          });
        }
        else if (this.state.orbital.toLowerCase() === 'lumo') {
          this.setState({
            orbital: lumo
          });
        }
      }
    }

    const sliderStyle = {
      marginTop: 3,
      marginBottom: 3,
    }

    const popOverStyle = {
      'min-width': '200px',
    }

    return (
      <div>
       <IconButton iconClassName="fa fa-bars"  onTouchTap={this.handleTouchTap} />
        <Popover
          style={popOverStyle}
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}
        >
          <List>
            {this.props.animationControls && <ListItem>
              <p>
                <label className='oc-menu-label'>{'Animation Amplitude'}</label>
                <label>{this.state.amplitude}</label>
              </p>
              <Slider
                style={sliderStyle}
                min={1}
                max={5}
                step={1}
                value={this.state.amplitude}
                onChange={this.handleAmplitudeSliderOnChange}
                onDragStop={this.handleAmplitudeSliderOnDragStop}
              />
            </ListItem>}
            {this.props.orbitalControls && <ListItem >
              <p>
                <label className='oc-menu-label'>{'Isovalue'}</label>
                <label>{this.state.isoValue.toFixed(4)}</label>
              </p>
              <Slider
                sliderStyle={sliderStyle}
                min={0}
                max={100}
                step={1}
                value={this.state.isoScale}
                onChange={this.handleIsoScaleSliderOnChange}
                onDragStop={this.handleIsoScaleSliderOnDragStop}
              />
          </ListItem>}
          {this.props.orbitalControls && <ListItem>
              <SelectField
                floatingLabelText="Molecular orbital"
                value={this.state.orbital}
                onChange={this.handleOrbitalChanged}>
                {orbitalMenuItems}
              </SelectField>
            </ListItem>}
          </List>
        </Popover>
      </div>
    );
  }
}

MoleculeMenu.propTypes = {
  animationControls: PropTypes.boolean,
  orbitalControls: PropTypes.boolean,
  orbitals: PropTypes.array,
}

MoleculeMenu.defaultProps = {
  animationControls: false,
  orbitalControls: false,
  orbitals: null,
}
