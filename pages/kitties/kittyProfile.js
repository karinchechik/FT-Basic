import React, { Component } from 'react';
import {Image, Feed, Header, Button, Segment} from 'semantic-ui-react'
import Layout from '../../components/Layout';
import { Router, Link } from '../../routes';
import Post from '../../ethereum/post';
import factory from '../../ethereum/factory'; // with lower f because it is an instance of a factory
import PostRow from '../../components/PostRow';
import web3 from '../../ethereum/web3';
require('es6-promise').polyfill();
require('isomorphic-fetch');

class KittyProfile extends Component {
    static async getInitialProps(props){
        const accounts = await web3.eth.getAccounts();
        const kittyID = props.query.address;
        // Get the addresses of all the posts of the kitty selected
        const deployedPosts = await factory.methods.getKittyPosts(kittyID).call();
        const deployedPostsCount = deployedPosts.length;
        // Return 10 posts or less
        const displayCount = (deployedPostsCount >= 10) ? 10 : deployedPostsCount;
        let posts = [];
        let summaries = [];
        let counter = deployedPostsCount-1;

        /** Add data from CK API to the summaries **/
        // Get data from CK API:
        let url = 'https://public.api.cryptokitties.co/v1/kitties/' + kittyID;
        let response = await fetch(url, {
            headers: {
                'x-api-token': process.env.API_TOKEN
            }
        }).then(res => res.json());

        const kittyName = response.name;
        const kittyImg = response.image_url;

        // Get the last 10 posts:
        for ( let i=0; i<displayCount; i++ ){
            posts[i] = Post(deployedPosts[counter]);
            summaries[i] = await posts[i].methods.getSummary().call();

            // Set the data as a part of the object that is sent to PostRow
            summaries[i][7] = kittyName;
            summaries[i][8] = kittyImg;
            summaries[i][9] = counter;
            counter--;
            summaries[i][10] = await posts[i].methods.likes(accounts[0]).call();
        }

        return { summaries, kittyName, kittyImg, deployedPosts };
    }

    async handleClick(i) {
        const accounts = await web3.eth.getAccounts();
        let deployedPosts = this.props.deployedPosts;
        const postLiked = Post(deployedPosts[i]);

        try {
            // Like a post
            await postLiked.methods.likePost()
            .send({
                from: accounts[0]
            });

            Router.pushRoute('/'); // Automatic redirect the user.
        } catch (err) {
            //this.setState({ errorMessage: err.message });
            console.log('error:', err);
        }
    }

    renderPosts(numOfPosts){
        const postsDeployed = this.props.summaries;

        if(numOfPosts === 0){
            // Display a button to create new post
            return (
                <Segment placeholder>
                    <Header icon>
                        You don't have any posts
                    </Header>
                    <Link route="/new">
                        <a>
                            <Button content="New Post" icon="add circle" primary />
                        </a>
                    </Link>
                </Segment>);
        } else {
            return postsDeployed.map((summary, index) => {
                return <PostRow
                    key={index}
                    summary={summary}
                    onClick={() => this.handleClick(summary[9])}
                />;
            });
        }
    }

    render() {
        return (
            <Layout>
                <div>
                    <Image size='small' centered src={this.props.kittyImg} />
                    <Header as='h2' textAlign='center' style={{marginTop: '-15px'}}>
                        {this.props.kittyName}
                    </Header>
                    <Feed size="large">
                        {this.renderPosts(this.props.summaries.length)}
                    </Feed>
                </div>
            </Layout>
        );
    }
}

export default KittyProfile;