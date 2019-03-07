import React, { Component } from 'react';
import {Button, Card, Header, Image, Segment} from 'semantic-ui-react'
import Layout from '../components/Layout';
import web3 from '../ethereum/web3';
import { Link } from '../routes';
require('dotenv').config({ path: '../.env'});
require('es6-promise').polyfill();
require('isomorphic-fetch');

class UserProfile extends Component {
    state = {
        colors: ['red', 'orange', 'yellow', 'green', 'teal', 'violet', 'pink']
    }
    static async getInitialProps () {
        const accounts = await web3.eth.getAccounts();
        // URL with an address for example (owns CryptoKitties):
        const url = 'https://public.api.cryptokitties.co/v1/kitties?owner_wallet_address=0xc147FC4Af048b8f9CE9E1296468dF9417938629b';
        const urlR = 'https://public.api.cryptokitties.co/v1/kitties?owner_wallet_address=' + accounts[0];

        const userAccount = accounts[0];

        /** Get the CryptoKitties of the current user.
         To get an account that has CryptoKitties use url instead of urlR **/
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                'x-api-token': process.env.API_TOKEN
            }
        }).then(res => res.json());

        const userCats = response.kitties;
        return { userCats, userAccount }
    }

    renderCats(){
        if(this.props.userCats !== undefined && this.props.userCats.length ===  0){
            return (
                <Segment placeholder>
                    <Header icon>
                        You don't own any CryptoKitties
                    </Header>
                    <a href="https://www.cryptokitties.co">
                        <Button content="cryptokitties.co" primary />
                    </a>
                </Segment>
            );
        }
        else {
            return this.props.userCats.map((cat, index) => {
                return (
                    <Link key={index} route={`/kitties/${cat.id}`}>
                        <Card raised color={this.state.colors[index%this.state.colors.length]}>
                            <Image src={cat.image_url_png} />
                            <Card.Content>
                                <Card.Header>{cat.name}</Card.Header>
                                <Card.Meta>
                                    <span className='date'>Generation {cat.generation}</span>
                                </Card.Meta>
                                <Card.Description>{cat.bio.replace('#{name}', cat.name)}</Card.Description>
                            </Card.Content>
                        </Card>
                    </Link>);
            });
        }
    }

    render() {
        return (
            <Layout>
                <Header as='h2' textAlign='center'>
                    {this.props.userAccount} Profile
                </Header>
                <Card.Group centered style={{ marginTop: '10px' }}>
                    {this.renderCats()}
                </Card.Group>
            </Layout>
        );
    }
}

export default UserProfile;