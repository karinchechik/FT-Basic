pragma solidity ^0.4.17;

contract PostFactory {
    address[] public deployedPosts;
    mapping(address => address[]) userPosts;
    mapping(uint => address[]) kittyPosts;
    uint public numberOfPosts = 0;

    function createPost(string postContent, uint postDay, uint postMonth, uint postYear, uint cryptoKittyID) public {
        address newPost = new Post(postContent, postDay, postMonth, postYear, cryptoKittyID, numberOfPosts, msg.sender);
        deployedPosts.push(newPost);
        userPosts[msg.sender].push(newPost);
        kittyPosts[cryptoKittyID].push(newPost);
        numberOfPosts += 1;
    }

    function getDeployedPosts() public view returns (address[]) {
        return deployedPosts;
    }

    function getUserPosts(address user) public view returns (address[]) {
        return userPosts[user];
    }

    function getKittyPosts(uint KittyID) public view returns (address[]) {
        return kittyPosts[KittyID];
    }

}

contract Post {
    address public manager;
    uint day;
    uint month;
    uint year;
    string content;
    mapping(address => bool) public likes;
    uint public likesCount;
    uint kittyID;
    uint postID;

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    function Post(string postContent, uint postDay, uint postMonth, uint postYear, uint cryptoKittyID, uint numberOfPosts, address creator) public {
        manager = creator;
        content = postContent;
        likesCount = 0;
        day = postDay;
        month = postMonth;
        year = postYear;
        kittyID = cryptoKittyID;
        postID = numberOfPosts;
    }

    function likePost() public {

        require(!likes[msg.sender]);

        likes[msg.sender] = true;
        likesCount++;
    }

    function getSummary() public view returns (string, uint, uint, uint, uint, uint, address) {
        return (
        content,
        day,
        month,
        year,
        likesCount,
        kittyID,
        manager
        );
    }
}