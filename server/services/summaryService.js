const genAI=require('../config/gemini');
const {getSummarizationPrompt}=require('../utils/prompts')


const summarize=async(transcript)=>{
    try{
      const prompt=getSummarizationPrompt(transcript);
      console.log("this is the prompt",prompt)

      console.log("Transcript chars:", transcript.length);
console.log("Prompt chars:", prompt.length);

      const response=await genAI.models.generateContent({
        model:'gemini-3.1-flash-lite',
        contents:prompt,
        config:{
            responseMimeType:'application/json',
            temperature:0.3
        }
      })

      console.log("this is the response",response)

      let rawText = response.text || '';

      console.log("this is raw text",rawText)
      
      // Clean markdown formatting if present
      let cleanText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

      
      console.log("this is clean text",cleanText)
      
      // Extract just the JSON object to ignore any trailing text
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      console.log("this is the json match",jsonMatch)

      if (jsonMatch) {
          cleanText = jsonMatch[0];
      }

      console.log("this is the clean text",cleanText)
      const result = JSON.parse(cleanText);
      console.log("this is the result",result)

      return{
        summary:result.summary ||'',
         keyDecisions: result.keyDecisions || [],
      actionItems: (result.actionItems || []).map((item) => ({
        task: item.task || '',
        owner: item.owner || 'Unassigned',
        deadline: item.deadline || 'Not specified'
      })),
      deadlines: (result.deadlines || []).map((d) => ({
        item: d.item || '',
        date: d.date || 'Not specified'
      })),
      risks: result.risks || [],
      followUpEmail: result.followUpEmail || ''
      }
    }catch(error){
        // throw new Error(`Summary Service error:${error.message}`);
      
    console.error("Gemini Error:", error);

    if (error.response) {
        console.error(await error.response.text());
    }

    throw error;
}
      
};

module.exports={summarize}