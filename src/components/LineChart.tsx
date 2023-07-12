import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables);
import { Col, Row, Typography } from 'antd'

import { CryptoHistory } from './CryptoDetails'
import moment from 'moment';

const { Title } = Typography

interface LineChartProps { coinName: string; currentPrice: string; coinHistory: CryptoHistory }

const LineChart = ({ coinName, currentPrice, coinHistory }: LineChartProps) => {
    const coinPrice = coinHistory?.history?.map(({ price }) => parseFloat(price)).reverse() ?? ['0']
    const coinTimestamp = coinHistory?.history?.map(({ timestamp }) => moment.unix(timestamp).format('DD/MM/YYYY')).reverse() ?? ['0']

    const data = {
        labels: coinTimestamp,
        datasets: [
            {
                label: "Price In USD",
                data: coinPrice,
                fill: false,
                backgroundColor: '#0071bd',
                borderColor: '#0071bd'
            }
        ]
    }

    const options = {
        scales: {
            y: {
            }
        }
    }

    return (
        <>
            <Row className='chart-header'>
                <Title level={2} className='chart-title'>
                    {coinName} Price Chart
                </Title>
                <Col className='price-container'>
                    <Title level={5} className='price-change'>{coinHistory?.change}%</Title>
                    <Title level={5} className='current-price'>{coinName} Price: $ {currentPrice}</Title>
                </Col>
            </Row>
            <Line data={data} options={options}></Line>
        </>
    )
}

export default LineChart