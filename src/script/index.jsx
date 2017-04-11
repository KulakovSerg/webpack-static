import React from 'react';
import Html from 'modules/html/Html';
import Header from 'modules/header/Header';
import Footer from 'modules/footer/Footer';
import Content from 'modules/content/Content';

export default class Index extends React.Component{
    renber(){
        return (
            <Html>
                <Header/>
                <Content/>
                <Footer/>
            </Html>
        )
    }
}