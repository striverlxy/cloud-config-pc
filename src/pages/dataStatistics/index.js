import React, { useEffect } from 'react'
import { Row, Col, Card, Statistic, Space, Select, DatePicker, Button } from 'antd'
import { Chart } from '@antv/g2';
import QQMap from 'qqmap';

const { Option } = Select
const { RangePicker } = DatePicker;

const borderRadius = { borderRadius: 4 }

const DataStatistics = () => {


    const chart_1_init = () => {
        const data = [
            { year: '1991', value: 3 },
            { year: '1992', value: 4 },
            { year: '1993', value: 3.5 },
            { year: '1994', value: 5 },
            { year: '1995', value: 4.9 },
            { year: '1996', value: 6 },
            { year: '1997', value: 7 },
            { year: '1998', value: 9 },
            { year: '1999', value: 13 },
        ];
        const chart = new Chart({
            container: 'container_1',
            autoFit: true,
            height: 500,
        });
        
        chart.data(data);
        chart.scale({
            year: {
                range: [0, 1],
            },
            value: {
                min: 0,
                nice: true,
            },
        });
        
        chart.tooltip({
        showCrosshairs: true, // 展示 Tooltip 辅助线
        shared: true,
        });
        
        chart.line().position('year*value').label('value');
        chart.point().position('year*value');
        
        chart.render();
    }

    const chart_2_init = () => {
        const data = [
            { year: '2001', population: 41.8 },
            { year: '2002', population: 38 },
            { year: '2003', population: 33.7 },
            { year: '2004', population: 30.7 },
            { year: '2005', population: 25.8 },
            { year: '2006', population: 31.7 },
            { year: '2007', population: 33 },
            { year: '2008', population: 46 },
            { year: '2009', population: 38.3 },
            { year: '2010', population: 28 },
            { year: '2011', population: 42.5 },
            { year: '2012', population: 30.3 },
          ];
          
          const chart = new Chart({
            container: 'container_2',
            autoFit: true,
            height: 500,
          });
          chart.data(data);
          chart.coordinate('polar');
          chart.legend('year', {
            position: 'right',
          });
          chart.axis(false);
          chart.tooltip({
            showMarkers: false
          });
          chart.interaction('element-highlight');
          chart
            .interval()
            .position('year*population')
            .color('year')
            .style({
              lineWidth: 1,
              stroke: '#fff',
            });
          chart.render();
    }

    const chart_3_init = () => {
        const data = [
            { year: '1951 年', sales: 38 },
            { year: '1952 年', sales: 52 },
            { year: '1956 年', sales: 61 },
            { year: '1957 年', sales: 145 },
            { year: '1958 年', sales: 48 },
            { year: '1959 年', sales: 38 },
            { year: '1960 年', sales: 38 },
            { year: '1962 年', sales: 38 },
          ];
          const chart = new Chart({
            container: 'container_3',
            autoFit: true,
            height: 500,
          });
          
          chart.data(data);
          chart.scale('sales', {
            nice: true,
          });
          
          chart.tooltip({
            showMarkers: false
          });
          chart.interaction('active-region');
          
          chart.interval().position('year*sales');
          
          chart.render();
    }

    const chart_4_init = () => {
        initQQMap()
    }

    const initQQMap = () => {
        //初始化地图
        QQMap.init('O7GBZ-P7GKX-DBT4Q-7CFKN-JL2NJ-NWBG2', async () => {

            let curLat = 31.988441;
            let curLng = 118.736153;
            let myLatlng = new QQMap.LatLng(curLat, curLng);
            // 设置地图属性
            let myOptions = {
                zoom: 16,
                center: myLatlng,
                mapTypeId: QQMap.MapTypeId.ROADMAP,
            };
            // 创建地图，绑定dom
            let map = new QQMap.Map(
                document.getElementById('container_4'),
                myOptions,
            );

            let marker = new QQMap.Marker({
                position: myLatlng,
                map: map,
            })

            QQMap.event.addListener(map, 'click', event => {
                marker.position = event.latLng
                marker.setMap(null);
                marker = new QQMap.Marker({
                    position: event.latLng,
                    map: map,
                });
            })
        });  
    }

    const data_init = () => {

    }

    useEffect( () => {
        data_init()
        chart_1_init()
        chart_2_init()
        chart_3_init()
        chart_4_init()
    }, [])

    return (
        <div>
            <Space style={{width: '100%', marginBottom: '30px'}} size={30} direction="vertical">
                <Row justify="space-between" style={{marginTop: '17px'}}>
                    <Col span={4}>
                        <Card>
                            <Statistic
                                title="发行总价值(元)"
                                value={134234.11}
                                precision={2}
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card>
                            <Statistic
                                title="发行总数(瓶)"
                                value={110000}
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card>
                            <Statistic
                                title="总销售量(瓶)"
                                value={93254}
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card>
                            <Statistic
                                title="消费者"
                                value={2354}
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card>
                            <Statistic
                                title="门店(家)"
                                value={1978}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row justify="space-between" gutter={32}>
                    <Col span={12}>
                        <Card 
                            title="销售趋势"
                            extra={
                                <Space>
                                    <Select
                                        size="middle"
                                        style={borderRadius}
                                        placeholder="请选择商品"
                                        allowClear 
                                    >
                                        <Option value="jack">天之蓝</Option>
                                        <Option value="lucy">梦之蓝</Option>  
                                    </Select>
                                    <RangePicker style={borderRadius} size="middle" showTime={false} />
                                </Space>
                            }
                        >
                            <div id="container_1"></div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            title="销售统计"
                            extra={
                                <Space>
                                    <Select
                                        size="middle"
                                        style={borderRadius}
                                        placeholder="请选择统计类型"
                                        allowClear 
                                    >
                                        <Option value="jack">交易额</Option>
                                        <Option value="lucy">销售量</Option>  
                                    </Select>
                                    <RangePicker style={borderRadius} size="middle" showTime={false} />
                                </Space>
                            }
                        >
                            <div id="container_2"></div>
                        </Card>
                    </Col>
                </Row>
                <Row justify="space-between" gutter={32}>
                    <Col span={12}>
                        <Card
                            title="区域总销量"
                            extra={
                                <Space>
                                    <Select
                                        size="middle"
                                        style={borderRadius}
                                        placeholder="请选择商品"
                                        allowClear 
                                    >
                                        <Option value="jack">天之蓝</Option>
                                        <Option value="lucy">梦之蓝</Option>  
                                    </Select>
                                    <Select
                                        size="middle"
                                        style={borderRadius}
                                        placeholder="请选择省"
                                        allowClear 
                                    >
                                        <Option value="jack">江苏省</Option>
                                        <Option value="lucy">河南省</Option>  
                                    </Select>
                                    <Select
                                        size="middle"
                                        style={borderRadius}
                                        placeholder="请选择市"
                                        allowClear 
                                    >
                                        <Option value="jack">南京市</Option>
                                        <Option value="lucy">镇江市</Option>  
                                    </Select>
                                </Space>
                            }
                        >
                            <div id="container_3"></div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card 
                            title="门店分布"
                            extra={
                                <Space>
                                    {/* 下面的按钮市凑数的，没有实际用途，不加的，卡片部分样式会不一致 */}
                                    <Button ghost></Button>
                                </Space>
                            }
                        >
                            <div id="container_4" style={{width: '100%', height: '500px'}}></div>
                        </Card>
                    </Col>
                </Row>
            </Space>
            
        </div>
    )
}

export default DataStatistics;