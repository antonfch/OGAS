<script lang="ts">
  import { onMount } from "svelte";

  import axios from "axios";

  let data: any;

  onMount(async () => {
    const response: any = await axios
      .get("http://localhost:3000/Test")
      .then((response) => {
        console.log(response.data[0]);

        data = response.data[0].text;
      })
      .catch((error) => {
        console.log(error);
      });
  });
</script>

<h1>hello world</h1>
<h2>{data}</h2>
