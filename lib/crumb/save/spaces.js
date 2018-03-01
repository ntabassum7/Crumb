AWS.config.update({ accessKeyId: process.env.AWS_KEYID, secretAccessKey: process.env.AWS_SECRETKEY });
var s3 = new AWS.S3();

class Spaces {

    constructor(bucket) {
        this.bucket = bucket;
    }

    async save(file)
    {
        let bucket = this.bucket;
        return new Promise(async (resolve, reject) => {
            console.log(bucket);
            // call S3 to retrieve upload file to specified bucket
            var uploadParams = {Bucket: bucket, Key: '', Body: ''};

            var fileStream = fs.createReadStream(file);
                fileStream.on('error', function(err) {
                reject(err);
            });
            uploadParams.Body = fileStream;
            uploadParams.Key = path.basename(file);

            // call S3 to retrieve upload file to specified bucket
            s3.upload (uploadParams, function (err, data) {
                if (err) {
                    reject(err);
                } if (data) {
                    resolve(data.Location);
                }
            });
        
        });
    }
}

module.exports = Spaces;