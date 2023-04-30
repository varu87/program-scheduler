<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let currentDate: number | "";
  export let programName: string;
  export let month: string;
  export let currentYear: number;

  const dispatch = createEventDispatcher();

  const handleDateButtonClick = () => {
    dispatch("displayDayProgram", {
      date: `${currentDate} ${month} ${currentYear}`,
      programName,
    });
  };
</script>

{#if Boolean(currentDate)}
  <button
    class="competition-details"
    title="Program for {currentDate} {month} {currentYear}"
    class:highlight={Boolean(currentDate)}
    on:click={handleDateButtonClick}
  >
    <span class="competition-date">
      {currentDate}
    </span>
    <span class="competition-name">
      {programName}
    </span>
  </button>
{/if}

<style>
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
    .competition-details {
      width: 45px;
      height: 45px;
    }
    .competition-name {
      overflow: auto;
    }
  }
</style>
