import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Images } from '../api/common.js';
import { _ } from 'meteor/underscore';
import request from 'superagent';
import sha1 from 'sha1';
import cloudinary from 'cloudinary';

const CLOUDNAME = 'df9evoecg';
const URL =  "https://api.cloudinary.com/v1_1/df9evoecg/image/upload";
const TIMESTAMP = Date.now()/1000;
const UPLOADPRESET = 'xeckeflq';
const APISECRET = 'f0vXNmlkuRyiRim8KkkSb9EZxIY';
const APIKEY = '299182963357756';
const PARAMSTR =  'timestamp='+TIMESTAMP+'&upload_preset='+UPLOADPRESET+'f0vXNmlkuRyiRim8KkkSb9EZxIY';
const SIGNATURE = sha1(PARAMSTR);
const PARAMS = {
    'api_key': APIKEY,
    'timestamp': TIMESTAMP,
    'upload_preset': UPLOADPRESET,
    'signature': SIGNATURE
}
cloudinary.config({
    cloud_name: CLOUDNAME,
    api_key: "299182963357756",
    api_secret: 'f0vXNmlkuRyiRim8KkkSb9EZxIY'
});


export default class UploadImages extends Component{
    constructor(props) {
        super(props);

        this.state = {
            images: []
        };
    }

    uploadImage(files){
        this.setState({
            uploadedFile: files[0]
        });

        this.handleImageUpload(files[0]);
        console.log('uploadFile: ');
    }

    handleImageUpload(file) {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', UPLOADPRESET);
        data.append('api_key', APIKEY);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', URL, false);
        xhr.send(data);
        const imageResponse = JSON.parse(xhr.responseText);
        console.log(imageResponse);

        let images = Object.assign([],this.state.images);
        images.push(imageResponse);
        this.setState({
            images: images
        });
    }
    render(){
        const list  =  this.state.images.map((image,i) => {
           return(
               <li key={i}>
                    <img src={image.secure_url}/>
               </li>
           )
        });
        return(
            <div>
                <div className="messages">
                    <Dropzone
                        multiple={false}
                        accept="image/*"
                        onDrop={this.uploadImage.bind(this)}>
                    </Dropzone>
                </div>
                <div className="FilePreview">
                    {list}
                </div>
            </div>
        )
    }
}

