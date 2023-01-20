<script lang="ts">
  import LineClamp from './LineClamp.svelte';

  let warn: string;

  // console.warn(`sendCode(): ${JSON.stringify(data)}`);
  const console = (function (oldCons) {
    return {
      ...oldCons,
      warn: function (text) {
        oldCons.warn(text);
        warn = text;
      },
    };
  })(window.console);

  window.console = console;
</script>

<div id="console">
  {#if warn}
    <LineClamp lines={5}>
      <p class="text-orange-500 text-sm">{warn}</p>
    </LineClamp>
  {/if}
</div>
