<script lang="ts">
  import Icon from "@iconify/svelte";
  import fileExportOutline from "@iconify/icons-mdi/file-export-outline";
  import menuIcon from "@iconify/icons-mdi/menu";
  import closeOctagonOutline from "@iconify/icons-mdi/close-octagon-outline";
  import { programData } from "../store/programData";
  import { createEventDispatcher } from "svelte";

  export let month: string;
  export let monthIndex: number;
  export let currentYear: number;

  const dispatch = createEventDispatcher();

  const handleMenuIconButtonClick = () => {
    dispatch("displayMonthlyProgramTemplate", {
      monthIndex,
    });
  };

  const handleClearIconButtonClick = () => {
    dispatch("clearProgramData", {
      monthIndex,
    });
  };

  $: exportToCSVLink = () =>
    encodeURI(
      "data:text/csv;charset=utf-8, " +
        $programData
          .filter((p) => p.date.getMonth() === monthIndex)
          .sort((a, b) => a.dateString.localeCompare(b.dateString))
          .map((p) => `"${p.dateString}","${p.name}"`)
          .join("\n")
    );
</script>

<h1>
  <div class="title">
    {month}
    {currentYear}
  </div>
  <div class="icons">
    <button title="Program for {month}" on:click={handleMenuIconButtonClick}>
      <Icon icon={menuIcon} />
    </button>
    <button title="Clear" on:click={handleClearIconButtonClick}>
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
  .icons button {
    background: none;
    border: none;
    color: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  h1 {
    background: var(--blue);
    color: var(--white);
    padding: 10px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    font-size: 1rem;
  }
  h1 .icons {
    display: flex;
    justify-content: space-between;
    gap: 5px;
  }
</style>
