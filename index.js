const express = require("express");
const app = express();
const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const jsonParser = express.json();

app.use(jsonParser);

const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genertedTasksArray = [];
app.post("/", async (req, res) => {
  console.log("backend function tiggred");
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `you are an excelent schedular and task generator you will  be given a task you will break this task in few points and give the steps to the user to do the task`,
    ],
    ["user", " here is the task {input}"],
  ]);
  const parser = new StringOutputParser();

  try {
    console.log("request", req.body);
    const data = req.body;
    const taskName = data.task;
    console.log(taskName);
    const llmChain = prompt.pipe(chatModel).pipe(parser);
    const aiTaskResponse = await llmChain.invoke({ input: taskName });
    console.log(aiTaskResponse);
    genertedTasksArray.push({ taskName: taskName, taskSteps: aiTaskResponse });
    res.send(aiTaskResponse);
  } catch (e) {
    res.send("error occured while generating the task");
  }
});

app.post("/ask", async (req, res) => {
  console.log("backend function tiggred");
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `you are a very knowlegable person you have the answer for all the user questions 
        you will be given a question and I want you to answer wisly and very good 
      `,
    ],
    ["user", " here is the question {input}"],
  ]);
  const parser = new StringOutputParser();

  try {
    console.log("request", req.body);
    const data = req.body;
    const taskName = data.task;
    console.log(taskName);
    const llmChain = prompt.pipe(chatModel).pipe(parser);
    const aiTaskResponse = await llmChain.invoke({ input: taskName });
    console.log(aiTaskResponse);
    genertedTasksArray.push({ taskName: taskName, taskSteps: aiTaskResponse });
    res.send(aiTaskResponse);
  } catch (e) {
    res.send("error occured while generating the task");
  }
});

app.post("/alltasks", async (req, res) => {
  const UserStringTasks = genertedTasksArray.join(" , ");
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `you are a great life couch you will be given a person dreams and the todo tasks that the user want 
      based in that dreams and the todo tasks you will write him a personal message explaining each part of the importance of each 
      task he is doing every day and you will tell him what he should do more 

      be optimistic and put many emojies in your answer 
      `,
    ],
    [
      "user",

      `
      here is the user tasks that he have done ${UserStringTasks}

      and here is the user  dreams {input}
    `,
    ],
  ]);
  const parser = new StringOutputParser();

  try {
    console.log("request", req.body);
    const data = req.body;
    const taskName = data.task;
    console.log(taskName);
    const llmChain = prompt.pipe(chatModel).pipe(parser);
    const aiTaskResponse = await llmChain.invoke({ input: taskName });
    console.log(aiTaskResponse);
    genertedTasksArray.push({ taskName: taskName, taskSteps: aiTaskResponse });
    res.send(aiTaskResponse);
  } catch (e) {
    res.send("error occured while generating the task");
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
