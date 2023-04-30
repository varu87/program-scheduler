import { writable } from "svelte/store";

type ProgramDataType = {
    date: Date;
    dateString: string;
    name: string;
}

export const programData = writable<ProgramDataType[]>([]);
