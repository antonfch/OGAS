<script lang="ts">
  import { today, getLocalTimeZone, Time } from "@internationalized/date";
  import { Button } from "$lib/components/ui/button";
  import { Tooltip, Button as FlowButton } from "flowbite-svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import ChevronLeft from "lucide-svelte/icons/chevron-left";
  import ChevronRight from "lucide-svelte/icons/chevron-right";
  import interact from "interactjs";
  import { onMount } from "svelte";
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
  let storetoHour: string = "";
  let storeHour: string = "";

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

        id: date.add({ days: i }).toString(),
      };
      list[i] = obj;
    }
  }

  function addEvent(id: string, hour: string, tohour: string) {
    let index = list.findIndex((item) => item.id === id);
    storetoHour = tohour;
    storeHour = hour;

    let obj = {
      id: Math.random().toString(16).slice(2),
      day: id,
      hour: storeHour,
      tohour: storetoHour,
    };

    Event.push(obj);
    list[index].event = Event;

    clickedButtons.add(`${id}-${hour}`);
    clickedButtons = clickedButtons;
    console.log(storetoHour);
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

    interact(".Expand").resizable({
      edges: {
        bottom: ".edge-bottom",
      },

      modifiers: [
        interact.modifiers.snapSize({
          targets: [interact.snappers.grid({ width: 20, height: 20 })],
        }),
        interact.modifiers.restrictRect({
          restriction: ".Limit",
        }),
      ],

      listeners: {
        move: function (event) {
          let { y } = event.target.dataset;
          let position = inputHours.findIndex((hour) => hour === storetoHour);

          if (event.deltaRect.width > 0 || event.deltaRect.height > 0) {
            position++;

            storetoHour = inputHours[position];
            updateList();
          } else if (event.deltaRect.width < 0 || event.deltaRect.height < 0) {
            position--;

            storetoHour = inputHours[position];
            updateList();
          }

          Object.assign(event.target.style, {
            height: `${event.rect.height}px`,
            transform: `translate( ${y}px)`,
          });

          Object.assign(event.target.dataset, { y });
        },
      },
    });
  });
  interact(".Draggable").draggable({
    startAxis: "y",
    lockAxis: "y",
    modifiers: [
      interact.modifiers.snapSize({
        targets: [interact.snappers.grid({ width: 20, height: 20 })],
      }),
      interact.modifiers.restrictRect({
        restriction: ".Limit",
      }),
    ],
    listeners: {
      move(event) {
        let { x, y } = event.target.dataset;
        let tohourPosition = inputHours.findIndex(
          (hour) => hour === storetoHour
        );
        let hourPosition = inputHours.findIndex((hour) => hour === storeHour);

        x = (parseFloat(x) || 0) + event.dx;
        y = (parseFloat(y) || 0) + event.dy;

        Object.assign(event.target.style, {
          transform: `translate(${x}px, ${y}px)`,
        });

        Object.assign(event.target.dataset, { y });
      },
    },
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
            <div class="Limit">
              {#each inputHours as inputHour, index}
                <div
                  class={Math.floor(index - 1) % 2 === 0
                    ? "  border-b border-border bg-input border-r bg-opacity-35 h-5 w-10 flex justify-center"
                    : " bg-input border-border border-r bg-opacity-35 h-5 w-10 flex justify-center"}
                >
                  <div>
                    <div
                      class="Event Draggable relative rounded-full transition-opacity opacity-0 hover:opacity-50 flex flex-col items-center justify-center mt-1"
                      class:opacity-100={clickedButtons.has(
                        `${day.id}-${inputHour}`
                      )}
                      class:hover:opacity-50={!clickedButtons.has(
                        `${day.id}-${inputHour}`
                      )}
                      class:z-10={clickedButtons.has(`${day.id}-${inputHour}`)}
                    >
                      <FlowButton>
                        <div class="flex flex-col items-center">
                          <button
                            class=" bg-white rounded-full"
                            on:click={() => {
                              addEvent(
                                day.id,
                                inputHour,
                                inputHours[index + 2]
                              );
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

                          <div class="Expand relative bg-white p-1 h-5 w-2">
                            <div
                              class=" absolute bottom-[-15px] right-[-4px] edge-bottom p-2 bg-white rounded-full"
                            />
                          </div>
                        </div>
                      </FlowButton>
                      {#if clickedButtons.has(`${day.id}-${inputHour}`)}
                        <Tooltip class=" bg-white p-1 rounded-xl ">
                          {#each day.event as event}
                            {#if event.hour === inputHour && event.day === day.id}
                              <div class="flex">
                                <p class="text-xs text-black z-0">
                                  {event.hour}
                                </p>
                                <p class="text-xs text-black z-0">-</p>
                                <p
                                  contenteditable="true"
                                  bind:textContent={storetoHour}
                                  class="text-xs text-black z-0"
                                />
                              </div>
                            {/if}
                          {/each}
                        </Tooltip>
                      {/if}
                    </div>
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
