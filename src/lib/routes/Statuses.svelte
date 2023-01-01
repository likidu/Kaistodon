<script lang="ts">
  import * as domUtils from 'domutils';
  import { parseDocument } from 'htmlparser2';
  import Time from 'svelte-time';

  import Icon from '@/ui/components/icon/Icon.svelte';
  import ListItem from '@/ui/components/list/ListItem.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import { Alignment, Color, IconSize } from '@/ui/enums';
  import { IconComment, IconReply, IconStar } from '@/ui/icons';
  import { delay } from '@/ui/utils/delay';

  import PhotoSlider from '@/lib/components/PhotoSlider.svelte';
  import { useTrendStatus } from '../services';

  const statuses = useTrendStatus();

  function parseHtml(html: string): string {
    const dom = parseDocument(html);
    const links = domUtils.getElementsByTagName('a', dom);
    let result: string;
    links.forEach((link) => {
      console.log(link.attribs.href);
      result = link.attribs.href;
    });
    return result;
  }
</script>

{#if $statuses.status === 'loading'}
  <Typography align="center">Loading...</Typography>
{:else if $statuses.status === 'error'}
  <Typography align="center">Error!</Typography>
{:else}
  {@const statuses = $statuses.data}
  {console.log(statuses)}
  {#each statuses as status, i}
    {#if status.visibility === 'public'}
      {@const link = parseHtml(status.content)}
      <ListItem
        imageUrl={status.account.avatarStatic}
        align={Alignment.Top}
        titleText={status.account.displayName}
        navi={{ itemId: `STATUS-${i + 1}`, onSelect: () => {} }}
        contextMenu={{
          title: `Primary Text ${i + 1}`,
          items: [
            {
              label: link,
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
          {@html status.content}
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
{/if}
