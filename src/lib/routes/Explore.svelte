<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';
  import { push } from 'svelte-spa-router';

  import Button from '@/ui/components/buttons/Button.svelte';
  import InputRow from '@/ui/components/form/InputRow.svelte';
  import SelectRow from '@/ui/components/form/SelectRow.svelte';
  import ListHeader from '@/ui/components/list/ListHeader.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { IconSearch } from '@/ui/icons';

  import { masto } from '@/lib/services';
  import TagItem from '../components/TagItem.svelte';

  const types = [
    { id: 'statuses', label: 'Status' },
    { id: 'hashtags', label: 'Tag' },
    { id: 'accounts', label: 'Account' },
  ];

  let keyword = '';
  let type = types[0].id;

  $: tags = createQuery<mastodon.v1.Tag[]>({
    queryKey: ['trend-tags'],
    queryFn: async () =>
      !!$masto &&
      (await $masto.v1.trends.listTags({
        limit: 15,
      })),
  });
</script>

<View>
  <ViewHeader title="Explore" />
  <ViewContent>
    <SelectRow label="Type" value={type} options={types} onChange={(val) => (type = val.toString())} />
    <InputRow icon={IconSearch} placeholder="Enter keyword..." onChange={(val) => (keyword = val)} />
    <Button
      title="Search"
      disabled={!!(keyword === '')}
      navi={{
        itemId: 'BUTTON_SEARCH',
        onSelect: async () => push(`/search/?type=${type}&keyword=${keyword}`),
      }}
    />
    {#if $tags.isLoading}
      <Typography align="center">Loading...</Typography>
    {/if}
    {#if $tags.error}
      <Typography align="center">Error!</Typography>
    {/if}
    {#if $tags.isSuccess}
      <ListHeader title="Hot Topics" />
      {#each $tags.data as tag, i}
        <TagItem {tag} index={i} />
      {/each}
    {/if}
  </ViewContent>
</View>
