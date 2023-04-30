<script lang="ts">
  import Icon from "@iconify/svelte";
  import fileExportOutline from "@iconify/icons-mdi/file-export-outline";
  import menuIcon from "@iconify/icons-mdi/menu";
  import closeOctagonOutline from "@iconify/icons-mdi/close-octagon-outline";
  import { programData } from "../store/programData";
  import YearPicker from "./YearPicker.svelte";
  import { createEventDispatcher } from "svelte";

  export let currentYear: number;
  let yearPickerVisible = false;

  const dispatch = createEventDispatcher();

  const closeButtonClicked = () => {
    yearPickerVisible = false;
  };

  const yearButtonClicked = (event: any) => {
    yearPickerVisible = false;
    dispatch("setCurrentYear", {
      year: event.detail.year,
    });
  };

  const handleProgramButtonClicked = () => {
    dispatch("displayMonthlyProgramTemplate");
  };

  const handleClearButtonClicked = () => {
    dispatch("clearProgramData");
  };

  $: exportToCSVLink = () =>
    encodeURI(
      "data:text/csv;charset=utf-8, " +
        $programData
          .sort((a, b) => a.dateString.localeCompare(b.dateString))
          .map((p) => `"${p.dateString}","${p.name}"`)
          .join("\n")
    );
</script>

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
      on:click={handleProgramButtonClicked}
    >
      <Icon icon={menuIcon} />
    </button>
    <button title="Clear All" on:click={handleClearButtonClicked}>
      <Icon icon={closeOctagonOutline} />
    </button>
    <a href={exportToCSVLink()} title="Export to CSV">
      <Icon icon={fileExportOutline} />
    </a>
  </div>
</h1>

<style>
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
  @media (max-width: 455px) {
    .header {
      font-size: 2em;
    }
  }
</style>
