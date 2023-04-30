import { writable } from "svelte/store";

type TemplateType = {
    key: string;
    value: string;
}

export const templateData = writable<TemplateType[]>([]);