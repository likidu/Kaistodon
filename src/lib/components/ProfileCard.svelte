<script lang="ts">
  import type { mastodon } from 'masto';
  import Time from 'svelte-time';

  import Icon from '@/ui/components/icon/Icon.svelte';
  import NavItem from '@/ui/components/nav/NavItem.svelte';
  import { Color, IconSize } from '@/ui/enums';
  import { IconCheck } from '@/ui/icons';

  export let profile: mastodon.v1.Account;
  export let relationship: mastodon.v1.Relationship = undefined;
</script>

<div>
  <figure class="profile-background" style={`background-image: url(${profile.headerStatic});`} />
  <NavItem
    nofocus={true}
    navi={{
      itemId: 'USER_PROFILE',
    }}
  >
    <div class="profile">
      <figure class="flex items-end justify-between">
        <img src={profile.avatarStatic} alt={profile.acct} class="w-32 h-32 rounded-3xl" />
        {#if relationship}
          <figcaption>
            {#if relationship.following}
              <div class="following">
                <Icon size={IconSize.Smallest} color={Color.Secondary}><IconCheck /></Icon>
                <span>Following</span>
              </div>
            {:else}
              <div class="following">
                <span>Not following</span>
              </div>
            {/if}
          </figcaption>
        {/if}
      </figure>
      <h1>{profile.username}</h1>
      <h2>@{profile.acct}</h2>
      <section class="note">{@html profile.note}</section>
      <p class="text-sm">Joined at <Time timestamp={profile.createdAt} /></p>
    </div>
    <div class="follower">
      <div>
        <p>Follower</p>
        <p>{profile.followersCount}</p>
      </div>
      <div>
        <p>Following</p>
        <p>{profile.followingCount}</p>
      </div>
      <div>
        <p>Posts</p>
        <p>{profile.statusesCount}</p>
      </div>
    </div>
  </NavItem>
</div>

<style lang="postcss">
  .profile-background {
    @apply w-full h-36;
    background-size: no-repeat center center / cover;
  }

  .profile {
    @apply px-3 -mt-20;
  }
  .profile > h2 {
    @apply font-bold text-secondary;
  }
  .profile > section {
    @apply text-secondary;
  }

  .follower {
    @apply grid grid-cols-3 divide-x text-sm mt-4;
  }
  .follower > div {
    @apply flex flex-col items-center;
  }
  .follower > div > p:first-child {
    @apply text-accent;
  }
  .follower > div > p:last-child {
    @apply text-base font-bold;
  }

  .following {
    @apply flex items-center place-content-center rounded-full border-2 px-3 py-0.5 font-bold text-xs text-secondary;
  }
</style>
