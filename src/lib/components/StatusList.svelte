<script lang="ts">
  import type { QueryKey, UseInfiniteQueryStoreResult } from '@sveltestack/svelte-query';
  import type { mastodon } from 'masto';
  import Time from 'svelte-time';

  import Button from '@/ui/components/buttons/Button.svelte';
  import Icon from '@/ui/components/icon/Icon.svelte';
  import ListItem from '@/ui/components/list/ListItem.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import { Alignment, Color, IconSize } from '@/ui/enums';
  import { IconComment, IconReply, IconStar } from '@/ui/icons';
  import { delay } from '@/ui/utils/delay';

  import PhotoSlider from '@/lib/components/PhotoSlider.svelte';

  export let queryResult: UseInfiniteQueryStoreResult<mastodon.v1.Status[], Error, mastodon.v1.Status[], QueryKey>;

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
</script>

{#if $queryResult.status === 'loading'}
  <Typography align="center">Loading...</Typography>
{:else if $queryResult.status === 'error'}
  <Typography align="center">Error!</Typography>
{:else}
  {#each $queryResult.data.pages as page, i}
    {#each page as status, j}
      {#if status.visibility === 'public'}
        {@const { seralized, links } = parseHtml(status.content)}
        <ListItem
          imageUrl={status.account.avatarStatic}
          align={Alignment.Top}
          titleText={status.account.displayName}
          navi={{ itemId: `STATUS-${i + 1}-${j + 1}`, onSelect: () => {} }}
          contextMenu={{
            title: `${status.account.displayName}'s Status`,
            items: [
              {
                label: links[0],
                workingLabel: 'Opening URL...',
                onSelect: async () => {
                  if (links[0]) {
                    // TODO: Update KaiOS lib to support this type
                    // @ts-ignore: next line
                    const view = new WebActivity('view', {
                      type: 'url',
                      url: links[0],
                    });
                    view.start();
                    await delay(1000);
                  }
                },
              },
              {
                label: `🙆‍♂️ ${status.account.acct}`,
                onSelect: () => console.log('context menu item 3'),
              },
            ],
          }}
        >
          <svelte:fragment slot="subtitle">
            {status.account.acct} &bull <Time relative timestamp={status.createdAt} />
          </svelte:fragment>
          <div class="status-content" slot="content">
            {@html seralized}
          </div>
          <div slot="bottom">
            {#if status.mediaAttachments.length > 0}
              <PhotoSlider photos={status.mediaAttachments} />
            {/if}
            <section class="stats">
              <div class="item">
                <Icon size={IconSize.Smallest} color={Color.Secondary}><IconReply /></Icon>
                <span>{status.reblogsCount}</span>
              </div>
              <div class="item">
                <Icon size={IconSize.Smallest} color={Color.Secondary}><IconStar /></Icon>
                <span>{status.favouritesCount}</span>
              </div>
              <div class="item">
                <Icon size={IconSize.Smallest} color={Color.Secondary}><IconComment /></Icon>
                <span>{status.repliesCount}</span>
              </div>
            </section>
          </div>
        </ListItem>
      {/if}
    {/each}
  {/each}
  <Button
    title="Load more"
    navi={{
      itemId: 'STATUS_LOAD_MORE',
      onSelect: () => $queryResult.fetchNextPage(),
    }}
  />
{/if}

<style global lang="postcss">
  .status-content > p:not(:first-child) {
    @apply mt-2;
  }
</style>
