import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { _ } from 'meteor/underscore';

const URL =  "https://api.cloudinary.com/v1_1/df9evoecg/image/upload";
const UPLOADPRESET = 'xeckeflq';
const APIKEY = '299182963357756';

const dropZoneStyle = {
    position: 'fixed',
    height: '100%',
    width: '50%',
    zIndex: 0,
};

export default class UploadImages extends Component{
    constructor(props) {
        super(props);
    }

    upload(files){
        this.handleUpload(files[0]);
    }

    handleUpload(file) {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', UPLOADPRESET);
        data.append('api_key', APIKEY);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', URL, false);
        xhr.send(data);
        const fileResponse = JSON.parse(xhr.responseText);

        Meteor.call('addPrivateMessage',{file: fileResponse.secure_url, uname: this.props.uname, targetUname: this.props.targetUname});
    }

    render(){
        return(
            <div>
                <div className="ImageAttach">
                    <Dropzone
                        multiple={false}
                        style={dropZoneStyle}
                        onDrop={this.upload.bind(this)}>
                        <div>Try dropping some files here, or click to select files to upload.</div>
                    </Dropzone>
                </div>
            </div>
        )
    }
}

