<script lang="ts">
  import { MONTHS } from "./lib/constants";
  import Modal from "./lib/components/Modal.svelte";
  import MonthTemplate from "./lib/components/MonthTemplate.svelte";
  import DayTemplate from "./lib/components/DayTemplate.svelte";
  import { programData } from "./lib/store/programData";
  import Calendar from "./lib/components/Calendar.svelte";
  import AppHeader from "./lib/components/AppHeader.svelte";

  const year = new Date().getFullYear();
  let currentYear = year;
  let showMonthlyModal = false;
  let showDailyModal = false;
  let selectedMonth: number | null;
  let selectedDate: string;
  let selectedDateProgram: string | null;

  const setCurrentYear = (event: any) => {
    currentYear = event.detail.year;
    $programData = [];
  };

  const displayMonthlyProgramTemplate = (event: any) => {
    selectedMonth = event.detail?.monthIndex;
    showMonthlyModal = true;
  };

  const displayDayProgram = (event: any) => {
    const date = event.detail.date;
    const programName = event.detail.programName;
    if (date) {
      selectedDate = date;
      selectedDateProgram = programName;
      showDailyModal = true;
    }
  };

  const clearProgramData = (event: any) => {
    const m = event.detail?.monthIndex;
    if (m == null) {
      programData.set([]);
    } else {
      $programData = $programData.filter((p) => p.date.getMonth() !== m);
    }
  };

  const closeMonthlyModal = () => {
    showMonthlyModal = false;
  };

  const closeDailyModal = () => {
    showDailyModal = false;
  };
</script>

<svelte:head>
  <title>Program Scheduler</title>
</svelte:head>

<main>
  <section>
    <div class="content">
      <AppHeader
        {currentYear}
        on:setCurrentYear={setCurrentYear}
        on:displayMonthlyProgramTemplate={displayMonthlyProgramTemplate}
        on:clearProgramData={clearProgramData}
      />
      <Calendar
        {currentYear}
        on:displayMonthlyProgramTemplate={displayMonthlyProgramTemplate}
        on:displayDayProgram={displayDayProgram}
        on:clearProgramData={clearProgramData}
      />
    </div>
  </section>

  <Modal
    showModal={showMonthlyModal}
    title="Program for {selectedMonth != null
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
</main>

<style>
  main {
    min-height: 100vh;
  }
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--grey);
    padding: 20px;
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.05);
  }
  .content {
    max-width: 1110px;
    border-radius: 5px;
    background: var(--white);
  }
  @media (max-width: 455px) {
    .content {
      padding: 10px;
    }
  }
</style>
