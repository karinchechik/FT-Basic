import web3 from './web3';
import Post from './build/Post.json';

export default (address) => {
    return new web3.eth.Contract(
        // The interface from the build/Post:
        JSON.parse(Post.interface),
        address
    );
};