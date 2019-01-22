const _ = require('lodash')
const { Song } = require('./../../db/model/song')

let addSong = async function (req, res) {
  try {
    const body = _.pick(req.body, ['title', 'singer', 'album', 'cover', 'url', 'filename','covername'])
    let newSong = new Song(body)

    await newSong.save()
    res.status(200).send('song add to database successfully')

  } catch (e) {
    res.status(400).json({
      Error: 'Somthing went wrong ' + e
    })
  }
}

let deleteSong = async function (req, res) {
  const body = _.pick(req.body, ['_id'])

  try {
    await Song.findOneAndRemove({
      _id: body._id
    })

    res.status(200).send('song removed successfully')

  } catch (e) {
    res.status(400).json({
      Error: 'Somthing went wrong ' + e
    })
  }

}

let getAllSong = async function (req, res) {

  Song.find({}, (err, songs) => {
    if (songs != null) {
      res.status(200).send(songs)
    } else {
      res.status(400).send('sonthing went wrong')
    }
  })
}

let editSong = async function (req, res) {

  const body = _.pick(req.body, ['_id'])
  let editedPost = await Song.findByIdAndUpdate({_id:body._id}
    ,
    {
      title: req.body.title,
      singer: req.body.singer,
      album: req.body.album,
      cover: req.body.cover,
      url: req.body.url,
      filename: req.body.filename,
      covername : req.body.covername
    },
    { new: true }
)
  if (!editedPost) return res.status(404).send('there is not exist any post for the given id')

  res.status(200).send(editedPost)
}

module.exports = {
  addSong,
  deleteSong,
  getAllSong,
  editSong
}