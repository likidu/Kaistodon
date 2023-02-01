<script lang="ts">
  import type { mastodon } from 'masto';
  import { push } from 'svelte-spa-router';

  import { Alignment } from '@/ui/enums';

  import ListItem from '@/ui/components/list/ListItem.svelte';

  export let profile: mastodon.v1.Account;
  export let nofocus = false;
</script>

<ListItem
  imageUrl={profile.avatarStatic}
  align={Alignment.Top}
  titleText={profile.displayName === '' ? profile.username : profile.displayName}
  subtitleText={profile.url}
  navi={{ itemId: profile.id, onSelect: () => push(`/account/${profile.id}`) }}
  {nofocus}
/>
