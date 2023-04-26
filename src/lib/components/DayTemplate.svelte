<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { MONTHS } from "$lib/Constants";
  import { programData } from "$lib/store";

  const dispatch = createEventDispatcher();
  export let selectedDate: string;
  export let selectedDateProgram: string | null;

  let programName = selectedDateProgram ?? "";

  const dateParts = selectedDate.split(" ");
  const selectedDateDay = String(dateParts[0]).padStart(2, "0");
  const selectedDateMonth = String(MONTHS.indexOf(dateParts[1]) + 1).padStart(
    2,
    "0"
  );
  const selectedDateYear = dateParts[2];
  const selectedDateString = `${selectedDateYear}-${selectedDateMonth}-${selectedDateDay}`;

  const handleAssignButtonClick = () => {
    if (programName && programName.trim().length > 0) {
      const existingProgram = $programData.filter(
        (p) => p.dateString === selectedDateString
      );
      if (existingProgram && existingProgram.length > 0) {
        existingProgram[0].name = programName;
        $programData = [...$programData, existingProgram[0]];
      } else {
        $programData = [
          ...$programData,
          {
            date: new Date(selectedDate),
            dateString: selectedDateString,
            name: programName,
          },
        ];
      }
      dispatch("dayTemplateCloseButtonClicked");
    }
  };

  const handleCloseButtonClick = () => {
    dispatch("dayTemplateCloseButtonClicked");
  };
</script>

<section>
  <article>
    <label for="programName">Program Name</label>
    <input id="programName" bind:value={programName} />
    <div class="actions">
      <button on:click={handleAssignButtonClick}>Apply</button>
      <button on:click={handleCloseButtonClick}>Close</button>
    </div>
  </article>
</section>

<style>
  section {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  article {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    padding: 20px;
    max-width: 1024px;
  }
  label {
    font-weight: bold;
  }
  input {
    width: 100%;
    padding: 5px;
  }
  input:focus {
    outline: none;
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
