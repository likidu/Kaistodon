<script lang="ts">
  import { v4 as uuidv4 } from 'uuid';

  import { focus } from '../../actions/focus';
  import NavItem from '../nav/NavItem.svelte';

  export let value: string;
  export let stopAddingText = false;
  export let placeholder: string = undefined;
  export let disabled = false;
  export let onSubmit: () => void = undefined;

  const itemId = uuidv4();

  let focused = false;
</script>

<NavItem
  {disabled}
  navi={{
    itemId,
    onFocus: () => (focused = true),
    onBlur: () => (focused = false),
    onSelect: () => onSubmit?.(),
  }}
>
  {#if value?.length === 0 && !focused}
    <div class="placeholder" use:focus={{ focused }}>
      {placeholder}
    </div>
  {:else}
    <div
      class="input"
      role="textbox"
      contenteditable
      use:focus={{ focused }}
      bind:innerHTML={value}
      on:keydown={(ev) => {
        if (stopAddingText) ev.preventDefault();
        if (ev.key === 'Enter') {
          document.execCommand('defaultParagraphSeparator', false, 'p');
        }
      }}
    />
  {/if}
</NavItem>

<style>
  .input,
  .placeholder {
    min-height: 24px;
    min-width: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    outline: none;
    padding: 5px;
    margin: 0 5px;
    border-bottom: 2px solid var(--accent-color);
  }
  .placeholder {
    opacity: 0.3;
  }
</style>
