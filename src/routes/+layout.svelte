<main>
  <slot />
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Karla&family=Unica+One&display=swap");

  :global(:root) {
    --black: #2f2f2f;
    --white: #fff;
    --grey: #f5f8ff;
    --lightGrey: #eee;
    --green: #a6c236;
    --orange: #c27a36;
    --blue: #16384c;
  }

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Karla", sans-serif;
  }

  main {
    min-height: 100vh;
  }
</style>
