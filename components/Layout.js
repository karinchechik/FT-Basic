import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';

export default props => {
    return (
        <Container>
            <Head>
                <link
                    rel="stylesheet"
                    href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>FurryTales</title>
            </Head>

            <Header />
            {props.children}
        </Container>
    );
};