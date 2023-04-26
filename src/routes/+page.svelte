<script lang="ts">
  import Icon from "@iconify/svelte";
  import fileExportOutline from "@iconify/icons-mdi/file-export-outline";
  import menuIcon from "@iconify/icons-mdi/menu";
  import closeOctagonOutline from "@iconify/icons-mdi/close-octagon-outline";
  import YearPicker from "$lib/components/YearPicker.svelte";
  import { MONTHS, DAYS } from "$lib/Constants";
  import Modal from "$lib/components/Modal.svelte";
  import MonthTemplate from "$lib/components/MonthTemplate.svelte";
  import { programData } from "$lib/store";
  import DayTemplate from "$lib/components/DayTemplate.svelte";

  const year = new Date().getFullYear();
  let yearPickerVisible = false;
  let currentYear = year;
  let showMonthlyModal = false;
  let showDailyModal = false;
  let selectedMonth: number | null;
  let selectedDate: string;
  let selectedDateProgram: string | null;

  $: monthlyData = MONTHS.map((month, index) => ({
    month,
    startDay: new Date(currentYear, index).getDay(),
    numberOfDays: 40 - new Date(currentYear, index, 40).getDate(),
  }));

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

  const closeButtonClicked = () => {
    yearPickerVisible = false;
  };

  const yearButtonClicked = (event: any) => {
    currentYear = event.detail.year;
    yearPickerVisible = false;
    $programData = [];
  };

  const openMonthlyModal = (m: number | null) => {
    selectedMonth = m;
    showMonthlyModal = true;
  };

  const closeMonthlyModal = () => {
    showMonthlyModal = false;
  };

  const openDailyModal = (d: string | null, p: string | null) => {
    if (d) {
      selectedDate = d;
      selectedDateProgram = p;
      showDailyModal = true;
    }
  };

  const closeDailyModal = () => {
    showDailyModal = false;
  };

  const clear = (month: number | null) => {
    if (month === null) {
      programData.set([]);
    } else {
      $programData = $programData.filter((p) => p.date.getMonth() !== month);
    }
  };

  $: getHref = (month: number | null) => {
    if (month === null) {
      return encodeURI(
        "data:text/csv;charset=utf-8, " +
          $programData
            .sort((a, b) => a.dateString.localeCompare(b.dateString))
            .map((p) => `"${p.dateString}","${p.name}"`)
            .join("\n")
      );
    } else {
      return encodeURI(
        "data:text/csv;charset=utf-8, " +
          $programData
            .filter((p) => p.date.getMonth() === month)
            .sort((a, b) => a.dateString.localeCompare(b.dateString))
            .map((p) => `"${p.dateString}","${p.name}"`)
            .join("\n")
      );
    }
  };
</script>

<svelte:head>
  <title>Program Scheduler</title>
</svelte:head>

<section>
  <div class="content">
    <h1 class="header">
      <div class="year">
        <button on:click={() => (yearPickerVisible = true)}>
          {currentYear}
        </button>
        <div class="year-picker" class:visible={yearPickerVisible}>
          <YearPicker
            on:closeButtonClicked={closeButtonClicked}
            on:yearButtonClicked={yearButtonClicked}
          />
        </div>
      </div>
      <div class="title">Program Scheduler</div>
      <div class="icons">
        <button
          title="Program for every month"
          on:click={() => openMonthlyModal(null)}
        >
          <Icon icon={menuIcon} />
        </button>
        <button title="Clear All" on:click={() => clear(null)}>
          <Icon icon={closeOctagonOutline} />
        </button>
        <a href={getHref(null)} title="Export to CSV">
          <Icon icon={fileExportOutline} />
        </a>
      </div>
    </h1>
    <div>
      {#each monthlyData as month, monthIndex}
        <h1 class="month-header">
          <div class="title">
            {month.month}
            {currentYear}
          </div>
          <div class="icons">
            <button
              title="Program for {month.month}"
              on:click={() => openMonthlyModal(monthIndex)}
            >
              <Icon icon={menuIcon} />
            </button>
            <button title="Clear" on:click={() => clear(monthIndex)}>
              <Icon icon={closeOctagonOutline} />
            </button>
            <a href={getHref(monthIndex)} title="Export to CSV">
              <Icon icon={fileExportOutline} />
            </a>
          </div>
        </h1>
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
                  {#if Boolean(currentDate(month.startDay, month.numberOfDays, weekIndex, dayIndex))}
                    <button
                      class="competition-details"
                      data-date="{currentDate(
                        month.startDay,
                        month.numberOfDays,
                        weekIndex,
                        dayIndex
                      )} {month.month} {currentYear}"
                      data-program={programName(
                        monthIndex + 1,
                        month.startDay,
                        weekIndex,
                        dayIndex
                      )}
                      title="Program for {currentDate(
                        month.startDay,
                        month.numberOfDays,
                        weekIndex,
                        dayIndex
                      )} {month.month} {currentYear}"
                      class:highlight={Boolean(
                        currentDate(
                          month.startDay,
                          month.numberOfDays,
                          weekIndex,
                          dayIndex
                        )
                      )}
                      on:click={(e) =>
                        openDailyModal(
                          e.currentTarget.getAttribute("data-date"),
                          e.currentTarget.getAttribute("data-program")
                        )}
                    >
                      <span class="competition-date">
                        {currentDate(
                          month.startDay,
                          month.numberOfDays,
                          weekIndex,
                          dayIndex
                        )}
                      </span>
                      <span class="competition-name">
                        {programName(
                          monthIndex + 1,
                          month.startDay,
                          weekIndex,
                          dayIndex
                        )}
                      </span>
                    </button>
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </table>
      {/each}
    </div>
  </div>
</section>

<Modal
  showModal={showMonthlyModal}
  title="Program for {selectedMonth !== null
    ? MONTHS[selectedMonth]
    : currentYear}"
  on:closeModal={closeMonthlyModal}
  size="FULL_SCREEN"
>
  <MonthTemplate
    month={selectedMonth}
    year={currentYear}
    on:monthTemplateCloseButtonClicked={closeMonthlyModal}
  />
</Modal>

<Modal
  showModal={showDailyModal}
  title="Program for {selectedDate}"
  on:closeModal={closeDailyModal}
>
  <DayTemplate
    {selectedDate}
    {selectedDateProgram}
    on:dayTemplateCloseButtonClicked={closeDailyModal}
  />
</Modal>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--grey);
    padding: 20px;
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.05);
  }
  a {
    color: unset;
    text-decoration: none;
    font-size: 1rem;
    display: flex;
    align-items: center;
  }
  .header {
    margin-bottom: 10px;
    color: var(--white);
    background: var(--blue);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 10px;
  }
  .header .title {
    text-transform: uppercase;
    text-align: center;
    flex: 1;
  }
  .year {
    position: relative;
  }
  .year button {
    padding: 5px;
    cursor: pointer;
  }
  .year-picker {
    position: absolute;
    top: 0;
    left: 0;
    transform: scale(0);
    transform-origin: top left;
    transition: 0.25s;
  }
  .year-picker.visible {
    transform: scale(1);
  }
  .header .icons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  .icons button {
    background: none;
    border: none;
    color: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .content {
    max-width: 1110px;
    border-radius: 5px;
    background: var(--white);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 25px;
    box-shadow: 0 15px 10px rgba(0, 0, 0, 0.5);
  }
  th {
    padding: 10px 0;
  }
  /* td {
    padding: 10px 15px;
    font-size: 1.5em;
  } */
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
  .month-header {
    background: var(--blue);
    color: var(--white);
    padding: 10px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    font-size: 1rem;
  }
  .month-header .icons {
    display: flex;
    justify-content: space-between;
    gap: 5px;
  }
  .competition-details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 110px;
    width: 110px;
    padding: 10px 15px;
    font-size: 1.5em;
    background: none;
    border: none;
  }
  .competition-date {
    text-align: left;
  }
  .competition-details.highlight:hover {
    cursor: pointer;
    background: var(--lightGrey);
  }
  .competition-name {
    font-size: 0.6em;
    text-align: end;
    font-weight: bold;
    color: var(--orange);
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media (max-width: 991px) {
    .competition-details {
      width: 75px;
      height: 75px;
    }
    .competition-name {
      overflow: auto;
    }
  }
  @media (max-width: 455px) {
    .content {
      padding: 10px;
    }
    .header {
      font-size: 2em;
    }
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
    .competition-details {
      width: 45px;
      height: 45px;
    }
    .competition-name {
      overflow: auto;
    }
  }
</style>
