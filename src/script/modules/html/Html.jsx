import React from 'react';
import style from './Html.scss';

export default class Html extends React.Component{
    renber(){
        return (
            <html>
                <head>
                    <script type="text/javascript" src="index.js"/>
                </head>
                <body>
                    {this.props.children}
                </body>
            </html>
        )
    }
}