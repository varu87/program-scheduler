import { writable } from "svelte/store";
import type { TemplateType, ProgramDataType } from "$lib/Types";

export const programData = writable<ProgramDataType[]>([]);
export const templateData = writable<TemplateType[]>([]);