const genAI=require('../config/gemini');
const {getSummarizationPrompt}=require('../utils/prompts')


const summarize=async(transcript)=>{
    try{
      const prompt=getSummarizationPrompt(transcript);

      const response=await genAI.models.generateContent({
        model:'gemini-3.5-flash',
        contents:prompt,
        config:{
            responseMimeType:'application/json',
            temperature:0.3
        }
      })

      let rawText = response.text || '';
      
      // Clean markdown formatting if present
      let cleanText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      
      // Extract just the JSON object to ignore any trailing text
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
          cleanText = jsonMatch[0];
      }

      const result = JSON.parse(cleanText);

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
        throw new Error(`Summary Service error:${error.message}`);
    }
};

module.exports={summarize}