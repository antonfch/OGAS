<script lang="ts">
  import {
    today,
    getLocalTimeZone,
    getDayOfWeek,
    Time,
  } from "@internationalized/date";
  import { Button } from "$lib/components/ui/button";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import ChevronLeft from "lucide-svelte/icons/chevron-left";
  import ChevronRight from "lucide-svelte/icons/chevron-right";
  import {
    onMount,
    afterUpdate,
    getContext,
    beforeUpdate,
    setContext,
  } from "svelte";
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

  let list: any[] = [];
  let date = today(getLocalTimeZone());

  let Event: any[] = [];
  let time = new Time(5);
  let listHours: any[] = [];
  let inputHours: any[] = [];
  for (let i = 0; i < 24; i++) {
    listHours.push(time.add({ hours: i }).toString());
  }
  for (let i = 0; i < 24; i++) {
    inputHours.push(time.add({ hours: i }).toString());
    inputHours.push(time.add({ hours: i, minutes: 30 }).toString());
  }

  let fulldatesplit: string[] = [];

  function updateList() {
    for (let i = 0; i < 3; i++) {
      let fulldate = date.add({ days: i }).toDate("Europe/Paris");
      fulldatesplit = fulldate.toString().split(" ");

      let obj = {
        week: fulldatesplit[0],
        day: fulldatesplit[2],
        month: fulldatesplit[1],
        event: Event,
        hours: inputHours,
        id: date.add({ days: i }).toString(),
      };
      list[i] = obj;
    }
  }

  onMount(() => {
    updateList();
  });

  function addEvent(id: string, hour: string, tohour: string) {
    let index = list.findIndex((item) => item.id === id);
    let Hour = list[index].hours.findIndex((item: string) => item === hour);
    let Tohour = list[index].hours.findIndex((item: string) => item === tohour);
    let obj = {
      day: id,
      hour: hour,
      tohour: tohour,
    };

    Event.push(obj);
    list[index].event = Event;
    console.log(list);
  }

  function nextWeek() {
    date = date.add({ days: 3 });

    updateList();
  }

  function previousWeek() {
    date = date.subtract({ days: 3 });

    updateList();
  }
</script>

<div class="flex flex-col gap-5 p-5 h-screen">
  <div class="flex justify-between">
    <h1 class="text-2xl">
      {months[date.month - 1] + " " + date.year.toString()}
    </h1>
    <div>
      <Button on:click={previousWeek}>
        <ChevronLeft class="bg-transparent p-0 opacity-50 hover:opacity-100" />
      </Button>
      <Button on:click={nextWeek}>
        <ChevronRight class="bg-transparent p-0 opacity-50 hover:opacity-100" />
      </Button>
    </div>
  </div>
  <div class=" flex w-full">
    <div class="w-1/7 bg-card border border-primary py-3">
      <p class="px-5 py-2 text-muted-foreground text-xs">{fulldatesplit[5]}</p>
      <div class=" py-6">
        {#each listHours as hours}
          <p
            class=" flex items-center px-5 h-10 border border-card text-muted-foreground text-xs"
          >
            {hours}
          </p>
        {/each}
      </div>
    </div>
    <div class="flex justify-between w-full">
      {#each list as day}
        <div class="w-full bg-card border-r border-t border-primary">
          <div
            class={today(getLocalTimeZone()).toString() === day.id
              ? " border-b border-primary bg-input bg-opacity-70 py-3 px-5"
              : "border-b   border-primary py-3 px-5"}
          >
            <p class=" text-lg lg:text-xl">{day.week}</p>

            <p class=" text-muted-foreground text-xs">
              {day.day}
              {day.month}
            </p>
          </div>
          <div class="flex">
            <div>
              {#each inputHours as inputHour, index}
                <div
                  class={Math.floor(index - 1) % 2 === 0
                    ? "border-b border-primary bg-input border-r bg-opacity-35 h-5 w-10 flex justify-center"
                    : "bg-input border-primary border-r bg-opacity-35 h-5 w-10 flex justify-center"}
                >
                  <button
                    class="opacity-0 hover:opacity-100"
                    on:click={() => {
                      addEvent(day.id, inputHour, inputHours[index + 1]);
                    }}
                  >
                    <Avatar.Root>
                      <Avatar.Image
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <Avatar.Fallback>CN</Avatar.Fallback>
                    </Avatar.Root>
                  </button>
                </div>
              {/each}
            </div>
            <div class="w-full">
              {#each inputHours as hour, index}
                <div
                  class={Math.floor(index - 1) % 2 === 0
                    ? "border-b border-primary h-5 bg-card"
                    : "h-5 bg-card"}
                >
                  {#each day.event as event}
                    {#if event.hour === hour && event.day === day.id}
                      <p class="text-xs">{event.hour}</p>
                    {:else if event.tohour === hour && event.day === day.id}
                      <p class="text-xs">{event.tohour}</p>
                    {/if}
                  {/each}
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
