const mongoose=require('mongoose')

if(process.argv.length < 3)
{
  console.log('Please provide teh password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url='mongodb+srv://fso_app:curious25@fsoapp.crvxb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(url,{ useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify: false,useCreateIndex:true })

const noteSchema=new mongoose.Schema({
  content: String,
  date:Date,
  important:Boolean,
})

const Note=mongoose.model('Note',noteSchema)

// const note=new Note({
//     content: 'Callback functions suck',
//     date: new Date(),
//     important: true,
// })

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

// Note.find({content:'HTML is Easy'}).then(result =>{
//     console.log(result);
//     mongoose.connection.close();
// })

// note.save().then(result =>{
//     console.log('note saved!');
//     mongoose.connection.close();
// })