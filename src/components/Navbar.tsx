import { useState, useEffect } from 'react'
import { Button, Menu, Typography, Avatar } from 'antd'
import { Link } from 'react-router-dom'
import {
    HomeOutlined,
    MoneyCollectOutlined,
    BulbOutlined,
    FundOutlined,
    MenuOutlined,
} from '@ant-design/icons'

import icon from '../assets/images/icon.png'

function Navbar() {
    const [activeMenu, setActiveMenu] = useState(true)
    const [screenSize, setScreenSize] = useState(window.innerWidth)


    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth)

        window.addEventListener('resize', handleResize)

        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (screenSize < 768) {
            setActiveMenu(false)
        } else {
            setActiveMenu(true)
        }
    }, [screenSize])

    return (
        <div className='nav-container'>
            <div className='logo-container'>
                <Avatar
                    src={icon}
                    size='large'
                    shape='square'
                />
                <Typography.Title
                    level={2}
                    className='logo'>
                    <Link to='/'>Cryptoverse</Link>
                </Typography.Title>
                <Button className='menu-control-container' onClick={() => setActiveMenu(!activeMenu)}>
                    <MenuOutlined />
                </Button>
            </div>
            {/* TODO: refactor base on this link: https://stackoverflow.com/questions/76549798/warning-antd-menu-children-will-be-removed-in-next-major-version-please-u */}
            {activeMenu &&
                <Menu
                    theme='dark'
                    expandIcon={<MenuOutlined />}>
                    <Menu.Item icon={<HomeOutlined />}>
                        <Link to='/'>Home</Link>
                    </Menu.Item>
                    <Menu.Item icon={<FundOutlined />}>
                        <Link to='/cryptocurrencies'>Cryptocurrencies</Link>
                    </Menu.Item>
                    <Menu.Item icon={<BulbOutlined />}>
                        <Link to='/news'>News</Link>
                    </Menu.Item>
                    <Menu.Item icon={<MoneyCollectOutlined />}>
                        <Link to='/exchanges'>Exchanges</Link>
                    </Menu.Item>
                </Menu>
            }
        </div>
    )
}

export default Navbar
