<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";

  export let showModal = false;
  export let title: string;
  export let size: "FULL_SCREEN" | null = null;
  const dispatch = createEventDispatcher();

  const handleCloseButtonClicked = () => {
    dispatch("closeModal");
  };
</script>

{#if showModal}
  <section
    class:fullscreen={size === "FULL_SCREEN"}
    transition:fly={{ y: -200, duration: 250 }}
  >
    <article>
      <header>
        <div class="title">{title}</div>
        <button class="close" on:click={handleCloseButtonClicked}
          >&times;</button
        >
      </header>
      <slot />
    </article>
  </section>
{/if}

<style>
  section {
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
  }
  article {
    background-color: #fefefe;
    margin: auto;
    border: 1px solid #888;
    width: 80%;
  }
  section.fullscreen {
    padding-top: 0;
  }
  section.fullscreen article {
    margin: 0;
    width: 100%;
    min-height: 100%;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    background: var(--blue);
    color: var(--white);
    padding: 10px;
  }
  header .title {
    flex: 1;
    font-size: 1.1rem;
    font-weight: bold;
  }
  .close {
    color: var(--white);
    font-size: 1.1rem;
    font-weight: bold;
    background: none;
    border: none;
    cursor: pointer;
  }
</style>
