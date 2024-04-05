import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: "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",
});

function getExersicesVideos(exercise) {
  console.log(exercise)
  return JSON.stringify({ exercise: exercise, video: "https://www.youtube.com/watch?v=IODxDxX7oi4" });
}

async function prompt(question) {
  const tools = [
    {
      type: "function",
      function: {
        name: "get_excercise_fitness_poses_videos",
        description: "Get the excercise",
        parameters: {
          type: "object",
          properties: {
            excercise: {
              type: "string",
              description: "The name of the excersice",
            },
          },
          required: ["excercise"],
        },
      },
    },
  ];
  const system_message =
    "Given your fitness level, goals, and available equipment, generate a personalized workout plan with detailed exercises, sets, reps, and estimated calorie burn. also add the video url for every excercise with it.";

  const messagesArray = [
    {
      role: "system",
      content: system_message + process.env.SystemInstructions,
    },
    {
      role: "user",
      content: question,
    },
  ];
  try {
    const completion = await openai.chat.completions.create({
      messages: messagesArray,
      tool_choice: "auto",
      tools: tools,
      model: "ft:gpt-3.5-turbo-0125:personal::98sgglsZ",
    });
    const response = completion.choices[0].message;
    const toolsCalls = response.tool_calls;

    if (response.tool_calls) {
      const availableVideos = {
        get_excercise_fitness_poses_videos: getExersicesVideos,
      };
      messagesArray.push(response);
      for (const toolCall of toolsCalls) {
        const functionName = toolCall.function.name;
        const functionToCall = availableVideos[functionName];
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const functionResponse = functionToCall(functionArgs.excercise);
        console.log(functionResponse)
        messagesArray.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: functionResponse,
        });
      }
      const secondResponse = await openai.chat.completions.create({
        model: "ft:gpt-3.5-turbo-0125:personal::98sgglsZ",
        messages: messagesArray,
      }); // get a new response from the model where it can see the function response
      console.log("! \n",secondResponse.choices[0].message)
      return secondResponse.choices[0].message.content;
    }
    console.log("?? \n")
    return completion.choices[0].message.content
  } catch (error) {
    console.error(error);
    return "Something went wrong";
  }
}

// const huhh = await prompt(" give pushups video");
// console.log(huhh);
export default prompt;