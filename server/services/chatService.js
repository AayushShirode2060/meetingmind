const Meeting=require('../models/Meeting');
const genAI=require('../config/gemini');
const {getChatPrompt}=require('../utils/prompts');


const chat=async(meetingId,question)=>{
    try{
        const meeting=await Meeting.findById(meetingId);

        if(!meeting){
            throw new Error('Meeting not found')
        }

            // Ensure the meeting has been processed
        if (!meeting.transcript || !meeting.transcript.raw) {
        throw new Error('Meeting has not been transcribed yet');
        }

        const prompt = getChatPrompt(
        meeting.transcript.raw,
        meeting.summary,
        meeting.chatHistory || [],
        question
        );

         const response = await genAI.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
            config: {
                temperature: 0.4
            }
            }); 
            
      const answer=response.text;

        meeting.chatHistory.push(
            {role:'user',content:question},
            {role:'assistant',content:answer}
        );

        await meeting.save()

        return {answer}
    }catch(error){
        throw new Error(`Chat Service error:${error.message}`)
    }
}

module.exports={chat};