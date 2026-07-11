const {GoogleGenAI}=require('@google/genai')



const genai=new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY  
})

module.exports=genai;
