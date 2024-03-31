import OpenAI from "openai";

const magridbt_gpt_bot = "ft:gpt-3.5-turbo-0125:personal::98sgglsZ"
const OPENAI_API_KEY = "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"

console.log(OPENAI_API_KEY);

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

async function prompt(question) {
    const system_message = "Given your fitness level, goals, and available equipment, generate a personalized workout plan with detailed exercises, sets, reps, and estimated calorie burn."
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                  "role": "system",
                  "content": system_message + "When responding to prompts, prioritize staying on topic and avoid going off on tangents. If a message you receive seems to be about a different field, politely inform the user that you cannot assist them but can direct them to the appropriate resource. Respond in portuguese",
                },
                {
                    "role": "user",
                    "content": question,
                }
              ],
            model: magridbt_gpt_bot,
        });
        return completion.choices[0].message.content.toString();
    } catch (error) {
        console.error(error);
        return "Something went wrong";
    }
}

export default prompt;