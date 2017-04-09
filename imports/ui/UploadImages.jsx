import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { _ } from 'meteor/underscore';

const URL =  "https://api.cloudinary.com/v1_1/df9evoecg/image/upload";
const UPLOADPRESET = 'xeckeflq';
const APIKEY = '299182963357756';

export default class UploadImages extends Component{
    constructor(props) {
        super(props);
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
        console.log(imageResponse.secure_url);

        Meteor.call('addMessage',{image: imageResponse.secure_url});
    }

    render(){
        return(
            <div>
                <div className="ImageAttach">
                    <Dropzone
                        multiple={false}
                        onDrop={this.uploadImage.bind(this)}>
                        <div>Try dropping some files here, or click to select files to upload.</div>
                    </Dropzone>
                </div>
            </div>
        )
    }
}

