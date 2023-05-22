export function generatePeerId(): string {
    return `${Math.random().toString(36).substring(2, 15)}otrto${Math.random().toString(36).substring(2, 15)}`;
}

export class Message {
    public text: string;

    public isSender: boolean;

    public isSystem: boolean;

    public isFile: boolean;

    public constructor(
        text: string,
        isSender: boolean,
        isSystem: boolean = false,
        isFile: boolean = false
    ) {
        this.text = text;
        this.isSender = isSender;
        this.isSystem = isSystem;
        this.isFile = isFile;
    }
}
