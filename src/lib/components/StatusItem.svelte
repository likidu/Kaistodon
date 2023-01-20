<script lang="ts">
  import { useQueryClient } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';
  import { push } from 'svelte-spa-router';
  import Time from 'svelte-time';

  import Icon from '@/ui/components/icon/Icon.svelte';
  import ListItem from '@/ui/components/list/ListItem.svelte';
  import { Color, IconSize, Layout } from '@/ui/enums';
  import { IconComment, IconLinkExternal, IconReply, IconStar, IconUser } from '@/ui/icons';
  import { Onyx } from '@/ui/services';
  import { delay } from '@/ui/utils/delay';

  import PhotoSlider from '@/lib/components/PhotoSlider.svelte';
  import { masto } from '@/lib/services';

  export let queryKey: string = undefined;
  export let status: mastodon.v1.Status;
  // If it's a sub item (reply) in the Toot thread
  export let sub = false;
  // If it's a sup item (original) in the Toot thread
  export let sup = false;
  export let layout: Layout = Layout.Row;

  const queryClient = useQueryClient();

  const { links } = parseHtml(status.content);

  function parseHtml(html: string): { seralized: string; links: string[] } {
    let links = [];

    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');

    const ellipsises = dom.querySelectorAll('span.ellipsis');
    if (ellipsises.length > 0) {
      ellipsises.forEach((ellipsis) => {
        const a = ellipsis.parentElement;
        // Push href to array for displaying in context menu
        links.push(a.attributes['href'].value);
        // Stylize the link
        const el = ellipsis as HTMLElement;
        el.innerText += '...';
        el.style.color = 'var(--accent-color)';
        // Replace the a tag with span.ellipsis
        a.replaceWith(el);
      });
    }

    const tags = dom.querySelectorAll('a.mention.hashtag');
    if (tags.length > 0) {
      tags.forEach((tag) => {
        // Push href to array for displaying in context menu
        links.push(tag.attributes['href'].value);
        // Get the tag name
        const text = tag.querySelector('span').innerText;
        // Create and add new element
        tag.insertAdjacentHTML('afterend', `<span style="color: var(--accent-color)">#${text}</span>`);
        // Remove the original tag link
        tag.remove();
      });
    }

    // Convert dom back to string
    const seralized = dom.getElementsByTagName('body')[0].innerHTML;
    return { seralized, links };
  }

  async function reblog() {
    if (!status.reblogged) {
      try {
        await $masto.v1.statuses.reblog(status.id);
      } catch (error) {}
    } else {
      try {
        await $masto.v1.statuses.unreblog(status.id);
      } catch (error) {}
    }
    if (queryKey) queryClient.invalidateQueries({ queryKey: [queryKey] });
  }

  async function fav() {
    if (!status.favourited) {
      try {
        await $masto.v1.statuses.favourite(status.id);
      } catch (error) {}
    } else {
      try {
        await $masto.v1.statuses.unfavourite(status.id);
      } catch (error) {}
    }
    if (queryKey) queryClient.invalidateQueries({ queryKey: [queryKey] });
  }

  function linkItems() {
    const contentLinks = links.map((link) => {
      return {
        label: link,
        workingLabel: 'Opening URL...',
        icon: IconLinkExternal,
        onSelect: async () => {
          // TODO: Update KaiOS lib to support this type
          // @ts-ignore: next line
          const view = new WebActivity('view', {
            type: 'url',
            url: links[0],
          });
          view.start();
          await delay(1000);
        },
      };
    });
    return [
      {
        label: `${status.account.acct}`,
        icon: IconUser,
        onSelect: () => push(`/account/${status.account.id}`),
      },
      ...contentLinks,
    ];
  }
</script>

<ListItem
  {layout}
  imageUrl={status.account.avatarStatic}
  imageSize={sub && IconSize.Small}
  titleText={status.account.displayName}
  navi={{
    itemId: `STATUS-${status.id}`,
    onSelect: () => {
      if (status.repliesCount > 0 && !sub) push(`/toot/${status.id}`);
    },
  }}
  contextMenu={// Context menu only enabled when queryKey is available
  queryKey && {
    title: `${status.account.displayName}'s Toot`,
    shortcuts: [
      {
        label: status.reblogged ? 'Unreblog' : 'Reblog',
        icon: IconReply,
        onSelect: () => {
          reblog();
          Onyx.contextMenu.close();
        },
      },
      {
        label: status.favourited ? 'Unfav' : 'Fav',
        icon: IconStar,
        onSelect: () => {
          fav();
          Onyx.contextMenu.close();
        },
      },
      {
        label: 'Reply',
        icon: IconComment,
        onSelect: () => {},
      },
    ],
    items: linkItems(),
  }}
>
  <svelte:fragment slot="subtitle">
    {status.account.acct} &bull <Time relative timestamp={status.createdAt} />
  </svelte:fragment>
  <div class="status-content" style={sup && 'font-size: 1.6rem'} slot="content">
    {@html parseHtml(status.content).seralized}
  </div>
  <div slot="bottom">
    {#if status.mediaAttachments.length > 0}
      <PhotoSlider photos={status.mediaAttachments} />
    {/if}
    <section class="stats">
      <div class="item">
        <Icon size={IconSize.Smallest} color={status.reblogged ? Color.Supplementary : Color.Secondary}>
          <IconReply />
        </Icon>
        <span>{status.reblogsCount}</span>
      </div>
      <div class="item">
        <Icon size={IconSize.Smallest} color={status.favourited ? Color.Supplementary : Color.Secondary}>
          <IconStar />
        </Icon>
        <span>{status.favouritesCount}</span>
      </div>
      <div class="item">
        <Icon size={IconSize.Smallest} color={Color.Secondary}><IconComment /></Icon>
        <span>{status.repliesCount}</span>
      </div>
    </section>
  </div>
</ListItem>

<style global lang="postcss">
  /* Margin top of innerHTML paragraph */
  .status-content > p:not(:first-child) {
    @apply mt-2;
  }
</style>
