const {AssemblyAI}=require('assemblyai');

const assemblyClient=new AssemblyAI({
     apiKey: process.env.ASSEMBLYAI_API_KEY
})

module.exports=assemblyClient