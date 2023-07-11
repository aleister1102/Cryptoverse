import { useEffect, useState } from 'react'
import millify from 'millify'
import { Link } from 'react-router-dom'
import { Card, Row, Col, Image, Input } from 'antd'

import { useGetCryptosQuery } from '../services/cryptoApi'

export interface Crypto {
	uuid: string
	symbol: string
	name: string
	color: string
	iconUrl: string
	marketCap: string
	price: string
	listedAt: number
	tier: number
	change: string
	rank: number
}

type CryptocurrenciesProps = {
	simplified?: boolean
}

function Cryptocurrencies({ simplified }: CryptocurrenciesProps) {
	const count = simplified ? 12 : 100
	const { data: cryptoList, isFetching } = useGetCryptosQuery(count)
	const [cryptos, setCryptos] = useState([])
	const [searchTerm, setSearchTerm] = useState('')

	useEffect(() => {
		const filteredData = cryptoList?.data?.coins.filter((crypto: Crypto) =>
			crypto.name.toLowerCase().includes(searchTerm.toLowerCase()),
		)

		setCryptos(filteredData)
	}, [cryptoList, searchTerm])

	if (isFetching) return 'Loading...'

	return (
		<>
			<div className='search-crypto'>
				{!simplified && (
					<Input
						placeholder='Search Cryptocurrency'
						onChange={(e) => setSearchTerm(e.target.value)}
						size='large'
					/>
				)}
			</div>
			<Row gutter={[32, 32]} className='crypto-card-container'>
				{cryptos?.map((crypto: Crypto) => (
					<Col
						xs={24}
						sm={12}
						lg={6}
						className='crypto-card'
						key={crypto.uuid}
					>
						<Link to={`/crypto/${crypto.uuid}`}>
							<Card
								title={`${crypto.rank}. ${crypto.name}`}
								extra={
									<Image
										className='crypto-icon'
										src={crypto.iconUrl}
										width={40}
									/>
								}
								hoverable
							>
								<p>
									Price:{' '}
									{millify(Number.parseFloat(crypto.price))}
								</p>
								<p>
									Market Cap:{' '}
									{millify(Number.parseInt(crypto.marketCap))}
								</p>
								<p>
									Daily Change:{' '}
									{millify(Number.parseFloat(crypto.change))}
								</p>
							</Card>
						</Link>
					</Col>
				))}
			</Row>
		</>
	)
}

export default Cryptocurrencies
