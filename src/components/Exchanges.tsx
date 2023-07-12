import { useEffect, useState } from 'react';
import millify from 'millify';
import axios, { AxiosError } from 'axios';

import { Collapse, Row, Col, Typography, Avatar } from 'antd';
import { useGetCryptosQuery } from '../services/cryptoApi';

import { CryptoDetails } from './CryptoDetails';
import { Loader } from '.';

const { Text } = Typography;
const { Panel } = Collapse;

type Exchange = Pick<CryptoDetails, 'uuid' | 'rank' | 'iconUrl' | 'name' | '24hVolume' | 'numberOfMarkets' | 'numberOfExchanges' | 'description'>;

async function fetchCryptoExchange(coinId: string) {
    const options = {
        method: 'GET',
        url: `https://coinranking1.p.rapidapi.com/coin/${coinId}`,
        params: {
            referenceCurrencyUuid: 'yhjMzLPhuIDl',
            timePeriod: '24h'
        },
        headers: {
            'X-RapidAPI-Key': '683e32143cmsh41a008e002a450bp164f2ejsnfb249f83544a',
            'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
        }
    };
    try {
        const response = await axios.request(options);
        const cryptoDetails: CryptoDetails = response?.data?.data?.coin
        const { uuid, rank, iconUrl, name, ['24hVolume']: volume, numberOfMarkets, numberOfExchanges, description } = cryptoDetails
        const exchange: Exchange = { uuid, rank, iconUrl, name, ['24hVolume']: volume, numberOfMarkets, numberOfExchanges, description }
        return exchange
    } catch (error) {
        if (error instanceof AxiosError)
            console.error(error?.response?.data);
    }
}

const Exchanges = () => {
    const { data: coinList, isFetching: coinListIsLoading } = useGetCryptosQuery(200);
    const coinIdList = coinList?.data?.coins?.map(({ uuid }: { uuid: string }) => uuid);

    const [exchangesList, setExchangesList] = useState<Exchange[]>([])
    const [coinIdRange, setCoinIdRange] = useState({ start: 0, end: 10 })
    const [limitedCoinIdList, setLimitedCoinIdList] = useState([])
    const [firstTimeLoading, setFirstTimeLoading] = useState(true)

    useEffect(() => {
        console.log("Current coin ID list: ", coinIdList)
        if (!coinIdList) return

        console.log("⚙️ Setting limited coin ID list")
        setTimeout(() => {
            setLimitedCoinIdList(coinIdList.slice(coinIdRange.start, coinIdRange.end))
        }, 2000) // Delay to prevent multiple calls
    }, [coinList])

    useEffect(() => {
        console.log("Current exchanges list: ", exchangesList)
        if (!coinIdList) return

        console.log("⚙️ Setting exchanges list")
        fetchCryptoExchanges()

        function fetchCryptoExchanges() {
            const exchangesPromises = Promise.all(limitedCoinIdList.map(async (coinId: string) => {
                return await fetchCryptoExchange(coinId)
            }))

            exchangesPromises.then((exchanges) => {
                exchanges.forEach((exchange) => {
                    if (exchange) {
                        // Add exchange to list if it is not duplicated
                        if (!exchangesList.find((existingExchange) => existingExchange.uuid === exchange.uuid))
                            setExchangesList((exchangesList) => [...exchangesList, exchange])
                    }
                })
            })
            setFirstTimeLoading(false)
        }
    }, [limitedCoinIdList])

    useEffect(() => {
        console.log("⚙️ Setting scroll event listener")
        window.addEventListener('scroll', handleScroll);

        function handleScroll() {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
            console.log('Fetch more list items!');

            // setTimeout(() => {
            // Increase id range to fetch
            console.log("⚙️ Increasing coin ID range ")
            setCoinIdRange((coinIdRange) => ({ start: coinIdRange.end, end: coinIdRange.end + 5 }))
            // }, 500) // Delay to prevent multiple calls
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        console.log("Current coin ID range: ", coinIdRange)
        if (!coinIdList) return

        console.log("⚙️ Updating limited coin ID list")
        setLimitedCoinIdList(coinIdList.slice(coinIdRange.start, coinIdRange.end))
    }, [coinIdRange])

    if (coinListIsLoading) return <Loader />
    if (firstTimeLoading) return <Loader />
    return (
        <>
            <Row>
                <Col span={6}>Coin</Col>
                <Col span={6}>24h Trade Volume</Col>
                <Col span={6}>Markets</Col>
                <Col span={6}>Exchanges</Col>
            </Row>
            <Row>
                {exchangesList && exchangesList.map((exchange: Exchange, index: number) => (
                    <Col span={24} key={index}>
                        <Collapse>
                            <Panel
                                key={exchange.uuid}
                                showArrow={false}
                                header={(
                                    <Row key={exchange.uuid} className=' h-16 flex items-center'>
                                        <Col span={6}>
                                            <Text><strong>{exchange.rank}.</strong></Text>
                                            <Avatar className="exchange-image" src={exchange.iconUrl} />
                                            <Text><strong>{exchange.name}</strong></Text>
                                        </Col>
                                        <Col span={6}>${millify(parseInt(exchange['24hVolume']))}</Col>
                                        <Col span={6}>{millify(exchange.numberOfMarkets)}</Col>
                                        <Col span={6}>{millify(exchange.numberOfExchanges)}%</Col>
                                    </Row>
                                )}
                            >
                                {exchange.description}
                            </Panel>
                        </Collapse>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default Exchanges;