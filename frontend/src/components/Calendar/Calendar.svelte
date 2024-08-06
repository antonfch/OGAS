<script lang="ts">
  import {
    today,
    getLocalTimeZone,
    getDayOfWeek,
  } from "@internationalized/date";
  import { Button } from "$lib/components/ui/button";
  import { onMount, afterUpdate } from "svelte";

  const semaine = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  let list: any[] = [];
  let date = today(getLocalTimeZone());
  let dayOfWeek = getDayOfWeek(date, "fr-FR");
  let Event = "";

  function updateList() {
    dayOfWeek = getDayOfWeek(date, "fr-FR");
    let startDate = date.subtract({ days: dayOfWeek });

    for (let i = 0; i < 7; i++) {
      if (localStorage.getItem(startDate.add({ days: i }).toString())) {
        Event =
          localStorage.getItem(startDate.add({ days: i }).toString()) ?? "";
      } else {
        Event = "";
      }
      let dateInc = startDate.add({ days: i });

      let obj = {
        week: semaine[i],
        day: dateInc.day.toString(),
        month: months[dateInc.month - 1],
        event: Event,
        id: dateInc.toString(),
      };
      list[i] = obj;
    }
  }

  function addEvent(id: string) {
    let index = list.findIndex((item) => item.id === id);

    const added = (list[index].event =
      `nous sommes le ${list[index].week} ${list[index].day} ${list[index].month}`);
    localStorage.setItem(id, added);
  }

  function nextWeek() {
    date = date.add({ days: 7 });

    updateList();
  }

  function previousWeek() {
    date = date.subtract({ days: 7 });

    updateList();
  }

  updateList();
</script>

<div class="flex flex-col gap-5 p-5 h-screen">
  <div class="flex justify-between">
    <Button on:click={previousWeek}>Previous</Button>
    <h1 class="text-2xl">
      {months[date.month - 1] + " " + date.year.toString()}
    </h1>
    <Button on:click={nextWeek}>Next</Button>
  </div>

  <div class="flex gap-3 justify-between">
    {#each list as day}
      <div class="w-full bg-card border border-border rounded-md px-5 py-3">
        <p class=" text-lg lg:text-xl">{day.week}</p>

        <p class=" text-muted-foreground text-xs">
          {day.day}
          {day.month}
        </p>

        <p class="text-sm">{day.event}</p>
        <div class="flex justify-end">
          <Button on:click={() => addEvent(day.id)}>Add Event</Button>
        </div>
      </div>
    {/each}
  </div>
</div>
