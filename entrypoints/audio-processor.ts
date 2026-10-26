declare abstract class AudioWorkletProcessor {
  readonly port: MessagePort;

  abstract process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ): boolean;
}

declare function registerProcessor(
  name: string,
  processorCtor: new (
    options?: AudioWorkletNodeOptions,
  ) => AudioWorkletProcessor,
): void;


export default defineUnlistedScript(() => {
class MyProccesor extends AudioWorkletProcessor {
   override process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
      const audioChannels = inputs[0];
      if(audioChannels?.length){
         const audioSamples = audioChannels[0]

         this.port.postMessage(audioSamples)
      }
      return true
   }

}

registerProcessor("my-audio-processor", MyProccesor);
});
