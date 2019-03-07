import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return (
        <Menu style={{ marginTop: '10px' }}>
            <Link route="/"><a className="item">FurryTales</a></Link>
            <Menu.Menu position="right">
                <Link route="/userProfile"><a className="item">Profile</a></Link>
                <Link route="/new"><a className="item">+</a></Link>
            </Menu.Menu>
        </Menu>
    );
};