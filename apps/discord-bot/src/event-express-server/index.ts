// an express server for receiving knative events

import express from "express";
import { HTTP } from "cloudevents";

export function startEventHttpServer() { 
  const app = express()

  app.post('/', function(req, res) {
    try {
      const receivedEvent = HTTP.toEvent({ headers: req.headers, body: req.body });
      console.log(receivedEvent)
    } catch (err) {
      console.error(err)
      res.status(415)
        .header('Content-Type', 'application/json')
        .send(JSON.stringify(err))
    }
  })

  app.listen(3000, () => {
    console.log('Listening for events on port 3000')
  })
}