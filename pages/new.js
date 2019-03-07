import React, { Component } from 'react';
import { Form, Button, Input, Message, Dropdown, Header, Segment } from 'semantic-ui-react';
import Layout from '../components/Layout';
import factory from '../ethereum/factory'; // with lower f because it is an instance of a factory
import web3 from '../ethereum/web3';
import { Router } from '../routes';


require('dotenv').config({ path: '../.env'});
require('es6-promise').polyfill();
require('isomorphic-fetch');

class NewPost extends Component {
    state = {
        postContent: '',
        errorMessage: '',
        loading: false,
        cryptoKittyID: (this.props.userCats[0] !== undefined) ? this.props.cryptoKittiesID[0].value : {},
        userWallet: ''
    };

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
        let userCats = [];
        let cryptoKittiesID = [];

        if(response.kitties[0] !== undefined){
            userCats = response.kitties;
            cryptoKittiesID = userCats.map((cat) => {
                return {
                    text: cat.name,
                    value: cat.id,
                    image: { avatar: true, src: cat.image_url_png }
                }
            });
        } else {
            console.log('There are no CryptoKitties');
        }

        return { userCats, userAccount, accounts, cryptoKittiesID }
    }

    onSubmit = async event => {
        event.preventDefault(); // prevent default submission of the form to the backend (the browser does that automatically)

        this.setState({ loading: true, errorMessage: '' });

        let d = new Date();
        let month = d.getMonth()+1;

        try {
            // Create a new post
            await factory.methods
            .createPost(this.state.postContent, d.getDate(), month, d.getFullYear(), this.state.cryptoKittyID)
            .send({
                from: this.props.accounts[0]
            });

            Router.pushRoute('/'); // Automatic redirect the user.
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    render() {
        if ( this.props.userCats[0] !== undefined ){
            return (
                <Layout>
                    <Header as='h2' textAlign='center'>
                        Create a New Post
                    </Header>
                    <span>Post created by{' '}
                        <Dropdown
                            value={this.state.cryptoKittyID}
                            onChange={(event, data) => this.setState({ cryptoKittyID: data.value })}
                            inline
                            options={this.props.cryptoKittiesID}
                        />
                </span>
                    <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} style={{ marginTop: '10px' }}>
                        <Form.Field>
                            <label>Content</label>
                            <Input
                                value={this.state.postContent}
                                onChange={event => this.setState({ postContent: event.target.value })}
                                maxLength="200"
                                label={`${this.state.postContent.length}/200`}
                                labelPosition="right"
                            />
                        </Form.Field>
                        <Message error header="Oops!" content={this.state.errorMessage} />
                        <Button loading={this.state.loading} primary>Create!</Button>
                    </Form>
                </Layout>
            );
        } else {
            return (
                <Layout>
                    <Header as='h2' textAlign='center'>
                        Create a New Post
                    </Header>
                    <Segment placeholder>
                        <Header icon>
                            Go adopt a cat!
                        </Header>
                        <a href="https://www.cryptokitties.co">
                            <Button content="cryptokitties.co" primary />
                        </a>
                    </Segment>
                </Layout>
            );
        }

    }
}

export default NewPost;