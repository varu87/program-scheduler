<script lang="ts">
  import { createEventDispatcher } from "svelte";

  let selectedYear: number | null = null;

  const numRows = 4;
  const numCols = 3;

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - Math.ceil((numRows * numCols) / 2);
  const years = [...Array(numRows * numCols).keys()].map((y) => startYear + y);

  const grid: number[][] = [];

  for (let i = 0; i < numRows; i++) {
    const row: number[] = [];

    for (let j = 0; j < numCols; j++) {
      const index = i * numCols + j;

      if (index < years.length) {
        row.push(years[index]);
      }
    }

    grid.push(row);
  }

  const dispatch = createEventDispatcher();

  const handleCloseButtonClick = () => {
    dispatch("closeButtonClicked");
  };

  const handleYearButtonClick = (year: number) => {
    selectedYear = year;
    dispatch("yearButtonClicked", {
      year,
    });
  };
</script>

<section>
  <div class="header">
    <button on:click={handleCloseButtonClick}>x</button>
  </div>
  {#each grid as row}
    <div class="row">
      {#each row as cell}
        <div
          class="cell"
          class:currentYear={cell === currentYear}
          class:selectedYear={cell === selectedYear && cell !== currentYear}
        >
          <button on:click={() => handleYearButtonClick(cell)}>{cell}</button>
        </div>
      {/each}
    </div>
  {/each}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    background: var(--grey);
    align-items: center;
    padding: 35px 10px 10px;
    border: 1px solid var(--black);
    border-radius: 5px;
    color: var(--blue);
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  }
  .header {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  .header button {
    background: none;
    /* border: 1px solid var(--black); */
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: 50%;
    padding: 0 6px 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.25s;
  }
  /* .header button:hover {
    background: rgba(0, 0, 0, 0.3);
    color: var(--grey);
    border: none;
  } */
  .row {
    display: flex;
  }
  .cell {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--black);
    width: 75px;
    height: 45px;
    border-radius: unset;
  }
  .cell button {
    border: none;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: unset;
  }
  .cell.currentYear button {
    background: var(--blue);
    color: var(--grey);
  }
  .cell.selectedYear button {
    background: var(--white);
  }
</style>
