<script lang="ts">
  import { slide } from "svelte/transition";
  import { DAYS, MONTHS } from "../Constants";
  import { programData, templateData } from "../store";

  export let day: number;
  export let month: number | null = null;
  export let year: number;

  let expanded = false;

  const dayName = DAYS[day].name;

  const ALL_DAYS_KEY = `ALL_${month !== null ? month : "ALL"}_${day}`;
  const FIRST_DAYS_KEY = `FIRST_${month !== null ? month : "ALL"}_${day}`;
  const SECOND_DAYS_KEY = `SECOND_${month !== null ? month : "ALL"}_${day}`;
  const THIRD_DAYS_KEY = `THIRD_${month !== null ? month : "ALL"}_${day}`;
  const FOURTH_DAYS_KEY = `FOURTH_${month !== null ? month : "ALL"}_${day}`;
  const FIFTH_DAYS_KEY = `FIFTH_${month !== null ? month : "ALL"}_${day}`;

  const getTemplateByKey = (key: string) => {
    return $templateData.filter((t) => t.key === key);
  };

  const getTemplateDataByKey = (key: string) => {
    const d = getTemplateByKey(key);
    if (d && d.length > 0) {
      return d[0].value;
    } else return "";
  };

  let all: string = getTemplateDataByKey(ALL_DAYS_KEY);
  let first: string = getTemplateDataByKey(FIRST_DAYS_KEY);
  let second: string = getTemplateDataByKey(SECOND_DAYS_KEY);
  let third: string = getTemplateDataByKey(THIRD_DAYS_KEY);
  let fourth: string = getTemplateDataByKey(FOURTH_DAYS_KEY);
  let fifth: string = getTemplateDataByKey(FIFTH_DAYS_KEY);

  $: allTemplateData = [
    {
      key: ALL_DAYS_KEY,
      data: all,
    },
    {
      key: FIRST_DAYS_KEY,
      data: first,
    },
    {
      key: SECOND_DAYS_KEY,
      data: second,
    },
    {
      key: THIRD_DAYS_KEY,
      data: third,
    },
    {
      key: FOURTH_DAYS_KEY,
      data: fourth,
    },
    {
      key: FIFTH_DAYS_KEY,
      data: fifth,
    },
  ];

  const setTemplateData = (key: string, value: string) => {
    const d = getTemplateByKey(key);
    if (d && d.length > 0) {
      d[0].value = value;
      $templateData = [...$templateData, d[0]];
    } else {
      $templateData = [...$templateData, { key, value }];
    }
  };

  const saveTemplate = () => {
    allTemplateData.map((t) => {
      if (t.data.trim().length > 0) {
        setTemplateData(t.key, t.data);
      }
    });
  };

  const handleAllInput = (value: string) => {
    first = second = third = fourth = fifth = value;
  };

  const assignByMonth = (monthIndex: number) => {
    const startDate = new Date(year, monthIndex, 1);
    const startDayOfWeek = startDate.getDay();

    if (startDayOfWeek !== day) {
      if (startDayOfWeek > day) {
        startDate.setDate(startDate.getDate() + 7 - (startDayOfWeek - day));
      } else if (startDayOfWeek < day) {
        startDate.setDate(startDate.getDate() + (day - startDayOfWeek));
      }
    }

    const programForMonth = [first, second, third, fourth, fifth].map(
      (data, index) => {
        if (index > 0) startDate.setDate(startDate.getDate() + 7);
        return {
          date: new Date(startDate),
          dateString: `${startDate.getFullYear()}-${String(
            startDate.getMonth() + 1
          ).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`,
          name: data,
        };
      }
    );
    return programForMonth.filter(
      (p) => p.date.getMonth() === monthIndex && p.name
    );
  };

  export const assign = () => {
    saveTemplate();
    if (month === null) {
      MONTHS.map((_, monthIndex) => {
        const monthProgram = assignByMonth(monthIndex);
        monthProgram.map((p) => {
          const existingProgramData = $programData.filter(
            (d) => d.dateString === p.dateString
          );
          if (existingProgramData.length > 0) {
            existingProgramData[0].name = p.name;
            $programData = [...$programData, existingProgramData[0]];
          } else {
            $programData = [...$programData, p];
          }
        });
      });
    } else {
      const monthProgram = assignByMonth(month);
      monthProgram.map((p) => {
        const existingProgramData = $programData.filter(
          (d) => d.dateString === p.dateString
        );
        if (existingProgramData.length > 0) {
          existingProgramData[0].name = p.name;
          $programData = [...$programData, existingProgramData[0]];
        } else {
          $programData = [...$programData, p];
        }
      });
    }
  };
</script>

<section>
  <div>
    <button on:click={() => (expanded = !expanded)}>
      {expanded ? "-" : "+"}
    </button>
    <span>
      <p>Every {dayName} of {month !== null ? MONTHS[month] : year}</p>
      <p>
        <input
          type="text"
          bind:value={all}
          on:input={(e) => handleAllInput(e.currentTarget.value)}
        />
      </p>
    </span>
  </div>
  {#if expanded}
    <ul class="wtree" transition:slide>
      <li>
        <span>
          First {dayName} of {month !== null ? MONTHS[month] : "every month"}
        </span>
        <input
          type="text"
          value={first || all || ""}
          on:input={(e) => (first = e.currentTarget.value)}
        />
      </li>
      <li>
        <span>
          Second {dayName} of {month !== null ? MONTHS[month] : "every month"}
        </span>
        <input
          type="text"
          value={second || all || ""}
          on:input={(e) => (second = e.currentTarget.value)}
        />
      </li>
      <li>
        <span>
          Third {dayName} of {month !== null ? MONTHS[month] : "every month"}
        </span>
        <input
          type="text"
          value={third || all || ""}
          on:input={(e) => (third = e.currentTarget.value)}
        />
      </li>
      <li>
        <span>
          Fourth {dayName} of {month !== null ? MONTHS[month] : "every month"}
        </span>
        <input
          type="text"
          value={fourth || all || ""}
          on:input={(e) => (fourth = e.currentTarget.value)}
        />
      </li>
      <li>
        <span>
          Fifth {dayName} (if any) of {month !== null
            ? MONTHS[month]
            : "every month"}
        </span>
        <input
          type="text"
          value={fifth || all || ""}
          on:input={(e) => (fifth = e.currentTarget.value)}
        />
      </li>
    </ul>
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }
  section div {
    display: flex;
    gap: 10px;
    align-items: start;
  }
  section div button {
    background: none;
    cursor: pointer;
    border-radius: 50%;
    display: flex;
    padding: 0px 5px;
    font-size: 1rem;
    border: 1px solid var(--black);
  }
  section div span {
    flex: 1;
  }
  input {
    width: 100%;
    padding: 5px;
  }
  input:focus {
    outline: none;
  }
  .wtree li {
    list-style-type: none;
    margin: 10px 0 10px 60px;
    position: relative;
    display: flex;
    flex-direction: column;
    padding-left: 5px;
  }
  .wtree li:before {
    content: "";
    counter-increment: item;
    position: absolute;
    top: -5px;
    left: -30px;
    border-left: 1px solid var(--black);
    border-bottom: 1px solid var(--black);
    width: 30px;
    height: 15px;
  }
  .wtree li:after {
    position: absolute;
    content: "";
    top: 10px;
    left: -30px;
    border-left: 1px solid var(--black);
    border-top: 1px solid var(--black);
    width: 30px;
    height: 100%;
  }
  .wtree li:last-child:after {
    display: none;
  }
</style>
