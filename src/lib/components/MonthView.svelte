<script lang="ts">
  import { DAYS } from "../constants";
  import { programData } from "../store/programData";
  import DayView from "./DayView.svelte";

  type MonthType = {
    month: string;
    startDay: number;
    numberOfDays: number;
  };

  export let month: MonthType;
  export let monthIndex: number;
  export let currentYear: number;

  const currentDate = (
    monthStartDay: number,
    monthNumberOfDays: number,
    weekIndex: number,
    dayIndex: number
  ) => {
    const d = DAYS.length * weekIndex - monthStartDay + 1 + dayIndex;
    if (d < 1 || d > monthNumberOfDays) return "";
    return d;
  };

  $: programName = (
    month: number,
    monthStartDay: number,
    weekIndex: number,
    dayIndex: number
  ) => {
    const d = `${currentYear}-${String(month).padStart(2, "0")}-${String(
      DAYS.length * weekIndex - monthStartDay + 1 + dayIndex
    ).padStart(2, "0")}`;
    return $programData.filter((p) => p.dateString === d)[0]?.name ?? "";
  };
</script>

<table>
  <tr class="day">
    {#each DAYS as day}
      <th>{day.abbr}</th>
    {/each}
  </tr>
  {#each [...Array.from(Array(Math.ceil((month.startDay + month.numberOfDays) / 7)).keys())] as weekIndex}
    <tr>
      {#each DAYS as _, dayIndex}
        <td>
          <DayView
            currentDate={currentDate(
              month.startDay,
              month.numberOfDays,
              weekIndex,
              dayIndex
            )}
            month={month.month}
            {currentYear}
            programName={programName(
              monthIndex + 1,
              month.startDay,
              weekIndex,
              dayIndex
            )}
            on:displayDayProgram
          />
        </td>
      {/each}
    </tr>
  {/each}
</table>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 25px;
    box-shadow: 0 15px 10px rgba(0, 0, 0, 0.5);
  }
  th {
    padding: 10px 0;
  }
  th,
  td {
    border-right: 1px solid var(--black);
    border-top: 1px solid var(--black);
    border-bottom: 1px solid var(--black);
  }
  th:nth-child(1),
  td:nth-child(1) {
    border-left: 1px solid var(--black);
  }
  @media (max-width: 455px) {
    th {
      font-size: 0.7em;
    }
    td {
      padding: 2px;
      font-size: 1em;
    }
    .day {
      display: none;
    }
  }
</style>
