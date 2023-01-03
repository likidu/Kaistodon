<script lang="ts">
  import { Query } from '@sveltestack/svelte-query';
  import Time from 'svelte-time';

  import Button from '@/ui/components/buttons/Button.svelte';
  import Icon from '@/ui/components/icon/Icon.svelte';
  import ListItem from '@/ui/components/list/ListItem.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import { Alignment, Color, IconSize } from '@/ui/enums';
  import { IconComment, IconReply, IconStar } from '@/ui/icons';
  import { delay } from '@/ui/utils/delay';

  import PhotoSlider from '@/lib/components/PhotoSlider.svelte';
  import { client } from '@/lib/services';

  let next = false;

  async function getStatuses(next: boolean) {
    console.log('triggered, next is', next);
    const page = client.v1.trends.listStatuses({
      limit: 5,
    });
    if (!next) {
      return await page;
    } else {
      const { value } = await page.next();
      return value;
    }
  }

  function parseHtml(html: string): { seralized: string; links: string[] } {
    let links = [];

    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');

    const ellipsisLinks = dom.querySelectorAll('span.ellipsis');
    if (ellipsisLinks.length > 0) {
      ellipsisLinks.forEach((link) => {
        const a = link.parentElement;
        // Push href to array for displaying in context menu
        links.push(a.attributes['href'].value);
        // Stylize the link
        const linkElem = link as HTMLElement;
        linkElem.innerText += '...';
        linkElem.style.color = 'var(--accent-color)';
        // Replace the a tag with span.ellipsis
        a.replaceWith(link);
      });
    }
    // Convert dom back to string
    const seralized = dom.getElementsByTagName('body')[0].innerHTML;
    return { seralized, links };
  }
</script>

<Query
  options={{
    queryKey: ['trend-status', next],
    queryFn: () => getStatuses(next),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  }}
>
  <svelte:fragment slot="query" let:queryResult>
    {#if queryResult.status === 'loading'}
      <Typography align="center">Loading...</Typography>
    {:else if queryResult.status === 'error'}
      <Typography align="center">Error!</Typography>
    {:else}
      {@const statuses = queryResult.data}
      {#each statuses as status, i}
        {#if status.visibility === 'public'}
          {@const { seralized, links } = parseHtml(status.content)}
          <ListItem
            imageUrl={status.account.avatarStatic}
            align={Alignment.Top}
            titleText={status.account.displayName}
            navi={{ itemId: `STATUS-${i + 1}`, onSelect: () => {} }}
            contextMenu={{
              title: `Primary Text ${i + 1}`,
              items: [
                {
                  label: links[0],
                  workingLabel: 'Working...',
                  onSelect: async () => {
                    console.log('context menu item 1');
                    await delay(1000);
                  },
                },
                {
                  label: 'Context Menu Item 3',
                  onSelect: () => console.log('context menu item 3'),
                },
              ],
            }}
          >
            <svelte:fragment slot="subtitle">
              {status.account.acct} &bull <Time relative timestamp={status.createdAt} />
            </svelte:fragment>
            <div slot="content">
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
      <Button
        title="Load more"
        navi={{
          itemId: 'STATUS_LOAD_MORE',
          onSelect: () => {
            next = true;
          },
        }}
      />
    {/if}
  </svelte:fragment>
</Query>
