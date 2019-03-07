import React, { Component } from 'react';
import { Feed, Icon } from 'semantic-ui-react';
import { Link } from '../routes';

class PostRow extends Component {
    render() {
        const { Event, Label, Content, Summary, Date, Meta, Like, Extra } = Feed;
        const { summary } = this.props;

        return (
            <Event>
                <Label image={summary[8]} />
                <Content>
                    <Summary>
                        <Link route={`/kitties/${summary[5]}`}>
                            <a>{summary[7]}</a>
                        </Link>
                        <Date>{summary[1]}/{summary[2]}/{summary[3]}</Date>
                    </Summary>
                    <Extra text>
                        {summary[0]}
                    </Extra>
                    <Meta onClick={() => this.props.onClick()}>
                        <Like>
                            <Icon name='like' color={summary[10] ? 'red' : 'grey'} />
                            {summary[4]} likes
                        </Like>
                    </Meta>
                </Content>
            </Event>
        );
    }
}

export default PostRow;