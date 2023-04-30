<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { DAYS } from "../constants";
  import WeekTemplate from "./WeekTemplate.svelte";

  const dispatch = createEventDispatcher();
  export let month: number | null = null;
  export let year: number;

  let children: WeekTemplate[] = [];

  const handleAssignButtonClick = () => {
    children.map((child) => {
      child.assign();
    });
    dispatch("monthTemplateCloseButtonClicked");
  };

  const handleCloseButtonClick = () => {
    dispatch("monthTemplateCloseButtonClicked");
  };
</script>

<section>
  {#each DAYS as _, index}
    <WeekTemplate day={index} {month} {year} bind:this={children[index]} />
  {/each}
  <div class="actions">
    <button on:click={handleAssignButtonClick}>Apply</button>
    <button on:click={handleCloseButtonClick}>Close</button>
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    padding: 30px;
  }
  .actions {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  .actions button {
    padding: 10px;
    background: var(--blue);
    color: var(--white);
    cursor: pointer;
    transition: 0.25s;
    border-radius: 5px;
    border: none;
    letter-spacing: 1px;
  }
  .actions button:hover {
    background: var(--black);
  }
</style>
