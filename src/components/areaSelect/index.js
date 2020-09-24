import React from 'react'
import { Cascader } from 'antd';
import httpUtils from '../../utils/request'

export default class AreaSelect extends React.Component {
  state = {
    options: []
  };

  async componentWillMount() {
      let resp = await httpUtils.post('/geo-service/china/province/list')
      if (resp) {
        let options = resp.map(r => {
            return {
                value: r.province_no,
                label: r.province,
                labelType: 'province',
                isLeaf: false
            }
        })
        this.setState({options: options})
      }
  }

  onChange = (value, selectedOptions) => {
    // console.log(value, selectedOptions);
    if (selectedOptions.length == 3) {
        this.props.saveArea(selectedOptions)
    }
  };

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    let options = []
    if (targetOption.labelType == 'province') {
        let data = {
            provinceNo: targetOption.value
        }
        let resp = await httpUtils.post('/geo-service/china/city/list', data)
        options = resp.map(r => {
            return {
                value: r.city_no,
                label: r.city,
                labelType: 'city',
                isLeaf: false
            }
        })
    } else if (targetOption.labelType == 'city') {
        let data = {
            cityNo: targetOption.value
        }
        let resp = await httpUtils.post('/geo-service/china/region/list', data)
        options = resp.map(r => {
            return {
                value: r.region_no,
                label: r.region,
                labelType: 'region'
            }
        })
    }

    targetOption.children = options
    targetOption.loading = false;
    this.setState({
        options: [...this.state.options],
    });
  };

  render() {
    return (
      <Cascader
        style={this.props.style}
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
      />
    );
  }
}
