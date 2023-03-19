import * as dotenv from "dotenv";
dotenv.config(); //Allows us to access our enviornment variables defined in our .env file

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI, //Access the openai key from the env file
});

const openai = new OpenAIApi(configuration); //initializes the openai sdk

import express from "express";
import cors from "cors";

const app = express(); //Allows us to use various different middleware
app.use(cors()); //cross orgin resource sharing / a security mechanism
app.use(express.json()); //This well tell our api that it only wants to handle incoming data in a json format

app.post("/dream", async (req, res) => {
  try {
    const prompt = req.body.prompt; //Accessing the description of the image the user is trying to generate

    const aiResponse = await openai.createImage({
      //Using await on this call will pause the execution until openAi is finished
      prompt,
      n: 1, //number of images
      size: "1024x1024", //resolution size
    }); // Passing the prompt to the openai api by calling the createImage method and passing the prompt as an argument

    const image = aiResponse.data.data[0].url; // uses the aiResponse to get the image url
    res.send({ image }); //sends the image back to the client as a response. will be recieved as json data
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error?.response.data.error.message || "Something went wrong");
  }
});
//This is our first endpoint, we are using post here because we are creating a new piece of data
// The post method takes two arguments, the first argument is a string that reperesents the URL of the API
// The second argument is a callback function that has a request and response object that we can interact with
// The callback function will be called everytime someone navigates to this url

app.listen(8080, () => console.log("make art on http://localhost:8080/dream")); //fires up the app using the port you want to use
