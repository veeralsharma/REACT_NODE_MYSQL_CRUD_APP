import { Avatar, IconButton } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react'

import './Header.css'


function Header() {
    return (
        <div className="header-div">
            <div className="header-logo-div"><h2 className="header-logo-text">InterView Bit</h2></div>
            <div className="header-profile-div">
                <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv1vgdYWHDUkyYYYxV4RV78Q4AHDtagK2GRQ&usqp=CAU" className="header-profile-avatar" />
                <h2 className="header-profile-text">Veeral Sharma</h2>
                <IconButton><ExpandMoreIcon /></IconButton>
            </div>
        </div>
    )
}

export default Header
