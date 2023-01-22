<script lang="ts">
  import LineClamp from './LineClamp.svelte';

  let warns: string[];

  // console.warn(`sendCode(): ${JSON.stringify(data)}`);
  const console: Console = (function (oldCons) {
    return {
      ...oldCons,
      warn: function (text) {
        oldCons.warn(text);
        warns.push(text);
      },
    };
  })(window.console);

  window.console = console;
</script>

<div id="console">
  {#if warns}
    {#each warns as warn}
      <LineClamp lines={5}>
        <p class="text-orange-500 text-sm">{warn}</p>
      </LineClamp>
    {/each}
  {/if}
</div>
