<script lang="ts">
  import { MONTHS } from "../constants";
  import MonthView from "./MonthView.svelte";
  import MonthHeader from "./MonthHeader.svelte";

  export let currentYear: number;

  $: monthlyData = MONTHS.map((month, index) => ({
    month,
    startDay: new Date(currentYear, index).getDay(),
    numberOfDays: 40 - new Date(currentYear, index, 40).getDate(),
  }));
</script>

<section>
  {#each monthlyData as month, monthIndex}
    <MonthHeader
      month={month.month}
      {monthIndex}
      {currentYear}
      on:displayMonthlyProgramTemplate
      on:clearProgramData
    />
    <MonthView {month} {monthIndex} {currentYear} on:displayDayProgram />
  {/each}
</section>
