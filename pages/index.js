import React, { Component } from 'react';
import { Feed, Button, Header } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Post from '../ethereum/post'; // Capital P because we create a variable called post in the code. This is not a c'tor!
import Layout from '../components/Layout';
import {Link, Router} from '../routes'
import PostRow from '../components/PostRow';
import web3 from '../ethereum/web3'
require('es6-promise').polyfill();
require('isomorphic-fetch');

class FeedIndex extends Component {
    static async getInitialProps () {
        const accounts = await web3.eth.getAccounts();
        // Retrieve an array of all our deployed posts addresses.
        const deployedPosts = await factory.methods.getDeployedPosts().call();
        const deployedPostsCount = deployedPosts.length;
        // Return 10 posts or less
        const displayCount = (deployedPostsCount >= 10) ? 10 : deployedPostsCount;
        let posts = [];
        let summaries = [];
        let counter = deployedPostsCount-1;

        // Get the last 10 posts:
        for ( let i=0; i<displayCount; i++ ){
            posts[i] = Post(deployedPosts[counter]);
            summaries[i] = await posts[i].methods.getSummary().call();

            // ** Add data from CK API to the summaries **

            // Get data from CK API:
            let url = 'https://public.api.cryptokitties.co/v1/kitties/' + summaries[i][5];
            let response = await fetch(url, {
                headers: {
                    'x-api-token': process.env.API_TOKEN
                }
            }).then(res => res.json());

            // Set the data as a part of the object that is sent to PostRow
            summaries[i][7] = response.name;
            summaries[i][8] = response.image_url;
            summaries[i][9] = counter;
            counter--;
            summaries[i][10] = await posts[i].methods.likes(accounts[0]).call();
        }

        return { summaries, posts, deployedPosts };
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

    renderPosts(){
        const postsDeployed = this.props.summaries;

        return postsDeployed.map((summary, index) => {
            return <PostRow
                key={index}
                summary={summary}
                onClick={() => this.handleClick(summary[9])}
            />;
        });
    }

    render() {
        return (
            <Layout>
                <div>
                    <Header as='h2' textAlign='center'>
                        Feed
                    </Header>
                    <Link route="/new">
                        <a>
                            <Button floated="right" content="New Post" icon="add circle" primary />
                        </a>
                    </Link>
                    <Feed size="large">
                        {this.renderPosts()}
                    </Feed>
                </div>
            </Layout>
        );
    }
}

export default FeedIndex;