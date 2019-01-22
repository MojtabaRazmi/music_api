const {mongoose} = require('./../mongoose');

const songSchema = mongoose.Schema({
   title:{
       type: String,
       required: true
   },
    singer:{
        type: String,
    },
    album:{
        type: String,
    },
    cover:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    filename:{
        type: String,
    },
    like:{
        type: Number,
    },
    dislike:{
        type: Number,
    },
    download:{
        type: String,
    }
});

const Song = mongoose.model("Song",songSchema,"Song");

module.exports = {
    Song
};