////////////////////////////////
// Upload files to Cloudinary //
////////////////////////////////
const multer = require('multer');
const stream = require('stream');
const cloudinary = require('cloudinary').v2;
const randomstring = require('randomstring');

if (!process.env.CLOUDINARY_URL) {
    console.error('*******************************************************************************')
    console.error('*******************************************************************************\n')
    console.error('You must set the CLOUDINARY_URL environment variable for Cloudinary to function\n')
    console.error('\texport CLOUDINARY_URL="cloudinary:// get value from heroku"\n')
    console.error('*******************************************************************************')
    console.error('*******************************************************************************')
    process.exit(1)
}

const doUpload = (publicId, req, res, next) => {
    if (req.file) {
        const name = publicId === 'avatars' ? '/' + req.body.username : '/' + randomstring.generate(10);
        const uploadStream = cloudinary.uploader.upload_stream({ tags: req.body.username, public_id: publicId + name }, (err, result) => {
            // capture the url and public_id and add to the request
            req.fileurl = result['secure_url'];
            req.fileid = result.public_id;
            next()
        });
        const s = new stream.PassThrough();
        s.end(req.file.buffer);
        s.pipe(uploadStream);
        s.on('end', uploadStream.end)
    } else {
        next()
    }

};

const parseImage = multer().single('image');
const upload = (publicId) => (req, res, next) => doUpload(publicId, req, res, next);

module.exports = { parseImage, upload };
