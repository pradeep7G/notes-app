const logger=require('./logger')


const requestLogger=(req,res,next) => {
  logger.info(req.method)
  logger.info(req.path)
  logger.info(req.body)
  logger.info('---')
  next()
}

const unknowEndpoint=(req,res) => {
  res.status(404).send({
    error:'unknown endpoint'
  })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if(error.name === 'ValidationError')
  {
    return response.status(400).json({ error:error.message })
  }

  next(error)
}

module.exports={
  requestLogger,
  unknowEndpoint,
  errorHandler
}


