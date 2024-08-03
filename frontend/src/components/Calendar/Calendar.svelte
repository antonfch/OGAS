<script lang="ts">
  import {
    today,
    getLocalTimeZone,
    getDayOfWeek,
    CalendarDate,
  } from "@internationalized/date";
  import { Button } from "$lib/components/ui/button";
  import { get } from "svelte/store";

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

  let list: any = [];
  let date = today(getLocalTimeZone());
  let dayOfWeek = getDayOfWeek(date, "fr-FR");

  let startDate = date.subtract({ days: dayOfWeek });
  for (let i = 0; i < 7; i++) {
    let dateInc = startDate.add({ days: i });
    list.push(
      semaine[i] +
        " " +
        dateInc.day.toString() +
        " " +
        months[dateInc.month - 1]
    );
  }

  function updateList() {
    list = [];

    for (let i = 0; i < 7; i++) {
      let dateInc = startDate.add({ days: i });
      list.push(
        semaine[i] +
          " " +
          dateInc.day.toString() +
          " " +
          months[dateInc.month - 1]
      );
    }
  }

  function nextWeek() {
    date = date.add({ days: 7 });
    updateList();
  }

  function previousWeek() {
    date = date.subtract({ days: 7 });
    updateList();
  }
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
        <p class=" text-lg lg:text-xl">{day.split(" ")[0]}</p>

        <p class=" text-muted-foreground text-xs">
          {" " + day.split(" ").slice(1).join(" ")}
        </p>
      </div>
    {/each}
  </div>
</div>
