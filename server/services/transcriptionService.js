const path=require('path')
const assemblyClient=require('../config/assemblyai')

const transcribe=async(filePath)=>{
    try{
        const config={
            audio:filePath,
            speaker_labels:true
        }

        const transcript=await assemblyClient.transcripts.transcribe(config);
        if(transcript.status==='error'){
            throw new Error(`Transcription failed: ${transcript.error}`)
        }

        const utterances=(transcript.utterances|| []).map((utterance)=>({
            speaker:`Speaker ${utterance.speaker}`,
            text:utterance.text,
            start:utterance.start,
            end:utterance.end
        }))

        const raw=utterances
        .map((u)=>`${u.speaker}:${u.text}`)
        .join('\n\n')

        const speakerCount=new Set(utterances.map((u)=>u.speaker)).size;

        const duration=Math.round(transcript.audio_duration || 0);

        return{
            raw,
            utterances,
            duration,
            speakerCount
        }           
    }catch(error){
        throw new Error(`Transcription service error:${error.message}`)
    }
}

module.exports={transcribe};