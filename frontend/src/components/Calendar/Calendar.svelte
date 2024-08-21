<script lang="ts">
  import { today, getLocalTimeZone, Time } from "@internationalized/date";
  import { Button } from "$lib/components/ui/button";
  import { Tooltip, Button as FlowButton } from "flowbite-svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import ChevronLeft from "lucide-svelte/icons/chevron-left";
  import ChevronRight from "lucide-svelte/icons/chevron-right";
  import interact from "interactjs";
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
  let clickedButtons: Set<string> = new Set();

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

  function addEvent(id: string, hour: string, tohour: string) {
    let index = list.findIndex((item) => item.id === id);

    let obj = {
      id: Math.random().toString(16).slice(2),
      day: id,
      hour: hour,
      tohour: tohour,
    };
    list[index].event = Event;
    Event.push(obj);

    clickedButtons.add(`${id}-${hour}`);
    clickedButtons = clickedButtons;

    console.log(list);
  }

  function modifyEvent(id: string, hour: string, newToHour: string) {
    let event = Event.find((e) => e.id === id && e.hour === hour);
    if (event) {
      event.tohour = newToHour;
    }
  }

  function nextWeek() {
    date = date.add({ days: 3 });

    updateList();
  }

  function previousWeek() {
    date = date.subtract({ days: 3 });

    updateList();
  }

  onMount(() => {
    updateList();
    var x = 0;
    var y = 0;
    interact(".Expand").resizable({
      edges: { bottom: true },
      modifiers: [
        interact.modifiers.snapSize({
          targets: [
            { width: 25 },
            interact.snappers.grid({ width: 25, height: 25 }),
          ],
        }),
      ],

      listeners: {
        move: function (event) {
          let { x, y } = event.target.dataset;

          x = (parseFloat(x) || 0) + event.deltaRect.left;
          y = (parseFloat(y) || 0) + event.deltaRect.top;

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            transform: `translate(${x}px, ${y}px)`,
          });

          Object.assign(event.target.dataset, { x, y });
        },
      },
    });
  });
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
    <div class="w-1/7 bg-card border border-border py-3 m-3 rounded-xl">
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
        <div class="w-full bg-card border border-border m-3 rounded-xl">
          <div
            class={today(getLocalTimeZone()).toString() === day.id
              ? " border-b border-border bg-input bg-opacity-70 py-3 px-5"
              : "border-b   border-border py-3 px-5"}
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
                    ? "border-b border-border bg-input border-r bg-opacity-35 h-5 w-10 flex justify-center"
                    : "bg-input border-border border-r bg-opacity-35 h-5 w-10 flex justify-center"}
                >
                  <div>
                    <FlowButton>
                      <div
                        class="Event rounded-full transition-opacity opacity-0 hover:opacity-50 flex flex-col items-center justify-center mt-1"
                        class:opacity-100={clickedButtons.has(
                          `${day.id}-${inputHour}`
                        )}
                        class:hover:opacity-50={!clickedButtons.has(
                          `${day.id}-${inputHour}`
                        )}
                        class:z-10={clickedButtons.has(
                          `${day.id}-${inputHour}`
                        )}
                      >
                        <button
                          class=" bg-white rounded-full"
                          on:click={() => {
                            addEvent(day.id, inputHour, inputHours[index + 2]);
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

                        <button class="Expand bg-white p-1 h-4 w-2" />
                        <button class=" bg-white p-2 rounded-full h-full w-2" />
                      </div>
                    </FlowButton>
                    {#if clickedButtons.has(`${day.id}-${inputHour}`)}
                      <Tooltip class=" bg-white p-1 rounded-xl ">
                        {#each day.event as event}
                          {#if event.hour === inputHour && event.day === day.id}
                            <p class="text-xs text-black z-0">
                              {event.hour} - {event.tohour}
                            </p>
                          {/if}
                        {/each}
                      </Tooltip>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
            <div class="w-full">
              {#each inputHours as hour, index}
                <div
                  class={Math.floor(index - 1) % 2 === 0
                    ? "border-b border-border h-5 bg-card"
                    : "h-5 bg-card"}
                ></div>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
