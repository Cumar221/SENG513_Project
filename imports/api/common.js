/*
import { Mongo } from 'meteor/mongo';

let imageStoreLarge = new FS.Store.Dropbox("imagesLarge", {
    key: "o84hlq4d662zz3d",
    secret: "owlj6lyrn64vst0",
    token: "215ign0MgzAAAAAAAAAAGu8XK-LLvXYi4TZtTnitWTWe2V8pYX6jaiCY1X0sxJrs",
    transformWrite: function(fileObj, readStream, writeStream) {
        gm(readStream, fileObj.name()).resize('250', '250').stream().pipe(writeStream)
    }
});

let imageStoreSmall = new FS.Store.Dropbox("imagesSmall", {
    key: "o84hlq4d662zz3d",
    secret: "owlj6lyrn64vst0",
    token: "215ign0MgzAAAAAAAAAAGu8XK-LLvXYi4TZtTnitWTWe2V8pYX6jaiCY1X0sxJrs",
    beforeWrite: function(fileObj) {
        fileObj.size(20, {store: "imageStoreSmall", save: false});
    },
    transformWrite: function(fileObj, readStream, writeStream) {
        gm(readStream, fileObj.name()).resize('20', '20').stream().pipe(writeStream)
    }
});

export const Images = new FS.Collection("images", {
    stores: [imageStoreSmall, imageStoreLarge],
    filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});
*/