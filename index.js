require('dotenv').config();
const express=require('express');
// const cors=require('cors');
const app=express();
const Note=require('./models/note');
const { response } = require('express');


app.use(express.static('build'));
// app.use(cors());
app.use(express.json());

const errorHandler = (error, request, response, next) => {
  // console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if(error.name === 'ValidationError')
  {
    return response.status(400).json({error:error.message})
  }

  next(error)
}

const requestLogger=(req,res,next)=>{
  console.log(req.method);
  console.log(req.path);
  console.log(req.body);
  console.log('---');
  next();
}

app.use(requestLogger);

app.get('/',(req,res)=>{
    res.send('<h1>Hello World</h1>');
})

app.get('/api/notes',(req,res)=>{
    Note.find({}).then(notes => {
      res.json(notes);
    })
})

app.get('/api/notes/:id',(req,res,next)=>{
    Note.findById(req.params.id).then( note =>{
      if(note)
      {
      res.json(note);
      }
      else{
        res.status(404).end();
      }
    })
    .catch(error => next(error));
})

app.post('/api/notes',(req,res,next)=>{
  
    const body=req.body;    
    const note=new Note({
      content:body.content,
      important:body.important || false,
      date:new Date(),
    })

    note.save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndFormattedNote => {
      res.json(savedAndFormattedNote)
    })
    .catch(error=>next(error));

  })
  
app.delete('/api/notes/:id',(req,res,next)=>{
   Note.findByIdAndRemove(req.params.id)
   .then(result =>{
      res.status(204).end();
   })
   .catch(error => next(error));
})

app.put('/api/notes/:id',(req,res,next)=>{
  const body=req.body;

  const note={
    content:body.content,
    important:body.important,
  }

  Note.findByIdAndUpdate(req.params.id,note,{new:true})
  .then(updatedNote => {
    res.json(updatedNote)
  })
  .catch(error => next(error));

})

const unknowEndpoint=(req,res)=>{
  res.status(404).send({
    error:'unknown endpoint'
  })
}

app.use(unknowEndpoint);
app.use(errorHandler);

const PORT=process.env.PORT || 3001;
app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
})
