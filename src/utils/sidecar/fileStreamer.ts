export default class FileStreamer {// https://stackoverflow.com/questions/14438187/javascript-filereader-parsing-long-file-in-chunks
    private file: File;

    private offset: number;

    private defaultChunkSize: number;

    private textDecoder: TextDecoder;
  
    constructor(file: File, encoding: string = 'utf-16le') {
      this.file = file;
      this.offset = 0;
      this.defaultChunkSize = 64 * 1024; // bytes
      this.textDecoder = new TextDecoder(encoding);
      this.rewind();
    }
  
    rewind(): void {
      this.offset = 0;
    }
  
    isEndOfFile(): boolean {
      return this.offset >= this.getFileSize();
    }
  
    private static async eventPromise(target: EventTarget, eventName: string): Promise<Event> {
      return new Promise<Event>((resolve) => {
        const handleEvent = (event: Event) => {
          resolve(event);
        };
  
        target.addEventListener(eventName, handleEvent);
      });
    }
  
    private static async readFile(blob: Blob): Promise<ArrayBuffer> {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(blob);
  
      const event = await FileStreamer.eventPromise(fileReader, 'loadend');
      const target = event.target as FileReader;
      if (target.error) {
        throw target.error;
      }
      return target.result as ArrayBuffer;
    }
  
    async readBlockAsText(length: number = this.defaultChunkSize): Promise<string> {
      const blob = this.file.slice(this.offset, this.offset + length);
      const buffer = await FileStreamer.readFile(blob);
      const decodedText = this.textDecoder.decode(buffer, { stream: true });
      this.offset += blob.size;
  
      // Si la fin du fichier est atteinte, décodez la fin du flux pour récupérer les éventuels caractères coupés en deux
      if (this.isEndOfFile()) {
        const finalText = this.textDecoder.decode();
        if (finalText) {
          return decodedText + finalText;
        }
      }
  
      return decodedText;
    }
  
    getFileSize(): number {
      return this.file.size;
    }
  }
