import React, { useEffect, useState } from 'react'
import { Select, Typography, Row, Col, Card, Avatar } from 'antd'
import moment from 'moment'

import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi'
import { useGetCryptosQuery } from '../services/cryptoApi'

import { Crypto } from './Cryptocurrencies'

const { Text, Title, Link } = Typography
const { Option } = Select

const demoImage =
    'http://coinrevolution.com/wp-content/uploads/2020/06/cryptonews.jpg'

interface NewsProps {
    simplified?: boolean
}

interface ImageObject {
    _type: string
    contentUrl?: string
    thumbnail?: ImageObject
    width?: number
    height?: number
}

interface Provider {
    _type: string
    name: string
    image: ImageObject
}

interface NewsArticle {
    _type: string
    name: string
    url: string
    image: ImageObject
    description: string
    provider: Provider[]
    datePublished: string
}

function News({ simplified }: NewsProps) {
    const [newsCategory, setNewsCategory] = useState('Cryptocurrency')
    const { data: cryptoNews, isFetching: cryptoNewsIsFetching } = useGetCryptoNewsQuery({ newsCategory, count: simplified ? 6 : 12 })
    const { data: cryptoList, isFetching: cryptoIsFetching } = useGetCryptosQuery(100)

    if (cryptoNewsIsFetching || cryptoIsFetching) return 'Loading...'

    return (
        <>
            <Row gutter={[24, 24]}>
                {!simplified && (
                    <Col span={24}>
                        {/* The `filterOption` attribute maybe gets the error TS2339
                        fix: https://github.com/ant-design/ant-design/issues/33643 */}
                        <Select<string, { value: string, children: string }>
                            showSearch
                            className='select-news'
                            placeholder='Select a Crypto'
                            optionFilterProp='children' // use children of `Option` components as options in the select box
                            filterOption={(searchInput, option) => {
                                return option!.children.toLowerCase().indexOf(searchInput.toLowerCase()) >= 0
                            }} // filter existing options based on the input typed in the search box
                            onChange={(selectedOption) => {
                                return setNewsCategory(selectedOption)
                            }} // change the displayed item based on the selected option
                        >
                            {/* Default option */}
                            <Option value="Cryptocurrency">Cryptocurrency</Option>

                            {/* Other options */}
                            {cryptoList.data.coins.map((currency: Crypto) => {
                                return (
                                    <Option value={currency.name} key={currency.uuid}>
                                        {currency.name}
                                    </Option>
                                )
                            })}
                        </Select>
                    </Col>
                )}
                {cryptoNews.value.map((news: NewsArticle, index: number) => (
                    <Col xs={24} sm={12} lg={8} key={index}>
                        <Link href={news.url} target='_blank' rel='noreferrer'>
                            <Card hoverable className='news-card'>
                                <div className='news-image-container'>
                                    <Title className='news-title' level={4}>{news.name}</Title>
                                    <img src={news?.image?.thumbnail?.contentUrl || demoImage} alt='news'
                                        style={{
                                            maxWidth: '200px',
                                            maxHeight: '100px',
                                        }}
                                    />
                                </div>
                                <p className='news-description'>
                                    {news.description.length > 100 ? `${news.description.substring(0, 100)}...` : news.description}
                                </p>
                                <div className='provider-container'>
                                    <div>
                                        <Avatar src={news?.provider[0].image?.thumbnail?.contentUrl || demoImage} />
                                        <Text className='provider-name'>{news.provider[0]?.name}</Text>
                                    </div>
                                    <Text>{moment(news.datePublished).startOf('s').fromNow()}</Text>
                                </div>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row >
        </>
    )
}

export default News
